Q1 :包、模块的差别
例如 项目依赖文件写的是python-dateutil 导入的时候是dateutil
这是 Python 包管理的常见情况。包名（在 pyproject.toml 中）和导入名（在代码中）不一样的原因：
```
  1. 包名 vs 模块名 vs 方法名

  包名（PyPI 包名）：用于 pip install 和在 pyproject.toml 中声明
  "python-dateutil>=2.8.0"

  导入名（模块名）：用于在 Python 代码中 import
  from dateutil.tz import tzutc, gettz  # 导入名是 `dateutil`
  
可以用这个命令查看包的实际信息：

⏺ Bash(python -c "import dateutil; print(dateutil.__file__)")
  ⎿  /opt/miniconda3/lib/python3.13/site-packages/dateutil/__init__.py

⏺ 或者查看包的元数据：

⏺ Bash(python -c "import pkg_resources; print(pkg_resources.get_distribution('python-dateutil'))")
  ⎿  python-dateutil 2.9.0.post0                                                                                                       
     <string>:1: DeprecationWarning: pkg_resources is deprecated as an API. See https://setuptools.pypa.io/en/latest/pkg_resources.html
```
