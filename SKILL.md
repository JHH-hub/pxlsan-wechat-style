---
name: pxlsan-wechat-style
cn_name: 像素离散公众号排版
description: 将 Markdown、项目 README、产品介绍转换为 Pxlsan 像素离散品牌风格的公众号文章 HTML；当用户要求“公众号排版”“Pxlsan 风格排版”“生成公众号预览”“把项目写成公众号文章”“做成可复制到公众号的 HTML”时使用。MVP 版不接公众号 API，不推送草稿箱，只生成本地预览与可复制 HTML。
version: 0.1.0
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
3. 将文章保存为 Markdown。
4. 运行渲染脚本：

```powershell
cd "<skillDir>" ; & node scripts/render.cjs "<markdown-file>"
```

5. 输出：
   - `output/article.html`：本地预览页
   - `output/article-copy.html`：公众号正文 HTML
   - `output/article.md`：文章 Markdown

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
