# FlowBlocks

https://github.com/jyjblrd/flowblocks/assets/40762456/7a325601-bccf-446e-9ee1-af0131be81ab

## Introduction

FlowBlocks is a visual interface for programming the Raspberry Pi Pico, geared towards beginners.

With FlowBlocks, users can build programs by dragging and dropping blocks from a comprehensive standard library of inputs, operators, and outputs, and connecting them into flowcharts, which describe the flow of data throughout a program. In addition, experienced users also have the option of creating custom blocks—written with a templating dialect of MicroPython—which provide a greater level of expressive freedom for the projects that need it.

## Development
### Installing dependencies

Install [Node.js](https://nodejs.org/) and the project manager [Yarn](https://classic.yarnpkg.com/en/docs/install).
Most of FlowBlocks' dependencies can then be installed with:

```bash
yarn
```

FlowBlocks also requires Emscripten, which should be installed via the [emsdk](https://emscripten.org/docs/getting_started/downloads.html).
On Windows, the C++ build process also requires POSIX tools such as `sed`, which can be installed via [MSYS2](https://www.msys2.org/) or a package manager of your choice, except for `make`, which can be installed via [Chocolatey](https://community.chocolatey.org/packages/make) (MSYS2's `make` cannot use the `cmd` shell, which is required to have paths compatible with `llvm-ar`) . Alternatively, you can use [WSL](https://learn.microsoft.com/en-us/windows/wsl/install).

### Installing development tools

[clang-format](https://www.npmjs.com/package/clang-format)  can be installed with NPM.

### Building WebAssembly modules

To compile the C++ module to WebAssembly:

```bash
cd cxx
make all
```

### Starting a development server

To build the application and run a local server for development:

```bash
yarn run dev
```
