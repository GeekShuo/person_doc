"""研究 Agent：给定领域，跨平台搜索 → 筛选 → 入库 → 生成领域研究报告。

工作流（借鉴 coding agent 的 plan -> act -> observe -> report 循环）：
    planner.make_plan      LLM 把领域拆成各平台搜索关键词 + 研究问题
    collectors.*           各平台搜索（bili/youtube 免登录；xhs/dy/zhihu/wb 走 MediaCrawler）
    filter.llm_filter      去重 + LLM 相关性打分 + 互动量排序
    ingest.*               视频复用 run_crawl 转写链路；图文直接入库
    report.build_report    LLM 生成《领域研究报告》（现状/大牛图谱/观点汇总）
"""
