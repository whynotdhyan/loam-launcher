use serde::{Deserialize, Serialize};

pub const OFFICIAL_MANIFEST_URL: &str =
    "https://piston-meta.mojang.com/mc/game/version_manifest_v2.json";

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ManifestLatest {
    pub release: String,
    pub snapshot: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ManifestVersionEntry {
    pub id: String,
    #[serde(rename = "type")]
    pub version_type: String,
    pub url: String,
    pub time: String,
    #[serde(rename = "releaseTime")]
    pub release_time: String,
    pub sha1: String,
    #[serde(rename = "complianceLevel")]
    pub compliance_level: Option<i32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VersionManifest {
    pub latest: ManifestLatest,
    pub versions: Vec<ManifestVersionEntry>,
}

impl VersionManifest {
    /// Filter releases starting from 1.16.1 through target release
    pub fn filter_supported_versions(&self, include_snapshots: bool) -> Vec<ManifestVersionEntry> {
        self.versions
            .iter()
            .filter(|v| {
                if v.version_type == "release" {
                    true
                } else if include_snapshots {
                    v.version_type == "snapshot"
                } else {
                    false
                }
            })
            .cloned()
            .collect()
    }
}
