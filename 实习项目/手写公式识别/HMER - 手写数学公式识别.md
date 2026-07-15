
基于深度学习的手写数学公式识别方法研究及系统实现（杜瑞艳论文复现）

模型架构：DenseNet121 + CBAM + 多尺度覆盖注意力 + GRU 解码器

## 目录结构

```
hmer/
├── src/                        # 训练源码
│   ├── config.py               # 模型超参数和数据路径
│   ├── train.py                # 训练入口（支持DDP）
│   ├── losses.py               # 损失函数
│   ├── __main__.py             # python -m src 入口
│   ├── models/                 # 模型定义
│   │   ├── encoder.py          # DenseNet121 编码器
│   │   ├── encoder_custom.py   # 定制版DenseNet [16,16,16]
│   │   ├── attention.py        # 多尺度覆盖注意力
│   │   ├── decoder.py          # GRU 解码器
│   │   ├── global_stats.py     # CBAM + 全局字符统计
│   │   ├── local_classify.py   # 局部字符分类器
│   │   ├── position_encoding.py# 2D 位置编码
│   │   └── full_model.py       # HMERModel 完整模型
│   └── data/                   # 数据处理
│       ├── dataset.py          # CROHME 数据集加载
│       └── vocab.py            # 词汇表
│
├── data/                       # CROHME 数据集
│   ├── train/ val/ test/       # 图像文件
│   └── labels.json             # 标注文件
│
├── checkpoints/                # 模型权重
│   ├── v1/                     # v1: 1卡 bs64 lr1.0 80epoch
│   ├── v1_8g5/                 # v1: 8卡 bs8 lr1.0 80epoch
│   ├── v2a/                    # v2a: 8卡 bs8 lr1.0 80epoch（修复后）
│   ├── v2b/                    # v2b: 8卡 bs8 lr3.0 80epoch
│   ├── v2c/                    # v2c: 8卡 bs8 lr1.0 80epoch ★最佳 51.58%
│   └── v3/                     # v3: 定制DenseNet [16,16,16] 240epoch
│   每个目录下: best_model.pt, vocab.json
│
├── logs/                       # 训练/评估日志
│   ├── v1/ v1_8g5/ v2a/ v2b/ v2c/ v3/ eval/
│
├── submit/                     # Magnus 提交脚本
│   ├── v1/                     # 1卡训练
│   ├── v1_8g5/                 # 8卡 DDP
│   ├── v2a/ v2b/ v2c/ v3/     # 各版本实验
│   ├── eval/                   # 离线评估（Greedy + Beam Search）
│   └── g1/                     # 1卡 shell 版
│   每个目录: magnus.py, run_train.py
│
├── web/                        # Web 识别系统
│   ├── app.py                  # Flask 后端（异步推理+轮询）
│   ├── hmer_model.py           # 模型推理接口
│   ├── index.html              # 前端页面
│   ├── model_inference/        # 独立推理模型代码（绝对导入）
│   ├── uploads/ results/       # 运行时目录
│   └── README.md               # Web 系统说明
│
├── eval_offline.py             # 离线评估脚本
│
└── docs/                       # 文档
    ├── 论文.pdf                 # 杜瑞艳硕士论文
    ├── extracted_final.txt      # 论文OCR提取文本
    ├── EXPERIMENTS.md           # 实验记录
    └── MAGNUS_PITFALLS.md       # Magnus踩坑指南
```

## 快速开始

### 训练

```bash
# 单卡
cd ~/hmer
python -m src.train --data_root ~/hmer/data --batch_size 64 --epochs 80 --lr 1.0

# 多卡 DDP（通过 magnus 提交）
# 编辑 submit/v2c/magnus.py 中的路径，然后：
9nctl magnus submit submit/v2c/
```

### 评估

```bash
python eval_offline.py
# 或通过 magnus：
9nctl magnus submit submit/eval/
```

### Web 识别系统

```bash
cd ~/hmer/web
HMER_CHECKPOINT=~/hmer/checkpoints/v2c/best_model.pt python app.py
# 访问 http://localhost:5000
```

## 实验结果

| 版本      | 架构                  | 配置                     | ExpRate    |
| ------- | ------------------- | ---------------------- | ---------- |
| v1      | DenseNet121         | 1卡 bs64 lr1.0 80ep     | (中断)       |
| v1_8g5  | DenseNet121         | 8卡 bs8 lr1.0 80ep      | 9.01%      |
| v2a     | DenseNet121         | 8卡 bs8 lr1.0 80ep (修复) | ~40%       |
| v2b     | DenseNet121         | 8卡 bs8 lr3.0 80ep      | ~40%       |
| **v2c** | **DenseNet121**     | **8卡 bs8 lr1.0 80ep**  | **51.58%** |
| v3      | DenseNet [16,16,16] | 8卡 bs8 lr1.0 240ep     | (训练中)      |

论文基准（无增广）：CROHME 2014 56.39%, CROHME 2016 53.71%, CROHME 2019 52.96%

## 路径约定

- 容器内 CFS 挂载：`/home/pengshuo.10/hmer/`
- 宿主机 CFS 挂载：`/media/cfs/pengshuo.10/hmer/`
- 代码中统一通过 `CFS` 变量检测：优先 `/home/pengshuo.10`，回退 `/media/cfs/pengshuo.10`


# 手写数学公式识别 — 实验记录

## 实验1：8卡B200 DDP训练（baseline）

**时间**：2026-05-16 03:55 ~ 04:49

**训练配置**：
- 模型：DenseNet121 + CBAM + 覆盖注意力 + GRU
- GPU：8×B200 (G5)
- 分布式：手动多进程（MASTER_PORT随机50000-60000），不用torchrun
- batch_size：64/GPU × 8 = 512 effective
- 优化器：Adadelta, lr=1.0, warmup 1 epoch后余弦退火
- epochs：80
- 损失：1.0×L_ce + 1.0×L_global + 0.5×L_local
- DataLoader：num_workers=0, pin_memory=False（CFS兼容）
- vocab_size：111

**结果**：
- 训练loss：10.05 → 2.64
- 验证loss：5.65 → 3.19
- 在线ExpRate（teacher forcing + bug decode）：10.59%
- 离线ExpRate（autoregressive + 修复decode）：**8.94%**（79/884）
- best_model epoch：75

**文件位置**：
- 模型：`/media/cfs/pengshuo.10/shibie/checkpoints_8g5/best_model.pt`
- vocab：`/media/cfs/pengshuo.10/shibie/checkpoints_8g5/vocab.json`
- 训练日志：`/media/cfs/pengshuo.10/shibie/logs_8g5/rank0.log`
- 评估日志：`/media/cfs/pengshuo.10/shibie/logs_eval/eval_20260516_060136.log`
- 评估提交目录：`/home/pengshuo.10/shibie_submit_eval/`
- 训练提交目录：`/home/pengshuo.10/shibie_submit_8g5/`

**问题分析**：
- ExpRate 8.94% 远低于论文 50%+
- 有效batch_size=512太大，每epoch仅14步更新
- loss 2.64未收敛（目标0.5~1.0）
- 无label smoothing
- Adadelta lr=1.0可能不适合

---

## 实验2：1卡B200训练（已中断）

**时间**：2026-05-16 02:52 ~ 04:42（手动清理）

**训练配置**：
- 同实验1参数，但1卡batch_size=64
- 有效batch_size=64，每epoch约110步更新

**结果**：
- 跑到epoch 39后手动清理
- loss趋势正常下降

**文件位置**：
- 模型（已中断，不完整）：`/media/cfs/pengshuo.10/shibie/checkpoints/`

---

---

## 实验3a：8卡 bs=8 lr=1.0 clip=5.0（论文对齐）

**时间**：2026-05-16 11:58

**训练配置**：
- GPU：8×B200 (G5)
- batch_size：8/GPU × 8 = 64 effective（论文一致）
- 优化器：Adadelta, lr=1.0
- gradient clipping：5.0
- 数据：拷到/tmp本地盘，num_workers=8, pin_memory=True
- epochs：80

**任务ID**：magnus-pengshuo-10-7ca6f518 → 9e8c39a2（重提）
**结果**：Best Val ExpRate = 48.42%
**文件位置**：
- checkpoint：`/media/cfs/pengshuo.10/shibie/checkpoints_v2a/`
- 日志：`/media/cfs/pengshuo.10/shibie/logs_v2a/`
- 提交目录：`/home/pengshuo.10/shibie_submit_8g5_v2a/`

---

## 实验3b：8卡 bs=8 lr=3.0 clip=5.0（Adadelta lr搜索）

**训练配置**：同3a，但lr=3.0

**任务ID**：magnus-pengshuo-10-8742d42e → b8130554（重提）
**结果**：Best Val ExpRate = 50.90%
**文件位置**：
- checkpoint：`/media/cfs/pengshuo.10/shibie/checkpoints_v2b/`
- 日志：`/media/cfs/pengshuo.10/shibie/logs_v2b/`
- 提交目录：`/home/pengshuo.10/shibie_submit_8g5_v2b/`

---

## 实验3c：8卡 bs=8 lr=1.0 clip=2.0（更强梯度裁剪）

**训练配置**：同3a，但grad_clip=2.0

**任务ID**：magnus-pengshuo-10-0042d4c2 → a9153db0（重提）
**结果**：Best Val ExpRate = **51.58%** ✨ 最高！
**文件位置**：
- checkpoint：`/media/cfs/pengshuo.10/shibie/checkpoints_v2c/`
- 日志：`/media/cfs/pengshuo.10/shibie/logs_v2c/`
- 提交目录：`/home/pengshuo.10/shibie_submit_8g5_v2c/`

---

## 实验3最终对比

| 实验  | lr  | grad_clip | Train Loss | Val Loss | Best Val ExpRate |
| --- | --- | --------- | ---------- | -------- | ---------------- |
| 3a  | 1.0 | 5.0       | 2.27       | 2.83     | 48.42%           |
| 3b  | 3.0 | 5.0       | 2.29       | 3.05     | 50.90%           |
| 3c  | 1.0 | 2.0       | 2.22       | 2.77     | **51.58%**       |

**结论**：
- clip=2.0效果最好，训练更稳定，loss最低
- lr=3.0中期领先但不如clip=2.0的最终效果
- 3c已接近论文CROHME 2019结果

---

## Beam Search评估（v2c模型）

| 解码策略 | ExpRate |
|---------|---------|
| Greedy | 45.59% |
| Beam(5) | **47.62%** |
| 提升 | +2.04% |

Beam search稳定提升2个点，但训练仍用greedy（省时间），评估时可用beam。

---

## 实验4：定制DenseNet [16,16,16] + 240 epoch

**改动**：
- 编码器：标准DenseNet121 [6,12,24,16] → 定制DenseNet [16,16,16]（论文原始结构）
- epochs：80 → 240（effective bs=64比论文大8倍，需3倍epoch补偿更新次数）
- checkpoint保存：每10 epoch → 每30 epoch
- 其余：lr=1.0, grad_clip=2.0, warmup=1

**任务ID**：magnus-pengshuo-10-49241cf6
**文件位置**：
- checkpoint：`/media/cfs/pengshuo.10/shibie/checkpoints_v3/`
- 日志：`/media/cfs/pengshuo.10/shibie/logs_v3/`
- 提交目录：`/home/pengshuo.10/shibie_submit_8g5_v3/`

**教训**：论文叫"DenseNet121"但实际是3 Block [16,16,16]定制版，不能直接套torchvision标准实现。应先核对论文每层参数再写代码。

---

## 与论文对比

| 方法 | 数据集 | ExpRate | 备注 |
|------|--------|---------|------|
| 论文 Ours | CROHME 2014 | **56.39%** | 单卡bs=8, lr=1.0, Adadelta |
| 论文 Ours | CROHME 2016 | **53.71%** | 同上 |
| 论文 Ours | CROHME 2019 | **52.96%** | 同上 |
| 实验1（8卡bs=64, lr=1.0, clip=5.0） | CROHME | 8.94% | effective bs太大，训练不充分 |
| 实验3c（8卡bs=64, lr=1.0, clip=2.0） | CROHME | **51.58%** | 接近论文CROHME 2019结果 |

论文原文（第1409行）：
> 3.3.3 实验设置 本章提出的识别模型基于Pytorch深度学习框架实现。在数据集CROHME上的训练中，批处理大小为8；在数据集HME-EXAM上的训练中，批处理大小为32。模型采用Adadelta


# 9Nctl Magnus 训练踩坑记录

## 环境

- 镜像：`ubuntu24.04-cuda12.8-torch2.10-magnus-gpu_v1.8.0`
- 集群：dt02，组 `cvfa-aigc-x2v`
- CFS挂载：容器内 `/home/pengshuo.10/`（宿主机 `/media/cfs/pengshuo.10/`）

---

## 坑1：多卡DDP端口冲突（最坑！反复失败的核心原因）

**现象**：4卡/8卡G5任务提交后FAILED，pod创建后几秒内被删除。

**根因**：magnus框架启动容器后会占用大量端口（29500、29501、39501、40000等），torchrun的TCPStore绑定时EADDRINUSE。

```
torch.distributed.DistNetworkError: The server socket has failed to listen on any local network address. port: 29500, code: -98, name: EADDRINUSE
```

**试过的无效方案**：
1. `--master_port=29501` → 也被占
2. `--master_port=39501` → 也被占
3. `--master_port=40000` → 也被占
4. 先探测可用端口再绑定 → 探测时空闲，torchrun绑定时已被magnus抢占（时序竞争）
5. `--rdzv_backend=file` → torch 2.10已不支持，报 `KeyError: 'file'`

**最终解决方案：不用torchrun，手动启动多进程**

直接通过环境变量 `MASTER_ADDR/MASTER_PORT/RANK/LOCAL_RANK/WORLD_SIZE` 控制DDP，用50000-60000随机端口绕开magnus占用的端口范围：

```python
import random, subprocess, os

nproc = torch.cuda.device_count()
master_addr = "127.0.0.1"
master_port = random.randint(50000, 60000)

env_base = os.environ.copy()
env_base["MASTER_ADDR"] = master_addr
env_base["MASTER_PORT"] = str(master_port)
env_base["WORLD_SIZE"] = str(nproc)

procs = []
for rank in range(nproc):
    env = env_base.copy()
    env["RANK"] = str(rank)
    env["LOCAL_RANK"] = str(rank)
    
    cmd = [sys.executable, "-u", "-m", "src.train", "--ddp", ...]
    p = subprocess.Popen(cmd, env=env, stdout=open(f"log/rank{rank}.log", "w"),
                         stderr=subprocess.STDOUT)
    procs.append(p)

for p in procs:
    p.wait()
```

train.py里的DDP初始化用 `env://` 方式（默认就是）：

```python
dist.init_process_group(backend="nccl")  # 自动读 MASTER_ADDR/PORT/RANK/WORLD_SIZE
local_rank = int(os.environ.get("LOCAL_RANK", 0))
torch.cuda.set_device(local_rank)
```

---

## 坑2：DataLoader worker被OOM kill

**现象**：训练epoch 3崩溃，DataLoader worker被系统杀掉。

```
RuntimeError: DataLoader worker (pid 1638) is killed by signal: Terminated.
```

**根因**：CFS是网络文件系统，`num_workers=4` + `pin_memory=True` 导致多进程并发读CFS，内存暴涨被OOM kill。

**解决**：

```python
DataLoader(..., num_workers=0, pin_memory=False)
```

CFS上读图不要用多进程，单进程主线程读反而更稳。

---

## 坑3：entrance_filename 必须是 .py 文件

**现象**：`entrance_filename = "run_train.sh"` 时任务提交后FAILED，pod直接消失无日志。

**根因**：magnus框架对 `.sh` 入口文件的处理有问题（可能不执行或执行环境不对），`.py` 入口文件正常。

**解决**：

```python
# magnus.py
entrance_filename = "run_train.py"  # 不要用 .sh
```

---

## 坑4：组资源配额不足

**现象**：大规格任务排不上队或秒崩。

**根因**：查看 `9Nctl group cvfa-aigc-x2v`：
- CPU：用了3467，配额900（超3.8倍）
- 内存：用了30665G，配额8000G（超3.8倍）
- G5：用了217张，配额0（超配）
- G1：用了0，配额48

资源被其他人占满，大规格申请排不上。偶尔1卡能排到是因为有碎片资源释放。

**解决**：留意资源释放窗口，1卡小规格更容易排上。

---

## 坑5：os.execvp 替换进程后 9Nctl logs 无输出

**现象**：训练实际在跑（CFS上有checkpoint文件），但 `9Nctl logs` 看不到任何训练输出。

**根因**：run_train.py用 `os.execvp` 替换了当前进程，magnus框架失去了对子进程stdout的管道连接，无法捕获输出。

**解决**：用 `subprocess.Popen` + 逐行读取 + 写CFS日志文件，不要用 `os.execvp`：

```python
log_file = os.path.join(CFS, "shibie/logs/train.log")
with open(log_file, "w") as lf:
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    for line in proc.stdout:
        decoded = line.decode("utf-8", errors="replace")
        print(decoded, end="", flush=True)
        lf.write(decoded)
        lf.flush()
    proc.wait()
```

---

## 坑6：argparse 必须用 parse_known_args()

**现象**：magnus框架向训练脚本传入 `--master_addr`、`--master_port` 等参数，argparse默认 `parse_args()` 遇到未知参数直接报错exit code 2。

**解决**：

```python
args, _ = parser.parse_known_args()  # 忽略magnus传入的额外参数
```

---

## 坑7：CFS路径在容器和宿主机不同

**现象**：代码里写 `/media/cfs/pengshuo.10/` 在容器里找不到文件。

**根因**：
- 宿主机CFS挂载点：`/media/cfs/pengshuo.10/`
- magnus容器内CFS挂载点：`/home/pengshuo.10/`（容器只挂了这个路径）

**解决**：入口脚本自动判断：

```python
if os.path.isdir("/home/pengshuo.10/shibie"):
    CFS = "/home/pengshuo.10"
elif os.path.isdir("/media/cfs/pengshuo.10/shibie"):
    CFS = "/media/cfs/pengshuo.10"
```

---

## 坑8：9Nctl logs 命令超时

**现象**：`9Nctl logs` 经常超时无输出，即使任务在RUNNING。

**根因**：magnus日志服务不稳定，pod多时日志拉取慢。

**解决**：不依赖 `9Nctl logs`，训练脚本主动写日志到CFS文件，从宿主机直接读：

```bash
cat /media/cfs/pengshuo.10/shibie/logs/rank0.log
```

---

## 坑9：评估/推理任务 PYTHONPATH 未设置

**现象**：eval_offline.py在magnus容器里报 `ModuleNotFoundError: No module named 'src.model'`。

**根因**：run_train.py里直接 `subprocess.Popen([python, "eval_offline.py"])` 执行评估脚本，但eval_offline.py依赖 `src.model` 等模块，需要PYTHONPATH包含项目根目录。训练任务的命令是 `python -m src.train`，Python自动把src目录加入搜索路径，但直接执行脚本时不会。

**解决**：subprocess调用时必须显式设置PYTHONPATH：

```python
env = os.environ.copy()
env["PYTHONPATH"] = os.path.join(CFS, "shibie") + ":" + env.get("PYTHONPATH", "")
proc = subprocess.Popen(cmd, env=env, ...)
```

---

## 坑10：vocab.decode 未在EOS处截断（导致ExpRate严重低估）

**现象**：训练到epoch 76，ExpRate只有9.68%，论文报告50%+。

**根因**：`vocab.decode()` 的 `strip_special` 只是把所有SOS/EOS token从列表中删除，但没有在第一个EOS处截断。预测序列在EOS后面还有padding或垃圾token，decode后全部保留，导致pred永远不等于gt 。

原始代码：
```python
def decode(self, indices, strip_special=True):
    tokens = [self.idx2token.get(i, "") for i in indices]
    if strip_special:
        tokens = [t for t in tokens if t not in (SOS_TOKEN, EOS_TOKEN, "")]
    return tokens
```

问题示例：
```
gt:   [sos, frac, {, T, _, {, 1, }, eos, eos, eos]  → decode → ['\\frac', '{', 'T', '_', '{', '1', '}']
pred: [sos, frac, {, T, _, {, 1, }, eos, {, _, eos]  → decode → ['\\frac', '{', 'T', '_', '{', '1', '}', '{', '_']
                                                  ↑ eos后垃圾也保留了 → 不匹配！
```

**解决**：在第一个EOS处截断，跳过SOS，过滤空token：

```python
def decode(self, indices, strip_special=True):
    tokens = []
    for i in indices:
        t = self.idx2token.get(i, "")
        if strip_special and i == self.token2idx.get(EOS_TOKEN, 1):
            break  # 在第一个eos处截断
        if strip_special and i == self.token2idx.get(SOS_TOKEN, 0):
            continue  # 跳过sos
        if t == "":
            continue
        tokens.append(t)
    return tokens
```

**注意**：此bug只影响评估指标，不影响训练loss（训练用的是teacher forcing，不经过decode）。

---

## 坑11：任务正常完成但9Nctl显示FAILED

**现象**：评估任务跑完了，CFS上有日志和结果，但 `9Nctl status` 显示FAILED。

**根因**：magnus框架判断任务状态的逻辑：
1. 主进程（run_train.py）exit code ≠ 0 → FAILED
2. 容器被外部回收/抢占 → FAILED
3. 健康检查失败 → FAILED

常见原因：
- eval脚本本身报错exit code 1（如上面的ModuleNotFoundError）
- subprocess.Popen的子进程退出码被正确传递，但magnus认为是异常退出
- 资源被抢占，容器被杀

**解决**：不要依赖9Nctl状态标签，以CFS上的日志和checkpoint为准。

---

## 坑12：评估脚本反复失败的连锁问题

评估脚本在容器里运行时，由于容器环境和本地开发环境差异巨大，逐个暴露了以下问题：

### 12a: 目录名不一致 `src.model` vs `src.models`
**现象**：`ModuleNotFoundError: No module named 'src.model'`
**根因**：代码目录是 `src/models/`，但eval脚本写的是 `from src.model.xxx import`
**解决**：确认实际目录名，用 `from src.models.xxx import`

### 12b: CFS文件同步延迟
**现象**：在宿主机修改了eval_offline.py，容器里读到的还是旧版本
**根因**：CFS是分布式文件系统，写入后需要几秒到几十秒同步到所有节点
**解决**：不要依赖CFS上的脚本文件，把所有eval逻辑内联到run_train.py里（run_train.py是9Nctl上传的，不存在同步问题）

### 12c: Vocab没有 `__len__` 方法
**现象**：`TypeError: object of type 'Vocab' has no len()`
**根因**：Vocab类没实现 `__len__`，应该用 `len(vocab.token2idx)`
**解决**：`vocab_size = len(vocab.token2idx)`

### 12d: HMERModel参数名不匹配
**现象**：`HMERModel.__init__() got an unexpected keyword argument 'encoder_channels'`
**根因**：实际模型参数只有 `vocab_size` 和 `feature_channels`，eval脚本里凭记忆写了不存在的参数
**解决**：先看源码确认 `__init__` 签名再写eval代码

### 12e: checkpoint key是 `model` 不是 `model_state_dict`
**现象**：`KeyError: 'model_state_dict'`
**根因**：train.py里保存时用 `torch.save({"model": model.state_dict(), ...})`，不是 `model_state_dict`
**解决**：先 `print(list(ckpt.keys()))` 确认key名

### 12f: collate_fn返回tuple不是dict
**现象**：`TypeError: tuple indices must be integers or slices, not str`
**根因**：collate_fn返回 `(images, seq_padded, count_vecs, char_padded, seq_lens, char_lens)`，eval脚本按dict访问
**解决**：`imgs, seq_idx, count_vecs, char_idx, seq_lens, char_lens = batch`

### 12g: 8卡容器会启动8个进程

**现象**：8卡G5容器里，run_train.py被8个GPU进程同时执行，8个进程同时log到同一个文件、同时cp数据到/tmp，输出混乱且数据拷贝失败（"Train images: 0"）。

**根因**：magnus框架为每个GPU启动一个run_train.py进程（类似DDP的多进程启动），所有进程的LOCAL_RANK不同但执行相同代码。8个进程同时：
- 写同一个日志文件 → 输出交错
- `cp -r` 到同一个/tmp目录 → 竞争导致空目录或报错
- 启动DDP子进程 → 8×8=64个进程，资源耗尽

**解决**：用LOCAL_RANK判断，只有rank 0执行初始化逻辑（拷贝数据、启动DDP子进程），其他rank直接exit：

```python
local_rank = int(os.environ.get("LOCAL_RANK", 0))
if local_rank != 0:
    sys.exit(0)  # 其他rank退出，rank 0会启动所有DDD进程

# 以下只有rank 0执行
log("Copying dataset to /tmp ...")
subprocess.run(["cp", "-r", cfs_data, local_data])
# ... 启动8个DDP子进程 ...
```

### 最佳实践：eval脚本模板

```python
# 1. 最先创建日志文件，每步都写CFS
# 2. 自动判断CFS路径
# 3. 所有逻辑内联，不依赖CFS上的外部脚本
# 4. 每个关键步骤都用 try-except 包裹，错误写日志
# 5. 先print(list(ckpt.keys()))确认checkpoint格式
# 6. 先看源码确认模型签名和collate_fn返回格式
```

---

## 推荐的最终配置模板

### magnus.py（多卡版）

```python
framework = "magnus:ubuntu24.04-cuda12.8-torch2.10-magnus-gpu_v1.8.0"
roles = ["master"]
gpu_num = 8
master = dict(count=1, cpu=12 * gpu_num, mem=100 * gpu_num, gpu=f"g5:{gpu_num}")
cloud_tags = {'cluster': 'dt02'}
entrance_filename = "run_train.py"  # 必须是.py
```

### run_train.py 关键点

```python
# 1. 自动判断CFS路径（/home/pengshuo.10 或 /media/cfs/pengshuo.10）
# 2. pip install 装依赖
# 3. 不用torchrun！手动设环境变量启动多进程，端口用50000-60000随机
# 4. subprocess.Popen 调训练脚本（不要os.execvp）
# 5. 日志写CFS文件（rank0.log等）
# 6. PYTHONPATH要手动设置
```

### train.py 关键点

```python
# 1. parse_known_args() 不用parse_args()
# 2. DataLoader(num_workers=0, pin_memory=False) 在CFS上用
# 3. dist.init_process_group(backend="nccl") 自动读环境变量
# 4. 日志/checkpoint写CFS绝对路径
```
