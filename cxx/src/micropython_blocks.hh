#pragma once

#include <string>
#include <map>
#include <vector>
#include "lib.hh"

#include <string_view>

#include <emscripten/bind.h>

auto block_class_definition(NodeType kind) -> std::string {
	using std::operator""sv;
	std::string snippet;
	switch (kind) {
	case NodeType::DigitalPinInPullDown:
		snippet = R"...(
class DigitalPinInPullDown:
    def __init__(self, successors):
        self.led = machine.Pin(14, machine.Pin.IN, machine.Pin.PULL_DOWN)
        self.successors = successors

    def query(self):
        output_value = True if self.led.value() else False
        for successor in self.successors['output']:
            successor['vertex'].update(successor['input'], output_value)
)..."sv.substr(1);
	break;
	case NodeType::Conjunction:
		snippet = R"...(
class Conjunction:
    def __init__(self, successors):
        self.left = False
        self.right = False
        self.successors = successors

    def update(self, input, value):
        if input == 'left':
            self.left = value
        elif input == 'right':
            self.right = value
        output_value = True if self.left and self.right else False
        for successor in self.successors['output']:
            successor['vertex'].update(successor['input'], output_value)
)..."sv.substr(1);
		break;
	case NodeType::DigitalPinOut:
		snippet = R"...(
class DigitalPinOut:
    def __init__(self, successors):
        self.led = machine.Pin(25, machine.Pin.OUT)

    def update(self, input, value):
        self.led.value(1 if value else 0)
)..."sv.substr(1);
		break;
	default:
		// This should never occur!
		snippet = "";
	}
	return snippet;
}

auto block_initialization(NodeType kind, std::string id, std::map<std::string, std::vector<Dependency>> successors) -> std::string {
	std::string snippet {};
	switch (kind) {
	case NodeType::DigitalPinInPullDown:
		snippet = "DigitalPinInPullDown";
		break;
	case NodeType::Conjunction:
		snippet = "Conjunction";
		break;
	case NodeType::DigitalPinOut:
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
			snippet += "{'vertex' : a" + dependency.id + ", 'input' : '" + dependency.handle + "'}, ";
		}
		snippet += "], ";
	}

	snippet += "})\n";
	return snippet;
}