# OCR 原理与版面识别模型（RT-DETR / PP-DocLayout / 印章检测）

导航：[常用通用算法知识问题准备](常用通用算法知识问题准备.md) · [AI 安全部项目](AI安全部项目介绍与问题准备.md) · [腾讯项目](腾讯实习项目介绍与问题准备.md)

> 使用方式：先用 30–60 秒讲清"检测范式 + 为什么能检出印章"，再展开 AIFI / query 集合预测其中一个细节，最后讲适用条件与失败模式。模型名以官方文档为准，本文不把"理论可行"写成"已实现"。

## 0. 30 秒口述版

百度 OCR（PaddleOCR / PaddleX）的版面识别，本质是**把整页文档图像当目标检测来做**：输出一组 `(框, 类别, 置信度)`，类别里有标题、文本、表格、公式、图像、页码、页眉页脚，也有**印章（seal）**。判断"有无印章"就是看 `label == 'seal'` 的框是否非空。

高精度模型 `PP-DocLayout-L / plus-L` 基于 **RT-DETR**（Real-Time DEtection TRansformer，百度 2023）。它把 DETR 的"全局自注意力太贵"改造成**混合编码器**：只在语义最强、分辨率最小的 S5 上做**尺度内自注意力（AIFI）**，跨尺度融合交给 CNN（CCFF），到 decoder 才让 300 个可学习 query 用**多尺度可变形注意力**稀疏地看所有层。训练时用匈牙利算法做一对一集合匹配，所以推理**不需要 NMS**——这对"印章压在正文上"这种重叠场景尤其关键。

## 1. 先对齐名词

| 用户常说 | 官方实际叫什么 | 说明 |
|---|---|---|
| "pp-layout" | **PP-DocLayout 系列** | 官方没有 `pp-layout` 这个模型名；旧版 PP-Structure 里的 layout 模型就是这条线 |
| 版面识别 / 版面分析 | 版面区域检测（Layout Detection）+ 版面分析（含阅读顺序） | 前者只出框，后者还出阅读顺序 |
| 百度云 OCR | 智能云「办公文档识别」 | 闭源 API，输出图/表/标题/文本/目录/印章/栏/页眉/页脚/页码/脚注，并带独立的印章识别结果 |

## 2. 印章：能不能检？怎么输出？

### 2.1 能，且印章是一级类别

| 模型 | 类别数 | 印章 | 检测头 |
|---|---|---|---|
| `PP-DocLayout_plus-L` | 20 | ✅ | RT-DETR-L |
| `PP-DocLayout-L / M / S` | 23 | ✅ | RT-DETR-L / PicoDet-L / PicoDet-S |
| `PP-DocLayoutV2 / V3` | 25 左右 | ✅ | RT-DETR + 指针网络（V2 起含阅读顺序） |
| `RT-DETR-H_layout_17cls`、`PicoDet-S/L_layout_17cls` | 17 | ✅ | 含印章 |
| `RT-DETR-H_layout_3cls`、`PicoDet-S/L_layout_3cls` | 3 | ✅ | **表格 / 图像 / 印章**，印章专用轻量方案 |
| `PicoDet_layout_1x`（PubLayNet） | 5 | ❌ | 英文论文场景，无印章类 |

### 2.2 输出长什么样

```python
{'res': {'boxes': [
    {'cls_id': 13, 'label': 'seal', 'score': 0.93,
     'coordinate': [xmin, ymin, xmax, ymax]}
]}}

seals = [b for b in res['boxes']
         if b['label'] == 'seal' and b['score'] > 0.5]
has_seal = len(seals) > 0
```

`cls_id` 在不同模型里编号不同，判断有无印章**必须用 `label`，不要写死 id**。

### 2.3 检测 ≠ 识别

版面模型只给印章**位置框**。要读出章里的环形文字，需要印章识别子流程：**环形/弧形文本检测 → 极坐标展开校正 → OCR**。百度云办公文档识别把这一步合并进同一 API；开源侧需自行串联。

## 3. 一次文档解析的完整链路

```text
页面图像
  → 版面区域检测（输出各元素框）
       ├─ 文本区域 → 文本检测 + 文本识别
       ├─ 表格区域 → 表格结构识别 →单元格 OCR
       ├─ 公式区域 → 公式识别
       ├─ 图像区域 → （可选）图注 / 图表理解
       └─ 印章区域 → 环形文本矫正 + OCR
  → 阅读顺序恢复（V2 的指针网络）
  → 结构化输出
```

## 4. RT-DETR 原理

### 4.1 缩写

**RT-DETR = Real-Time DEtection TRansformer**。

- `RT` = Real-Time，百度 2023 年提出（arXiv 2304.08069），目标是让 DETR 系检测器达到 YOLO 级速度且不用 NMS。
- `DETR` = **DE**tection **TR**ansformer（DE、TR 大写拼成 DETR），即把 Transformer 用于目标检测。

### 4.2 混合编码器：为什么只有一层进自注意力

Backbone 输出多尺度特征（以 640×640 输入为例）：S3 = 80×80、S4 = 40×40、S5 = 20×20。

**① AIFI（尺度内自注意力）只吃 S5。**
"尺度内" = token 只和**同一特征层**的其他 token 互相 attention，不跨层。S5 展平为 400 个 token（维度 d=256），做全局自注意力得到语义增强的 A5。S3/S4 在这一步**不进 Transformer**。

**② CCFF（跨尺度融合）是纯 CNN，不是 Transformer。**
1×1 卷积统一通道 → 自上而下 + 自下而上 PAN（RepBlock / CSP 卷积块），把 A5 的全局语义逐级融合回 S4、S3，得到 F5/F4/F3。全局信息是"自上而下广播"下去的。

**③ Decoder 才同时看全部尺度，但用稀疏采样。**
多尺度可变形注意力：每个 query 在 F3/F4/F5 **各采 K=4 个点**（每个 head 独立采样），代价与特征图分辨率无关。为区分采样点来自哪一层，会加 scale-level embedding。

### 4.3 必须会算的算力账

自注意力复杂度 \(O(N^2)\)，N 是 token 数：

| 做法 | token 数 | 注意力代价 |
|---|---|---|
| 只喂 S5（20×20） | 400 | \(1.6\times10^5\) |
| 三尺度全喂 | \(80^2+40^2+20^2=8400\) | \(\approx7.1\times10^7\)（约 440 倍） |

结论：**不是不想看多尺度，而是稠密自注意力在浅层喂不起**。浅层 6400 个 token 全是低层纹理，两两 attention 昂贵且语义关系弱；用 CNN 融合补回细节，性价比高得多。

### 4.4 可学习 query 与集合预测（DETR 的核心）

**(a) query 是什么**

N 个（DETR 100，RT-DETR 常 300）可学习向量，本质是 `nn.Embedding(N, d)` 参数，随机初始化后训练学出来。可理解为 **N 个"答题槽位" / 专职探测器**，每个槽位自发学成某种偏好（大目标、右下角、圆形色块……）。

```text
query ─self-attn─> query 之间互相"商量"，避免抢同一目标
      ─cross-attn─> 去图像特征里检索自己负责的区域（看全图）
      ─FFN────────> 输出 (类别分布, 框坐标)
```

每个 query 通过 cross-attention 看全图，因此**能同时检出重叠目标**（印章压字、表格压在文本上）：不同 query 分别锁定印章和正文，互不干扰。

**(b) 集合预测 + 匈牙利匹配为什么能去掉 NMS**

传统检测器：上万个 anchor → 独立分类 → 多个框命中同一目标 → 必须 NMS 去重。

DETR：一次性输出预测集合 \(\hat Y=\{\hat y_i\}_{i=1}^{N}\)，训练时和 GT 集合 \(Y\) 做匹配：

1. 定义代价 \(C_{i,j}=\mathcal{L}_{cls}+\lambda_1\lVert b_i-b_j\rVert_1+\lambda_2\mathcal{L}_{GIoU}\)
2. **匈牙利算法**求预测槽位 ↔ 真实目标的**全局最优一对一匹配**
3. 匹配上的算正样本；未匹配的强制预测为"无目标"类 \(\varnothing\)
4. 损失对预测顺序**置换不变**（permutation-invariant）

训练时就强制"一个目标只能被一个 query 命中"，推理自然无重复框 → **端到端、无需 NMS**。

**(c) RT-DETR 的 query 改进**

原版 DETR 的 query 与输入无关、收敛慢（约 500 epoch）。RT-DETR 改成 **uncertainty-minimal query selection**：

- 从编码器特征里挑不确定性最小（分类分数最稳定）的 top-K（如 300）位置；
- 这些位置的**特征**作为 decoder 的内容 query，其**位置**初始化 decoder 参考框；
- 训练时加 IoU-aware 分支保证选出的框质量；
- query 数和 decoder 层数可按需裁剪 → 不改训练即可调精度/速度。

### 4.5 谁真的"一口气把所有尺度喂给 Transformer"

| 模型 | Encoder | Decoder |
|---|---|---|
| DETR | ❌ 单层 1/32，稠密自注意力 | ❌ 单层 |
| Deformable DETR | ✅ 多尺度可变形注意力（稀疏） | ✅ 多尺度（稀疏） |
| **RT-DETR** | ❌ 仅 S5 稠密自注意力；跨尺度交给 CNN | ✅ 多尺度（稀疏采样） |
| RT-DETRv2 / D-FINE / DEIM 等后续 | ⚠️ 部分改版把自注意力扩展到更多层 | ✅ 多尺度 |

面试要答清：**RT-DETR 恰恰是在反对"全部尺度一口气喂进 Transformer"**。它把"尺度内交互"和"跨尺度融合"解耦：前者用小分辨率上的 Transformer，后者用 CNN，decoder 再稀疏看全尺度。

## 5. 为什么这个结构适合版面/印章

| 文档场景难点 | RT-DETR 的对应机制 |
|---|---|
| 印章压在正文上（严重重叠） | 一对一匈牙利匹配 + 无 NMS，印章框和文字框都能保住 |
| 长宽比极端（整页表格 vs 单行页码） | decoder 多尺度采样，大目标看 S5、小目标看 S3 |
| 印章是红色圆形/椭圆纹理 | 自建合同/公文数据集里学到视觉模式，做**定位**而非读字 |
| 元素数量不固定 | 固定 300 个 query 一次性集合预测，多余槽位预测 \(\varnothing\) |

## 6. 阅读顺序恢复：PP-DocLayoutV2 多出来的一步

检测之后级联一个 **6 层 Transformer 指针网络**：

1. 每个检出框用**绝对二维位置编码 + 类别标签**嵌入；
2. 注意力融合 Relation-DETR 的**几何偏置**，显式建模元素间的成对空间关系；
3. pairwise head 把元素投影成 q/k，算双线性相似度 → **N×N 相对顺序 logits**；
4. 确定性的 **win-accumulation** 解码 → 拓扑一致的阅读顺序。

`PP-DocLayoutV2` 由此从"只出框"升级为"出框 + 正确的阅读顺序"，对多栏论文、报纸、杂志尤其重要。

## 7. 工程参数与失败模式

| 参数 | 作用 | 印章场景建议 |
|---|---|---|
| `layout_nms` | 过滤重叠框 | RT-DETR 系可关；PicoDet 系需要。开着容易把压字的印章框抑制掉 |
| `layout_unclip_ratio` | 框中心不变外扩（如 1.1） | 略扩，避免切掉章边缘 |
| `layout_merge_bboxes_mode` | 包含关系处理：`large`/`small`/`union` | 印章压文字时选 `union` 或按类配置 |
| `threshold` | 置信度阈值，可按 `cls_id` 给不同值 | 判定"有无"时对 `seal` 单独设更严阈值，并合并多框后再决策 |

已知易错：

- 红色 Logo / 红色标题被误判为印章；
- 极浅、半透明电子章漏检；
- 骑缝章被切碎成多个框；
- 不同模型 `cls_id` 不统一，跨模型复用阈值配置会错位。

## 8. 面试追问速答

**Q：PP-DocLayout-L 的检测头是什么？**
A：RT-DETR-L，端到端集合预测，无需 NMS；M/S 是 PicoDet（anchor-free CNN 检测器，需 NMS）。

**Q：`seal` 框出来后能读章里的公司名吗？**
A：不能直接读。版面模型只定位；需要弧形文本检测 + 极坐标展开 + OCR 的印章识别流程。

**Q：为什么不用 U-Net 做像素级分割？**
A：版面元素稀疏、边界语义明确，目标检测足够且后处理简单；印章这类目标靠视觉纹理 + 位置关系就能定住，分割成本高且对重叠并无优势。

**Q：query 是随机初始化的吗？**
A：原版 DETR 是；RT-DETR 从编码器特征里按不确定性最小选 top-K 作为初始 query，收敛更快。

**Q：尺度内自注意力是不是意味着完全不看多尺度？**
A：不是。只是 encoder 的自注意力只在 S5 做；跨尺度融合由 CNN（CCFF）完成，decoder 仍用多尺度可变形注意力看 F3/F4/F5。

## 9. 参考资料

- PaddleOCR 版面分析/版面区域检测官方文档：`http://www.paddleocr.ai/main/version3.x/module_usage/layout_analysis.html`、`layout_detection.html`
- PaddleX 通用版面解析产线：`https://paddlepaddle.github.io/PaddleX/main/pipeline_usage/tutorials/ocr_pipelines/layout_parsing.html`
- RT-DETR: *Real-Time DEtection TRansformer*, arXiv:2304.08069
- DETR: *End-to-End Object Detection with Transformers*, ECCV 2020
- Deformable DETR: *Deformable DETR: Deformable Transformers for End-to-End Object Detection*, ICLR 2021
