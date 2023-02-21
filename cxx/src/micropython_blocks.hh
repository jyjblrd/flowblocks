#pragma once

#include <map>
#include <string>
#include <string_view>
#include <vector>

#include "lib.hh"

#include <emscripten/bind.h>

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