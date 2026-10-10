# 语音备忘录转写（FunASR / paraformer-zh）

把 macOS「语音备忘录」的录音转写成 `.paraformer.txt`（全文）/ `.txt`（逐句）/ `.srt`（带时间戳字幕）三个文件。

## 环境

| 依赖 | 位置 / 版本 | 说明 |
|---|---|---|
| python3 | `/Library/Developer/CommandLineTools/usr/bin/python3`（3.9） | 已装 `funasr==1.4.15`、`torch` |
| ffmpeg | `/opt/homebrew/bin/ffmpeg` | 用于 m4a → 16k 单声道 wav |
| 模型缓存 | `~/.cache/modelscope`（约 2 GB） | paraformer-zh / fsmn-vad / ct-punc，已缓存，不用重新下载 |

环境变量 `MODELSCOPE_ENDPOINT=https://www.modelscope.cn`（脚本内已 setdefault，走国内源）。

## 一、找到要转写的录音

录音文件与元数据在（注意不是 `~/Library/Application Support/...`）：

```
~/Library/Group Containers/group.com.apple.VoiceMemos.shared/Recordings/
```

**最新一条**要查数据库（`ZRECORDING` 表是空的，真实记录在 `ZCLOUDRECORDING`）：

```bash
cd ~/Library/Group\ Containers/group.com.apple.VoiceMemos.shared/Recordings/
sqlite3 CloudRecordings.db "SELECT datetime(ZDATE+978307200,'unixepoch','localtime') AS d,
  ROUND(ZDURATION,1) AS dur, ZPATH FROM ZCLOUDRECORDING ORDER BY ZDATE DESC LIMIT 10;"
```

`ZDATE` 是 Core Data 时间戳（2001-01-01 起算），`+978307200` 后转 Unix 时间。
**不要只看文件名排序**：文件名里的日期可能与实际录制日期不一致。

## 二、调用方式

```bash
python3 /Users/xqer/person_doc/语音备忘录转写/asr/transcribe.py \
  "<录音.m4a 完整路径>" \
  "/Users/xqer/person_doc/语音备忘录转写/<输出前缀>"
```

输出前缀建议用 `YYYYMMDD_HHMMSS`（与已有文件一致），例如 `20260916_185909`；
若录音自带标题（如「宝乐二街5-14号」），直接用标题做前缀。

**长音频必须后台跑**（CPU rtf≈0.36：76 分钟音频约 28 分钟，57 分钟约 14 分钟）：

```bash
cd /tmp && nohup python3 <脚本> <音频> <前缀> > /tmp/asr.log 2>&1 &
# 轮询（单次 sleep 别超过 240s，避免命令空闲超时）
pgrep -f transcribe.py >/dev/null && echo RUNNING || echo DONE
grep -o rtf_avg /tmp/asr.log | wc -l     # 已完成分块数
tail -c 200 /tmp/asr.log | tr '\r' '\n' | grep -E "CHARS|SENTENCES"
```

## 三、产物校验（每次必做）

1. `CHARS` 与 `SENTENCES` 都要 > 0；**SENTENCES=0 说明漏了 `sentence_timestamp=True`**，`.txt`/.srt` 会是空文件；
2. `.srt` 最后一条时间戳应接近音频时长（如 76 min 音频 → 末条约 `01:16:xx`）；
3. 抽样读开头/结尾各 5 句，确认没有大段漏转（VAD 误切）。

## 四、踩坑清单

| 坑 | 现象 | 解决 |
|---|---|---|
| m4a 直接喂 FunASR | 解码失败 / 结果异常 | 先 ffmpeg 转 16k 单声道 wav（脚本已自动做） |
| 只写 `output_timestamp=True` | `sentence_info=None` → txt/srt 全空，白跑半小时 | 必须同时传 `sentence_timestamp=True` |
| 长音频前台跑 | 命令超时被中断 | `nohup` 后台 + 轮询，日志里看 `rtf_avg` 计数 |
| 模型下载 | 走 huggingface 超时 | `MODELSCOPE_ENDPOINT=https://www.modelscope.cn`；模型已缓存则秒开 |
| 只看文件名排序 | 转错录音 | 用 `ZCLOUDRECORDING.ZDATE` 排序 |
| 轮询 sleep 太久 | 命令 idle 超时被取消 | 单次 sleep ≤ 240s，多次轮询 |

## 五、历史产物

| 文件前缀 | 内容 |
|---|---|
| `20260913_162952` / `20260914_145822` / `20260914_173427` | 面试复盘口述 |
| `20260916_185909` | 腾讯微信安全支付风控一面 → `面经_腾讯微信安全支付风控一面.md` |
| `宝乐二街5-14号` | 字节跳动风控算法一面 → `面经_字节跳动风控算法一面.md` |

> 同目录下的旧脚本 `asr_paraformer.py` 是早期版本（缺 `sentence_timestamp`，只写全文不写 srt/txt），已被 `asr/transcribe.py` 取代。
