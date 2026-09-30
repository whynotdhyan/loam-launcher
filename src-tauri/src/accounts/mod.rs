use serde::{Deserialize, Serialize};
use std::fmt;
use uuid::Uuid;

/// Account types supported by LOAM
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum AccountType {
    #[serde(rename = "microsoft")]
    Microsoft,
    #[serde(rename = "offline")]
    Offline,
    #[serde(rename = "third_party")]
    ThirdParty { host: String },
}

impl fmt::Display for AccountType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            AccountType::Microsoft => write!(f, "MICROSOFT ✓"),
            AccountType::Offline => write!(f, "OFFLINE PROFILE"),
            AccountType::ThirdParty { host } => write!(f, "THIRD-PARTY · {}", host),
        }
    }
}

/// Single Source of Truth for Account Capabilities (Section 2.2)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AccountCapabilities {
    pub verified_ownership: bool,
    pub singleplayer_and_lan: bool,
    pub online_mode_servers: bool,
    pub offline_mode_servers: bool,
    pub realms_access: bool,
    pub personal_skin: bool,
}

impl AccountCapabilities {
    pub fn for_type(account_type: &AccountType) -> Self {
        match account_type {
            AccountType::Microsoft => Self {
                verified_ownership: true,
                singleplayer_and_lan: true,
                online_mode_servers: true,
                offline_mode_servers: true,
                realms_access: true,
                personal_skin: true,
            },
            AccountType::Offline => Self {
                verified_ownership: false,
                singleplayer_and_lan: true,
                online_mode_servers: false,
                offline_mode_servers: true,
                realms_access: false,
                personal_skin: false,
            },
            AccountType::ThirdParty { .. } => Self {
                verified_ownership: false,
                singleplayer_and_lan: true,
                online_mode_servers: false,
                offline_mode_servers: true,
                realms_access: false,
                personal_skin: true,
            },
        }
    }
}

/// Unified Account Profile
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AccountProfile {
    pub id: String,
    pub username: String,
    pub account_type: AccountType,
    pub uuid: String,
    pub capabilities: AccountCapabilities,
    pub avatar_url: Option<String>,
}

impl AccountProfile {
    /// Creates a standard vanilla offline profile with deterministic UUID v3
    /// Formula: UUID.nameUUIDFromBytes("OfflinePlayer:<name>".getBytes(UTF_8))
    pub fn new_offline(name: &str) -> Result<Self, String> {
        let trimmed = name.trim();
        if trimmed.len() < 3 || trimmed.len() > 16 {
            return Err("Display name must be between 3 and 16 characters.".into());
        }
        if !trimmed.chars().all(|c| c.is_ascii_alphanumeric() || c == '_') {
            return Err("Display name can only contain letters, numbers, and underscores.".into());
        }

        let offline_string = format!("OfflinePlayer:{}", trimmed);
        let namespace = Uuid::NAMESPACE_DNS;
        let offline_uuid = Uuid::new_v3(&namespace, offline_string.as_bytes()).to_string();

        Ok(Self {
            id: format!("offline_{}", trimmed),
            username: trimmed.to_string(),
            account_type: AccountType::Offline,
            uuid: offline_uuid,
            capabilities: AccountCapabilities::for_type(&AccountType::Offline),
            avatar_url: None,
        })
    }

    /// Creates a verified Microsoft account representation
    pub fn new_microsoft(username: String, uuid: String, avatar: Option<String>) -> Self {
        Self {
            id: format!("ms_{}", uuid),
            username,
            account_type: AccountType::Microsoft,
            uuid,
            capabilities: AccountCapabilities::for_type(&AccountType::Microsoft),
            avatar_url: avatar,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_offline_profile_name_validation() {
        assert!(AccountProfile::new_offline("Alex").is_ok());
        assert!(AccountProfile::new_offline("Steve_123").is_ok());
        assert!(AccountProfile::new_offline("ab").is_err()); // too short
        assert!(AccountProfile::new_offline("very_long_invalid_name_over_16").is_err()); // too long
        assert!(AccountProfile::new_offline("Player!").is_err()); // invalid char
    }

    #[test]
    fn test_offline_uuid_deterministic() {
        let p1 = AccountProfile::new_offline("Testing").unwrap();
        let p2 = AccountProfile::new_offline("Testing").unwrap();
        assert_eq!(p1.uuid, p2.uuid);
        assert_eq!(p1.capabilities.online_mode_servers, false);
        assert_eq!(p1.capabilities.singleplayer_and_lan, true);
    }
}
