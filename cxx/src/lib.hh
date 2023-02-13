#pragma once

#include <string>
#include <string_view>
#include <map>
#include <optional>
#include <cstddef>

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

enum class ConnectionType {
	Bool,
	Number,
};

auto parse_node_type(std::string_view const kind_str) -> std::optional<NodeType> {
	using std::operator""sv;

	if (false) {
	} else if (kind_str == "DigitalPinInPullDown"sv) {
		return {NodeType::DigitalPinInPullDown};
	} else if (kind_str == "Conjunction"sv) {
		return {NodeType::Conjunction};
	} else if (kind_str == "DigitalPinOut"sv) {
		return {NodeType::DigitalPinOut};
	}

	return {};
}

auto get_input_type(NodeType node_type, std::string_view input_id) -> std::optional<ConnectionType> {
	using std::operator""sv;

	switch (node_type) {
	case NodeType::DigitalPinInPullDown:
		break;
	case NodeType::Conjunction:
		if (input_id == "1"sv || input_id == "2"sv) {
			return {ConnectionType::Bool};
		}
		break;
	case NodeType::DigitalPinOut:
		if (input_id == "1"sv) {
			return {ConnectionType::Bool};
		}
		break;
	}
	return {};
}

auto get_output_type(NodeType node_type, std::string_view output_id) -> std::optional<ConnectionType> {
	using std::operator""sv;

	switch (node_type) {
	case NodeType::DigitalPinInPullDown:
		if (output_id == "1"sv) {
			return {ConnectionType::Bool};
		}
		break;
	case NodeType::Conjunction:
		if (output_id == "1"sv) {
			return {ConnectionType::Bool};
		}
		break;
	case NodeType::DigitalPinOut:
		break;
	}
	return {};
}

auto expected_indegree(NodeType node_type) -> std::size_t {
	switch (node_type) {
	case NodeType::DigitalPinInPullDown:
		return 0;
	case NodeType::Conjunction:
		return 2;
	case NodeType::DigitalPinOut:
		return 1;
	}
	return 0;
}
