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

// temporary forward declaration for function in micropython_blocks.hh
// TODO: remove when NodeType::emit_block_definition() is implemented properly
auto block_class_definition(int i) -> std::string;

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
namespace marshalling
{
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
        
        //std::string description; // commented out because we don't care about the description
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
		  // todo: add map for attributes
    };
}

class NodeType {
public:
	NodeType(std::string block_name, const marshalling::NodeType& m_node_type) :
		 name {std::move(block_name)},
		 mnt {m_node_type}
	{}

    auto emit_block_definition(std::string &code) const -> void {
        if (used) {
            // TODO: implement substitution with mnt.code.init and mnt.code.update

            // below is a temporary implementation so that it compiles our demo
            // this should be replaced later
            int val{-1};
            if (name == "Button")   val = 0;
            else if (name == "And") val = 1;
            else if (name == "LED") val = 2;
            code.append(block_class_definition(val));
            // todo: remove forward declaration at top of file, and block_class_definition in micropython_blocks.hh when done
        }
    }

	 [[nodiscard]] auto get_input_type(const std::string& input_name) const -> std::optional<ConnectionType> {
			if (mnt.inputs.contains(input_name))
				return {mnt.inputs.at(input_name).type};
			else
				return {};
	 }

	 [[nodiscard]] auto get_output_type(const std::string& output_name) const -> std::optional<ConnectionType> {
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
    marshalling::NodeType const &mnt;
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
    auto emit_block_definitions(std::string &code)  const -> void {
        for (auto const &def : definitions)
            def.emit_block_definition(code);
    }
    
    auto insert_type(NodeType&& nt) -> void {
        definitions.push_back(std::move(nt));
        names[definitions.back().get_name()] = definitions.size() - 1;
    }
    
    [[nodiscard]] auto parse_node_type_as_index(const std::string &block_name) const -> std::optional<std::size_t> {
        if (!names.contains(block_name))
            return {};
        else
            return {names.at(block_name)};
    }

	 [[nodiscard]] auto node_type_from_string(const std::string &s) -> std::optional<std::reference_wrapper<NodeType>> {
		  if (auto tmp = parse_node_type_as_index(s); tmp)
				return {definitions[*tmp]};
		  else
				return {};
	 }

	 [[nodiscard]] auto node_type_from_string(const std::string &s) const -> std::optional<std::reference_wrapper<const NodeType>> {
		  if (auto tmp = parse_node_type_as_index(s); tmp)
				return {definitions[*tmp]};
		  else
				return {};
	 }

	 [[nodiscard]] auto get_node_type(const SortedNode& sn) -> NodeType& {
        return definitions[sn.node_type_index];
    }
    
    [[nodiscard]] auto get_node_type(const SortedNode& sn) const -> const NodeType& {
        return definitions[sn.node_type_index];
    }

private:
    std::vector<NodeType> definitions;
    std::unordered_map<std::string, std::size_t> names{};
};