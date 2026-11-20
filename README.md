<div align="center">

# Tauri Bootstrap Demo

**Rust + Tauri 2 + Vue 3 打造的 Fluent 风格桌面应用起始模板**

无边框 Fluent 窗口 · 浅色/深色主题 · i18n 国际化 · 设置持久化 · 四平台 CI 发布

![Rust](https://img.shields.io/badge/Rust-stable-DEA584?logo=rust&logoColor=white)
![Tauri](https://img.shields.io/badge/Tauri-2.x-24C8D8?logo=tauri&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white)
![Naive UI](https://img.shields.io/badge/Naive_UI-2.x-18A058)

</div>

---

## 简介

一个开箱即用的 Windows 11 Fluent 风格桌面应用脚手架：Rust + Tauri 2 后端，Vue 3 + Vite + TypeScript + Naive UI 前端。内置标题栏 / 菜单栏 / 状态栏 / 设置与关于弹窗 / 主题与国际化 / 设置持久化 / CI 自动发布，复制目录、改个名字即可作为新项目的起点。

> AI 编码助手的项目规范约束见 [AGENTS.md](AGENTS.md)。

## ✨ 功能特性

**窗口与界面**

- 🪟 **无边框 Fluent 窗口**：自绘标题栏（拖拽、最小化 / 最大化 / 关闭），完全不透明，全局禁用 WebView2 浏览器内核默认右键菜单
- 📋 **顶部菜单栏**：「文件」（设置 / 退出）、「帮助」（关于），经典桌面交互（点击开合、悬停切换、Esc / 外部关闭），右侧固定主题切换与设置快捷按钮
- 📊 **状态栏**：就绪状态指示 + 技术栈标识 + 版本号（版本经 IPC 从 Rust 读取）
- 💬 **操作反馈 toast**：右下角 Fluent 通知卡片，成功 / 提示 / 失败 / 警告四种语义色

**主题与国际化**

- 🎨 **浅色 / 深色主题**：Fluent 设计令牌（CSS 变量）+ Naive UI 主题覆盖双轨统一，自绘控件与 Naive 组件观感一致
- 🌍 **i18n 国际化**：语言包独立 JSON（简体中文 / English / 跟随系统），切换立即生效，翻译无需改动组件代码

**工程化**

- ⚙️ **设置持久化**：语言、主题保存于 `{app_data_dir}/config.json`（Rust 侧读写），重启后恢复；浏览器环境静默降级，不阻塞启动
- 🔖 **版本号单一来源**：只改 `src-tauri/Cargo.toml` 一处，程序集信息 / 安装包 / 界面显示全部自动跟随
- 🔌 **IPC 示例**：`greet`、`app_version`、`get_config`、`save_config` 四个命令演示前后端通信
- 🖥️ **四平台 CI 发布**：Windows x64 / Linux x64 / macOS arm64 / macOS Intel（交叉编译），推 tag 即自动构建发布

## 🛠️ 技术栈

| 层 | 技术 |
|---|---|
| 后端 | Rust、Tauri 2.12、tauri-plugin-opener |
| 前端 | Vue 3 `<script setup>`、TypeScript strict、Vite 7、Naive UI 2.x、vue-i18n 11 |
| 状态 | `reactive` 模块单例（不依赖 vue-router / pinia / axios / tailwind） |

## 📦 环境要求

| 依赖 | 版本 |
|---|---|
| Node.js | ≥ 20.19（推荐 22+） |
| Rust | stable（Windows 需 MSVC toolchain） |
| WebView2 | Windows 10/11 通常自带 |

## 🚀 快速开始

```bash
# 1. 安装前端依赖
npm install

# 2. 开发模式（首次编译 Rust 需数分钟，窗口自动弹出）
npm run tauri:dev

# 3. 打包安装程序（NSIS / MSI）
npm run tauri:build
```

开发产物位于 `src-tauri/target/debug/`，发布产物位于 `src-tauri/target/release/bundle/`。

**纯浏览器调试**（不带 Tauri 窗口，前端功能自动降级）：

```bash
npm run dev        # 浏览器打开 http://localhost:1520
```

### Windows 本地构建脚本

也可以使用 `build.bat` 一键完成（详见脚本头部注释）：

| 命令 | 说明 |
|---|---|
| `build.bat` | Release 安装包（NSIS / MSI） |
| `build.bat dev` | 开发模式（热重载） |
| `build.bat debug` | 调试包（编译快） |
| `build.bat exe` | 仅调试 exe（最快） |
| `build.bat check` | 前端 typecheck + cargo check 质量门槛 |

### GitHub Actions 自动发布

配置在 `.github/workflows/release.yml`，两种触发方式：

```bash
# 方式一：推送 v* 标签，自动构建四平台并发布 Release
git tag v0.2.0 && git push origin v0.2.0

# 方式二：Actions 页面手动触发（workflow_dispatch），填入版本号
```

- **Windows x64**：NSIS + MSI 安装包、单 exe 绿色便携 zip（解压即用）
- **Linux x64**：AppImage + deb
- **macOS arm64**（M 系列）与 **macOS Intel**（在 arm64 runner 上交叉编译）
- 版本号以 tag 为准，构建前自动同步写入 Cargo.toml / package.json

## 📁 目录结构

```
tauri-bootstrap-demo/
├─ index.html                     # Vite 入口 HTML
├─ package.json                   # 脚本与依赖
├─ vite.config.ts                 # Vite 配置（@ 别名、1520 固定端口、语言包热刷新插件）
├─ scripts/
│  ├─ gen-icon.mjs                # 纯 JS 生成 1024x1024 源图标（无图片依赖）
│  ├─ sync-version.mjs            # Cargo.toml 版本镜像到 package.json（predev/prebuild 自动执行）
│  └─ icon.png                    # 生成的源图标，供 tauri icon 使用
├─ public/
│  ├─ favicon.svg
│  └─ locales/                    # ★ 语言包，一种语言一个 JSON，可整文件替换
│     ├─ zh-CN.json
│     └─ en-US.json
├─ src/
│  ├─ main.ts                     # 引导：加载设置 → 应用主题 → 加载语言 → 挂载
│  ├─ App.vue                     # NConfigProvider（主题/语言接线）+ 应用骨架
│  ├─ components/
│  │  ├─ TitleBar.vue             # 自绘标题栏（窗口控制按钮）
│  │  ├─ MenuBar.vue              # 顶部菜单栏（文件/帮助菜单 + 快捷按钮）
│  │  ├─ StatusBar.vue            # 状态栏（就绪状态 / 版本号）
│  │  ├─ WelcomeView.vue          # 欢迎页（含 greet IPC 演示）
│  │  ├─ SettingsDialog.vue       # 设置弹窗（主题下拉、语言下拉）
│  │  ├─ AboutDialog.vue          # 关于弹窗（图标 / 版本 / 官网 / 作者）
│  │  └─ Icon.vue                 # 行内 SVG 图标组件
│  ├─ lib/
│  │  ├─ appInfo.ts               # 应用元信息常量（官网 / 作者）
│  │  ├─ dialogDrag.ts            # 弹窗标题栏拖拽（useDraggableCard）
│  │  ├─ i18n.ts                  # vue-i18n 封装：运行时加载 public/locales/*.json
│  │  ├─ theme.ts                 # 主题状态与应用（data-theme 属性）
│  │  ├─ tauri.ts                 # invoke 封装（api 对象）+ isTauri / openExternal
│  │  └─ icons.ts                 # Fluent 风格 SVG path 集合
│  ├─ stores/
│  │  ├─ settings.ts              # 设置状态：加载 / 更新 / 持久化
│  │  └─ ui.ts                    # 瞬时 UI 状态（弹窗开关等）
│  ├─ theme/
│  │  └─ fluent.ts                # ★ Naive UI 浅色/深色 GlobalThemeOverrides
│  └─ styles/
│     └─ global.css               # ★ Fluent 设计令牌（CSS 变量）与基础样式
└─ src-tauri/
   ├─ tauri.conf.json             # 窗口 / 打包 / 标识符配置
   ├─ Cargo.toml                  # 版本号唯一来源；lib 名 = {package}_lib
   ├─ capabilities/default.json   # 权限声明（窗口控制等）
   ├─ icons/                      # npx tauri icon 生成的全平台图标
   └─ src/
      ├─ main.rs
      ├─ lib.rs                   # Builder：setup 加载配置 + 注册命令 + 禁用 WebView2 右键菜单
      ├─ config.rs                # AppConfig：读写 {app_data_dir}/config.json
      └─ commands/mod.rs          # get_config / save_config / app_version / greet
```

★ 标记的两处是主题相关、修改最频繁的位置（CSS 变量与 Naive 主题覆盖需保持一致）。

## 📖 常见开发指南

**新增一种语言**：① 在 `public/locales/` 新增 JSON（结构照抄 `zh-CN.json`）→ ② `src/lib/i18n.ts` 的 `LANGUAGE_PREFERENCES` 追加 locale → ③ `SettingsDialog.vue` 的 `languageOptions` 追加选项（显示名用语言原生写法）。

**新增 Tauri 命令（IPC）**：① `src-tauri/src/commands/mod.rs` 写 `#[tauri::command]` → ② `lib.rs` 的 `invoke_handler!` 注册 → ③ `src/lib/tauri.ts` 的 `api` 对象封装，组件内调用。

**主题定制**：颜色 / 描边 / 文本 / 阴影 / 圆角等令牌在 `src/styles/global.css` 的 `:root` 与 `[data-theme="dark"]` 两组 CSS 变量中；Naive UI 对应覆盖在 `src/theme/fluent.ts`。两处取值需一致。

**版本号管理**：只改 `src-tauri/Cargo.toml` 的 `[package] version`，其余（程序集信息、安装包、界面显示、package.json）自动跟随；前端展示一律调用 `api.appVersion()`，禁止硬编码。

**基于模板创建新项目**：复制目录（排除 `node_modules`、`src-tauri/target`、`dist`）→ 全局替换应用名（package.json / Cargo.toml / tauri.conf.json / index.html / 语言包）→ 换图标（`npm run gen:icon`）→ `npm install && npm run tauri:dev` 验证。完整清单见 [AGENTS.md](AGENTS.md) 第 10 节。

## 📄 相关文档

- [AGENTS.md](AGENTS.md) — 面向 AI 编码助手的完整项目规范（技术栈约定、质量门槛、目录与命名规则）
- [build.bat](build.bat) — Windows 本地构建脚本用法
