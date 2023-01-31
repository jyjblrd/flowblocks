#include <emscripten/bind.h>

auto greet(std::string const &input) noexcept -> std::string {
	std::string output {"Salut, "};
	output.append(input);
	output.append("! ~C++");
	return output;
}

EMSCRIPTEN_BINDINGS(module) {
	emscripten::function("greet", &greet);
}