"""独立转写子进程：只加载 faster-whisper，不导入 chromadb/onnxruntime，
避免 onnxruntime 的 CUDA dll 干扰 ctranslate2 加载 cublas。
用法: python _transcribe_worker.py <wav> <out_json>
GPU-only：失败直接抛错（非零退出），由调用方决定是否终止。
"""
import sys, os, json, glob, site, time
os.environ.setdefault("HF_HUB_OFFLINE", "1")

# Windows 控制台默认 GBK，进度条/中文可能编码失败，强制 UTF-8 且不因编码报错中断
try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

# 把 nvidia 各包的 bin 目录加入进程 DLL 搜索路径，
# 否则 ctranslate2 在真正做 GEMM 时用 LoadLibrary("cublas64_12.dll") 按名字找不到它。
try:
    _dirs = []
    for _sp in list(site.getsitepackages()) + [site.getusersitepackages()]:
        _dirs += glob.glob(os.path.join(_sp, "nvidia", "*", "bin"))
    for _d in _dirs:
        try:
            os.add_dll_directory(_d)
        except Exception:
            pass
    # 同时加入 PATH，最大化被找到的概率
    os.environ["PATH"] = os.pathsep.join(_dirs) + os.pathsep + os.environ.get("PATH", "")
except Exception:
    pass

from faster_whisper import WhisperModel
from config import WHISPER_MODEL

def _fmt(sec):
    """秒 -> h:mm:ss / m:ss"""
    sec = int(max(sec, 0))
    h, m, s = sec // 3600, (sec % 3600) // 60, sec % 60
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m}:{s:02d}"


def _bar(frac, width=28):
    frac = min(max(frac, 0.0), 1.0)
    filled = int(frac * width)
    # 用 ASCII，避免 Windows GBK 控制台无法输出方块字符
    return "=" * filled + "-" * (width - filled)


def main():
    wav, out = sys.argv[1], sys.argv[2]
    print("[info] Whisper 尝试设备: cuda (GPU-only, 子进程)", flush=True)
    t_load = time.time()
    model = WhisperModel(WHISPER_MODEL, device="cuda", compute_type="int8")
    print(f"[info] Whisper 实际使用设备: cuda (模型加载 {time.time()-t_load:.1f}s)",
          flush=True)

    segs, info = model.transcribe(wav, beam_size=5, language="zh")
    total = getattr(info, "duration", 0) or 0
    print(f"[info] 音频总时长: {_fmt(total)}  开始转写...", flush=True)

    t0 = time.time()
    segments = []
    last_print, last_frac = 0.0, -1.0

    def _draw(pos, final=False):
        elapsed = time.time() - t0
        frac = min(pos / total, 1.0) if total else 0.0
        speed = (pos / elapsed) if elapsed > 0 else 0.0  # 音频秒/真实秒
        eta = ((total - pos) / speed) if (speed > 0 and total and not final) else 0
        sys.stdout.write(
            f"\r  [{_bar(frac)}] {frac*100:5.1f}%  "
            f"{_fmt(pos)}/{_fmt(total)}  "
            f"{len(segments)}段  {speed:.1f}x  已用{_fmt(elapsed)} "
            f"剩余~{_fmt(eta)}   "
        )
        sys.stdout.flush()

    for s in segs:
        segments.append({"start": s.start, "end": s.end, "text": s.text})
        now = time.time()
        frac = (s.end / total) if total else 0.0
        # 时间 or 进度增量双触发：GPU 很快时也能看到进度推进
        if now - last_print >= 1.0 or frac - last_frac >= 0.02:
            last_print, last_frac = now, frac
            _draw(s.end)
    _draw(total if total else (segments[-1]["end"] if segments else 0), final=True)
    sys.stdout.write("\n")
    sys.stdout.flush()

    data = {"language": info.language, "segments": segments}
    with open(out, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"[ok] 转写完成: {out} ({len(segments)} 段, 用时 {_fmt(time.time()-t0)})",
          flush=True)

if __name__ == "__main__":
    main()
