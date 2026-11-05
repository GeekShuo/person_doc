# Qwen 系列 VLM：架构演进与设计动机

> 架构研究 / TECHNICAL NOTES

从 Qwen-VL 到 Qwen3.8：视觉编码、位置编码、跨模态融合与长上下文效率

版本：2026-11-04 | 范围：视觉语言理解模型（非图像生成或 Omni 音频模型）

![VLM 整体数据流](Qwen_VLM_assets/media/image1.png)

**阅读方式：先看版本演进，再看关键机制的原理与取舍，最后用“问题—设计—原因—代价”表做复习。**

注意｜证据标准：将“官方论文/模型配置已明确披露”的事实与“根据机制提出的工程解释”分开标注。模型公开配置可能因尺寸不同而异。

# 速览｜最值得记住的七个变化

- ① Qwen-VL：ViT + 跨模态连接器 + LLM，主要在固定尺寸图像上构建基础视觉问答能力。

- ② Qwen2-VL：原生动态分辨率、视觉侧 2D-RoPE、LLM 侧 M-RoPE、Patch Merger，把图像和视频位置显式结构化。

- ③ Qwen2.5-VL：视觉侧 Window Attention（少量全局层）、RMSNorm / SwiGLU 与动态 FPS / 绝对时间对齐，重点提升效率和真实时空感知。

- ④ Qwen3-VL：SigLIP-2 视觉骨干、绝对位置插值 + 2D-RoPE、DeepStack、Interleaved-MRoPE、文字时间戳，强化细粒度视觉信息与长视频。

- ⑤ Qwen3-Next（LLM 技术支线）：3:1 Gated DeltaNet + Gated Full Attention，探索长上下文效率与精确检索之间的折中。

- ⑥ Qwen3.5：原生图文视频交错预训练 + 混合注意力主干，公开 27B 配置无 DeepStack（索引为空）。

- ⑦ Qwen3.8：延续 Qwen3.5 的架构路线，侧重规模、Coding、长程 Agent、多模态复杂任务的可靠交付，不是所有视觉新结构都从 3.8 才出现。

## 典型 VLM 数据流

![VLM 整体数据流](Qwen_VLM_assets/media/image1.png)

注意｜注：位置编码有两处：视觉编码器中用于 Patch 的二维空间关系，LLM 中用于图文视频混合 Token 的时空关系；它们不能混为一谈。

## 文档结构

01 版本演进总表 · 02 RoPE / 动态分辨率 · 03 视觉注意力与 DeepStack · 04 混合主干与原生多模态 · 05 RMSNorm / SwiGLU · 06 工程与面试速查 · 07 参考资料

# 01｜版本演进：发生了什么变化？

| **代际 / 时间** | **视觉编码器及分辨率** | **位置与融合** | **工程设计动机** |
| --- | --- | --- | --- |
| **Qwen-VL<br> 2023** | ViT；开源主线以固定 448&times;448 为代表 | 视觉&rarr;连接模块&rarr;文本 LLM | 先建立可训练的图文语义对齐与视觉问答能力 [1] |
| **Qwen2-VL<br> 2024** | ViT + Naive Dynamic Resolution；Patch 数随分辨率变化 | ViT 2D-RoPE；LLM M-RoPE；2&times;2 Merger | 避免强行缩图丢细节；让图像/视频 Token 带结构化坐标 [2] |
| **Qwen2.5-VL<br> 2025.01** | 原生动态分辨率 ViT；窗口注意力 + 4 层全局 | M-RoPE 的绝对时间对齐；ViT RMSNorm / SwiGLU | 控制高分辨率计算；学习事件时间尺度与真实图像坐标 [3] |
| **Qwen3-VL<br> 2025.09** | SigLIP-2 ViT；动态分辨率；2D-RoPE + 可插值绝对位置 | Interleaved-MRoPE；DeepStack；文本时间戳 | 平衡高低频时空坐标、注入多层细节、改善长视频时间建模 [4] |
| **Qwen3.5<br> 2026.02** | 视觉塔 + Merger 保留；原生图文视频交错预训练 | 3:1 Gated DeltaNet / Gated Attention 主干；27B 配置无 DeepStack | 降低长序列成本，并从基础预训练阶段形成跨模态能力 [6][7][8] |
| **Qwen3.8<br> 2026.08** | 延续 3.5 视觉语言底座，具体结构因模型而异 | 混合注意力、MoE 等路线延续 | 主要提升模型规模、复杂工作流和长程 Agent 的效果与可靠性 [10][11] |

注意｜版本命名提醒：Qwen3（文本主线）与 Qwen3-VL（视觉语言主线）不是同一个 checkpoint；Qwen3-Next 是 LLM 架构节点。不同尺寸也不一定采用相同视觉参数。

# 02｜位置编码：从 1D-RoPE 到多模态时空坐标

## 2.1 为什么要引入 RoPE？

早期可学习绝对位置嵌入给每个位置配置独立参数，典型做法是 xᵢ + Pᵢ。缺点是超出预设位置需要适配；不同位置向量本身也不直接表达相对距离。RoPE 则在 Attention 的 Q、K 上施加由位置决定的二维旋转，不给每一个位置单独训练一行权重。[14][15]

R(φ) = [[cosφ, −sinφ], [sinφ, cosφ]]  
q′ₘ = R(mθ)qₘ ; k′ₙ = R(nθ)kₙ  
q′ₘᵀ k′ₙ = qₘᵀ R((n−m)θ) kₙ

注意：“旋转”不是把矩阵数值加进 Score，而是先改 Q、K 的方向，再通过点积改变相似度。相同内容在不同相对距离下可以得到不同分数。

## 2.2 周期性问题：为什么远距离有时也得高分？

若二维示例 q=k=(1,0)，则 Score(Δ)=cos(Δθ)。它本来就是周期函数，单一频率下远距离旋转一整圈会回到相同角度。因此 RoPE 并不保证“离得越远，分数越低”。真实 RoPE 使用多个频率的二维子空间，以减少不同位置的混淆，但不数学保证永不碰撞，更不等于无限长上下文外推。

θᵢ = base^(−2i/d) （不同二维通道的频率不同）  
总 Score = 各二维子空间点积贡献之和

设计动机：让 Attention 分数对相对位移敏感；代价：仍存在周期别名、长距离外推和位置频谱分配问题。需要位置插值或 YaRN 等扩展方案时，应结合具体训练长度评估。

## 2.3 2D-RoPE：高度 h 与宽度 w 怎样进入 Q/K？

对每个图像 Patch 使用坐标 (h,w)，把每个 Attention Head 的通道分成“高度组”和“宽度组”（概念层面的分组；实际代码的通道排列可能不同）。两组分别乘以角度 hθᵢ 与 wθᵢ 的旋转矩阵。

q′(h,w) = blockdiag(R(hθ₀), R(hθ₁), R(wθ₀), R(wθ₁), …) · q  
Score(A,B) ≈ 高度子空间对 Δh 的相关性 + 宽度子空间对 Δw 的相关性

这样同样的线性位置差，可以区分“上下相邻”与“左右相邻”。ViT 中 2D-RoPE 解决的是图像 Patch 的空间组织问题；它不改变 QKᵀ → Softmax → V 的主公式。[2][4]

## 2.4 M-RoPE 与 Interleaved-MRoPE

Qwen2-VL 在 LLM 中采用 M-RoPE，将位置表示扩展成 (t,h,w)：文本可退化为一维序列，图像具备二维坐标，视频另外具有时间坐标。[2]

Qwen3-VL 发现将时间/高/宽各占连续频段，可能让三个坐标轴获得不平衡的频率覆盖；于是把三轴位置交错分布于高低频旋转通道中（Interleaved-MRoPE），改善长视频的时空位置表征。[4]

重要修正：Qwen3-VL 的 ViT 并非“只用 2D-RoPE、完全不用绝对位置”。官方论文明确说明，它同时使用 2D-RoPE，并对绝对位置嵌入按输入尺寸进行插值。[4]

# 03｜视觉 Token：动态分辨率与计算成本

## 3.1 从固定尺寸到 Naive Dynamic Resolution

固定输入尺寸简化批处理，但高分辨率 OCR、票据、表格、截图上的小字可能在缩放中丢失。Qwen2-VL 的 Naive Dynamic Resolution 使图像按照实际尺寸生成动态数量的 Patch Token，再通过像素预算和预处理约束控制规模。[2]

| **示例（简化）**      | **Patch 网格** | **合并前 Token** | **2×2 Merger 后** |
|-----------------------|----------------|------------------|-------------------|
| **448×448，Patch=14** | 32×32          | 1024             | 256               |
| **896×896，Patch=14** | 64×64          | 4096             | 1024              |

示例是为了说明量级。真实模型的网格对齐、视频 temporal patch 与最小/最大像素约束，均以对应 processor 配置为准。

## 3.2 Patch Merger 为什么必要？

图像分辨率提高一倍，Patch 数可变成原来的四倍；若把所有 ViT 输出直接送入 LLM，Prefill、KV Cache 和多模态上下文预算都会增加。Merger 将相邻 2×2 Patch 聚合成一个视觉 Token（空间 Token 数约减少至 1/4），在细节与成本之间做压缩折中。[2][4]

代价：压缩有可能损失非常细的字符、标点和边缘结构。因此多模态 OCR / 审核任务需要分别衡量“高分辨率收益”和“压缩造成的漏检”。

# 04｜视觉骨干：Window Attention 与 DeepStack

## 4.1 Qwen2.5-VL 为什么采用 Window Attention？

完整自注意力对 N 个 Patch 的计算量近似 O(N²d)；如果改成每个位置只与一个大小为 M 的局部窗口交互，其序列相关开销约为 O(NMd)。Qwen2.5-VL 的 ViT 仅 4 层采用 Full Attention，其他层采用不超过 8×8 Patch 的 Window Attention，以缓解高分辨率输入的视觉侧负载不均衡问题。[3]

代价：大多数层主要建模局部关系，跨区域直接交互更少，需要少量全局层补充。因此 Window Attention 并不是“模型不看整张图”，而是限制各层直接交互的范围。

## 4.2 Qwen3-VL 的视觉注意力：应如何表述？

Qwen3-VL 的 Hugging Face 公共实现中，视觉注意力按图像/帧的 packed sequence 执行非因果 Attention，未见 Qwen2.5-VL 的窗口划分分支；在这一实现下可以视为视觉侧 Full Attention。[13]

注意｜关于“为什么官方取消了窗口注意力”，现有官方论文没有给出直接消融或明确理由。更充分跨区域建模、与多层特征融合的配合，是可以提出的工程假设，但不是已经被实验证实的团队动机。

## 4.3 DeepStack 解决了什么问题？

只取 ViT 最后一层特征再送入 LLM，容易对中间层的纹理、布局等多尺度线索利用不足。Qwen3-VL 选取三个不同深度的视觉层输出，分别经过轻量 Merger 投影，再作为残差信息注入 LLM 前三个对应层，无需增加主序列长度。[4]

标准：ViT 最后一层 → Merger → LLM 输入层  
DeepStack：ViT 多个中间层 → 独立 Merger → LLM 前几个层的残差注入

Qwen3-VL 官方消融：在其报告给出的设置下，DeepStack 版本平均分 76.0，对照版本 74.7；文档理解相关基准也有改善。这是具体实验设置的结果，不是所有任务都能保证提高。[4]

注意｜Qwen3-VL-8B 的公开配置设置 deepstack_visual_indexes=[8,16,24]；Qwen3.5-27B 则为 []。这支持“对应公开实现不再使用 DeepStack”的结论，但不能直接证明其取消原因是效率或联合训练。[5][8]

# 05｜语言主干：Gated DeltaNet + Full Attention

Qwen3-Next 在语言模型主干引入混合结构；Qwen3.5 将这一设计与视觉语言基础模型结合。典型 3:1 层比：三层 Gated DeltaNet（线性注意力/循环记忆）搭配一层 Gated Full Attention。[7][9]

![Gated DeltaNet 与 Full Attention 混合结构](Qwen_VLM_assets/media/image2.png)

## 5.1 两者各自负责什么？

标准 Full Attention 能对可见历史 Token 的 K/V 做逐 Token 的相关性检索，适合精细关联与远程查找，但长上下文的训练计算和生成时 KV 读取开销大。

Gated DeltaNet 用固定大小的循环状态记忆历史关联，通过门控控制旧状态保留，并利用 Delta Rule 的误差信号写入新信息。其解码时状态大小近似不随历史 Token 数增长，但固定状态可能丢失细节。

示意状态更新（非完整源码）：  
Sₜ = αₜ Sₜ₋₁ + βₜ (vₜ − αₜ Sₜ₋₁ kₜ) kₜᵀ  
yₜ ≈ Sₜ qₜ

式中 α 表示保留/遗忘，β 表示更新强度；(v−旧状态对 k 的预测) 是 Delta Rule 的误差项。实际 Qwen 内部还包含卷积、输出门控、归一化等实现细节。[9]

## 5.2 为什么混合而不是只用一种？

全部 Full Attention：高精度检索能力强，长序列成本高。全部线性注意力：吞吐和缓存更省，但固定状态对于大量精确历史事实的召回有局限。混合层让大部分层高效聚合历史，少部分层仍能直接访问历史 KV。这是“效率 × 召回”折中，而不是把同一层输出做 75%/25% 加权平均。[9]

MoE 属于 FFN 参数路由的另一条设计维度：控制每 Token 激活的专家参数量；它和“用哪种 Attention”是两个可以组合的选择。

# 06｜训练范式：什么叫原生多模态？

## 6.1 不等于没有 ViT / 没有 Projector

Qwen3.5 的 Native Multimodal 重点是训练范式：从基础预训练阶段，就使用交错的文本、图像、视频 Token 共同学习，而非只在一个已完全成型的纯文本 LLM 之后追加少量视觉对齐训练。它依然可以使用 ViT / Merger 将像素映射到可被 LLM 消费的视觉 Token。[6][7]

| **维度**     | **典型后接式 VLM**               | **Qwen3.5 强调的原生多模态**               |
|--------------|----------------------------------|--------------------------------------------|
| **训练起点** | 先文本基础模型，后视觉适配 / SFT | 基础模型训练阶段即大规模接触交错多模态序列 |
| **视觉入口** | ViT + 连接器（常见）             | 仍可保留 ViT + Merger                      |
| **语言主干** | 重点适应新加入的视觉 Token       | 共同学习跨模态知识、推理及语言能力         |
| **主要风险** | 模态对齐不足、视觉能力后接损耗   | 数据配比、负迁移、跨模态目标平衡与训练成本 |

“原生”不是一个拥有严格统一测试门槛的数学术语。Qwen2.5-VL、Qwen3-VL 也有端到端训练；差别在于 Qwen3.5 对早期融合、统一基础预训练和长任务训练的定位更强。[3][4][6]

## 6.2 从 VLM 到多模态 Agent 的进一步要求

传统图文问答看重“识别并回答”；多模态 Agent 需要持续读取界面/视频反馈，规划和调用工具，并能在多次失败后修正。因此训练目标会扩大到工具调用、长程执行、环境反馈、奖励设计和任务完成率。Qwen3.8 的公开介绍重点在这一能力与规模的强化，而非宣布发明新的 ViT–LLM 连接范式。[10][11]

# 07｜基础算子：RMSNorm、SwiGLU 在哪里出现？

## 7.1 标准 Decoder Block 的路径

x → RMSNorm → Attention / Gated DeltaNet → Residual Add  
→ RMSNorm → FFN（例如 SwiGLU） → Residual Add → 下一层

RMSNorm 是归一化算子，常放在子层输入侧（Pre-Norm）；SwiGLU 则是 FFN 内部的门控激活和特征变换结构。它们不是位置编码，也不是图文融合层。

## 7.2 RMSNorm：控制隐藏状态的数值尺度

RMSNorm(x) = x / sqrt(mean(x²) + ε) ⊙ γ

与 LayerNorm 相比，RMSNorm 不做减均值步骤，重点控制均方根尺度，计算路径更简洁。它有助于深层网络中的数值稳定和优化，并不意味着每个维度都被压到 0～1。

## 7.3 SwiGLU：门控的 FFN

SwiGLU(x) = W_down [ SiLU(W_gate x) ⊙ (W_up x) ]  
SiLU(z) = z · sigmoid(z)

FFN 分成 Gate 与 Up 两条支路，前者经过 SiLU 后逐元素调制后者，再投影回隐藏维度。相比简单 ReLU FFN，增加了可学习的门控非线性；Gate 不被限制在 0～1。

## 7.4 一定要区分 LLM 与 ViT 的实现

| **对象**                      | **归一化 / 激活**                         | **可以核实的事实**                                                           |
|-------------------------------|-------------------------------------------|------------------------------------------------------------------------------|
| **Qwen2 及 Qwen2.5 文本主干** | RMSNorm / SwiGLU                          | 现代 Qwen LLM 的常见设计 [12]                                              |
| **Qwen2.5-VL 的 ViT**         | RMSNorm / SwiGLU                          | 官方明确作为视觉编码器的改动披露 [3]                                       |
| **Qwen3-VL 的公开 ViT**       | LayerNorm / GELU（相关实现）              | HF 源码 VisionBlock 使用 LayerNorm，配置激活为 gelu_pytorch_tanh [5][13] |
| **Qwen3.5-27B 文本 / 视觉**   | 文本：RMSNorm / 门控 MLP；视觉：GELU 配置 | 不要把 LLM 的算子配置直接套到 ViT 上 [8]                                   |

# 08｜设计决策速查：问题 → 方案 → 代价

| **真实问题**                 | **设计方案**              | **为什么有效**                         | **主要代价 / 失败模式**        |
|------------------------------|---------------------------|----------------------------------------|--------------------------------|
| **细小文字因缩放消失**       | 动态分辨率                | 保留更多原始图像细节                   | 视觉 Token 膨胀、计算波动      |
| **图像行列关系难保留**       | ViT 2D-RoPE               | Attention Score 显式依赖 Δh、Δw        | 频率设计、距离周期性           |
| **图文视频位置坐标不统一**   | M-RoPE / Interleaved      | 一套机制处理 t、h、w，多尺度频率更均衡 | 时空坐标与视频采样配置复杂     |
| **高分辨率 ViT 成本高**      | Window Attention / Merger | 减少直接交互范围或 Token 数            | 跨窗口信息、细节可能损失       |
| **LLM 只收到最后层视觉特征** | DeepStack                 | 向 LLM 前几层补充多层表征              | 实现和投影模块复杂             |
| **长视频时序定位困难**       | 动态 FPS / 文本时间戳     | 显式描述真实时间流逝                   | 时间位置策略与序列长度权衡     |
| **长上下文 KV 成本高**       | DeltaNet + Full Attention | 多数层压缩历史，少数层直接检索         | 压缩状态召回限制，混合算子复杂 |
| **后接视觉知识融合不足**     | 早期多模态联合预训练      | 语言和视觉共同形成基础表示             | 数据配比、对齐成本与负迁移     |
| **训练不稳 / FFN 表达有限**  | RMSNorm / SwiGLU          | 稳住尺度；学习门控非线性               | 额外门控投影的计算与参数       |

# 09｜用于 VLM 算法项目的实践检查单

- 视觉 Token 预算：记录原图宽高、缩放后的网格、Merger 前后 Token 数与峰值显存。

- 细粒度任务：OCR / 图文违规识别应单列小字、角落文字、跨区域指代、截图嵌套和长图等子集。

- 视频任务：同时测短片 / 长片、变帧率、密集事件、跨帧指代和时间戳定位，避免只看问答准确率。

- 位置外推：按训练内 / 训练外长度分桶，评估 needle retrieval、长距离指代和周期混淆。

- 融合消融：对比 ViT 末层 / 多层注入、分辨率、视觉 Token 裁剪策略，报告效果与吞吐，不仅报告单一总分。

- 训练配方：将文本、图像、视频数据混比、SFT / RL 阶段、任务奖励与误报/漏报成本分别记录，避免归因到某一个结构。

# 10｜面试回答的四个高频句式

Q1：为什么 RoPE 能表示相对位置？ 因为 R(mθ)ᵀR(nθ)=R((n−m)θ)，经过旋转的 QK 点积对相对位置差敏感；但不是距离越远分数必降。

Q2：为什么 Qwen2-VL 是动态分辨率关键节点？ 因为图像可生成随分辨率变化的 Patch Token，ViT 使用 2D-RoPE，LLM 使用 M-RoPE，再由 Merger 控制 Token 成本。

Q3：为什么曾用 Window Attention，后来又有 Full Attention？ Window 主要节省 ViT 计算；Full 每层提供更充分的直接跨区域交互。Qwen3-VL 的公开实现采用后者，但官方没有提供充分消融来定论变更动机。

Q4：什么是原生多模态 + 混合主干？ 前者是基础预训练阶段共同学习文本、图像、视频；后者是 3:1 DeltaNet / Full Attention 的层级组合，两者分别属于训练范式与序列建模架构。

# 11｜事实边界与资料索引

事实等级：A = 官方论文/发布博客明确说明；B = 官方 checkpoint / 开源代码可验证；C = 基于架构机制的工程推断。本文对原因不确定的项均保留“可能/推断”措辞。

**[1] Qwen-VL: A Versatile Vision-Language Model (论文)** [https://arxiv.org/abs/2308.12966](https://arxiv.org/abs/2308.12966)

**[2] Qwen2-VL 技术报告（动态分辨率 / M-RoPE）** [https://arxiv.org/abs/2409.12191](https://arxiv.org/abs/2409.12191)

**[3] Qwen2.5-VL 官方中文博客（Window、RMSNorm、SwiGLU）** [https://qwenlm.github.io/zh/blog/qwen2.5-vl/](https://qwenlm.github.io/zh/blog/qwen2.5-vl/)

**[4] Qwen3-VL Technical Report（Interleaved MRoPE / DeepStack）** [https://arxiv.org/html/2511.21631](https://arxiv.org/html/2511.21631)

**[5] Qwen3-VL-8B 官方 config（DeepStack 索引）** [https://huggingface.co/Qwen/Qwen3-VL-8B-Instruct/blob/main/config.json](https://huggingface.co/Qwen/Qwen3-VL-8B-Instruct/blob/main/config.json)

**[6] Qwen3.5 官方博客（Native Multimodal）** [https://qwen.ai/blog?id=qwen3.5](https://qwen.ai/blog?id=qwen3.5)

**[7] HF Transformers：Qwen3.5 文档（3:1 混合 Attention）** [https://github.com/huggingface/transformers/blob/main/docs/source/en/model_doc/qwen3_5.md](https://github.com/huggingface/transformers/blob/main/docs/source/en/model_doc/qwen3_5.md)

**[8] Qwen3.5-27B 官方 config（视觉、文本配置）** [https://huggingface.co/Qwen/Qwen3.5-27B/blob/main/config.json](https://huggingface.co/Qwen/Qwen3.5-27B/blob/main/config.json)

**[9] Qwen3-Next 官方博客（Gated DeltaNet + Full Attention）** [https://qwen.ai/blog?id=qwen3-next](https://qwen.ai/blog?id=qwen3-next)

**[10] Qwen3.8 官方代码库 / 发布信息** [https://github.com/QwenLM/Qwen3.8](https://github.com/QwenLM/Qwen3.8)

**[11] Qwen3.8-Max 官方博客** [https://qwen.ai/blog?id=qwen3.8](https://qwen.ai/blog?id=qwen3.8)

**[12] Qwen2 Technical Report（LLM 结构）** [https://arxiv.org/abs/2407.10671](https://arxiv.org/abs/2407.10671)

**[13] Qwen3-VL HF 实现（ViT 注意力）** [https://github.com/huggingface/transformers/blob/main/src/transformers/models/qwen3_vl/modeling_qwen3_vl.py](https://github.com/huggingface/transformers/blob/main/src/transformers/models/qwen3_vl/modeling_qwen3_vl.py)

**[14] Attention Is All You Need（位置编码背景）** [https://arxiv.org/abs/1706.03762](https://arxiv.org/abs/1706.03762)

**[15] RoFormer（RoPE 原始论文）** [https://arxiv.org/abs/2104.09864](https://arxiv.org/abs/2104.09864)

注意｜整理范围截止：2026 年 11 月 4 日。文档为技术梳理而非模型性能排行榜；不同大小和商用 API 快照可能与表格中的公开 checkpoint 存在实现差异。
