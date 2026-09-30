use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct KnownIssue {
    pub id: String,
    pub fingerprint: String,
    pub title: String,
    pub status: String,
    #[serde(rename = "fixedIn")]
    pub fixed_in: Option<String>,
    pub workaround: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct KnownIssuesFeed {
    pub schema: u32,
    pub issues: Vec<KnownIssue>,
}

impl KnownIssuesFeed {
    /// Attempts to match an error fingerprint against the known-issues feed
    pub fn find_match(&self, error_fingerprint: &str) -> Option<&KnownIssue> {
        self.issues.iter().find(|i| i.fingerprint == error_fingerprint)
    }
}
