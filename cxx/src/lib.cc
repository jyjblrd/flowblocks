#include "lib.hh"
#include "micropython_blocks.hh"

#include <emscripten/bind.h>
#include "emscripten_extensions.hh"

#include <set>
#include <deque>
#include <optional>

auto compile(std::map<std::string, Vertex> const &vertices) -> std::string {
	using std::deque;
	using std::map;
	using std::set;
	using std::string;
	using std::tuple;
	using std::vector;

	string code {"import machine\n"};

	map<string, map<string, vector<Dependency>>> id_to_output_to_successor_id_input {};
	map<string, vector<tuple<string, Vertex>>> successors {};
	map<string, size_t> degree {};

	for (auto const &[id, vertex] : vertices) {
		for (auto const &[input, predecessor_output] : vertex.predecessors) {
			id_to_output_to_successor_id_input[predecessor_output.id][predecessor_output.handle].push_back(Dependency {id, input});
			successors[predecessor_output.id].emplace_back(id, vertex);
			++degree[id];
		}
	}

	deque<tuple<string, Vertex>> upcoming_vertices {};
	vector<string> nonsuccessor_ids {};

	for (auto const &[id, vertex] : vertices) {
		if (!degree.contains(id)) {
			upcoming_vertices.emplace_back(id, vertex);
			nonsuccessor_ids.push_back(id);
		}
	}

	set<string> visited_ids {};
	vector<tuple<string, Vertex>> sorted_vertices {};
	set<string> vertex_kinds {};

	while (!upcoming_vertices.empty()) {
		auto const &[id, vertex] = upcoming_vertices.front();
		visited_ids.insert(id);
		vertex_kinds.insert(vertex.kind);
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

	map<string, VertexKind> parsed_kinds;

	for (auto const &kind_str : vertex_kinds) {
		if (auto const kind = parse_kind(kind_str); kind) {
			parsed_kinds[kind_str] = *kind;
			code.append(block_class_definition(*kind));
		}
	}

	for (auto it = sorted_vertices.rbegin(); it != sorted_vertices.rend(); ++it) {
		auto const &[id, vertex] = *it;
		code.append(block_initialization(parsed_kinds[vertex.kind], id, id_to_output_to_successor_id_input[id]));
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
	emscripten::value_object<Vertex>("Vertex")
		.field("node_id", &Vertex::kind)
		.field("connections", &Vertex::predecessors);
	emscripten::function("compile", &compile);
}
