
## 环境信息
服务器装hermes流程 1. 上传代码，或者把我目录下上传好的复制过去 2.配置安装环境和镜像 echo "deb http://mirrors.jd.com/ubuntu/ jammy main restricted universe multiverse" > /tmp/jd.listpip config set global.index-url https://mirrors.jd.com/pypi/simple 3.安装python和uv apt update && apt install -y python3.11 python3.11-venv && pip install uv 4.uv 配置镜像源mkdir -p ~/.config/uv && echo '[[index]] name = "mirror" url = "https://mirrors.jd.com/pypi/simple" default = true' > ~/.config/uv/uv.toml 5.uv创建环境安装项目 uv venv venv --python python3.11 && source venv/bin/activate && uv pip install -e . 6.启动配置hermes

遇到几个问题

1.重新启动后历史和记忆配置文件丢失

设置HERMES_HOME为项目目录

2.只能开一个hermes，开别的卡住

hermes 启动时会打开 `state.db`（SQLite WAL 模式），需要获取文件锁。让hermes改下

3.装python3.11装不来

|项目|值|
|---|---|
|OS|CentOS 7, GLIBC 2.17|
|GPU|NVIDIA B200 (sm_100), CUDA Driver 13.0|
|共享存储|/media/cfs/pengshuo.10/ (ChubaoFS, 206G)|
|Conda|/opt/conda (23.1.0)|
|Hermes 项目|/media/cfs/pengshuo.10/hermes-agent/ (git main 分支)|
|用户|pengshuo.10|

---

## 第一步：配置 Pip 镜像

py311 conda 环境里的 pip 读的是 PYTHONUSERBASE 下的 pip 配置文件， 但由于 conda 环境的 pip 优先读 `~/.config/pip/pip.conf`，两个都配一下：

```bash
# 方式1：用户级 pip 配置（推荐，conda 环境也能读到）
mkdir -p ~/.config/pip
cat > ~/.config/pip/pip.conf << 'EOF'
[global]
index-url = https://mirrors.jd.com/pypi/simple
EOF

# 方式2：PYTHONUSERBASE 下的 pip 配置（当前环境在用的）
# 这个是 .bashrc 中 PYTHONUSERBASE 生效后 pip 自动读的
cat > /media/cfs/pengshuo.10/.pylib/pip3.conf << 'EOF'
[global]
index-url=http://mirrors.jd.com/pypi/web/simple
find-links =
    http://easyalgo.jd.com/downloads/client
[install]
trusted-host=mirrors.jd.com easyalgo.jd.com
prefix=/media/cfs/pengshuo.10/.pylib
[search]
index=http://mirrors.jd.com/pypi/pypi
EOF
```

**注意**: 如果你用 conda 环境 `pip install`，包会装到 conda 环境自己的 site-packages 里， 不会走 PYTHONUSERBASE 的 prefix。方式1 足够。

---

## 第二步：配置 Conda 镜像

```bash
# 用户级 conda 配置（覆盖系统级 /opt/conda/.condarc）
cat > ~/.condarc << 'EOF'
channels:
  - http://mirrors.jd.com/anaconda/cloud/conda-forge/
  - http://mirrors.jd.com/anaconda/pkgs/main/
  - http://mirrors.jd.com/anaconda/pkgs/free/
  - http://mirrors.jd.com/anaconda/pkgs/r/
show_channel_urls: true
ssl_verify: false
EOF
```

系统级 `/opt/conda/.condarc` 已经配好了京东镜像（含 custom_channels 映射）， 一般不用改。如果需要改，内容如下：

```yaml
channels:
  - defaults
show_channel_urls: true
default_channels:
  - http://mirrors.jd.com/anaconda/pkgs/main
  - http://mirrors.jd.com/anaconda/pkgs/r
  - http://mirrors.jd.com/anaconda/pkgs/msys2
custom_channels:
  conda-forge: http://mirrors.jd.com/anaconda/cloud
  msys2: http://mirrors.jd.com/anaconda/cloud
  bioconda: http://mirrors.jd.com/anaconda/cloud
  menpo: http://mirrors.jd.com/anaconda/cloud
  pytorch: http://mirrors.jd.com/anaconda/cloud
  pytorch-lts: http://mirrors.jd.com/anaconda/cloud
  simpleitk: http://mirrors.jd.com/anaconda/cloud
auto_activate_base: false
use_only_tar_bz2: false
envs_dirs:
  - /home/$NB_USER/venvs
```

`envs_dirs` 设置让 conda 环境建在 `~/venvs/` 下而不是 `/opt/conda/envs/`， 这样环境在共享存储上，换了机器也能用。

---

## 第三步：配置 .bashrc

```bash
# 追加到 ~/.bashrc 末尾（不要覆盖已有内容）

# Conda
export PATH=/opt/conda/bin:$PATH
source activate base

# Python user packages（共享存储，跨机器可用）
export PYTHONUSERBASE=/media/cfs/pengshuo.10/.pylib
export PATH=/media/cfs/pengshuo.10/.pylib/bin:$PATH
```

然后 `source ~/.bashrc` 生效。

---

## 第四步：创建 Conda Python 3.11 环境

```bash
conda create -n py311 python=3.11 -y
```

创建完成后环境在 `/home/pengshuo.10/venvs/py311/`，Python 3.11.15（来自 conda-forge）。

激活环境：

```bash
conda activate py311
```

验证：

```bash
which python   # 应输出 /home/pengshuo.10/venvs/py311/bin/python
python --version  # 应输出 Python 3.11.15
```

---

## 第五步：拉取 Hermes 项目

如果共享存储上已有项目（/media/cfs/pengshuo.10/hermes-agent/），可以跳过。

```bash
cd /media/cfs/pengshuo.10/
git clone https://github.com/NousResearch/hermes-agent.git
cd hermes-agent
```

**注意**: 京东云内网无法访问 GitHub，需要从外部上传或用内网 Git 镜像。 当前项目在 main 分支，最新 commit: `1acf81fd`。

---

## 第六步：安装 Hermes 依赖

确保在 py311 环境中：

```bash
conda activate py311
cd /media/cfs/pengshuo.10/hermes-agent/
```

方式1：用 requirements.txt（推荐，简单直接）：

```bash
pip install -r requirements.txt
```

方式2：手动装核心依赖：

```bash
# 核心
pip install openai python-dotenv fire "httpx[socks]" rich tenacity prompt_toolkit \
    pyyaml requests jinja2 "pydantic>=2.0" "PyJWT[crypto]" debugpy

# Web 工具
pip install firecrawl-py "parallel-web>=0.4.2"

# 图像生成
pip install fal-client

# TTS
pip install edge-tts

# 定时任务
pip install croniter

# 消息平台（网关用，不需要可以不装）
pip install "python-telegram-bot[webhooks]>=22.6" "discord.py>=2.0" "aiohttp>=3.9.0"
```

**Hermes 不需要 pip install -e .**，直接从源码目录运行即可。

---

## 第七步：配置 Hermes

配置目录 `~/.hermes/` 在首次运行时自动创建。

### config.yaml

```bash
mkdir -p ~/.hermes
cat > ~/.hermes/config.yaml << 'EOF'
model:
  default: glm-5.1-fp8
  provider: custom
  base_url: http://inference-jdaip-inner-cn-east-1.jdcloud.com/queue-5fa2da786abbb1d94c888599b9e737a1/api/predict/coding-v6/v1
  api_key: <换成你的key>
providers: {}

# 京东云内网无法访问外网：关闭远程模型目录，避免启动或 /model 时等待外网超时。
model_catalog:
  enabled: false

# 京东云内网启动加速：禁用用不到的外网插件后端。
# 如后续需要 web/browser/image/video/spotify/平台插件，删掉对应项后重启 Hermes。
plugins:
  disabled:
    - browser/browser_use
    - browser/browserbase
    - browser/firecrawl
    - image_gen/openai
    - image_gen/openai-codex
    - image_gen/xai
    - video_gen/fal
    - video_gen/xai
    - web/brave_free
    - web/ddgs
    - web/exa
    - web/firecrawl
    - web/parallel
    - web/searxng
    - web/tavily
    - web/xai
    - google_chat-platform
    - irc-platform
    - line-platform
    - simplex-platform
    - spotify
    - teams-platform

fallback_providers: []
credential_pool_strategies: {}
toolsets:
  - hermes-cli
agent:
  max_turns: 90
  gateway_timeout: 1800
  restart_drain_timeout: 60
  service_tier: ''
  tool_use_enforcement: auto
  gateway_timeout_warning: 900
  gateway_notify_interval: 600
terminal:
  backend: local
  modal_mode: auto
  cwd: .
  timeout: 180
  persistent_shell: true
browser:
  inactivity_timeout: 120
  command_timeout: 30
  record_sessions: false
  allow_private_urls: false
  camofox:
    managed_persistence: false
checkpoints:
  enabled: true
  max_snapshots: 50
compression:
  enabled: true
  threshold: 0.5
  target_ratio: 0.2
  protect_last_n: 20
EOF
```

### .env

```bash
cat > ~/.hermes/.env << 'EOF'
HERMES_MAX_ITERATIONS=90
EOF
```

---

## 第八步：启动 Hermes

```bash
conda activate py311
cd /media/cfs/pengshuo.10/hermes-agent/
python3 ./hermes
```

`./hermes` 是项目根目录的启动脚本，内容为：

```python
#!/usr/bin/env python3
if __name__ == "__main__":
    from hermes_cli.main import main
    main()
```

---

## 一键复现脚本

在新机器上从零搭建，复制粘贴执行即可：

```bash
#!/bin/bash
set -e

echo "=== 1. 配置 pip 镜像 ==="
mkdir -p ~/.config/pip
cat > ~/.config/pip/pip.conf << 'EOF'
[global]
index-url = https://mirrors.jd.com/pypi/simple
EOF

echo "=== 2. 配置 conda 镜像 ==="
cat > ~/.condarc << 'EOF'
channels:
  - http://mirrors.jd.com/anaconda/cloud/conda-forge/
  - http://mirrors.jd.com/anaconda/pkgs/main/
  - http://mirrors.jd.com/anaconda/pkgs/free/
  - http://mirrors.jd.com/anaconda/pkgs/r/
show_channel_urls: true
ssl_verify: false
EOF

echo "=== 3. 配置 .bashrc ==="
grep -q 'PYTHONUSERBASE' ~/.bashrc || cat >> ~/.bashrc << 'BASHEOF'
export PATH=/opt/conda/bin:$PATH
source activate base
export PYTHONUSERBASE=/media/cfs/pengshuo.10/.pylib
export PATH=/media/cfs/pengshuo.10/.pylib/bin:$PATH
BASHEOF
source ~/.bashrc

echo "=== 4. 创建 py311 conda 环境 ==="
conda create -n py311 python=3.11 -y

echo "=== 5. 安装 hermes 依赖 ==="
conda activate py311
pip install -r /media/cfs/pengshuo.10/hermes-agent/requirements.txt

echo "=== 6. 配置 hermes ==="
mkdir -p ~/.hermes
cat > ~/.hermes/.env << 'EOF'
HERMES_MAX_ITERATIONS=90
EOF

echo "=== 完成! 启动命令: ==="
echo "conda activate py311 && cd /media/cfs/pengshuo.10/hermes-agent/ && python3 ./hermes"
```

---

## 附录：gpu_stress 编译与使用

gpu_stress 是一个 CUDA 小工具，用于占用 GPU 显存和算力，防止其他进程抢 GPU。 在多用户共享 GPU 的环境下，先跑 gpu_stress 可以"占住"卡。

### 源码

文件位置：`~/gpu_stress.cu`

```cuda
#include <stdio.h>
#include <stdlib.h>

__global__ void burn_kernel(float *a, float *b, float *c, int n) {
    int idx = blockIdx.x * blockDim.x + threadIdx.x;
    if (idx < n) {
        c[idx] = a[idx] * b[idx] + c[idx];
    }
}

int main(int argc, char *argv[]) {
    int device = 0;
    if (argc > 1) device = atoi(argv[1]);
    cudaSetDevice(device);

    // 先占显存：分配大块但不参与计算
    int n_compute = 10000000; // 10M floats = 40MB per buffer
    int n_alloc = 170;        // 分配170G左右的大块占显存

    size_t big_size = 1073741824ULL; // 1GB per block
    void *dummy[200];
    int dummy_count = 0;
    for (int i = 0; i < n_alloc; i++) {
        if (cudaMalloc(&dummy[i], big_size) != cudaSuccess) break;
        cudaMemset(dummy[i], 0, big_size);
        dummy_count++;
    }
    printf("占显存: %d GB\n", dummy_count);

    // 计算用的缓冲区
    size_t buf_size = n_compute * sizeof(float);
    float *a, *b, *c;
    cudaMalloc(&a, buf_size);
    cudaMalloc(&b, buf_size);
    cudaMalloc(&c, buf_size);
    cudaMemset(a, 1, buf_size);
    cudaMemset(b, 1, buf_size);
    cudaMemset(c, 0, buf_size);

    int threads = 256;
    int blocks = (n_compute + threads - 1) / threads;

    // 创建多个stream并行提交kernel
    int n_streams = 32;
    cudaStream_t streams[n_streams];
    for (int i = 0; i < n_streams; i++) {
        cudaStreamCreate(&streams[i]);
    }

    printf("GPU %d stress running (32 streams)... Ctrl+C to stop\n", device);

    while (1) {
        for (int i = 0; i < n_streams; i++) {
            burn_kernel<<<blocks, threads, 0, streams[i]>>>(a, b, c, n_compute);
        }
    }

    return 0;
}
```

### 编译

需要 nvcc（CUDA Toolkit 自带），当前环境是 CUDA 12.2：

```bash
nvcc -o ~/gpu_stress ~/gpu_stress.cu -arch=sm_100
```

- `-arch=sm_100` 对应 B200 GPU。如果是其他 GPU，改成对应的 sm 版本：
    - A100: `sm_80`
    - H100: `sm_90`
    - B200: `sm_100`
- 可用 `nvidia-smi --query-gpu=compute_cap --format=csv` 查看当前 GPU 的 compute capability

### 使用

```bash
# 占 GPU 0（默认）
nohup ~/gpu_stress > ~/gpu_stress.log 2>&1 &

# 占指定 GPU
nohup ~/gpu_stress 1 > ~/gpu_stress.log 2>&1 &

# 停止
kill $(pgrep gpu_stress)
# 如果 kill 不掉（被自动重启），用 kill -9
kill -9 $(pgrep gpu_stress)
```

### 注意

- gpu_stress 进程可能被系统自动重启（crontab 或 supervisor），需要反复 kill
- 用 `nvidia-smi` 确认显存已释放后再启动其他 GPU 任务
- 编译时的 `-arch` 必须匹配目标 GPU，否则运行时会报 `no kernel image` 错误

---

## 已知问题

1. **torch 2.6.0 + B200 GPU 不兼容**: B200 是 sm_100，需要 PyTorch 2.7+cu126。 torch 2.6+cu124 的 kernel 不兼容 B200，会报 `CUDA error: no kernel image`。 不需要本地 GPU 推理可以不装 torch。
    
2. **GLIBC 2.17 限制**: CentOS 7 的 glibc 太旧，PyTorch wheel 必须是 manylinux1 （兼容 manylinux_2_17），不能用 manylinux_2_28。
    
3. **九数试衣 API 后端不稳**: embedding 服务 (11.87.191.100:18003) 挂掉时 API 返回 502。
    
4. **curl 大 base64 图片**: `Argument list too long`，需写 JSON 文件再 `curl -d @file`。
    
5. **GitHub 不可达**: 京东云内网无法访问外网，hermes-agent 项目需要提前放到共享存储上。
    

---

## 当前 py311 环境完整依赖清单 (pip freeze)

```
aiohappyeyeballs==2.6.1
aiohttp==3.13.5
aiosignal==1.4.0
annotated-types==0.7.0
anyio==4.13.0
attrs==26.1.0
certifi==2026.4.22
cffi==2.0.0
charset-normalizer==3.4.7
croniter==6.2.2
cryptography==47.0.0
debugpy==1.8.20
discord.py==2.7.1
distro==1.9.0
edge-tts==7.2.8
fal_client==0.14.1
filelock==3.29.0
fire==0.7.1
firecrawl-py==4.23.0
frozenlist==1.8.0
fsspec==2026.3.0
h11==0.16.0
httpcore==1.0.9
httpx==0.28.1
httpx-sse==0.4.3
idna==3.13
Jinja2==3.1.6
jiter==0.14.0
markdown-it-py==4.0.0
MarkupSafe==3.0.3
mdurl==0.1.2
mpmath==1.3.0
msgpack==1.1.2
multidict==6.7.1
nest-asyncio==1.6.0
networkx==3.6.1
nvidia-cublas-cu12==12.4.5.8
nvidia-cuda-cupti-cu12==12.4.127
nvidia-cuda-nvrtc-cu12==12.4.127
nvidia-cuda-runtime-cu12==12.4.127
nvidia-cudnn-cu12==9.1.0.70
nvidia-cufft-cu12==11.2.1.3
nvidia-curand-cu12==10.3.5.147
nvidia-cusolver-cu12==11.6.1.9
nvidia-cusparse-cu12==12.3.1.170
nvidia-cusparselt-cu12==0.6.2
nvidia-nccl-cu12==2.21.5
nvidia-nvjitlink-cu12==12.4.127
nvidia-nvtx-cu12==12.4.127
openai==2.32.0
parallel-web==0.5.1
prompt_toolkit==3.0.52
propcache==0.4.1
pycparser==3.0
pydantic==2.13.3
pydantic_core==2.46.3
Pygments==2.20.0
PyJWT==2.12.1
python-dateutil==2.9.0.post0
python-dotenv==1.2.2
python-telegram-bot==22.7
PyYAML==6.0.3
requests==2.33.1
rich==15.0.0
six==1.17.0
sniffio==1.3.0
sympy==1.13.1
tabulate==0.10.0
tenacity==9.1.4
termcolor==3.3.0
torch==2.6.0
tornado==6.5.5
tqdm==4.67.3
triton==3.2.0
typing-inspection==0.4.2
typing_extensions==4.15.0
urllib3==2.6.3
uv==0.11.8
wcwidth==0.6.0
websockets==16.0
yarl==1.23.0
```