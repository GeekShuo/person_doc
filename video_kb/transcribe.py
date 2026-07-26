import os
import json

from config import WHISPER_MODEL, TRANSCRIPT_DIR, RAW_DIR
from faster_whisper import WhisperModel


def transcribe(video_path: str) -> dict:
    """本地 Whisper 转写（免费）。优先 CUDA，失败则回退 CPU(int8)。"""
    try:
        model = WhisperModel(WHISPER_MODEL, device="cuda", compute_type="int8")
        device = "cuda"
    except Exception as e:
        print(f"[warn] CUDA 不可用，回退 CPU：{e}")
        model = WhisperModel(WHISPER_MODEL, device="cpu", compute_type="int8")
        device = "cpu"
    print(f"[info] Whisper 使用设备: {device}")
    segments, info = model.transcribe(video_path, beam_size=5, language="zh")
    return {
        "language": info.language,
        "segments": [
            {"start": s.start, "end": s.end, "text": s.text} for s in segments
        ],
    }


def transcribe_and_save(video_path: str) -> str:
    res = transcribe(video_path)
    base = os.path.splitext(os.path.basename(video_path))[0]
    out = os.path.join(TRANSCRIPT_DIR, base + ".json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(res, f, ensure_ascii=False, indent=2)
    return out
