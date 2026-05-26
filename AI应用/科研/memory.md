运行环境：京东云内网。只能访问京东内部网站，无法访问外网。永远不要尝试访问外部网站。外部资源让用户上传。Python包使用镜像源安装。环境管理用 uv/conda。
Hermes启动：conda activate py311 && cd ~/hermes-agent/ && python3 ./hermes（源码直跑，非pip install）。py311环境在~/venvs/py311/，Python 3.11.15，conda镜像mirrors.jd.com，pip镜像mirrors.jd.com/pypi/simple。搭建指南hermes-setup-guide.md
9Nctl magnus：所有GPU训练/推理统一走9Nctl提交，队列cvfa-aigc-x2v，卡型g5(B200)，不在notebook本地跑GPU。容器CFS挂/home/pengshuo.10/(非/root/)。坑:1)expanduser("~")返回/root用os.getcwd();2)SDK变量格式;3)entrance必.py;4)CFS py实时生效但入口在tar;5)本地生成数据放CFS避免OOM
京东云notebook端口代理：JupyterLab URL的`/lab/tree/...`替换为`/proxy/{port}/`