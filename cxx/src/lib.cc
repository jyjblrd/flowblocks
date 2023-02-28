#include "lib.hh"

#include <emscripten/bind.h>

#include "emscripten_extensions.hh"

#include <deque>
#include <optional>

#include <iostream>

auto process_node_defs(std::map<std::string, marshalling::NodeType> const &definitions, std::string &error) -> std::optional<NodeDefinitions> {
	NodeDefinitions defs {};

	for (auto const &[name, marshalled_node_type] : definitions) {

		// basically everything happens in the constructor at the moment
		NodeType tmp {name, marshalled_node_type};

		// TODO: validate code for block implementations ?

		defs.insert_type(std::move(tmp));
	}

	return {defs};
}

// Topologically sorts the graph; returns nullopt if graph is ill-formed.
auto process_graph(std::map<std::string, marshalling::Node> const &id_to_node, NodeDefinitions &defs, std::string &error) -> std::optional<SortedGraph> {
	if (id_to_node.empty()) {
		error = "Error: Empty Graph\n";
		return {};
	}

	SortedGraph graph {};
	std::map<std::string, std::size_t> id_to_unprocessed_predecessors {};

	for (auto const &[id, node] : id_to_node) {
		// FIXME: Ensure node types are not in error.
		auto const node_type_idx = defs.parse_node_type_as_index(node.type_str);

		if (!node_type_idx) {
			error = "Error: Graph References Non-existent Node Type\n";
			return {};
		}

		graph.id_to_node[id].node_type_index = *node_type_idx;

		// currently copying without error checking, etc // TODO: improve this
		graph.id_to_node[id].attributes = node.attributes;

		auto &node_type {defs.get_node_type(graph.id_to_node[id])};

		// Mark NodeType as used to ensure that block class is emitted
		// TODO: maybe move elsewhere as optimisation strategy
		node_type.mark_used();

		for (auto const &[input, predecessor] : node.input_to_predecessor) {
			// FIXME: Ensure node types are not in error.
			auto input_type = node_type.get_input_type(input);
			auto output_type = defs.node_type_from_string(id_to_node.at(predecessor.id).type_str).value().get().get_output_type(predecessor.output);
			if (!input_type || !output_type || *input_type != *output_type || *input_type == ConnectionType::Invalid) {
				error = "Error: Type checking failed\n";
				return {};
			}
			graph.id_to_node[predecessor.id].output_to_successors[predecessor.output].insert(Successor {id, input});
			++id_to_unprocessed_predecessors[id];
		}
	}

	std::deque<std::string> nodes_for_processing {};

	for (auto const &[id, node] : id_to_node) {
		// Enqueue nodes for processing if they have no predecessors.
		if (!id_to_unprocessed_predecessors.contains(id)) {
			nodes_for_processing.push_back(id);
			graph.nonsuccessor_ids.push_back(id);
		}

		// Ensure nodes have the expected amount of predecessors.
		if (id_to_unprocessed_predecessors[id] != defs.node_type_from_string(node.type_str).value().get().expected_in_degree()) {
			error = "Error: Missing inputs\n";
			return {};
		}
	}

	std::unordered_set<std::string> visited_ids {};

	while (!nodes_for_processing.empty()) {
		auto const id = nodes_for_processing.front();
		visited_ids.insert(id);
		//		if (auto const node_type = parse_node_type(id_to_node.at(id).type_str); node_type)
		//			graph.node_types.insert(*node_type); // Is this still needed?
		graph.argsorted_ids.push_back(id);
		nodes_for_processing.pop_front();

		for (auto const &[output, successors] : graph.id_to_node[id].output_to_successors) {
			for (auto const &successor : successors) {
				if (!visited_ids.contains(successor.id)) {
					if (id_to_unprocessed_predecessors[successor.id] == 1) {
						nodes_for_processing.push_back(successor.id);
					} else {
						id_to_unprocessed_predecessors[successor.id] -= 1;
					}
				} else {
					// FIXME: check for loops
				}
			}
		}
	}

	return {graph};
}

auto compile(std::map<std::string, marshalling::Node> const &id_to_node,
	std::map<std::string, marshalling::NodeType> const &node_types)
	-> marshalling::CompileResult {
	using marshalling::CompileResult;
	using std::deque;
	using std::map;
	using std::string;
	using std::tuple;
	using std::unordered_set;
	using std::vector;

	std::string error;

	auto node_defs = process_node_defs(node_types, error);

	if (!node_defs)
		return {CompileResult::Err, error};

	auto const graph = process_graph(id_to_node, *node_defs, error);

	if (!graph)
		return {CompileResult::Err, error};

	string code {"import machine\n"};

	// add block class definitions to code
	node_defs->emit_block_definitions(code);

	// add instances of block classes to code
	for (auto it = graph->argsorted_ids.rbegin(); it != graph->argsorted_ids.rend(); ++it) {
		auto const &id = *it;
		node_defs->get_node_type(graph->id_to_node.at(id)).emit_block_instantiation(code, graph->id_to_node.at(id), id);
	}

	code.append("while True:\n");

	for (auto const &id : graph->nonsuccessor_ids) {
		code
			.append("    a")
			.append(id)
			.append(".query()\n");
	}
	return {CompileResult::Ok, code};
}

EMSCRIPTEN_BINDINGS(module) {

	// bindings for enums
	// not sure if this is the best way to do this, but if it works... UPDATE: IT DOESNT WORK

	//	emscripten::enum_<AttributeType>("AttributeTypes")
	//		.value("PinInNum", AttributeType::PinInNum)
	//		.value("PinOutNum", AttributeType::PinOutNum)
	//		.value("Bool", AttributeType::Bool)
	//		.value("Number", AttributeType::Number);
	//
	//	emscripten::enum_<ConnectionType>("ConnectionType")
	//		.value("Bool", ConnectionType::Bool)
	//		.value("Number", ConnectionType::Number); // TODO: unify naming

	// TODO: extend above 2 bindings if necessary

	// bindings for Node:

	emscripten::value_object<marshalling::Predecessor>("Predecessor")
		.field("connectedNodeId", &marshalling::Predecessor::id)
		.field("connectedNodeOutputId", &marshalling::Predecessor::output); // TODO unify naming

	emscripten::value_object<marshalling::Node>("NodeInstance")
		.field("nodeTypeId", &marshalling::Node::type_str)
		.field("connections", &marshalling::Node::input_to_predecessor)
		.field("attributes", &marshalling::Node::attributes);

	// bindings for NodeType

	emscripten::value_object<marshalling::NodeType::ConnectionEntry>("NodeConnectionInfo")
		.field("name", &marshalling::NodeType::ConnectionEntry::name)
		.field("type", &marshalling::NodeType::ConnectionEntry::type);

	emscripten::value_object<marshalling::NodeType::CodeDef>("NodeCodeDefinition")
		.field("init", &marshalling::NodeType::CodeDef::init)
		.field("update", &marshalling::NodeType::CodeDef::update)
		.field("isQuery", &marshalling::NodeType::CodeDef::is_query);

	emscripten::value_object<marshalling::NodeType::AttributeTypeStruct>("AttributeTypeStruct")
		.field("type", &marshalling::NodeType::AttributeTypeStruct::type);

	emscripten::value_object<marshalling::NodeType>("NodeType")
		//        .field("description", &marshalling::NodeType::description)
		.field("attributes", &marshalling::NodeType::attributes)
		.field("inputs", &marshalling::NodeType::inputs)
		.field("outputs", &marshalling::NodeType::outputs)
		.field("code", &marshalling::NodeType::code);

	emscripten::class_<marshalling::CompileResult>("CompileResult")
		.function("ok", &marshalling::CompileResult::ok)
		.function("code", &marshalling::CompileResult::code)
		.function("error", &marshalling::CompileResult::error);

	emscripten::function("compile", &compile);
}
