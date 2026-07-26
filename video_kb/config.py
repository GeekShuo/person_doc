import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
KIMI_API_KEY = os.getenv("KIMI_API_KEY", "")
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
VISION_PROVIDER = os.getenv("VISION_PROVIDER", "gemini").lower()
VISION_MODEL = os.getenv("VISION_MODEL", "gemini-2.5-flash")
WHISPER_MODEL = os.getenv("WHISPER_MODEL", "medium")

# 工作目录（所有中间产物都放在这里）
WORK_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "data"))
RAW_DIR = os.path.join(WORK_DIR, "raw")          # 原始视频
TRANSCRIPT_DIR = os.path.join(WORK_DIR, "transcripts")
VISUAL_DIR = os.path.join(WORK_DIR, "visual")
NOTES_DIR = os.path.join(WORK_DIR, "notes")
KB_DIR = os.path.join(WORK_DIR, "chroma")

for _d in (WORK_DIR, RAW_DIR, TRANSCRIPT_DIR, VISUAL_DIR, NOTES_DIR, KB_DIR):
    os.makedirs(_d, exist_ok=True)
