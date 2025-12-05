Q1 :包、模块的差别
例如 项目依赖文件写的是python-dateutil 导入的时候是dateutil
这是 Python 包管理的常见情况。包名（在 pyproject.toml 中）和导入名（在代码中）不一样的原因：
```
  1. 包名 vs 模块名 vs 方法名

  包名（PyPI 包名）：用于 pip install 和在 pyproject.toml 中声明
  "python-dateutil>=2.8.0"

  导入名（模块名）：用于在 Python 代码中 import
  from dateutil.tz import tzutc, gettz  # 导入名是 `dateutil`
  
包名pip使用 模块名 代码使用
  
可以用这个命令查看包的实际信息：

⏺ Bash(python -c "import dateutil; print(dateutil.__file__)")
  ⎿  /opt/miniconda3/lib/python3.13/site-packages/dateutil/__init__.py

⏺ 或者查看包的元数据：

⏺ Bash(python -c "import pkg_resources; print(pkg_resources.get_distribution('python-dateutil'))")
  ⎿  python-dateutil 2.9.0.post0                                                                                                       
     <string>:1: DeprecationWarning: pkg_resources is deprecated as an API. See https://setuptools.pypa.io/en/latest/pkg_resources.html

为什么会这样？

  1. 历史原因：有些包在创建时命名不统一
  2. 避免冲突：包名可能被占用，使用不同的导入名
  3. 品牌标识：包名包含品牌或描述性词汇（如 python- 前缀）
  4. 可读性：包名更适合搜索，导入名更适合编码
```
导入规则
```python

  1. 模块导入规则

  文件名 → 模块名

  # 文件名：my_module.py
  # 导入方式：
  import my_module
  from my_module import function_name

  目录名 → 包名

  # 目录结构：
  # my_package/
  #     __init__.py
  #     utils.py
  #     subpackage/
  #         __init__.py
  #         other.py

  # 导入方式：
  import my_package
  from my_package import utils
  import my_package.subpackage
  from my_package.subpackage import other
  
  
    模块名必须符合 Python 标识符规则：
  - 只能包含：字母（a-z, A-Z）、数字（0-9）、下划线（_）
  - 不能以数字开头
  - 区分大小写
  - 不能是 Python 关键字
```