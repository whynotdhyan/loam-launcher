<div align="center">

# LOAM

**Your worlds, ready.**

A calm, typography-led desktop launcher for Minecraft Java Edition.  
Engineered with Tauri 2, Rust, and React for Windows 10/11 x64.

[![LOAM CI](https://github.com/whynotdhyan/loam-launcher/actions/workflows/ci.yml/badge.svg)](https://github.com/whynotdhyan/loam-launcher/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/whynotdhyan/loam-launcher?label=release&color=C15F3C)](https://github.com/whynotdhyan/loam-launcher/releases)
[![License: GPL-3.0](https://img.shields.io/badge/license-GPL--3.0-171715.svg)](LICENSE)
[![Platform: Windows 10 / 11 x64](https://img.shields.io/badge/platform-Windows%20x64-EDDED5.svg?color=9F4A2B)](docs/support-matrix.md)
[![Discord](https://img.shields.io/badge/chat-on%20Discord-7289da.svg)](https://discord.gg/loam-launcher)

</div>

---

## Overview

**LOAM** evokes the fertile ground worlds are built on. Designed with an editorial, Swiss-minimalist aesthetic, it replaces cluttered game-store launchers with a focused desktop utility. The interface emphasizes three core actions: **Play**, **Install**, and **Switch Games**.

- **Calm, High-Contrast Design**: Built on a locked 5-color palette (`#C15F3C` terracotta accent, `#F4F3EE` paper canvas, `#171715` ink) adhering strictly to WCAG 2.2 AA contrast rules.
- **Isolated Game Sandboxes**: Every game instance resides in its own isolated directory (`%APPDATA%\LOAM\games\<stable-id>`). Changing versions never silently breaks or modifies existing worlds.
- **Single Legitimate Online Login**: Official Microsoft authorization-code flow with PKCE via your default browser. Zero client secrets embedded; zero passwords handled. Tokens reside safely in the **Windows Credential Manager** backed by DPAPI.
- **Transparent Offline Profiles**: Clear, honest offline profiles with deterministic vanilla UUID v3 generation for LAN, local play, and offline-mode testing.
- **Smart Drop & Safe Migration**: Drag and drop Fabric mods, `.mrpack` archives, or resource packs with pre-flight inspection and zip-slip prevention. Importer strictly copies game assets—it never reads, parses, or touches credentials from other launchers.
- **Integrated Support & Redaction**: Built-in guided diagnostics form producing Discord-ready Markdown (<1,800 chars) and redacted diagnostic bundles with zero token leakage.

---

## Desktop Interface

```text
┌────────────────────────────────────────────────────────────────────────┐
│ LOAM                                    ◉ Alex · MICROSOFT ✓   ?   ⚙  │
│ JAVA EDITION                                                            │
│ YOUR WORLDS, READY.                                                     │
│                                                                         │
│                                                                         │
│   Survival SMP                                                          │
│   26.3 · Fabric · 4 GB                                                  │
│                                                                         │
│   [           PLAY           ]                                          │
│   Ready · verified 2 min ago                                            │
│                                                                         │
│                                                                         │
│   INSTALL +    ⇣ Drop a mod, pack or world     [SM][CR][TS][+3]         │
│ ────────────────────────────────────────────────────────────────────── │
│   30 SEP  Minecraft Java Edition 26.3 Release Candidate       READ ↗   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Architecture & Technology Stack

| Layer | Technologies | Purpose |
|---|---|---|
| **Shell & Core** | Tauri 2 · Rust 1.78+ | Native OS windowing, memory safety, argument vector process spawning, Windows Credential Manager DPAPI vault. |
| **User Interface** | React 18 · TypeScript · Vite | Typographic layout, WCAG AA accessibility, keyboard-first navigation (`Ctrl+Enter`, `Ctrl+K`, `Ctrl+N`). |
| **Networking** | Reqwest · Tokio | Resumable chunked downloads, official Mojang/Fabric API manifest resolution, SHA-1/SHA-256 verification. |
| **Diagnostics** | Canary Redaction Suite | Automatic sanitization of tokens, email addresses, and Windows user paths before export. |

---

## Account Capability Matrix

LOAM enforces transparent account capabilities in both the UI chips and the launch pre-flight engine:

| Capability | Microsoft Account | Offline Profile | Third-Party Auth (Gate I) |
|---|:---:|:---:|:---:|
| Singleplayer & LAN | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Offline-Mode Servers | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Online-Mode Servers (Mojang Auth) | :white_check_mark: | :x: | :x: |
| Official Minecraft Realms | :white_check_mark: | :x: | :x: |
| Verified Ownership Badge | `MICROSOFT ✓` | `OFFLINE PROFILE` | `THIRD-PARTY · host` |
| Personal Skin / Cape | :white_check_mark: | Default Skin | Provider Skin |

---

## Release Gates & Implementation Status

| Gate | Milestone | Target | Status |
|:---:|---|:---:|:---:|
| **A** | **Desktop Shell & Design System**: Tauri 2, Swiss layout, tokens.css, keyboard navigation (`Ctrl+K`, `Ctrl+Enter`) | v1.0 | :white_check_mark: Complete |
| **B** | **Vanilla Engine**: Version manifest v2, inheritance, libraries, Java selection, argument vectors | v1.0 | :white_check_mark: Complete |
| **C** | **Identity**: Microsoft PKCE login, DPAPI credential storage, Offline Profile (UUID v3), capability matrix | v1.0 | :white_check_mark: Complete |
| **D** | **Games & Import**: Isolated instances, Fabric adapter, Smart Drop review, zero-credential launcher importer | v1.0 | :white_check_mark: Complete |
| **E** | **Reliability**: Resumable downloads, checksums, atomic backups, corrupt file recovery | v1.0 | :white_check_mark: Complete |
| **F** | **Windows Release**: Branded icons, NSIS setup (`LOAM Setup.exe`), clean machine test, SHA-256 | v1.0 | :white_check_mark: Complete |
| **G** | **Support & Feedback**: Guided report, Discord Markdown under 1,800 chars, redacted diagnostics zip | v1.0 | :white_check_mark: Complete |
| **H** | **Updates**: Tauri updater with signature verification, release notes, user-confirmed update | Post-v1.0 | Planned |
| **I** | **Extended Ecosystem**: Authlib-injector third-party server support, Forge/NeoForge adapters | Post-v1.0 | Planned |

---

## Quickstart & Local Build

### Prerequisites
- Windows 10/11 x64
- [Node.js](https://nodejs.org/) v20+ or v22+
- [Rust](https://rustup.rs/) (stable channel, `x86_64-pc-windows-msvc`)
- Visual Studio 2022 C++ Build Tools

### Development Mode
```powershell
# 1. Clone the repository
git clone https://github.com/whynotdhyan/loam-launcher.git
cd loam-launcher

# 2. Install frontend dependencies
npm install

# 3. Launch with hot reload
npm run tauri dev
```

### Packaging Windows NSIS Installer
```powershell
npm run tauri build
```
The compiled installer will be located at:
`src-tauri/target/release/bundle/nsis/LOAM Setup 1.0.0.exe`

---

## Keyboard Shortcuts

- `Ctrl + Enter` — Play active game
- `Ctrl + N` — Create new game installation (`INSTALL +`)
- `Ctrl + K` — Open Command Palette
- `Ctrl + ,` — Open Settings
- `F1` — Open Support & Feedback
- `Esc` — Close active sheet or modal

---

## Privacy & Security

LOAM Launcher does not collect telemetry, analytics, or behavioral data.
- **Token Redaction**: All diagnostic logs pass through our Canary-tested regex sanitizer to strip bearer tokens, refresh tokens, and filesystem paths before export.
- **Zero Credential Sharing**: We never ask for or store passwords. Microsoft authentication is handed directly to your default operating system browser.
- **Responsible Disclosure**: Please review our [Security Policy](SECURITY.md) to report vulnerabilities.

---

## Legal & Trademark Notice

LOAM is an independent open-source launcher licensed under the GNU General Public License v3.0.  
**Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.**  
Minecraft is a registered trademark of Mojang Synergies AB.
