# 视频理解知识库 (video_kb)

把一个博主在 **B站 / YouTube** 上的视频批量下载，提取「口播内容 + 画面隐藏信息 + 屏幕文字」，
整理成结构化笔记，存入本地向量库，再用 Agent 问答。

## 架构
```
下载(yt-dlp) → 转写(本地 Whisper) → 视觉理解(Gemini/Kimi 原生视频) →
合并笔记(LLM) → 向量库(Chroma) → RAG 问答 Agent
```

## 为什么这样选型（针对 RTX 2060 / 6GB）
- **转写用本地 Whisper**：免费、吃 CUDA，2060 跑 `medium`(int8) 很流畅。
- **视觉理解用 API（Gemini Flash / Kimi K3）**：2060 跑不动 7B 多模态，且这是「画面里没讲出来的信息」的核心，API 原生视频理解质量高、便宜。
- **知识库用本地 Chroma**：零成本。

## 成本（估算）
- 单条约 10 分钟视频：视觉 + 转写 ≈ ¥0（全本地）~ ¥0.5（全 API）。
- 一个 200 条 ×10 分钟的频道建库：约 ¥50~150 一次性，之后问答每次几分钱。

## 快速开始
```bash
cd video_kb
python -m venv .venv && .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # 填入 GEMINI_API_KEY 或 KIMI_API_KEY
```

把要抓的链接写进 `urls.txt`（每行一个），B站需要 cookie：
```bash
# B站：用浏览器插件导出 cookies.txt
python pipeline.py urls.txt cookies.txt
# YouTube：不需要 cookie
python pipeline.py urls.txt
```

问答：
```python
from agent import ask
print(ask("他在哪一期讲过 XXX？"))
print(ask("总结他对 Y 的观点"))
```

## 注意
- B站下载可能需要登录 cookie，YouTube 一般不用。
- 视觉 API 对超长视频可能截断，建议单条 ≤ 1 小时；更长可按章节切片。
- 仅用于个人学习整理，注意平台 ToS 与版权，勿二次分发/商用。
