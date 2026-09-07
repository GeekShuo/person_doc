// 彭硕 · 27 届算法岗简历（两页版）
// 编译：typst compile 彭硕_17337745286_两页版.typ

#let accent = rgb("#174f7a")
#let fs = 11.2pt

#set page(
  paper: "a4",
  margin: (top: 0.8cm, bottom: 0.8cm, left: 1.55cm, right: 1.55cm),
)
#set text(
  font: ("Arial", "Heiti SC"),
  size: fs,
  lang: "zh",
)
#set par(justify: true, leading: 0.85em)
#show link: it => text(fill: accent)[#it]

#let sec(title) = block(above: 0.52em, below: 0.28em, breakable: false)[
  #text(size: fs + 1.5pt, weight: "bold", fill: accent)[#title]
  #v(-0.72em)
  #line(length: 100%, stroke: (paint: accent, thickness: 0.75pt))
]

#let entry(left-body, right-body) = block(above: 0.48em, below: 0.08em, breakable: false)[
  #grid(
    columns: (1fr, auto),
    gutter: 0.8em,
    align: (left + horizon, right + horizon),
    left-body,
    text(weight: "bold")[#right-body],
  )
]

#let intro(body) = block(above: 0.2em, below: 0.25em)[
  #set text(fill: rgb("#333333"))
  #body
]

#let bullets(..items) = block(above: 0.18em, below: 0.3em)[
  #set list(indent: 0.18em, body-indent: 0.52em, spacing: 0.26em, marker: [•])
  #list(..items)
]

#let compact-lines(..items) = block(above: 0.16em, below: 0.28em)[
  #set list(indent: 0.18em, body-indent: 0.52em, spacing: 0.18em, marker: [•])
  #list(..items)
]

#align(center)[
  #text(size: 19pt, weight: "bold")[彭硕]
  #v(0.05em)
  #text(size: 9.1pt)[
    (+86) 173-3774-5286 #h(0.38em)·#h(0.38em) shuopeng_hust\@qq.com
    #h(0.38em)·#h(0.38em) #link("https://github.com/GeekShuo")[github.com/GeekShuo]
    #h(0.38em)·#h(0.38em) 求职意向：多模态大模型 / 算法岗（2027 届）
  ]
]

#sec[教育背景]
#entry[*华中科技大学*　网络空间安全　_硕士研究生（推荐免试）_][2024.09 -- 2027.06（预计）]
#entry[*厦门大学*　网络空间安全　_工学学士_　专业排名 *1/44*][2020.09 -- 2024.06]
#block(above: 0.2em, below: 0.2em)[国家奖学金、金龙鱼奖学金（校级，专业 1 人）、一等学业奖学金、优秀毕业生、优秀学生干部]

#sec[技术能力]
#compact-lines(
  [*多模态训练与评测*：全参数 SFT、LoRA、GDPO，多模态数据合成/蒸馏/自动标注，Benchmark 构建，多模型融合与阈值优化],
  [*算法与工程*：PyTorch、Transformers、ms-swift、DeepSpeed、vLLM；PaddleOCR、OpenCV；Python、C/C++、Linux、Docker],
  [*检索与 Agent*：Hybrid Search、Rerank、Milvus、Elasticsearch、LangChain、Dify、MCP、Tool-Calling],
)

#sec[实习经历]
#entry[*腾讯｜CDG · 风控算法实习生*][2026.06 -- 至今]
#intro[面向法院、公安等机构传入财付通的查询、冻结类单据，围绕文书质量、印章、类型与联系电话构建有效性校验链路。]
#bullets(
  [*文书清晰度五级评估*：面向日均去重后 *17.4 万+* 张无参考法律文书图片，融合 OCR 不可辨比例、文字边缘强度、拉普拉斯方差与漏检率建立五级质量标准；以评分均值和方差构造保留等级不确定性的软标签，基于 Qwen3.5-VL 开展 LoRA SFT，通过 CE、KL 散度与概率期望校准完成质量分级。],
  [*无印章识别优化*：针对无印章样本仅占 *2%* 及浅色章漏检，融合三路版面/印章检测模型与 HSV 红色分割，通过 86 组阈值搜索、sure/unsure 选择性分类及 VLM 难例复核，在高置信自动处理子集实现 *Precision 100%、Recall 98.94%*；主链路参数量低于 100M、单图耗时低于 1s。],
  [*文书类型识别*：构建方向检测、全文 OCR、标题定位与白名单分类级联链路，通过阅读顺序恢复、同义词归一化和自适应模糊匹配，将数万条人工标注数据的 *Accuracy 由 94.59% 提升至 99.99%*，单条耗时 0.28s。],
  [*号码有效性校验*：构建号码提取、区号补全及一致性校验规则链路，通过异常 Case 回流持续修正边界；在 *27.8 万* 条数据中修复 *6.5 万* 条号码、检出 *9.8%* 无效号码，上线后每日减少百万次无效查询。],
)

#entry[*京东零售｜AIGC 商品编辑模型 · 数据与评测*][2026.04 -- 2026.05]
#intro[面向商品主图与营销海报生成，负责训练数据清洗、OCR 模型评测部署与生成效果评测。]
#bullets(
  [*训练数据清洗*：设计融合图像规则、OCR、文字贴片检测与 Qwen3-VL 美学评分的多级流水线，建立抽检、难例回流与规则迭代闭环；制定标注验收规范并组织外包培训，高质量数据产出率 *86%*。],
  [*OCR 评测与部署*：制定分层文字标注标准并构建人工 GT，横评 OCR/VLM 方案，选型方案 *F1 95.21%*、误检数由 73 降至 15；完成华为 910C 推理部署，接入数十万级数据清洗链路。],
  [*生成模型评测体系*：构建服饰、家居扩图任务 1,000 条 Benchmark，将主体保真、文字与结构拆解为原子指标；内部模型机评可用率较 Nano Banana Pro、Seedream-5.0-lite 分别领先 *7.0、12.1 个百分点*。],
)

#pagebreak()

#align(center)[
  #text(size: 12pt, weight: "bold")[彭硕｜多模态大模型 / 算法岗]
  #h(0.6em)
  #text(size: 8.8pt, fill: rgb("#555555"))[173-3774-5286 · shuopeng_hust\@qq.com]
]

#sec[实习经历（续）]
#entry[*京东｜CCO 体系 · AI 安全部 · 大模型后训练实习生*][2025.10 -- 2026.03]
#intro[面向京东 AI 对话功能建设多模态安全护栏，并参与企业知识助手的检索与记忆模块建设。]
#bullets(
  [*多模态数据构建*：整合业务、开源与合成数据，基于 Qwen3-VL-235B、多模型投票与规则过滤完成初始标注；通过宽松/严格判别模型交叉标注、投票聚合及正负样本对照增强降低标签噪声，产出 *89 万条多模态 SFT 数据*，覆盖数十类风险场景。],
  [*多模态模型后训练*：对 Qwen3-VL-8B 进行全参数 SFT，并采用 GDPO 开展多目标强化学习；对拦截、误杀和格式奖励分别归一化与加权，抑制单一奖励主导，*高风险识别 F1 超过 85%*，同时降低过度拒答。],
  [*企业知识助手*：采用 Hybrid Search 与 Rerank 提升长尾查询召回，以向量化长期记忆支持跨会话信息利用；系统接入 *300+* 数据源，支撑 *150+* 部门及个人的定制化资讯推送。],
)

#sec[项目经历]
#entry[*虹服｜校企合作 · 自动化渗透测试 Agent*][2025.01 -- 2025.06]
#bullets(
  [设计并实现基于大语言模型的 Multi-Agent 自动化渗透测试系统，采用“任务规划—策略推理—工具执行”分层架构，支持复杂网络环境下的路径搜索与漏洞发现。],
  [通过 Tool-Calling 接入端口/目录扫描、指纹识别、漏洞扫描、爬虫与自动化浏览器等工具，结合 RAG 提供目标上下文，并以异步执行和并行调度优化整体效率。],
)

#entry[*华为｜校企合作 · WebAssembly 性能优化*][2024.11 -- 2025.04]
#bullets(
  [提出离线、硬件无关且以安全为前提的 WebAssembly 运行时优化方法，引入混合执行器、安全分析器与静态重写框架，跳过非必要动态检查；在真实用例与 SPEC CPU Benchmark 上实现 *12.95%* 性能提升。],
)

#sec[荣誉与竞赛]
#compact-lines(
  [国家奖学金；金龙鱼奖学金（校级，专业 1 人）；厦门大学优秀毕业生],
  [中国大学生计算机设计大赛国家级三等奖；美国大学生数学建模竞赛 Honorable Mention；全国大学生数学建模竞赛省级二等奖；蓝桥杯 C/C++ A 组省级二等奖],
)

#sec[组织与社会实践]
#compact-lines(
  [厦门大学“纸飞机”公益编程实践队队长：带队为厦漳泉地区 *80+* 名中学教师开展 Python 培训，团队获校级优秀实践团队。],
  [华中科技大学网安硕士 3 班副班长、院学生会学术部干事；厦门大学创客协会核心骨干。],
)
