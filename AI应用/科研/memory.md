运行环境：京东云内网。只能访问京东内部网站，无法访问外网。永远不要尝试访问外部网站。外部资源让用户上传。Python包使用镜像源安装。环境管理用 uv/conda。
§
ML训练陷阱:1)eval必须targets=None自回归;2)⭐Noam scheduler bug:d_model^-0.5/args.lr使peak偏离125倍→必须per-step+peak=args.lr;3)单batch overfit是分水岭:能=超参问题,不能=代码bug;4)val loss低≠ExpRate高;5)更深decoder+低lr最稳(4层3e-4>2层1e-3)
§
Hermes启动：conda activate py311 && cd /media/cfs/pengshuo.10/hermes-agent/ && python3 ./hermes（源码直跑，非pip install）。py311环境在~/venvs/py311/，Python 3.11.15，conda镜像mirrors.jd.com，pip镜像mirrors.jd.com/pypi/simple。搭建指南：/home/pengshuo.10/hermes-setup-guide.md
§
9Nctl magnus：所有GPU训练/推理统一走9Nctl提交，队列cvfa-aigc-x2v，卡型g5(B200)，不在notebook本地跑GPU。容器CFS挂/home/pengshuo.10/(非/root/)。坑:1)expanduser("~")返回/root用os.getcwd();2)SDK变量格式;3)entrance必.py;4)CFS py实时生效但入口在tar;5)torch.load weights_only=True拒numpy用False;6)DeepCNN forward期望NHWC[B,N,N,3];7)本地生成数据放CFS避免OOM
§
京东云notebook端口代理：JupyterLab URL的`/lab/tree/...`替换为`/proxy/{port}/`。泛化性评估：不管新旧数据集类别数是否相同都需重新训fc(linear probing)，只有同任务同类别才可直接eval。
§
OCR评测(~/ocr/)：看图用`python3 ~/ocr/gemini_vision.py <图> <问>`替代vision_analyze(幻觉严重)。京东云AI：`http://ai-api.jdcloud.com/v1/responses`, key=`pk-a64f5ad7-76b8-400a-ab2a-48a643bc6a23`。
§
hmer/web前端：Flask+HTML三栏布局，HMER类封装推理。已接入muhf_hmer新模型(SE-ResNet34)。用户要求支持新旧模型切换。启动：HMER_CHECKPOINT/HMER_ENCODER_TYPE环境变量。JupyterLab URL的/lab/tree/替换为/proxy/5000/。
§
OCR评测规则v2：normalize去空格+全角→半角+中文标点→英文，保留标点(不可删)；无序匹配纯精确(无模糊！)；merge=多GT拼1模型，split=1GT拆多模型，归一化后精确拼接；小字规则：GT用*...*标记小字，模型完整匹配→◐small_ok(非TP非FP)，部分匹配→FP，未识别→不算FN漏检。编辑器端口5001，数据result_70_spotting_gpt55_corrected.jsonl。
§
§
华为910C：8卡NPU, torch-npu==2.7.1, CFS路径/media/cfs/ea-cvfa-aigc-x2v-2/pengshuo.10/。PaddleOCR-VL-1.5服务部署在此(ppocrvl15_server.py+PaddleOCR-VL-1___5/)。CFS跨机传大文件用cp不用tar/gzip(压缩极慢)。
§
MSE-Transformer HMER实验结论:项目在/media/cfs/pengshuo.10/latexshibie/mse_transformer/。当前最优exp9:gr=24, Adam lr=1e-3+scheduler+IDSSG增强, Val Best=68.29%, Test ExpRate=65.95%(论文58.54% +7.41)。exp7b:gr=32 Adam+scheduler Test=64.37%。DPS-CNN+Adam不兼容;DPS-CNN+Adadelta收敛慢效果差。论文growth_rate=24/32有矛盾。
§
DeepCNNDoA: v6a(BN+sample cov)最佳 Fresh=0.395° Pre-gen=0.396°一致。v6b(GN)=0.459°。核心:数据分布>Norm层。val loss(true cov)和Fresh RMSE反相关!距论文0.31°差0.085°(base) 


沟通风格偏好：中文沟通，喜欢直接给命令/脚本，不要多余解释。例如"给我一个curl命令"就要直接给可执行的命令，不要加太多前提说明。Debug时给原始输出即可。
§
用户偏好：追求效率，默认不要浪费资源乱跑；但用户明确说显卡多/并行跑时，可以一次提交多个小型对照实验。Magnus/9Nctl相关先实际查任务/提交输出/CFS日志并列job id和log路径，不要绕圈只计划；提交后自动用sleep循环监控，不要反复问。代码改来改去很烦，要一次写好多个版本/目录。
§
用户ML理论功底扎实，会主动指出：1) 线性缩放法则（bs×N → lr×N）；2) 大batch需要更多epoch补偿更新次数；3) 网络结构细节不能想当然（论文叫DenseNet121但实际是定制版[16,16,16]）。实现论文时必须逐层核对架构描述，不能看到名字就直接套标准实现。
§
监控任务偏好：用sleep循环而非cron。cron太重，用户说"不要用cron，用sleep"。后台跑bash循环写log文件，notify_on_complete通知。
§
用户期望：长时间训练任务要自主监控（cron每30分钟），发现bug主动修复重训，不要每步都问。说了"慢慢调整，有问题及时调整重训，直到效果差不多"就意味着放手让我干。
§
OCR评测标准：中英文标点统一（全角→半角，中文标点→英文标点），忽略空格，但标点不能删除——有标点vs无标点不算匹配。例如(SF和SF不匹配，但，和,匹配。
§
用户要求任何 Magnus/9Nctl 任务都必须把 stdout/stderr、crash traceback 和结果写入 CFS 日志；Hermes 对项目/实验的分析结论要及时写入项目文档或日志。
§
用户做实验/论文复刻图时偏好直接产出可复跑脚本、图片文件、总览 contact sheet、README 和核心指标汇总；如果缺少 prediction-level/token-level 明细数据，应明确说明不要硬造分布图。