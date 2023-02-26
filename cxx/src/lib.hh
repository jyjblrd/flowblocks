#pragma once

#include <algorithm>
#include <array>
#include <concepts>
#include <cstddef>
#include <functional>
#include <locale>
#include <map>
#include <optional>
#include <string>
#include <string_view>
#include <unordered_map>
#include <unordered_set>
#include <utility>
#include <vector>

// TODO: maybe replace all instances of std::locale::classic() to use the local locale instead of C locale? Maybe have a global locale variable?

// TODO: reorganise code? split into several files?

enum class ConnectionType {
	Bool,
	Integer,
};

enum class AttributeTypes {
	PinInNum,
	PinOutNum,
	Bool,
	Number,
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
	std::map<std::string, std::string> attributes; // TODO: type check these
};

struct SortedGraph {
	std::map<std::string, SortedNode> id_to_node;
	std::vector<std::string> argsorted_ids;

	// FIXME: This should not be required if all nodes are queried in order.
	std::vector<std::string> nonsuccessor_ids {};
};

class AttributeInfo {
public:
	[[nodiscard]] auto name() const -> auto const & { return generated_name; }
	[[nodiscard]] auto self_name() const -> auto const & { return generated_self_name; }
	[[nodiscard]] auto used_in_update() const -> auto { return used; }

	auto set_used_in_update() -> void { used = true; }

	auto alpha_convert_name(std::size_t collision_no) -> void {
		generated_name += std::to_string(collision_no);
		generated_self_name += std::to_string(collision_no);
	}

	AttributeInfo(std::string &&n)
		 : generated_name {n}
		 , generated_self_name {"self.__" + generated_name} { }

private:
	std::string generated_name;
	std::string generated_self_name;
	bool used {false};
};

class InputOutputInfo {
public:
	[[nodiscard]] auto name() const -> auto const & { return generated_name; }
	[[nodiscard]] auto type() const -> auto const { return con_type; }
	[[nodiscard]] auto self_name() const -> auto const & { return generated_self_name; }

	auto alpha_convert_name(std::size_t collision_no) -> void {
		generated_name += std::to_string(collision_no);
		generated_self_name += std::to_string(collision_no);
	}

	InputOutputInfo(std::string &&n, ConnectionType ct)
		 : generated_name {n}
		 , generated_self_name {"self." + generated_name}
		 , con_type {ct} { }

private:
	std::string generated_name;
	std::string generated_self_name;
	ConnectionType con_type;
};

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

		output += "\n";
		for (int i {0}; i < local_indent; ++i) {
			output += "    ";
		}

		output += substr;
		body_pos = substr_end_idx;
	}
}

template <typename... Ts>
	requires((sizeof...(Ts) > 0) && ... && std::convertible_to<Ts, std::string_view>)
inline auto generate_function(std::string &output, int indent_amt, std::string_view const header, Ts const &...snippets) -> void {
	output.append("\n");
	for (int i {0}; i < indent_amt; ++i) {
		output += "    ";
	}
	output.append(header);
	indent_amt += 1;

	std::array<std::string_view, sizeof...(Ts)> const code_snippets = {snippets...};
	for (auto const &snip : code_snippets) {
		generate_py_lines(output, indent_amt, snip);
	}

	output += "\n";
}

inline auto make_init_attribute_pair(std::string_view const name, std::map<std::string, AttributeInfo> const &attrs) -> std::pair<std::string, std::string> {
	std::string function_name {"def "};
	std::string attribute_init {};

	function_name += name;
	function_name += "(self, successors"; // todo: update with new system later

	for (auto const &entry : attrs) {
		function_name += ", ";
		function_name += entry.second.name();

		// as a runtime memory space optimisation, only save attributes that are used in the body of the update block
		if (entry.second.used_in_update()) {
			attribute_init += entry.second.self_name();
			attribute_init += " = ";
			attribute_init += entry.second.name();
			attribute_init += "\n";
		}
	}

	function_name += "):";

	if (!attribute_init.empty())
		attribute_init.pop_back(); // at least one line added; remove trailing newline

	return std::make_pair(std::move(function_name), std::move(attribute_init));
}

class NodeType {
	static auto generate_block_name(std::string const &n) -> std::string {
		std::string g_name {n};

		// strip leading non-alphabet characters
		bool done {false};
		std::erase_if(g_name, [&done](char c) { if (done) return false; else { done = std::isalpha(c, std::locale::classic()); return !done; } });

		if (n.empty()) {
			g_name = "UnnamedBlock";
		} else {
			g_name.front() = std::toupper(g_name.front(), std::locale::classic());
			g_name = "Block" + g_name;
		}

		std::erase_if(g_name, [](char c) { return !std::isalnum(c, std::locale::classic()); });

		return g_name;
	}

	static auto generate_var_name(std::string const &n, std::string_view default_name) -> std::string {
		std::string a_name {n};

		// strip leading non-alphabet characters
		bool done {false};
		std::erase_if(a_name, [&done](char c) { if (done) return false; else { done = std::isalpha(c, std::locale::classic()); return !done; } });

		if (n.empty()) {
			a_name = default_name;
		} else {
			std::replace_if(
				a_name.begin(), a_name.end(), [](char c) { return std::isspace(c, std::locale::classic()); }, '_');
			std::transform(a_name.begin(), a_name.end(), a_name.begin(), [](char c) { return std::tolower(c, std::locale::classic()); });
		}

		std::erase_if(a_name, [](char c) { return !(std::isalnum(c, std::locale::classic()) || c == '_'); });

		return a_name;
	}

	auto substitute_identifiers(std::string const &original, bool &result_valid, bool is_update) -> std::string {
		std::string result;

		std::size_t index_lo {0};
		while (index_lo < original.size()) {
			std::size_t index_hi {original.find("{{", index_lo)};

			// if index_hi == npos (i.e. '{{' not found), substr returns until the end of str
			result += original.substr(index_lo, index_hi - index_lo);
			index_lo = index_hi;

			if (index_lo < original.size()) {
				index_lo += 2; // length of "{{"
				index_hi = original.find("}}", index_lo);

				if (index_hi == std::string::npos) {
					result_valid = false;
					return ""; // ERROR: unclosed attribute/input/output in string
					// TODO: return error message in the string
					// we only throw an error if this class if we try to use an invalid block
				}

				while ((index_lo < index_hi) && original[index_lo] == ' ') {
					index_lo++;
				}

				std::size_t index_tmp {index_hi};
				while ((index_lo < index_tmp) && original[index_tmp - 1] == ' ') {
					index_tmp--;
				}

				std::string const key {original.substr(index_lo, index_tmp - index_lo)};

				if (auto c {result.back()}; c != ' ' && c != '(' && c != '[' && c != '\n' && c != '\t') { // note: result.back() cannot be '{'
					result += " ";
				}

				// BIG NOTE: substitution for attributes, inputs, and outputs happens HERE:
				// TODO: replace (inputs, outputs) replacements with necessary replacements for our execution model
				if (attributes.contains(key)) {
					if (is_update) {
						result += attributes.at(key).self_name();
						attributes.at(key).set_used_in_update();
					} else {
						result += attributes.at(key).name();
					}

				} else if (inputs.contains(key)) {
					result += inputs.at(key).self_name();

				} else if (outputs.contains(key)) {
					result += outputs.at(key).self_name();

				} else {
					return ""; // ERROR: identifier not found
					// TODO: return error string
				}

				index_hi += 2;
				if (index_hi < original.size()) {
					if (auto c {original[index_hi]}; c != ' ' && c != ',' && c != ')' && c != ']' && c != '\n' && c != '\t') {
						result += " ";
					}
				}

				index_lo = index_hi;
			}
		}

		return result;
	}

public:
	NodeType(std::string block_name, marshalling::NodeType const &m_node_type)
		 : name {std::move(block_name)}
		 , is_query {m_node_type.code.is_query} {
		generated_name = generate_block_name(name);

		// rename attributes, provide map from old attribute names to new attributes names
		// and likewise for inputs and outputs

		std::unordered_map<std::string, std::size_t> name_collisions {};

		for (auto const &[attr_name, attr_type] : m_node_type.attributes) {
			AttributeInfo ai {generate_var_name(attr_name, "unnamed_attribute")};

			if (name_collisions.contains(ai.name())) {
				std::size_t const tmp = (name_collisions[ai.name()] += 1);
				ai.alpha_convert_name(tmp);
			} else {
				name_collisions[ai.name()] = 0;
			}

			attributes.insert_or_assign(attr_name, std::move(ai));
		}

		for (auto const &[in_id, in_con_entry] : m_node_type.inputs) {
			InputOutputInfo ii {generate_var_name(in_con_entry.name, "unnamed_input"), in_con_entry.type};

			if (name_collisions.contains(ii.name())) {
				std::size_t const tmp = (name_collisions[ii.name()] += 1);
				ii.alpha_convert_name(tmp);
			} else {
				name_collisions[ii.name()] = 0;
			}

			input_ids.insert_or_assign(in_id, in_con_entry.name);
			inputs.insert_or_assign(in_con_entry.name, std::move(ii));
		}

		for (auto const &[out_id, out_con_entry] : m_node_type.outputs) {
			InputOutputInfo oi {generate_var_name(out_con_entry.name, "unnamed_output"), out_con_entry.type};

			if (name_collisions.contains(oi.name())) {
				std::size_t const tmp = (name_collisions[oi.name()] += 1);
				oi.alpha_convert_name(tmp);
			} else {
				name_collisions[oi.name()] = 0;
			}

			output_ids.insert_or_assign(out_id, out_con_entry.name);
			outputs.insert_or_assign(out_con_entry.name, std::move(oi));
		}

		// perform attribute/input/output name substitution

		init_code = substitute_identifiers(m_node_type.code.init, init_code_valid, false);
		update_code = substitute_identifiers(m_node_type.code.update, update_code_valid, true);
	}

	auto alpha_convert_generated_class_name(std::size_t collision_no) -> void {
		generated_name += std::to_string(collision_no);
	}

	auto emit_block_definition(std::string &code) const -> void {
		static constexpr std::string_view init_begin {"self.successors = successors"};
		static constexpr std::string_view update_end {"for successor in self.successors['0']:\n\tsuccessor['vertex'].update(successor['input'], output_value)"};
		static constexpr std::string_view query_func {"def query(self):"};
		static constexpr std::string_view update_func {"def update(self, input, value):"};

		if (used) {

			if (!init_code_valid) {
				// TODO: throw error
			} else if (!update_code_valid) {
				// TODO: throw error
			} else {
				auto [init_func, attr_init] = make_init_attribute_pair("__init__", attributes);

				code.append("class " + get_generated_name() + ":");

				// TODO: rewrite to produce code that obeys the correct model of execution

				if (!outputs.empty()) {
					generate_function(code, 1, init_func, init_begin, attr_init, init_code);

					if (is_query) {
						generate_function(code, 1, query_func, update_code, update_end);
					} else {
						generate_function(code, 1, update_func, update_code, update_end);
					}
				} else {
					generate_function(code, 1, init_func, attr_init, init_code);

					if (is_query) {
						generate_function(code, 1, query_func, update_code);
					} else {
						generate_function(code, 1, update_func, update_code);
					}
				}

				code.append("\n");
			}
		}
	}

	auto emit_block_instantiation(std::string &code, SortedNode const &sn, std::string const &id) const -> void {
		code += "a" + id + " = " + get_generated_name() + "(successors = {";
		for (auto const &[output, successors] : sn.output_to_successors) {
			code += "'" + output + "' : [";
			for (auto const &successor : successors) {
				code += "{'vertex' : a" + successor.id + ", 'input' : '" + successor.input + "'}, ";
			}
			code += "], ";
		}

		code += "},";

		for (auto const &[a_name, value] : sn.attributes) {
			code += " " + attributes.at(a_name).name() + " = " + value + ",";
		}

		code.pop_back(); // remove final comma
		code += ")\n";
	}

	[[nodiscard]] auto get_input_type(std::string const &input_name) const -> std::optional<ConnectionType> {
		if (input_ids.contains(input_name))
			return {inputs.at(input_ids.at(input_name)).type()};
		else
			return {};
	}

	[[nodiscard]] auto get_output_type(std::string const &output_name) const -> std::optional<ConnectionType> {
		if (output_ids.contains(output_name))
			return {outputs.at(output_ids.at(output_name)).type()};
		else
			return {};
	}

	auto mark_used() -> void { used = true; }
	[[nodiscard]] auto expected_in_degree() const -> std::size_t { return inputs.size(); }
	[[nodiscard]] auto expected_out_degree() const -> std::size_t { return outputs.size(); }
	[[nodiscard]] auto get_generated_name() const -> std::string const & { return generated_name; }
	[[nodiscard]] auto get_real_name() const -> std::string const & { return name; }

private:
	std::string name;
	std::string generated_name;

	std::string init_code;
	std::string update_code;
	bool is_query;

	// if true, init_code and update_code hold code. If false, these contain error messages
	// TODO: check these whenever init_code and update_code are used
	bool init_code_valid {true};
	bool update_code_valid {true};

	// these map from human readable-names to their related info class
	// TODO: refactor so inputs uses an InputInfo class, and outputs uses OutputInfo
	// that way, we can maybe directly access the outputs of predecessor nodes as inputs (?)
	std::map<std::string, InputOutputInfo> inputs;
	std::map<std::string, InputOutputInfo> outputs;
	std::map<std::string, AttributeInfo> attributes;

	// these map from the id of the inputs / outputs to human-readable names
	std::map<std::string, std::string> input_ids;
	std::map<std::string, std::string> output_ids;

	std::unordered_set<std::string> identifiers_used;

	bool used {false};
};

class NodeDefinitions {
public:
	auto emit_block_definitions(std::string &code) const -> void {
		for (auto const &def : definitions)
			def.emit_block_definition(code);
	}

	auto insert_type(NodeType &&nt) -> void {
		// we perform basic alpha conversion if there is a name collision with a lowercase version of the default generated name
		std::string identifier {nt.get_generated_name()};
		std::transform(identifier.begin(), identifier.end(), identifier.begin(), [](char c) { return std::tolower(c, std::locale::classic()); });
		if (name_collisions.contains(identifier)) {
			std::size_t const tmp = (name_collisions[identifier] += 1);
			nt.alpha_convert_generated_class_name(tmp);
		} else {
			name_collisions[identifier] = 0;
		}

		definitions.push_back(std::move(nt));
		names[definitions.back().get_real_name()] = definitions.size() - 1;
	}

	[[nodiscard]] auto parse_node_type_as_index(std::string const &block_name) const -> std::optional<std::size_t> {
		if (names.contains(block_name))
			return {names.at(block_name)};
		else
			return {};
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
	std::unordered_map<std::string, std::size_t> name_collisions {};
};