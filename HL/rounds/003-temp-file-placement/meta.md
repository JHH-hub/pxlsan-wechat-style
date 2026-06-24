---
id: 3
kind: iter
date: 2026-06-24T03:45:00Z
parent-round: 2
skill-commit: 809f6ffdd866
criteria-version: 0
user-confirmation: accepted
---


## Hypothesis

在 SKILL.md 的工作流说明中明确区分"临时验证文件"和"留存 example 文件"的存放位置；预期 AI 执行时不再把一次性测试 md 写进 skill 仓库的 examples/ 或根目录，而是写到 BoxAI session temp 目录（`D:\sd-webui-forge-aki-v1.0\.session_tmps\<sessionId>\`）。若下次验证脚本时测试文件又出现在 skill 仓库里，则该假设被证伪。

## Outcome

用户接受。在 SKILL.md 的工作流章节末尾补充"临时文件规则"说明：验证用的临时 .md 写到 BoxAI session temp 目录；只有真正要保留的示例才放 examples/。

## Reflection

每次生成"只用于验证，不留在仓库"的测试文件时，必须写到 BoxAI session temp 目录（`<user_info>` 里的 Session Temporary Directory），而不是 skill 仓库的任何子目录。examples/ 只放有长期参考价值的示例。这个坑在两次会话里都触发了，说明需要在 SKILL.md 里显式写明，否则 AI 会自然地把测试文件落到 skill 目录。
