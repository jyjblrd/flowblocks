#pragma once

#include <string>
#include <map>
#include <optional>

struct Dependency {
	std::string id;
	std::string handle;
};

enum class NodeType {
	DigitalPinInPullDown,
	Conjunction,
	DigitalPinOut,
};

struct Node {
	std::string node_type;
	std::map<std::string, Dependency> predecessors;
};

auto parse_node_type(std::string_view const kind_str) -> std::optional<NodeType> {
	using std::operator""sv;

	if (false) {
	} else if (kind_str == "DigitalPinInPullDown"sv) {
		return { NodeType::DigitalPinInPullDown};
	} else if (kind_str == "Conjunction"sv) {
		return { NodeType::Conjunction};
	} else if (kind_str == "DigitalPinOut"sv) {
		return { NodeType::DigitalPinOut};
	}

	return {};
}
