# Contributing to LOAM Launcher

Thank you for your interest in contributing to LOAM Launcher! LOAM is built with a commitment to Swiss typography, quiet utility, robust Rust-based reliability, and uncompromised user security.

## Code of Conduct

Please review and adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) in all community spaces and issue interactions.

## Development Setup

### Prerequisites
- **OS**: Windows 10/11 x64
- **Rust Toolchain**: `stable` (1.78+) with `x86_64-pc-windows-msvc` target
- **Node.js**: v20+ / v22+
- **Package Manager**: `npm` or `pnpm`
- **C++ Build Tools**: Visual Studio 2022 C++ build tools (required by Tauri on Windows)
- **WebView2**: Evergreen WebView2 Runtime (pre-installed on Windows 10/11)

### Getting Started

1. Fork and clone the repository:
   ```powershell
   git clone https://github.com/whynotdhyan/loam-launcher.git
   cd loam-launcher
   ```
2. Install frontend dependencies:
   ```powershell
   npm install
   ```
3. Run the development environment with hot reloading:
   ```powershell
   npm run tauri dev
   ```

## Development Guidelines

1. **Design System Adherence**:
   - Strictly follow the locked 5-color brand palette and derived tokens in `src/styles/tokens.css`.
   - Never use `--loam-muted` for meaningful text.
   - Maintain the 8px spatial grid and Swiss typography principles.
   - Every control must be fully accessible and navigable via keyboard (`Tab`, `Ctrl+Enter`, `Ctrl+K`).

2. **Security & Data Isolation**:
   - Never store unredacted secrets or tokens in logs.
   - Never read credential files from other launchers.
   - All game versions must exist in isolated game sandboxes (`games/<stable-id>/`).

3. **Submitting a Pull Request**:
   - Run type checks: `npm run lint`
   - Run Rust tests and linter: `cargo test --manifest-path src-tauri/Cargo.toml` and `cargo clippy --manifest-path src-tauri/Cargo.toml`
   - Ensure all commit messages are clear and follow the Conventional Commits specification.
