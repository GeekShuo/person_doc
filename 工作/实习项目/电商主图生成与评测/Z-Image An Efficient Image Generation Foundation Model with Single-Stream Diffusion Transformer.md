Paper Reading-2026.3.27

## Motivation：

1、蒸馏闭源商用模型数据导致性能上限以及数据同质化；

2、开源模型一味scale模型size（20-80B），未充分挖掘模型能力

3、从**数据精选、架构设计、训练策略、推理加速**全流程系统优化（purely real-world data without distilling results from other models）

![](https://apijoyspace.jd.com/v1/files/mv3rl3iqjCDFiKX63y0u/link)

## Data Infrastructure：

**概念覆盖面广且无冗余**、**强大的多模态图文对齐**、**结构适配动态课程学习**

#### **1、Data Profiling Engine（初步处理大规模未整理的噪声数据）：**

![](https://apijoyspace.jd.com/v1/files/KbRGWHrIToiu7MxSsYt7/link)

**Image Metadata：**缓存图片基本属性（分辨率、文件大小），计算pHash进行图像去重

**Technical Quality Assessment：**（a）压缩比：通过分辨率和位深度（bit depth）计算理想文件大小，然后和实际文件大小计算压缩比；（b）视觉质量：用IQA模型打分；（c）信息熵：计算像素方差，过滤大面积纯色背景图像。执行瞬时JPEG重新编码，将产生的每像素字节数（BPP）作为复杂度的指标

**Semantic and Aesthetic Content：**（a）美学：用美学评估模型；（b）AIGC检测：训练分类器过滤AIGC图片（from Imagen 3）（c）训练专门VLM进行语义label标注：物体类别、文化概念、人数，并且过滤不安全内容

**Cross-Modal Consistency and Captioning：**（a）用CLIP计算图文匹配分数去掉低的；（b）使用VLM打multi-level caption（简短、中等、详细），并且明确提示VLM识别文本以及水印

![](https://apijoyspace.jd.com/v1/files/us3faFsPWDJWS6axHSkO/link)

准确的OCR结果（不能翻译）在caption中对于生成准确的带文字图片十分重要；多层级Caption

![](https://apijoyspace.jd.com/v1/files/8zIYS6ux3PFdVH9Ag8V0/link)

#### **2、Cross-modal Vector Engine（去重以及问题定位）：**

![](https://apijoyspace.jd.com/v1/files/WoDdmG6rrd7JdOC2W4CH/link)

1、近邻去重：本质是Meta提出的SSCD（Self-Supervised Copy Detection）去重方法；通过自监督的方式训练了一个重复分类模型：用resnet提取特征然后用GeM（Generalized Mean Pooling）突出特征并输出紧凑向量。然后利用KNN构建关联并进行去重（每个群只保留质量最高的）

2、基于CN-CLIP构建检索图，用于问题定位

> [https://openaccess.thecvf.com/content/CVPR2022/papers/Pizzi_A_Self-Supervised_Descriptor_for_Image_Copy_Detection_CVPR_2022_paper.pdf](https://openaccess.thecvf.com/content/CVPR2022/papers/Pizzi_A_Self-Supervised_Descriptor_for_Image_Copy_Detection_CVPR_2022_paper.pdf)

#### 3、 World Knowledge Topological Graph（语义级平衡采样）：

![](https://apijoyspace.jd.com/v1/files/yiaw00ZjcAc12dM1ej53/link)

1、根据维基百科里的概念以及超链接结构，构建初始知识图谱（全面且冗余）

2.1、移除PageRank得分极低的节点（孤立或极少被关联）

2.2、让VLM判断所有节点概念是否有清晰的视觉指代，去除掉抽象和模糊概念

3、利用大规模数据集补充知识图谱，从大规模capiton中提取tag，并且利用VLM建立父子级关系，然后补充进知识图谱中。最后对热门概念节点进行手动增加权重以及人为check热门概念或新兴概念

训练时，提取所有caption中的tag，计算tag映射到图谱中节点的BM25分数以及其父子链接关系，可以对所有训练样本计算采样权重，方便分阶段采样和概念平衡采样

#### 4、 Active Curation Engine（进一步提升质量并解决长尾分布）：

![](https://apijoyspace.jd.com/v1/files/lDC5EFQUrmhySbAI9G75/link)

模型根据随机的概念生成图像并进行评测，如果评测效果较差的话，则会根据cross-model embedding空间提取所有的近邻图像经过筛选以后加入到下一阶段的训练中，以增加相关概念的训练样本（提取该近邻群中所有的样本）

![](https://apijoyspace.jd.com/v1/files/KK8GSBbDpE5xsVxdOu33/link)

caption模型和reward打分模型也会有人工/AI参与进行优化、纠正错误数据进行训练以提升性能

#### 5、 Efficient Construction of Editing Pairs with Graphical Representation（构建编辑数据）

![](https://apijoyspace.jd.com/v1/files/ZHtQZ3taVGWMfgUzLidx/link)

（a）设计多样的编辑任务，利用专家模型分别生成编辑任务然后可以两两配对

（b）从视频中抽帧，利用CN-CLIP计算帧之间的语义相似度选择高的pair，利用VLM进行细致打标生成编辑caption

（c）利用文字渲染系统造文字，控制内容、字体、颜色等制造相关编辑数据

## Model Structure：

![](https://apijoyspace.jd.com/v1/files/WnRTxp6kP1hbKDcsokRI/link)![](https://apijoyspace.jd.com/v1/files/mON3RpjJHJhhvpRi84eb/link)

**S3-DiT：**

**Text encoder：**Qwen3-4B

**Image encoder:** Flux-VAE、SigLip-2

**U-ROPE：**图像在空间维度上拓展，文本在时间维度上拓展，ref image和target image token空间对齐，时间错开一个间隔【多图时错开间隔的设计影响结果】

**Processor（所有的）**：两层transformer block【对齐维度】

**Activation**：QK-Norm调节attention activation、Sandwich-Norm限制attention/FFN模块的输入输出

**Condition injection**：依旧采用AdaLN的形式，但是映射投影参数的时候下投影层是所有层共享的，上投影层每个层不一样

![](https://apijoyspace.jd.com/v1/files/bcP1mUQZ9iSMVb8cZtIP/link)

## Model Training：

![](https://apijoyspace.jd.com/v1/files/8gaff53F2Tck3HdIMRMN/link)

**训练infra：**VAE、Text encoder用DP，DiT用FSDP；长度相近的sample被分到同一个batch里以避免过度填充带来的计算浪费

**Pretrain：**遵循SD3使用logit-normal noise sampler主要训练中间timestep；分三个阶段：

低分辨率预训练：256 t2i，构建初始多模态对齐能力，训练量占预训练总量一半；

Omni预训练：随机映射到不同分辨率训练；t2i+i2i，加入了i2i没有影响t2i效果（这里的i2i只用参考图像生成任务）【分辨率最多到1.5k】

双语多级caption训练：t2i+i2i，i2i加入图像编辑

**SFT：**只筛选高质量图像配备超详细的caption，进行课程学习；配备几个策略

Concept Balancing with Tagged Resampling：根据知识图谱进行训练类别平衡防止灾难性遗忘；

Robustness via Model Merging：优化多个sft版本，比如真实性、美学渲染，然后最终线性插值融合模型权重

**Few-Step Distillation：**减少推理timestep，基于DMD

![](https://apijoyspace.jd.com/v1/files/1sugOBCcnn648y4i4Mb8/link)

第二列纹理模糊、色调偏移

Decoupled DMD: 解耦CFG-Augmentation（有效增强学生模型的少步生成能力）和Distribution Matching（正则化）

DMDR：Distribution Matching和RL结合避免了reward hacking问题

**RLHF：**DPO+GRPO

Reward：指令遵循、AI内容检测、美感；其中指令遵循分解为：核心主体、属性、动作/交互、空间/组合约束、风格

DPO：美感等主观方面的数据难以构建，主要进行客观方面的增强如物体数量、文本渲染，利用VLM可直接进行评估；引入课程学习，样本从简单到难、正负样本差异从适中到较大/较小

GRPO：聚合多个方面的reward联合RL

**Editing Continued Training：**

Stage1: i2i+高质量t2i（SFT阶段使用的）=1:4【因为高质量editing数据少】；512分辨率初步迭代几千步、然后1024分辨率训练

Stage2:高质量的任务均衡的数据集，但是大量去掉文本渲染数据的编辑样本【和真实样本差距太大】

**Prompt Enhancer with Reasoning Chain**：外接VLM，**必须有CoT过程**，SFT阶段加入PE Model

![](https://apijoyspace.jd.com/v1/files/TmqUpThIcka45E1MX8nJ/link)

# 不同UMM架构生成理解的相互促进效果

![](https://apijoyspace.jd.com/v1/files/V6L1rIEtaaIZXUBVIM0S/link)![](https://apijoyspace.jd.com/v1/files/ooNb4xAKeduROvQXNDYY/link)

> [https://arxiv.org/pdf/2511.20561](https://arxiv.org/pdf/2511.20561)

![](https://apijoyspace.jd.com/v1/files/wx7eGdnmN5XPfeLGM2AY/link)![](https://apijoyspace.jd.com/v1/files/NRNf4Pbdo3EpUsL86G2k/link)

**Parallel UMM、Cascaded UMM、AR UMM**

> [https://arxiv.org/pdf/2503.07265](https://arxiv.org/pdf/2503.07265)

共同的问题：生成难以促进理解。。。吗？

**复杂视觉任务：**

![](https://apijoyspace.jd.com/v1/files/LMhU4rVRd98jZqoD3jOj/link)![](https://apijoyspace.jd.com/v1/files/nKb855QtoXX5Jt7lzMNP/link)

**General空间感知任务：Grounding、远近**

![](https://apijoyspace.jd.com/v1/files/Ils1QYYAJ0O1IiuC6LIW/link)

> [https://arxiv.org/pdf/2510.13759](https://arxiv.org/pdf/2510.13759)  
> [https://arxiv.org/pdf/2511.04570](https://arxiv.org/pdf/2511.04570)  
> [https://arxiv.org/pdf/2601.21406](https://arxiv.org/pdf/2601.21406)

UMM中如何组合visual/textual CoT、尤其是latent CoT可能是未来答案