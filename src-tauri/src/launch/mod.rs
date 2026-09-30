use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LaunchPlan {
    pub instance_id: String,
    pub mc_version: String,
    pub java_binary: String,
    pub jvm_arguments: Vec<String>,
    pub main_class: String,
    pub game_arguments: Vec<String>,
}

impl LaunchPlan {
    /// Produces a safe, redacted vector of launch arguments suitable for export or diagnostics
    pub fn get_redacted_command_vector(&self) -> Vec<String> {
        let mut vector = vec![self.java_binary.clone()];
        for arg in &self.jvm_arguments {
            vector.push(arg.clone());
        }
        vector.push(self.main_class.clone());
        for arg in &self.game_arguments {
            if arg.starts_with("--accessToken") || arg.starts_with("--uuid") {
                vector.push("[REDACTED_AUTH]".to_string());
            } else {
                vector.push(arg.clone());
            }
        }
        vector
    }
}
