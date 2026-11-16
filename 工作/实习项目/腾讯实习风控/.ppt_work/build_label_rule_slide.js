const pptxgen = require('./pptenv/node_modules/pptxgenjs');
const pptx = new pptxgen();
pptx.defineLayout({ name: 'CUSTOM_WIDE', width: 13.333, height: 7.5 });
pptx.layout = 'CUSTOM_WIDE';
pptx.author = '彭硕';
pptx.title = '清晰度五级标签：规则预标注';
pptx.subject = '实习答辩单页';
pptx.lang = 'zh-CN';
pptx.theme = { headFontFace: 'PingFang SC', bodyFontFace: 'PingFang SC', lang: 'zh-CN' };

const C = {
  ink: '111827', muted: '475467', line: 'CBD5E1', white: 'FFFFFF', paper: 'FFFFFF',
  blue: '1769D2', blue2: 'EDF5FF', teal: '087A66', teal2: 'E9F8F3',
  orange: 'D96D0B', orange2: 'FFF2E5', purple: '6546A5', purple2: 'F2EEFA',
  red: 'C9332C', red2: 'FFF0EF', green: '087A55', green2: 'E7F8F0', gray: 'F8FAFC'
};
const FONT = 'PingFang SC';
const MONO = 'Menlo';
const OUT = '/Users/xqer/person_doc/实习项目/风控/清晰度规则预标注-单页.pptx';

function text(s, t, x, y, w, h, o = {}) {
  s.addText(t, { x, y, w, h, fontFace: o.fontFace || FONT, fontSize: o.fontSize || 14,
    color: o.color || C.ink, bold: o.bold || false, margin: o.margin === undefined ? 0 : o.margin,
    align: o.align || 'left', valign: o.valign || 'mid', fit: 'shrink', breakLine: false, ...o });
}
function rect(s, x, y, w, h, fill = C.white, line = C.line, radius = true, width = 1) {
  s.addShape(radius ? pptx.ShapeType.roundRect : pptx.ShapeType.rect, {
    x, y, w, h, fill: { color: fill }, line: { color: line, width }
  });
}
function pill(s, t, x, y, w, fill, color) {
  rect(s, x, y, w, 0.33, fill, fill, true, 0.5);
  text(s, t, x, y + 0.01, w, 0.29, { fontSize: 9.5, color, bold: true, align: 'center' });
}
function circle(s, n, x, y, color) {
  s.addShape(pptx.ShapeType.ellipse, { x, y, w: 0.34, h: 0.34, fill: { color }, line: { color } });
  text(s, String(n), x, y + 0.015, 0.34, 0.29, { fontSize: 10, color: C.white, bold: true, align: 'center' });
}
function arrow(s, x, y, w) {
  s.addShape(pptx.ShapeType.rightArrow, { x, y, w, h: 0.20, fill: { color: '94A3B8' }, line: { color: '94A3B8' } });
}
function bullet(s, t, x, y, w, color = C.ink) {
  s.addShape(pptx.ShapeType.ellipse, { x, y: y + 0.09, w: 0.08, h: 0.08, fill: { color }, line: { color } });
  text(s, t, x + 0.16, y, w - 0.16, 0.30, { fontSize: 11, color, valign: 'top' });
}

const s = pptx.addSlide();
s.background = { color: C.paper };
text(s, '清晰度五级标签：规则预标注', 0.55, 0.30, 8.2, 0.48, { fontSize: 26, bold: true });
text(s, '先估计“多少文字不可辨”，再区分轻微模糊，并补偿 OCR 完全漏检', 0.57, 0.85, 9.7, 0.30, { fontSize: 12.5, color: C.muted });
pill(s, '用于低成本生成初始标签', 10.55, 0.44, 2.20, C.blue2, C.blue);

// Stage 1
rect(s, 0.55, 1.45, 2.25, 4.85, C.white, C.line, true, 1.2);
circle(s, 1, 0.82, 1.73, C.blue);
text(s, '输入预处理', 1.27, 1.68, 1.20, 0.38, { fontSize: 16, bold: true });
pill(s, 'OCR + 印章排除', 0.82, 2.20, 1.70, C.blue2, C.blue);
text(s, '逐行提取', 0.82, 2.77, 0.80, 0.26, { fontSize: 11, bold: true });
bullet(s, '行置信度', 0.84, 3.12, 1.60);
bullet(s, '字符数', 0.84, 3.50, 1.60);
bullet(s, '文本框面积', 0.84, 3.88, 1.60);
rect(s, 0.82, 4.50, 1.70, 1.05, C.gray, C.line, true, 0.8);
text(s, '轻量印章检测', 0.98, 4.66, 1.38, 0.28, { fontSize: 12, color: C.purple, bold: true, align: 'center' });
text(s, '排除印章遮挡区域\n避免拉低正文置信度', 0.98, 5.00, 1.38, 0.42, { fontSize: 9.7, color: C.ink, align: 'center' });
text(s, '输出：有效正文 OCR 行', 0.82, 5.86, 1.70, 0.26, { fontSize: 10, color: C.blue, bold: true, align: 'center' });

arrow(s, 2.93, 3.72, 0.32);

// Stage 2
rect(s, 3.38, 1.45, 4.50, 4.85, C.white, C.line, true, 1.2);
circle(s, 2, 3.67, 1.73, C.teal);
text(s, '基础等级判定', 4.12, 1.68, 1.55, 0.38, { fontSize: 16, bold: true });
pill(s, 'OCR 可辨识度', 6.15, 1.74, 1.38, C.teal2, C.teal);
rect(s, 3.70, 2.22, 3.85, 0.56, C.teal2, C.teal2, true, 0.5);
text(s, 'w = 0.7 × 字数 + 0.3 × 文本框相对面积', 3.88, 2.30, 3.49, 0.32, { fontFace: MONO, fontSize: 11, color: C.teal, bold: true, align: 'center' });
rect(s, 3.70, 2.93, 3.85, 0.64, C.blue2, C.blue2, true, 0.5);
text(s, 'unreadable_ratio = 不可辨权重 / 全部权重', 3.88, 3.02, 3.49, 0.34, { fontFace: MONO, fontSize: 10.6, color: C.blue, bold: true, align: 'center' });
text(s, '不可辨：行置信度 < 80%', 3.82, 3.67, 3.60, 0.27, { fontSize: 10.5, color: C.muted, bold: true, align: 'center' });

const levels = [
  ['ratio ≥ 90%  或均值 < 60', 'Level 5', C.red, C.red2],
  ['ratio ≥ 50%  或均值 < 75', 'Level 4', C.orange, C.orange2],
  ['ratio ≥ 10%', 'Level 3', C.purple, C.purple2]
];
levels.forEach((v, i) => {
  const yy = 4.12 + i * 0.52;
  rect(s, 3.70, yy, 3.85, 0.40, v[3], v[3], true, 0.5);
  text(s, v[0], 3.88, yy + 0.04, 2.60, 0.27, { fontSize: 10.2, bold: true });
  text(s, v[1], 6.60, yy + 0.04, 0.72, 0.27, { fontSize: 10.5, color: v[2], bold: true, align: 'right' });
});
rect(s, 3.70, 5.72, 3.85, 0.40, C.green2, C.green2, true, 0.5);
text(s, 'ratio < 10%  →  进入锐度判别', 3.88, 5.76, 3.49, 0.27, { fontSize: 10.5, color: C.green, bold: true, align: 'center' });

arrow(s, 8.01, 3.72, 0.32);

// Stage 3
rect(s, 8.46, 1.45, 4.32, 4.85, C.white, C.line, true, 1.2);
circle(s, 3, 8.74, 1.73, C.orange);
text(s, '锐度判别 + 漏检补偿', 9.19, 1.68, 2.25, 0.38, { fontSize: 16, bold: true });

pill(s, '区分 Level 1 / 2', 8.75, 2.20, 1.52, C.orange2, C.orange);
text(s, '以下任一命中 → Level 2', 8.75, 2.67, 1.95, 0.27, { fontSize: 10.5, color: C.orange, bold: true });
bullet(s, '平均置信度 < 92', 8.77, 3.00, 1.72);
bullet(s, '最低行置信度 < 75', 8.77, 3.32, 1.72);
bullet(s, '拉普拉斯方差 < 3000', 10.67, 3.00, 1.78);
bullet(s, '文字边缘强度 < 100', 10.67, 3.32, 1.78);
text(s, '全部未命中 → Level 1', 8.76, 3.72, 3.65, 0.26, { fontSize: 10.5, color: C.green, bold: true, align: 'center' });

pill(s, '补偿 OCR 漏检', 8.75, 4.18, 1.52, C.purple2, C.purple);
text(s, 'Otsu 提取文字区域 → 去表格线 / 二维码\n→ 连通域分析 → 计算 undetected_ratio', 8.75, 4.63, 3.65, 0.64, { fontSize: 10.2, color: C.ink, align: 'center' });
rect(s, 8.75, 5.38, 3.65, 0.65, C.purple2, C.purple2, true, 0.5);
text(s, '相对基线 0.05：\nexcess > 0.15 加 1 级；> 0.30 加 2 级', 8.95, 5.44, 3.25, 0.48, { fontSize: 10.2, color: C.purple, bold: true, align: 'center' });

// Final
rect(s, 2.10, 6.62, 9.10, 0.52, C.green2, C.green, true, 1.1);
text(s, '最终等级 = min ( 基础等级 + 漏检补偿 , 5 )', 2.34, 6.70, 5.25, 0.31, { fontFace: MONO, fontSize: 13.2, color: C.green, bold: true, align: 'center' });
text(s, '规则预标注 + 人工复核边界样本', 7.62, 6.70, 3.32, 0.31, { fontSize: 10.3, color: C.ink, bold: true, align: 'center' });

pptx.writeFile({ fileName: OUT });
