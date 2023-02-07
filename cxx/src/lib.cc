#include "lib.hh"
#include "micropython_blocks.hh"

#include <emscripten/bind.h>
#include "emscripten_extensions.hh"

#include <set>
#include <deque>
#include <optional>

auto greet(std::string const &input) noexcept -> std::string {
	std::string output {"Salut, "};
	output.append(input);
	output.append("! ~C++");
	return output;
}

auto echo(std::map<std::string, Vertex> const &vertices) -> std::string {
	std::string output {};
	for (auto const &[id, vertex] : vertices) {
		output
			.append(id)
			.append(", ")
			.append(vertex.kind)
			.append(":\n");
		for (auto const &[input, dep] : vertex.predecessors) {
			output
				.append("    ")
				.append(input)
				.append(" <- ")
				.append(dep.id)
				.append(".")
				.append(dep.handle)
				.append("\n");
		}
	}
	return output;
}

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
	set<string> vertex_kinds {};

	for (auto const &[id, vertex] : vertices) {
		for (auto const &[input, predecessor_output] : vertex.predecessors) {
			id_to_output_to_successor_id_input.try_emplace(predecessor_output.id);
			id_to_output_to_successor_id_input[predecessor_output.id].try_emplace(predecessor_output.handle);
			id_to_output_to_successor_id_input[predecessor_output.id][predecessor_output.handle].push_back(Dependency {id, input});
			if (!successors.contains(predecessor_output.id)) {
				successors[predecessor_output.id] = vector {tuple {id, vertex}};
			} else {
				successors[predecessor_output.id].emplace_back(tuple {id, vertex});
			}
			if (!degree.contains(id)) {
				degree[id] = 1;
			} else {
				degree[id] += 1;
			}
		}
	}

	deque<tuple<string, Vertex>> upcoming_vertices {};
	vector<string> nonsuccessor_ids {};

	for (auto const &[id, vertex] : vertices) {
		if (!degree.contains(id)) {
			upcoming_vertices.emplace_back(tuple {id, vertex});
			nonsuccessor_ids.push_back(id);
		}
	}

	set<string> visited_ids {};
	vector<tuple<string, Vertex>> sorted_vertices {};

	while (!upcoming_vertices.empty()) {
		auto const &[id, vertex] = upcoming_vertices.front();
		visited_ids.insert(id);
		vertex_kinds.insert(vertex.kind);
		sorted_vertices.emplace_back(tuple {id, vertex});
		upcoming_vertices.pop_front();
		for (auto const &[s_id, successor] : successors[id]) {
			if (!visited_ids.contains(s_id)) {
				if (degree[s_id] == 1) {
					upcoming_vertices.emplace_back(tuple {s_id, successor});
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
		id_to_output_to_successor_id_input.try_emplace(id);
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
		.field("id", &Dependency::id)
		.field("output", &Dependency::handle); // TODO unify naming
	emscripten::value_object<Vertex>("Vertex")
		.field("kind", &Vertex::kind)
		.field("predecessors", &Vertex::predecessors);
	emscripten::function("greet", &greet);
	emscripten::function("echo", &echo);
	emscripten::function("compile", &compile);
}