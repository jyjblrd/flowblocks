#pragma once

#include <string>
#include <string_view>
#include <map>
#include <optional>
#include <cstddef>
#include <set>
#include <unordered_set>
#include <utility>
#include <functional>
#include <vector>
#include <unordered_map>
#include <concepts>

enum class ConnectionType {
	Bool,
	Integer,
};

enum class AttributeTypes {
	PinInNum,
	PinOutNum,
};

// I moved the structs used in marshalling to this namespace
// it was getting a bit chaotic
namespace marshalling {
struct NodeType {
	struct ConnectionEntry {
		std::string name;
		ConnectionType type;
	};

	struct CodeDef {
		std::string init;
		std::string update;
		bool is_query;
	};

	struct AttributeType {
		AttributeTypes type;
	};

	// std::string description; // commented out because we don't care about the description
	std::map<std::string, AttributeType> attributes; // FIXME: unsure if attributes should be string or int; see NodeTypes.interface.ts
	std::map<std::string, ConnectionEntry> inputs;
	std::map<std::string, ConnectionEntry> outputs;
	CodeDef code;
};

struct Predecessor {
	std::string id;
	std::string output;
};

struct Node {
	std::string type_str;
	std::map<std::string, Predecessor> input_to_predecessor;
	std::map<std::string, std::string> attributes;
};
}

inline auto generate_py_lines(std::string &output, int indent_amt, std::string_view const body) {
	for (std::size_t body_pos {0}; body_pos < body.length(); ++body_pos) {
		auto substr_end_idx = body.find('\n', body_pos);

		if (substr_end_idx == std::string_view::npos) {
			substr_end_idx = body.length();
		}

		auto substr = body.substr(body_pos, substr_end_idx - body_pos);

		int local_indent {indent_amt};
		while (!substr.empty() && substr.front() == '\t') {
			substr.remove_prefix(1);
			++local_indent;
		}

		output.append("\n");
		for (int i {0}; i <= local_indent; ++i) {
			output.append("    ");
		}

		output.append(substr);
		body_pos = substr_end_idx;
	}
}

template <typename... Ts>
	requires((sizeof...(Ts) > 0) && ... && std::convertible_to<Ts, std::string_view>)
inline auto generate_block_method(std::string &output, int indent_amt, std::string_view const header, Ts const &...snippets) -> void {
	output.append("\n");
	for (int i {0}; i <= indent_amt; ++i) {
		output.append("    ");
	}
	output.append(header);
	indent_amt += 1;

	std::vector<std::string_view> const code_snippets = {snippets...};
	for (auto const &snip : code_snippets) {
		generate_py_lines(output, indent_amt, snip);
	}

	output.append("\n");
}

class NodeType {
public:
	NodeType(std::string block_name, marshalling::NodeType const &m_node_type)
		 : name {std::move(block_name)}
		 , mnt {m_node_type} { }

	auto emit_block_definition(std::string &code) const -> void {
		constexpr std::string_view init_begin {"self.successors = successors"};
		constexpr std::string_view update_end {"for successor in self.successors['1']:\n\tsuccessor['vertex'].update(successor['input'], output_value)"};

		if (used) {
			code.append("class " + name + ":");

			if (!mnt.outputs.empty()) {
				generate_block_method(code, 1, "def __init__(self, successors):", init_begin, mnt.code.init);

				if (mnt.code.is_query) {
					generate_block_method(code, 1, "def query(self):", mnt.code.update, update_end);
				} else {
					generate_block_method(code, 1, "def update(self, input, value):", mnt.code.update, update_end);
				}
			} else {
				generate_block_method(code, 1, "def __init__(self, successors):", mnt.code.init);

				if (mnt.code.is_query) {
					generate_block_method(code, 1, "def query(self):", mnt.code.update);
				} else {
					generate_block_method(code, 1, "def update(self, input, value):", mnt.code.update);
				}
			}

			code.append("\n");
		}
	}

	[[nodiscard]] auto get_input_type(std::string const &input_name) const -> std::optional<ConnectionType> {
		if (mnt.inputs.contains(input_name))
			return {mnt.inputs.at(input_name).type};
		else
			return {};
	}

	[[nodiscard]] auto get_output_type(std::string const &output_name) const -> std::optional<ConnectionType> {
		if (mnt.outputs.contains(output_name))
			return {mnt.outputs.at(output_name).type};
		else
			return {};
	}

	auto mark_used() -> void { used = true; }
	[[nodiscard]] auto expected_in_degree() const -> std::size_t { return mnt.inputs.size(); }
	[[nodiscard]] auto expected_out_degree() const -> std::size_t { return mnt.outputs.size(); }
	[[nodiscard]] auto get_name() const -> std::string const & { return name; }

private:
	std::string name;
	marshalling::NodeType const &mnt; // TODO: make safer? although lifetime of marshalled data type is longer
	bool used {false};
};

struct Successor {
	std::string id;
	std::string input;

	auto operator==(Successor const &) const -> bool = default;
};

template <>
struct std::hash<Successor> {
	std::size_t operator()(Successor const &successor) const noexcept {
		std::size_t const h1 = std::hash<std::string> {}(successor.id);
		std::size_t const h2 = std::hash<std::string> {}(successor.input);
		return h1 ^ (h2 << 1);
	}
};

struct SortedNode {
	std::map<std::string, std::unordered_set<Successor>> output_to_successors;
	std::size_t node_type_index;
};

struct SortedGraph {
	std::map<std::string, SortedNode> id_to_node;
	std::vector<std::string> argsorted_ids;
	//	std::set<NodeType> node_types;

	// FIXME: This should not be required if all nodes are queried in order.
	std::vector<std::string> nonsuccessor_ids {};
};

class NodeDefinitions {
public:
	auto emit_block_definitions(std::string &code) const -> void {
		for (auto const &def : definitions)
			def.emit_block_definition(code);
	}

	auto insert_type(NodeType &&nt) -> void {
		definitions.push_back(std::move(nt));
		names[definitions.back().get_name()] = definitions.size() - 1;
	}

	[[nodiscard]] auto parse_node_type_as_index(std::string const &block_name) const -> std::optional<std::size_t> {
		if (!names.contains(block_name))
			return {};
		else
			return {names.at(block_name)};
	}

	[[nodiscard]] auto node_type_from_string(std::string const &s) -> std::optional<std::reference_wrapper<NodeType>> {
		if (auto tmp = parse_node_type_as_index(s); tmp)
			return {definitions[*tmp]};
		else
			return {};
	}

	[[nodiscard]] auto node_type_from_string(std::string const &s) const -> std::optional<std::reference_wrapper<NodeType const>> {
		if (auto tmp = parse_node_type_as_index(s); tmp)
			return {definitions[*tmp]};
		else
			return {};
	}

	[[nodiscard]] auto get_node_type(SortedNode const &sn) -> NodeType & {
		return definitions[sn.node_type_index];
	}

	[[nodiscard]] auto get_node_type(SortedNode const &sn) const -> NodeType const & {
		return definitions[sn.node_type_index];
	}

private:
	std::vector<NodeType> definitions;
	std::unordered_map<std::string, std::size_t> names {};
};