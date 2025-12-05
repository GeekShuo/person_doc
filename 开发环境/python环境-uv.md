## Installation


Install uv with our standalone installers:

```bash
# On macOS and Linux.
curl -LsSf https://astral.sh/uv/install.sh | sh
```

```bash
# On Windows.
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Or, from [PyPI](https://pypi.org/project/uv/):

```bash
# With pip.
pip install uv
```

```bash
# Or pipx.
pipx install uv
```

If installed via the standalone installer, uv can update itself to the latest version:

```bash
uv self update
```

See the [installation documentation](https://docs.astral.sh/uv/getting-started/installation/) for
details and alternative installation methods.

## Documentation

uv's documentation is available at [docs.astral.sh/uv](https://docs.astral.sh/uv).

Additionally, the command line reference documentation can be viewed with `uv help`. 

## Features

### Projects

Uv管理项目依赖项和环境，支持锁文件、工作区等。  类似于 `rye` or `poetry`:

```console
$ uv init example
Initialized project `example` at `/home/user/example`

$ cd example

$ uv add ruff
Creating virtual environment at: .venv
Resolved 2 packages in 170ms
   Built example @ file:///home/user/example
Prepared 2 packages in 627ms
Installed 2 packages in 1ms
 + example==0.1.0 (from file:///home/user/example)
 + ruff==0.5.0

$ uv run ruff check
All checks passed!

$ uv lock  # 只更新 lock 文件，不安装
Resolved 2 packages in 0.33ms

$ uv sync  # 同步依赖到虚拟环境并更新 uv.lock
Resolved 2 packages in 0.70ms
Audited 1 package in 0.02ms

 # 检查依赖是否有冲突
  uv check

  # 查看依赖树
  uv tree
```

See the [project documentation](https://docs.astral.sh/uv/guides/projects/) to get started.

uv also supports building and publishing projects, even if they're not managed with uv. See the
[publish guide](https://docs.astral.sh/uv/guides/publish/) to learn more.

### 导入现有依赖
```
uv add -r requirements.txt 导入到pyproject.toml
uv sync  
运行一个现有仓库，用这个命令安装依赖，根据现有pyproject安装库，如果是第一次运行 uv sync，且还没有 uv.lock 文件，uv 会解析 pyproject.toml 自动生成 uv.lock 文件用于锁定依赖版本。 
```
### 管理依赖
```
uv add pandas airtest
uv remove 
uv pip list
uv pip freeze > requirements.txt


使用 uv 同步 pyproject.toml 的更新到 uv.lock 和生成 requirements.txt 文件，有以下几种方法：

  1. 同步到 uv.lock

  # 更新 lock 文件以匹配 pyproject.toml
  uv sync

  或者：

  # 重新生成 lock 文件
  uv lock

  2. 生成 requirements.txt

  # 生成 requirements.txt 文件
  uv pip compile pyproject.toml -o requirements.txt

  3. 一次性完成所有操作
```
### Scripts

Uv管理单文件脚本的依赖关系和环境。  

创建一个新脚本，并添加内联元数据来声明它的依赖关系

```console
$ echo 'import requests; print(requests.get("https://astral.sh"))' > example.py

$ uv add --script example.py requests
Updated `example.py`
```
然后，在隔离的虚拟环境中运行该脚本：

```console
$ uv run example.py
Reading inline script metadata from: example.py
Installed 5 packages in 12ms
<Response [200]>
```

See the [scripts documentation](https://docs.astral.sh/uv/guides/scripts/) to get started.

### Tools

uv执行和安装Python包提供的命令行工具，类似于‘ pipx ’。  

使用‘ uvx ’ （‘ uv tool Run ’的别名）在临时环境中运行一个工具：

```console
$ uvx pycowsay 'hello world!'
Resolved 1 package in 167ms
Installed 1 package in 9ms
 + pycowsay==0.0.0.2
  """

  ------------
< hello world! >
  ------------
   \   ^__^
    \  (oo)\_______
       (__)\       )\/\
           ||----w |
           ||     ||
```

Install a tool with `uv tool install`:

```console
$ uv tool install ruff
Resolved 1 package in 6ms
Installed 1 package in 2ms
 + ruff==0.5.0
Installed 1 executable: ruff

$ ruff --version
ruff 0.5.0
```

See the [tools documentation](https://docs.astral.sh/uv/guides/tools/) to get started.

### Python versions

uv installs Python and allows quickly switching between versions.

Install multiple Python versions:

```console
$ uv python install 3.10 3.11 3.12
Searching for Python versions matching: Python 3.10
Searching for Python versions matching: Python 3.11
Searching for Python versions matching: Python 3.12
Installed 3 versions in 3.42s
 + cpython-3.10.14-macos-aarch64-none
 + cpython-3.11.9-macos-aarch64-none
 + cpython-3.12.4-macos-aarch64-none
```

Download Python versions as needed:

```console
$ uv venv --python 3.12.0
Using Python 3.12.0
Creating virtual environment at: .venv
Activate with: source .venv/bin/activate

$ uv run --python pypy@3.8 -- python --version
Python 3.8.16 (a9dbdca6fc3286b0addd2240f11d97d8e8de187a, Dec 29 2022, 11:45:30)
[PyPy 7.3.11 with GCC Apple LLVM 13.1.6 (clang-1316.0.21.2.5)] on darwin
Type "help", "copyright", "credits" or "license" for more information.
>>>>
```

Use a specific Python version in the current directory:

```console
$ uv python pin 3.11
Pinned `.python-version` to `3.11`
```

See the [Python installation documentation](https://docs.astral.sh/uv/guides/install-python/) to get
started.

### The pip interface

uv provides a drop-in replacement for common `pip`, `pip-tools`, and `virtualenv` commands.

uv extends their interfaces with advanced features, such as dependency version overrides,
platform-independent resolutions, reproducible resolutions, alternative resolution strategies, and
more.

Migrate to uv without changing your existing workflows — and experience a 10-100x speedup — with the
`uv pip` interface.

Compile requirements into a platform-independent requirements file:

```console
$ uv pip compile docs/requirements.in \
   --universal \
   --output-file docs/requirements.txt
Resolved 43 packages in 12ms
```

Create a virtual environment:

```console
$ uv venv
Using Python 3.12.3
Creating virtual environment at: .venv
Activate with: source .venv/bin/activate
```

Install the locked requirements:

```console
$ uv pip sync docs/requirements.txt
Resolved 43 packages in 11ms
Installed 43 packages in 208ms
 + babel==2.15.0
 + black==24.4.2
 + certifi==2024.7.4
 ...
```

See the [pip interface documentation](https://docs.astral.sh/uv/pip/index/) to get started.

### 配置镜像源或者私有化仓库
#### 1. 配置文件基础结构

在项目的`pyproject.toml`中，通过`[[tool.uv.index]]`数组定义多个仓库：
```
# 私有仓库优先
[[tool.uv.index]]
name = "company-internal"
url = "https://pypi.company.com/simple"
explicit = false  # 允许隐式使用

# 公共镜像源次之
[[tool.uv.index]]
name = "tuna-mirror"
url = "https://pypi.tuna.tsinghua.edu.cn/simple"

# 不指定default=true时，PyPI仍为默认仓库

```
**关键机制**：uv按定义顺序搜索仓库，首个找到目标包的仓库将被使用。默认包含PyPI，除非被其他仓库的`default=true`替换。
#### 2. 命令行覆盖与环境变量

临时测试仓库配置可通过命令行参数：
```
# 添加临时仓库（优先级最高）
uv add requests --index company-internal=https://pypi.company.com/simple
 
# 设置默认仓库（替换PyPI）
uv install --default-index https://mirror.example.com/simple

环境变量方式适合CI/CD场景：

# 为指定仓库设置认证
export UV_INDEX_COMPANY_INTERNAL_USERNAME=robot
export UV_INDEX_COMPANY_INTERNAL_PASSWORD=token-xxx
 
# 添加额外仓库
export UV_INDEX=mirror=https://pypi.mirrors.com/simple

```

uv缓存文件满了怎么办？
export UV_CACHE_DIR=/home/admin/wangsongsong1/pengshuo/uvcache
source ~/.bashrc


#### 为什么 uv.lock 这么多包？

 

  1. 传递依赖（Transitive Dependencies）：
    - 你只需要 6 个包，但这些包依赖其他包
    - 例如：scikit-learn 依赖 numpy, scipy, joblib, threadpoolctl
    - 例如：requests 依赖 certifi, charset_normalizer, idna, urllib3
  2. 依赖的依赖：
    - numpy 又依赖其他包
    - scipy 又依赖更多包
    - 形成一个依赖树
  3. 具体例子：
  你的依赖：scikit-learn
  ├── numpy (科学计算库)
  │   └── 各种底层数学库
  ├── scipy (科学计算)
  │   └── 更多数学和统计库
  ├── joblib (并行处理)
  └── threadpoolctl (线程池控制)

  你的依赖：requests
  ├── certifi (SSL证书)
  ├── charset_normalizer (字符编码)
  ├── idna (域名编码)
  └── urllib3 (HTTP底层库)
  4. 为什么需要 lock 文件：
    - 确保所有人使用相同版本的依赖
    - 确保生产环境和开发环境一致
    - 防止依赖冲突

  这是现代 Python 开发的正常现象。你直接依赖的包很少，但它们需要很多底层支持包才能工作。
 
#### uv 的缓存目录结构
  
  每个子目录都有不同的作用：

  缓存目录说明

  - archive-v0 - 存储原始的包归档文件（如 .tar.gz, .zip）
  - builds-v0 - 存储构建过程中的临时文件和编译结果
  - CACHEDIR.TAG - 标识这是一个缓存目录，用于备份工具识别
  - interpreter-v4 - 缓存 Python 解释器版本信息
  - sdists-v9 - 存储源码分发包（source distributions）
  - simple-v18 - 存储包索引信息的简单缓存
  - wheels-v5 - 存储预编译的二进制包（wheels）

  工作流程

  当 uv 安装包时：

  1. 从 simple-v18 获取包索引信息
  2. 优先从 wheels-v5 获取预编译包（最快）
  3. 如果没有 wheel，从 sdists-v9 获取源码包
  4. 必要时从 archive-v0 下载原始归档
  5. 在 builds-v0 中进行编译构建
  6. 使用 interpreter-v4 确保 Python 版本兼容   
