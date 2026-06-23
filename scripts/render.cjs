const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const input = process.argv[2];
const outDir = path.resolve(root, 'output');

if (!input) {
  console.error('Usage: node scripts/render.cjs <article.md>');
  process.exit(1);
}

const mdPath = path.resolve(process.cwd(), input);
if (!fs.existsSync(mdPath)) {
  console.error(`Markdown file not found: ${mdPath}`);
  process.exit(1);
}

const tokens = JSON.parse(fs.readFileSync(path.join(root, 'styles', 'tokens.json'), 'utf8').replace(/^\uFEFF/, ''));
const md = fs.readFileSync(mdPath, 'utf8');
fs.mkdirSync(outDir, { recursive: true });

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function inline(text) {
  let s = escapeHtml(text);
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#2563EB;font-weight:800;">$1</strong>');
  s = s.replace(/`(.+?)`/g, '<code style="background:#EEF2FF;color:#2563EB;padding:2px 6px;border-radius:6px;font-size:13px;border:1px solid #DBEAFE;">$1</code>');
  return s;
}

function parseMarkdown(source) {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let list = [];
  let ordered = [];
  let para = [];

  function flushPara() {
    if (para.length) {
      blocks.push({ type: 'p', text: para.join(' ') });
      para = [];
    }
  }
  function flushList() {
    if (list.length) blocks.push({ type: 'ul', items: list.splice(0) });
    if (ordered.length) blocks.push({ type: 'ol', items: ordered.splice(0) });
  }

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushPara();
      flushList();
      continue;
    }
    if (/^#\s+/.test(line)) { flushPara(); flushList(); blocks.push({ type: 'h1', text: line.replace(/^#\s+/, '') }); continue; }
    if (/^##\s+/.test(line)) { flushPara(); flushList(); blocks.push({ type: 'h2', text: line.replace(/^##\s+/, '') }); continue; }
    if (/^###\s+/.test(line)) { flushPara(); flushList(); blocks.push({ type: 'h3', text: line.replace(/^###\s+/, '') }); continue; }
    if (/^>\s?/.test(line)) { flushPara(); flushList(); blocks.push({ type: 'quote', text: line.replace(/^>\s?/, '') }); continue; }
    if (/^[-*]\s+/.test(line)) { flushPara(); ordered = []; list.push(line.replace(/^[-*]\s+/, '')); continue; }
    if (/^\d+\.\s+/.test(line)) { flushPara(); list = []; ordered.push(line.replace(/^\d+\.\s+/, '')); continue; }
    para.push(line);
  }
  flushPara();
  flushList();
  return blocks;
}

function renderArticle(blocks) {
  const c = tokens.colors;
  let title = 'Pxlsan Article';
  const body = [];
  let firstH2 = true;

  blocks.forEach((b) => {
    if (b.type === 'h1') {
      title = b.text;
      body.push(`<section style="margin:0 0 26px;padding:30px 24px;border-radius:24px;background:linear-gradient(135deg,#111827 0%,#312E81 58%,#EC4899 100%);border:1px solid rgba(255,255,255,.16);box-shadow:0 18px 44px rgba(37,99,235,.20);">
  <p style="margin:0 0 12px;color:#93C5FD;font-size:13px;letter-spacing:2px;font-weight:900;">PXLSAN · PROJECT NOTE</p>
  <h1 style="margin:0;color:#FFFFFF;font-size:28px;line-height:1.28;font-weight:900;letter-spacing:-.5px;">${inline(b.text)}</h1>
  <p style="margin:16px 0 0;color:#E5E7EB;font-size:14px;line-height:1.8;">以像素为笔，写离散的梦</p>
</section>`);
      return;
    }
    if (b.type === 'quote') {
      body.push(`<blockquote style="margin:18px 0;padding:18px 18px 18px 20px;border-left:5px solid ${c.gold};border-radius:16px;background:linear-gradient(90deg,#EEF2FF,#FDF2F8);color:${c.goldSoft};font-size:15px;line-height:1.9;font-weight:600;">${inline(b.text)}</blockquote>`);
      return;
    }
    if (b.type === 'h2') {
      const tag = firstH2 ? 'START' : 'SECTION';
      firstH2 = false;
      body.push(`<section style="margin:30px 0 14px;">
  <p style="margin:0 0 6px;color:${c.cyan};font-size:12px;letter-spacing:2px;font-weight:800;">${tag}</p>
  <h2 style="margin:0;padding:0 0 10px;border-bottom:2px solid ${c.line};color:${c.text};font-size:22px;line-height:1.4;font-weight:900;">${inline(b.text)}</h2>
</section>`);
      return;
    }
    if (b.type === 'h3') {
      body.push(`<h3 style="margin:24px 0 12px;padding:12px 14px;border-radius:14px;background:${c.panel2};border:1px solid ${c.line};color:${c.gold};font-size:18px;line-height:1.5;font-weight:800;">✦ ${inline(b.text)}</h3>`);
      return;
    }
    if (b.type === 'p') {
      body.push(`<p style="margin:14px 0;color:${c.text};font-size:15.5px;line-height:2;letter-spacing:.2px;">${inline(b.text)}</p>`);
      return;
    }
    if (b.type === 'ul') {
      const items = b.items.map((x) => `<li style="margin:9px 0;color:${c.text};font-size:15px;line-height:1.8;"><span style="color:${c.gold};font-weight:900;">◆</span> ${inline(x)}</li>`).join('');
      body.push(`<section style="margin:18px 0;padding:16px 18px;border-radius:18px;background:${c.panel};border:1px solid ${c.line};"><ul style="margin:0;padding:0;list-style:none;">${items}</ul></section>`);
      return;
    }
    if (b.type === 'ol') {
      const items = b.items.map((x, i) => `<tr><td style="width:42px;vertical-align:top;"><span style="display:inline-block;width:28px;height:28px;line-height:28px;text-align:center;border-radius:10px;background:${c.gold};color:#fffaf0;font-weight:900;">${i + 1}</span></td><td style="padding-bottom:12px;color:${c.text};font-size:15px;line-height:1.8;">${inline(x)}</td></tr>`).join('');
      body.push(`<section style="margin:18px 0;padding:18px;border-radius:18px;background:${c.panel};border:1px solid ${c.line};"><table style="width:100%;border-collapse:collapse;">${items}</table></section>`);
    }
  });

  body.push(`<section style="margin:34px 0 0;padding:22px 20px;border-radius:22px;background:linear-gradient(135deg,#EEF2FF,#FDF2F8);border:1px solid #DBEAFE;text-align:center;">
  <p style="margin:0;color:${c.gold};font-size:18px;font-weight:900;">Pxlsan · 像素离散</p>
  <p style="margin:8px 0 0;color:${c.text};font-size:14px;line-height:1.8;">以像素为笔，写离散的梦</p>
</section>`);

  return { title, html: body.join('\n') };
}

const blocks = parseMarkdown(md);
const { title, html } = renderArticle(blocks);
const c = tokens.colors;
const copyHtml = `<section style="max-width:${tokens.wechatWidth};margin:0 auto;padding:20px 14px;background:${c.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif;box-sizing:border-box;">
${html}
</section>`;

const previewHtml = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)} - Pxlsan WeChat Preview</title>
<style>
body{margin:0;background:#f8fafc;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif}.wrap{max-width:980px;margin:0 auto;padding:28px 16px}.toolbar{position:sticky;top:0;z-index:2;margin:0 0 18px;padding:14px 16px;border:1px solid #DBEAFE;border-radius:18px;background:rgba(248,250,252,.94);backdrop-filter:blur(10px);display:flex;gap:12px;align-items:center;justify-content:space-between}.toolbar h1{margin:0;font-size:16px;color:#2563EB}.toolbar button{border:0;border-radius:12px;background:linear-gradient(135deg,#2563EB,#7C3AED);color:white;font-weight:800;padding:10px 14px;cursor:pointer}.phone{max-width:720px;margin:0 auto;border-radius:26px;overflow:hidden;border:1px solid #DBEAFE;box-shadow:0 20px 60px rgba(37,99,235,.12)}textarea{position:fixed;left:-9999px;top:-9999px}</style>
</head>
<body>
<div class="wrap">
  <div class="toolbar"><h1>Pxlsan WeChat Preview</h1><button onclick="copyArticle()">复制到公众号编辑器</button></div>
  <div class="phone" id="article">${copyHtml}</div>
</div>
<textarea id="copy">${escapeHtml(copyHtml)}</textarea>
<script>
async function copyArticle(){
  const html = document.getElementById('copy').value;
  const plain = document.getElementById('article').innerText;
  try{
    if (navigator.clipboard && window.ClipboardItem) {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([html], {type:'text/html'}),
          'text/plain': new Blob([plain], {type:'text/plain'})
        })
      ]);
      alert('已复制富文本，可直接粘贴到公众号图文正文区域');
      return;
    }
  }catch(e){}
  const range = document.createRange();
  const article = document.getElementById('article');
  range.selectNodeContents(article);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  document.execCommand('copy');
  sel.removeAllRanges();
  alert('已复制页面富文本，可粘贴到公众号图文正文区域');
}
</script>
</body>
</html>`;

fs.writeFileSync(path.join(outDir, 'article.html'), previewHtml, 'utf8');
fs.writeFileSync(path.join(outDir, 'article-copy.html'), copyHtml, 'utf8');
fs.writeFileSync(path.join(outDir, 'article.md'), md, 'utf8');
console.log(JSON.stringify({ success: true, title, preview: path.join(outDir, 'article.html'), copy: path.join(outDir, 'article-copy.html') }, null, 2));
