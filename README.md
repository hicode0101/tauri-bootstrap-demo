# Tauri Bootstrap Demo

基于 **Rust + Tauri 2 + Vue 3 + Vite + TypeScript + Naive UI** 的桌面应用起始模板。
目标是：以后创建同类项目时，直接复制本目录并按下方「如何基于此模板创建新项目」重命名即可快速起步。

> AI 编码助手与本项目/派生项目的规范约束统一见 [AGENTS.md](AGENTS.md)。

内置能力：

- 基本窗口程序：无边框窗口 + 自绘标题栏（拖拽、最小化 / 最大化 / 关闭），Windows 11 下启用 Mica 材质
- **顶部菜单栏**：「文件(F)」（设置 / 退出）、「帮助(H)」（关于），自绘 Fluent 风格，扩展方式见 `src/components/MenuBar.vue`
- **关于对话框**：应用图标、名称、版本、简介、官网链接（经 `tauri-plugin-opener` 用系统浏览器打开）、作者
- **版本号单一来源**：只改 `src-tauri/Cargo.toml` 的 `[package] version`，程序集 / 打包 / 界面显示全部自动跟随（见下文「版本号管理」）
- **Fluent 设计风格**：设计令牌集中在 `src/styles/global.css`，并通过 `src/theme/fluent.ts` 映射为 Naive UI 的 `GlobalThemeOverrides`，自绘控件与 Naive 组件主题统一
- **浅色 / 深色主题**，默认浅色，设置中一键切换
- **i18n 国际化**：语言文件独立存放（`public/locales/zh-CN.json`、`en-US.json`），设置下拉框支持「跟随系统 / 简体中文 / English」，切换立即生效
- **设置持久化**：语言、主题保存在 `{app_data_dir}/config.json`（Rust 侧读写），重启后恢复
- **Tauri IPC 示例**：`greet`、`app_version`、`get_config`、`save_config` 四个命令展示前后端通信

## 环境要求

- Node.js ≥ 20.19（推荐 22+）
- Rust（stable，含 MSVC toolchain）
- WebView2（Windows 11 自带）

## 快速开始

```bash
npm install            # 安装前端依赖
npm run tauri:dev      # 开发模式（首次会编译 Rust，需数分钟）
npm run tauri:build    # 打包安装程序（NSIS / MSI）
```

纯前端调试（不带 Tauri 窗口，浏览器打开 <http://localhost:1520>）：

```bash
npm run dev
```

Windows 本地构建也可以用脚本（用法见 `build.bat` 头部注释）：

```bat
build.bat            :: release 安装包（NSIS/MSI）
build.bat dev        :: 开发模式（热重载）
build.bat debug      :: 调试包（编译快）
build.bat exe        :: 仅调试 exe（最快）
build.bat check      :: typecheck + cargo check
```

## 自动构建与发布（GitHub Actions）

配置在 `.github/workflows/release.yml`，两种触发方式：

```bash
# 方式一：推送 v* 标签，自动构建四平台并发布 Release
git tag v0.2.0 && git push origin v0.2.0

# 方式二：Actions 页面手动触发（workflow_dispatch），填入版本号（如 0.2.0）
```

- 平台矩阵：Windows x64（NSIS + MSI + 绿色便携 zip）、Linux x64（AppImage + deb）、macOS arm64（M 系列）、**macOS Intel（x86_64，在 M 系列 runner 上交叉编译**——GitHub 已淘汰 Intel 云 runner）
- 版本号以 tag 为准：构建前自动执行 `scripts/sync-version.mjs <tag版本>` 写入 Cargo.toml（唯一来源）与 package.json；tauri.conf.json 有意不写 version 字段，程序集/安装包/界面显示版本全部自动跟随
- Windows 便携版为单 exe 的 zip，解压即用（WebView2 Win10/11 自带）
- 派生新项目时记得更新 workflow 里的 `releaseName` 与便携 zip 文件名中的应用名

## 目录结构（与 HiNote 项目保持一致的约定）

```
tauri-bootstrap-demo/
├─ index.html                     # Vite 入口 HTML
├─ package.json                   # 脚本与依赖
├─ vite.config.ts                 # Vite 配置（@ 别名、1520 固定端口，避开 HiNote 的 1420）
├─ tsconfig.json / tsconfig.node.json
├─ scripts/
│  ├─ gen-icon.mjs                # 纯 JS 生成 1024x1024 源图标（无图片依赖）
│  ├─ sync-version.mjs            # 把 Cargo.toml 版本镜像到 package.json（predev/prebuild 自动跑）
│  └─ icon.png                    # 生成的源图标，供 tauri icon 使用
├─ public/
│  ├─ favicon.svg
│  └─ locales/                    # ★ 语言文件，每种语言一个 JSON，可整文件替换
│     ├─ zh-CN.json
│     └─ en-US.json
├─ src/
│  ├─ main.ts                     # 引导：加载设置 → 应用主题 → 加载语言 → 挂载
│  ├─ App.vue                     # NConfigProvider（主题/语言接线）+ 应用骨架
│  ├─ components/
│  │  ├─ TitleBar.vue             # 自绘标题栏（窗口控制按钮）
│  │  ├─ MenuBar.vue              # 顶部菜单栏（文件/帮助菜单 + 右侧主题切换、设置快捷按钮）
│  │  ├─ StatusBar.vue            # 状态栏（就绪 / 版本号，版本来自 Rust）
│  │  ├─ WelcomeView.vue          # 欢迎页（含 greet IPC 演示）
│  │  ├─ SettingsDialog.vue       # 设置弹窗（主题下拉、语言下拉）
│  │  ├─ AboutDialog.vue          # 关于弹窗（图标 / 版本 / 官网 / 作者）
│  │  └─ Icon.vue                 # 行内 SVG 图标组件
│  ├─ lib/
│  │  ├─ appInfo.ts               # 应用元信息常量（官网 / 作者；版本号不在此定义）
│  │  ├─ dialogDrag.ts            # 弹窗拖拽移动（useDraggableCard composable）
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
   ├─ Cargo.toml                  # lib 名 = {package}_lib，main.rs 调用其 run()
   ├─ capabilities/default.json   # 权限声明（窗口控制等）
   ├─ icons/                      # npx tauri icon 生成的全平台图标
   └─ src/
      ├─ main.rs
      ├─ lib.rs                   # Builder：setup 加载配置 + 注册命令
      ├─ config.rs                # AppConfig：读写 {app_data_dir}/config.json
      └─ commands/mod.rs          # get_config / save_config / app_version / greet
```

★ 标记的三处是主题相关、修改最频繁的位置。

## 如何基于此模板创建新项目

1. 复制整个目录（不含 `node_modules`、`src-tauri/target`、`dist`），`git init`
2. 全局替换应用名（推荐顺序）：
   - `package.json` 的 `name`
   - `src-tauri/Cargo.toml` 的 `package.name` 与 `[lib] name`（下划线命名，如 `myapp_lib`），同步修改 `src-tauri/src/main.rs` 中的 `xxx_lib::run()`
   - `src-tauri/tauri.conf.json` 的 `productName`、窗口 `title`、`identifier`（反向域名）
   - `index.html` 的 `<title>`
   - 语言文件里的 `app.name`
3. 换图标：替换/修改 `scripts/gen-icon.mjs` 中的图形（或放入自己的 1024x1024 PNG），执行 `npm run gen:icon` 重新生成 `src-tauri/icons/`
4. `npm install` 后 `npm run tauri:dev` 验证

## 新增一种语言

1. 在 `public/locales/` 下新增 `ja-JP.json` 等（结构照抄 `zh-CN.json`）
2. 在 `src/lib/i18n.ts` 的 `LANGUAGE_PREFERENCES` 中追加该 locale
3. 在 `src/components/SettingsDialog.vue` 的 `languageOptions` 中追加选项（显示名用语言原生写法）

语言文件在运行时按需 `fetch` 加载，替换 JSON 无需改动组件代码。

## 主题定制

- 设计令牌（颜色 / 描边 / 文本 / 阴影 / 圆角）在 `src/styles/global.css` 的 `:root` 与 `[data-theme="dark"]` 两组 CSS 变量中
- Naive UI 组件的对应覆盖在 `src/theme/fluent.ts` 的 `fluentLight` / `fluentDark`
- **两处需保持一致**（accent、文本色、边框色等取值相同），这是「自绘控件 + Naive 控件主题统一」的关键

## 版本号管理

**唯一来源：`src-tauri/Cargo.toml` 的 `[package] version`。** 改版本号只改这一处：

| 消费方 | 获取方式 |
|---|---|
| Windows 程序集信息（exe 文件版本） | `tauri.conf.json` 省略 `version` 时自动回退到 Cargo.toml 版本，tauri-build 据此嵌入资源 |
| 安装包（NSIS / MSI） | 同上，bundle 版本跟随 |
| 界面显示（状态栏、关于对话框） | Rust `app_version` 命令读 `package_info()`，前端经 IPC 获取 |
| `package.json` | `npm run sync:version` 镜像（`predev` / `prebuild` 钩子自动执行） |

前端代码中**不允许**硬编码版本号；需要展示版本时调用 `api.appVersion()`。
官网、作者等元信息常量在 `src/lib/appInfo.ts`。

## 顶部菜单栏与关于对话框

- 菜单栏在 `src/components/MenuBar.vue`，数据驱动：加一个菜单 = 加一组 `options` + 一个 `<NDropdown>` 项。动作统一走 `onSelect`（如打开设置弹窗、关闭窗口退出）
- 关于对话框在 `src/components/AboutDialog.vue`，由 `ui.aboutOpen` 控制，与设置弹窗共用 `NModal` + Fluent 卡片模式
- 官网链接通过 `openExternal()`（`lib/tauri.ts`）打开：Tauri 内走 `tauri-plugin-opener`，纯浏览器降级为 `window.open`

## 设置持久化机制

前端 `src/stores/settings.ts` 持有 `language` / `theme`；变更后经 `save_config` 命令写入 Rust 侧 `{app_data_dir}/config.json`，启动时 `setup` 中加载并经 `get_config` 同步回前端。在纯浏览器环境（非 Tauri）运行时自动降级为默认值，方便前端独立调试。

## 新增 Tauri 命令（IPC）

1. 在 `src-tauri/src/commands/mod.rs` 中添加 `#[tauri::command]` 函数
2. 在 `src-tauri/src/lib.rs` 的 `invoke_handler!` 列表中注册
3. 在 `src/lib/tauri.ts` 的 `api` 对象中封装 `invoke("xxx", { ... })`，组件内直接调用
