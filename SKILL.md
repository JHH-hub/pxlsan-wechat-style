---
name: pxlsan-wechat-style
cn_name: 像素离散公众号排版
description: 将 Markdown、项目 README、产品介绍转换为 Pxlsan 像素离散品牌风格的公众号文章 HTML；当用户要求"公众号排版""Pxlsan 风格排版""生成公众号预览""把项目写成公众号文章""做成可复制到公众号的 HTML"时使用。MVP 版不接公众号 API，不推送草稿箱，只生成本地预览与可复制 HTML。
description_zh: 像素离散公众号排版
description_en: Pxlsan WeChat Article Renderer
disable: false
agent_created: true
version: 0.2.0
---

# 像素离散公众号排版

用于把 Markdown / README / 项目说明转换成 Pxlsan 品牌风格公众号 HTML。

## 适用场景

- 用户要把项目介绍写成公众号文章
- 用户要公众号排版，但不满意普通 Markdown 模板
- 用户要 Pxlsan / 像素离散品牌风格
- 用户要本地预览和可复制到公众号后台的 HTML

## MVP 工作流

1. 获取输入内容：Markdown 文件、README 文件或用户提供的正文。
2. 如输入是 README，先改写成公众号文章结构：标题、导语、核心亮点、工作流、适用人群、结尾品牌卡。
3. （可选）在 Markdown 顶部添加 frontmatter 自定义 banner 信息：

```markdown
---
subtitle: 用一句话说清楚这篇文章是什么
author: 作者名
date: 2026-06-24
---
```

4. 将文章保存为 Markdown。
5. 运行渲染脚本：

```powershell
# 输出到默认 output/ 目录
cd "<skillDir>" ; & node scripts/render.cjs "<markdown-file>"

# 输出到自定义目录（--out 参数）
cd "<skillDir>" ; & node scripts/render.cjs "<markdown-file>" --out "<output-dir>"
```

6. 输出：
   - `article.html`：本地预览页（含"复制到公众号编辑器"按钮）
   - `article-copy.html`：公众号正文 HTML
   - `article.md`：原始 Markdown 备份

## 完整 AI 工作流示例

当用户说"帮我把这个 README 写成公众号文章"时，AI 应该：

**Step 1 — 改写文章**（AI 完成）

根据 README 内容起草公众号文章，结构如下：
- `# 标题` — 吸引人，不超过 20 字
- 导语段落（1-2 段，点出核心价值）
- `## 它能做什么` — 核心功能，用无序列表
- `## 怎么用` — 步骤，用有序列表 + 代码块
- `## 适合谁` — 目标用户
- `## 写在最后` — 品牌收尾

**Step 2 — 保存 Markdown**（AI 完成）

将文章写入 `<skillDir>/output/article.md`（或用户指定路径）。

**Step 3 — 渲染**（AI 执行命令）

```powershell
cd "<skillDir>" ; & node scripts/render.cjs output/article.md
```

**Step 4 — 告知用户**

渲染完成后告知用户：
- 预览地址：`output/article.html`（在浏览器打开）
- 复制方法：打开预览页，点击"复制到公众号编辑器"按钮，粘贴到公众号图文正文区

## Frontmatter 自定义

在 Markdown 文件顶部添加 `---` 块，可自定义 banner 区域：

| 字段 | 说明 | 默认值 |
|------|------|--------|
| `subtitle` | banner 副标题 | 以像素为笔，写离散的梦 |
| `author` | 作者名，显示在 banner 右下角 | 不显示 |
| `date` | 日期，与 author 合并显示 | 不显示 |

## 分割线

`---`（三个及以上短横线）渲染为品牌色渐变细线，可用于章节间视觉分隔：

```markdown
上一节内容

---

下一节内容
```

## Callout 提示框

基于 GitHub Callout 语法，支持 4 种风格：

```markdown
> [!note] 信息提示（蓝色）
> [!tip] 技巧提示（绿色）
> [!warning] 注意警告（黄色）
> [!danger] 危险操作（红色）
```

普通 `> 引用` 保持原有蓝紫渐变风格不变。

## 代码块支持

标准 fenced code block，支持语言标注（可选）：

````markdown
```javascript
const x = 'hello';
console.log(x);
```

```
无语言标注也可以
```
````

渲染效果：深色终端风格（`#0F172A` 背景），顶部红黄绿三点装饰 + 语言标注，等宽字体，保留缩进。

## 行内格式支持

| 语法 | 效果 |
|------|------|
| `**粗体**` | **蓝色加粗** |
| `*斜体*` | *紫色斜体* |
| `~~删除线~~` | ~~灰色删除线~~ |
| `` `代码` `` | 蓝色内联代码 |

## 表格支持

标准 Markdown 表格语法，表头行下方跟分隔线（`|---|---|`）即可自动识别：

```markdown
| 列1 | 列2 | 列3 |
|---|---|---|
| 内容 | 内容 | 内容 |
```

渲染效果：表头深色背景（品牌蓝），数据行斑马纹，圆角外框，公众号内联样式。

## 图片插入

支持 4 种图片样式，语法为 `![描述|样式](图片链接)`：

| 样式 | 语法 | 效果 |
|------|------|------|
| `full`（默认） | `![描述](url)` | 完整宽度，圆角边框 + 阴影，带说明文字 |
| `banner` | `![描述\|banner](url)` | 通栏横幅，无圆角无边框，适合文章顶部 |
| `card` | `![描述\|card](url)` | 卡片包裹，带内边距、背景色和边框 |
| `small` | `![描述\|small](url)` | 居中小图，最大宽度 75%，适合截图对比 |

使用规则：

- **在线图片**：直接使用 URL（`http://` / `https://` 开头），预览和公众号均可用
- **本地图片**：填写相对路径，脚本自动转 base64 嵌入；粘贴到公众号时需确认图片是否正常显示
- **说明文字**：alt 文本自动渲染为图片下方居中说明，留空 `![](url)` 则不显示
- 图片必须独占一行，不支持行内图片

## 风格原则

- 黑金科技感：深色背景、金色强调、少量蓝紫渐变
- 像素离散品牌感：结尾固定品牌卡，强调“以像素为笔，写离散的梦”
- 卡片化信息：功能点、步骤、亮点都用模块承载
- 公众号友好：使用内联样式，不依赖外链 CSS，不使用 JS 作为正文能力
- 克制排版：不做花哨模板堆叠，优先可读性和品牌一致性

## 后续可扩展

后续可以加入公众号 API 草稿箱推送：

- 本地 `.env` 保存 `WECHAT_APP_ID` / `WECHAT_APP_SECRET`
- 自动检测 IP 白名单
- 上传封面图素材
- 上传正文图片素材
- 创建图文草稿
- 返回草稿 `media_id`

MVP 阶段不要推送草稿箱，避免配置和安全问题干扰样式验证。
