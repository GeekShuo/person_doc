# 泛化性评估实验 - 代码修改说明

## 实验概述

在120类数据集(20580张图)上评估CUB_200训练的ResNet50 baseline和ResNet Scale+CBAM改进模型的泛化能力。
方法：冻结backbone，替换fc层为120类，只训练fc(linear probing)，20 epochs，lr=0.001，CosineAnnealing。

## 实验结果

| 模型 | 数据集 | Top1 | Top5 | F1 |
|------|--------|------|------|-----|
| **Baseline ResNet50** | Full | **76.75%** | **95.36%** | **76.48%** |
| Baseline ResNet50 | Test | **67.23%** | **91.69%** | **66.40%** |
| Scale+CBAM (原始, 256维fc) | Full | 27.55% | 57.72% | 25.68% |
| Scale+CBAM (原始, 256维fc) | Test | 22.04% | 52.11% | 20.00% |
| CBAM-NoMSF (方案2, 2048维fc) | Full | 52.61% | 80.42% | 51.78% |
| CBAM-NoMSF (方案2, 2048维fc) | Test | 40.60% | 71.11% | 39.03% |

## 代码修改

### 方案1: 原始Scale+CBAM评估 (run_train.py v1→v3)

**与原始代码的区别：**

1. **模型定义内联**：将`resnet50基础对比/nets/resnet.py`和`resnet50改进/nets/resnet_scale_cbam.py`的模型定义直接写入run_train.py，不依赖CFS上的外部模块

2. **fc层替换**：原始模型fc=Linear(2048, 200)或Linear(256, 200)，改为Linear(2048/256, 120)适配新数据集
   ```python
   # 加载权重时跳过fc，fc随机初始化
   skip = ["fc."]
   ckpt_filtered = {k: v for k, v in ckpt.items() if not any(k.startswith(p) for p in skip)}
   ```

3. **冻结backbone，只训fc**：
   ```python
   for name, param in model.named_parameters():
       if not name.startswith("fc."): param.requires_grad = False
   ```

4. **Subset兼容性修复(v3)**：`torch.utils.data.Subset`没有`class_names`属性，`evaluate_model`改为接收`num_classes`参数而非从dataset取

5. **ImageFolderDataset**：新增类，替代原始的CUB_200专用Dataset，支持ImageNet目录格式(文件夹名=类名)

6. **评估指标**：增加top5_accuracy、precision、recall、f1（原始只有top1）

### 方案2: CBAM-NoMSF评估

**在方案1基础上的额外修改：**

1. **新增`ResNetCBAM_NoMSF`模型类**：保留CBAM bottleneck，**去掉`ms_fusion`和最后的`cbam(2048)`**，直接用`layer4+avgpool+fc(2048→num_classes)`
   ```python
   # 原始Scale+CBAM: layer4 → cbam(2048) → ms_fusion([feat1,2,3,4]) → fc(256→200)
   # 方案2:           layer4 → avgpool → fc(2048→120)
   ```

2. **加载权重时额外跳过`ms_fusion.`和`cbam.`前缀**：
   ```python
   load_pretrained_freeze_fc(model, path, ..., skip_prefixes=["ms_fusion.", "cbam."])
   ```

3. fc输入维度从256变为2048，可训练参数从30,840变为245,880，与baseline完全一致，公平对比

### 方案3(当前运行): MSFusion out_channels 256→2048

**在方案1基础上的额外修改：**

1. **`MultiScaleFusion`的`out_channels`从256改为2048**：
   ```python
   # 原始: MultiScaleFusion(in_ch, out_channels=256)
   # 方案3: MultiScaleFusion(in_ch, out_channels=2048)
   self.fc = nn.Linear(2048, num_classes)  # 与baseline维度一致
   ```

2. **两阶段训练**：
   - Phase 1: 在CUB_200上从头训练整个模型30 epochs（MSFusion 2048没有预训练权重）
   - Phase 2: 冻结backbone，120类linear probing

3. **CUB_200路径修复**：txt文件中图片路径是相对路径，需拼接CFS根目录
   ```python
   img_path = os.path.join(cub_root, parts[0])  # cub_root = CFS/resnet/resnet50改进
   ```

4. 模型参数量从30M增至186M（MSFusion 2048维参数量大）

## 结论

1. Baseline ResNet50泛化性远优于Scale+CBAM（76.75% vs 27.55%）
2. MSFusion 256维是信息瓶颈，去掉后提升到52.61%，但仍远低于baseline
3. CBAM注意力模块在CUB_200上学到的domain-specific特征选择策略，迁移到新域后反而抑制有用特征
4. 标准卷积学的是"是什么"(通用)，attention学的是"看哪里"(特定)，前者可迁移，后者不行
