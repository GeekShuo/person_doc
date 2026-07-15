![](./assets/Tstars-Tryon%201.0%20Robust%20and%20Realistic%20Virtual/file-20260615144708790.png)


**Try-On for Diverse Fashion Items**

Paper：[https://arxiv.org/abs/2604.19748](https://arxiv.org/abs/2604.19748)

Bench：[https://huggingface.co/datasets/TaobaoTmall-AlgorithmProducts/Tstars-VTON](https://huggingface.co/datasets/TaobaoTmall-AlgorithmProducts/Tstars-VTON)
**Motivation**

1、场景复杂度以及试衣真实感；

2、评价体系的缺陷、开源数据集的单一性；

2、支持多图输入，搭配组合；

八个类别（上衣、裤子、裙子、连衣裙、鞋子、包、帽子和外套）

3、推理速度；

**5B****参数** + CFG蒸馏 + 步数蒸馏 = **3.92****秒单件****/6.74****秒多件**

**Model**![](./assets/Tstars-Tryon%201.0%20Robust%20and%20Realistic%20Virtual/file-20260615144708791.png)
Model Architecture:   MMDiT

Training Infra: 支持可变分辨率以及任意参考图像，

       采用Data Packing策略

Meticulous Training Strategies: 预训练->CT->SFT->RL

Prompt Enhancement:  强调TryOn的编辑过程

Fast Inference Acceleration:  DiT参数降低至5B，采用CFG&步数蒸馏![](./assets/Tstars-Tryon%201.0%20Robust%20and%20Realistic%20Virtual/file-20260615144708792%201.png)![](./assets/Tstars-Tryon%201.0%20Robust%20and%20Realistic%20Virtual/file-20260615144708792.png)![](./assets/Tstars-Tryon%201.0%20Robust%20and%20Realistic%20Virtual/file-20260615144708794%201.png)**第一阶段：**

**（****1****）输入：模特图、衣服图、结果图**

**（****2****）关注点：人物一致性和服饰一致性**

**第二阶段：**![](./assets/Tstars-Tryon%201.0%20Robust%20and%20Realistic%20Virtual/file-20260615144708793.png)

**（****1****）输入：模特图、结果图**

**（****2****）关注点：背景、物理和结构逻辑**![](./assets/Tstars-Tryon%201.0%20Robust%20and%20Realistic%20Virtual/file-20260615144708793.png)![](./assets/Tstars-Tryon%201.0%20Robust%20and%20Realistic%20Virtual/file-20260615144708794.png)