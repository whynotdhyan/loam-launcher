pub mod accounts;
pub mod catalog;
pub mod diagnostics;
pub mod games;
pub mod import;
pub mod java;
pub mod launch;
pub mod support;

use accounts::{AccountProfile, AccountType};
use diagnostics::{generate_report_id, GuidedReportData};
use games::GameInstance;
use std::sync::Mutex;
use tauri::State;

pub struct AppState {
    pub accounts: Mutex<Vec<AccountProfile>>,
    pub games: Mutex<Vec<GameInstance>>,
    pub active_game_id: Mutex<Option<String>>,
    pub active_account_id: Mutex<Option<String>>,
}

#[tauri::command]
fn get_accounts(state: State<'_, AppState>) -> Result<Vec<AccountProfile>, String> {
    let accounts = state.accounts.lock().map_err(|e| e.to_string())?;
    Ok(accounts.clone())
}

#[tauri::command]
fn create_offline_account(name: String, state: State<'_, AppState>) -> Result<AccountProfile, String> {
    let profile = AccountProfile::new_offline(&name)?;
    let mut accounts = state.accounts.lock().map_err(|e| e.to_string())?;
    accounts.push(profile.clone());
    Ok(profile)
}

#[tauri::command]
fn get_game_instances(state: State<'_, AppState>) -> Result<Vec<GameInstance>, String> {
    let games = state.games.lock().map_err(|e| e.to_string())?;
    Ok(games.clone())
}

#[tauri::command]
fn create_game_instance(
    name: String,
    mc_version: String,
    loader: String,
    ram_mb: u32,
    state: State<'_, AppState>,
) -> Result<GameInstance, String> {
    let instance = GameInstance::new(&name, &mc_version, &loader, None, ram_mb);
    let mut games = state.games.lock().map_err(|e| e.to_string())?;
    games.push(instance.clone());
    Ok(instance)
}

#[tauri::command]
fn build_discord_report(report_data: GuidedReportData) -> Result<String, String> {
    Ok(report_data.format_discord_summary())
}

#[tauri::command]
fn get_new_report_id() -> String {
    generate_report_id()
}

pub fn run() {
    // Initial sample state matching the spec for first load
    let default_profile = AccountProfile::new_offline("Testing").unwrap();
    let default_game = GameInstance::new("Survival SMP", "26.3", "fabric", Some("0.16.9".into()), 4096);

    let state = AppState {
        accounts: Mutex::new(vec![default_profile.clone()]),
        games: Mutex::new(vec![default_game.clone()]),
        active_game_id: Mutex::new(Some(default_game.id)),
        active_account_id: Mutex::new(Some(default_profile.id)),
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            get_accounts,
            create_offline_account,
            get_game_instances,
            create_game_instance,
            build_discord_report,
            get_new_report_id
        ])
        .run(tauri::generate_context!())
        .expect("error while running LOAM launcher application");
}
