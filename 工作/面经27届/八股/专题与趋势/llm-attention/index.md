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

- **分头（MHA）既不省参数也不省 FLOPs**：`W_Q/K/V/O` 合计仍是 4·hidden²，注意力的 `S²·hidden` 总 FLOPs 也不变。收益在于多头并行捕捉不同模式（语法/指代/位置/长距依赖）和优化稳定性。
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

## 三、一个 13B 的模型，参数用 FP16 存，需要多大显存？

### 第一问：只放权重

```
13 × 10^9 × 2 B = 26 × 10^9 B ≈ 26 GB ≈ 24.2 GiB
速记：FP16 下 1B 参数 ≈ 2 GB
```

**单位陷阱（必答）**：厂商标的是十进制 GB（1 GB = 10⁹ B），`nvidia-smi` / CUDA 显示的是 GiB（2³⁰ B）。所以 26 GB 的权重在 `nvidia-smi` 里约 **24.2 GiB**。这正是"24GB 卡（4090/3090）到底装不装得下 13B FP16？"的答案：**装不下**（26 GB > 24 GiB 的可用容量，且还要留出 context 和框架开销）。

### 第二问：推理场景总显存

| 项目 | 大小 | 说明 |
|---|---|---|
| 模型权重 | **26 GB** | FP16/BF16，固定 |
| KV Cache | 动态 | 见下一节公式，与 batch × seq 成正比 |
| Activation / 临时 buffer | 1~3 GB | 与 batch、seq 相关 |
| CUDA context + 框架开销 | 0.5~1.5 GB | cuBLAS workspace、PyTorch 缓存 |

**选型结论**：

- 单卡 FP16 推理 → 至少 **A100 40GB / A800 / L40S(48G)**
- **2×24GB（4090/3090）张量并行** → 每卡约 13 GB 权重 + 开销，可行
- 量化后单卡 24GB 可行 → INT8 约 13 GB、INT4/GPTQ 约 6.5~8 GB

### 第三问：训练（混合精度 AdamW）

每参数字节数：

| 分量 | 精度 | 字节/参数 |
|---|---|---|
| 模型权重 | BF16 | 2 |
| 梯度 | BF16 | 2 |
| FP32 主权重（master weights） | FP32 | 4 |
| Adam 一阶动量 m | FP32 | 4 |
| Adam 二阶动量 v | FP32 | 4 |
| **合计** | | **16 B/param** |

```
13B × 16 B ≈ 208 GB（不含 activation 与重计算）
```

所以 13B 全参微调基本是 **8×A100(80GB)** 起步；替代方案：

- **ZeRO-1/2/3**：把 optimizer states / 梯度 / 参数切片分散到各卡，ZeRO-3 下显存降到约 1/N
- **CPU / NVMe 卸载**：用带宽换显存
- **LoRA**：冻结 26 GB 权重 + 几十 MB~几百 MB 可训练参数，单卡 40GB 舒适（但注意仍需存权重的梯度和部分 activation，不是"几 GB 就能训"）

### 第四问：反向 xp——常见配置速查

| 精度 | 字节/参数 | 13B 权重 |
|---|---|---|
| FP32 | 4 | 52 GB |
| FP16 / BF16 | 2 | 26 GB |
| FP8 | 1 | 13 GB |
| INT8 | 1 | 13 GB |
| INT4（GPTQ/AWQ） | 0.5 | 6.5 GB |

---

## 四、40 层、隐藏层 4096 维、FP16 的模型，单个 token 的 KV Cache 占多大？

### 结论

```
655,360 B / token = 640 KiB ≈ 0.625 MiB ≈ 0.64 MB
```

### 推导公式

```
每 token KV = 2 (K 和 V) × n_layers × n_kv_heads × head_dim × bytes_per_elem
MHA 下（n_kv_heads × head_dim = hidden）可简化为：
            = 2 × n_layers × hidden_size × bytes_per_elem
```

代入：

```
2 × 40 层 × 4096 维 × 2 B(FP16) = 655,360 B = 640 KiB
```

**等价写法（按头拆，hidden=4096 拆成 32 头 × head_dim=128）：**

```
单层 KV 元素数 = 2 × n_kv_heads × head_dim = 2 × 32 × 128 = 8,192
单层字节数     = 8,192 × 2 B = 16,384 B = 16 KiB
全模型         = 16 KiB × 40 层 = 655,360 B = 640 KiB   ✓ 与上式一致
```

> 两种算法必须自洽：MHA 下 `n_kv_heads × head_dim = hidden_size`，所以两式恒等。**GQA/MQA 下这层恒等被打破**——必须用 `n_kv_heads × head_dim`，若仍套 `hidden_size` 会高估 g 倍，这是面试最爱挖的坑。

### 单条序列随上下文长度的总占用（本配置 640 KiB/token）

| 上下文 | KV Cache |
|---|---|
| 2K | 1.31 GB（1.22 GiB） |
| 4K | 2.62 GB（2.44 GiB） |
| 8K | 5.24 GB（4.88 GiB） |
| 32K | 21 GB（19.5 GiB） |
| 128K | 84 GB |

### batch 是乘法放大的

以上都是**单条序列**。真实服务里要再乘 batch：

```
batch=8、seq=8K → 5.24 GB × 8 ≈ 42 GB（已超一张 A100 80G 的一半）
```

所以长上下文服务必须靠 **PagedAttention（vLLM，解决碎片和超分配）、KV 量化（FP8 再砍半）、GQA、prefix caching、chunked prefill** 来压。

### 同一配置下 GQA 的收益（每 token）

| 结构 | Q 头 → KV 头 | 每 token KV | 4K 上下文 |
|---|---|---|---|
| MHA | 32 → 32 | 640 KB | 2.5 GiB |
| GQA | 32 → 8 | 160 KB | 0.63 GiB |
| GQA | 32 → 4 | 80 KB | 0.31 GiB |
| MQA | 32 → 1 | 20 KB | 0.08 GiB |

（n_kv 减半则 KV 减半，严格线性）

### 易错点

1. **别忘乘 2**：K 和 V 各一份，只算一个会少一半
2. **别忘乘层数**：KV Cache 是**逐层独立**的，40 层就要 ×40
3. **GQA 下不能用 hidden 直接算**：必须用 `n_kv_heads × head_dim`，否则高估 4~8 倍
4. **单位是 KiB 还是 KB**：655,360 B = 640 KiB = 655 KB（十进制）。`nvidia-smi` 里看到的是 KiB
5. **这只算了 KV Cache，不含权重**：同配置若约 13B 参数，FP16 权重还要另加 26 GB

### 追问：单 token 计算时，K 矩阵到底多大？

**先分清两个语境**（面试时反问一句能加分）：

**语境一：这一步新产生、要写入缓存的 K**

形状 `[n_kv_heads, 1, head_dim]`（带上 batch 就是 `[B, n_kv_heads, 1, head_dim]`）：

```
q = x_token @ W_Q → [32, 1, 128] = 4096 元素 = 8 KiB
k = x_token @ W_K → [32, 1, 128] = 4096 元素 = 8 KiB    ← 单层单 token 的 K
v = x_token @ W_V → [32, 1, 128] = 4096 元素 = 8 KiB
```

**单层单 token 的 K = 8 KiB**，K+V = 16 KiB；乘 40 层 → **K 总计 320 KiB / token**，K+V 640 KiB ✓ 与上式自洽。

**语境二：这一步 attention 真正读取的 K 矩阵**

decode 不是只读新 token 的 K，而是**把历史所有 token 的 K 一起拉进来**：

```
K_used = [B, n_kv_heads, S, head_dim]      S = prompt 长度 + 已生成长度
Q_step = [B, n_heads,    1, head_dim]
score  = Q_step @ K_usedᵀ → [B, n_heads, 1, S]  → softmax → @ V_used
out    = [B, n_heads,    1, head_dim]
```

读取量随 S 线性增长：

| 上下文 S | 单层读取的 K | 40 层 K+V 读取量 |
|---|---|---|
| 1K | 8 MiB | 16 MiB |
| 4K | 32 MiB | 64 MiB |
| 32K | 256 MiB | 512 MiB |

**每生成 1 个 token 就要把这坨 KV 从 HBM 全搬一遍**，而实际乘加只有 `n_heads × S × head_dim × 2` —— 典型 **memory-bound**，与 FLOPs 无关。这就是服务端必须做 batching（一次搬运服务多请求，摊薄带宽）、GQA/MQA（搬运量按 g/n 降）、Flash Decoding / PagedAttention（沿 seq 切分并行 + 消碎片）、KV FP8 量化（搬运砍半）的根本原因。

**补充**：算 K 本身还要读一遍 W_K。MHA 下 `W_K = [4096, 4096]` = 16.7 M 参数 = 32 MiB（FP16），每层 W_Q/W_K/W_V/W_O 合计约 64 MiB，40 层 ≈ 2.5 GB ≈ 一个 13B 模型的权重量。低 batch 时每步都要把这 26 GB 权重过一遍，算力大量空转——这也是 decode 阶段算力利用率低、必须靠大 batch / 投机解码的原因。

### 追问：X @ W_K 这一步，输入长度 n 时就是 `[n,4096] @ [4096,4096]` 吗？

**形状是对的，但要分清是两次不同的矩阵乘。**

**第一步：投影（产出 K）**

```
X        [n, 4096]      # 该层 input LayerNorm 后的 hidden states
W_K      [4096, 4096]   # MHA：输出维 = n_heads × head_dim = 32×128 = 4096
X @ W_K  [n, 4096]      # reshape → [n, 32, 128]
```

本质是 **32 个并行小投影**：第 i 头 = `X[n,4096] @ W_K[:, i*128:(i+1)*128]`，每个读满 4096 输入维、只吐 128 维。

- 参数量 16.7 M，算力 `2·n·16.7M` FLOPs —— **随 n 线性增长**

**第二步：打分（才是 n×n 的来源）**

```
score_i = Q_i[n,128] @ K_iᵀ[128,n] → [n, n]        # 每头一个 n×n，32 头共 32 个
out_i   = softmax(score_i / √128) @ V_i[n,128] → [n, 128]
```

- 算力 `2 × 32 × n² × 128 = 2·n²·4096` FLOPs/层 —— **随 n 平方增长**

**两者何时打平（单层，hidden=d，causal mask 只算一半）**

| 部分 | FLOPs / 层 | 增长 |
|---|---|---|
| W_Q/K/V/O 四个投影 | `8·n·d²` | O(n) |
| QKᵀ + Attn@V | `2·n²·d` | O(n²) |

```
令 2n²d = 8nd² → n = 4d = 16384
```

**上下文短于约 4 倍 hidden（本配置 ~16K）时投影更贵；超过之后 QKᵀ 那一坨 n×n 才主导。**

量化感受（FP16，单层）：

| n | 投影 FLOPs | Attention FLOPs（causal） | Attention 占比 |
|---|---|---|---|
| 2K | 275 GFLOP | 34 GFLOP | 11% |
| 8K | 1.1 TFLOP | 0.54 TFLOP | 33% |
| 16K | 2.2 TFLOP | 2.1 TFLOP | ~50% |
| 128K | 17.6 TFLOP | 137 TFLOP | 89% |

**decode 时不这么算**：X 只有新 token 一行，`[1,4096] @ [4096,4096]` 是 **GEMV 而非 GEMM**，算术强度极低——为算 4096 个输出值必须把 32 MiB 的 W_K 全读一遍，典型带宽受限；历史 token 的 K 不重算，直接取缓存，`QKᵀ` 退化成 `[1,128] @ [128,n] → [1,n]`。这就是 **prefill 算力密集 / decode 带宽密集** 两种瓶颈的来源。

**GQA 下要修正一处**：`W_K` 变成 `R^{4096 × (n_kv_heads·head_dim)}`，例如 8 个 KV 头 → `[4096, 1024]`，`X@W_K → [n, 1024]`。X 的输出宽度变窄，参数量与 KV Cache 按 g/n 下降；但算分时靠 `repeat_interleave` 逻辑对齐到 32 个 Q 头，**QKᵀ 的算力一点没省**——GQA 省的是显存和带宽，不是 attention 的 FLOPs。

---

## 五、面试答题模板

> "多头注意力里每个头的输出维度是 head_dim = hidden/n_heads，常见 128；每个头的投影层输入是全 hidden、输出 head_dim，所以每个头都读了完整输入，只是各取一个子空间。分头本身不省参数和 FLOPs，省的是多维并行建模能力；真正省显存和带宽的是 GQA/MQA——它们让多个 Q 头共享 K/V，KV Cache 按 g/n 线性缩小，decode 阶段的瓶颈正好是 KV 的访存带宽。"

可继续延伸到：MLA 低秩压缩、PagedAttention 显存碎片治理、prefix caching、FP8 KV 量化。
