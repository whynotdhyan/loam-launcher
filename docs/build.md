# Building LOAM Launcher from Source

This guide provides step-by-step instructions to compile, test, and package LOAM Launcher on Windows 10/11 x64.

---

## 1. System Requirements & Toolchains

1. **Operating System**: Windows 10/11 64-bit.
2. **Visual Studio C++ Build Tools**:
   - Install Visual Studio 2022 Community or Build Tools with the **Desktop development with C++** workload.
3. **Rust Toolchain**:
   - Install `rustup` from [rustup.rs](https://rustup.rs/).
   - Add the target:
     ```powershell
     rustup default stable
     rustup target add x86_64-pc-windows-msvc
     ```
4. **Node.js**:
   - Node.js version 20 LTS or 22 LTS with `npm` or `pnpm`.
5. **WebView2**:
   - Pre-installed on Windows 10 and 11.

---

## 2. Local Development Workflow

1. **Clone the Repository**:
   ```powershell
   git clone https://github.com/whynotdhyan/loam-launcher.git
   cd loam-launcher
   ```

2. **Install Frontend Dependencies**:
   ```powershell
   npm install
   ```

3. **Launch in Development Mode**:
   ```powershell
   npm run tauri dev
   ```
   This spins up the Vite development server on port `1420` and attaches the Tauri native shell with hot module replacement (HMR).

---

## 3. Running Test Suites

- **Frontend TypeScript & Linter**:
  ```powershell
  npm run lint
  ```
- **Rust Unit & Canary Tests**:
  ```powershell
  cargo test --manifest-path src-tauri/Cargo.toml
  ```
- **Clippy Analysis**:
  ```powershell
  cargo clippy --manifest-path src-tauri/Cargo.toml -- -D warnings
  ```

---

## 4. Building the Production Windows Installer

To produce the branded NSIS installer (`LOAM Setup.exe`):

```powershell
npm run tauri build
```

The output installer will be generated at:
`src-tauri/target/release/bundle/nsis/LOAM Setup 1.0.0.exe`

### Computing SHA-256 Checksum:
```powershell
Get-FileHash -Algorithm SHA256 "src-tauri/target/release/bundle/nsis/LOAM Setup 1.0.0.exe"
```
