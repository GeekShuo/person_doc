# Agent、Agentic RL 与自进化面试专题

## 一、先定义 Agent

一个可落地 Agent 不是“LLM + Prompt”，而是闭环系统：

```text
目标/输入
→ 状态与上下文
→ Planning/Reasoning
→ Tool Action
→ Environment Observation
→ 校验、记忆与反思
→ 下一步或终止
```

Agent 与固定 Workflow 的边界：Workflow 的拓扑和步骤预先确定；Agent 根据运行时状态和反馈动态选择动作。面试时必须先判断任务是否真的需要 Agent，确定性流程能解决时不要滥用 Agent。

## 二、六个核心模块

### 1. Planning

- ReAct、Plan-and-Execute、Planner-Executor、Reflection。
- 任务如何拆分、重规划、设最大步数和判断完成。
- 强模型规划、轻模型执行是否更经济。

### 2. Context 与 Harness

- Prompt 是指令；Context 是当前可见信息；Harness 是围绕模型的运行时、工具、权限、状态、观测和恢复机制。
- 长任务中需处理 Context 压缩、摘要失真、异步结果污染和断点恢复。

### 3. Memory

- 工作记忆、会话记忆、长期记忆。
- 最近 N 轮 + 分层摘要 + 向量召回 + 关键事实结构化存储。
- 写入门槛、冲突更新、时间戳、来源、版本、撤销与遗忘策略。

### 4. Tool Use

- 工具描述、JSON Schema、参数校验、Observation 标准化。
- 超时、指数退避、幂等、熔断、降级、人工确认。
- MCP 偏连接协议，Skill 偏包含 Prompt、代码和工作流的能力包。
- 高风险动作应做权限最小化、沙箱隔离和审批。

### 5. Evaluation

不能只看最终答案：

- 任务成功率、约束满足率、人工接管率；
- 工具选择与参数正确率、无效步骤数、循环率；
- 规划质量、轨迹长度、恢复成功率；
- P95 延迟、Token/工具成本；
- Groundedness、引用正确率和安全违规率。

### 6. Reliability

必须准备：死循环检测、预算控制、关键节点断言、结构化输出校验、日志重放、状态快照、失败回滚、Bad Case 回归集、模型和工具降级。

## 三、“Agent 自进化”要讲清什么

自进化不是一句“让 Agent 自己反思”。可拆成四层：

1. **上下文内适应**：不更新参数，通过 Memory、Reflection、经验检索改进下一次决策。
2. **经验资产化**：把成功/失败轨迹提炼成 Skill、规则、测试或可检索案例。
3. **数据闭环**：从线上轨迹筛选高质量样本，构造 SFT、偏好对或可验证任务。
4. **参数更新**：使用 SFT/DPO/PPO/GRPO/Agentic RL 更新模型或策略。

需要回答的安全边界：谁验证新经验、如何防错误自增强、如何版本化与回滚、如何隔离评测集、如何避免 Reward Hacking 和分布漂移。

## 四、Agentic RL

### 训练单位

单轮问答训练的是 response；Agentic RL 训练的是多步 trajectory。状态包含历史动作、工具反馈和环境变化，动作可能是文本、工具调用或终止。

### 奖励设计

可组合：

- 最终任务成功奖励；
- Process Reward；
- 工具调用正确性；
- 无效步骤、Token、延迟和付费工具惩罚；
- 安全、权限和格式约束；
- 人工/模拟用户反馈。

### 高频难点

- 长程信用分配；
- 稀疏和延迟奖励；
- User Simulator 与真实用户分布偏差；
- Tool/Environment 非平稳；
- 探索成本、轨迹复用和 off-policy 数据；
- Reward Hacking 与“通过测试但没有真正完成任务”。

## 五、系统设计题

### 设计一个生产可用的客服/研究/Coding Agent

回答顺序：

1. 明确目标、成功终态和不能做的动作。
2. 选择 Workflow 还是 Agent，说明理由。
3. 设计状态机、Planner、Executor、Memory 和工具注册。
4. 工具权限、沙箱、参数校验、超时与幂等。
5. Context 裁剪、摘要、检索与长任务恢复。
6. 终止条件、最大步数、成本预算和人工接管。
7. 轨迹日志、离线回放、评测集和 A/B Test。
8. 用失败轨迹产生数据，但经验证后才能进入 Skill/训练集。

## 六、高频面试问题

- Agent 和 Prompt Chain、Workflow 的本质区别？
- 为什么你的场景需要 Agent？不用 Agent 怎么做？
- Planner 与 Executor 是否拆分？何时使用多 Agent？
- 用户对话到第 20 轮忘记关键信息，第一步查什么？
- 工具参数不合法、超时、重复执行时如何兜底？
- 如何发现循环、提前终止和任务“假完成”？
- 如何评估轨迹，而不仅是最终回答？
- Memory 污染、过期与冲突如何解决？
- 如何从线上轨迹构造 SFT/偏好/RL 数据？
- PRM 和 ORM 如何用于 Agent？
- Agent 自进化如何防止错误经验被持续放大？
- 单 Agent 与多 Agent 如何做收益和成本对照实验？

## 七、来源

- [字节 AI Agent 面试经验（小红书）](https://www.xiaohongshu.com/explore/69de2751000000001f00179a)
- [Agent 候选人常见薄弱点（小红书）](https://www.xiaohongshu.com/explore/6a7bf6d600000000290337b2)
- [Agent 项目落地追问（小红书）](https://www.xiaohongshu.com/explore/6a94fa6d000000000b02768d)
- [字节招聘：AI Agent 工程师（小红书）](https://www.xiaohongshu.com/explore/6a9685940000000026016b87)
- [大模型算法面经：Function Call、MCP、A2A（知乎）](https://zhuanlan.zhihu.com/p/1898326676087223572)
- [2026 AI Agent 面试题汇总（腾讯云）](https://cloud.tencent.com/developer/article/2668240)
- [腾讯 27 届大模型算法面经（牛客）](https://www.nowcoder.com/feed/main/detail/8bbd2725dda44957a3ba9e301b5a9533)
- [阿里云 AI Infra / Agentic RL 面经（牛客）](https://www.nowcoder.com/discuss/921086976030150656)
