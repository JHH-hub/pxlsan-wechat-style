# pxlsan-wechat-style

像素离散（Pxlsan）专属公众号排版 MVP。

目标：把 Markdown / 项目 README / 产品介绍转换为具有 Pxlsan 品牌风格的公众号 HTML，支持本地预览和复制。

## 当前能力

- Markdown 转品牌化公众号 HTML
- 黑金 / 像素 / 科技感视觉风格
- 标题首屏、引用导语、分节标题、功能列表、步骤卡片、品牌结尾卡
- 生成本地预览页
- 一键复制公众号正文 HTML

## 使用

```powershell
& node scripts/render.cjs examples/pxark-article.md
```

输出：

```text
output/article.html       # 本地预览页
output/article-copy.html  # 可复制到公众号后台的正文 HTML
output/article.md         # 原始 Markdown 备份
```

## 后续路线

- v0.2：多主题（黑金、像素蓝、樱粉、暗紫）
- v0.3：项目 README 自动改写为公众号文章
- v0.4：封面图 Prompt 生成
- v0.5：公众号 API 草稿箱推送
- v1.0：Pxlsan 组件库（数据卡、人物卡、时间线、教程步骤、产品 CTA）

## 品牌

Pxlsan · 像素离散  
以像素为笔，写离散的梦
