

# 基本内容

## Deep Denerative Model

通过旧样本，使用神经网络来生成符合规律的新样本。即有可见样本(训练集样本)：**X** ~ P(x)，估计出P(x)，然后在从P(x)中采样处新样本(**生成**)。除此之外，部分模型还可以做density estimation(**估计**)，输入样本x，估计这个样本的概率。

训练生成模型就是让P(x)增大，也就是让出现训练数据的概率尽可能地高。一版优化函数使用 max_θ P_θ(x) ( 或是max_θ log(P_θ(x)) ),其中θ是可训练的参数，也就是极大似然估计，（Maximum Likelihood Estimation，**MLE**）。

真实的P(x)非常复杂，很难得到，所以出现了许多方法。

![](https://apijoyspace.jd.com/v1/files/D4nkidv1pLSOP34JGDaA/link)

如VAE，虽然不能准确得到 log(P_θ(x), 但是可以通过添加latent的手段得到一个下界，也就是所谓的证据下界（Evidence Lower Bound，**ELBO** ）。

## Flow-based Model

Normalized Flow通过应用一系列**可逆变换函数**，将简单分布转化为复杂分布，然后通过简单分布来计算MLE进而优化参数。

![](https://apijoyspace.jd.com/v1/files/Oa96up3K6WJWp8NXjwwV/link)

对于噪声样本 z （一般使用标准高斯），可以通过一个可逆变换，将它变换成一个新的样本，并且可以明确地根据z的分布和变化函数来得到新样本z'的分布。

\begin{aligned}  
\mathbf{z} &\sim \pi(\mathbf{z}), \mathbf{x} = f(\mathbf{z}), \mathbf{z} = f^{-1}(\mathbf{x}) \\  
p(\mathbf{x})  
&= \pi(\mathbf{z}) \left\vert \det \dfrac{d \mathbf{z}}{d \mathbf{x}} \right\vert  
= \pi(f^{-1}(\mathbf{x})) \left\vert \det \dfrac{d f^{-1}}{d \mathbf{x}} \right\vert  
\end{aligned}

堆叠这种简单的可逆变换理论上可以变化到任何分布上，当然也包括拟合P(x)。

![](https://apijoyspace.jd.com/v1/files/glsaW1fSlCkt8omHBpbJ/link)

\begin{aligned}  
\mathbf{x} = \mathbf{z}_K &= f_K \circ f_{K-1} \circ \dots \circ f_1 (\mathbf{z}_0) \\  
\log p(\mathbf{x}) = \log \pi_K(\mathbf{z}_K)  
&= \log \pi_{K-1}(\mathbf{z}_{K-1}) - \log\left\vert\det\dfrac{d f_K}{d \mathbf{z}_{K-1}}\right\vert \\  
&= \log \pi_{K-2}(\mathbf{z}_{K-2}) - \log\left\vert\det\dfrac{d f_{K-1}}{d\mathbf{z}_{K-2}}\right\vert - \log\left\vert\det\dfrac{d f_K}{d\mathbf{z}_{K-1}}\right\vert \\  
&= \dots \\  
&= \log \pi_0(\mathbf{z}_0) - \sum_{i=1}^K \log\left\vert\det\dfrac{d f_i}{d\mathbf{z}_{i-1}}\right\vert  
\end{aligned}

所以MLE损失函数变成了

![](https://apijoyspace.jd.com/v1/files/90rk74Yy4LdNVyM4cys9/link)

第一项是最后变换出来的z0是否真的服从标准高斯分布，

第二项是中间的变换步是否会压缩样本多样性（保证jacobian的行列式≥1）

Normalized Flow最**严厉**的两个父亲：

1. f这个变换**可逆**（非常严格，ReLU、下采样等操作直接凉凉，但是太简单的线性变化会让网络能力拟合太弱）
2. f的Jacobian行列式**易于计算**，因为要用它来求loss （次要严格）

Normalized Flow的主要研究方向就是如何设计**可逆变换f**。

### RealNVP

一般会用一个仿射变换，然后在仿射变换参数上添加 **learnable parameter** 和 **非线性操作**。

\begin{aligned}  
\mathbf{y}_{1:d} &= \mathbf{x}_{1:d} \\  
\mathbf{y}_{d+1:D} &= \mathbf{x}_{d+1:D} \odot \exp({s(\mathbf{x}_{1:d})}) + t(\mathbf{x}_{1:d})  
\end{aligned}

可逆：

\begin{cases}  
\mathbf{y}_{1:d} &= \mathbf{x}_{1:d} \\  
\mathbf{y}_{d+1:D} &= \mathbf{x}_{d+1:D} \odot \exp({s(\mathbf{x}_{1:d})}) + t(\mathbf{x}_{1:d})  
\end{cases}  
\Leftrightarrow  
\begin{cases}  
\mathbf{x}_{1:d} &= \mathbf{y}_{1:d} \\  
\mathbf{x}_{d+1:D} &= (\mathbf{y}_{d+1:D} - t(\mathbf{y}_{1:d})) \odot \exp(-s(\mathbf{y}_{1:d}))  
\end{cases}

Jacobian行列式容易计算：

\mathbf{J} =  
\begin{bmatrix}  
\mathbb{I}_d & \mathbf{0}_{d\times(D-d)} \\[5pt]  
\frac{\partial \mathbf{y}_{d+1:D}}{\partial \mathbf{x}_{1:d}} & \text{diag}(\exp(s(\mathbf{x}_{1:d})))  
\end{bmatrix}

那么

\det(\mathbf{J})  
= \prod_{j=1}^{D-d}\exp(s(\mathbf{x}_{1:d}))_j  
= \exp(\sum_{j=1}^{D-d} s(\mathbf{x}_{1:d})_j)

### TarFlow

![](https://apijoyspace.jd.com/v1/files/jWXNBT8r4AjVV2bHZDLe/link)

创新点：

1. 使用Causal Transformer （基于ViT），使得一次forward就能得到一次flow的所有部分

![](https://apijoyspace.jd.com/v1/files/4y7jGsXXG3geCwqZ9JtT/link)

1. **噪声增强训练**: 在训练过程中添加高斯噪声以增强模型的泛化能力，使用高斯噪声而不是均匀噪声来提高生成样本的质量。
2. **基于分数的去噪技术**: 通过分数基础的去噪技术去除生成样本中的噪声部分，提升样本的视觉质量。
3. **引导技术cfg**: 引入引导技术，通过在推理过程中调整样本质量，提升生成样本的多样性和模式搜索能力。

![](https://apijoyspace.jd.com/v1/files/9BC0nXpRe2vnMMfkyaGJ/link)

# Reference

1. 翁荔博客：[https://lilianweng.github.io/posts/2018-10-13-flow-models/](https://lilianweng.github.io/posts/2018-10-13-flow-models/)
2. S. Zhai et al., “Normalizing Flows are Capable Generative Models,”arXiv e-prints, p. arXiv:2412, Dec. 2024, doi: 10.48550/arXiv.2412.06329.
3. J. Gu et al., “STARFlow: Scaling Latent Normalizing Flows for High-resolution Image Synthesis,”arXiv e-prints, p. arXiv:2506, Jun. 2025, doi: 10.48550/arXiv.2506.06276.