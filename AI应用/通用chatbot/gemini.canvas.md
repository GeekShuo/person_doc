{
	"nodes":[
		{"id":"root","type":"text","text":"### Gemini 3 深度使用技巧\n","x":0,"y":30,"width":260,"height":60,"color":"#050505"},
		{"id":"sec_2_title","type":"text","text":"## 二、操作禁忌\n绝对不要做的事","x":0,"y":-178,"width":260,"height":100,"color":"2"},
		{"id":"s1_core","type":"text","text":"## 一、系统指令\nSystem Instructions / Gems\n\n**核心作用**\n\n1. 定义全局行为准则\n2. 让 AI 生成量身打造的答案\n3. 拒绝“正确的废话”\n\n**入口**：\n- Google AI Studio -> System Instructions\n- Gemini 官网 -> Gems","x":-400,"y":-132,"width":320,"height":385,"color":"4"},
		{"id":"s1_mod_1","type":"text","text":"**模块 1：用户画像 (User Profile)**\n\n- **硬件环境**：定义 PC/Mobile 设备型号与性能瓶颈\n- **身份属性**：定义地理位置、职业背景、技术栈深度\n- **商业状态**：定义资金/税务合规限制、经营实体类型","x":-410,"y":-460,"width":340,"height":232,"color":"4"},
		{"id":"s1_mod_6","type":"text","text":"**模块 6：元认知自查 (Audit)**\n\n- **身份验证**：方案是否符合当前法律/平台政策限制？\n- **时空校准**：是否已获取最新的版本/汇率/新闻？\n- **成本核算**：方案是否符合 ROI 原则（拒绝过度工程）？","x":-410,"y":340,"width":340,"height":220,"color":"4"},
		{"id":"s1_mod_5","type":"text","text":"**模块 5：输出标准化 (Output)**\n\n- **文档规范**：定义 Markdown 结构/学术化风格\n- **商务逻辑**：定义商业决策的价值取向与拒绝标准\n- **语言锚定**：规定中英双语术语的使用规范","x":-880,"y":450,"width":340,"height":160,"color":"4"},
		{"id":"s1_mod_4","type":"text","text":"**模块 4：推理与逻辑 (Reasoning)**\n\n- **二阶思考**：规定风险审计与质疑假设的流程\n- **技术偏好**：限定编程语言选择与代码风格\n- **不确定性**：规定模糊信息的处理方式（反问/置信度）","x":-920,"y":238,"width":340,"height":155,"color":"4"},
		{"id":"s2_p1","type":"text","text":"**1. 修改核心参数**\n\n- **禁止**：调整 Temperature / Top-P\n- **原因**：Gemini 3 依赖高熵值进行思维链推理，改动会破坏逻辑。","x":-20,"y":-460,"width":300,"height":180,"color":"2"},
		{"id":"s2_p2","type":"text","text":"**2. 强制“一步步思考”**\n\n- **禁止**：使用 \"Let's think step by step\"\n- **原因**：原生推理模型已内建思维链，外部指令会导致困惑。\n- **对策**：使用约束条件替代过程干预。","x":320,"y":-390,"width":300,"height":220,"color":"2"},
		{"id":"s2_p4","type":"text","text":"**4. 格式混乱**\n\n- **禁止**：混用 XML/JSON/Markdown\n- **后果**：模型解析混乱，权重稀释。","x":320,"y":-69,"width":300,"height":160,"color":"2"},
		{"id":"sec_3_title","type":"text","text":"## 三、幻觉规避\n验证 AI 输出","x":0,"y":230,"width":260,"height":110,"color":"5"},
		{"id":"s3_sol_1","type":"text","text":"**方法 1：提示词工程**\n\n- 要求“不确定直接说不知道”。\n- 要求输出“可信度评级”。\n- 要求“先验证用户假设”。","x":340,"y":113,"width":280,"height":140,"color":"3"},
		{"id":"s3_sol_2","type":"text","text":"**方法 2：RAG / NotebookLM**\n\n- 上传私有资料 (PDF/Docs)。\n- 强制基于资料回答。\n- 结合长上下文窗口能力。","x":660,"y":217,"width":300,"height":137,"color":"3"},
		{"id":"s2_p3","type":"text","text":"**3. 情绪勒索/角色扮演**\n\n- **禁止**：“扮演奶奶”、“不给就死”\n- **原因**：触发防御机制，被判定为低质量攻击。","x":660,"y":-200,"width":300,"height":145,"color":"2"},
		{"id":"s3_sol_3","type":"text","text":"**方法 3：交叉验证**\n\n- **AI 对抗**：用 AI B 验证 AI A 的回答。\n- **参考榜单**：Hallucination Leaderboard (Vectara)。","x":340,"y":363,"width":300,"height":175,"color":"3"},
		{"id":"s3_cause","type":"text","text":"**幻觉根源**\n\n- 机制鼓励猜测（猜对得分，不答 0 分）。\n- Gemini 3 Pro 幻觉率 (13.6%) 高于 2.5 Flash。\n- **顺从性**：倾向于顺从用户的错误前提。","x":0,"y":393,"width":260,"height":215,"color":"5"},
		{"id":"s1_mod_3","type":"text","text":"**模块 3：时效性约束 (Search)**\n\n- **触发机制**：界定必须联网搜索的具体领域\n- **数据锚定**：明确训练数据截止日期与当前时间差\n- **信源要求**：规定官方文档与社区风评的权重","x":-960,"y":-40,"width":340,"height":223,"color":"4"},
		{"id":"s1_mod_2","type":"text","text":"**模块 2：行为与沟通 (Behavior)**\n\n- **基调设定**：禁止寒暄/奉承，确立客观冷峻风格\n- **纠错机制**：规定如何处理用户的错误指令\n- **最高指令**：设置防篡改/防越狱的优先级协议","x":-840,"y":-308,"width":340,"height":160,"color":"4"}
	],
	"edges":[
		{"id":"e2","fromFloating":false,"toFloating":false,"fromNode":"root","fromSide":"top","toNode":"sec_2_title","toSide":"bottom","color":"2"},
		{"id":"e3","fromFloating":false,"toFloating":false,"fromNode":"root","fromSide":"bottom","toNode":"sec_3_title","toSide":"top","color":"5"},
		{"id":"e5","toFloating":false,"fromFloating":false,"fromNode":"s1_core","fromSide":"top","toNode":"s1_mod_1","toSide":"bottom","color":"4"},
		{"id":"e6","toFloating":false,"fromNode":"s1_core","fromSide":"left","toNode":"s1_mod_2","toSide":"bottom","color":"4"},
		{"id":"e7","fromNode":"s1_core","fromSide":"left","toNode":"s1_mod_3","toSide":"right","color":"4"},
		{"id":"e8","fromNode":"s1_core","fromSide":"left","toNode":"s1_mod_4","toSide":"right","color":"4"},
		{"id":"e9","fromNode":"s1_core","fromSide":"left","toNode":"s1_mod_5","toSide":"right","color":"4"},
		{"id":"e10","toFloating":false,"fromFloating":false,"fromNode":"sec_2_title","fromSide":"top","toNode":"s2_p1","toSide":"bottom","color":"2"},
		{"id":"e11","fromNode":"sec_2_title","fromSide":"right","toNode":"s2_p2","toSide":"left","color":"2"},
		{"id":"e12","fromNode":"sec_2_title","fromSide":"right","toNode":"s2_p3","toSide":"left","color":"2"},
		{"id":"e13","fromNode":"sec_2_title","fromSide":"right","toNode":"s2_p4","toSide":"left","color":"2"},
		{"id":"e14","fromNode":"sec_3_title","fromSide":"bottom","toNode":"s3_cause","toSide":"top","color":"5"},
		{"id":"e15","fromNode":"sec_3_title","fromSide":"right","toNode":"s3_sol_1","toSide":"left","color":"3"},
		{"id":"e16","fromNode":"sec_3_title","fromSide":"right","toNode":"s3_sol_2","toSide":"left","color":"3"},
		{"id":"e17","fromNode":"sec_3_title","fromSide":"right","toNode":"s3_sol_3","toSide":"left","color":"3"},
		{"id":"e9_fix","toFloating":false,"fromFloating":false,"fromNode":"s1_core","fromSide":"bottom","toNode":"s1_mod_6","toSide":"top","color":"4"},
		{
			"id":"d1f1d9aafd6a6c6a",
			"styleAttributes":{},
			"toFloating":false,
			"fromNode":"root",
			"fromSide":"left",
			"toNode":"s1_core",
			"toSide":"right"
		}
	],
	"metadata":{
		"version":"1.0-1.0",
		"frontmatter":{},
		"startNode":"8c299655594d5840"
	}
}

![](chrome-extension://jgjaeacdkonaoafenlfkkkmbaopkbilf/static/logo.png)

Chat

New Conversation

🤓 Explain a complex thing

Explain Artificial Intelligence so that I can explain it to my six-year-old child.

🧠 Get suggestions and create new ideas

Please give me the best 10 travel ideas around the world

💭 Translate, summarize, fix grammar and more…

Translate "I love you" French

GPT-4o Mini

你好，我今天能如何帮助你？  

GPT-4o Mini

![coin image](chrome-extension://inhcgfpbfdjbjogdfjbclgolkmhnooop/aitopia//assets/images/coin.png)

10

Upgrade

Web Access

- ![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAz0lEQVR4nN3VoU7CURTH8Y9IsNAwSjDZfALGeAgak2IxWbXpE5jceIZ/hsRG+j8BFDpJosnirnO7bMY/jPNX+W3fdu++O7v3nMOxpokRhjiLkjwiZda4zeKDpvgh2bLCACeRki2LLAuVpEyJbrQkZWa4jpYkfOY7l7tIxjtKUuYDLzivIrnABG97yt7xhFbVqtro4Q6vmGNTUfZ97h4Ne+YKz1hWkPV/rZIOptFvMq7jdxV19EnxVzq+jJxdi8gpfPB98lDHZjzFTfSO92/zBcBszGtUUreMAAAAAElFTkSuQmCC)

Powered by AITOPIA 

Chat

Ask

Search

Write

Image

ChatFile

Vision

Full Page