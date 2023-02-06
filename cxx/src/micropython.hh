#pragma once

#include <string_view>
#include <span>
#include <vector>

namespace mupy {
	class Snippet {
		std::vector<std::string> lines;
		public:
		friend auto make_block(std::vector<std::string const> const &) -> Snippet;
	};

	auto make_line(std::string const &line) -> Snippet {

	};

	auto make_block(std::vector<std::string const> const &lines) -> Snippet {
		Snippet snippet {};
		for (auto const line : lines) {
			snippet.lines.push_back(
				std::string {"    "}
				.append(line)
				.append("\n")
			);
		}

	};
	
}