use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::Manager;

/// Application settings persisted to `{app_data_dir}/config.json`.
/// Field values mirror what the frontend stores, so both sides agree.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(default)]
pub struct AppConfig {
    /// system | zh-CN | en-US
    pub language: String,
    /// light | dark
    pub theme: String,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            language: "system".into(),
            theme: "light".into(),
        }
    }
}

pub struct AppState {
    pub config: std::sync::Mutex<AppConfig>,
}

impl AppConfig {
    fn config_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
        let dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
        fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
        Ok(dir.join("config.json"))
    }

    pub fn load(app: &tauri::AppHandle) -> Result<Self, String> {
        let path = Self::config_path(app)?;
        if path.exists() {
            let raw = fs::read_to_string(&path).map_err(|e| e.to_string())?;
            serde_json::from_str(&raw).map_err(|e| e.to_string())
        } else {
            Ok(Self::default())
        }
    }

    pub fn save(&self, app: &tauri::AppHandle) -> Result<(), String> {
        let path = Self::config_path(app)?;
        let json = serde_json::to_string_pretty(self).map_err(|e| e.to_string())?;
        fs::write(&path, json).map_err(|e| e.to_string())
    }
}
