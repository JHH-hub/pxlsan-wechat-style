# pxlsan-wechat-style

像素离散（Pxlsan）专属公众号排版工具。

将 Markdown / 项目 README / 产品介绍转换为 Pxlsan 品牌风格的公众号 HTML，支持本地预览和一键复制。

## 当前能力（v0.2.0）

| 功能 | 说明 |
|---|---|
| Markdown 转公众号 HTML | 全内联样式，可直接粘贴到公众号编辑器 |
| 代码块 | 深色终端风格，支持语言标注，保留缩进 |
| 表格 | 品牌蓝表头 + 斑马纹数据行 |
| 图片 4 种样式 | `full` / `banner` / `card` / `small` |
| Callout 提示框 | `> [!note/tip/warning/danger]` 四色风格 |
| 有序 / 无序列表 | flexbox 布局，窄屏不错位 |
| 行内格式 | `**粗体**` / `*斜体*` / `~~删除线~~` / `` `代码` `` |
| 分割线 | `---` 渲染为品牌色渐变细线 |
| Frontmatter | `subtitle` / `author` / `date` 渲染到 banner |
| 本地图片 | 自动转 base64 嵌入，无需上传 |
| 自定义输出目录 | `--out <dir>` 参数 |
| 一键复制 | 预览页内置"复制到公众号编辑器"按钮 |

## 使用

```powershell
# 基本用法
& node scripts/render.cjs examples/pxark-article.md

# 输出到自定义目录
& node scripts/render.cjs article.md --out ./my-output
```

输出文件：

```
article.html       # 本地预览页（含复制按钮）
article-copy.html  # 公众号正文 HTML
article.md         # 原始 Markdown 备份
```

## Frontmatter

在 Markdown 顶部添加 `---` 块，自定义 banner 信息：

```markdown
---
subtitle: 用一句话说清楚这篇文章是什么
author: 作者名
date: 2026-06-24
---

# 文章标题
```

## Callout 提示框

```markdown
> [!note] 信息提示（蓝色）
> [!tip] 技巧提示（绿色）
> [!warning] 注意警告（黄色）
> [!danger] 危险操作（红色）
```

## 后续可扩展

- 代码块语法高亮着色
- 公众号 API 草稿箱推送（需微信认证服务号）
- 封面图 Prompt 自动生成

## 品牌

Pxlsan · 像素离散  
以像素为笔，写离散的梦
