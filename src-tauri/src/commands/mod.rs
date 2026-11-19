use tauri::{AppHandle, State};

use crate::config::{AppConfig, AppState};

#[tauri::command]
pub fn get_config(state: State<AppState>) -> AppConfig {
    state.config.lock().unwrap().clone()
}

#[tauri::command]
pub fn save_config(
    app: AppHandle,
    state: State<AppState>,
    config: AppConfig,
) -> Result<(), String> {
    *state.config.lock().unwrap() = config.clone();
    config.save(&app)
}

/// App version from tauri.conf.json, shown in the status bar and About row.
#[tauri::command]
pub fn app_version(app: AppHandle) -> String {
    app.package_info().version.to_string()
}

/// Sample IPC command: the frontend sends a name, Rust replies with a greeting.
#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {name}! Greetings from the Rust backend.")
}
