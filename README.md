# FlowBlocks
FlowBlocks is a visual interface for programming pi picos, geared towards beginners.

It is a flow chart based languge. A program is made up of blocks that can read from an input, perform logic or control an output. This makes programming simple as the code necesary to interact with a sensor is hidden behind the blocks so the user does not have to interact with it.
The blocks are all written in python that can be edited by users. This allows more powerful programs to be written. It also allows users to learn the basics of more traditional programmming styles.

The system is capable of auto generating circuits and telling the user how to assemble them.

It is designed to be simple. A project such as turning on an LED when one of 2 buttons is pressed is as simple as placing 2 button blocks and an LED then connecting the buttons to an or block then to the LED. The program can then be compiled and downloaded to the pi. The circuit can be assembled from the instructions. The pins are chosen automatically.

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
