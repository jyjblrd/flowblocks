#include "lib.hh"

#include <emscripten/bind.h>
#include "emscripten_extensions.hh"

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
		for (auto const &[input, dep] : vertex.connections) {
			output
				.append("    ")
				.append(input)
				.append(" <- ")
				.append(dep.id)
				.append(".")
				.append(dep.output)
				.append("\n");
		}
	}
	return output;
}

EMSCRIPTEN_BINDINGS(module) {
	emscripten::value_object<Dependency>("Dependency")
		.field("id", &Dependency::id)
		.field("output", &Dependency::output);
	emscripten::value_object<Vertex>("Vertex")
		.field("kind", &Vertex::kind)
		.field("connections", &Vertex::connections);
	emscripten::function("greet", &greet);
	emscripten::function("echo", &echo);
}