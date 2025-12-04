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

uv manages project dependencies and environments, with support for lockfiles, workspaces, and more,
similar to `rye` or `poetry`:

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

$ uv lock
Resolved 2 packages in 0.33ms

$ uv sync
Resolved 2 packages in 0.70ms
Audited 1 package in 0.02ms
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