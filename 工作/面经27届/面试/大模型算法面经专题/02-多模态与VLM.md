# 多模态与 VLM 面试专题

## 一、知识主线

```text
ViT/CLIP/SigLIP
→ Connector（MLP/Q-Former/Resampler）
→ 视觉 Token 接入 LLM
→ 图文对齐预训练
→ 多模态 SFT
→ 偏好对齐与 RL
→ Grounding/OCR/视频理解/幻觉治理
→ 推理与部署
```

## 二、必会模块

### 1. 视觉编码器与对齐

- ViT：Patchify、位置编码、CLS/patch token、分辨率变化带来的复杂度。
- CLIP：双塔编码器与图文对比学习；必须会写 InfoNCE，并解释温度系数和 batch 内负样本。
- SigLIP：把全局 softmax 目标改为图文对的 sigmoid 分类；解释它与 CLIP 的 batch 依赖差异。
- DINO/MAE：说明自监督视觉预训练与图文对比学习的目标差异。

### 2. VLM 架构

| 路线 | 代表 | 追问点 |
|---|---|---|
| Visual Token + Decoder-only | LLaVA、Qwen-VL、InternVL | 结构简单，但视觉 token 占上下文 |
| Cross-Attention | Flamingo | 不直接挤占文本上下文，但需修改 LLM |
| Q-Former/Resampler | BLIP-2、Flamingo | 固定 query/token 压缩可能形成信息瓶颈 |

Connector 要回答三个作用：维度对齐、模态语义转换、可选 token 压缩。还需说明为什么简单 MLP 在强 ViT 和强 LLM 之间常常足够。

### 3. 高分辨率与视频

- AnyRes/Dynamic Tiling：局部细节更好，但 tile 与 token 数量增长。
- Native Dynamic Resolution：结合二维位置编码和 Spatial Merge。
- 图像宽高各扩大 2 倍，patch 数约扩大 4 倍，全局自注意力成本可扩大约 16 倍。
- 视频重点：采样策略、关键帧选择、时间位置编码、时序池化、长视频 token 预算、动作顺序和因果推理。

### 4. 多阶段训练

1. 冻结视觉编码器和 LLM，训练 Connector 做模态对齐。
2. 多模态指令微调，训练 Connector 与部分/全部 LLM。
3. 使用偏好数据做 DPO/RLHF/GRPO，优化视觉忠实性和指令跟随。
4. 加入 OCR、文档、图表、Grounding 和高分辨率专项数据。

## 三、高频面试问题

1. CLIP 与 SigLIP 的目标函数、负样本和分布式训练差异？
2. 完整讲 LLaVA/BLIP-2/Qwen-VL 的结构与训练阶段。
3. MLP、Q-Former、Perceiver Resampler 如何取舍？
4. 高分辨率图片为什么导致 token 爆炸？如何压缩而不损失 OCR/小目标？
5. 多模态模型为什么产生幻觉？语言先验过强如何验证？
6. Visual Grounding 的坐标如何 token 化？如何评估框幻觉？
7. 多模态 SFT 数据需要覆盖哪些任务和负样本？
8. 多模态 Reward Model 为什么比文本 RM 更难？
9. VLM 的 DPO/RLHF 如何构造 chosen/rejected？
10. 视频理解如何处理帧采样、时间顺序和长上下文？
11. 设计“商品图片生成描述”系统：如何接商品库、做属性校验和低置信度拒答？
12. 设计多模态 RAG：文本/OCR/图片如何多路召回和重排？
13. VLM 如何部署：视觉 embedding 缓存、token pruning、量化、PagedAttention、模型路由。

## 四、真实面经侧重点

- **阿里多模态**：项目指标、RAG 指标、多模态幻觉、商品理解、显存估算、DeepSeek-R1、ViT 预训练、对比学习。
- **字节多模态**：CLIP 双编码器、ViT、Qwen/LLaVA、微调训练、统一适配、业务指标与算法手撕。
- **小红书多模态实习**：重点关注实际项目、数据构造、模型选择和业务落地，不应只准备架构名词。

## 五、答题模板

```text
任务定义（理解/生成/检索/grounding）
→ 数据与标注
→ 视觉编码器和 Connector
→ 训练阶段与损失
→ Token/显存/计算复杂度
→ 幻觉与失败模式
→ 离线指标、人工评测、线上指标
→ 推理优化和成本
```

## 六、来源

- [阿里多模态大模型算法面经（牛客）](https://www.nowcoder.com/feed/main/detail/5bf6314c9cbd4bfb92f525225b04d61d)
- [字节大模型算法 Offer 面经（小红书）](https://www.xiaohongshu.com/explore/69801655000000001a01d654)
- [小红书多模态大模型日常实习面经（知乎）](https://zhuanlan.zhihu.com/p/1996677747993486353)
- [字节多模态大模型一面（知乎）](https://zhuanlan.zhihu.com/p/1998500372969443453)
- [VLM 算法知识与面经汇总](https://stein-wang0226.github.io/mllm-interview-notes/vlm-knowledge-interview.html)
- [LLM/MLLM 后训练面试题库](https://liyongzhi.xyz/blog-post-llm-mllm-posttrain-interview/)
