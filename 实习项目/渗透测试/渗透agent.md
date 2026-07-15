## 项目概述

**SecLens**是自主研发的AI Agent渗透测试系统，融合了MCP协议智能决策能力和多智能体协作架构的企业级安全测试平台。系统通过先进的人工智能技术，实现了渗透测试的全流程自动化，为企业提供专业、高效、智能的安全评估解决方案，用于解决多智能体的强化学习/规划 + 黑箱优化 + 博弈对抗场景下的问题。

### 核心价值

- **完全自主化**- AI驱动的全自动渗透测试，无需人工干预
- **企业级安全**- 沙箱隔离环境，确保测试过程安全可控
- **智能决策**- 多智能体协作，自动选择最优测试策略
- **全面监控**- 实时追踪测试进度，生成详细分析报告
- **灵活扩展**- 微服务架构，支持水平扩展和定制化部署

### 项目核心目标

#### 颠覆行业认知

本项目致力于**颠覆Agent行业和信息安全行业的传统认知**，通过创新的算法、工程实践和人机协同机制，打造真正具备专家级能力的自主渗透测试系统。

#### 三大核心特性

|   |   |   |
|---|---|---|
|**可迁移**<br><br>- 知识经验可跨场景复用<br>- 支持多环境无缝迁移<br>- 标准化接口与协议<br>- 开放的生态系统|**可配置**<br><br>- 灵活的参数调优<br>- 自定义工作流编排<br>- 多LLM提供商支持<br>- 动态工具加载|**可扩展**<br><br>- 模块化架构设计<br>- 插件式功能扩展<br>- 水平扩展能力<br>- 持续进化机制|

#### 效果保障机制

系统采用**内循环持续优化**机制，确保任何人都能获得卓越的测试效果。如果您认为效果不够理想，请参考以下三点优化建议：

1. **深入学习使用方法**- 系统提供丰富的文档和最佳实践，建议充分了解各项功能和配置选项
2. **贡献领域知识**- 通过HTA（Human Teach Agent）机制注入您的专业经验，系统会持续学习并提升能力
3. **增加使用频次**- Agent具备自主学习能力，使用越多，积累的经验越丰富，效果越好

> **核心理念**：系统不是静态工具，而是**可持续进化的智能体**。通过人机协同和持续学习，系统能力会随着使用不断提升。

---

## 核心特性

### 智能化渗透测试能力

#### MCP协议智能决策能力

- **MCP协议集成**- 支持Claude、GPT、Copilot等主流AI客户端
- **100+专业安全工具**- 涵盖网络扫描、Web应用、密码破解、二进制分析等全方位测试
- **智能决策引擎**- AI驱动的工具选择、参数优化和攻击链发现
- **实时可视化**- 现代化仪表板、进度可视化和漏洞卡片展示
- **高性能缓存**- 智能结果缓存系统，亚秒级响应时间

#### 多智能体协作架构

- **多智能体协作**- 研究员、开发者、执行者专业分工协作
- **长期记忆系统**- 存储测试经验和成功模式，持续学习优化
- **Docker沙箱隔离**- 所有操作在隔离容器中执行，确保安全性
- **智能容器管理**- 根据任务自动选择最适合的Docker镜像
- **向量数据库**- PostgreSQL + pgvector实现语义搜索和知识存储
- **全栈可观测性**- Grafana/Prometheus/Jaeger/Loki完整监控方案

### 关键技术特性

|   |   |
|---|---|
|**AI智能体系统**<br><br>- 15个专业AI智能体（4基础+8剧本+4进化）<br>- 剧本化智能编排（CTF/赏金/企业/研究）<br>- 自主任务规划与执行<br>- 智能工具选择与参数优化<br>- 攻击链自动发现<br>- 三层决策机制（自主/协商/人机协同）|**全面安全测试**<br><br>- 网络侦察与扫描（25+工具）<br>- Web应用安全测试（40+工具）<br>- 身份认证与密码安全（12+工具）<br>- 二进制分析与逆向（25+工具）<br>- 云与容器安全（20+工具）|
|**智能记忆系统**<br><br>- 专家经验库：历史攻击链和成功案例存储<br>- 任务上下文：当前测试目标和执行状态<br>- 威胁情报库：CVE漏洞和PoC知识索引<br>- 向量检索：快速匹配相似漏洞场景|**企业级可观测**<br><br>- OpenTelemetry统一可观测性<br>- Grafana实时可视化仪表板<br>- VictoriaMetrics高性能指标存储<br>- Jaeger分布式追踪<br>- Loki日志聚合分析|

---

## 系统架构

### 整体架构图

![](https://apijoyspace.jd.com/v1/files/op9EqcMa1YkKOimq1dtJ/link)

---

## 技术优势

### 1. 双引擎驱动架构

|   |   |   |   |
|---|---|---|---|
|特性|MCP决策引擎|多智能体引擎|融合优势|
|**协议支持**|MCP协议，支持多种AI客户端|REST/GraphQL API|灵活的接入方式|
|**工具集成**|100+安全工具，智能选择|20+专业工具，沙箱执行|全面的工具覆盖|
|**智能决策**|实时参数优化，攻击链发现|多智能体协作，任务分解|智能化程度最高|
|**记忆系统**|智能缓存，LRU淘汰策略|向量数据库，长期记忆|持续学习能力|
|**可视化**|现代化仪表板，实时进度|Grafana监控，全链路追踪|完整的可观测性|

### 2. 企业级安全保障

- **多层隔离**- Docker容器隔离 + 网络隔离 + 权限控制
- **安全审计**- 完整的操作日志和审计追踪
- **数据加密**- 传输加密（TLS）+ 存储加密
- **权限管理**- 基于角色的访问控制（RBAC）
- **合规支持**- 符合企业安全合规要求

### 3. 高性能与可扩展性

- **亚秒级响应**- 智能缓存系统，命中率>90%
- **水平扩展**- 微服务架构，支持集群部署
- **弹性伸缩**- 根据负载自动调整资源
- **高效存储**- 向量数据库 + 对象存储优化
- **分布式部署**- 支持多节点、跨区域部署

---

## 安全工具集 （待办：什么时候使用什么工具以及如何使用->知识化）

### 网络侦察与扫描

- **端口扫描**: Nmap, Rustscan, Masscan
- **子域名枚举**: Amass, Subfinder, Fierce, DNSEnum
- **信息收集**: TheHarvester, AutoRecon
- **网络枚举**: Enum4linux-ng, SMBMap, NetExec

### Web应用安全测试

- **目录扫描**: Gobuster, Feroxbuster, Dirsearch, FFuf
- **漏洞扫描**: Nuclei (4000+模板), Nikto, Jaeles
- **SQL注入**: SQLMap (自动化注入测试)
- **XSS检测**: Dalfox (DOM分析)
- **浏览器自动化**: Headless Chrome + Selenium

### 身份认证与密码安全

- **暴力破解**: Hydra (50+协议), Medusa, Patator
- **密码破解**: John the Ripper, Hashcat (GPU加速)

### 二进制分析与逆向

- **调试器**: GDB, GDB-PEDA, GDB-GEF
- **逆向工程**: Ghidra, Radare2, IDA Free
- **CTF框架**: Pwntools, Angr

### 云与容器安全

- **多云审计**: Prowler (AWS/Azure/GCP), Scout Suite
- **容器扫描**: Trivy, Clair
- **K8s安全**: Kube-Hunter, Kube-Bench

---

## AI智能体系统

### 为什么需要多智能体和多剧本？

- **单一Agent能力有限**，一个Agent无法精通所有安全领域
- **渗透测试是个大概念**，包含多个完全不同的垂域剧本
- **决策质量不稳定**，缺乏专业分工，容易出错
- **无法并行处理**，串行执行效率低下

**SecLens的解决方案**：采用**剧本分类+专家分工+协同作战**模式，将复杂的渗透测试剧本逐级拆解。

### 核心智能体架构

%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#f0f9ff','primaryTextColor':'#1e293b','primaryBorderColor':'#94a3b8','lineColor':'#94a3b8','secondaryColor':'#f0f9ff','tertiaryColor':'#f0f9ff'}}}%%
graph TB
    subgraph CORE["通用核心层 Universal Core"]
        direction TB
        subgraph AGENTS["核心代理"]
            A["任务编排器<br/><i>Task Orchestrator</i>"]
            B["记忆管理器<br/><i>Memory Manager</i>"]
            C["验证专家<br/><i>Validator</i>"]
            D["工具调度器<br/><i>Tool Dispatcher</i>"]
        end
        
        subgraph ENGINES["核心能力引擎"]
            E1["强化学习引擎<br/><i>RL Engine</i>"]
            E2["规划引擎<br/><i>Planning Engine</i>"]
            E3["黑箱优化引擎<br/><i>Black-box Optimizer</i>"]
            E4["博弈对抗引擎<br/><i>Game Theory Engine</i>"]
            E5["知识图谱<br/><i>Knowledge Graph</i>"]
        end
    end
    
    subgraph SCRIPTS["场景剧本层 Scenario Scripts"]
        S1["渗透测试<br/><i>Penetration Testing</i>"]
        S2["赏金猎人<br/><i>Bug Bounty Hunter</i>"]
        S3["CTF解题<br/><i>CTF Solver</i>"]
        S4["安全研究<br/><i>Security Research</i>"]
        S5["自定义场景<br/><i>Custom Scenario</i>"]
    end
    
    subgraph CONFIG["剧本配置 Script Configuration"]
        C1["角色定义"]
        C2["工作流程"]
        C3["决策规则"]
        C4["评估指标"]
        C5["工具集"]
        C6["知识库"]
    end
    
    A -.-> E1
    A -.-> E2
    B -.-> E5
    C -.-> E3
    D -.-> E4
    
    S1 ==> CONFIG
    S2 ==> CONFIG
    S3 ==> CONFIG
    S4 ==> CONFIG
    S5 ==> CONFIG
    
    C1 --> A
    C2 --> A
    C3 --> A
    C4 --> C
    C5 --> D
    C6 --> B
    
    classDef coreStyle fill:#6366f1,stroke:#4f46e5,stroke-width:3px,color:#fff
    classDef engineStyle fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff
    classDef scriptStyle fill:#ec4899,stroke:#db2777,stroke-width:2px,color:#fff
    classDef configStyle fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    
    class A,B,C,D coreStyle
    class E1,E2,E3,E4,E5 engineStyle
    class S1,S2,S3,S4,S5 scriptStyle
    class C1,C2,C3,C4,C5,C6 configStyle

### 智能体角色体系

### 智能体角色体系

SecLens现阶段设计了**15个专业智能体**，分为三大类：基础智能体、剧本智能体、进化智能体。根据不同剧本动态编排组合，实现最优效率。

#### 核心基础智能体（所有剧本通用）

|   |   |   |   |
|---|---|---|---|
|角色|核心职责|关键技能|解决的核心问题|
|**任务编排器**|全局任务调度、资源分配|任务分解、优先级排序、并行调度|多步骤任务连贯性|
|**记忆管理器**|上下文压缩、知识检索|链式摘要、向量检索、经验复用|上下文过长问题|
|**验证专家 Validator**|结果验证、幻觉过滤|CVE查询、多源验证、置信度评分|LLM幻觉问题|
|**工具调度器 Tool Dispatcher**|工具选择、参数优化|工具抽象层、智能参数调整、版本适配|工具调用错误|

#### 专家智能体

|   |   |   |   |
|---|---|---|---|
|角色|核心职责|关键技能|适用剧本|
|**侦察专家 Recon Specialist**|信息收集、攻击面分析|子域名枚举、端口扫描、指纹识别|企业安全评估、赏金猎人|
|**漏洞猎手 Vuln Hunter**|漏洞扫描、漏洞验证|Nuclei模板、SQL注入、XSS检测|企业安全评估、赏金猎人|
|**风险评估器 Risk Assessor**|风险评估、人机协同|风险矩阵、工单生成、决策追溯|企业安全评估|
|**知识更新器 Knowledge Updater**|实时学习、动态工具加载|CVE抓取、RAG检索、CAAE转换|所有剧本|
|**CTF解题专家 CTF Solver**|题目分析、Flag提取|Pwn/Crypto/Web/Reverse多类型解题|CTF竞赛|
|**赏金优化器 Bounty Optimizer**|目标优先级、报告优化|批量测试、漏洞去重、报告模板|赏金猎人|
|**利用开发器 Exploit Developer**|Exploit生成、Payload优化|自动化利用链、绕过技术|CTF竞赛、企业安全评估、赏金猎人|

#### 进化与学习智能体（支撑内循环迭代）

|   |   |   |   |
|---|---|---|---|
|角色|核心职责|关键技能|对应创新点|
|**🧬 经验学习器 Experience Learner**|被动学习、经验抽象|成功路径识别、模式提取、经验结构化|被动学习机制|
|**🎓 自主学习器 Autonomous Learner**|主动学习、知识索引|爬取Paper/博客、语义抽取、质量评估|自主学习机制|
|**👨‍🏫 人类教学器 Human Teacher**|迁移学习、HTA机制|案例标准化、轨迹记录、模仿学习|HTA人类教学|
|**🔧 自我进化器 Self-Evolver**|Agent开发自己|代码生成、PR提交、CI/CD集成|Agent As Developer|

### 剧本化智能体编排 （待办：场景智能编排和组织的配置化）

#### 剧本1：CTF竞赛模式

**目标**：快速解题、提取Flag、争夺排名

**编排的智能体组合**：

🎯 任务编排器 (协调)
  ├─ 🧠 记忆管理器 (历史题目经验)
  ├─ 🏆 CTF解题专家 (核心)
  ├─ 🔓 利用开发器 (Exploit生成)
  ├─ 🔧 工具调度器 (工具选择)
  └─ 🛡️ 验证专家 (Flag验证)

**工作流程**：

sequenceDiagram
    participant Human as 👤 CTF选手
    participant Orchestrator as 🎯 任务编排器
    participant Memory as 🧠 记忆管理器
    participant CTFExpert as 🏆 CTF解题专家
    participant ExploitDev as 🔓 利用开发器
    participant ToolDispatcher as 🔧 工具调度器
    participant Validator as 🛡️ 验证专家

    %% 阶段1: 题目分析与策略制定
    rect rgb(240, 248, 255)
        Note over Human,Validator: 阶段1: 题目分析与解题策略
        Human->>Orchestrator: 提交CTF题目<br/>(题目描述、附件、提示)
        
        Orchestrator->>CTFExpert: 启动题目分析
        CTFExpert->>CTFExpert: 初步分析<br/>- 题目类型识别<br/>- 难度评估<br/>- 关键信息提取
        
        CTFExpert->>Memory: 查询相似题目
        Memory->>Memory: 搜索历史题库<br/>- 题型匹配<br/>- 关键词搜索<br/>- 技术栈相似度
        Memory-->>CTFExpert: 返回相似题目<br/>(解题思路、常见陷阱、成功率)
        
        CTFExpert->>CTFExpert: 题型分类<br/>- Web/Pwn/Reverse/Crypto/Misc
        
        alt Web题目
            CTFExpert-->>Orchestrator: Web类型<br/>(SQL注入/XSS/SSRF/反序列化等)
        else Pwn题目
            CTFExpert-->>Orchestrator: Pwn类型<br/>(栈溢出/堆溢出/格式化字符串等)
        else Reverse题目
            CTFExpert-->>Orchestrator: Reverse类型<br/>(静态分析/动态调试/反混淆等)
        else Crypto题目
            CTFExpert-->>Orchestrator: Crypto类型<br/>(RSA/AES/古典密码/哈希碰撞等)
        else Misc题目
            CTFExpert-->>Orchestrator: Misc类型<br/>(隐写/取证/编码/流量分析等)
        end
        
        Orchestrator->>Human: 📊 题目分析报告<br/>- 题型: XXX<br/>- 难度: XXX<br/>- 预计时间: XXX<br/>- 推荐策略
    end

    %% 阶段2: 工具准备与环境配置
    rect rgb(240, 255, 240)
        Note over Human,Validator: 阶段2: 工具选择与环境准备
        
        Orchestrator->>ToolDispatcher: 请求工具推荐
        ToolDispatcher->>ToolDispatcher: 基于题型选择工具<br/>- Web: Burp/SQLMap/Dirb<br/>- Pwn: GDB/Pwntools/ROPgadget<br/>- Reverse: IDA/Ghidra/GDB<br/>- Crypto: SageMath/RsaCtfTool<br/>- Misc: Binwalk/Volatility/Wireshark
        
        ToolDispatcher->>Memory: 查询工具成功率
        Memory-->>ToolDispatcher: 历史工具效果数据
        
        ToolDispatcher-->>Orchestrator: 推荐工具列表<br/>(按优先级排序)
        
        Orchestrator->>ToolDispatcher: 准备环境
        ToolDispatcher->>ToolDispatcher: 检查工具可用性<br/>- 版本检查<br/>- 依赖安装<br/>- 配置验证
        
        ToolDispatcher-->>Orchestrator: ✅ 环境就绪
        
        Orchestrator->>Human: 💡 工具准备完成<br/>推荐使用: XXX
    end

    %% 阶段3: 信息收集与初步探索
    rect rgb(255, 250, 240)
        Note over Human,Validator: 阶段3: 信息收集与初步探索
        
        Orchestrator->>CTFExpert: 开始信息收集
        
        par 并行信息收集
            CTFExpert->>ToolDispatcher: 执行自动化扫描
            ToolDispatcher->>ToolDispatcher: 运行扫描工具
            ToolDispatcher-->>CTFExpert: 扫描结果
        and
            CTFExpert->>CTFExpert: 手工分析<br/>- 源码审计<br/>- 文件分析<br/>- 行为观察
        and
            CTFExpert->>Memory: 查询题目特征
            Memory-->>CTFExpert: 常见漏洞模式
        end
        
        CTFExpert->>CTFExpert: 整合信息<br/>- 发现的入口点<br/>- 潜在漏洞<br/>- 可利用点
        
        CTFExpert-->>Orchestrator: 📋 信息收集报告<br/>- 发现X个入口点<br/>- Y个潜在漏洞<br/>- 推荐攻击路径
        
        Orchestrator->>Human: 💡 发现关键信息<br/>建议尝试: XXX
        Human-->>Orchestrator: 确认方向 / 调整策略
    end

    %% 阶段4: 漏洞利用与Exploit开发
    rect rgb(255, 240, 245)
        Note over Human,Validator: 阶段4: 漏洞利用与Exploit开发
        
        Orchestrator->>CTFExpert: 开始漏洞利用
        
        CTFExpert->>Memory: 查询类似Exploit
        Memory-->>CTFExpert: 历史Exploit模板<br/>(成功案例、代码片段)
        
        CTFExpert->>ExploitDev: 请求Exploit开发
        
        ExploitDev->>ExploitDev: 分析利用条件<br/>- 漏洞类型<br/>- 目标环境<br/>- 限制条件
        
        alt Pwn题目
            ExploitDev->>ExploitDev: 开发二进制Exploit<br/>- 计算偏移<br/>- 构造ROP链<br/>- 绕过保护机制
            ExploitDev->>ToolDispatcher: 使用Pwntools
            ToolDispatcher-->>ExploitDev: 生成Exploit脚本
            
        else Web题目
            ExploitDev->>ExploitDev: 构造Web Payload<br/>- SQL注入Payload<br/>- 反序列化链<br/>- SSRF利用
            ExploitDev->>ToolDispatcher: 使用SQLMap/Burp
            ToolDispatcher-->>ExploitDev: 自动化利用
            
        else Crypto题目
            ExploitDev->>ExploitDev: 编写解密脚本<br/>- 数学分析<br/>- 算法实现<br/>- 暴力破解
            ExploitDev->>ToolDispatcher: 使用SageMath/Python
            ToolDispatcher-->>ExploitDev: 计算结果
            
        else Reverse题目
            ExploitDev->>ExploitDev: 逆向分析<br/>- 静态分析<br/>- 动态调试<br/>- 算法还原
            ExploitDev->>ToolDispatcher: 使用IDA/Ghidra
            ToolDispatcher-->>ExploitDev: 分析结果
        end
        
        ExploitDev-->>CTFExpert: Exploit已就绪
        
        CTFExpert->>CTFExpert: 测试Exploit<br/>- 本地验证<br/>- 调试优化<br/>- 稳定性测试
        
        alt Exploit成功
            CTFExpert-->>Orchestrator: ✅ 利用成功<br/>获得输出/Shell
            
        else Exploit失败
            CTFExpert-->>Orchestrator: ❌ 利用失败
            Orchestrator->>Human: ⚠️ 当前方法失败<br/>建议: XXX
            Human-->>Orchestrator: 尝试其他方法 / 调整参数
            Orchestrator->>CTFExpert: 调整策略
        end
    end

    %% 阶段5: Flag获取与验证
    rect rgb(245, 245, 255)
        Note over Human,Validator: 阶段5: Flag获取与验证
        
        alt 成功获取输出
            CTFExpert->>CTFExpert: 分析输出内容<br/>- 查找Flag格式<br/>- 提取关键信息<br/>- 解码/解密
            
            CTFExpert->>Validator: 提交疑似Flag
            Validator->>Validator: Flag格式验证<br/>- 格式检查(flag{xxx})<br/>- 长度验证<br/>- 字符集检查
            
            alt Flag格式正确
                Validator->>Validator: 尝试提交Flag
                
                alt Flag正确
                    Validator-->>Orchestrator: ✅ Flag正确!<br/>flag{xxx}
                    
                    Orchestrator->>Memory: 记录成功解题<br/>- 题目信息<br/>- 解题方法<br/>- Exploit代码<br/>- 关键步骤
                    
                    Orchestrator->>Human: 🎉 题目已解决!<br/>Flag: flag{xxx}<br/>用时: XX分钟
                    
                else Flag错误
                    Validator-->>Orchestrator: ❌ Flag错误
                    Orchestrator->>CTFExpert: 重新分析输出
                    CTFExpert->>Human: 💡 可能需要进一步处理<br/>- 解码<br/>- 解密<br/>- 格式转换
                end
                
            else Flag格式错误
                Validator-->>Orchestrator: ⚠️ 格式不符
                Orchestrator->>CTFExpert: 继续查找Flag
            end
            
        else 未获取到输出
            CTFExpert->>Human: ❓ 需要人工判断<br/>- 检查利用是否成功<br/>- 是否需要交互<br/>- 是否有其他输出
            Human->>CTFExpert: 提供反馈
        end
    end

    %% 阶段6: 知识沉淀与总结
    rect rgb(250, 240, 255)
        Note over Human,Validator: 阶段6: 解题总结与知识沉淀
        
        Orchestrator->>Memory: 完整记录解题过程
        Memory->>Memory: 存储解题数据<br/>- 题目类型和难度<br/>- 解题思路和步骤<br/>- 使用的工具和技术<br/>- Exploit代码<br/>- 遇到的坑和解决方法<br/>- 用时统计
        
        Orchestrator->>CTFExpert: 生成解题报告
        CTFExpert->>CTFExpert: 整理WriteUp<br/>- 题目分析<br/>- 解题思路<br/>- 详细步骤<br/>- 关键代码<br/>- 经验总结
        
        CTFExpert-->>Orchestrator: WriteUp草稿
        
        Orchestrator->>Human: 📝 解题报告<br/>- 题目: XXX<br/>- 类型: XXX<br/>- 用时: XX分钟<br/>- 关键技术: XXX
        
        Orchestrator->>Memory: 更新题型统计
        Memory->>Memory: 优化解题模型<br/>- 成功率分析<br/>- 时间效率<br/>- 工具效果<br/>- 常见陷阱
        
        Memory-->>Orchestrator: ✅ 知识库已更新
        
        Orchestrator->>Human: 📊 统计更新<br/>- 总解题数: XXX<br/>- 成功率: XX%<br/>- 平均用时: XX分钟<br/>- 擅长题型: XXX
    end

    Note over Human,Validator: 🎯 继续下一道题目

**特点**：

- **速度优先**- 跳过风险评估，直接执行
- **精准识别**- 快速判断题目类型和解法
- **经验复用**- 优先使用历史成功案例
- **无需合规**- 不启动风险评估器和合规审计器

---

#### 剧本2：赏金猎人模式

**目标**：批量测试、高效挖洞、快速变现

**编排的智能体组合**：

🎯 任务编排器 (协调)
  ├─ 🧠 记忆管理器 (漏洞模式)
  ├─ 🔍 侦察专家 (资产发现)
  ├─ ⚔️ 漏洞猎手 (漏洞扫描)
  ├─ 💰 赏金优化器 (核心)
  ├─ 🛡️ 验证专家 (去重验证)
  └─ 📚 知识更新器 (最新漏洞)

**工作流程**：（选出x个目标域名，并行侦查x个目标）

sequenceDiagram
    participant Human as 👤 赏金猎人
    participant Orchestrator as 🎯 任务编排器
    participant Memory as 🧠 记忆管理器
    participant Recon as 🔍 侦察专家
    participant Hunter as ⚔️ 漏洞猎手
    participant Bounty as 💰 赏金优化器
    participant Validator as 🛡️ 验证专家
    participant Knowledge as 📚 知识更新器

    %% 阶段1: 目标选择与策略制定
    rect rgb(240, 248, 255)
        Note over Human,Knowledge: 阶段1: 目标选择与赏金策略
        Human->>Orchestrator: 启动赏金猎人模式<br/>(选择平台: HackerOne/Bugcrowd/等)
        
        Orchestrator->>Knowledge: 获取最新赏金项目信息
        Knowledge->>Knowledge: 查询活跃赏金项目<br/>(奖金额度、难度、竞争度)
        Knowledge-->>Orchestrator: 返回赏金项目列表<br/>(排序: 收益/难度比)
        
        Orchestrator->>Bounty: 请求目标优先级分析
        Bounty->>Bounty: 分析赏金项目特征<br/>- 奖金范围<br/>- 资产规模<br/>- 竞争激烈度<br/>- 历史支付率
        Bounty->>Memory: 查询历史成功案例
        Memory-->>Bounty: 返回类似项目经验<br/>(成功率、平均奖金、常见漏洞)
        
        Bounty-->>Orchestrator: 推荐目标列表<br/>(按ROI排序)
        
        Orchestrator->>Human: 📊 展示推荐目标<br/>(收益预期、难度评估、时间成本)
        Human-->>Orchestrator: 选择目标项目
        
        Orchestrator->>Memory: 记录目标选择
        Orchestrator->>Bounty: 制定测试策略
        Bounty-->>Orchestrator: 策略方案<br/>(快速扫描 vs 深度挖掘)
    end

    %% 阶段2: 快速资产侦察
    rect rgb(240, 255, 240)
        Note over Human,Knowledge: 阶段2: 快速资产发现与攻击面分析
        Orchestrator->>Recon: 启动快速侦察任务
        
        Recon->>Recon: 子域名快速枚举<br/>(Amass, Subfinder, 并行执行)
        Recon->>Recon: 存活主机探测<br/>(HTTPx, 快速筛选)
        Recon->>Recon: 技术栈识别<br/>(Wappalyzer, 指纹识别)
        
        Recon->>Bounty: 提交资产清单
        Bounty->>Bounty: 资产价值评估<br/>- 核心业务系统(高价值)<br/>- 边缘服务(中价值)<br/>- 测试环境(低价值)
        
        Bounty->>Memory: 查询资产漏洞历史
        Memory-->>Bounty: 返回历史漏洞分布<br/>(哪些资产类型易出高危漏洞)
        
        Bounty-->>Orchestrator: 优先级资产列表<br/>(按赏金潜力排序)
        
        Orchestrator->>Human: 💡 发现高价值资产<br/>(建议优先测试目标)
        Human-->>Orchestrator: 确认测试顺序
    end

    %% 阶段3: 智能漏洞挖掘
    rect rgb(255, 250, 240)
        Note over Human,Knowledge: 阶段3: 智能漏洞扫描与挖掘
        Orchestrator->>Hunter: 分配漏洞挖掘任务
        
        Hunter->>Knowledge: 查询目标技术栈已知漏洞
        Knowledge-->>Hunter: CVE列表 + 最新PoC<br/>(优先高赏金漏洞类型)
        
        Hunter->>Memory: 查询成功漏洞模式
        Memory-->>Hunter: 返回高价值漏洞特征<br/>(IDOR, 逻辑漏洞, 权限绕过等)
        
        par 并行漏洞扫描
            Hunter->>Hunter: 自动化扫描<br/>(Nuclei高价值模板)
        and
            Hunter->>Hunter: 手工测试<br/>(业务逻辑漏洞)
        and
            Hunter->>Hunter: API安全测试<br/>(参数污染, 越权)
        end
        
        loop 每个发现的潜在漏洞
            Hunter-->>Orchestrator: 报告潜在漏洞
            
            Orchestrator->>Validator: 启动去重验证
            Validator->>Validator: 检查是否已被提交<br/>(查询公开漏洞库)
            Validator->>Memory: 查询本地提交记录
            Memory-->>Validator: 历史提交数据
            
            alt 漏洞已存在
                Validator-->>Orchestrator: ❌ 重复漏洞，跳过
                Orchestrator->>Memory: 记录重复案例
            else 新漏洞
                Validator-->>Orchestrator: ✅ 新漏洞，继续验证
                
                Orchestrator->>Bounty: 请求赏金评估
                Bounty->>Bounty: 计算预期赏金<br/>- 漏洞类型<br/>- 影响范围<br/>- CVSS评分<br/>- 平台历史支付
                Bounty-->>Orchestrator: 预期赏金: $XXX - $XXX
                
                alt 预期赏金 >= 阈值
                    Orchestrator->>Human: 💰 发现高价值漏洞<br/>预期赏金: $XXX
                    Human-->>Orchestrator: 继续深入验证
                    Orchestrator->>Validator: 执行完整验证
                else 预期赏金 < 阈值
                    Orchestrator->>Human: 💡 发现低价值漏洞<br/>是否继续?
                    Human-->>Orchestrator: 决策: 继续/跳过
                end
            end
        end
    end

    %% 阶段4: 严格验证与PoC准备
    rect rgb(255, 240, 245)
        Note over Human,Knowledge: 阶段4: 漏洞验证与PoC制作
        
        loop 每个待验证高价值漏洞
            Validator->>Memory: 查询类似漏洞验证方法
            Memory-->>Validator: 最佳实践和注意事项
            
            Validator->>Validator: 构造验证Payload
            Validator->>Validator: 多次验证确认<br/>(避免误报导致信誉损失)
            
            alt 验证成功
                Validator->>Validator: 制作详细PoC<br/>- 复现步骤<br/>- 截图/视频<br/>- 影响说明
                Validator-->>Orchestrator: ✅ 漏洞确认 + PoC
                
                Orchestrator->>Bounty: 最终赏金评估
                Bounty->>Bounty: 综合评估<br/>- 漏洞严重性<br/>- PoC质量<br/>- 报告完整度
                Bounty-->>Orchestrator: 最终预期赏金: $XXX
                
                Orchestrator->>Memory: 存储验证成功的漏洞
                
            else 验证失败
                Validator-->>Orchestrator: ❌ 误报
                Orchestrator->>Memory: 记录误报，优化扫描规则
                
            else 验证不确定
                Validator->>Human: ❓ 需要人工判断<br/>(复杂业务逻辑)
                Human->>Validator: 提供验证指导
                Human-->>Orchestrator: 验证结果
            end
        end
    end

    %% 阶段5: 报告撰写与提交
    rect rgb(245, 245, 255)
        Note over Human,Knowledge: 阶段5: 专业报告撰写与提交
        
        Orchestrator->>Memory: 获取报告模板
        Memory-->>Orchestrator: 返回高质量报告模板<br/>(基于历史高赏金报告)
        
        Orchestrator->>Orchestrator: 生成漏洞报告草稿<br/>- 标题(吸引注意)<br/>- 严重性评估<br/>- 详细复现步骤<br/>- 影响分析<br/>- 修复建议<br/>- PoC附件
        
        Orchestrator->>Bounty: 报告质量评估
        Bounty->>Bounty: 检查报告完整性<br/>- 是否清晰易懂<br/>- 是否包含所有必要信息<br/>- 是否符合平台要求
        Bounty-->>Orchestrator: 报告质量评分 + 改进建议
        
        Orchestrator->>Human: 📄 提交报告草稿
        Human->>Human: 审阅和优化报告
        Human-->>Orchestrator: 确认提交
        
        Orchestrator->>Orchestrator: 提交到赏金平台
        Orchestrator->>Memory: 记录提交信息<br/>(时间、平台、漏洞类型、预期赏金)
        
        Orchestrator->>Human: ✅ 报告已提交<br/>预期赏金: $XXX<br/>等待审核...
    end

    %% 阶段6: 跟进与优化
    rect rgb(250, 240, 255)
        Note over Human,Knowledge: 阶段6: 审核跟进与策略优化
        
        alt 平台需要补充信息
            Human->>Orchestrator: 收到平台反馈<br/>(需要更多信息)
            Orchestrator->>Validator: 补充验证信息
            Validator->>Validator: 提供额外证据
            Validator-->>Orchestrator: 补充材料
            Orchestrator->>Human: 📎 补充材料已准备
            Human-->>Orchestrator: 提交补充信息
        end
        
        alt 漏洞被接受
            Human->>Orchestrator: 🎉 漏洞已接受<br/>赏金: $XXX
            
            Orchestrator->>Memory: 更新成功案例<br/>- 漏洞类型<br/>- 实际赏金<br/>- 审核时长<br/>- 成功要素
            
            Orchestrator->>Bounty: 更新赏金模型
            Bounty->>Bounty: 优化预测算法<br/>(实际赏金 vs 预期赏金)
            
            Orchestrator->>Knowledge: 分享成功经验
            Knowledge->>Knowledge: 更新漏洞模式库
            
            Orchestrator->>Human: 📊 统计更新<br/>- 总赏金: $XXX<br/>- 成功率: XX%<br/>- 平均赏金: $XXX
            
        else 漏洞被拒绝
            Human->>Orchestrator: ❌ 漏洞被拒绝<br/>原因: XXX
            
            Orchestrator->>Memory: 记录失败案例
            Memory->>Memory: 分析拒绝原因<br/>- 重复提交<br/>- 不在范围<br/>- 影响不足<br/>- 无法复现
            
            Orchestrator->>Bounty: 更新筛选策略
            Bounty->>Bounty: 优化漏洞筛选规则<br/>(避免类似拒绝)
            
            Orchestrator->>Human: 💡 经验教训<br/>建议调整策略
            
        else 漏洞被标记为重复
            Human->>Orchestrator: ⚠️ 重复漏洞
            
            Orchestrator->>Validator: 更新去重机制
            Validator->>Validator: 优化重复检测<br/>(避免浪费时间)
            
            Orchestrator->>Memory: 记录重复案例
        end
    end

    %% 阶段7: 持续优化
    rect rgb(240, 255, 255)
        Note over Human,Knowledge: 阶段7: 策略优化与知识沉淀
        
        Orchestrator->>Bounty: 生成效率报告
        Bounty->>Bounty: 分析关键指标<br/>- 时间投入 vs 收益<br/>- 成功率趋势<br/>- 高价值漏洞类型<br/>- 最佳目标平台
        
        Bounty->>Memory: 查询历史数据
        Memory-->>Bounty: 完整统计数据
        
        Bounty-->>Orchestrator: 优化建议<br/>- 聚焦高ROI漏洞类型<br/>- 避免低价值目标<br/>- 优化时间分配
        
        Orchestrator->>Human: 📈 效率分析报告<br/>- 本周赏金: $XXX<br/>- 成功率: XX%<br/>- 优化建议
        
        Human->>Orchestrator: 调整策略参数
        Orchestrator->>Bounty: 更新优化策略
        
        Orchestrator->>Knowledge: 同步最新情报
        Knowledge->>Knowledge: 更新漏洞趋势<br/>- 新兴漏洞类型<br/>- 高赏金目标<br/>- 竞争态势
        
        Knowledge-->>Orchestrator: ✅ 知识库已更新
    end

    Note over Human,Knowledge: 🎯 继续下一个赏金目标
**特点**：

- 📊**批量处理**- 并行测试多个目标
- 💎**优先级优化**- 优先测试高赏金目标
- 🔄**智能去重**- 自动合并相似漏洞
- 📝**报告自动化**- 按平台要求生成报告
- 🚫**轻量风险评估**- 仅基本验证，不深度利用

---

#### 剧本3：企业安全评估

**目标**：全面评估、合规审计、详细报告

**编排的智能体组合**：

🎯 任务编排器 (协调)
  ├─ 🧠 记忆管理器 (测试经验)
  ├─ 🔍 侦察专家 (资产梳理)
  ├─ ⚔️ 漏洞猎手 (深度测试)
  ├─ ⚖️ 风险评估器 (核心)
  ├─ 🛡️ 验证专家 (严格验证)
  └─ 📚 知识更新器 (威胁情报)

**工作流程**：

sequenceDiagram
    participant Human as 👤 人类安全专家
    participant Orchestrator as 🎯 任务编排器
    participant Memory as 🧠 记忆管理器
    participant Recon as 🔍 侦察专家
    participant Hunter as ⚔️ 漏洞猎手
    participant Risk as ⚖️ 风险评估器
    participant Validator as 🛡️ 验证专家
    participant Knowledge as 📚 知识更新器

    %% 阶段1: 初始化与准备
    rect rgb(240, 248, 255)
        Note over Human,Knowledge: 阶段1: 测试初始化与授权确认
        Human->>Orchestrator: 发起漏洞挖掘请求<br/>(目标网站/资产、授权文件、测试范围)
        Orchestrator->>Human: 确认测试范围和授权边界<br/>(仅限外部可访问资产)
        Human-->>Orchestrator: ✅ 授权确认
        
        Orchestrator->>Memory: 查询历史测试数据
        Memory-->>Orchestrator: 返回相关测试经验<br/>(历史漏洞、成功案例、失败教训)
        
        Orchestrator->>Knowledge: 获取最新威胁情报
        Knowledge->>Knowledge: 查询CVE数据库、漏洞库
        Knowledge-->>Orchestrator: 返回最新漏洞情报和攻击技术
    end

    %% 阶段2: 侦察与资产梳理
    rect rgb(240, 255, 240)
        Note over Human,Knowledge: 阶段2: 侦察与资产发现
        Orchestrator->>Recon: 启动资产侦察任务
        
        Recon->>Recon: 被动信息收集<br/>(WHOIS, DNS, 子域名枚举)
        Recon->>Recon: 主动扫描<br/>(端口扫描, 服务识别, 指纹识别)
        Recon->>Recon: 资产分类与整理
        
        Recon-->>Orchestrator: 资产清单报告<br/>(IP段、域名、开放端口、服务版本)
        
        Orchestrator->>Memory: 存储资产信息
        Memory-->>Orchestrator: ✅ 已记录
        
        %% 关键决策点1
        alt 发现异常或敏感资产
            Orchestrator->>Human: ⚠️ 请求人工确认<br/>(发现未授权资产/敏感接口)
            Human-->>Orchestrator: 决策: 继续/跳过/调整策略
        end
    end

    %% 阶段3: 漏洞发现
    rect rgb(255, 250, 240)
        Note over Human,Knowledge: 阶段3: 漏洞扫描与深度测试
        Orchestrator->>Hunter: 分配漏洞扫描任务<br/>(基于资产清单)
        
        Hunter->>Knowledge: 查询目标服务已知漏洞
        Knowledge-->>Hunter: CVE列表和PoC信息
        
        Hunter->>Hunter: 自动化漏洞扫描<br/>(Nuclei, Nikto, Web扫描器)
        Hunter->>Hunter: Web应用手工测试<br/>(SQL注入, XSS, CSRF, 文件上传)
        Hunter->>Hunter: 业务逻辑漏洞挖掘<br/>(越权访问, 支付逻辑, 身份认证缺陷)
        Hunter->>Hunter: API安全测试<br/>(REST/GraphQL接口, 参数篡改)
        
        loop 每个发现的潜在漏洞
            Hunter->>Memory: 记录漏洞发现过程
            Hunter-->>Orchestrator: 报告潜在漏洞<br/>(漏洞类型、位置、初步证据)
            
            Orchestrator->>Risk: 请求风险评估
            Risk->>Risk: 分析漏洞影响范围
            Risk->>Risk: 计算CVSS评分
            Risk->>Risk: 评估业务影响
            Risk-->>Orchestrator: 风险等级报告<br/>(严重/高/中/低)
            
            %% 关键决策点2
            alt 高危或严重漏洞
                Orchestrator->>Human: 🚨 发现高危漏洞<br/>请求人工审核和测试授权
                Human-->>Orchestrator: 授权验证 / 暂停测试
            end
            
            Orchestrator->>Validator: 启动漏洞验证流程
        end
    end

    %% 阶段4: 漏洞验证
    rect rgb(255, 240, 245)
        Note over Human,Knowledge: 阶段4: 严格漏洞验证
        
        loop 每个待验证漏洞
            Validator->>Memory: 查询类似漏洞验证经验
            Memory-->>Validator: 历史验证方法和注意事项
            
            Validator->>Validator: 构造验证Payload
            Validator->>Validator: 执行安全验证测试<br/>(避免破坏性操作)
            
            alt 验证成功
                Validator->>Validator: 记录完整验证过程
                Validator->>Validator: 截图/日志取证
                Validator-->>Orchestrator: ✅ 漏洞确认<br/>(附带完整证据链)
                
                Orchestrator->>Risk: 更新风险评估
                Risk->>Risk: 基于验证结果重新评估
                Risk-->>Orchestrator: 最终风险等级
                
                Orchestrator->>Memory: 存储验证成功的漏洞
                
            else 验证失败
                Validator-->>Orchestrator: ❌ 误报<br/>(标记为False Positive)
                Orchestrator->>Memory: 记录误报案例
            else 验证不确定
                Validator->>Human: ❓ 请求人工验证<br/>(复杂场景/需要业务知识)
                Human->>Validator: 提供验证指导或亲自测试
                Human-->>Orchestrator: 验证结果反馈
            end
        end
    end

    %% 阶段5: 漏洞影响评估(可选)
    rect rgb(245, 245, 255)
        Note over Human,Knowledge: 阶段5: 漏洞影响评估与PoC验证(可选)
        
        Orchestrator->>Human: 📋 请求PoC验证授权<br/>(列出已验证的高危漏洞)
        Human-->>Orchestrator: 授权/拒绝 特定漏洞PoC
        
        alt 获得PoC授权
            Orchestrator->>Hunter: 执行受控PoC验证
            Hunter->>Knowledge: 查询安全PoC方法
            Knowledge-->>Hunter: 安全验证技术和示例
            
            Hunter->>Hunter: 构造安全PoC<br/>(不造成实际破坏)
            Hunter->>Hunter: 演示漏洞影响<br/>(截图/录屏证明)
            
            alt PoC成功
                Hunter->>Hunter: 记录漏洞影响范围
                Hunter->>Validator: 验证PoC效果
                Validator-->>Orchestrator: 确认影响评估
                
                Orchestrator->>Human: ⚠️ 漏洞影响已确认<br/>建议立即修复
                Human-->>Orchestrator: 确认收到/安排修复
                
            else PoC失败
                Hunter-->>Orchestrator: 影响评估失败(记录原因)
            end
            
            Orchestrator->>Memory: 记录PoC过程和结果
        end
    end

    %% 阶段6: 报告生成
    rect rgb(250, 240, 255)
        Note over Human,Knowledge: 阶段6: 报告生成与知识沉淀
        
        Orchestrator->>Memory: 汇总所有测试数据
        Memory-->>Orchestrator: 完整测试记录<br/>(漏洞、验证、利用、时间线)
        
        Orchestrator->>Risk: 生成综合风险评估
        Risk->>Risk: 计算整体安全态势
        Risk->>Risk: 生成风险矩阵
        Risk-->>Orchestrator: 风险评估报告
        
        Orchestrator->>Orchestrator: 生成漏洞挖掘报告<br/>- 执行摘要<br/>- 漏洞详情列表<br/>- 风险评级矩阵<br/>- 修复建议(优先级)<br/>- 复现步骤<br/>- 测试时间线
        
        Orchestrator->>Human: 📄 提交初稿报告
        Human->>Human: 审阅报告内容
        Human-->>Orchestrator: 反馈修改意见
        
        Orchestrator->>Orchestrator: 修订报告
        Orchestrator->>Human: 📊 提交最终报告
        
        %% 知识更新
        Orchestrator->>Memory: 存储本次测试经验
        Memory->>Memory: 更新漏洞模式库
        Memory->>Memory: 记录成功/失败案例
        
        Orchestrator->>Knowledge: 提交新发现的漏洞模式
        Knowledge->>Knowledge: 更新威胁情报库
        Knowledge-->>Orchestrator: ✅ 知识库已更新
    end

    %% 阶段7: 复测与闭环
    rect rgb(240, 255, 255)
        Note over Human,Knowledge: 阶段7: 修复验证与闭环(可选)
        
        Human->>Orchestrator: 📅 请求漏洞修复验证<br/>(开发团队已修复)
        
        Orchestrator->>Validator: 执行复测任务
        Validator->>Memory: 查询原始漏洞详情
        Memory-->>Validator: 原始测试数据和Payload
        
        Validator->>Validator: 重新执行验证测试
        
        alt 漏洞已修复
            Validator-->>Orchestrator: ✅ 修复验证通过
            Orchestrator->>Memory: 更新漏洞状态(已修复)
        else 漏洞仍存在
            Validator-->>Orchestrator: ❌ 修复验证失败
            Orchestrator->>Human: ⚠️ 漏洞未完全修复<br/>提供详细分析
        end
        
        Orchestrator->>Human: 📋 提交复测报告
        
        Orchestrator->>Knowledge: 更新修复方案有效性数据
        Knowledge-->>Orchestrator: ✅ 已记录
    end

    Note over Human,Knowledge: 🎉 漏洞挖掘流程完成

**特点**：

- **严格风险控制**- 所有高危操作需人工审批
- **全面评估**- 资产梳理、漏洞测试
- **详细报告**- 包含技术细节、修复建议
- **时间充裕**- 深度测试，不追求速度

#### 剧本4：安全研究模式 （待办：未完成）

**目标**：漏洞研究、0day挖掘、攻击技术创新

**编排的智能体组合**：

🎯 任务编排器 (协调)
  ├─ 🧠 记忆管理器 (研究历史)
  ├─ 🔍 侦察专家 (深度分析)
  ├─ 🔓 利用开发器 (核心)
  ├─ 🎓 自主学习器 (最新研究)
  ├─ 👨‍🏫 人类教学器 (专家指导)
  ├─ 🔧 自我进化器 (技术创新)
  └─ 🛡️ 验证专家 (PoC验证)

**工作流程**：

sequenceDiagram
    participant Human as 👤 安全研究员
    participant Orchestrator as 🎯 任务编排器
    participant Memory as 🧠 记忆管理器
    participant Recon as 🔍 侦察专家
    participant ExploitDev as 🔓 利用开发器
    participant Learner as 🎓 自主学习器
    participant Teacher as 👨‍🏫 人类教学器
    participant Evolution as 🔧 自我进化器
    participant Validator as 🛡️ 验证专家

    %% 阶段1: 研究目标选择与规划
    rect rgb(240, 248, 255)
        Note over Human,Validator: 阶段1: 研究目标选择与方向规划
        Human->>Orchestrator: 启动安全研究项目<br/>(研究方向、目标软件/协议)
        
        Orchestrator->>Learner: 获取最新研究动态
        Learner->>Learner: 扫描学术论文<br/>- arXiv安全论文<br/>- Black Hat/DEF CON议题<br/>- CVE最新披露<br/>- 安全博客和Twitter
        Learner-->>Orchestrator: 最新研究趋势<br/>(热门研究方向、未解决问题)
        
        Orchestrator->>Memory: 查询历史研究数据
        Memory->>Memory: 检索相关研究<br/>- 类似目标研究<br/>- 已知漏洞模式<br/>- 成功/失败案例<br/>- 研究方法论
        Memory-->>Orchestrator: 历史研究经验
        
        Orchestrator->>Orchestrator: 综合分析<br/>- 研究价值评估<br/>- 技术可行性<br/>- 预期影响力<br/>- 时间投入估算
        
        Orchestrator->>Human: 📊 研究规划建议<br/>- 推荐研究方向<br/>- 预期成果<br/>- 时间规划<br/>- 资源需求
        
        Human-->>Orchestrator: 确认研究目标
        Orchestrator->>Memory: 记录研究立项
    end

    %% 阶段2: 深度目标分析
    rect rgb(240, 255, 240)
        Note over Human,Validator: 阶段2: 深度目标分析与攻击面研究
        
        Orchestrator->>Recon: 启动深度分析任务
        
        Recon->>Recon: 目标信息收集<br/>- 架构分析<br/>- 代码审计<br/>- 协议逆向<br/>- 历史漏洞研究
        
        Recon->>Memory: 查询相关技术资料
        Memory-->>Recon: 技术文档和研究论文
        
        Recon->>Learner: 请求最新技术情报
        Learner->>Learner: 搜索相关研究<br/>- 学术论文<br/>- 技术博客<br/>- 开源项目<br/>- 漏洞披露
        Learner-->>Recon: 最新技术资料
        
        par 并行深度分析
            Recon->>Recon: 静态分析<br/>- 源码审计<br/>- 二进制分析<br/>- 协议分析
        and
            Recon->>Recon: 动态分析<br/>- 模糊测试<br/>- 流量分析<br/>- 行为监控
        and
            Recon->>Recon: 攻击面建模<br/>- 入口点识别<br/>- 信任边界分析<br/>- 数据流追踪
        end
        
        Recon-->>Orchestrator: 📋 深度分析报告<br/>- 架构图<br/>- 攻击面地图<br/>- 潜在漏洞点<br/>- 研究假设
        
        Orchestrator->>Human: 💡 分析发现<br/>建议重点研究: XXX
        Human-->>Orchestrator: 确认/调整方向
    end

    %% 阶段3: 漏洞假设与验证
    rect rgb(255, 250, 240)
        Note over Human,Validator: 阶段3: 漏洞假设提出与初步验证
        
        Orchestrator->>ExploitDev: 开始漏洞研究
        
        ExploitDev->>Memory: 查询类似漏洞模式
        Memory-->>ExploitDev: 历史漏洞案例<br/>(漏洞类型、利用方法、绕过技术)
        
        ExploitDev->>Learner: 查询最新攻击技术
        Learner-->>ExploitDev: 前沿攻击方法<br/>(新型漏洞类别、利用技巧)
        
        ExploitDev->>ExploitDev: 提出研究假设<br/>- 可能的漏洞类型<br/>- 触发条件分析<br/>- 利用可行性评估
        
        loop 每个研究假设
            ExploitDev->>ExploitDev: 设计验证实验
            ExploitDev->>Validator: 请求初步验证
            
            Validator->>Validator: 构造测试用例<br/>- PoC原型<br/>- 边界条件测试<br/>- 环境配置
            
            alt 假设成立
                Validator-->>ExploitDev: ✅ 漏洞确认<br/>发现潜在漏洞!
                ExploitDev->>Memory: 记录发现过程
                
            else 假设不成立
                Validator-->>ExploitDev: ❌ 假设失败
                ExploitDev->>Memory: 记录失败原因
                ExploitDev->>Evolution: 分析失败原因
                Evolution->>Evolution: 优化研究方法
                
            else 需要更多信息
                Validator-->>ExploitDev: ❓ 需要深入研究
                ExploitDev->>Teacher: 请求专家指导
                Teacher->>Human: 🤔 遇到技术难题<br/>需要专家建议
                Human->>Teacher: 提供研究思路
                Teacher-->>ExploitDev: 专家建议
            end
        end
        
        ExploitDev-->>Orchestrator: 研究进展报告<br/>- 已验证假设<br/>- 发现的漏洞<br/>- 待深入研究方向
    end

    %% 阶段4: 深度利用开发
    rect rgb(255, 240, 245)
        Note over Human,Validator: 阶段4: 创新性Exploit开发
        
        Orchestrator->>ExploitDev: 开始Exploit开发
        
        ExploitDev->>ExploitDev: 分析利用条件<br/>- 内存布局<br/>- 保护机制<br/>- 利用原语<br/>- 约束条件
        
        ExploitDev->>Learner: 查询绕过技术
        Learner->>Learner: 搜索最新绕过方法<br/>- ASLR绕过<br/>- DEP绕过<br/>- CFI绕过<br/>- Sandbox逃逸
        Learner-->>ExploitDev: 前沿绕过技术
        
        ExploitDev->>Evolution: 请求创新方法
        Evolution->>Evolution: 技术创新<br/>- 组合已知技术<br/>- 探索新利用原语<br/>- 优化利用链
        Evolution-->>ExploitDev: 创新利用思路
        
        ExploitDev->>ExploitDev: 开发Exploit原型<br/>- 编写利用代码<br/>- 构造ROP链/JOP链<br/>- 实现绕过机制
        
        loop 迭代优化
            ExploitDev->>Validator: 测试Exploit
            Validator->>Validator: 多环境测试<br/>- 不同版本<br/>- 不同配置<br/>- 不同架构
            
            alt Exploit成功
                Validator-->>ExploitDev: ✅ 利用成功<br/>成功率: XX%
                
                alt 成功率 >= 80%
                    ExploitDev-->>Orchestrator: Exploit已就绪
                else 成功率 < 80%
                    ExploitDev->>Evolution: 优化稳定性
                    Evolution->>Evolution: 分析失败案例<br/>改进利用方法
                    Evolution-->>ExploitDev: 优化建议
                end
                
            else Exploit失败
                Validator-->>ExploitDev: ❌ 利用失败<br/>失败原因: XXX
                
                ExploitDev->>Teacher: 请求技术指导
                Teacher->>Human: 💭 技术难题<br/>- 当前进展<br/>- 遇到的问题<br/>- 需要的帮助
                Human->>Teacher: 专家指导和建议
                Teacher-->>ExploitDev: 改进方向
            end
        end
    end

    %% 阶段5: 自主学习与进化
    rect rgb(245, 245, 255)
        Note over Human,Validator: 阶段5: 自主学习与技术进化
        
        Orchestrator->>Learner: 启动自主学习
        
        Learner->>Learner: 扫描最新研究<br/>- 监控arXiv新论文<br/>- 跟踪GitHub热门项目<br/>- 分析最新CVE<br/>- 学习会议议题
        
        Learner->>Learner: 知识提取<br/>- 新型漏洞类别<br/>- 创新利用技术<br/>- 绕过方法<br/>- 工具和框架
        
        Learner->>Evolution: 提交新知识
        Evolution->>Evolution: 知识融合<br/>- 整合新技术<br/>- 更新方法论<br/>- 优化工具链
        
        Evolution->>Evolution: 自我进化<br/>- 分析成功/失败案例<br/>- 识别模式和规律<br/>- 改进研究策略<br/>- 创新攻击方法
        
        Evolution->>Memory: 更新知识库
        Memory->>Memory: 知识沉淀<br/>- 新型漏洞模式<br/>- 利用技术库<br/>- 绕过方法集<br/>- 研究方法论
        
        Evolution-->>Orchestrator: 📈 进化报告<br/>- 学习到的新技术<br/>- 方法论改进<br/>- 能力提升
        
        Orchestrator->>Human: 💡 系统进化通知<br/>- 新增能力<br/>- 优化方向<br/>- 建议应用场景
    end

    %% 阶段6: 完整PoC验证
    rect rgb(250, 240, 255)
        Note over Human,Validator: 阶段6: 完整PoC开发与验证
        
        Orchestrator->>Validator: 开始完整验证
        
        Validator->>Validator: 准备测试环境<br/>- 多版本环境<br/>- 不同配置<br/>- 真实场景模拟
        
        Validator->>ExploitDev: 获取最终Exploit
        ExploitDev-->>Validator: 完整Exploit代码
        
        loop 全面测试
            Validator->>Validator: 执行测试<br/>- 功能验证<br/>- 稳定性测试<br/>- 兼容性测试<br/>- 性能测试
            
            Validator->>Validator: 记录测试数据<br/>- 成功率<br/>- 失败原因<br/>- 环境依赖<br/>- 限制条件
        end
        
        Validator->>Validator: 生成测试报告<br/>- 测试覆盖率<br/>- 成功率统计<br/>- 已知限制<br/>- 改进建议
        
        Validator-->>Orchestrator: 📊 验证报告<br/>- 总体成功率: XX%<br/>- 支持环境列表<br/>- 已知问题
        
        alt 验证通过
            Orchestrator->>Human: ✅ PoC验证成功<br/>可以进入披露流程
            
        else 验证失败
            Orchestrator->>ExploitDev: 需要改进
            ExploitDev->>Teacher: 请求指导
            Teacher->>Human: ⚠️ 验证遇到问题<br/>需要人工介入
        end
    end

    %% 阶段7: 负责任披露
    rect rgb(240, 255, 255)
        Note over Human,Validator: 阶段7: 负责任漏洞披露
        
        Human->>Orchestrator: 启动披露流程
        
        Orchestrator->>Orchestrator: 准备披露材料<br/>- 漏洞详情<br/>- 影响分析<br/>- PoC代码<br/>- 修复建议<br/>- 时间线
        
        Orchestrator->>Human: 📄 披露材料草稿
        Human->>Human: 审核材料<br/>- 确认技术细节<br/>- 评估影响范围<br/>- 制定披露策略
        
        alt 厂商披露
            Human->>Orchestrator: 联系厂商
            Orchestrator->>Orchestrator: 提交漏洞报告<br/>(遵循负责任披露原则)
            
            loop 等待厂商响应
                Orchestrator->>Human: 📧 厂商反馈<br/>- 确认收到<br/>- 修复进度<br/>- 预计发布时间
                
                alt 需要补充信息
                    Human->>Orchestrator: 提供额外信息
                    Orchestrator->>Validator: 补充验证
                end
            end
            
            Orchestrator->>Human: ✅ 厂商已修复<br/>CVE编号: CVE-XXXX-XXXXX
            
        else 公开披露
            Human->>Orchestrator: 准备公开披露<br/>(90天后或厂商同意)
            Orchestrator->>Orchestrator: 准备公开材料<br/>- 技术博客<br/>- 会议议题<br/>- 学术论文
        end
        
        Orchestrator->>Memory: 记录完整研究过程
        Memory->>Memory: 归档研究数据<br/>- 完整时间线<br/>- 技术细节<br/>- 沟通记录<br/>- 经验教训
    end

    %% 阶段8: 知识沉淀与分享
    rect rgb(255, 250, 245)
        Note over Human,Validator: 阶段8: 研究总结与知识分享
        
        Orchestrator->>Memory: 生成研究报告
        Memory->>Memory: 整理研究成果<br/>- 研究背景<br/>- 方法论<br/>- 技术细节<br/>- 创新点<br/>- 影响分析<br/>- 未来方向
        
        Orchestrator->>Evolution: 提取研究经验
        Evolution->>Evolution: 方法论优化<br/>- 成功经验总结<br/>- 失败教训分析<br/>- 研究流程改进<br/>- 工具链优化
        
        Evolution->>Learner: 更新学习模型
        Learner->>Learner: 知识整合<br/>- 新型漏洞模式<br/>- 创新利用技术<br/>- 研究方法论
        
        Orchestrator->>Human: 📚 研究成果<br/>- 技术报告<br/>- 学术论文<br/>- 会议演讲<br/>- 开源工具
        
        Human->>Orchestrator: 知识分享决策<br/>- 发表论文<br/>- 开源代码<br/>- 技术演讲<br/>- 博客文章
        
        Orchestrator->>Orchestrator: 知识传播<br/>- 发布研究成果<br/>- 分享经验教训<br/>- 贡献开源社区
        
        Orchestrator->>Memory: 完整归档
        Memory-->>Orchestrator: ✅ 知识库已更新
        
        Orchestrator->>Human: 📊 研究统计<br/>- 总研究时长<br/>- 发现漏洞数<br/>- CVE编号<br/>- 影响力评估<br/>- 技术创新点
    end

    Note over Human,Validator: 🎯 开始下一个研究项目

**特点**：

- 🔬**深度研究**- 代码审计、逆向分析、漏洞挖掘
- 🧠**知识驱动**- 大量阅读最新研究和议题
- 👨‍🏫**专家协同**- 人类研究员深度参与
- 🔧**技术创新**- 开发新工具、新方法
- 📝**成果产出**- CVE、Paper、开源工具

### 进化智能体工作机制 （待办：调研可参考的开源项目）

进化智能体在后台持续运行，支撑系统的自我学习和迭代：

![](https://apijoyspace.jd.com/v1/files/t3rOptHRIjLxamShaRt1/link)

**实际运作示例**：

1. **经验学习器**：CTF比赛后自动分析

输入: 成功解题记录
处理: 识别关键步骤 → 提取通用模式
输出: "二次注入+WAF绕过" 经验模板
效果: 下次遇到类似题目，3分钟内解决

1. **自主学习器**：每日凌晨自动运行

任务: 爬取最新CVE和安全博客
筛选: 高危漏洞 + PoC可用 + 影响面广
验证: 在测试环境验证有效性
存储: 更新到知识库，次日即可使用

1. **人类教学器**：安全专家主动教学

剧本: 发现新的WAF绕过技巧
教学: 专家演示 → 系统记录轨迹
学习: 提取关键Payload和判断逻辑
复用: 所有Agent获得新能力

1. **自我进化器**：发现系统缺陷时触发

发现: SQLMap对某WAF绕过失败率高
分析: 缺少特定Tamper脚本
开发: 生成新的Tamper脚本代码
提交: 自动创建PR → CI测试 → 合并部署
结果: 系统自动获得新的绕过能力

---

### 剧本对比总结

|   |   |   |   |   |
|---|---|---|---|---|
|维度|🏆 CTF竞赛|💰 赏金猎人|🏢 企业渗透测试|🔬 安全研究|
|**核心目标**|快速解题|批量挖洞|全面评估|0day挖掘|
|**剧本智能体**|5个|6个|7个|7个|
|**进化智能体**|🧬 经验学习器|🧬 经验学习器 🎓 自主学习器|🧬 经验学习器 👨‍🏫 人类教学器 🔧 自我进化器|🎓 自主学习器 👨‍🏫 人类教学器 🔧 自我进化器|
|**风险评估**|❌ 跳过|⚠️ 轻量|✅ 严格|⚠️ 可控环境|
|**合规审计**|❌ 不需要|❌ 不需要|✅ 必须|❌ 不需要|
|**测试深度**|中等|浅层|深度|极深|
|**测试速度**|⚡ 极快 (3-8分钟)|🚀 快速 (10目标/小时)|🐢 深入 (3-5天)|🔬 研究 (1-2周)|
|**报告要求**|简单|标准化|详尽|学术级|
|**人工介入**|极少|少量|频繁|深度协同|
|**学习方式**|被动学习题目解法|被动学习+主动抓取新CVE|全方位学习+人类教学+自我进化|知识驱动+专家指导+技术创新|
|**成果产出**|Flag + 排名|赏金报告|安全评估报告|CVE + Paper + 工具|

### 智能体通信协议-基于MCP的消息总线MBMB（待办：逐步迭代）

SecLens采用**MCP Based Message Bus**作为智能体间的通信基础设施，实现低耦合、高效率的协同。

#### 通信架构

![](https://apijoyspace.jd.com/v1/files/2lvLLSM78NjTAsW244iE/link)

#### 四种通信模式

|   |   |   |   |
|---|---|---|---|
|模式|说明|使用剧本|示例|
|**🔄 同步调用**|请求-响应，阻塞等待|关键决策、数据验证|编排器调用验证专家确认漏洞|
|**📨 异步消息**|发送后继续，通过回调处理|长时间任务、批量操作|侦察专家扫描100个子域名|
|**📢 事件广播**|发布-订阅，多个订阅者|状态变更、漏洞发现|漏洞猎手发现高危漏洞，通知所有相关Agent|
|**💾 共享内存**|通过数据库共享状态|经验复用、上下文共享|所有Agent访问记忆管理器的向量库|

#### 消息格式标准

{
  "message_id":"MSG-2025-001",
  "timestamp":"2025-10-31T14:00:00Z",
  "from_agent":"recon_specialist",
  "to_agent":"vuln_hunter",
  "message_type":"task_assignment",
  "priority":"high",
  "payload":{
    "task_id":"TASK-001",
    "action":"scan_vulnerabilities",
    "target":"example.com",
    "discovered_assets":[
      {"type":"subdomain","value":"api.example.com","ports":[80,443]},
      {"type":"subdomain","value":"admin.example.com","ports":[443,8080]}
    ],
    "context":{
      "tech_stack":"Spring Boot 2.5.0",
      "waf":"none"
    }
  },
  "correlation_id":"REQ-2025-001",
  "reply_to":"recon_specialist",
  "ttl":300}

#### 通信流程示例

**场景**：侦察专家发现资产后，通知漏洞猎手扫描

![](https://apijoyspace.jd.com/v1/files/CaJqWBhwpTe8Ap2etTTY/link)

---

## 智能体决策机制（待办：蓝军高危操作checklist）

### 分层决策架构

SecLens采用**三层决策机制**，根据任务复杂度和风险级别动态选择决策方式。

![](https://apijoyspace.jd.com/v1/files/GRWwxaQfhnbyBf25IgCI/link)

### 一层决策：单Agent自主

**适用场景**：常规操作、低风险任务

**决策流程**：

![](https://apijoyspace.jd.com/v1/files/A7saq2M6CONIPAHJopjT/link)

**示例**：

# 侦察专家的自主决策classReconSpecialist:
    defdecide_scan_method(self, target):
        # 查询历史经验
        history = self.memory.query(f"port_scan:{target}")
        
        # 自主决策
        if history and history.success_rate > 0.9:
            return history.best_method  # 复用成功经验
        else:
            return"nmap_default"  # 使用默认方法

### 二层决策：多Agent协商

**适用场景**：需要多方验证、存在不确定性

**决策流程**：

![](https://apijoyspace.jd.com/v1/files/VAIE0y14SNpAAXhT7deD/link)

**投票权重规则**：

{
  "voting_weights":{
    "validator":0.4,        // 验证专家权重最高
    "vuln_hunter":0.4,      // 漏洞猎手次之
    "knowledge_updater":0.2// 知识更新器辅助
  },
  "decision_threshold":0.8,  // 80%置信度通过
  "min_voters":2             // 至少2个Agent参与}

**协商示例**：

![](https://apijoyspace.jd.com/v1/files/rdirTrKmghatxzDUXQeQ/link)

### 三层决策：目标是Agent完全主导，内循环全自主智能

**适用场景**：高风险操作、法律敏感、不确定性高

**决策流程**：

![](https://apijoyspace.jd.com/v1/files/9buEsHPaeNDe7oXFSz8c/link)

**风险评估矩阵**：

classRiskAssessor:
    defcalculate_risk_score(self, action):
        score = 0
        
        # 影响范围 (0-30分)
        if action.affects_production:
            score += 30
        elif action.affects_test:
            score += 15
            
        # 破坏性 (0-30分)
        if action.is_destructive:
            score += 30
        elif action.is_intrusive:
            score += 15
            
        # 法律风险 (0-20分)
        ifnot action.has_authorization:
            score += 20
        elif action.exceeds_scope:
            score += 10
            
        # 可逆性 (0-20分)
        ifnot action.is_reversible:
            score += 20
        elif action.hard_to_reverse:
            score += 10
            
        return score
    
    defget_decision_level(self, score):
        if score >= 70:
            return"human_approval_required"  # 必须人工审批
        elif score >= 50:
            return"human_notification"       # 通知人类但可自动执行
        else:
            return"auto_execute"             # 自动执行

**人机协同工单**：

{
  "ticket_id":"TICKET-2025-001",
  "risk_score":75,
  "risk_level":"high",
  "action":"exploit_sql_injection",
  "context":{
    "target":"shop.example.com/api/products",
    "vulnerability":"SQL注入 (CVSS 9.8)",
    "current_access":"只读权限",
    "potential_impact":"可获取10万用户数据"
  },
  "options":[
    {
      "id":"A",
      "description":"继续利用，获取数据库结构",
      "risk":"high",
      "value":"获得完整攻击链证明"
    },
    {
      "id":"B",
      "description":"仅报告漏洞，不深入利用",
      "risk":"low",
      "value":"满足测试要求，风险可控"
    },
    {
      "id":"C",
      "description":"停止测试，立即通知客户",
      "risk":"none",
      "value":"避免任何潜在风险"
    }
  ],
  "recommendation":"B",
  "deadline":"2025-10-31T15:00:00Z"}

### 决策机制对比

|   |   |   |   |   |
|---|---|---|---|---|
|决策层级|响应时间|准确率|适用任务占比|人工成本|
|**一层决策**|<1秒|95%|60%|无|
|**二层决策**|3-5秒|98%|30%|无|
|**三层决策**|5-30分钟|99.9%|10%|高|

### 决策学习与优化

系统会持续学习决策结果，优化决策策略：

![](https://apijoyspace.jd.com/v1/files/zBR5IwJvbzBpVJdRwvd4/link)

**学习示例**：**SQL注入利用决策优化**

![](https://apijoyspace.jd.com/v1/files/gtwMLfiPPRiDlhHbO8zq/link)

---

## 核心创新（待办：逐步迭代）

### 一、算法创新：内循环持续进化（待办：逐步迭代）

#### 背景与挑战

目前市面上所有Agent做渗透测试（包括Xbow等竞品）**很难达到高级专家的水平**。这不是技术的终点，而是创新的起点。本系统通过**内循环机制**实现持续进化，让Agent能够像人类专家一样不断学习和成长。

#### 人机协同（Human-Agent Collaboration）

**核心理念**：Agent不是替代人类，而是与人类协同工作，在关键决策点主动寻求人类指导。

![](https://apijoyspace.jd.com/v1/files/cxJfV6KZSAmE4eCzfF5F/link)

**工单结构化示例**：

{
  "request_id":"REQ-2025-001",
  "timestamp":"2025-10-31T10:41:00Z",
  "context":{
    "target":"example.com",
    "current_phase":"权限提升",
    "discovered_vulnerabilities":["SQL注入","文件上传"]
  },
  "attempted_actions":[
    "尝试SQL注入获取管理员密码（失败：WAF拦截）",
    "尝试文件上传绕过（部分成功：上传webshell但无执行权限）"
  ],
  "uncertainty":"是否应该尝试更激进的提权方法？",
  "risk_assessment":{
    "level":"medium",
    "concerns":["可能触发IDS告警","可能影响业务稳定性"]
  },
  "suggested_options":[
    {
      "option":"A",
      "description":"使用内核漏洞提权",
      "risk":"high",
      "success_rate":"85%"
    },
    {
      "option":"B", 
      "description":"继续信息收集，寻找其他入口",
      "risk":"low",
      "success_rate":"60%"
    },
    {
      "option":"C",
      "description":"中止当前路径，报告已发现漏洞",
      "risk":"none",
      "success_rate":"100%"
    }
  ]}

#### Agent进化论（Agent Evolution Theory）

系统实现**三层学习机制**，让Agent能力持续提升：

##### 被动学习（Passive Learning）- 经验记忆

**机制**：Agent自动记录并抽象成功的渗透测试路径

![](https://apijoyspace.jd.com/v1/files/OboWSZ1wnbvxlCWP1bTx/link)

**经验结构化存储**：

|   |   |   |
|---|---|---|
|字段|说明|示例|
|**场景特征**|目标系统特征|"WordPress 5.8 + Apache 2.4"|
|**成功路径**|完整攻击步骤序列|"信息收集→漏洞扫描→SQL注入→提权"|
|**关键命令**|核心执行命令|"sqlmap -u URL --technique=BEUST"|
|**前置条件**|成功的必要条件|"目标未启用WAF，存在注入点"|
|**上下文信息**|环境和配置|"目标响应时间<2s，数据库MySQL 5.7"|
|**成功率**|历史成功概率|"在类似场景成功率92%"|

##### 自主学习（Active Learning）- 知识获取

**机制**：Agent主动从互联网获取最新安全知识

![](https://apijoyspace.jd.com/v1/files/ueENnOCDEIqM7tg98I5e/link)

**知识质量评估标准**：

- ✅**来源可信度**：官方文档 > 知名安全研究员 > 技术博客
- ✅**内容新鲜度**：发布时间、是否过时
- ✅**技术验证**：是否有PoC、是否可复现
- ✅**社区反馈**：点赞数、评论质量、引用次数
- ✅**证据完整性**：是否包含详细步骤和截图

##### 迁移学习（Transfer Learning）- HTA机制
**HTA（Human Teach Agent）**：人类通过结构化方式向Agent传授经验

![](https://apijoyspace.jd.com/v1/files/2V9qmxPg602jbcQxcRxJ/link)

**HTA教学格式示例**：

teaching_case:
  id:"HTA-2025-001"
  title:"绕过WAF进行SQL注入"
  author:"张三（高级安全专家）"
  consent:"已授权用于系统学习"
  
  scenario:
    target_type:"Web应用"
    protection:"ModSecurity WAF"
    difficulty:"高"
  
  steps:
    -step:1
      action:"信息收集"
      command:"sqlmap -u 'http://target.com/page?id=1' --batch --random-agent"
      expected_result:"识别注入点但被WAF拦截"
      
    -step:2
      action:"WAF指纹识别"
      command:"wafw00f http://target.com"
      expected_result:"确认为ModSecurity"
      
    -step:3
      action:"使用Tamper脚本绕过"
      command:"sqlmap -u 'URL' --tamper=space2comment,between"
      expected_result:"成功绕过WAF，获取数据"
  
  key_insights:
    -"ModSecurity对空格敏感，使用注释符替代"
    -"多个tamper脚本组合使用效果更好"
    -"需要降低请求频率避免触发速率限制"
  
  failure_conditions:
    -"WAF规则已更新，tamper脚本失效"
    -"目标启用了IP白名单"
    -"数据库权限不足"
  
  metadata:
    created_at:"2025-10-31"
    success_rate:"78%"
    applicable_scenarios: ["ModSecurity", "类似WAF"]

### 二、工程侧创新：具身智能基础设施(待办：逐步迭代)

#### 动态MCP工具（Dynamic MCP Tools）

**创新点**：支持MCP工具的**动态加载和生成**，无需重启系统即可扩展功能。

![](https://apijoyspace.jd.com/v1/files/JXVOJrRKRD1YktJGuCBt/link)

**应用场景**：

- **新漏洞爆发**：快速生成针对性检测工具
- **特殊需求**：为特定目标定制专用工具
- **工具更新**：无缝升级现有工具版本
- **社区贡献**：接入第三方开发的工具

#### CAAE（Code As An Experience）

**核心理念**：将外部获取的知识和经验**标准化为可执行代码**

![](https://apijoyspace.jd.com/v1/files/uEBg29ByjX3j75XtBG7V/link)

**CAAE示例**：

**输入**（技术文章）：

标题：利用XXE漏洞读取服务器文件
步骤：
1. 构造恶意XML payload
2. 发送到解析XML的接口
3. 读取/etc/passwd文件

**输出**（可执行代码）：

# CAAE自动生成 - XXE漏洞利用经验defexploit_xxe_read_file(target_url, file_path="/etc/passwd"):
    """
    利用XXE漏洞读取服务器文件
    来源：技术文章《XXE漏洞利用》
    置信度：85%
    """
    payload = f"""<?xml version="1.0"?>
    <!DOCTYPE foo [
    <!ENTITY xxe SYSTEM "file://{file_path}">
    ]>
    <data>&xxe;</data>"""
    
    response = requests.post(
        target_url,
        data=payload,
        headers={"Content-Type": "application/xml"}
    )
    
    return extract_file_content(response.text)
# 元数据
metadata = {
    "source": "技术博客-XXE漏洞利用",
    "confidence": 0.85,
    "applicable_to": ["XML解析器", "未禁用外部实体"],
    "success_rate": "72%",
    "last_verified": "2025-10-31"
}

#### MBMB（MCP Based Message Bus）

**创新点**：基于MCP协议的**多Agent交互消息总线**，实现高效协同。

![](https://apijoyspace.jd.com/v1/files/SiXZxCfLzYyZAAn0Ivif/link)

**MBMB特性**：

|   |   |   |
|---|---|---|
|特性|说明|优势|
|**发布-订阅**|解耦Agent间通信|灵活扩展，降低复杂度|
|**主题路由**|按主题分类消息|精准投递，减少噪音|
|**消息持久化**|存储历史消息|可追溯，支持回放|
|**优先级队列**|紧急消息优先处理|提升响应速度|
|**广播机制**|一对多通信|高效协同|

#### Agent As Developer of Itself

**终极创新**：Agent不仅使用工具，还能**开发和改进自己!**

![](https://apijoyspace.jd.com/v1/files/rUHpjEkK0xMEH7VkHnF4/link)

**实现机制**：

1. **缺陷识别**：Agent在执行任务时发现自身能力不足
2. **需求分析**：分析需要什么新功能或改进
3. **方案设计**：基于知识库设计技术方案
4. **代码生成**：自动生成符合规范的代码
5. **测试验证**：在沙箱环境充分测试
6. **PR提交**：向GitHub仓库提交Pull Request
7. **持续集成**：触发自动化测试和代码审查
8. **人工审核**：关键变更需要人类专家审批
9. **自动部署**：审核通过后自动部署

**示例场景**：

场景：Agent发现缺少针对某新型WAF的绕过能力

1. Agent识别：在测试中多次被某WAF拦截
2. 知识检索：从知识库查找该WAF的绕过技术
3. 代码开发：生成新的tamper脚本
4. 本地测试：在测试环境验证有效性
5. 提交PR：
   - 标题："Add bypass technique for XXX WAF"
   - 说明：详细描述实现原理和测试结果
   - 代码：包含tamper脚本和单元测试
6. CI/CD：自动运行测试套件
7. 人工审核：安全专家review代码
8. 合并部署：自动部署到所有Agent实例
9. 能力提升：所有Agent获得新的绕过能力

### 创新总结

|   |   |   |   |
|---|---|---|---|
|创新类别|核心技术|业界首创|实际价值|
|**算法创新**|内循环进化、三层学习机制|✅|Agent能力持续提升，接近人类专家水平|
|**人机协同**|结构化工单、智能决策请求|✅|关键决策有人类把关，提升可靠性|
|**动态工具**|MCP工具动态加载|✅|快速响应新威胁，无需系统重启|
|**CAAE**|知识转代码|✅|外部知识直接转化为可执行能力|
|**MBMB**|MCP消息总线|✅|多Agent高效协同，降低耦合度|
|**自我进化**|Agent开发自己|✅|系统自主优化，持续演进|

---

## 常见问题及解决方案

### Agent渗透测试的六大挑战与突破

本系统通过创新技术方案，系统性地解决了Agent在渗透测试中面临的核心技术难题。

---

#### 问题1：上下文过长导致Token溢出

**挑战**：完整渗透测试可能产生50～100万+ tokens，远超LLM的128K-200K上下文窗口。

**解决方案**：

![](https://apijoyspace.jd.com/v1/files/VQYvmPH5UoYI7TDiE9uP/link)

**核心技术**：

- **Chain摘要算法**：保留最近对话，压缩历史内容，压缩比达95%
- **分层记忆系统**：短期（实时）、中期（语义检索）、长期（经验复用）
- **智能信息过滤**：Nmap 100K→2K，Nuclei 150K→10K

**效果**：500K tokens → 80K tokens，保留100%关键信息

---

#### 问题2：LLM幻觉导致错误决策

**挑战**：Agent可能虚构漏洞、生成错误命令、误判结果。

**解决方案**：

![](https://apijoyspace.jd.com/v1/files/y32FQWhOKMjnnqGzA1YZ/link)

**核心技术**：

- **工具白名单**：仅允许100+预定义安全工具
- **CVE真实性验证**：查询NVD官方数据库
- **多源交叉验证**：工具输出+知识库+PoC验证
- **置信度评分**：每个发现都带置信度和证据链

**效果**：幻觉率从50+%降至xxx%

---

#### 问题3：工具调用错误与参数混淆

**挑战**：参数顺序错误、版本差异、输出解析失败。

**解决方案**：

![](https://apijoyspace.jd.com/v1/files/UPZCHONXptJ2XNgyWeKP/link)

**核心技术**：

- **工具抽象层**：统一100+工具的调用接口
- **智能参数优化**：根据上下文自动调整参数（网络延迟、目标类型、防护强度）
- **输出标准化**：所有工具输出转换为统一JSON格式
- **版本兼容**：自动适配不同工具版本

**效果**：工具调用成功率从xx%提升至xx%

---

#### 问题4：决策不确定性与风险控制

**挑战**：高风险操作、法律风险、多方案选择困难。

**解决方案**：

![](https://apijoyspace.jd.com/v1/files/oja2tON5QOkLzKR2UCS2/link)

**核心技术**：

- **风险评估矩阵**：4维度量化风险（0-100分）
- **结构化工单**：包含上下文、已尝试动作、风险评估、建议选项
- **人机协同**：高风险操作必须人工审批
- **决策记录**：所有交互纳入学习和审计

**效果**：0起未授权操作，100%决策可追溯

---

#### 问题5：知识更新滞后

**挑战**：每天数十个新CVE，工具快速迭代，LLM训练数据过时。

**解决方案**：

![](https://apijoyspace.jd.com/v1/files/EEPT2lTS5AuMlCEGrlsZ/link)

**核心技术**：

- **自主学习**：定期抓取最新安全资讯，自动提取验证
- **动态MCP工具**：无需重启即可加载新工具
- **RAG增强**：实时检索最新知识注入上下文
- **CAAE机制**：知识自动转换为可执行代码

**效果**：知识更新延迟从数月缩短至数小时

---

#### 问题6：多步骤任务的连贯性

**挑战**：步骤依赖、状态管理、错误恢复、目标偏移。

**解决方案**：

![](https://apijoyspace.jd.com/v1/files/AMMAs2tSIV1xGTpV1HIV/link)

**核心技术**：

- **状态机管理**：8阶段标准化渗透测试流程
- **检查点机制**：每个阶段自动保存状态，支持恢复
- **目标追踪**：实时监控是否偏离主要目标
- **智能回退**：失败时自动回退到上一个稳定状态

**效果**：任务完成率从xx%提升至xx%

---

### 解决方案总结

|   |   |   |   |
|---|---|---|---|
|问题|传统Agent痛点|本系统方案|效果提升|
|**上下文溢出**|无法处理长流程|链式摘要+分层记忆||
|**LLM幻觉**|15%错误率|多层验证+置信度评分||
|**工具调用**|65%成功率|工具抽象层+智能优化||
|**风险控制**|无风险评估|风险矩阵+人机协同||
|**知识更新**|数月延迟|自主学习+动态加载||
|**任务连贯**|65%完成率|状态机+检查点||

---

## 性能指标

### 测试效率对比

|   |   |   |   |
|---|---|---|---|
|测试类型|传统手工测试|本系统|效率提升|
|**子域名枚举**|2-4小时|||
|**漏洞扫描**|4-8小时|||
|**Web应用测试**|6-12小时|||
|**CTF解题**|1-6小时|||
|**报告生成**|4-12小时|||

### 系统性能指标

|   |   |   |
|---|---|---|
|指标|数值|说明|
|**漏洞检测率**||vs 85% 人工测试|
|**误报率**||vs 15% 传统扫描器|
|**攻击向量覆盖**||vs 70% 人工测试|
|**CTF成功率**||vs 65% 人类专家平均|
|**响应时间**||缓存命中时|
|**系统可用性**||容错架构|

---

## 应用场景

### 1. 企业安全评估

- 定期安全审计
- 合规性检查
- 风险评估报告

### 2. 漏洞赏金计划

- 自动化漏洞挖掘
- 批量目标测试
- 快速漏洞验证

### 3. 红队演练

- 攻击路径发现
- 权限提升测试
- 横向移动模拟

### 4. 安全研究

- 新漏洞研究
- 利用技术开发
- CTF竞赛辅助

## 安全与合规

### 合法使用声明

**授权场景**：

- 获得书面授权的渗透测试
- 漏洞赏金计划（遵守规则）
- CTF竞赛和教育环境
- 自有或授权系统的安全研究

**禁止行为**：

- 未经授权的系统测试
- 恶意攻击活动
- 未授权的数据访问或窃取

---

**SecLens -**

_让安全测试更智能、更高效、更可靠_

_Making Security Testing Smarter, More Efficient, and More Reliable_
