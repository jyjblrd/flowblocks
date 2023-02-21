#include "lib.hh"
#include "micropython_blocks.hh"

#include <emscripten/bind.h>
#include "emscripten_extensions.hh"

#include <deque>
#include <optional>

auto process_node_defs(std::map<std::string, marshalling::NodeType> const &definitions) -> std::optional<NodeDefinitions> {
	NodeDefinitions defs {};

	for (auto const &[name, marshalled_node_type] : definitions) {
		NodeType tmp {name, marshalled_node_type};

		// TODO: validate code for block implementations ?
		// TODO: ensure that code blocks names are unique

		defs.insert_type(std::move(tmp));
	}

	return {defs};
}

// Topologically sorts the graph; returns nullopt if graph is ill-formed.
auto process_graph(std::map<std::string, marshalling::Node> const &id_to_node, NodeDefinitions &defs) -> std::optional<SortedGraph> {
	if (id_to_node.empty())
		return {}; // "# Empty graph"; // TODO: actual error handling

	SortedGraph graph {};
	std::map<std::string, std::size_t> id_to_unprocessed_predecessors {};

	for (auto const &[id, node] : id_to_node) {
		// FIXME: Ensure node types are not in error.
		auto const node_type_idx = defs.parse_node_type_as_index(node.type_str);

		if (!node_type_idx)
			return {}; // error: node_instance references non-existent node_type // TODO: add error handling

		graph.id_to_node[id].node_type_index = *node_type_idx;
		auto &node_type {defs.get_node_type(graph.id_to_node[id])};

		// Mark NodeType as used to ensure that block class is emitted
		// TODO: maybe move elsewhere as optimisation strategy
		node_type.mark_used();

		for (auto const &[input, predecessor] : node.input_to_predecessor) {
			// FIXME: Ensure node types are not in error.
			auto input_type = node_type.get_input_type(input);
			auto output_type = defs.node_type_from_string(id_to_node.at(predecessor.id).type_str).value().get().get_output_type(predecessor.output);
			if (!input_type || !output_type || *input_type != *output_type)
				return {}; // "# Type checking failed"; // TODO: actual error handling
			graph.id_to_node[predecessor.id].output_to_successors[predecessor.output].insert(Successor {id, input});
			++id_to_unprocessed_predecessors[id];
		}
	}

	std::deque<std::string> nodes_for_processing {};

	for (auto const &[id, node] : id_to_node) {
		// Enqueue nodes for processing if they have no predecessors.
		if (!id_to_unprocessed_predecessors.contains(id)) {
			nodes_for_processing.emplace_back(id);
			graph.nonsuccessor_ids.push_back(id);
		}

		// Ensure nodes have the expected amount of predecessors.
		if (id_to_unprocessed_predecessors[id] != defs.node_type_from_string(node.type_str).value().get().expected_in_degree()) {
			return {}; // "# Missing input(s)"; // TODO: actual error handling
		}
	}

	std::unordered_set<std::string> visited_ids {};

	while (!nodes_for_processing.empty()) {
		auto const id = nodes_for_processing.front();
		visited_ids.insert(id);
		//		if (auto const node_type = parse_node_type(id_to_node.at(id).type_str); node_type)
		//			graph.node_types.insert(*node_type); // Is this still needed?
		graph.argsorted_ids.emplace_back(id);
		nodes_for_processing.pop_front();

		for (auto const &[output, successors] : graph.id_to_node[id].output_to_successors) {
			for (auto const &successor : successors) {
				if (!visited_ids.contains(successor.id)) {
					if (id_to_unprocessed_predecessors[successor.id] == 1) {
						nodes_for_processing.emplace_back(successor.id);
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
	-> std::string {
	using std::deque;
	using std::map;
	using std::string;
	using std::tuple;
	using std::unordered_set;
	using std::vector;

	auto node_defs = process_node_defs(node_types);

	if (!node_defs)
		return "";

	auto const graph = process_graph(id_to_node, *node_defs);

	if (!graph)
		return ""; // TODO - Reapply error message

	string code {"import machine\n"};

	// add block class definitions to code
	node_defs->emit_block_definitions(code);

	// add instances of block classes to code
	for (auto it = graph->argsorted_ids.rbegin(); it != graph->argsorted_ids.rend(); ++it) {
		auto const &id = *it;
		code.append(block_initialization(node_defs->get_node_type(graph->id_to_node.at(id)).get_name(),
			id, graph->id_to_node.at(id).output_to_successors));
		// TODO: improve production of block initializers; also add attributes
	}

	code.append("while True:\n");

	for (auto const &id : (*graph).nonsuccessor_ids) {
		code
			.append("    a")
			.append(id)
			.append(".query()\n");
	}
	return code;
}

EMSCRIPTEN_BINDINGS(module) {

	// bindings for enums
	// not sure if this is the best way to do this, but if it works...

	emscripten::enum_<AttributeTypes>("AttributeTypes")
		.value("PinInNum", AttributeTypes::PinInNum)
		.value("PinOutNum", AttributeTypes::PinOutNum);

	emscripten::enum_<ConnectionType>("ConnectionType")
		.value("Bool", ConnectionType::Bool)
		.value("Number", ConnectionType::Integer); // TODO: unify naming

	// TODO: extend above 2 bindings if necessary

	// bindings for Node:

	emscripten::value_object<marshalling::Predecessor>("Predecessor")
		.field("connectedNodeId", &marshalling::Predecessor::id)
		.field("connectedNodeOutputId", &marshalling::Predecessor::output); // TODO unify naming

	emscripten::value_object<marshalling::Node>("NodeInstance")
		.field("nodeTypeId", &marshalling::Node::type_str)
		.field("connections", &marshalling::Node::input_to_predecessor);

	// bindings for NodeType

	emscripten::value_object<marshalling::NodeType::ConnectionEntry>("NodeConnectionInfo")
		.field("name", &marshalling::NodeType::ConnectionEntry::name)
		.field("type", &marshalling::NodeType::ConnectionEntry::type);

	emscripten::value_object<marshalling::NodeType::CodeDef>("NodeCodeDefinition")
		.field("init", &marshalling::NodeType::CodeDef::init)
		.field("update", &marshalling::NodeType::CodeDef::update)
		.field("isQuery", &marshalling::NodeType::CodeDef::is_query);

	emscripten::value_object<marshalling::NodeType::AttributeType>("AttributeTypeStruct")
		.field("type", &marshalling::NodeType::AttributeType::type);

	emscripten::value_object<marshalling::NodeType>("NodeType")
		//        .field("description", &marshalling::NodeType::description)
		.field("attributes", &marshalling::NodeType::attributes)
		.field("inputs", &marshalling::NodeType::inputs)
		.field("outputs", &marshalling::NodeType::outputs)
		.field("code", &marshalling::NodeType::code);

	emscripten::function("compile", &compile);
}
