"""语音备忘录转写（FunASR / paraformer-zh，CPU）

用法：
    python3 transcribe.py <音频文件> <输出前缀> [--keep-wav]

产物：
    <前缀>.paraformer.txt  全文（带标点，单段）
    <前缀>.txt             逐句文本（一句一行）
    <前缀>.srt             带时间戳字幕

示例：
    python3 transcribe.py "~/Library/Group Containers/group.com.apple.VoiceMemos.shared/Recordings/20260916 185909.m4a" \
        ~/person_doc/语音备忘录转写/20260916_185909

关键坑（已在本脚本内规避）：
1. m4a 不能直接喂 FunASR，需先 ffmpeg 转 16k 单声道 wav；
2. 只写 output_timestamp=True 拿不到句级时间戳（sentence_info 为 None，srt/txt 会写成空文件），
   必须同时传 sentence_timestamp=True；
3. 长音频（>30 min）CPU 推理很慢（rtf≈0.36，76 min 音频约需 28 min），必须后台跑 + 轮询。
"""

import os
import subprocess
import sys
import tempfile

os.environ.setdefault("MODELSCOPE_ENDPOINT", "https://www.modelscope.cn")

from funasr import AutoModel  # noqa: E402

FFMPEG = "/opt/homebrew/bin/ffmpeg"


def srt_time(ms):
    h = int(ms // 3600000)
    m = int((ms % 3600000) // 60000)
    s = int((ms % 60000) // 1000)
    ms = int(ms % 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def to_wav16k(src, dst):
    subprocess.run(
        [FFMPEG, "-y", "-i", src, "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", dst],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    audio = os.path.expanduser(sys.argv[1])
    out_prefix = os.path.expanduser(sys.argv[2])
    keep_wav = "--keep-wav" in sys.argv

    tmp_wav = None
    if not audio.lower().endswith(".wav"):
        tmp_wav = os.path.join(tempfile.gettempdir(), os.path.basename(audio) + ".16k.wav")
        to_wav16k(audio, tmp_wav)
        audio = tmp_wav

    try:
        model = AutoModel(
            model="paraformer-zh",
            vad_model="fsmn-vad",
            punc_model="ct-punc",
            device="cpu",
        )
        res = model.generate(
            input=audio,
            batch_size_s=300,
            output_timestamp=True,
            sentence_timestamp=True,
        )

        r = res[0]
        text = r.get("text", "")
        sents = r.get("sentence_info", [])

        with open(out_prefix + ".paraformer.txt", "w", encoding="utf-8") as f:
            f.write(text + "\n")

        with open(out_prefix + ".txt", "w", encoding="utf-8") as f:
            for s in sents:
                f.write(s.get("text", "").strip() + "\n")

        with open(out_prefix + ".srt", "w", encoding="utf-8") as f:
            for i, s in enumerate(sents, 1):
                st = s.get("start", 0) or 0
                en = s.get("end", 0) or 0
                if isinstance(st, float) or st < 1000:
                    st, en = int(st * 1000), int(en * 1000)
                f.write(f"{i}\n{srt_time(st)} --> {srt_time(en)}\n{s.get('text', '').strip()}\n\n")

        print("CHARS:", len(text))
        print("SENTENCES:", len(sents))
        if not sents:
            print("WARN: sentence_info 为空，检查是否漏了 sentence_timestamp=True", file=sys.stderr)
    finally:
        if tmp_wav and not keep_wav and os.path.exists(tmp_wav):
            os.remove(tmp_wav)


if __name__ == "__main__":
    main()
