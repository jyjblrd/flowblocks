# On Windows, we set the shell to CMD. Otherwise, emcc (specifically, llvm-ar) will fail with a file-not-found error as it doesn't recognize Unix-style paths on Windows.
ifeq ($(OS),Windows_NT)
	SHELL=cmd
endif

rwildcard=$(foreach d,$(wildcard $(1:=/*)),$(call rwildcard,$d,$2)$(filter $(subst *,%,$2),$d))
source_files=$(call rwildcard,src,*.cc *.cpp *.cxx)
wasm_stem=cxx
temporary=tmp
package=pkg
UNAME_S := $(shell uname -s)

all:
# We reset the temporary directory. (emcc requires it to exist before it is run.)
	rm -rf $(temporary)
	mkdir "$(temporary)"
# We generate a javascript and wasm file.
	emcc -lembind $(source_files) -Os -fwasm-exceptions -s MODULARIZE=1 -o $(temporary)/$(wasm_stem).js -sENVIRONMENT="web" -std=c++20 -s EXPORT_NAME="'load_cxx_module'" --no-entry
# We modify Emscripten's request URL to be relative.
ifeq ($(UNAME_S),Darwin)
		gsed -i 's/"$(wasm_stem).wasm"/(new URL("$(wasm_stem).wasm",import.meta.url)).pathname/g;' $(temporary)/$(wasm_stem).js
else
		sed -i 's/"$(wasm_stem).wasm"/(new URL("$(wasm_stem).wasm",import.meta.url)).pathname/g;' $(temporary)/$(wasm_stem).js
endif
# We modify the javascript file to be Vite-compatible.
	printf "\nexport default load_$(wasm_stem)_module;" >> $(temporary)/$(wasm_stem).js
# We add a typescript file.
	printf "/// <reference types=\"emscripten\" />\nexport default function load_cxx_module<Bindings>(Module?: unknown, ...args: unknown[]): Promise</*EmscriptenModule & */Bindings>;" > $(temporary)/$(wasm_stem).d.ts
# We move the temporary directory to the package directory.
	rm -rf $(package)
	mv $(temporary) $(package)

clean:
	rm -rf $(temporary) $(package)

.PHONY: all clean
