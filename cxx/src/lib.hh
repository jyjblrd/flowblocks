#pragma once

#include <string>
#include <map>

struct Dependency {
	std::string id;
	std::string output;
};

struct Vertex {
	std::string kind;
	std::map<std::string, Dependency> connections;
};