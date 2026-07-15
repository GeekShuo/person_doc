

# Introduction：LDM (Latent Space Diffusion) VS Pixel Space Diffusion

## Background

**Latent Diffusion Model (LDM)：**会先训练一个能够压缩和复原图像的 VAE，再训练一个 VAE 潜空间 (latent space) 里的扩散模型。由于潜空间中latent的元素数远少于像素图像的元素数，LDM 的训练十分高效。

在 DiT[1] 论文的 ImageNet-256 benchmark 结果中，LDM 比像素空间的 ADM 更好，而用了 DiT 比用 U-Net 的 LDM 更好。

![](https://apijoyspace.jd.com/v1/files/6PAldDNsdA6hiHdEdQTk/link)

# Motivation：研究Pixel Space Diffusion是否还有价值？

**LDM存在的问题：**

1. **VAE的限制：**

2. VAE的重建损失

latent diffusion 中的VAE 存在重建误差，生成目标与重建目标不一致的问题，对细节保真度与编辑一致性存在影响。直接在像素空间进行扩散建模，有可能避免这一点

1. 长序列的限制

LDM 虽然大大提升了扩散模型生成高分辨率图像的效率，但它并没有解决**用扩散模型生成长序列**这件事，因为 LDM 是通过减少潜图像序列的长度来提升效率的。但当输入序列变长，仍然绕不过长序列生成这个问题。

目前主流的做法是采用vae p=8 + _pack_latents p=2 一共p=16的操作来降低序列长度。

1. **增加VAE压缩比：**会让 VAE 重建效果下降。
2. **增加patchify大小：**DiT[1] 论文发现，当p>=4后，DiT 生成质量会出现明显下降。因此，自 DiT 之后，主流模型几乎都将p=2作为默认设置

![](https://apijoyspace.jd.com/v1/files/XQpFuLltLAw8lteB2a3G/link)

1. **vae latent带来的信息瓶颈**：

2. vae latent dimension不能太长，否则会导致diffusion很难学；VAE的downsample和upsample是比线性映射的patchify复杂的多；vae单独训练也会让latent space不适应ldm。
3. VAE 压缩能力其实比 patchify 强很多。按理说直接 p=8，通道数应该变成 8*8*3=192。但现在 VAE 通道数远低于这个值。相比 VAE，patchify 输出通道数太多，要拟合分布更难。除此之外还有其他端到端的 pixel DiT，用更好的方式解码出像素级输出，而不是 p*p*3 个通道的输出，也取得了很好的表现。

# JiT (Back to Basics: Let Denoising Generative Models Denoise)

## Target：

1. 目前的LDM和pixel space diffusion技术的共同点：因为 Transformer 的计算复杂度很大，必须用某种方式来压缩输入序列。但这些压缩往往会影响生成质量。DiT相当于vae p=8 ldm p=2 一共p=16。只不过VAE部分是预先训好的，所以diffusion训练难度更低。
2. JiT 的目标是训练一个**不带任何额外设计，且 patch size 较大的 pixel DiT**。
3. 就结果而言，JiT相当于直接diffusion学了p=16，不存在上述的信息瓶颈问题，也做到了端到端训练，另外它的patchify和unpachify相比VAE也简单的多。

## Contribution：

1. 去掉了VAE，把 DiT 的预测目标从v 换成x (x-pred)，即让模型直接预测clean image。
2. 实验发现：当 Transformer 用了比较大的 patch 的时候，比如32，也就意味着每个 token 的维度超高，预测是x可以的；预测v或者ε不行。

这也说明：当预测的东西的维度很高的时候 (比如大 patch 场景)，让模型预测低维流形的数据，模型能 work。但是让模型预测高维的数据，模型就不能 work。

![](https://apijoyspace.jd.com/v1/files/KxymrCbKpW7lmZ3gJ8es/link)

## Method：

1. 最常用的 rectified flow 加噪公式为：(清晰图像和噪声之间的线性插值)

![](https://apijoyspace.jd.com/v1/files/9LEcB6hrvBPlNhRa5lor/link)![](https://apijoyspace.jd.com/v1/files/U7m0HhjVgocshArdxJJ5/link)

如果以清晰图像为预测目标，而非预测noise (ε - pred) (常见于diffusion model) / 速度 (v - pred) (常见于flow-based model)。

![](https://apijoyspace.jd.com/v1/files/AVGiuCNRYvBKkRTw0MAi/link)

其中xθ是预测的清晰图像，ε是高斯噪声，Zt是时刻t的带噪图像。

于是上述公式可以在预测目标和loss之间互相转换：

![](https://apijoyspace.jd.com/v1/files/D5ZuxQeLPWTZUIBBpEaY/link)

## Experiment

作者使用了一个非常简单的模型进行实验：

![](https://apijoyspace.jd.com/v1/files/NOdMBrkARtYFaBqFFtuS/link)

x_pred = net()
loss = mse(x_pred, x)

z = add_noise(x, eps)
v = (x - z) / (1 - t).clamp_min(5e-2)

x_pred = net()
v_pred = (x_pred - z) / (1 - t).clamp_min(5e-2)

loss = mse(v_pred, v)

下图a表是 ImageNet 256 的实验，使用大小为 16×16 的 Patch，b表是 ImageNet 64 的实验，使用大小为 4×4 的 Patch。这两组实验的序列长度都是 256。

![](https://apijoyspace.jd.com/v1/files/OAo97IpV5L8D8urL512m/link)

### Toy Experiment

将一个二维图像用一个维度为 D 的随机投影矩阵投影到了 D 维。然后，基于上述预测目标训练个不同的扩散模型，观察哪个模型能够成功预测这个投影后的 D 维数据。结果发现，随着 D 增加，只有 x-pred 维持不错的预测效果，预测ϵ-pred和v-pred都不行。

![](https://apijoyspace.jd.com/v1/files/2xBOzakofKLcx5KEG4gV/link)

结论：

- x-pred 在高维空间依然可学习
- ϵ-pred / v-pred 会直接崩溃

更进一步：像素空间 DiT 难训练的原因是 patch size 太大，要拟合的分布太难。下面三篇工作都用基于像素级特征的解码器取代 unpatchify，取得了比 JiT 更好的生成效果。

问题：pixel space dit用的dit+pixel decoder的做法和ldm不是越来越相似了吗

1. 去掉了vae，整个求解过程都发生在pixel space
2. 求解目标也变为了x-pred
3. 后接的decoder与dit一起端到端训练，而非vae decoder的单独训练

# DiP: Taming Diffusion Models in Pixel Space

DiP 探究了两方面：

- 应该在哪个地方引入像素级网络？
- 像素级网络应该用什么架构？

从引入网络的位置来看，论文测试了三类方式：

- DiT 完成后再接 head
- 将高频信息回注到 DiT 内部
- 混合注入

三类方式的示意图及实验结果如下图所示。结果表明，接在 DiT 后面的效果最好，且实现最简单，因为加入它时完全不用修改 DiT 的架构。并且也表明了：用一个小型解码器取代 unpatchify 比较好，不需要修改 DiT 的其他部分。

![](https://apijoyspace.jd.com/v1/files/ssTaR2Wkr8HBXUsBzunu/link)![](https://apijoyspace.jd.com/v1/files/8X9xIIKtkzHiK1BHmK0I/link)

此外，论文尝试了多种解码器架构。所有解码器的输入输出都是形状为pxpx3的像素级 token，条件信息为 DiT 的在该 patch 处的输出特征。该网络不直接包含 patch 与 patch 之间的信息交流，全局信息仅靠 DiT 输出特征提供。

- 标准 MLP：即一个把所有输入 flatten 的全连接网络。这个做法仅仅是 patchify 的一个升级，网络的输入和输出还是高维的，并没有利用 patch 内部的空间信息。
- Coordinate-based MLP：类似 NeRF 的结构，目的是用神经网络表示一张连续的 2D 图像。用 DiT 的输出来生成 MLP 的权重，通过输入二维坐标来读取此处的输出像素值。
- 块内 Transformer： 用一个小型 Transformer，对一个 patch 内所有像素级特征做 attention。
- UNet（最终选择）：标准去噪 UNet。DiT 条件信息会拼接到 U-Net 的最深层。

# DeCo: Frequency-Decoupled Pixel Diffusion for End-to-End Image Generation

DeCo 对像素 DiT 做了两个方向上的改进：

1. 架构改进，在 DiT 后面接了一个无 attention 的 Transformer 作为像素级解码器
2. 提出 Frequency-aware loss，把原本算 MSE loss 的图像放到频域按不同权重算 loss

![](https://apijoyspace.jd.com/v1/files/2QJdYzSEmb9DT3PIHBJm/link)

DeCo 通过加入无 attention 的 DiT 作为像素级解码器，并配合 Freq Loss，在 ImageNet-256 任务上超过了JiT

![](https://apijoyspace.jd.com/v1/files/cCs4531yrKXjsIl2mRBx/link)

# PixelDiT: Pixel Diffusion Transformers for Image Generation

相比 DeCo，PixelDiT 的区别是加入 self-attention。为解决注意力计算量过大，PixelDiT 采用 下采样 → attention → 上采样 的架构，取得比 DeCo 更好的效果。

![](https://apijoyspace.jd.com/v1/files/6XESP33pb0SxPXbwPDCd/link)

在 DeCo 解码器的基础上，PixelDiT 加上了 self-attention，也就顺带请回了 RoPE。

直接对所有像素级特征做 self-attention 计算开销太大。PixelDiT 在此处采取了类似 patchify, unpatchify 的操作，把 self-attention 放到一张更小的 token image 上做。当然，这个 self-attention 无法生成细节，只用于维持全局信息。高频细节还是靠其他逐像素操作维护的。

|   |   |   |   |
|---|---|---|---|
|论文|加解码器的位置|解码器架构|解码器信息交流|
|DiP|DiT 之后|U-Net|patch 内所有像素|
|DeCo|DiT 之后|无注意力 Transformer|无|
|PixelDiT|DiT 之后|下采样 attention 版 Transformer|所有像素|

参考文献

[1] Peebles, W., & Xie, S. (2023). Scalable diffusion models with transformers. In_Proceedings of the IEEE/CVF international conference on computer vision_(pp. 4195-4205).