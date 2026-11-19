pub mod commands;
pub mod config;

use config::AppConfig;
use tauri::Manager;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // Load persisted settings once and share them via managed state.
            let cfg = AppConfig::load(app.handle())?;
            app.manage(config::AppState {
                config: std::sync::Mutex::new(cfg),
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_config,
            commands::save_config,
            commands::app_version,
            commands::greet,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
