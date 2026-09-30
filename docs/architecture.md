# Architecture and Technical Design

LOAM is designed as a calm, high-performance desktop utility for Minecraft Java Edition. It combines a lightweight Rust native core via Tauri 2 with an editorial, Swiss-typography frontend built on React and TypeScript.

```
┌────────────────────────────────────────────────────────┐
│                   React + TypeScript UI                │
│         (Swiss Design, Tokens, Fast State, WCAG AA)     │
└───────────────────────────┬────────────────────────────┘
                            │ Tauri 2 IPC (Typed Commands & Events)
┌───────────────────────────▼────────────────────────────┐
│                    Rust Core (src-tauri)               │
│                                                        │
│  ┌───────────────┐ ┌───────────────┐ ┌──────────────┐  │
│  │   accounts    │ │    catalog    │ │  downloads   │  │
│  │ Microsoft/OFL │ │ Version Meta  │ │ Queue/Resume │  │
│  └───────────────┘ └───────────────┘ └──────────────┘  │
│  ┌───────────────┐ ┌───────────────┐ ┌──────────────┐  │
│  │     games     │ │    install    │ │    import    │  │
│  │ Isolated Sand │ │ Vanilla/Fabric│ │  Smart Drop  │  │
│  └───────────────┘ └───────────────┘ └──────────────┘  │
│  ┌───────────────┐ ┌───────────────┐ ┌──────────────┐  │
│  │     java      │ │    launch     │ │ diagnostics  │  │
│  │ Provisioning  │ │ Arg Vector    │ │   Canary/Zip │  │
│  └───────────────┘ └───────────────┘ └──────────────┘  │
└────────────────────────────────────────────────────────┘
```

---

## 1. Directory & Data Layout

User data is strictly isolated from the application binaries and stored per-user in `%APPDATA%\LOAM`:

```text
%APPDATA%\LOAM/
  cache/
    assets/                 # Shared Minecraft asset objects (hashed by SHA-1)
    libraries/              # Shared Minecraft & loader library JARs
    versions/               # Official version manifests and client JARs
    runtimes/               # Managed Adoptium/Temurin OpenJDK runtimes
    downloads/              # Resumable partial file segments
  games/
    <stable-id>/            # Unique opaque UUID (never user-input folder names)
      game.json             # Instance manifest: MC version, loader, JVM config
      mods/                 # Mod JARs (toggleable via .disabled atomic rename)
      config/               # Mod configuration files
      saves/                # Minecraft world saves (untouched by updates/uninstalls)
      resourcepacks/        # Resource packs
      shaderpacks/          # Shader packs
      logs/                 # Minecraft run logs (latest.log)
  backups/
    <stable-id>/            # Automatic pre-modification snapshots
  logs/                     # LOAM launcher runtime logs
  reports/                  # Redacted diagnostics zip bundles
```

---

## 2. Authentication Subsystem (`src-tauri/src/accounts`)

LOAM implements two primary identity modes:

1. **Microsoft Account (The Single Online Auth Flow)**:
   - OAuth 2.0 Authorization Code flow with **PKCE (RFC 7636)** via system default browser.
   - Loopback redirect on `127.0.0.1:<port>`.
   - Security: Zero embedded webviews, no client secrets embedded in binaries, no password access.
   - Entitlement Chain:
     $$\text{Azure/MS Token} \rightarrow \text{Xbox Live (user.auth.xboxlive.com)} \rightarrow \text{XSTS (xsts.auth.xboxlive.com)} \rightarrow \text{Minecraft API Login} \rightarrow \text{Entitlements Check} \rightarrow \text{Profile Fetch}$$
   - Only upon verification of `product_minecraft` entitlement does LOAM badge the account `MICROSOFT ✓`.
   - Secure Storage: Refresh tokens and credentials reside in **Windows Credential Manager** backed by the Windows DPAPI (Data Protection API).

2. **Offline Profile (`OFFLINE PROFILE`)**:
   - For local play, testing, LAN, and offline-mode servers.
   - Name format: 3–16 characters, `[A-Za-z0-9_]`.
   - Deterministic UUID v3 generation using standard vanilla scheme:
     `UUID.nameUUIDFromBytes("OfflinePlayer:<name>".getBytes(StandardCharsets.UTF_8))`
   - Clearly labeled throughout the UI to prevent ambiguity. Never claims ownership.

---

## 3. Version Catalog & Launch Engine (`catalog`, `java`, `launch`)

- **Live Manifest Discovery**: Real-time querying of `https://piston-meta.mojang.com/mc/game/version_manifest_v2.json`. Versions are never hard-coded.
- **Inheritance & Platform Rules**: Resolves `version.json` inheritance (used by Fabric/Quilt), evaluates OS/architecture rules (matching Windows x64), extracts natives into a temporary per-launch directory, and constructs classpath argument lists.
- **Java Discovery & Provisioning**: Validates JVM requirements per version (Java 8 for $\le 1.16.4$, Java 16 for $1.17$, Java 17 for $1.18$–$1.20.4$, Java 21 for $20.5$+ and $26.3$). Checks existing local runtimes before provisioning managed OpenJDK binaries.
- **Process Spawning**: Minecraft is executed using an **argument vector** (`std::process::Command`), passing isolated game paths directly to prevent shell injection or quoting vulnerabilities.

---

## 4. Smart Drop & Migration (`import`)

- Drag-and-drop support for Fabric mod JARs, `.mrpack` archives, resource packs, shaders, and world ZIPs.
- Archive Inspection: Deep inspection validates archive headers, checks against path traversal (`../`), zip bombs, and verifies mod metadata (`fabric.mod.json`) before moving files into the instance.
- **Migration from other launchers**: Copies only game data (`saves/`, `mods/`, `options.txt`, `servers.dat`). Never reads or transfers session tokens or credentials.

---

## 5. Privacy, Redaction & Canary Tests (`diagnostics`)

Before any report or log is exported:
- Access tokens, refresh tokens, and launch tokens are replaced with `[REDACTED_BEARER_TOKEN]`.
- User filesystem paths (`C:\Users\<username>\...`) are scrubbed to `C:\Users\[USER]\...`.
- A built-in canary test plants simulated token patterns across logs to verify 100% elimination prior to serialization.
