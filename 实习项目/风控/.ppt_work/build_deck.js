const pptxgen = require('./pptenv/node_modules/pptxgenjs');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = '彭硕';
pptx.subject = '腾讯风控算法实习答辩';
pptx.title = '从“模型可用”到“业务可信”：司法风控单据智能校验实践';
pptx.company = '腾讯';
pptx.lang = 'zh-CN';
pptx.theme = {
  headFontFace: 'PingFang SC',
  bodyFontFace: 'PingFang SC',
  lang: 'zh-CN'
};
pptx.defineLayout({ name: 'CUSTOM_WIDE', width: 13.333, height: 7.5 });
pptx.layout = 'CUSTOM_WIDE';

const C = {
  ink: '102A33',
  deep: '0B1F26',
  teal: '0E8F83',
  mint: '19B8A3',
  mint2: 'DDF5F1',
  cyan: '5FD2C2',
  gold: 'F2B84B',
  gold2: 'FFF2D5',
  coral: 'E9685B',
  coral2: 'FCE9E7',
  blue: '4C7DE8',
  blue2: 'E8EEFC',
  purple: '7758C8',
  purple2: 'EEE9FA',
  white: 'FFFFFF',
  paper: 'F5F7F6',
  panel: 'FFFFFF',
  line: 'D7E1DF',
  muted: '64777C',
  soft: 'EAF0EF',
  darkMuted: 'B8C8C6'
};
const FONT = 'PingFang SC';
const MONO = 'Menlo';
const OUT = '/Users/xqer/person_doc/实习项目/风控/彭硕-腾讯风控实习答辩.pptx';

const shadow = () => ({ type: 'outer', color: '0B1F26', blur: 2, angle: 135, distance: 1, opacity: 0.10 });

function addText(slide, text, x, y, w, h, opts = {}) {
  slide.addText(text, {
    x, y, w, h, fontFace: opts.fontFace || FONT,
    fontSize: opts.fontSize || 15, color: opts.color || C.ink,
    bold: opts.bold || false, margin: opts.margin === undefined ? 0 : opts.margin,
    align: opts.align || 'left', valign: opts.valign || 'mid',
    breakLine: false, fit: 'shrink',
    paraSpaceAfterPt: opts.paraSpaceAfterPt || 0,
    lineSpacingMultiple: opts.lineSpacingMultiple || 1.0,
    isTextBox: true,
    ...opts
  });
}

function addRich(slide, runs, x, y, w, h, opts = {}) {
  slide.addText(runs, {
    x, y, w, h, fontFace: FONT, fontSize: opts.fontSize || 15,
    color: opts.color || C.ink, margin: opts.margin === undefined ? 0 : opts.margin,
    valign: opts.valign || 'mid', align: opts.align || 'left',
    fit: 'shrink', breakLine: false, ...opts
  });
}

function rect(slide, x, y, w, h, fill, radius = 0.10, line = C.line, extra = {}) {
  const { shadow: hasShadow, lineWidth, ...rest } = extra;
  slide.addShape(radius ? pptx.ShapeType.roundRect : pptx.ShapeType.rect, {
    x, y, w, h, rectRadius: radius,
    fill: { color: fill }, line: { color: line, width: lineWidth || 0.8 },
    ...(hasShadow ? { shadow: shadow() } : {}), ...rest
  });
}

function circle(slide, x, y, d, fill, line = fill) {
  slide.addShape(pptx.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: fill }, line: { color: line, width: 0.6 } });
}

function line(slide, x, y, w, h, color = C.line, width = 1, dash = 'solid') {
  slide.addShape(pptx.ShapeType.line, { x, y, w, h, line: { color, width, dashType: dash, beginArrowType: 'none', endArrowType: 'none' } });
}

function arrow(slide, x, y, w, h, color = C.teal) {
  slide.addShape(pptx.ShapeType.rightArrow, { x, y, w, h, fill: { color }, line: { color } });
}

function addFooter(slide, page, source = '') {
  addText(slide, 'PENG SHUO · RISK ALGORITHM', 0.60, 7.08, 3.2, 0.18, { fontSize: 8.5, color: C.muted, charSpacing: 1.1 });
  if (source) addText(slide, source, 4.10, 7.06, 7.9, 0.20, { fontSize: 8, color: '89999D', align: 'center' });
  addText(slide, String(page).padStart(2, '0'), 12.25, 7.03, 0.46, 0.24, { fontSize: 9, color: C.teal, bold: true, align: 'right' });
}

function addTitle(slide, kicker, title, page, source = '') {
  addText(slide, kicker.toUpperCase(), 0.60, 0.35, 2.8, 0.24, { fontSize: 9.5, color: C.teal, bold: true, charSpacing: 1.6 });
  addText(slide, title, 0.60, 0.68, 12.0, 0.58, { fontSize: 26, color: C.ink, bold: true });
  addFooter(slide, page, source);
}

function addSectionChip(slide, text, x, y, w, color = C.teal, fill = C.mint2) {
  rect(slide, x, y, w, 0.34, fill, 0.17, fill);
  addText(slide, text, x, y + 0.005, w, 0.32, { fontSize: 10.5, color, bold: true, align: 'center' });
}

function addMetric(slide, value, label, x, y, w, color = C.teal, suffix = '') {
  addRich(slide, [
    { text: value, options: { bold: true, color, fontSize: 28 } },
    { text: suffix, options: { bold: true, color, fontSize: 14 } }
  ], x, y, w, 0.50, { valign: 'bottom' });
  addText(slide, label, x, y + 0.54, w, 0.30, { fontSize: 10.5, color: C.muted });
}

function addBulletList(slide, items, x, y, w, h, opts = {}) {
  const runs = [];
  items.forEach((item, i) => {
    const value = typeof item === 'string' ? item : item.text;
    runs.push({ text: value, options: { bullet: { indent: 14 }, hanging: 3, breakLine: i < items.length - 1, color: (item.color || opts.color || C.ink), bold: item.bold || false } });
  });
  slide.addText(runs, {
    x, y, w, h, fontFace: FONT, fontSize: opts.fontSize || 13.5,
    color: opts.color || C.ink, margin: 0.03, breakLine: false,
    paraSpaceAfterPt: opts.paraSpaceAfterPt || 8, breakLine: false,
    valign: 'top', fit: 'shrink'
  });
}

function addCard(slide, x, y, w, h, title, body, accent = C.teal, fill = C.white) {
  rect(slide, x, y, w, h, fill, 0.12, C.line, { shadow: true });
  circle(slide, x + 0.22, y + 0.23, 0.17, accent);
  addText(slide, title, x + 0.48, y + 0.16, w - 0.70, 0.34, { fontSize: 14, bold: true, color: C.ink });
  addText(slide, body, x + 0.22, y + 0.60, w - 0.44, h - 0.76, { fontSize: 11.5, color: C.muted, valign: 'top', breakLine: false, fit: 'shrink' });
}

function newLightSlide() {
  const slide = pptx.addSlide();
  slide.background = { color: C.paper };
  return slide;
}

// 1 Cover
{
  const s = pptx.addSlide();
  s.background = { color: C.deep };
  rect(s, 8.62, 0.42, 4.10, 5.72, '102C32', 0.24, '1B4142');
  // abstract decision network
  for (let i = 0; i < 7; i++) {
    const d = 0.12 + i * 0.018;
    circle(s, 9.2 + (i % 3) * 0.95, 0.8 + i * 0.72, d, i % 2 ? C.gold : C.mint);
  }
  line(s, 9.28, 0.91, 1.05, 0.74, '2F615F', 1.2);
  line(s, 10.25, 1.67, 1.10, 0.72, '2F615F', 1.2);
  line(s, 10.25, 2.40, 1.0, 0.72, '2F615F', 1.2);
  line(s, 10.23, 3.12, 1.10, 0.72, '2F615F', 1.2);
  line(s, 10.28, 3.85, 0.98, 0.72, '2F615F', 1.2);
  addSectionChip(s, '2027 届 FiT 实习生答辩', 0.72, 0.70, 2.25, C.cyan, '143B3B');
  addText(s, '从“模型可用”\n到“业务可信”', 0.72, 1.48, 7.45, 1.62, { fontSize: 34, bold: true, color: C.white, valign: 'top', breakLine: true, lineSpacingMultiple: 0.95 });
  addText(s, '司法风控单据智能校验实践', 0.75, 3.27, 6.6, 0.52, { fontSize: 22, color: C.cyan, bold: true });
  addText(s, '将不确定的模型输出，转化为可解释、可复核、可持续迭代的业务决策', 0.75, 4.03, 6.95, 0.68, { fontSize: 14.5, color: C.darkMuted, valign: 'top' });
  addText(s, '彭硕', 0.75, 5.55, 1.0, 0.34, { fontSize: 16, bold: true, color: C.white });
  addText(s, '腾讯 · 风控算法实习生    华中科技大学 · 网络空间安全', 1.82, 5.55, 5.75, 0.34, { fontSize: 12.5, color: C.darkMuted });
  addText(s, '2026.08', 0.75, 6.73, 1.2, 0.24, { fontSize: 9.5, color: C.cyan, charSpacing: 1.4 });
  addText(s, 'INPUT', 9.05, 6.42, 0.7, 0.20, { fontSize: 8.5, color: C.darkMuted, charSpacing: 1.2 });
  arrow(s, 9.80, 6.43, 0.65, 0.16, C.teal);
  addText(s, 'DECISION', 10.60, 6.42, 1.0, 0.20, { fontSize: 8.5, color: C.gold, charSpacing: 1.2 });
  arrow(s, 11.72, 6.43, 0.65, 0.16, C.gold);
}

// 2 Timeline
{
  const s = newLightSlide();
  addTitle(s, 'ABOUT ME', '从去年 10 月至今：连续近 11 个月的多模态算法实践', 2, '来源：个人简历');
  addText(s, '三段经历不是岗位切换，而是一条逐步闭环的成长路径', 0.62, 1.38, 7.0, 0.32, { fontSize: 13, color: C.muted });
  const items = [
    { x: 0.75, date: '2025.10 — 2026.03', org: '京东 AI 安全部', role: '大模型后训练实习生', color: C.purple, fill: C.purple2, big: '89 万', label: '多模态 SFT 数据', body: '风险数据构建、多模型投票、Qwen3-VL 全参 SFT 与 GDPO，多目标奖励抑制过度拒答。' },
    { x: 4.52, date: '2026.04 — 2026.05', org: '京东零售', role: '多模态图像生成算法实习生', color: C.blue, fill: C.blue2, big: 'F1 95.21%', label: 'OCR 选型与部署', body: '商品主图清洗、OCR/VLM 横评、生成效果 Benchmark；从训练转向数据与评测体系。' },
    { x: 8.29, date: '2026.06 — 至今', org: '腾讯', role: '风控算法实习生', color: C.teal, fill: C.mint2, big: '4 类', label: '司法单据校验能力', body: '清晰度、文书类型、印章、电话号码；从模型指标进一步走向业务决策闭环。' }
  ];
  line(s, 1.25, 2.18, 10.85, 0, 'B9C9C7', 2);
  items.forEach((it, idx) => {
    circle(s, it.x + 1.52, 2.04, 0.28, C.white, it.color);
    circle(s, it.x + 1.61, 2.13, 0.10, it.color);
    addText(s, it.date, it.x, 1.72, 3.25, 0.26, { fontSize: 10.5, color: it.color, bold: true, align: 'center' });
    rect(s, it.x, 2.50, 3.25, 3.55, C.white, 0.14, C.line, { shadow: true });
    rect(s, it.x, 2.50, 3.25, 0.12, it.color, 0, it.color);
    addText(s, it.org, it.x + 0.24, 2.82, 2.77, 0.34, { fontSize: 17, bold: true });
    addText(s, it.role, it.x + 0.24, 3.20, 2.77, 0.28, { fontSize: 11.5, color: C.muted });
    addText(s, it.big, it.x + 0.24, 3.77, 2.77, 0.48, { fontSize: 24, bold: true, color: it.color });
    addText(s, it.label, it.x + 0.24, 4.22, 2.77, 0.25, { fontSize: 10.5, color: C.muted });
    addText(s, it.body, it.x + 0.24, 4.73, 2.77, 0.94, { fontSize: 11, color: C.ink, valign: 'top' });
    addSectionChip(s, idx === 0 ? '训练' : idx === 1 ? '数据 · 评测' : '业务闭环', it.x + 0.24, 5.69, 1.05, it.color, it.fill);
  });
  addText(s, '能力演进', 0.64, 6.43, 0.75, 0.22, { fontSize: 9.5, color: C.muted, bold: true });
  addText(s, '模型训练', 1.55, 6.43, 1.0, 0.22, { fontSize: 10.5, color: C.purple, bold: true });
  arrow(s, 2.55, 6.46, 0.76, 0.14, C.purple);
  addText(s, '数据与评测', 3.43, 6.43, 1.1, 0.22, { fontSize: 10.5, color: C.blue, bold: true });
  arrow(s, 4.63, 6.46, 0.76, 0.14, C.blue);
  addText(s, '任务定义与业务决策', 5.55, 6.43, 1.8, 0.22, { fontSize: 10.5, color: C.teal, bold: true });
  arrow(s, 7.48, 6.46, 0.76, 0.14, C.teal);
  addText(s, '目标：可复用的多模态算法闭环', 8.38, 6.43, 2.65, 0.22, { fontSize: 10.5, color: C.ink, bold: true });
}

// 3 Panorama
{
  const s = newLightSlide();
  addTitle(s, 'INTERNSHIP SCOPE', '四类校验能力，服务同一条司法单据有效性链路', 3, '来源：项目文档与个人简历');
  const cards = [
    ['01', '清晰度五级评估', '二分类无法表达模糊程度', '任务重定义 · 弱标注 · VLM 微调', C.teal, C.mint2],
    ['02', '文书类型识别', 'OCR 错字、旋转与标题错序', '鲁棒匹配 · 级联路由 · 0.28s/条', C.blue, C.blue2],
    ['03', '无印章识别', '浅色/小印章与 2% 负样本', '三模型融合 · sure/unsure · VLM', C.purple, C.purple2],
    ['04', '电话号码校验', '格式混乱且不能误拦', '提取归一化 · 区号补全 · 硬约束', C.gold, C.gold2]
  ];
  cards.forEach((c, i) => {
    const x = 0.65 + i * 3.14;
    rect(s, x, 1.55, 2.84, 4.62, C.white, 0.15, C.line, { shadow: true });
    addText(s, c[0], x + 0.23, 1.83, 0.55, 0.34, { fontSize: 20, bold: true, color: c[4] });
    circle(s, x + 2.32, 1.75, 0.28, c[4]);
    addText(s, c[1], x + 0.23, 2.36, 2.38, 0.42, { fontSize: 16, bold: true });
    addText(s, '关键问题', x + 0.23, 3.10, 0.72, 0.24, { fontSize: 9.5, color: c[4], bold: true });
    addText(s, c[2], x + 0.23, 3.39, 2.38, 0.58, { fontSize: 12, color: C.ink, valign: 'top' });
    addText(s, '我的工作', x + 0.23, 4.23, 0.72, 0.24, { fontSize: 9.5, color: c[4], bold: true });
    addText(s, c[3], x + 0.23, 4.52, 2.38, 0.72, { fontSize: 11.5, color: C.muted, valign: 'top' });
    rect(s, x + 0.23, 5.47, 2.38, 0.44, c[5], 0.08, c[5]);
    addText(s, i < 2 ? '重点项目' : '横向产出', x + 0.23, 5.49, 2.38, 0.39, { fontSize: 10.5, color: c[4], bold: true, align: 'center' });
  });
  addText(s, '统一命题：风险成本不对称时，如何把不确定信号变成可信决策？', 1.13, 6.45, 11.05, 0.38, { fontSize: 17, color: C.ink, bold: true, align: 'center' });
}

// 4 Unified framework
{
  const s = newLightSlide();
  addTitle(s, 'BUSINESS CONTEXT', '高吞吐、低误拦、可解释：决定了系统必须分层决策', 4, '数据：日均去重后约 17.4 万张法律文书图片');
  addMetric(s, '17.4', '万+ 文书图片 / 日', 0.72, 1.48, 2.3, C.teal, '万+');
  addMetric(s, '4', '类核心校验任务', 3.15, 1.48, 1.8, C.blue, '');
  addMetric(s, '低', '误拦优先级', 5.28, 1.48, 1.8, C.coral, '');
  addText(s, '误拦真实司法请求的风险通常高于放过存疑样本', 7.40, 1.52, 5.08, 0.56, { fontSize: 15, bold: true, color: C.ink, align: 'right' });
  const stages = [
    ['01', '输入标准化', '旋转 / 切块 / OCR\n号码归一化', C.blue, C.blue2],
    ['02', '多源信号', '视觉 / OCR / VLM\n地理库 / 规则', C.purple, C.purple2],
    ['03', '选择性决策', '高置信自动处理\n不确定样本升级', C.teal, C.mint2],
    ['04', '反馈闭环', '人审 / 难例池\n阈值与规则迭代', C.gold, C.gold2]
  ];
  stages.forEach((st, i) => {
    const x = 0.72 + i * 3.14;
    rect(s, x, 3.05, 2.62, 2.30, C.white, 0.13, C.line, { shadow: true });
    addText(s, st[0], x + 0.22, 3.27, 0.44, 0.28, { fontSize: 14, color: st[3], bold: true });
    addText(s, st[1], x + 0.22, 3.72, 2.18, 0.35, { fontSize: 15.5, bold: true });
    rect(s, x + 0.22, 4.28, 2.18, 0.72, st[4], 0.08, st[4]);
    addText(s, st[2], x + 0.34, 4.36, 1.94, 0.54, { fontSize: 11.5, color: st[3], bold: true, align: 'center' });
    if (i < stages.length - 1) arrow(s, x + 2.69, 3.97, 0.35, 0.22, C.line);
  });
  rect(s, 1.65, 5.78, 10.02, 0.63, C.deep, 0.12, C.deep);
  addText(s, '模型概率 ≠ 业务风险    ｜    不确定性不应被强行二分，而应被识别、路由与复核', 1.80, 5.89, 9.72, 0.40, { fontSize: 14, color: C.white, bold: true, align: 'center' });
}

// 5 Project directory
{
  const s = newLightSlide();
  addTitle(s, 'PROJECT DIRECTORY', '三个核心模型：按技术难度与答辩篇幅展开', 5, '清晰度 > 印章 > 文书类型；电话号码作为其他产出简述');
  const projects = [
    { n: '01', name: '文书清晰度五级评估', tag: '重点展开 · 6 页', hard: '技术难度  ★★★', value: '任务重定义 + 数据构造 + VLM 微调', desc: '从二分类双峰分数出发，重建五级序数任务，并构造可训练的数据与模型链路。', color: C.teal, fill: C.mint2, w: 5.30 },
    { n: '02', name: '无印章识别', tag: '次重点 · 3 页', hard: '技术难度  ★★', value: '多模型融合 + 选择性分类', desc: '融合版面、印章检测与视觉先验，通过 sure/unsure 路由控制漏检风险。', color: C.purple, fill: C.purple2, w: 3.20 },
    { n: '03', name: '文书类型识别', tag: '精简说明 · 2 页', hard: '技术难度  ★', value: 'OCR 鲁棒匹配 + 级联', desc: '稳定高频类型走快速规则路径，异常样本由 VL 兜底。', color: C.blue, fill: C.blue2, w: 2.65 }
  ];
  let x = 0.72;
  projects.forEach((p, i) => {
    rect(s, x, 1.58, p.w, 4.58, C.white, 0.15, C.line, { shadow: true });
    rect(s, x, 1.58, p.w, 0.12, p.color, 0, p.color);
    addText(s, p.n, x + 0.25, 1.92, 0.55, 0.35, { fontSize: 20, bold: true, color: p.color });
    addSectionChip(s, p.tag, x + p.w - 1.55, 1.92, 1.28, p.color, p.fill);
    addText(s, p.name, x + 0.25, 2.55, p.w - 0.50, 0.45, { fontSize: i === 0 ? 19 : 16, bold: true });
    addText(s, p.hard, x + 0.25, 3.20, p.w - 0.50, 0.30, { fontSize: 11.5, color: p.color, bold: true });
    rect(s, x + 0.25, 3.78, p.w - 0.50, 0.72, p.fill, 0.09, p.fill);
    addText(s, p.value, x + 0.42, 3.89, p.w - 0.84, 0.48, { fontSize: 11.5, color: p.color, bold: true, align: 'center' });
    addText(s, p.desc, x + 0.25, 4.83, p.w - 0.50, 0.82, { fontSize: 11.2, color: C.muted, valign: 'top', align: i === 0 ? 'left' : 'center' });
    x += p.w + 0.36;
  });
  rect(s, 1.52, 6.43, 10.30, 0.42, C.deep, 0.08, C.deep);
  addText(s, '篇幅分配遵循技术难度，而不是平均罗列业务需求', 1.72, 6.49, 9.90, 0.27, { fontSize: 12.5, color: C.white, bold: true, align: 'center' });
}

// 6 Clarity section directory
{
  const s = pptx.addSlide();
  s.background = { color: C.deep };
  addSectionChip(s, '01 · CLARITY MODEL', 0.76, 0.70, 1.85, C.cyan, '143B3B');
  addText(s, '文书清晰度五级评估', 0.76, 1.32, 6.10, 0.65, { fontSize: 31, color: C.white, bold: true });
  addText(s, '技术难度最高：原任务没有学习五级质量所需的序数信息', 0.78, 2.14, 6.35, 0.45, { fontSize: 15, color: C.darkMuted });
  const agenda = [
    ['01', '问题与关键判断', '为什么二分类分数不能直接切五档'],
    ['02', '任务与数据', '二维可辨识度、弱标注与人工闭环'],
    ['03', '模型架构', 'Qwen3.5-VL + LoRA + 五级软标签'],
    ['04', '结果与下一步', '过拟合诊断与序数评测体系']
  ];
  agenda.forEach((a, i) => {
    const y = 3.05 + i * 0.78;
    addText(s, a[0], 0.82, y, 0.42, 0.28, { fontSize: 12, color: i === 2 ? C.gold : C.cyan, bold: true });
    addText(s, a[1], 1.43, y - 0.02, 1.75, 0.32, { fontSize: 13.5, color: C.white, bold: true });
    addText(s, a[2], 3.32, y, 3.72, 0.29, { fontSize: 11.2, color: C.darkMuted });
  });
  // right architecture preview
  rect(s, 8.10, 0.72, 4.50, 5.92, '102C32', 0.18, '1D4546');
  addText(s, 'ARCHITECTURE PREVIEW', 8.48, 1.16, 3.65, 0.28, { fontSize: 9.5, color: C.cyan, bold: true, charSpacing: 1.3, align: 'center' });
  const blocks = [
    ['Document Image', C.blue], ['Vision Encoder', C.purple], ['Multimodal LLM', C.teal], ['5-level Distribution', C.gold]
  ];
  blocks.forEach((b, i) => {
    const y = 1.78 + i * 1.06;
    rect(s, 8.72, y, 3.26, 0.60, '17383E', 0.09, '28545A');
    circle(s, 8.95, y + 0.17, 0.24, b[1]);
    addText(s, b[0], 9.34, y + 0.10, 2.35, 0.36, { fontSize: 11.5, color: C.white, bold: true, align: 'center' });
    if (i < 3) s.addShape(pptx.ShapeType.downArrow, { x: 10.20, y: y + 0.68, w: 0.28, h: 0.24, fill: { color: C.teal }, line: { color: C.teal } });
  });
  addText(s, '约 6 分钟', 8.82, 6.06, 3.05, 0.35, { fontSize: 16, color: C.gold, bold: true, align: 'center' });
  addText(s, '06', 12.24, 7.02, 0.46, 0.24, { fontSize: 9, color: C.cyan, bold: true, align: 'right' });
}

// 7 Clarity problem
{
  const s = newLightSlide();
  addTitle(s, 'CLARITY · PROBLEM', '关键判断：二分类模型没有学习“模糊程度”，校准也无法补出序数信息', 7, '原方案：569 维 XGBoost 二分类；blur_score 呈强双峰');
  rect(s, 0.72, 1.55, 5.40, 4.80, C.white, 0.14, C.line, { shadow: true });
  addText(s, '原模型输出', 1.02, 1.87, 1.65, 0.34, { fontSize: 16, bold: true });
  line(s, 1.12, 5.42, 4.45, 0, '9FB0AE', 1);
  line(s, 1.12, 2.64, 0, 2.78, '9FB0AE', 1);
  const bars = [1.95,1.55,0.92,0.35,0.13,0.08,0.10,0.26,0.78,1.48,2.06];
  bars.forEach((v, i) => rect(s, 1.28 + i * 0.37, 5.42 - v, 0.22, v, i < 4 ? C.teal : (i > 7 ? C.coral : C.line), 0.02, i < 4 ? C.teal : (i > 7 ? C.coral : C.line)));
  addText(s, '清晰', 1.20, 5.63, 0.72, 0.22, { fontSize: 9.5, color: C.teal, bold: true });
  addText(s, '中间区间样本极少', 2.53, 5.63, 1.65, 0.22, { fontSize: 9.5, color: C.muted, align: 'center' });
  addText(s, '模糊', 4.88, 5.63, 0.62, 0.22, { fontSize: 9.5, color: C.coral, bold: true, align: 'right' });
  rect(s, 1.02, 2.34, 1.44, 0.42, C.mint2, 0.08, C.mint2);
  addText(s, '0.05 — 1', 1.02, 2.40, 1.44, 0.28, { fontSize: 11, color: C.teal, bold: true, align: 'center' });
  rect(s, 4.35, 2.34, 1.44, 0.42, C.coral2, 0.08, C.coral2);
  addText(s, '90 — 99', 4.35, 2.40, 1.44, 0.28, { fontSize: 11, color: C.coral, bold: true, align: 'center' });

  rect(s, 6.48, 1.55, 6.15, 4.80, C.deep, 0.14, C.deep);
  addText(s, '为什么直接切五档不可行？', 6.88, 1.92, 4.10, 0.40, { fontSize: 18, color: C.white, bold: true });
  const reasons = [
    ['训练目标错位', '二分类损失只要求跨过边界，不约束同类内部的质量排序。'],
    ['分数不单调', '相近分数可能视觉差异大；视觉相近样本也可能分数差异大。'],
    ['校准能力有限', 'Platt / Isotonic 只能重映射已有信息，不能创造等级 2-4。']
  ];
  reasons.forEach((r, i) => {
    const y = 2.67 + i * 0.98;
    circle(s, 6.90, y + 0.08, 0.30, i === 2 ? C.gold : C.teal);
    addText(s, String(i + 1), 6.90, y + 0.11, 0.30, 0.20, { fontSize: 9, color: C.white, bold: true, align: 'center' });
    addText(s, r[0], 7.38, y, 1.28, 0.28, { fontSize: 12.5, color: C.white, bold: true });
    addText(s, r[1], 8.78, y - 0.02, 3.40, 0.43, { fontSize: 10.6, color: C.darkMuted, valign: 'top' });
  });
  rect(s, 6.88, 5.55, 5.28, 0.48, '143B3C', 0.08, '143B3C');
  addText(s, '因此：先重定义任务与标签，再选择模型。', 7.08, 5.64, 4.88, 0.30, { fontSize: 13, color: C.gold, bold: true, align: 'center' });
}

// 8 Clarity task/data
{
  const s = newLightSlide();
  addTitle(s, 'CLARITY · TASK & DATA', '把“主观清晰度”转化为二维可辨识度，并以人机闭环构造数据', 8, '13,133 张人工确认图片｜按 AppID 隔离训练/测试');
  rect(s, 0.72, 1.52, 6.15, 4.92, C.white, 0.14, C.line, { shadow: true });
  addText(s, '任务定义', 1.02, 1.84, 1.50, 0.34, { fontSize: 16, bold: true });
  addText(s, 'Quality = f ( unreadable_ratio , readable_sharpness )', 1.02, 2.40, 5.56, 0.43, { fontFace: MONO, fontSize: 15, color: C.teal, bold: true, align: 'center' });
  const dims = [
    ['不可辨文字比例', '决定 Level 3-5', '正文中有多少文字已无法辨认', C.gold, C.gold2],
    ['可辨区域锐度', '区分 Level 1/2', '仍可读文字是否边缘发虚或粘连', C.teal, C.mint2]
  ];
  dims.forEach((d, i) => {
    const y = 3.16 + i * 1.25;
    rect(s, 1.02, y, 5.54, 0.95, d[4], 0.10, d[4]);
    addText(s, d[0], 1.28, y + 0.14, 1.64, 0.30, { fontSize: 13.5, bold: true, color: d[3] });
    addSectionChip(s, d[1], 3.02, y + 0.12, 1.25, d[3], C.white);
    addText(s, d[2], 4.42, y + 0.13, 1.87, 0.38, { fontSize: 10.5, color: C.ink, align: 'center' });
  });
  addText(s, '只评价正文印刷文字；签名、印章与表格线不计入。', 1.02, 5.87, 5.54, 0.25, { fontSize: 10.5, color: C.muted, align: 'center' });

  rect(s, 7.22, 1.52, 5.40, 4.92, C.white, 0.14, C.line, { shadow: true });
  addText(s, '数据闭环', 7.55, 1.84, 1.50, 0.34, { fontSize: 16, bold: true });
  const steps = [
    ['规则预标注', 'OCR 行置信度 + 字数/面积权重', C.blue],
    ['漏检补偿', '二值化与连通域估计 OCR 未检文字', C.gold],
    ['人工校正', '标注平台确认五级标签与边界 Case', C.purple],
    ['训练采样', '1/√freq 缓解 Level 4/5 长尾', C.teal]
  ];
  steps.forEach((st, i) => {
    const y = 2.40 + i * 0.78;
    circle(s, 7.56, y + 0.09, 0.28, st[2]);
    addText(s, String(i + 1), 7.56, y + 0.12, 0.28, 0.18, { fontSize: 8.8, color: C.white, bold: true, align: 'center' });
    addText(s, st[0], 8.02, y, 1.32, 0.27, { fontSize: 12, bold: true });
    addText(s, st[1], 9.42, y - 0.01, 2.75, 0.34, { fontSize: 10.3, color: C.muted });
  });
  rect(s, 7.55, 5.69, 4.72, 0.47, C.deep, 0.08, C.deep);
  addText(s, '训练 9,850 ｜ 测试 3,283 ｜ 独立 AppID', 7.74, 5.78, 4.34, 0.29, { fontSize: 11.5, color: C.white, bold: true, align: 'center' });
}

// 9 Annotation platform
{
  const s = newLightSlide();
  addTitle(s, 'DATA LOOP · ANNOTATION PLATFORM', '标注平台将规则、模型与人审连接成可迭代的数据闭环', 9, '搜索 / 分页 / 缩放 / 快捷键 / 备注 / 人工标签');

  rect(s, 0.72, 1.53, 7.35, 4.53, C.white, 0.13, C.line, { shadow: true });
  addSectionChip(s, '清晰度五级标注 · 主流程', 0.98, 1.78, 1.86, C.teal, C.mint2);
  s.addImage({ path: '/Users/xqer/person_doc/实习项目/风控/.ppt_work/assets/annotation_clarity.png', x: 0.98, y: 2.24, w: 6.83, h: 3.77 });

  rect(s, 8.38, 1.53, 4.24, 2.22, C.white, 0.13, C.line, { shadow: true });
  addSectionChip(s, '文书类型复核', 8.64, 1.75, 1.22, C.blue, C.blue2);
  s.addImage({ path: '/Users/xqer/person_doc/实习项目/风控/.ppt_work/assets/annotation_doctype.png', x: 8.64, y: 2.20, w: 3.72, h: 1.59 });

  rect(s, 8.38, 4.00, 4.24, 2.31, C.white, 0.13, C.line, { shadow: true });
  addSectionChip(s, '印章审核与模型对比', 8.64, 4.22, 1.62, C.purple, C.purple2);
  s.addImage({ path: '/Users/xqer/person_doc/实习项目/风控/.ppt_work/assets/annotation_seal.png', x: 8.76, y: 4.66, w: 3.48, h: 1.71 });

  rect(s, 1.42, 6.48, 10.48, 0.40, C.deep, 0.08, C.deep);
  addText(s, '平台价值：统一呈现模型中间结果 → 人工快速校正 → 错误 Case 回流为标签、规则与评测集', 1.68, 6.54, 9.96, 0.26, { fontSize: 11.3, color: C.white, bold: true, align: 'center' });
}

// 10 Clarity architecture
{
  const s = newLightSlide();
  addTitle(s, 'CLARITY · MODEL ARCHITECTURE', 'Qwen3.5-VL + LoRA：用五级概率分布学习业务质量标尺', 10, 'Base：Qwen3.5-9B-VL｜LoRA rank=8｜冻结视觉塔与 aligner');
  // architecture flow
  const nodes = [
    { x: 0.72, w: 1.82, title: '文书图片', sub: '扫描 / 拍照文档', color: C.blue, fill: C.blue2 },
    { x: 2.96, w: 2.02, title: 'Vision Encoder', sub: '冻结视觉塔\n提取图像 token', color: C.purple, fill: C.purple2 },
    { x: 5.40, w: 1.65, title: 'Aligner', sub: '冻结\n视觉-语言对齐', color: C.gold, fill: C.gold2 },
    { x: 7.47, w: 2.25, title: 'Qwen3.5 LLM', sub: 'LoRA 注入\n学习质量语义', color: C.teal, fill: C.mint2 },
    { x: 10.14, w: 2.46, title: '等级 Token 概率', sub: 'Closed-set Softmax\nP(L1…L5)', color: C.coral, fill: C.coral2 }
  ];
  nodes.forEach((n, i) => {
    rect(s, n.x, 2.00, n.w, 2.22, C.white, 0.13, C.line, { shadow: true });
    rect(s, n.x, 2.00, n.w, 0.11, n.color, 0, n.color);
    circle(s, n.x + n.w / 2 - 0.24, 2.40, 0.48, n.color);
    addText(s, String(i + 1), n.x + n.w / 2 - 0.24, 2.47, 0.48, 0.25, { fontSize: 11.5, color: C.white, bold: true, align: 'center' });
    addText(s, n.title, n.x + 0.16, 3.10, n.w - 0.32, 0.34, { fontSize: 13.3, bold: true, align: 'center' });
    rect(s, n.x + 0.18, 3.53, n.w - 0.36, 0.48, n.fill, 0.07, n.fill);
    addText(s, n.sub, n.x + 0.23, 3.57, n.w - 0.46, 0.40, { fontSize: 9.8, color: n.color, bold: true, align: 'center' });
    if (i < nodes.length - 1) arrow(s, n.x + n.w + 0.08, 2.94, 0.25, 0.18, C.line);
  });
  // objectives
  rect(s, 0.72, 4.73, 7.47, 1.42, C.deep, 0.12, C.deep);
  addText(s, '训练目标', 1.00, 5.00, 1.02, 0.32, { fontSize: 14, color: C.gold, bold: true });
  addText(s, '文本 Token：Next-Token CE', 2.16, 4.95, 2.15, 0.36, { fontSize: 11.5, color: C.white, bold: true });
  addText(s, '等级分布：KL / 分布对齐', 4.48, 4.95, 2.28, 0.36, { fontSize: 11.5, color: C.white, bold: true });
  addText(s, '软标签：以五级有序分布表达相邻等级不确定性，避免边界样本被当作绝对真值。', 2.16, 5.49, 5.48, 0.36, { fontSize: 10.4, color: C.darkMuted });
  rect(s, 8.55, 4.73, 4.05, 1.42, C.mint2, 0.12, C.mint2);
  addText(s, '推理输出', 8.84, 5.00, 1.02, 0.32, { fontSize: 14, color: C.teal, bold: true });
  addText(s, '等级 = argmax P(Lk)', 10.00, 4.95, 2.18, 0.32, { fontFace: MONO, fontSize: 11.2, color: C.ink, bold: true });
  addText(s, '连续质量分数  q̂ = Σ pₖ · k', 10.00, 5.45, 2.25, 0.32, { fontFace: MONO, fontSize: 10.7, color: C.teal, bold: true });
  addText(s, '关键设计：不是让 VLM 自由打分，而是把输出限制在可校准的五级概率空间。', 1.40, 6.50, 10.55, 0.30, { fontSize: 12.5, color: C.coral, bold: true, align: 'center' });
}

// 11 Clarity result
{
  const s = newLightSlide();
  addTitle(s, 'CLARITY · RESULT', '训练曲线揭示过拟合：当前瓶颈已转向数据泛化与序数评测', 11, '最佳 checkpoint：step 1200，Eval Loss = 0.0757');
  rect(s, 0.72, 1.52, 7.15, 4.82, C.white, 0.14, C.line, { shadow: true });
  s.addChart(pptx.ChartType.line, [{ name: 'Eval Loss', labels: ['300','600','900','1200','1500','1800','2100','2400','2538'], values: [0.1046,0.0882,0.0772,0.0757,0.0828,0.0935,0.0979,0.1172,0.1185] }], {
    x: 1.05, y: 2.02, w: 6.45, h: 3.55, chartColors: [C.teal], showLegend: false, showTitle: false,
    lineSize: 3, showMarker: true, markerSize: 5, catAxisLabelColor: C.muted, valAxisLabelColor: C.muted,
    valGridLine: { color: 'E4EAE9', width: 0.6 }, catGridLine: { color: 'FFFFFF', transparency: 100 },
    valAxisMinVal: 0.06, valAxisMaxVal: 0.13, valAxisMajorUnit: 0.01,
    chartArea: { fill: { color: C.white }, line: { color: C.white } }, showBorder: false
  });
  addText(s, 'step 1200', 3.20, 4.50, 1.18, 0.25, { fontSize: 10, color: 'A06A08', bold: true, align: 'center' });
  circle(s, 3.68, 4.82, 0.18, C.gold);
  rect(s, 8.23, 1.52, 4.40, 1.22, C.coral2, 0.12, C.coral2);
  addText(s, '+56%', 8.55, 1.78, 1.18, 0.43, { fontSize: 25, color: C.coral, bold: true });
  addText(s, '最佳点后 Eval Loss 上涨', 9.88, 1.82, 2.25, 0.34, { fontSize: 11.5, bold: true });
  addCard(s, 8.23, 3.12, 4.40, 1.16, '结论 1｜停止增加 epoch', 'Train Loss≈0.01、Token Acc=0.996，但验证集恶化；继续拟合只会放大噪声。', C.coral, C.white);
  addCard(s, 8.23, 4.59, 4.40, 1.16, '结论 2｜重建评测体系', '下一步重点看 QWK、MAE、Macro-F1、L4/5 Recall 与概率校准。', C.teal, C.white);
  addText(s, '项目阶段结论：完成任务定义、数据闭环与模型架构；已定位下一阶段主要矛盾。', 1.40, 6.56, 10.55, 0.30, { fontSize: 12.5, color: C.teal, bold: true, align: 'center' });
}

// 12 Seal section directory
{
  const s = pptx.addSlide();
  s.background = { color: C.deep };
  addSectionChip(s, '02 · SEAL DETECTION', 0.76, 0.70, 1.95, C.cyan, '143B3B');
  addText(s, '无印章识别', 0.76, 1.34, 5.30, 0.64, { fontSize: 31, color: C.white, bold: true });
  addText(s, '技术难度第二：小目标、浅色章与极少负样本共同造成漏检风险', 0.78, 2.14, 6.60, 0.45, { fontSize: 15, color: C.darkMuted });
  const agenda = [
    ['01', '模型架构', '三路检测信号 + 颜色先验'],
    ['02', '决策与结果', '选择性分类 + 切块/VLM 复核']
  ];
  agenda.forEach((a, i) => {
    const y = 3.22 + i * 1.06;
    addText(s, a[0], 0.82, y, 0.42, 0.28, { fontSize: 12, color: i ? C.gold : C.cyan, bold: true });
    addText(s, a[1], 1.43, y - 0.02, 1.75, 0.32, { fontSize: 14, color: C.white, bold: true });
    addText(s, a[2], 3.30, y, 3.65, 0.29, { fontSize: 11.4, color: C.darkMuted });
  });
  rect(s, 8.18, 0.72, 4.42, 5.92, '102C32', 0.18, '1D4546');
  const sig = [['LayoutV2','RT-DETR + Pointer',C.blue],['Layout-L','RT-DETR-L',C.purple],['Seal Detector','ResNet + FPN/PSE',C.gold],['HSV Blob','颜色与几何先验',C.teal]];
  sig.forEach((v,i)=>{
    const y=1.35+i*1.02;
    rect(s,8.67,y,3.45,0.68,'17383E',0.09,'285058');
    circle(s,8.90,y+0.21,0.25,v[2]);
    addText(s,v[0],9.28,y+0.10,1.35,0.28,{fontSize:11.5,color:C.white,bold:true});
    addText(s,v[1],10.60,y+0.10,1.24,0.30,{fontSize:9.2,color:C.darkMuted,align:'right'});
  });
  addText(s, '约 3 分钟', 8.84, 5.88, 3.00, 0.35, { fontSize: 16, color: C.gold, bold: true, align: 'center' });
  addText(s, '12', 12.24, 7.02, 0.46, 0.24, { fontSize: 9, color: C.cyan, bold: true, align: 'right' });
}

// 13 Seal architecture
{
  const s = newLightSlide();
  addTitle(s, 'SEAL · MODEL ARCHITECTURE', '三类模型覆盖不同视觉线索，颜色先验补充浅色印章', 13, '模型参数：53.05M / 32.26M / 28.49M');
  const models = [
    ['PP-DocLayoutV2', 'RT-DETR + Pointer Network', '800×800｜23 类版面', '标准版面与印章框', C.blue, C.blue2],
    ['PP-DocLayout-L', 'RT-DETR-L', '640×640｜23 类版面', '实际主力检测信号', C.purple, C.purple2],
    ['Seal Detector', 'ResNet + FPN / PSE', '动态长边 736｜弯曲文本', '圆形印章文字碎片', C.gold, C.gold2]
  ];
  models.forEach((m,i)=>{
    const x=0.72+i*3.42;
    rect(s,x,1.55,3.08,3.55,C.white,0.14,C.line,{shadow:true});
    rect(s,x,1.55,3.08,0.11,m[4],0,m[4]);
    addText(s,m[0],x+0.22,1.92,2.64,0.36,{fontSize:15,bold:true,align:'center'});
    rect(s,x+0.24,2.52,2.60,0.55,m[5],0.08,m[5]);
    addText(s,m[1],x+0.34,2.62,2.40,0.30,{fontSize:10.5,color:m[4],bold:true,align:'center'});
    addText(s,m[2],x+0.24,3.38,2.60,0.29,{fontSize:10.5,color:C.muted,align:'center'});
    addText(s,'主要贡献',x+0.24,3.92,0.80,0.24,{fontSize:9.5,color:m[4],bold:true});
    addText(s,m[3],x+1.05,3.88,1.78,0.34,{fontSize:11,bold:true,align:'right'});
    if(i<2) arrow(s,x+3.16,3.16,0.20,0.18,C.line);
  });
  rect(s,10.98,1.55,1.64,3.55,C.deep,0.14,C.deep);
  addText(s,'HSV',11.30,1.98,1.00,0.40,{fontSize:20,color:C.cyan,bold:true,align:'center'});
  addText(s,'双红区间\n形态学去噪\n连通域面积',11.24,2.66,1.12,1.12,{fontSize:10.5,color:C.white,bold:true,align:'center'});
  addText(s,'补浅色章',11.20,4.27,1.18,0.30,{fontSize:10.5,color:C.gold,bold:true,align:'center'});
  // fusion
  rect(s,1.48,5.57,10.38,0.65,C.deep,0.10,C.deep);
  addText(s,'融合逻辑',1.74,5.76,1.00,0.30,{fontSize:12,color:C.gold,bold:true});
  addText(s,'高分直接判有章  ｜  中分需 Seal/颜色确认  ｜  低分且无辅助信号判无章  ｜  其余进入 UNSURE',2.92,5.72,8.50,0.36,{fontSize:12.2,color:C.white,bold:true,align:'center'});
  addText(s,'技术核心不是简单投票，而是让不同模型覆盖版面、弯曲文字与颜色三类互补证据。',1.40,6.55,10.55,0.30,{fontSize:12.2,color:C.purple,bold:true,align:'center'});
}

// 14 Seal decision/result
{
  const s = newLightSlide();
  addTitle(s, 'SEAL · DECISION & RESULT', '选择性分类管理不确定性：先自动处理高置信样本，再升级难例', 14, '法院数据 24,831 条实跑｜多页 VLM 找回 163 个有章文档');
  const stages=[
    ['Stage 1','整页三模型融合','HAS / NO / UNSURE',C.blue,C.blue2],
    ['Stage 2','8 块切分，15% 重叠','放大小印章占比',C.purple,C.purple2],
    ['Stage 3','每批 5 页 VLM 复核','消解剩余 UNSURE',C.teal,C.mint2]
  ];
  stages.forEach((st,i)=>{
    const x=0.72+i*3.88;
    rect(s,x,1.58,3.46,2.48,C.white,0.13,C.line,{shadow:true});
    addSectionChip(s,st[0],x+0.24,1.90,0.88,st[3],st[4]);
    addText(s,st[1],x+0.24,2.52,2.98,0.38,{fontSize:14.5,bold:true,align:'center'});
    rect(s,x+0.36,3.19,2.74,0.50,st[4],0.08,st[4]);
    addText(s,st[2],x+0.48,3.28,2.50,0.30,{fontSize:11,color:st[3],bold:true,align:'center'});
    if(i<2) arrow(s,x+3.53,2.70,0.27,0.20,C.line);
  });
  rect(s,0.72,4.56,4.25,1.40,C.deep,0.12,C.deep);
  addText(s,'100%',1.05,4.86,1.35,0.50,{fontSize:29,color:C.cyan,bold:true});
  addText(s,'Precision',1.05,5.42,1.28,0.24,{fontSize:10.5,color:C.darkMuted});
  addText(s,'98.94%',2.75,4.86,1.75,0.50,{fontSize:29,color:C.gold,bold:true,align:'right'});
  addText(s,'Recall',3.22,5.42,1.28,0.24,{fontSize:10.5,color:C.darkMuted,align:'right'});
  rect(s,5.35,4.56,7.27,1.40,C.white,0.12,C.line,{shadow:true});
  addText(s,'模型贡献分析',5.70,4.84,1.55,0.30,{fontSize:14,bold:true});
  addText(s,'Layout-L 覆盖约 98.5% 的有章检出；V2 独立贡献约 0.2%',5.70,5.27,4.42,0.31,{fontSize:11.8,color:C.purple,bold:true});
  addText(s,'下一步：用数据驱动的轻量融合器替代手工阈值，并评估单模型微调。',5.70,5.65,6.32,0.26,{fontSize:10.5,color:C.muted});
  addText(s,'* Precision / Recall 为高置信自动处理子集口径，正式答辩前与 97.62% 版本统一。',1.28,6.55,10.75,0.24,{fontSize:9.5,color:C.coral,align:'center'});
}

// 15 Doc type section directory
{
  const s = pptx.addSlide();
  s.background = { color: C.deep };
  addSectionChip(s, '03 · DOCUMENT TYPE', 0.76, 0.70, 2.02, C.cyan, '143B3B');
  addText(s, '文书类型识别', 0.76, 1.34, 5.30, 0.64, { fontSize: 31, color: C.white, bold: true });
  addText(s, '技术难度第三：核心是把稳定高频模式与长尾异常分开处理', 0.78, 2.14, 6.60, 0.45, { fontSize: 15, color: C.darkMuted });
  const agenda=[['01','级联架构','OCR 快路径 + VL 慢路径'],['02','关键技术与结果','鲁棒标题匹配，Accuracy 99.99%']];
  agenda.forEach((a,i)=>{
    const y=3.22+i*1.06;
    addText(s,a[0],0.82,y,0.42,0.28,{fontSize:12,color:i?C.gold:C.cyan,bold:true});
    addText(s,a[1],1.43,y-0.02,1.75,0.32,{fontSize:14,color:C.white,bold:true});
    addText(s,a[2],3.30,y,3.65,0.29,{fontSize:11.4,color:C.darkMuted});
  });
  rect(s,8.18,0.72,4.42,5.92,'102C32',0.18,'1D4546');
  const flow=[['PP-OCRv6','≈269ms',C.teal],['白名单匹配','27 类',C.blue],['VL 兜底','≈12.6s',C.purple]];
  flow.forEach((f,i)=>{
    const y=1.56+i*1.32;
    rect(s,8.88,y,3.02,0.72,'17383E',0.09,'285058');
    addText(s,f[0],9.10,y+0.12,1.55,0.30,{fontSize:12,color:C.white,bold:true});
    addText(s,f[1],10.72,y+0.12,0.90,0.30,{fontSize:10.5,color:f[2],bold:true,align:'right'});
    if(i<2) s.addShape(pptx.ShapeType.downArrow,{x:10.24,y:y+0.80,w:0.28,h:0.27,fill:{color:C.teal},line:{color:C.teal}});
  });
  addText(s,'约 2 分钟',8.84,5.88,3.00,0.35,{fontSize:16,color:C.gold,bold:true,align:'center'});
  addText(s,'15',12.24,7.02,0.46,0.24,{fontSize:9,color:C.cyan,bold:true,align:'right'});
}

// 16 Doc type concise
{
  const s = newLightSlide();
  addTitle(s, 'DOC TYPE · ARCHITECTURE & RESULT', 'OCR 快路径 + VL 慢路径：用三层匹配抵抗标题噪声', 16, '五批数万条人工标注评测｜主链路约 0.28s/条');
  // top pipeline
  const flow=[['PP-OCRv6','全文识别',C.teal],['业务归一化','繁简 / 同义词',C.blue],['鲁棒匹配','编辑距离 + 锚点',C.purple],['最长匹配','冲突消解',C.gold],['未命中','VL 兜底',C.coral]];
  flow.forEach((f,i)=>{
    const x=0.72+i*2.45;
    rect(s,x,1.55,2.12,1.38,C.white,0.11,C.line,{shadow:true});
    circle(s,x+0.82,1.78,0.48,f[2]);
    addText(s,String(i+1),x+0.82,1.85,0.48,0.25,{fontSize:11,color:C.white,bold:true,align:'center'});
    addText(s,f[0],x+0.18,2.39,1.76,0.27,{fontSize:11.8,bold:true,align:'center'});
    addText(s,f[1],x+0.18,2.69,1.76,0.22,{fontSize:9.5,color:C.muted,align:'center'});
    if(i<4) arrow(s,x+2.17,2.08,0.20,0.16,C.line);
  });
  // key techniques
  addCard(s,0.72,3.47,3.72,1.47,'自适应编辑距离','≤6 字精确；长标题按长度允许 k=1/2/3，容忍少量 OCR 错字。',C.blue,C.white);
  addCard(s,4.80,3.47,3.72,1.47,'锚点顺序匹配','长标题切 2-4 个锚点，保持顺序并容忍水印或拼图插字。',C.purple,C.white);
  addCard(s,8.88,3.47,3.72,1.47,'最长匹配优先','同时收集候选，返回归一化后最长标题，避免短标题抢占。',C.gold,C.white);
  rect(s,0.72,5.47,4.36,0.86,C.deep,0.11,C.deep);
  addText(s,'94.59%',1.00,5.66,1.34,0.35,{fontSize:22,color:C.darkMuted,bold:true});
  arrow(s,2.45,5.76,0.48,0.19,C.gold);
  addText(s,'99.99%',3.08,5.66,1.62,0.35,{fontSize:22,color:C.cyan,bold:true,align:'right'});
  addText(s,'Accuracy',1.00,6.07,3.70,0.18,{fontSize:9.5,color:C.darkMuted,align:'center'});
  rect(s,5.45,5.47,2.45,0.86,C.mint2,0.11,C.mint2);
  addText(s,'0.28s',5.72,5.62,1.90,0.38,{fontSize:23,color:C.teal,bold:true,align:'center'});
  addText(s,'主链路单条',5.72,6.05,1.90,0.18,{fontSize:9.5,color:C.muted,align:'center'});
  addText(s,'核心价值：稳定模式由确定性算法快速处理，长尾样本才购买更昂贵的模型能力。',8.22,5.57,4.12,0.60,{fontSize:11.5,color:C.ink,bold:true,align:'center'});
  addText(s,'* 99.99% 正式答辩前补充总样本数、错误数与置信区间。',8.22,6.24,4.12,0.20,{fontSize:8.8,color:C.coral,align:'center'});
}

// 17 AI and other output
{
  const s = newLightSlide();
  addTitle(s, 'AI PRACTICE & OTHER OUTPUT', '技术路线由风险、吞吐与确定性共同决定，而不是统一使用大模型', 17, '电话号码校验作为其他产出简述');
  const choices=[
    ['清晰度','VLM 微调','需要学习主观序数标尺',C.teal,C.mint2],
    ['印章','多模型 + VLM 复核','视觉证据互补且漏检成本高',C.purple,C.purple2],
    ['文书类型','OCR 规则 + VL 兜底','高频稳定、长尾复杂',C.blue,C.blue2],
    ['电话号码','正则 + 地理库','高吞吐、可枚举、不能误拦',C.gold,C.gold2]
  ];
  choices.forEach((c,i)=>{
    const y=1.55+i*0.95;
    rect(s,0.72,y,7.55,0.72,C.white,0.09,C.line,{shadow:true});
    rect(s,0.72,y,0.09,0.72,c[3],0,c[3]);
    addText(s,c[0],1.02,y+0.12,1.00,0.28,{fontSize:13,bold:true,color:c[3]});
    addText(s,c[1],2.20,y+0.10,1.62,0.30,{fontSize:12,bold:true});
    addText(s,c[2],4.06,y+0.10,3.84,0.32,{fontSize:10.6,color:C.muted});
  });
  rect(s,8.68,1.55,3.95,3.57,C.deep,0.14,C.deep);
  addText(s,'AI 的三个高杠杆位置',9.02,1.88,3.26,0.36,{fontSize:16,color:C.white,bold:true,align:'center'});
  const points=[['探索','快速验证假设'],['路由','处理高信息增益难例'],['沉淀','转化为标签、规则与参数']];
  points.forEach((p,i)=>{
    const y=2.56+i*0.70;
    addSectionChip(s,p[0],9.06,y,0.72,i===1?C.gold:C.cyan,'163B3C');
    addText(s,p[1],9.98,y-0.01,2.02,0.32,{fontSize:11,color:C.darkMuted,bold:true});
  });
  rect(s,0.72,5.51,11.90,0.75,C.deep,0.11,C.deep);
  addText(s,'电话号码校验',1.00,5.73,1.35,0.30,{fontSize:12,color:C.gold,bold:true});
  addText(s,'278,407 条规则验证：号码提取 → 归一化 → 区号补全 → 唯一候选才修复',2.52,5.69,7.30,0.36,{fontSize:12.2,color:C.white,bold:true,align:'center'});
  addText(s,'大模型不适合：成本高、输出不确定、难以满足误拦约束',9.98,5.68,2.18,0.40,{fontSize:9.8,color:C.darkMuted,align:'center'});
  addText(s,'最强模型不等于最佳系统；每种能力应只处理它最擅长、最划算、最可控的样本。',1.40,6.56,10.55,0.30,{fontSize:12.5,color:C.teal,bold:true,align:'center'});
}

// 18 Interception funnel
{
  const s = newLightSlide();
  addTitle(s, 'DAILY INTERCEPTION FUNNEL', '四层校验漏斗：日均 388,180 条输入，预计拦截 38,198 条', 18, '各阶段拦截率按总输入计算；漏斗按 电话 → 印章 → 类型 → 清晰度 顺序展示');

  rect(s, 0.72, 1.42, 11.90, 5.35, C.deep, 0.16, C.deep);

  addText(s, '日均总输入', 1.08, 1.72, 1.28, 0.30, { fontSize: 13, color: C.darkMuted, bold: true });
  addText(s, '388,180', 2.38, 1.59, 2.18, 0.52, { fontFace: MONO, fontSize: 28, color: C.gold, bold: true });
  addText(s, '100%', 4.63, 1.72, 0.72, 0.28, { fontSize: 12, color: C.white, bold: true });
  addText(s, '技术路线', 1.04, 2.31, 1.45, 0.24, { fontSize: 9.5, color: C.cyan, bold: true, charSpacing: 1.2 });
  addText(s, '阶段拦截', 10.13, 2.31, 1.50, 0.24, { fontSize: 9.5, color: C.cyan, bold: true, charSpacing: 1.2, align: 'right' });

  const funnel = [
    { y: 2.68, x: 3.25, w: 6.78, name: '电话号码不合规', method: '规则校验', rate: '1.23%', removed: '4,775', remain: '剩余 383,405', color: C.gold, fill: '5A4923' },
    { y: 3.55, x: 3.52, w: 6.24, name: '无印章', method: '多路模型 + 规则', rate: '3.10%', removed: '12,034', remain: '剩余 371,371', color: C.purple, fill: '3E315D' },
    { y: 4.42, x: 3.80, w: 5.68, name: '文书类型不符', method: '多路模型 + 规则', rate: '1.21%', removed: '4,697', remain: '剩余 366,674', color: C.blue, fill: '293E68' },
    { y: 5.29, x: 4.08, w: 5.12, name: '严重模糊', method: '微调后端到端模型', rate: '4.30%', removed: '16,692', remain: '剩余 349,982', color: C.coral, fill: '633633' }
  ];

  funnel.forEach((f, i) => {
    addSectionChip(s, f.method, 1.04, f.y + 0.13, 1.75, f.color, f.fill);
    rect(s, f.x, f.y, f.w, 0.68, f.fill, 0.08, f.color, { lineWidth: 1.2 });
    addText(s, `${String(i + 1).padStart(2, '0')}  ${f.name}`, f.x + 0.22, f.y + 0.10, 2.30, 0.29, { fontSize: 12.5, color: C.white, bold: true });
    addText(s, f.remain, f.x + 2.58, f.y + 0.12, f.w - 2.82, 0.27, { fontFace: MONO, fontSize: 10.2, color: C.darkMuted, bold: true, align: 'right' });
    addText(s, `${f.removed} 条/日`, 10.04, f.y + 0.06, 1.26, 0.30, { fontFace: MONO, fontSize: 12.5, color: f.color, bold: true, align: 'right' });
    addSectionChip(s, f.rate, 11.45, f.y + 0.11, 0.76, f.color, f.fill);
    if (i < funnel.length - 1) {
      s.addShape(pptx.ShapeType.downArrow, { x: 6.52, y: f.y + 0.70, w: 0.28, h: 0.18, fill: { color: '4E6C70' }, line: { color: '4E6C70' } });
    }
  });

  rect(s, 4.38, 6.17, 4.52, 0.43, '143B3C', 0.08, C.teal, { lineWidth: 1.2 });
  addText(s, '最终通过  349,982 条/日  ·  90.16%', 4.56, 6.23, 4.16, 0.28, { fontFace: MONO, fontSize: 12.7, color: C.cyan, bold: true, align: 'center' });

  addText(s, '总拦截', 9.74, 6.18, 0.75, 0.24, { fontSize: 10, color: C.darkMuted, bold: true });
  addText(s, '38,198', 10.53, 6.09, 1.15, 0.38, { fontFace: MONO, fontSize: 19, color: C.gold, bold: true, align: 'right' });
  addText(s, '9.84%', 11.75, 6.17, 0.52, 0.24, { fontSize: 10.5, color: C.gold, bold: true, align: 'right' });
}

// 19 reflection
{
  const s = newLightSlide();
  addTitle(s, 'REFLECTION & NEXT', '最大的成长：从优化单点指标，转向用业务风险和数据闭环设计系统', 19, '总结与展望');
  addText(s,'做得好的',0.72,1.55,1.42,0.34,{fontSize:16,bold:true,color:C.teal});
  addCard(s,0.72,2.02,3.72,1.20,'回到任务定义','先判断监督信息是否存在，再决定校准、重标注或重建任务。',C.teal,C.white);
  addCard(s,0.72,3.48,3.72,1.20,'实验驱动判断','用对照实验排除错误方向，避免只凭经验选择更大模型。',C.blue,C.white);
  addCard(s,0.72,4.94,3.72,1.20,'构建决策闭环','将模型、规则、选择性路由、人审与难例回流统一设计。',C.purple,C.white);
  addText(s,'需要提升的',4.82,1.55,1.52,0.34,{fontSize:16,bold:true,color:C.coral});
  addCard(s,4.82,2.02,3.72,1.20,'实验前置设计','前期探索略散；后续先建立假设树、Benchmark 与停止条件。',C.coral,C.white);
  addCard(s,4.82,3.48,3.72,1.20,'指标版本治理','统一数据版本、评测子集和指标分母，避免结果口径漂移。',C.gold,C.white);
  addCard(s,4.82,4.94,3.72,1.20,'泛化与校准','继续补充时间外测试、序数评测、概率校准与线上漂移监控。',C.blue,C.white);
  rect(s,8.92,1.55,3.70,4.59,C.deep,0.16,C.deep);
  addText(s,'下一阶段',9.28,1.93,1.50,0.38,{fontSize:18,color:C.white,bold:true});
  const next=[['短期','统一指标口径\n补齐 QWK / L4-5 Recall'],['中期','主动学习高熵样本\n序数目标与轻量融合'],['长期','统一文档 Benchmark\n多任务共享编码器']];
  next.forEach((n,i)=>{
    const y=2.60+i*1.05;
    addSectionChip(s,n[0],9.30,y,0.72,i===0?C.cyan:i===1?C.gold:C.white,'163B3C');
    addText(s,n[1],10.22,y-0.02,1.96,0.62,{fontSize:10.5,color:C.darkMuted,bold:i===0});
  });
  addText(s,'不是换更大的模型，\n而是让系统更准、更轻、更持续。',9.28,5.37,2.98,0.56,{fontSize:12.5,color:C.cyan,bold:true,align:'center'});
}

// 20 ending
{
  const s = pptx.addSlide();
  s.background = { color: C.deep };
  rect(s,8.62,0.62,3.85,5.78,'102C32',0.22,'1C4545');
  for(let i=0;i<5;i++){
    circle(s,9.36+(i%2)*1.44,1.30+i*0.88,0.18,i%2?C.gold:C.mint);
    if(i<4) line(s,9.47+(i%2)*0.22,1.48+i*0.88,1.22,0.70,'2E5C5A',1.2);
  }
  addSectionChip(s,'SUMMARY',0.78,0.86,1.18,C.cyan,'143B3B');
  addText(s,'让模型输出可解释\n让不确定性可管理\n让每次反馈都沉淀为系统能力',0.78,1.65,7.20,2.02,{fontSize:27,color:C.white,bold:true,valign:'top',lineSpacingMultiple:0.96});
  addText(s,'THANKS',0.80,4.50,2.80,0.58,{fontSize:30,color:C.cyan,bold:true,charSpacing:2.0});
  addText(s,'Q&A',0.82,5.22,1.20,0.36,{fontSize:15,color:C.gold,bold:true});
  addText(s,'彭硕 · 华中科技大学 · 腾讯风控算法实习生',0.82,6.38,5.70,0.30,{fontSize:11.5,color:C.darkMuted});
  addText(s,'20',12.25,7.03,0.46,0.24,{fontSize:9,color:C.cyan,bold:true,align:'right'});
}

pptx.writeFile({ fileName: OUT });
