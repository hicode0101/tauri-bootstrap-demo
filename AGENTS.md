# AGENTS.md — Tauri Bootstrap Demo 项目规范与约束

本文件面向 AI 编码助手与开发者。在本仓库中工作、或以本模板派生新应用时，**必须遵守**以下规范。
目标：所有派生应用保持统一的 Windows 11 Fluent 视觉、一致的目录结构、可靠的质量基线，并能按清单快速创建新应用。

---

## 1. 技术栈（固定，不得随意替换）

- **后端**：Rust + Tauri 2（桌面端）
- **前端**：Vue 3（`<script setup>` + Composition API）+ Vite 7 + TypeScript（strict）+ Naive UI 2.x + vue-i18n 11
- **明确不用**：vue-router、pinia、axios、tailwind 及其他 UI/CSS 框架
  - 页面切换用条件渲染 / 独立视图组件
  - 跨组件状态用 `src/stores/` 下的 `reactive` 模块（模块级单例，不装状态库）
  - 系统能力优先走 Tauri 命令
- 当前基线：`vite ^7` / `@vitejs/plugin-vue ^6` / `vue-tsc ^3` / `typescript ^5.9` / `@tauri-apps/api ^2` / `tauri 2.12.x` / `naive-ui ^2.41` / `vue-i18n ^11` / Node ≥ 20.19 / Rust stable (MSVC)
- 代码注释用英文（与现有代码一致）；面向用户的文案一律走 i18n

## 2. 目录结构约定

```
src/
├─ main.ts            # 引导顺序：loadSettings → applyTheme → setLanguage → mount（不得打乱）
├─ App.vue            # NConfigProvider 接线（主题/语言）+ 应用骨架（TitleBar/MenuBar/主区/StatusBar + 弹窗）
├─ components/        # 所有 Vue 组件；视图、弹窗、自绘框架件
├─ lib/               # 纯逻辑模块：i18n.ts / theme.ts / tauri.ts / icons.ts / appInfo.ts
├─ stores/            # reactive 状态模块：settings.ts（持久化设置）、ui.ts（瞬时 UI 状态）
├─ theme/fluent.ts    # Naive UI GlobalThemeOverrides（fluentLight / fluentDark）
└─ styles/global.css  # Fluent 设计令牌（CSS 变量）+ 基础样式 + 通用覆盖
public/locales/       # 语言包，一种语言一个 JSON
scripts/              # gen-icon.mjs（生成源图标）、sync-version.mjs（版本镜像）
src-tauri/src/        # main.rs → lib.rs（Builder）→ config.rs（配置持久化）→ commands/（Tauri 命令）
```

放置规则：新组件进 `components/`；纯函数/封装进 `lib/`；跨组件状态进 `stores/`；Tauri 命令封装进 `lib/tauri.ts` 的 `api` 对象。**组件里不得直接 `invoke()`**。

## 3. 构建与质量门槛

| 命令 | 用途 |
|---|---|
| `npm run dev` | 纯前端调试（http://localhost:1520） |
| `npm run build` | **质量门槛①**：`vue-tsc --noEmit`（strict + noUnusedLocals）+ `vite build`，零错误 |
| `cargo check` | **质量门槛②**：Rust 侧编译检查，**零警告** |
| `npm run tauri:dev` | 完整应用开发（首次编译 Rust 需数分钟） |
| `npm run tauri:build` | 打包 NSIS/MSI 安装程序 |
| `npm run gen:icon` | 重新生成全平台图标 |
| `npm run sync:version` | 手动同步版本号到 package.json（Cargo → package.json 镜像） |
| `build.bat <mode>` | 本地 Windows 构建脚本：`release`（NSIS/MSI 安装包）/ `dev` / `debug` / `exe`（仅调试 exe，最快）/ `check`（typecheck + cargo check） |

- **自动构建（GitHub Actions，`.github/workflows/release.yml`）**：
  - 触发：推送 `v*` 标签（`git tag v0.2.0 && git push origin v0.2.0`），或 Actions 页手动 `workflow_dispatch` 填版本号（如 0.2.0，不带 v）
  - 四平台矩阵：Windows x64（NSIS + MSI + 绿色便携 zip）、Linux x64（AppImage + deb）、macOS arm64（M 系列）、**macOS Intel（x86_64）在 macos-latest（arm64）runner 上交叉编译**（GitHub 已淘汰 Intel 云 runner）
  - 构建前自动执行 `node scripts/sync-version.mjs <tag版本>`，以 tag 为准写入版本
  - 派生新项目时需同步更新 workflow 中 `releaseName` 与便携 zip 命名里的应用名

- 任何改动完成前：①②必须全绿；UI 改动需自测 **浅色/深色 × 中文/English** 四种组合
- **端口 1520（strictPort）**：每个派生项目必须用互不冲突的独立端口，`vite.config.ts` 的 `port` 与 `src-tauri/tauri.conf.json` 的 `devUrl` 必须一致
- Windows 下停后台 dev server：`netstat -ano | grep :<port>` 找 PID 后 `taskkill //PID <pid> //F`（只停 npm 包装进程会残留 vite 子进程占端口）

## 4. 版本号管理（单一来源，强制）

- **唯一来源：`src-tauri/Cargo.toml` 的 `[package] version`。改版本号只改这一处**
- `src-tauri/tauri.conf.json` **禁止**写 `version` 字段（Tauri 自动回退 Cargo 版本 → Windows 程序集信息、安装包版本全部跟随）
- 前端**禁止**硬编码版本号；需要显示版本一律 `api.appVersion()`（IPC 读 `package_info()`）
- `package.json` 的版本由 `scripts/sync-version.mjs` 自动镜像（挂在 `predev`/`prebuild` 钩子）
- `scripts/sync-version.mjs` 两种模式：**无参 = 镜像**（Cargo → package.json）；**带参 = 设定**（`node scripts/sync-version.mjs 1.2.3`，支持 `v` 前缀与 `1.2.3-beta.1` 预发布号；CI 发布时以 tag 版本写入 Cargo.toml + package.json）
- 非版本类元信息（官网、作者等）放 `src/lib/appInfo.ts` 常量

## 5. 主题系统（Fluent / Windows 11 风格）

- **双处令牌必须保持一致**（改 accent/文本色/边框色等时两处同步改）：
  1. `src/styles/global.css` — `:root` 与 `[data-theme="dark"]` 两组 CSS 变量（自绘界面用）
  2. `src/theme/fluent.ts` — `fluentLight` / `fluentDark` 的 `GlobalThemeOverrides`（Naive 组件用）
- **禁止**在组件里写死颜色；自绘元素只用 CSS 变量，Naive 组件只靠主题覆盖
- 默认**浅色**；主题值只允许 `"light" | "dark"`；应用方式：`document.documentElement.dataset.theme` + `lib/theme.ts` 的 `resolvedTheme` ref（Naive 切换依据）
- 核心取值（保持一致，勿随意改）：
  - accent：浅 `#0067c0`（hover `#0078d4` / pressed `#005ba1`，accent 上文字白）；深 `#60cdff`（accent 上文字 `#003a5c`）
  - 窗口底：`rgba(243,243,243,.86)` / `rgba(32,32,32,.86)`（半透明露出 Mica）；弹层/卡片：`#ffffff` / `#2b2b2b`
  - 圆角：控件 4px（`--radius-sm`），弹窗/菜单 8px（`--radius-md`）；字体 Segoe UI Variable Text + 微软雅黑栈
- 布局常量：标题栏 `--titlebar-height: 40px`、菜单栏 36px、状态栏 30px
- 扩展第三套主题的改动点：`ThemeOption` 联合类型 → `fluent.ts` 新增覆盖对象 → 设置弹窗主题下拉选项（`themeOptions`）
- **已知坑**：Naive Dropdown 的行高、字号等尺寸变量由 `size` 预设以内联样式写入弹层根元素，**优先级高于主题覆盖**——调下拉行高必须用 `size="large"`，不能用主题覆盖 `optionHeight`；宽度/圆角类变量（`borderRadius`、`optionPrefixWidth`）可正常覆盖

## 6. i18n 规范

- vue-i18n `legacy: false` + `globalInjection: true`；组件内 `const { t } = useI18n()`
- 语言包：`public/locales/<locale>.json`，**一种语言一个文件**，按节组织（`app` / `menu` / `welcome` / `settings` / `status` / `about`）；运行时 `fetch` 加载（可整文件替换、换语言不用改代码）
- 语言偏好值：`"system" | "zh-CN" | "en-US"`；`system` 经 `navigator.language` 解析（`zh*` → `zh-CN`，否则 `en-US`），加载失败回退 `zh-CN`
- **组件中禁止硬编码界面文案**；语言下拉中语言名用原生写法（简体中文 / English），不翻译自身
- 消息文本避免 `@` 与 `|` 字符（vue-i18n 特殊语法）；插值用 `{name}` 形式
- 新增语言三步：① `public/locales/xx-XX.json`（照抄 zh-CN 结构）② `src/lib/i18n.ts` 的 `LANGUAGE_PREFERENCES` 追加 ③ `SettingsDialog.vue` 的 `languageOptions` 追加选项
- 从持久化/后端读回的偏好值必须先经 `normalizeLangOption` / `normalizeThemeOption` 归一化
- 语言包 JSON 在 `public/` 下、不在 vite 模块图内，改动不会自动触发 HMR——`vite.config.ts` 内置 `localeReloadPlugin` 监听该目录并触发整页刷新（开发期保证语言包缓存不陈旧）

## 7. 窗口与 UI 布局规范

- 窗口配置（`tauri.conf.json`）：`decorations: false` + `transparent: true` + Mica（Win11）+ 居中；默认 1080×720，min 800×560
- 自绘标题栏（`TitleBar.vue`）：整栏可拖拽（`data-tauri-drag-region`）；右侧仅 最小化/最大化/关闭 三钮；关闭钮 hover `#c42b1c` 白字
- 菜单栏（`MenuBar.vue`）：`NDropdown trigger="manual" size="large"`；经典菜单交互（点击开合、菜单打开后悬停切换、Esc/点击外部关闭）；下拉宽度 `min-width: 300px`（global.css）；破坏性项（退出）前加分隔线；**右侧快捷按钮区**：主题快速切换（月亮/太阳随状态）+ 设置齿轮
- 状态栏（`StatusBar.vue`）：左侧就绪指示（绿点），右侧技术栈标识 + 版本号（IPC 获取，浏览器环境隐藏）
- `body` 上 `user-select: none`（桌面质感）；滚动条用 Fluent 细样式（global.css）
- 图标：一律 `Icon.vue` + `src/lib/icons.ts` 行内 SVG（24 网格、1.6 圆角描边），新图标先加进 `icons.ts`，**不引第三方图标库**
- 弹窗：`NModal` + Fluent 卡片（`--bg-layer` / `--radius-md` / `--shadow-dialog` / 遮罩 `rgba(0,0,0,0.35)`）；设置行 = 左图标 + 标题/说明 + 右侧控件；**可能扩展多选项的设置用下拉框**（如主题、语言），二元开关才用 switch
- 主题入口有三处且必须状态联动：菜单栏快捷按钮、文件菜单→设置、帮助菜单→关于
- 自定义弹窗（NModal + 卡片）必须支持**标题栏拖拽移动**：统一用 `src/lib/dialogDrag.ts` 的 `useDraggableCard()`（把手绑 `onHeaderPointerDown`、卡片绑 `cardStyle`、关闭时 `reset()` 复位），不得各自手写拖拽逻辑

## 8. 设置持久化

- Rust（`src-tauri/src/config.rs`）：`AppConfig`（`#[serde(default)]`，字段全 String）+ `AppState`（`Mutex` 托管）；存 `{app_data_dir}/config.json`；命令 `get_config` / `save_config`（保存即落盘 + 更新托管状态）
- 前端（`src/stores/settings.ts`）：启动 `loadSettings` → 归一化 → `applyTheme`/`setLanguage`；`updateTheme`/`updateLanguage` 即时生效并异步持久化
- 新增设置项四处同步：`config.rs` 字段 → `settings` store → `SettingsDialog` 行 →（新枚举值）normalize 函数
- 浏览器环境（非 Tauri）读写失败必须 try/catch 静默降级为默认值，**不得阻塞启动流程**

## 9. Tauri IPC 与插件

- 新增命令三步：① `src-tauri/src/commands/mod.rs` 写 `#[tauri::command]` ② `lib.rs` 的 `invoke_handler!` 注册 ③ `lib/tauri.ts` 的 `api` 对象封装；组件只调 `api.*`
- 所有前端代码必须兼容纯浏览器运行（`isTauri()` 分支 + try/catch），保证无 Tauri 时可独立调试、可视化验证
- 外部链接用 `openExternal()`：Tauri 内走 `tauri-plugin-opener`，浏览器降级 `window.open`
- 新增插件四处接线：`Cargo.toml` 依赖 → `lib.rs` `.plugin()` → `capabilities/default.json` 权限（最小化，按需添加）→ 前端依赖/封装

## 10. 从本模板派生新应用（执行清单）

1. 复制整个目录（排除 `node_modules`、`src-tauri/target`、`dist`），`git init`
2. **改名**（缺一不可）：
   - `package.json` → `name`
   - `src-tauri/Cargo.toml` → `package.name` 与 `[lib] name`（下划线，如 `myapp_lib`），同步改 `src-tauri/src/main.rs` 的 `myapp_lib::run()`
   - `src-tauri/tauri.conf.json` → `productName`、窗口 `title`、`identifier`（反向域名）
   - `index.html` → `<title>`；`public/locales/*.json` → `app.name`
3. **选独立端口**：`vite.config.ts` 的 `port` + `tauri.conf.json` 的 `devUrl`（避开其他在跑的项目）；`build.bat` dev 模式的端口检查同步修改
4. **换图标**：改 `scripts/gen-icon.mjs` 图形（或放自有 1024×1024 PNG），`npm run gen:icon`
5. `src/lib/appInfo.ts` 换官网/作者；按需调整欢迎页文案（语言包 `welcome.*`）
6. **CI 改名**：`.github/workflows/release.yml` 中 `releaseName` 与 Windows 便携 zip 文件名里的应用名（`tauri-bootstrap-demo.exe` → 新 exe 名）
7. `npm install` → `npm run tauri:dev` 验证 → `npm run build.bat check` / `npm run build` + `cargo check` 全绿

## 11. 其他约束

- 不提交 `node_modules`、`dist`、`src-tauri/target`、`src-tauri/gen/schemas`（.gitignore 已覆盖）
- 文档同步：结构性改动需同步更新 `README.md`（面向人）与本文件（面向代理），两者保持一致
- npm 安装时 esbuild 的 postinstall 可能被 allowScripts 策略拦截——无害（二进制经平台子包提供），构建异常时 `npm install-scripts approve esbuild` 后重装
- 涉及透明窗口/Mica 的改动只保证 Windows 11；跨平台适配需另行验证（macOS 透明窗口需额外 feature）
