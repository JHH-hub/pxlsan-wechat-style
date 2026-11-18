# CLAUDE.md · pxlsan-wechat-style 像素离散公众号排版引擎与 Skill 导航

> 本文档与 [`AGENTS.md`](./AGENTS.md) 保持同步，面向 Claude Code 及所有参与 **`pxlsan-wechat-style`（像素离散 Pxlsan 品牌微信公众号排版工具与 AI Skill）** 维护及使用的 AI Agent。修改渲染逻辑、设计令牌或执行排版任务前请先阅读本文档。

---

## 1. 仓库定位与目录结构

本仓库既是独立的 **Node.js 零外部依赖公众号 HTML 渲染器**，也是可供 AI Agent 直接加载调用的 **Skill 仓库**（含 `SKILL.md` 与 `HL/` 演进记录）：

```
pxlsan-wechat-style/
├── SKILL.md                  ← AI Skill 主指令文档（工作流、Frontmatter、语法与风格原则）
├── README.md                 ← 项目能力概览与快速开始
├── package.json              ← CommonJS 配置（Node >= 18，零第三方 npm 依赖）
├── styles/
│   └── tokens.json           ← 品牌色彩令牌与三大主题（教程 / 平台 / 作品·美学）配置
├── scripts/
│   └── render.cjs            ← 核心渲染器：解析 Markdown → 生成预览页、内联正文 HTML 与封面 Prompt
├── examples/                 ← 长期保留的标杆示例（pxark-article.md / new-features.md / with-images.md）
├── output/                   ← 默认渲染产物目录（article.html / article-copy.html / article.md / cover-prompt.txt）
└── HL/                       ← Skill 自演进（Skill-Learning）历史记录（只读，勿手动修改）
    ├── notes.md
    └── rounds/
        ├── 001-baseline/
        ├── 002-token-rename-guard/
        └── 003-temp-file-placement/
```

---

## 2. 核心渲染流水线与 CLI 参数（`scripts/render.cjs`）

### 2.1 运行命令

```powershell
# 1. 渲染指定 Markdown 到默认 output/ 目录
node scripts/render.cjs examples/pxark-article.md

# 2. 自定义输出目录（--out）与强制指定主题类型（--type，优先级高于 frontmatter.type）
node scripts/render.cjs <input.md> --out <output-dir> --type "教程"

# 3. 运行内置示例脚本
npm run demo
```

### 2.2 四件套输出产物

每次执行 `render.cjs`，会在目标输出目录写入以下 4 个文件并向 stdout 打印 JSON 摘要：

1. `article.html`：本地可视化预览页（含顶部固定工具栏 `复制到公众号编辑器`、720px 手机模拟框 `#article`、底部 `封面图 Prompt` 一键复制卡片）。
2. `article-copy.html`：677px 最大宽度、100% 纯内联样式（Inline CSS）的公众号正文片段，可直接粘贴至微信公众号图文后台。
3. `article.md`：输入原始 Markdown 的完整备份。
4. `cover-prompt.txt`：自动提取标题（`# H1`）、首段导语（前 60 字）、前 3 个 `H2`/`H3` 关键词及当前主题 `coverStyle`，拼接而成的 900×383px 公众号封面图提示词（适用于即梦 AI / Midjourney）。

---

## 3. 设计令牌（`styles/tokens.json`）与主题机制

### 3.1 基础令牌（`tokens.colors`）
- 画布与卡片背景：`bg: #F8FAFC`、`panel: #EEF2FF`、`panel2: #FDF2F8`、`line: #DBEAFE`
- 语义品牌色：`blue: #2563EB`、`gold: #FBBF24`、`purple: #7C3AED`、`pink: #EC4899`
- 文本色：`text: #1E293B`、`muted: #64748B`
- 公众号标准宽度：`wechatWidth: "677px"`

### 3.2 三大主题（`tokens.themes` · 默认 `平台`）

`resolveTheme(fm)` 支持通过中文主题名（`教程` / `平台` / `作品·美学`）或英文 `id`（`tutorial` / `platform` / `aesthetic`）匹配：

| 主题键名 (`id`) | 主色 (`accent`) | Banner 角标 (`bannerLabel`) | H2 标签 (`h2Tag`) | 列表图标 (`listIcon`) | 适用场景 |
|---|---|---|---|---|---|
| `教程` (`tutorial`) | `#2563EB` | `PXLSAN · TUTORIAL` | `LESSON`（首个 H2 固定为 `START`） | `◆` | AI 绘画教程、工具与参数指南 |
| `平台` (`platform`) | `#7C3AED` | `PXLSAN · PROJECT NOTE` | `FEATURE`（首个 H2 固定为 `START`） | `★` | 像素离散产品发布、功能介绍（默认主题） |
| `作品·美学` (`aesthetic`) | `#D97706` | `PXLSAN · AESTHETIC` | `GALLERY`（首个 H2 固定为 `START`） | `✦` | 构图美学、光影色彩、作品赏析 |

---

## 4. 支持的 Markdown 语法与渲染细节

- **Frontmatter**：支持 `subtitle`（默认 `"以像素为笔，写离散的梦"`）、`author`、`date`、`type`。
- **标题**：
  - `# H1`：渲染为顶部渐变圆角大横幅（含 `bannerLabel`、H1 标题、`subtitle`、`author · date`）。
  - `## H2`：渲染为带上方英文角标（首个 H2 为 `START`，后续为 `theme.h2Tag`）与底部分割线的章节标题。
  - `### H3`：渲染为前缀 `✦ ` 的带边框浅色圆角胶囊卡片。
- **引用与 Callout 提示框**：
  - `> [!note|tip|warning|danger] 内容`：映射至 `CALLOUT_MAP`，渲染为蓝/绿/黄/红四色带图标提示框。
  - 普通 `> 引用`：渲染为左侧 5px 主题边框 + 渐变背景引用块。
- **代码块**：标准 ` ```lang ` 渲染为 `#0F172A` 深色终端卡片（顶部红黄绿三圆点 + 右侧大写语言标签，每行包裹 `<span style="display:block;min-height:1.4em;">` 保证复制到微信后换行与缩进不丢失）。
- **列表**：
  - 无序列表 `- / *`：包裹在圆角面板内，前缀主题色 `theme.listIcon`。
  - 有序列表 `1. `：采用 `display:flex` + 28×28px 圆角数字徽章布局（避免 `<table>` 在公众号窄屏下错位）。
- **表格**：标准 `| 列1 | 列2 |` + `|---|---|` 渲染为圆角外框、主题色表头、奇偶行斑马纹表格。
- **图片（4 种样式，必须独占一行）**：
  - 语法：`![说明文字|样式](url_or_relative_path)`，其中样式支持 `full`（默认圆角全宽）、`banner`（无圆角通栏）、`card`（浅色内边距卡片包裹）、`small`（居中 `max-width:75%`）。
  - **本地图片自动内联**：若路径非 `http(s)://` 且本地文件存在（相对于 `process.cwd()`），`resolveImage()` 会自动读取文件并转为 `data:image/...;base64,...` 嵌入 HTML。

---

## 5. 核心工程不变量与演进守则（必读红线）

1. **Token 改名守卫（源自 `HL/rounds/002-token-rename-guard`）**：
   - 修改 `styles/tokens.json` 中的任何字段名或层级前，**必须先在 `scripts/render.cjs` 中全局搜索所有引用点并同步更新**。`render.cjs` 使用模板字符串拼接内联 CSS，一旦读取到未定义的属性会静默输出 `undefined` 而不抛异常，导致公众号样式静默失效。
2. **临时文件隔离原则（源自 `HL/rounds/003-temp-file-placement`）**：
   - 仅用于一次性测试或验证的临时 `.md` 文件及输出产物，**必须写入系统/会话临时目录**，严禁写入本仓库根目录或 `examples/`。
   - `examples/` 目录仅存放具有长期参考价值的标杆示例；`output/` 目录为默认覆盖式产物区，不要在其中存放需要唯一持久化保存的手写稿件。
3. **`file://` 协议复制兼容性（源自 Git 提交 `645b380` / `dcf0dee` / `9cb3a90`）**：
   - 预览页 `article.html` 经常通过本地双击（`file://` 协议）打开，此时浏览器禁用 `navigator.clipboard` 且 iframe 方案受同源策略限制。
   - 因此，`copyArticle()` 函数**必须保留在 `<head><script>` 中定义**，且必须使用 `document.createRange()` + `range.selectNodeContents(document.getElementById('article'))` + `document.execCommand('copy')` 直接选中 DOM 节点复制富文本，**严禁改回仅支持 HTTPS 的 Clipboard API 或将 `<script>` 移到末尾导致未定义报错**。
4. **保护 `HL/` 只读记录**：
   - `HL/notes.md` 与 `HL/rounds/**` 由 skill-learning 流程维护，日常修改代码或排版时请勿手动编辑。
5. **安全与提交规范**：
   - MVP 阶段不接入微信公众号后台推送 API；若未来扩展草稿箱推送，`WECHAT_APP_ID` / `WECHAT_APP_SECRET` 必须严格保存在 `.gitignore` 忽略的本地 `.env` 中，严禁入库。
