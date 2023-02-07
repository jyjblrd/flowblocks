#pragma once

#include <string>
#include <map>
#include <optional>
#include <vector>
#include "lib.hh"

enum class VertexKind {
	DigitalPinInPullDown,
	Conjunction,
	DigitalPinOut,
};

auto parse_kind(std::string_view const kind_str) -> std::optional<VertexKind> {
	using std::operator""sv;
	using std::make_optional;
	using std::nullopt;

	if (false) {
	} else if (kind_str == "DigitalPinInPullDown"sv) {
		return make_optional(VertexKind::DigitalPinInPullDown);
	} else if (kind_str == "Conjunction"sv) {
		return make_optional(VertexKind::Conjunction);
	} else if (kind_str == "DigitalPinOut"sv) {
		return make_optional(VertexKind::DigitalPinOut);
	}

	return {};
}

constexpr auto block_class_definition(VertexKind kind) -> std::string {
	std::string snippet;
	switch (kind) {
	case VertexKind::DigitalPinInPullDown:
		snippet =
			"class DigitalPinInPullDown:\n"
			"    def __init__(self, successors):\n"
			"        self.led = machine.Pin(14, machine.Pin.IN, machine.Pin.PULL_DOWN)\n"
			"        self.successors = successors\n"
			"\n"
			"    def query(self):\n"
			"        output_value = True if self.led.value() else False\n"
			"        for successor in self.successors['output']:\n"
			"            successor['vertex'].update(successor['input'], output_value)\n";
		break;
	case VertexKind::Conjunction:
		snippet =
			"class Conjunction:\n"
			"    def __init__(self, successors):\n"
			"        self.left = False\n"
			"        self.right = False\n"
			"        self.successors = successors\n"
			"\n"
			"    def update(self, input, value):\n"
			"        if input == 'left':\n"
			"            self.left = value\n"
			"        elif input == 'right':\n"
			"            self.right = value\n"
			"        output_value = True if self.left and self.right else False\n"
			"        for successor in self.successors['output']:\n"
			"            successor['vertex'].update(successor['input'], output_value)\n";
		break;
	case VertexKind::DigitalPinOut:
		snippet =
			"class DigitalPinOut:\n"
			"    def __init__(self, successors):\n"
			"        self.led = machine.Pin(25, machine.Pin.OUT)\n"
			"\n"
			"    def update(self, input, value):\n"
			"        self.led.value(1 if value else 0)\n";
		break;
	default:
		// This should never occur!
		snippet = "";
	}
	return snippet;
}

auto block_initialization(VertexKind kind, std::string id, std::map<std::string, std::vector<Dependency>> successors) -> std::string {
	std::string snippet {};
	switch (kind) {
	case VertexKind::DigitalPinInPullDown:
		snippet = "DigitalPinInPullDown";
		break;
	case VertexKind::Conjunction:
		snippet = "Conjunction";
		break;
	case VertexKind::DigitalPinOut:
		snippet = "DigitalPinOut";
		break;
	default:
		// This should never occur!
		snippet = "";
	}

	snippet = "a" + id + " = " + snippet + "({";
	for (auto const &[output, dependencies] : successors) {
		snippet += "'" + output + "' : [";
		for (auto const &dependency : dependencies) {
			snippet += "{'vertex' : a" + dependency.id + ", 'input' : '" + dependency.handle + "'}";
		}
		snippet += "], ";
	}

	snippet += "})\n";
	return snippet;
}