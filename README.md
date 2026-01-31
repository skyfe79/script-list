# 📜 script-list (sl)

A fast, modern Rust CLI tool to list and display npm scripts from `package.json`.

[![Rust](https://img.shields.io/badge/rust-1.70%2B-orange.svg)](https://www.rust-lang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🚀 **Fast** - Written in Rust for maximum performance
- 🎨 **Beautiful output** - Clean, colorized output with consistent indentation
- 🔍 **Filter support** - Search scripts by name
- 📦 **Zero dependencies** - Single binary, no runtime requirements
- 🖥️ **Cross-platform** - Works on macOS, Linux, and Windows
- ⚡ **Short command** - Just type `sl`

## 📦 Installation

### From Source (Cargo)

```bash
cargo install --git https://github.com/skyfe79/script-list
```

### From Release

Download pre-built binaries from [Releases](https://github.com/skyfe79/script-list/releases).

## 🚀 Usage

### Basic

```bash
# List all scripts in current directory
sl
```

**Output:**
```
   MyAwesomeProject

    - build : babel src -d lib
    - start : node server.js
    - test  : jest --coverage --verbose
```

### Filter Scripts

```bash
# Show only scripts containing "test"
sl -f test

# Output:
#    MyAwesomeProject
# 
#     - test  : jest --coverage --verbose
```

### Different Formats

```bash
# Table format (default)
sl -F table

# Simple list
sl -F list
# Output:
#    build: babel src -d lib
#    start: node server.js
#    test: jest --coverage --verbose

# JSON output
sl -F json
# Output:
#    {
#      "build": "babel src -d lib",
#      "start": "node server.js",
#      "test": "jest --coverage --verbose"
#    }
```

### Other Options

```bash
# Show only script names
sl --names-only

# Use custom package.json path
sl --path ./path/to/package.json
```

### Error Handling

```bash
# When package.json is not found
sl

# Output:
#    my-project
# 
#    No package.json file found:
#      /Users/skyfe79/projects/my-project
```

## 🛠️ Development

```bash
# Clone
git clone https://github.com/skyfe79/script-list
cd script-list

# Build
cargo build --release

# Run
cargo run

# Test
cargo test
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Credits

Inspired by the [npm package `script-list`](https://www.npmjs.com/package/script-list).
