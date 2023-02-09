#pragma once

#include <string>
#include <map>
#include <optional>

struct Dependency {
	std::string id;
	std::string handle;
};

enum class VertexKind {
	DigitalPinInPullDown,
	Conjunction,
	DigitalPinOut,
};

struct Vertex {
	std::string kind;
	std::map<std::string, Dependency> predecessors;
};

auto parse_kind(std::string_view const kind_str) -> std::optional<VertexKind> {
	using std::operator""sv;

	if (false) {
	} else if (kind_str == "DigitalPinInPullDown"sv) {
		return {VertexKind::DigitalPinInPullDown};
	} else if (kind_str == "Conjunction"sv) {
		return {VertexKind::Conjunction};
	} else if (kind_str == "DigitalPinOut"sv) {
		return {VertexKind::DigitalPinOut};
	}

	return {};
}
