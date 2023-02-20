#pragma once

#include <string>
#include <map>
#include <vector>
#include "lib.hh"

#include <string_view>

#include <emscripten/bind.h>

// TODO: move this to NodeType::emit_block_definition()
// this is currently temporary and should be removed asap once generating blocks
// as specified by the code definitions provided by the JSON is implemented.
// it only exists now so that I can test the implementation of NodeType.
auto block_class_definition(int i) -> std::string {
	using std::operator""sv;
	std::string snippet;
	switch (i) {
	case 0:
		snippet = R"...(
class Button:
    def __init__(self, successors):
        self.led = machine.Pin(14, machine.Pin.IN, machine.Pin.PULL_DOWN)
        self.successors = successors

    def query(self):
        output_value = True if self.led.value() else False
        for successor in self.successors['1']:
            successor['vertex'].update(successor['input'], output_value)
)..."sv.substr(1);
		break;
	case 1:
		snippet = R"...(
class And:
    def __init__(self, successors):
        self.left = False
        self.right = False
        self.successors = successors

    def update(self, input, value):
        if input == '1':
            self.left = value
        elif input == '2':
            self.right = value
        output_value = True if self.left and self.right else False
        for successor in self.successors['1']:
            successor['vertex'].update(successor['input'], output_value)
)..."sv.substr(1);
		break;
	case 2:
		snippet = R"...(
class LED:
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

auto block_initialization(std::string const &class_name, std::string const &id, std::map<std::string, std::unordered_set<Successor>> const &output_to_successors) -> std::string {
	std::string snippet {}; // temporary use
	snippet = "a" + id + " = " + class_name + "({";
	for (auto const &[output, successors] : output_to_successors) {
		snippet += "'" + output + "' : [";
		for (auto const &successor : successors) {
			snippet += "{'vertex' : a" + successor.id + ", 'input' : '" + successor.input + "'}, ";
		}
		snippet += "], ";
	}

	snippet += "})\n";
	return snippet;
}