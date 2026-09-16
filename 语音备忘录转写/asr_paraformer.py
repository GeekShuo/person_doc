import os
import sys

os.environ.setdefault("MODELSCOPE_ENDPOINT", "https://www.modelscope.cn")

from funasr import AutoModel

audio = sys.argv[1]
out = sys.argv[2]

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
)

text = res[0].get("text", "")
with open(out, "w", encoding="utf-8") as f:
    f.write(text + "\n")

print("CHARS:", len(text))
print("SENTENCES:", len(res[0].get("sentence_info", [])))
