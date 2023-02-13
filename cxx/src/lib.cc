#include "lib.hh"
#include "micropython_blocks.hh"

#include <emscripten/bind.h>
#include "emscripten_extensions.hh"

#include <set>
#include <deque>
#include <optional>

auto compile(std::map<std::string, Node> const &vertices) -> std::string {
	using std::deque;
	using std::map;
	using std::set;
	using std::string;
	using std::tuple;
	using std::vector;

	if (vertices.empty()) {
		return "# Empty graph"; // TODO: actual error handling
	}

	string code {"import machine\n"};

	map<string, map<string, vector<Dependency>>> id_to_output_to_successor_id_input {};
	map<string, vector<tuple<string, Node>>> successors {};
	map<string, std::size_t> degree {};

	for (auto const &[id, vertex] : vertices) {
		for (auto const &[input, predecessor_output] : vertex.predecessors) {
			auto input_type = get_input_type(parse_node_type(vertex.node_type).value(), input);
			auto output_type = get_output_type(parse_node_type(vertices.at(predecessor_output.id).node_type).value(), predecessor_output.handle);
			if (!input_type || !output_type || *input_type != *output_type) {
				return "# Type checking failed"; // TODO: actual error handling
			}
			id_to_output_to_successor_id_input[predecessor_output.id][predecessor_output.handle].push_back(Dependency {id, input});
			successors[predecessor_output.id].emplace_back(id, vertex);
			++degree[id];
		}
	}

	deque<tuple<string, Node>> upcoming_vertices {};
	vector<string> nonsuccessor_ids {};

	for (auto const &[id, vertex] : vertices) {
		if (!degree.contains(id)) {
			upcoming_vertices.emplace_back(id, vertex);
			nonsuccessor_ids.push_back(id);
		}
		if (degree[id] != expected_indegree(parse_node_type(vertex.node_type).value())) {
			return "# Missing input(s)"; // TODO: actual error handling
		}
	}

	set<string> visited_ids {};
	vector<tuple<string, Node>> sorted_vertices {};
	set<string> node_types {}; // only for generating class definitions

	while (!upcoming_vertices.empty()) {
		auto const &[id, vertex] = upcoming_vertices.front();
		visited_ids.insert(id);
		node_types.insert(vertex.node_type);
		sorted_vertices.emplace_back(id, vertex);
		upcoming_vertices.pop_front();
		for (auto const &[s_id, successor] : successors[id]) {
			if (!visited_ids.contains(s_id)) {
				if (degree[s_id] == 1) {
					upcoming_vertices.emplace_back(s_id, successor);
				} else {
					degree[s_id] -= 1;
				}
			} else {
				// FIXME: check for loops
			}
		}
	}

	map<string, NodeType> parsed_node_types;

	for (auto const &node_type_str : node_types) {
		if (auto const node_type = parse_node_type(node_type_str); node_type) {
			parsed_node_types[node_type_str] = *node_type;
			code.append(block_class_definition(*node_type));
		}
	}

	for (auto it = sorted_vertices.rbegin(); it != sorted_vertices.rend(); ++it) {
		auto const &[id, vertex] = *it;
		code.append(block_initialization(parsed_node_types[vertex.node_type], id, id_to_output_to_successor_id_input[id]));
	}

	code.append("while True:\n");

	for (auto const &id : nonsuccessor_ids) {
		code
			.append("    a")
			.append(id)
			.append(".query()\n");
	}
	return code;
}

EMSCRIPTEN_BINDINGS(module) {
	emscripten::value_object<Dependency>("Dependency")
		.field("connected_node_id", &Dependency::id)
		.field("connected_node_output_id", &Dependency::handle); // TODO unify naming
	emscripten::value_object<Node>("Vertex")
		.field("node_id", &Node::node_type)
		.field("connections", &Node::predecessors);
	emscripten::function("compile", &compile);
}
