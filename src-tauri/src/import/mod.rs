use serde::{Deserialize, Serialize};
use std::path::{Path, PathBuf};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum DroppedContentType {
    FabricMod,
    ResourcePack,
    ShaderPack,
    WorldSave,
    ModrinthPack,
    Unsupported(String),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SmartDropReview {
    pub file_name: String,
    pub content_type: DroppedContentType,
    pub file_size_bytes: u64,
    pub detected_version_compat: Option<String>,
    pub dependencies: Vec<String>,
    pub destination_relative_path: String,
    pub requires_backup: bool,
}

pub struct ArchiveSafetyChecker;

impl ArchiveSafetyChecker {
    /// Validates an entry path to ensure it cannot escape the target extraction directory (Zip Slip prevention)
    pub fn is_safe_path(target_base: &Path, entry_path: &Path) -> bool {
        // Disallow paths with parent components (..)
        if entry_path.components().any(|c| c == std::path::Component::ParentDir) {
            return false;
        }

        let full_path = target_base.join(entry_path);
        // Ensure path starts with the intended target directory
        full_path.starts_with(target_base)
    }
}

/// Launcher Migration Inspector (Section 2.6)
/// Strictly allowlists harmless game assets and guarantees credentials are never read
pub struct LauncherMigrator;

impl LauncherMigrator {
    /// Whitelist of safe folders and files allowed to be imported
    pub const SAFE_GAME_ITEMS: &'static [&'static str] = &[
        "saves",
        "mods",
        "resourcepacks",
        "shaderpacks",
        "options.txt",
        "servers.dat",
    ];

    /// Blacklist of sensitive credential and profile items that must NEVER be touched
    pub const BLOCKED_SECURITY_ITEMS: &'static [&'static str] = &[
        "launcher_profiles.json",
        "launcher_accounts.json",
        "launcher_msa_credentials.bin",
        "usercache.json",
        "tlauncher",
        "authlib",
        "tokens",
        "session",
        "credentials",
    ];

    /// Determines if a file/directory path is safe to import
    pub fn is_safe_to_import(relative_name: &str) -> bool {
        let lower = relative_name.to_lowercase();
        for blocked in Self::BLOCKED_SECURITY_ITEMS {
            if lower.contains(blocked) {
                return false;
            }
        }

        Self::SAFE_GAME_ITEMS.iter().any(|&item| lower == item || lower.starts_with(&format!("{}/", item)) || lower.starts_with(&format!("{}\\", item)))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_zip_slip_rejection() {
        let base = PathBuf::from("C:\\LOAM\\games\\instance_1");
        assert!(!ArchiveSafetyChecker::is_safe_path(&base, Path::new("../evil.exe")));
        assert!(!ArchiveSafetyChecker::is_safe_path(&base, Path::new("sub/../../evil.exe")));
        assert!(ArchiveSafetyChecker::is_safe_path(&base, Path::new("mods/testmod.jar")));
    }

    #[test]
    fn test_migration_credential_shielding() {
        // Forbidden files must never pass
        assert!(!LauncherMigrator::is_safe_to_import("launcher_accounts.json"));
        assert!(!LauncherMigrator::is_safe_to_import("launcher_profiles.json"));
        assert!(!LauncherMigrator::is_safe_to_import("tlauncher_accounts.json"));
        assert!(!LauncherMigrator::is_safe_to_import("session.lock"));

        // Allowed game data files must pass
        assert!(LauncherMigrator::is_safe_to_import("saves"));
        assert!(LauncherMigrator::is_safe_to_import("mods"));
        assert!(LauncherMigrator::is_safe_to_import("resourcepacks"));
        assert!(LauncherMigrator::is_safe_to_import("options.txt"));
        assert!(LauncherMigrator::is_safe_to_import("servers.dat"));
    }
}
