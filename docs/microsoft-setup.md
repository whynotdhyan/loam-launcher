# Microsoft Authentication & Azure App Registration

LOAM Launcher uses the official OAuth 2.0 Authorization Code flow with **PKCE (Proof Key for Code Exchange)** for Microsoft account sign-in. This flow ensures that LOAM never prompts for or stores user Microsoft passwords, and no client secret is bundled in distributed binaries.

---

## 1. Registering an Azure Application (Owner Setup)

To allow LOAM to authenticate Microsoft accounts:

1. Sign in to the [Microsoft Entra Admin Center](https://entra.microsoft.com/) or Azure Portal.
2. Navigate to **App registrations** $\rightarrow$ **New registration**.
3. Configure the application:
   - **Name**: `LOAM Launcher`
   - **Supported account types**: `Accounts in any organizational directory (Any Microsoft Entra ID tenant - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)`
   - **Redirect URI**: Select **Mobile and desktop applications** and enter:
     `http://localhost` (or loopback socket `http://127.0.0.1`)
4. Under **Authentication**:
   - Check **Allow public client flows**: `Yes`
   - Enable **PKCE** (enforced by default for public clients).
5. Under **API permissions**:
   - Add permission: `XboxLive.signin` (Delegated)
   - Add permission: `offline_access` (to allow silent token refresh)

---

## 2. Minecraft Services Entitlement Access

> [!IMPORTANT]
> Mojang / Xbox requires desktop client IDs to be authorized for accessing the Minecraft Services endpoints (`api.minecraftservices.com/entitlements/mcstore` and `/minecraft/profile`).
> If your Azure application ID has not yet received Minecraft API whitelisting from Microsoft/Mojang, the `/launcher/login` endpoint will return HTTP `401 Unauthorized` or `403 Forbidden`.

### Honest Blocker Handling in LOAM
When an unregistered or pending Client ID encounters this API restriction:
- LOAM **never** fakes an account or pretends sign-in succeeded.
- LOAM presents a clear configuration banner directing the administrator to this document.
- In automated test suites and gate verification reports, Gate C is truthfully marked as **BLOCKED (Requires Azure/Mojang Partner Authorization)** while local Offline Profiles remain 100% operational.

---

## 3. Storage in Windows Credential Manager

LOAM persists authentication tokens exclusively in the Windows Credential Manager:
- **Target Name**: `LOAM:MicrosoftAccount:<UUID>`
- **Encryption**: Protected by Windows DPAPI (Data Protection API) tied to the logged-in Windows user account.
- **Wipe on Sign-out**: Signing out deletes the stored Windows credential and flushes any cached profile avatar from memory.
