use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JavaRuntimeInfo {
    pub major_version: u32,
    pub path: PathBuf,
    pub vendor: String,
    pub is_valid_for_target: bool,
}

pub struct JavaDetector;

impl JavaDetector {
    /// Determines the required major Java version for a given Minecraft version string
    pub fn required_java_version(mc_version: &str) -> u32 {
        if mc_version.starts_with("26.") || mc_version.starts_with("1.20.5") || mc_version.starts_with("1.20.6") || mc_version.starts_with("1.21") {
            21
        } else if mc_version.starts_with("1.18") || mc_version.starts_with("1.19") || mc_version.starts_with("1.20") {
            17
        } else if mc_version.starts_with("1.17") {
            16
        } else {
            8
        }
    }
}
