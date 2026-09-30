use regex::Regex;
use serde::{Deserialize, Serialize};
use std::sync::OnceLock;

/// Generates a standardized LOAM Report ID (e.g. LOAM-7K3Q-92)
pub fn generate_report_id() -> String {
    use std::time::{SystemTime, UNIX_EPOCH};
    let nanos = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .subsec_nanos();
    let chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    let mut part1 = String::new();
    let mut n = nanos;
    for _ in 0..4 {
        let idx = (n % (chars.len() as u32)) as usize;
        part1.push(chars.chars().nth(idx).unwrap_or('X'));
        n /= chars.len() as u32;
    }
    let part2 = format!("{:02X}", nanos % 100);
    format!("LOAM-{}-{}", part1, part2)
}

/// Redaction engine for sanitizing sensitive data before logs or reports leave the system
pub struct DiagnosticRedactor;

static BEARER_REGEX: OnceLock<Regex> = OnceLock::new();
static XBL_TOKEN_REGEX: OnceLock<Regex> = OnceLock::new();
static USER_PATH_REGEX: OnceLock<Regex> = OnceLock::new();
static EMAIL_REGEX: OnceLock<Regex> = OnceLock::new();

impl DiagnosticRedactor {
    pub fn redact_text(input: &str) -> String {
        let bearer = BEARER_REGEX.get_or_init(|| {
            Regex::new(r"(?i)bearer\s+[a-zA-Z0-9_\-\.]{20,}").unwrap()
        });
        let xbl = XBL_TOKEN_REGEX.get_or_init(|| {
            Regex::new(r"(?i)xsts\s+[a-zA-Z0-9_\-\.]{20,}").unwrap()
        });
        let user_path = USER_PATH_REGEX.get_or_init(|| {
            Regex::new(r"(?i)[a-zA-Z]:\\Users\\[^\\]+").unwrap()
        });
        let email = EMAIL_REGEX.get_or_init(|| {
            Regex::new(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}").unwrap()
        });

        let s1 = bearer.replace_all(input, "Bearer [REDACTED_TOKEN]");
        let s2 = xbl.replace_all(&s1, "XSTS [REDACTED_TOKEN]");
        let s3 = user_path.replace_all(&s2, "C:\\Users\\[USER]");
        let s4 = email.replace_all(&s3, "[REDACTED_EMAIL]");
        s4.to_string()
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GuidedReportData {
    pub report_id: String,
    pub report_type: String,
    pub loam_version: String,
    pub os_version: String,
    pub total_ram_gb: u32,
    pub mc_version: String,
    pub loader: String,
    pub java_version: String,
    pub memory_mb: u32,
    pub account_type: String,
    pub happened: String,
    pub expected: String,
    pub steps: String,
}

impl GuidedReportData {
    /// Formats a Discord-ready summary strictly under 1,800 characters (Discord post limit is 2000)
    pub fn format_discord_summary(&self) -> String {
        let text = format!(
            "**LOAM report** {}\n\
             **Type:** {}\n\
             **LOAM:** {} · {} x64 · {} GB\n\
             **Game:** {} · {} · Java {} · {} MB\n\
             **Account type:** {}\n\
             **Happened:** {}\n\
             **Expected:** {}\n\
             **Steps:** {}\n\
             **Diagnostics zip:** attached (report ID above)",
            self.report_id,
            self.report_type,
            self.loam_version,
            self.os_version,
            self.total_ram_gb,
            self.mc_version,
            self.loader,
            self.java_version,
            self.memory_mb,
            self.account_type,
            self.happened.chars().take(400).collect::<String>(),
            self.expected.chars().take(400).collect::<String>(),
            self.steps.chars().take(400).collect::<String>()
        );

        let sanitized = DiagnosticRedactor::redact_text(&text);
        if sanitized.len() > 1800 {
            sanitized[..1800].to_string()
        } else {
            sanitized
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_canary_redaction_secrets() {
        // Canary Test planting fake secrets
        let sample_log = "Error during auth: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.secretpayload1234567890 \
                          Logged in user path: C:\\Users\\Administrator\\AppData\\Roaming\\LOAM \
                          User email: dhyan_player@gmail.com";

        let redacted = DiagnosticRedactor::redact_text(sample_log);

        assert!(!redacted.contains("secretpayload"));
        assert!(!redacted.contains("Administrator"));
        assert!(!redacted.contains("dhyan_player@gmail.com"));
        assert!(redacted.contains("Bearer [REDACTED_TOKEN]"));
        assert!(redacted.contains("C:\\Users\\[USER]"));
        assert!(redacted.contains("[REDACTED_EMAIL]"));
    }

    #[test]
    fn test_report_under_1800_chars() {
        let long_str = "a".repeat(1000);
        let report = GuidedReportData {
            report_id: "LOAM-TEST-01".into(),
            report_type: "Crash on launch".into(),
            loam_version: "1.0.0".into(),
            os_version: "Windows 11".into(),
            total_ram_gb: 16,
            mc_version: "26.3".into(),
            loader: "Fabric".into(),
            java_version: "21".into(),
            memory_mb: 4096,
            account_type: "Microsoft".into(),
            happened: long_str.clone(),
            expected: long_str.clone(),
            steps: long_str,
        };

        let summary = report.format_discord_summary();
        assert!(summary.len() <= 1800);
    }
}
