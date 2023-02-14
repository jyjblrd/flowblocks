#pragma once

#include <string>
#include <string_view>
#include <map>
#include <optional>
#include <cstddef>
#include <set>
#include <unordered_set>
#include <vector>

enum class NodeType {
	DigitalPinInPullDown,
	Conjunction,
	DigitalPinOut,
};

struct Successor {
	std::string id;
	std::string input;

	auto operator==(Successor const &) const -> bool = default;
};

template <>
struct std::hash<Successor> {
	std::size_t operator()(Successor const &successor) const noexcept {
		std::size_t h1 = std::hash<std::string> {}(successor.id);
		std::size_t h2 = std::hash<std::string> {}(successor.input);
		return h1 ^ (h2 << 1);
	}
};

struct Predecessor {
	std::string id;
	std::string output;
};

struct SortedNode {
	std::map<std::string, std::unordered_set<Successor>> output_to_successors;
	NodeType type;
};

struct SortedGraph {
	std::map<std::string, SortedNode> id_to_node;
	std::vector<std::string> argsorted_ids;
	std::set<NodeType> node_types;

	// FIXME: This should not be required if all nodes are queried in order.
	std::vector<std::string> nonsuccessor_ids {};
};

struct Node {
	std::string type_str;
	std::map<std::string, Predecessor> input_to_predecessor;
};

enum class ConnectionType {
	Bool,
	Number,
};

auto parse_node_type(std::string_view const type_str) -> std::optional<NodeType> {
	using std::operator""sv;

	if (false) {
	} else if (type_str == "DigitalPinInPullDown"sv) {
		return {NodeType::DigitalPinInPullDown};
	} else if (type_str == "Conjunction"sv) {
		return {NodeType::Conjunction};
	} else if (type_str == "DigitalPinOut"sv) {
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
