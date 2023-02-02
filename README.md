# FlowBlocks
FlowBlocks is a visual interface for programming microcontrollers, geared towards beginners.

## Development

### Installing dependencies

Install [Node.js](https://nodejs.org/) and the project manager [Yarn](https://classic.yarnpkg.com/en/docs/install).
Most of FlowBlocks' dependencies can then be installed with:

```bash
yarn
```

FlowBlocks also requires Emscripten, which should be installed via the [emsdk](https://emscripten.org/docs/getting_started/downloads.html).
On Windows, the C++ build process also requires POSIX tools such as `make` and `sed`, which can be installed via [MSYS2](https://www.msys2.org/) or a package manager of your choice; alternatively, you can use [WSL](https://learn.microsoft.com/en-us/windows/wsl/install).

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
