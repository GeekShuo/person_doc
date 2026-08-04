// 彭硕 · 27届算法岗简历（Typst 版）
// 编译：typst compile 彭硕-简历-27届-算法岗.typ
// 预览：typst watch 彭硕-简历-27届-算法岗.typ
// 想要更宽松/更紧凑：调#let fs（正文字号）与 #let lead（行距）

#let fs = 9.05pt
#let lead = 0.58em

#set page(paper: "a4", margin: (top: 0.9cm, bottom: 0.9cm, left: 1.15cm, right: 1.15cm))
#set text(
  font: ("Libertinus Serif", "Times New Roman", "Songti SC", "PingFang SC"),
  size: fs,
  lang: "zh",
)
#set par(justify: true, leading: lead)
#show link: it => text(fill: rgb("#14477a"))[#it]

// 章节标题 + 分隔线
#let sec(title) = block(above: 0.7em, below: 0.42em)[
  #text(size: fs + 1.6pt, weight: "bold")[#title]
  #v(-0.78em)
  #line(length: 100%, stroke: 0.7pt)
]

// 左右两栏条目（左：机构 / 角色，右：时间）
#let entry(left-body, right-body) = block(above: 0.4em, below: 0.15em)[
  #grid(columns: (1fr, auto), gutter: 0.5em, left-body, text(weight: "bold")[#right-body])
]

// 项目符号列表
#let bullets(..items) = {
  set list(indent: 0.2em, body-indent: 0.42em, spacing: lead, marker: [•])
  list(..items)
}

// ========================抬头 ========================
#align(center)[
  #text(size: 18pt, weight: "bold")[彭硕]
  #v(0.1em)
  #text(size: fs)[
    (+86) 173-3774-5286 #h(0.5em)|#h(0.5em) shuopeng\_hust\@qq.com
    #h(0.5em)|#h(0.5em) #link("https://github.com/GeekShuo")[github.com/GeekShuo]
    #h(0.5em)|#h(0.5em) 求职意向：多模态大模型 / 生成模型算法岗（2027 届）
  ]
]

// ======================== 教育背景 ========================
#sec[教育背景]
#entry[*华中科技大学*　网络空间安全　_硕士研究生_][2024.09 -- 2027.06（预计）]
#entry[*厦门大学*　网络空间安全　_工学学士_　专业排名 *1/44*][2020.09 -- 2024.06]
国家奖学金、金龙鱼奖学金（校级，专业仅 1 人）、优秀三好学生、优秀毕业生

// ======================== 技术能力 ========================
#sec[技术能力]
#bullets(
  [*多模态与大模型*：VLM 训练与评测（Qwen3-VL 全参数 SFT、GDPO 多目标强化学习）、图像生成与编辑（Qwen-Image-Edit、Flow Matching、LoRA）、数据合成与蒸馏、Benchmark 与指标体系设计],
  [*视觉与文档智能*：PaddleOCR / PP-DocLayout 系列、OpenCV 传统视觉、XGBoost、多模型信号融合、选择性分类（unsure 拒识）、类别不均衡与 PR 曲线分析],
  [*Agent 与检索*：LangChain、Dify、MCP、Multi-Agent（ReAct）、Hybrid Search + Re-ranking、Long-term Memory、VectorDB（Milvus / ES）],
  [*框架与工程*：PyTorch、Transformers、PEFT、DeepSpeed、vLLM、ms-swift；Python（Expert）、C/C++、SQL、Linux、Git、Docker、FastAPI；英语可作为工作语言],
)

// ======================== 实习经历 ========================
#sec[实习经历]

#entry[*腾讯*　| 文档智能算法实习生（业务文档理解与线上审核）][2026.06 -- 至今]
#bullets(
  [*关键要素检测：多模型融合 + 选择性分类*。负类样本占比 \< 2%，线上基线 Accuracy 98.6% 但切换目标类别后 Precision 仅约 30%。重建 1,152 张分层评测集（补充 116 张稀缺负类），把优化目标由 Accuracy 改为 Precision / Recall / Coverage；融合 PP-DocLayoutV2、PP-DocLayout-L、专用检测模型与 OpenCV 颜色-形态学四路信号，低置信样本经 unsure 拒识交由 VLM 与人工兜底，搜索上百组阈值 / 融合策略并经三轮 Bad Case 标注回流。最终在 *Precision 100%* 约束下将目标类别 *Recall 由 10% 提升至 98.94%（F1 99.37%）*，远超纯 OpenCV 基线（P 61.5% / R 10%），总参数量 \< 100M、单样本推理 \< 1s。],
  [*文档类型识别链路*。针对 OCR 幻觉、多图横排、页面旋转与版式差异，设计「图像预处理 → OCR 标题识别 → Layout 版面分析 → 方向检测 → 白名单最长匹配」级联方案，建立同义词归一化、按标题长度自适应的编辑距离容错与分块锚点匹配机制，并按 6 类归因逐一修复 Bad Case；在 *1.18 万条*标注评测数据、30 个类别上将准确率由 *94.59% 提升至 99.9%*，平均 0.28 s/条。],
  [*结构化字段有效性校验*。设计八阶段号码抽取 + 三阶段区号补全与一致性校验流程，修正 phonenumbers 地理库「最短可区分前缀」缺陷、补齐区县→地级市→区号映射并统一 E.164 标准化，另以爬虫做真实性交叉验证；在 *27.8 万条*数据上判定 11.7% 无效、修复救回 23.3% 原判无效样本，日均可拦截无效工单由 739 条提升至 *8,900+*，已与业务方对齐并推进上线。],
  [*前置过滤与标注基建*。优化「图像特征 + RapidOCR + XGBoost」模糊检测方案并完成国产加速卡适配，吞吐提升至 30 条/s，在 17.4 万条数据中检出 13.8% 模糊样本；自研 3 套带权限管理的标注与实验可视化平台，支撑多轮人工标注闭环。],
)

#entry[*京东零售*　| 多模态图像生成算法实习生（数据与评测方向）][2026.04 -- 2026.05]
#bullets(
  [*商品主图训练数据链路*。设计并落地级联式清洗漏斗：前置低成本规则（分辨率 / 白边 / 对比度锐度）、中段模型过滤（OCR 文字占比、文字贴片与模糊检测、主体分割）、后置 VLM（Qwen3-VL）美学评分，前段召回优先、后段精度优先，将昂贵推理与人工标注集中于高价值候选；同时定义商品主体性、图像质量、视觉组件完整性与文字准确性的分层标注规范并培训外部标注团队，形成「自动过滤 — 人工标注 — Case 回流」闭环，优质单图人工通过率 *86%*，支撑数十万级训练数据生产。],
  [*OCR 选型与服务化部署*。构建营销贴片场景专项评测体系（人工精修 GT、全半角与标点归一化、merge / split 匹配、小字与近似替换错误分层）；因错误文本会直接污染训练集，以 Precision 为主指标对比 PaddleOCR v5、PaddleOCR-VL 1.5 与视觉大模型，选型方案先导集达 *95.05% Precision / 95.21% F1*，误检由 73 降至 15（-79%），并完成推理服务化部署接入清洗链路。],
  [*生成模型评测与训练框架分析*。构建服饰、家居两品类共 *1,000 条*方转长 Benchmark，统一推理 Prompt 并将业务审核规则拆为十余个原子维度做 GPT-5 逐项机评与 Bad Case 归类，内部方案机评可用率 *54.9%*，领先 Nano Banana Pro / Seedream-5.0-lite *7.0pp / 12.1pp*；拆解 Qwen-Image-Edit 全参微调、LoRA 与多参考图训练代码，梳理 Flow Matching 速度预测目标、参考图 latent 条件拼接与 DeepSpeed 流程，定位 LoRA target modules 缺失逗号、Resolution Bucket 分支被 Dataset 覆盖等隐性缺陷。],
)

#entry[*京东*　| 大模型算法实习生（AI 安全与智能体方向）][2025.10 -- 2026.03]
#bullets(
  [*百万级多模态安全数据构建*。通过业务数据清洗、爬虫采集、开源数据过滤与数据合成构建图文审核数据集，设计「大参数 VLM（Qwen3-VL-235B）多模型聚合投票 + 启发式规则 + 质量过滤」自动标注管线，蒸馏出 *100W+* 多轮图文 SFT 数据，覆盖涉政、色情、暴力等数十类风险；引入多模态思维链（CoT）格式，提升对视觉偷渡与隐晦违规样本的识别能力与可解释性。],
  [*VLM 训练与多目标强化学习*。构建统一的多轮多模态审核框架，基于 ms-swift 对 Qwen3-VL-8B 完成分布式*全参数 SFT*（混合精度与显存优化），并引入 *GDPO* 做多目标强化学习；对风险拦截、误杀惩罚、格式遵循等多维奖励做归一化与加权，缓解单一奖励主导引发的奖励坍塌，最终高风险识别 *F1 \> 85%* 且过度拒绝显著下降。],
  [*企业合规智能体*。负责合规数字人核心模块，覆盖知识问答、资讯推送、公文写作、DeepResearch 与长短期记忆；搭建覆盖 *300+* 垂直数据源的采集与知识更新链路，为 *150+* 部门级与个人级用户定制检索排序策略；采用 Hybrid Search + Re-ranking 两阶段召回缓解长尾知识幻觉，引入向量化 Long-term Memory 实现跨会话上下文保持。],
)

// ======================== 项目经历 ========================
#sec[科研与项目经历]
#entry[*虹服 | 校企合作项目*　自动化渗透测试 Multi-Agent 系统][2025.01 -- 2025.06]
#bullets(
  [设计并实现基于 LLM 的「任务规划 — 策略推理 — 工具执行」分层 Multi-Agent 架构，通过 Tool-Calling 赋予模型端口 / 目录扫描、指纹识别、漏洞扫描、爬虫与浏览器自动化能力，并以 RAG 注入目标上下文提升指令针对性，异步执行与并行调度优化整体吞吐。],
)
#entry[*华为 | 校企合作项目*　WebAssembly 运行时性能优化][2024.11 -- 2025.04]
#bullets(
  [提出离线、硬件无关且以安全为前提的 Wasm 加速方法，引入混合执行器、安全分析器与静态重写框架，在安全性可证前提下跳过非必要动态检查，于真实用例与 SPEC CPU 上取得 *12.95%* 性能提升。],
)

// ======================== 竞赛获奖与其他 ========================
#sec[竞赛获奖 / 社区参与]
#bullets(
  [计算机设计大赛*国家级三等奖*（2023.07）；美国大学生数学建模竞赛 Honorable Mention *国际级三等奖*（2022.01）；蓝桥杯 C++ A 组*省级二等奖*（2022.04）；全国大学生数学建模竞赛*省级二等奖*（2021.09）],
  [华科网安硕士 3 班副班长、院学生会学术部干事；厦门大学创客协会核心骨干；「纸飞机」公益创客编程教育社会实践队队长（校级优秀团队，培训厦漳泉地区 80+ 中学教师 Python 编程）],
)
