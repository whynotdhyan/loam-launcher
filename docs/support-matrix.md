# LOAM Compatibility & Support Matrix

## 1. Supported Operating Systems

| Operating System | Architecture | Status | Notes |
|---|---|---|---|
| Windows 11 | x64 (x86_64) | **Supported** | Full native support with Windows Snap Layouts & High Contrast mode |
| Windows 10 | x64 (x86_64) | **Supported** | Build 19041+ (May 2020 Update or later) |
| Windows (ARM64) | aarch64 | Experimental | Supported via x64 emulation or native ARM64 compilation |
| Linux / macOS | x64 / ARM64 | Roadmap | Planned for post-1.0 releases (core Rust backend is cross-platform) |

---

## 2. Minecraft Java Edition Versions

LOAM does not hard-code version tables; it queries the official Mojang version manifest in real time:

| Version Range | Status | Mod Loaders Supported | Java Requirement |
|---|---|---|---|
| **Minecraft 26.3 (Target)** | **Verified** | Vanilla, Fabric | OpenJDK 21 (Temurin / Microsoft) |
| **Minecraft 1.20.5 – 1.21.x** | **Verified** | Vanilla, Fabric | OpenJDK 21 |
| **Minecraft 1.18 – 1.20.4** | **Verified** | Vanilla, Fabric | OpenJDK 17 |
| **Minecraft 1.17 – 1.17.1** | **Verified** | Vanilla, Fabric | OpenJDK 16 |
| **Minecraft 1.16.1 – 1.16.5** | **Verified** | Vanilla, Fabric | OpenJDK 8 / OpenJDK 11 |
| < 1.16.1 (Legacy) | Out of Scope | None (v1.0 Non-goal) | Legacy versions requiring custom natives |

---

## 3. Account Capability Matrix

| Capability | Microsoft Account | Offline Profile | Third-Party (Gate I) |
|---|:---:|:---:|:---:|
| Singleplayer Worlds | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Local Area Network (LAN) | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Offline-Mode Servers | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Online-Mode Servers (Mojang Auth) | :white_check_mark: | :x: | :x: |
| Official Minecraft Realms | :white_check_mark: | :x: | :x: |
| Custom Skin & Cape Display | :white_check_mark: (Mojang profile) | Default Skin | Provider-defined |
| Verified Ownership Badge | `MICROSOFT ✓` | `OFFLINE PROFILE` | `THIRD-PARTY · host` |
