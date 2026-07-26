import os
import json

from config import NOTES_DIR
from llm import complete

MERGE_PROMPT = """你有一段视频的【口播转写】和【画面分析】。请综合两者，产出结构化笔记（Markdown），包含：
# 标题
## 核心观点（来自口播）
## 画面独有信息（旁白没讲出来的，来自视觉分析）
## 屏幕关键文字（OCR）
## 关键实体
## 时间轴要点（带时间戳）
只输出 Markdown。"""


def build_notes(transcript_path: str, visual_path: str, title: str = "") -> str:
    with open(transcript_path, encoding="utf-8") as f:
        tr = json.load(f)
    with open(visual_path, encoding="utf-8") as f:
        vi = json.load(f)

    spoken = "\n".join(
        f"[{s['start']:.0f}s] {s['text']}" for s in tr.get("segments", [])
    )
    visual_text = json.dumps(vi, ensure_ascii=False)

    prompt = (
        f"标题: {title}\n\n"
        f"【口播转写】\n{spoken}\n\n"
        f"【画面分析】\n{visual_text}\n\n"
        f"{MERGE_PROMPT}"
    )
    md = complete(prompt)

    base = os.path.splitext(os.path.basename(transcript_path))[0]
    out = os.path.join(NOTES_DIR, base + ".md")
    with open(out, "w", encoding="utf-8") as f:
        f.write(md)
    return out
