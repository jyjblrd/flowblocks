#include "lib.hh"
#include "micropython_blocks.hh"

#include <emscripten/bind.h>
#include "emscripten_extensions.hh"

#include <set>
#include <deque>
#include <optional>

// Topologically sorts the graph; returns nullopt if graph is ill-formed.
auto process_graph(std::map<std::string, Node> const &id_to_node) -> std::optional<SortedGraph> {
	if (id_to_node.empty())
		return {}; // "# Empty graph"; // TODO: actual error handling

	SortedGraph graph {};
	std::map<std::string, std::size_t> id_to_unprocessed_predecessors {};

	for (auto const &[id, node] : id_to_node) {
		// FIXME: Ensure node types are not in error.
		auto const node_type = parse_node_type(node.type_str).value();
		graph.id_to_node[id].type = node_type;
		for (auto const &[input, predecessor] : node.input_to_predecessor) {
			// FIXME: Ensure node types are not in error.
			auto input_type = get_input_type(node_type, input);
			auto output_type = get_output_type(parse_node_type(id_to_node.at(predecessor.id).type_str).value(), predecessor.output);
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
		if (id_to_unprocessed_predecessors[id] != expected_indegree(parse_node_type(node.type_str).value())) {
			return {}; // "# Missing input(s)"; // TODO: actual error handling
		}
	}

	std::unordered_set<std::string> visited_ids {};

	while (!nodes_for_processing.empty()) {
		auto const id = nodes_for_processing.front();
		visited_ids.insert(id);
		if (auto const node_type = parse_node_type(id_to_node.at(id).type_str); node_type)
			graph.node_types.insert(*node_type);
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

auto compile(std::map<std::string, Node> const &id_to_node) -> std::string {
	using std::deque;
	using std::map;
	using std::string;
	using std::tuple;
	using std::unordered_set;
	using std::vector;

	auto const graph = process_graph(id_to_node);

	if (!graph)
		return ""; // TODO - Reapply error message

	string code {"import machine\n"};

	for (auto const &node_type : (*graph).node_types)
		code.append(block_class_definition(node_type));

	for (auto it = (*graph).argsorted_ids.rbegin(); it != (*graph).argsorted_ids.rend(); ++it) {
		auto const &id = *it;
		code.append(block_initialization((*graph).id_to_node.at(id).type, id, (*graph).id_to_node.at(id).output_to_successors));
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
	emscripten::value_object<Predecessor>("Dependency")
		.field("connectedNodeId", &Predecessor::id)
		.field("connectedNodeOutputId", &Predecessor::output); // TODO unify naming
	emscripten::value_object<Node>("Vertex")
		.field("nodeTypeId", &Node::type_str)
		.field("connections", &Node::input_to_predecessor);
	emscripten::function("compile", &compile);
}
