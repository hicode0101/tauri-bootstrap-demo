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

            // Hide the WebView2 default (browser) context menu globally.
            // Disabling it at the engine level also suppresses native menus
            // such as spellcheck suggestions.
            #[cfg(target_os = "windows")]
            {
                let main = app
                    .get_webview_window("main")
                    .expect("main window must exist");
                main.with_webview(|webview| unsafe {
                    use webview2_com::Microsoft::Web::WebView2::Win32::ICoreWebView2Settings6;
                    use windows::core::Interface;

                    let Ok(core) = webview.controller().CoreWebView2() else {
                        return;
                    };
                    let Ok(settings) = core.Settings() else {
                        return;
                    };
                    let Ok(settings6) = settings.cast::<ICoreWebView2Settings6>() else {
                        return;
                    };
                    let _ = settings6.SetAreDefaultContextMenusEnabled(false);
                })
                .expect("failed to disable WebView2 default context menu");
            }

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
