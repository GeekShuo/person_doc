---
title: "Attention 机制八股：Q 头维度、MHA/GQA/MQA 与推理显存估算"
source: "面经整理 / 大模型推理Attention、推理显存估算"
---

# Attention 机制八股：Q 头维度、MHA/GQA/MQA 与推理显存估算

> 适用岗位：大模型算法、AI Infra、推理优化。回答套路：先给结论公式，再讲机制推导，最后补工程取舍与常见坑。

核心结论速记：

```
head_dim = hidden_size / n_heads（常见 128）
每个 Q 头的投影矩阵形状 = hidden_size × head_dim（看全部隐藏维，只输出 head_dim）
每 token KV Cache = 2 × n_layers × n_kv_heads × head_dim × bytes_per_elem
FP16 下：1B 参数 ≈ 2 GB 权重
```

---

## 一、一个 Q 头的维度是多少？要不要对输入全部隐藏维度计算？

### 结论

**每个 Q 头输出 `head_dim = hidden_size / n_heads` 维（通常 128），而它的投影矩阵输入侧是完整的 `hidden_size` —— 每个头都要读取全部隐藏维度，但各自只输出 head_dim、负责一个子空间。**

### 推导（以 Llama3-8B：hidden=4096，32 头，head_dim=128 为例）

```
X ∈ R^{S × 4096}

W_Q ∈ R^{4096 × 4096}        # 输出 32 × 128 = 4096
Q = X @ W_Q  ∈ R^{S × 4096}

切头 reshape → [S, 32, 128]
第 i 个头：q_i = X @ W_Q[:, i*128 : (i+1)*128]
                       ↑ 输入 4096 维（全部）  ↑ 输出 128 维
```

三层理解：

1. **每个头的投影矩阵是 `hidden × head_dim`（4096×128），输入侧覆盖全部隐藏维度**。每个头都读完整输入向量，只是用不同权重提取不同子空间特征——这就是"多头 = 多子空间"的含义。
2. **不是**每个头独立跑一份 4096×4096 的注意力。那样参数和算力会翻 n 倍，纯属浪费。
3. **头的计算只在 128 维子空间内进行**：`score = q_i · k_i / √128`，加权出的 `attn @ v_i` 也是 128 维；最后 32 个 128 维 concat 回 4096，再过 `W_O ∈ R^{4096×4096}`。

### 常见配置表

| 模型 | hidden | Q 头数 | KV 头数 | head_dim |
|---|---|---|---|---|
| Llama2-7B | 4096 | 32 | 32 | 128 |
| Llama2-13B | 5120 | 40 | 40 | 128 |
| Llama2-70B | 8192 | 64 | 8 (GQA) | 128 |
| Llama3-8B | 4096 | 32 | 8 (GQA) | 128 |
| Qwen2-7B | 3584 | 28 | 4 (GQA) | 128 |
| DeepSeek-V3 (MLA) | 7168 | 128 | 低秩潜向量 512 | 192（含解耦 RoPE 部分） |

`head_dim = hidden / n_heads` 是**惯例而非硬性定律**：

- 约束一：`n_kv_heads` 必须能整除 `n_heads`（GQA 分组要求）
- 约束二：head_dim 常取 64/128 这类对齐值，适配 FlashAttention 的 kernel 分块；head_dim > 256 需要专门的 kernel 支持

### 两个常踩的坑

1. **缩放系数是 √head_dim（128）而不是 √hidden（4096）**。因为点积 `q_i·k_i` 是 128 个独立分量之和，方差随 128 增长。误用 √hidden 会导致 softmax 过平滑、训练早期梯度变小。
2. **RoPE 按 head 施加在 128 维向量上**，对整个 hidden 或跨头做旋转都是错的。

### 追问：分头到底省了什么？

| 部分 | 形状 | 参数量 | MHA vs GQA |
|---|---|---|---|
| W_Q | 4096 × 4096 | 16.7 M | 不变 |
| W_K | 4096 × (n_kv·128) | MHA 16.7 M / GQA-8 4.2 M | **GQA 少 4 倍** |
| W_V | 同上 | 同上 | 同上 |
| W_O | 4096 × 4096 | 16.7 M | 不变 |

- **分头（MHA）既省参数也不省 FLOPs**：`W_Q/K/V/O` 合计仍是 4·hidden²，注意力的 `S²·hidden` 总 FLOPs 也不变。收益在于多头并行捕捉不同模式（语法/指代/位置/长距依赖）和优化稳定性。
- **GQA 才真的省东西**：W_K/W_V 输出维从 `n_heads·head_dim` 降到 `g·head_dim`，同时 KV Cache 同比缩小。

---

## 二、MHA / GQA / MQA 原理

### 一句话区分：只有 K/V 头数不同

标准 MHA 中 Q、K、V 头数相同，每个 Q 头配一组专属 K/V 头。MQA 与 GQA 的做法是**让多个 Q 头共享同一份 K/V**。

| | Q 头数 | KV 头数 | 一个 KV 头服务几个 Q 头 |
|---|---|---|---|
| **MHA** | n | n | 1 |
| **GQA** | n | g（1 < g < n） | n/g（分组共享） |
| **MQA** | n | 1 | n（全部共享） |

**MQA 是 g=1 时的 GQA 特例。**

### MHA（Multi-Head Attention）

```
X → 线性投影 Q/K/V
  → 切头 [B, n_heads, S, d_head]
  → 每头独立 softmax(QKᵀ/√d)·V
  → concat → 输出投影
```

表达力最强，代价是 KV Cache 里要存 `n_heads` 份 K 和 V。

### MQA（Multi-Query Attention，Shazeer 2019）

所有 Q 头共用同一个 K 头和同一个 V 头：`K, V ∈ [B, 1, S, d_head]`，广播给全部 n 个 Q 头。

- KV Cache 降到 MHA 的 **1/n_heads**
- 真正价值在 **decode 阶段**：从显存搬运的数据量暴降，带宽不再成为瓶颈。**省的是带宽，不是算力**
- 缺点：容量与表达力下降明显，长文本/复杂推理容易掉点，训练不太稳
- 代表：PaLM、Falcon、StarCoder、早期 Gemini

### GQA（Grouped-Query Attention，Google 2023，Llama2 论文正式命名）

把 n 个 Q 头分成 g 组，每组共享一份 K/V：

```
group_size = n_heads / g
第 i 个 Q 头使用第 ⌊i / group_size⌋ 个 KV 头
```

- KV Cache / 显存带宽 = MHA 的 **g/n**
- 质量接近 MHA，速度接近 MQA —— 当前开源大模型的默认选择
- 代表：Llama2-70B(64→8)、Llama3-8B(32→8)、Llama3-70B(64→8)、Qwen2-7B(28→4)、Mistral-7B(32→8)

**实现只需把 K/V 复制展开对齐 Q，注意力数学本身不用改：**

```python
# K/V: [B, g, S, d] → [B, n, S, d]
expand = n_heads // g
K = K.repeat_interleave(expand, dim=1)
V = V.repeat_interleave(expand, dim=1)

# PyTorch ≥ 2.5 / FlashAttention 原生支持 GQA，避免真复制 → 更省显存
F.scaled_dot_product_attention(Q, K, V, enable_gqa=True)
```

**已有 MHA 模型转 GQA（uptraining）**：把每组内 K/V 头权重做**平均池化**合成一个头，再用原始预训练数据量约 **5%** 继续训练，效果即可回到接近原 MHA 的水平（Llama2 论文结论）。这是从老 checkpoint 降低推理成本的标准操作。

### 三个高频追问

1. **为什么只压缩 K/V 不压缩 Q？** Q 是当前步的，不需要缓存；KV 要缓存全序列，才是显存和带宽的大头。压缩 Q 省不了缓存。
2. **为什么能共享？** 实验发现多个 K/V 头之间冗余度高（头 Embedding 余弦相似度聚类明显），而 Q 头分化更显著。
3. **更进一步是什么？**
   - **MLA**（DeepSeek-V2/V3）：对 KV 做低秩联合压缩成一个潜向量（如 512 维），推理时再解压，缓存量比 GQA 还小一个量级且效果更好；代价是兼容 RoPE 需额外处理（解耦 RoPE）
   - **CLA**（Cross-Layer Attention，跨层共享 KV）、**YOCO**（层间共享）：进一步压缩 KV Cache

---

## 三、关联追问：推理显存与 KV Cache 估算

### 权重（FP16/BF16）

```
13B × 2 B = 26 GB ≈ 24.2 GiB
速记：FP16 下 1B 参数 ≈ 2 GB
```

单位提醒：厂商标十进制 GB（10⁹），`nvidia-smi` 显示 GiB（2³⁰）。26 GB 权重在 `nvidia-smi` 里约 **24.2 GiB** —— 这正是"24GB 卡（4090/3090）装不下 13B FP16 权重"的原因。

### 每 token KV Cache

```
= 2 (K 和 V) × n_layers × n_kv_heads × head_dim × bytes_per_elem
MHA 下可简化：= 2 × n_layers × hidden_size × bytes_per_elem
```

**示例（hidden=4096、40 层、FP16）：**

```
2 × 40 × 4096 × 2 B = 655,360 B = 640 KiB ≈ 0.64 MB / token
```

对比 Llama2-13B（40 层、hidden=5120、MHA 40 KV 头）：

```
2 × 40 × 5120 × 2 B = 819,200 B = 800 KB / token
→ 4K 上下文 ≈ 3.13 GiB
```

### 单条序列 KV Cache 随长度增长（hidden=4096 / 40 层 / FP16）

| 上下文 | KV Cache |
|---|---|
| 2K | 1.31 GB（1.22 GiB） |
| 4K | 2.62 GB（2.44 GiB） |
| 8K | 5.24 GB（4.88 GiB） |
| 32K | 21 GB（19.5 GiB） |
| 128K | 84 GB |

注意这是**单条序列**的量。batch=8、seq=8K 就是 42 GB，已超一张 A100 —— 这就是长上下文必须上 **PagedAttention（vLLM）、KV 量化（FP8 再砍半）、GQA、prefix caching** 的原因。

### GQA 带来的 KV Cache 收益（hidden=4096、40 层、FP16，每 token）

| 结构 | Q 头 → KV 头 | 每 token KV | 4K 上下文 |
|---|---|---|---|
| MHA | 32 → 32 | 640 KB | 2.5 GiB |
| GQA | 32 → 8 | 160 KB | 0.63 GiB |
| GQA | 32 → 4 | 80 KB | 0.31 GiB |
| MQA | 32 → 1 | 20 KB | 0.08 GiB |

（n_kv 减半则 KV 减半，严格线性）

### 单卡显存预算拆分（推理）

| 项目 | 量级 | 说明 |
|---|---|---|
| 模型权重 | 26 GB（13B FP16） | 必占 |
| KV Cache | 动态 | 见上文公式，与 batch × seq 成正比 |
| Activation / 临时 buffer | 1~3 GB | 与 batch、seq 相关 |
| CUDA context + 框架开销 | 0.5~1.5 GB | cuBLAS workspace、PyTorch 缓存 |

**结论**：13B FP16 推理单卡至少要 **A100 40GB / A800**；或用 2×24GB 卡张量并行（各约 13 GB + 开销）；或量化 INT8（13 GB）/ INT4-GPTQ（6.5~8 GB）后可单卡 24GB 跑。

### 训练（混合精度 AdamW）

每参数字节数：权重 BF16(2) + 梯度 BF16(2) + FP32 主权重(4) + Adam m(4) + Adam v(4) = **16 B/param**

```
13B × 16 B ≈ 208 GB
```

→ 全参微调基本是 8×A100(80GB) 起步，或用 ZeRO-3 / CPU-NVMe 卸载，或 LoRA（冻结 26 GB 权重 + 几十 MB~几百 MB 可训练参数，40GB 卡舒适）。

---

## 四、面试答题模板

> "多头注意力里每个头的输出维度是 head_dim = hidden/n_heads，常见 128；每个头的投影层输入是全 hidden、输出 head_dim，所以每个头都读了完整输入，只是各取一个子空间。分头本身不省参数和 FLOPs，省的是多维并行建模能力；真正省显存和带宽的是 GQA/MQA——它们让多个 Q 头共享 K/V，KV Cache 按 g/n 线性缩小，decode 阶段的瓶颈正好是 KV 的访存带宽。"

可继续延伸到：MLA 低秩压缩、PagedAttention 显存碎片治理、prefix caching、FP8 KV 量化。
