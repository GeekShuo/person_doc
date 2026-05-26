9nctl-magnus-training skill

# 9nctl-magnus-training

---

name: 9nctl-magnus-training

description: Submit GPU training jobs on JD Cloud via 9Nctl magnus — resource checking, submission templates, CFS tricks, pitfalls

version: 1.0

---

# 9Nctl Magnus Training Job Submission

Submit GPU training jobs on JD Cloud via 9Nctl magnus.

## Key Rules (MUST follow)

1. **argparse must use `parse_known_args()`** — magnus injects `--master_addr`, `--master_port`, etc. `parse_args()` crashes with exit code 2.

2. **Logs must write to CFS** — pod is deleted when job finishes. In Python entry, tee stdout/stderr to a CFS log file, write crash traceback to CFS, and flush results incrementally (CSV/JSON/etc.). Do NOT rely on `9Nctl logs` after completion. Use `subprocess.Popen` + write to CFS file for wrapper entries (NOT `os.execvp` which loses magnus stdout capture).

- For eval/inference jobs, prefer the wrapper template in `templates/eval_wrapper.py`: set `entrance_filename` to the wrapper, and let it run the real eval script as a child. This captures import-time failures (e.g. torch/CUDA/lib errors) that happen before the child script can create its own log.

3. **Hermes analysis must be recorded** — when diagnosing/submitting experiments, append a concise note to the project report/log (what failed, what changed, new job id, where logs/results are saved) so analysis is not only in chat.

4. **Shell entry script should NOT use `set -e`** — one command failure kills the whole script silently.

5. **Container CFS path is `/home/pengshuo.10/`** — NOT `/media/cfs/pengshuo.10/` (that's host-only). Auto-detect both in entry script for safety.

6. **1024M upload limit** — 9Nctl uploads the entire submission directory. Don't put data/models in the submission dir; reference them via CFS absolute paths in code.

7. **Don't keep modifying a single submission** — create separate directories per GPU type (e.g., `submit_g1/`, `submit_g5/`) so you can quickly submit to whichever queue has resources.

8. **`entrance_filename` MUST be `.py`, NOT `.sh`** — magnus framework fails silently with `.sh` entry files on multi-GPU. Pod starts then immediately dies with no logs.

9. **DataLoader on CFS: `num_workers=0, pin_memory=False`** — CFS is a network filesystem. Multiple worker processes cause OOM kills. Single-process reads are more stable. **Exception: if you copy data to `/tmp` local disk first**, you CAN sometimes use `num_workers=4-8, pin_memory=True` for speedup (see Data-to-/tmp section). **BUT**: even with data on /tmp, `num_workers=8` may still cause DataLoader worker OOM kills on magnus containers (error: `RuntimeError: DataLoader worker (pid XXXX) is killed by signal: Terminated`). This is because each worker forks the entire Python process including loaded model weights. On memory-constrained containers, use `num_workers=0` or at most `num_workers=2`. The error is misleading (shows in conv2d/forward stack trace) — it's actually an OOM kill of the DataLoader worker, not a model bug.

10. **Multi-GPU DDP: DO NOT use torchrun** — magnus aggressively occupies ports (29500, 29501, 39501, 40000, etc.), and `find_free_port()` race-conditions (port is free at probe time but taken by magnus before torchrun binds). Also `--rdzv_backend=file` is not registered in torch 2.10. **Solution: manually spawn N processes with env vars** (MASTER_ADDR, MASTER_PORT, RANK, LOCAL_RANK, WORLD_SIZE), use random port 50000-60000. See template below.

## Resource Quota Checking

```bash

9Nctl group <group_name> # Shows Used vs Quota for all resource types

9Nctl user # Shows all groups you belong to

```

Check ALL your groups for available GPU quota before submitting. Example output:

```

limits.g5 217.00 0.00 ← quota=0, over-provisioned

limits.g1 0 48.00 ← has quota!

```

Only submit GPU types where Quota > Used. When CPU/memory are also over-provisioned (Used > Quota), jobs may get stuck in PENDING.

## Submission Commands

```bash

# Submit job (trailing "." is required!)

cd ~/submit_dir && 9Nctl start --mode=magnus -g <group> --enable_queue --ratio=0.99 --tensorboard --task_property=exp --queue_priority high .

```

## Key Pitfalls (updated 2026-05)

1. **magnus.py SDK import conflict**: See Template section below — never use `from magnus.sdk import`.

2. **Entry script MUST log to CFS**: Magnus containers are deleted after completion. All output (stdout/stderr) is lost unless written to CFS. Wrap subprocess calls with line-by-line tee to a CFS log file:

```python

with open(f"{proj}/logs/job_{timestamp}.log", "w") as lf:

proc = subprocess.Popen([sys.executable, "-u", "script.py"], stdout=subprocess.PIPE, stderr=subprocess.STDOUT)

for line in proc.stdout:

decoded = line.decode("utf-8", errors="replace")

print(decoded, end="", flush=True)

lf.write(decoded)

lf.flush()

```

3. **Tar.gz snapshot vs CFS runtime**: 9Nctl uploads the submission directory as a tar.gz snapshot at submit time. But entry scripts that `cd` to a CFS project dir and run scripts from there will pick up CFS changes in real-time. So: fix bugs in CFS files AFTER submission and they'll take effect on next run.

4. **Bash CWD gets stuck**: If terminal's CWD directory is deleted (e.g. `rm -rf`), all subsequent `cd` calls fail with "getcwd: cannot access parent directories". Use `workdir="/home/pengshuo.10"` parameter on terminal tool to reset.

5. **Python `import *` inside functions**: SyntaxError in Python 3 (may be allowed in 3.12+ but don't rely on it). Keep all `from X import *` at module level.

6. **Function location matters**: Before writing imports, verify which module each function/class lives in by grepping `def func_name` / `class ClassName`. Don't assume based on name similarity.

## magnus.py Template

**CRITICAL: Do NOT use `from magnus.sdk import RunBase, Task`** — 9Nctl adds the project directory to sys.path before parsing magnus.py, so Python finds your magnus.py as the `magnus` module first, causing `ImportError: No module named 'magnus.sdk'; 'magnus' is not a package`. Use the variable-based format below instead.

```python

from datetime import datetime

current_time = datetime.now().strftime("%Y_%m%d_%H%M%S")

# G5 (B200 183GB): ubuntu24.04 mirror

# G1 (V100 32GB): centos7 mirror (may fail — test first)

framework = "magnus:ubuntu24.04-cuda12.8-torch2.10-magnus-gpu_v1.8.0"

# framework = "magnus:centos7-cuda12.8-torch2.7-magnus-gpu_v1.4.0"

python_home = "/usr/local/miniconda3/bin"

log_dir = "./log_dir"

roles = ["master"]

gpu_num = 8 # adjust per GPU type

master = dict(count=1, cpu=12*gpu_num, mem=100*gpu_num, gpu=f"g5:{gpu_num}")

cloud_tags = {'cluster': 'dt02', 'node': '', 'use_gpu': True} # official format requires all 3 fields

entrance_filename = "run_train.py" # MUST be .py, not .sh

ds_param = dict()

global_parameters = dict()

```

## run_train.sh Template

```bash

#!/bin/bash

set -x # echo commands for debugging

LOG_DIR="/home/pengshuo.10/<project>/logs"

mkdir -p $LOG_DIR

LOG_FILE="$LOG_DIR/train_$(date +%Y%m%d_%H%M%S).log"

exec > >(tee -a $LOG_FILE) 2>&1

echo "=== Environment ==="

date

python3 --version

nvidia-smi --query-gpu=name,memory.total --format=csv,noheader

# Install deps (JD mirror only)

pip install <packages> -i http://mirrors.jd.com/pypi/web/simple --trusted-host mirrors.jd.com -q

python3 -c "import torch; print(f'torch {torch.__version__}, cuda={torch.cuda.is_available()}, gpus={torch.cuda.device_count()}')"

export PYTHONPATH="~/<project>:$PYTHONPATH"

cd ~/<project>

# Single GPU:

python3 -m src.train --data_root ~/<project>/data ...

# Multi-GPU DDP:

torchrun --nproc_per_node=4 --nnodes=1 --master_port=29500 -m src.train --ddp ...

echo "=== Done at $(date) ==="

```

## CFS File Extraction Performance

Unzipping many small files (e.g. 7000+ PNGs) directly to CFS is EXTREMELY slow (hours). Instead:

```python

# Extract to local /tmp first (seconds!), then copy to CFS

import zipfile

with zipfile.ZipFile(src) as zf:

zf.extractall('/tmp/tmp_data') # 4 seconds!

# Then: cp -r /tmp/tmp_data/data /home/pengshuo.10/project/data

```

## Data-to-/tmp for Training Speed (CRITICAL for small datasets)

For small datasets (CROHME ~300MB), copying from CFS to `/tmp` at training start lets you use `num_workers=8` + `pin_memory=True`, giving 3-5x speedup on B200:

```python

# In run_train.py, BEFORE spawning training processes:

local_data = "/tmp/CROHME_final"

if not os.path.isdir(local_data):

# Use cp -r, NOT shutil.copytree (CFS small-file hell)

subprocess.run(["cp", "-r", f"{CFS}/project/data", local_data], timeout=300)

```

Then in train.py, add `--local_data` arg that overrides `--data_root`:

```python

data_root = Path(args.local_data) if args.local_data else Path(args.data_root)

# DataLoader(..., num_workers=args.num_workers, pin_memory=args.pin_memory)

```

**Important**: `cp -r` from CFS is much faster than `shutil.copytree`. And don't use `zipfile.extractall` from a CFS zip — the zip may not exist on CFS. Use `cp -r` of the already-extracted directory.

## Job Management

```bash

9Nctl list # List running jobs

9Nctl status <job_name> # Check status (PENDING/RUNNING/FAILED/SUCCEEDED)

9Nctl logs <job_name> # View logs (only while pod exists)

9Nctl clean <job_name> # Delete job

9Nctl query # View queue position

```

## run_train.py Template (PREFERRED over .sh)

```python

"""

magnus训练入口 — 被9Nctl调用

关键: 1) .py入口 2) 动态探测端口 3) subprocess写CFS日志 4) 自动判断CFS路径

"""

import os, subprocess, sys, time

# Auto-detect CFS mount point

if os.path.isdir("/home/pengshuo.10/<project>"):

CFS = "/home/pengshuo.10"

elif os.path.isdir("/media/cfs/pengshuo.10/<project>"):

CFS = "/media/cfs/pengshuo.10"

else:

print("ERROR: CFS mount not found", flush=True)

sys.exit(1)

# Log to CFS (pod deleted after job finishes)

log_dir = os.path.join(CFS, "<project>/logs")

os.makedirs(log_dir, exist_ok=True)

log_file = os.path.join(log_dir, f"train_{time.strftime('%Y%m%d_%H%M%S')}.log")

# Install deps (JD mirror)

subprocess.run([

sys.executable, "-m", "pip", "install",

"opencv-python-headless", "scipy", "Pillow",

"-i", "http://mirrors.jd.com/pypi/web/simple",

"--trusted-host", "mirrors.jd.com", "-q"

], check=False)

import torch

print(f"torch {torch.__version__}, cuda={torch.cuda.is_available()}, gpus={torch.cuda.device_count()}", flush=True)

# ── Multi-GPU DDP: manually spawn processes (NOT torchrun) ──

# torchrun fails because magnus occupies ALL common ports (29500, 29501, 39501, 40000+).

# find_free_port() has race condition — port free at probe but taken before bind.

# --rdzv_backend=file doesn't work in torch 2.10 (KeyError: 'file').

# Solution: set env vars manually, spawn N processes, use random port 50000-60000.

import random

nproc = torch.cuda.device_count()

master_addr = "127.0.0.1"

master_port = random.randint(50000, 60000) # magnus doesn't occupy this range

env_base = os.environ.copy()

env_base["PYTHONPATH"] = os.path.join(CFS, "<project>") + ":" + env_base.get("PYTHONPATH", "")

env_base["MASTER_ADDR"] = master_addr

env_base["MASTER_PORT"] = str(master_port)

env_base["WORLD_SIZE"] = str(nproc)

procs = []

for rank in range(nproc):

env = env_base.copy()

env["RANK"] = str(rank)

env["LOCAL_RANK"] = str(rank)

cmd = [

sys.executable, "-u", "-m", "src.train",

"--data_root", os.path.join(CFS, "<project>/data"),

"--batch_size", "64",

"--epochs", "80",

"--save_dir", os.path.join(CFS, "<project>/checkpoints"),

"--ddp",

]

rank_log = os.path.join(log_dir, f"rank{rank}.log")

lf = open(rank_log, "w")

p = subprocess.Popen(cmd, cwd=os.path.join(CFS, "<project>"), env=env,

stdout=lf, stderr=subprocess.STDOUT)

procs.append((p, lf, rank))

print(f"Started rank {rank}, pid={p.pid}", flush=True)

for p, lf, rank in procs:

p.wait()

lf.close()

print(f"Rank {rank} exited with code {p.returncode}", flush=True)

# Consolidate rank logs into main log

with open(log_file, "w") as main_lf:

for rank in range(nproc):

with open(os.path.join(log_dir, f"rank{rank}.log")) as rf:

main_lf.write(f"\n===== Rank {rank} =====\n")

main_lf.write(rf.read())

# Single GPU (no DDP):

# cmd = [sys.executable, "-u", "-m", "src.train", ...]

# env = os.environ.copy()

# env["PYTHONPATH"] = os.path.join(CFS, "<project>") + ":" + env.get("PYTHONPATH", "")

# with open(log_file, "w") as lf:

# proc = subprocess.Popen(cmd, cwd=os.path.join(CFS, "<project>"), env=env,

# stdout=subprocess.PIPE, stderr=subprocess.STDOUT)

# for line in proc.stdout:

# decoded = line.decode("utf-8", errors="replace")

# print(decoded, end="", flush=True)

# lf.write(decoded)

# lf.flush()

# proc.wait()

# sys.exit(proc.returncode)

```

## Pitfalls

- **G1 on dt02 consistently fails** with "资源申请超过节点资源规格的上限" regardless of mirror (both centos7 and ubuntu24.04) and even with minimal resources (cpu=8, mem=32, gpu=g1:1). This appears to be a dt02 cluster-level issue, not a mirror problem. Use g5 instead if available.

- **Failed jobs with no logs** — if CFS log dir wasn't created, the container likely crashed before the script ran. Check: missing execute permission on run_train.sh, wrong CFS path, incompatible mirror.

- **DDP checkpoint loading** — single-GPU checkpoints don't have `module.` prefix; DDP model does. Handle both cases when resuming.

- **PyTorch 2.10 renamed `total_mem` → `total_memory`** — if code accesses GPU memory info, handle both names.

- **`os.execvp` loses magnus stdout** — magnus can't capture execvp'd process output, so `9Nctl logs` shows nothing. Use `subprocess.Popen` instead.

- **Multi-GPU DDP: must use manual process spawning, NOT torchrun** — magnus occupies all common ports. `find_free_port()` has race condition. `--rdzv_backend=file` not supported in torch 2.10. Proven solution: manually set MASTER_ADDR/MASTER_PORT/RANK/LOCAL_RANK/WORLD_SIZE env vars, spawn N processes with subprocess.Popen, use random port 50000-60000. Each rank writes to its own log file, consolidate after training.

- **`--rdzv_backend=file` raises ValueError in torch 2.10** — "The rendezvous backend 'file' is not registered." Only `c10d` (TCP-based) is available, which requires a free port.

`

```

- **subprocess POPEN for eval/inference must set PYTHONPATH** — training via `python -m src.train` auto-adds src to sys.path, but `subprocess.Popen([python, "eval_offline.py"])` does NOT. Always pass `env` with PYTHONPATH set to project root.

- **9Nctl status FAILED doesn't always mean actual failure** — magnus marks FAILED when: exit code ≠ 0, pod preempted, or health check fails. Always check CFS logs/checkpoints for real results. Don't rely on 9Nctl status label alone. If the CFS wrapper log shows every experiment finished, a `DONE outdir=...` marker was written, and expected artifacts such as `summary.csv`/figures exist, treat the run as result-complete even if 9Nctl says FAILED. One observed pattern is a post-completion Python shutdown issue: `Exception ignored in sys.unraisablehook` with `EXIT_CODE=120` after `DONE`; in that case record the run as completed-with-exit-code-noise rather than resubmitting blindly.

- **Official submission command has extra flags** — `--reclaimable=True --start_timeout=3600 --idle_timeout_failed=48 --speed_net` are recommended by official docs. `--speed_net` enables network acceleration (skip for NPU).

- **Eval/inference jobs should use 1 GPU** — multi-GPU containers spawn N processes (one per GPU), all executing the same entry script. For eval you only need 1 process. Use `gpu="g5:1"` or guard with `if int(os.environ.get("LOCAL_RANK", 0)) == 0:`.

- **Eval wrappers catch import-time crashes** — if the real eval script imports `torch`/CUDA libs at module level, it can crash before its own `if __name__ == "__main__"` logger is created. Put a small wrapper as `entrance_filename` that imports only stdlib, creates the CFS log first, then launches the real eval script with `subprocess.Popen(stdout=PIPE, stderr=STDOUT)` and tees each line. See `templates/eval_wrapper.py`. Keep the real eval script in the submission tarball if you want to avoid CFS sync delay.

- **Never depend on CFS files for eval scripts** — CFS has sync delays (seconds to tens of seconds). If you modify `eval_offline.py` on the host, the container may read the old version. Instead, inline ALL eval logic directly in `run_train.py` (which 9Nctl uploads as a tarball, bypassing CFS sync).

- **Always verify source code before writing eval scripts** — checkpoint keys (`model` vs `model_state_dict`), model `__init__` signatures, and `collate_fn` return formats (tuple vs dict) differ from what you might assume. Read the actual source code on CFS first, or add `print(list(ckpt.keys()))` / `print(type(batch))` as first step in eval.

- **Eval script template must use try-except with CFS logging** — container crashes silently if you don't. Create log file FIRST, then log every step. Wrap imports, model loading, and inference in try-except with `traceback.format_exc()` written to CFS log.

- **`from module import *` is NOT allowed inside functions in Python 3** — this causes SyntaxError at import time. Always put `import *` statements at module level. If you need conditional imports, use explicit `from module import name1, name2` instead.

- **When entry script calls code from CFS (not in tar), CFS sync delay applies** — magnus uploads only the submission directory as a tar.gz. If your entry script calls scripts from CFS (e.g., `subprocess.run([python, "/home/user/project/train.py"])`), those files are read from CFS at runtime. Any edits you made seconds before submitting may not have synced yet. Wait ~60s after editing CFS files, or verify with `head -5 /media/cfs/.../file.py` before submitting.

- **Verify import paths before submitting magnus jobs** — multiple failed submissions were caused by importing functions from the wrong module (e.g., `set_unified_seed` from `signal_creation` when it's in `utils`, `generate_gaped_doa` from `signal_creation` when it's in `data_handler`). Before submitting, grep the actual file: `grep -rn "def function_name" src/` to confirm the module location.

- **Multi-GPU containers spawn N entry script processes** — magnus launches `run_train.py` once PER GPU (setting LOCAL_RANK=0,1,2,...). If your entry script spawns N DDP processes, you get N×N total processes (e.g., 8×8=64 on 8-GPU), causing chaos: 8 processes simultaneously cp data to /tmp, 8 processes each launching 8 DDP ranks. **Fix: guard entry with `if int(os.environ.get("LOCAL_RANK", 0)) != 0: sys.exit(0)` — only LOCAL_RANK=0 runs the actual logic, others exit immediately.**

- **CFS sync delay applies to source code too** — modifying `src/train.py` on the host machine takes seconds to tens of seconds to sync to the container. If you fix a bug and resubmit immediately, the container may still read the old version. Wait ~60s after editing, or verify with `head -5 /media/cfs/.../train.py` before submitting.

- **Multi-experiment submission pattern** — for running N ablation/comparison experiments (e.g., baseline vs augment vs different model), create `submit_exp{1,2,3,4}/` directories each with identical `magnus.py` (1-card template) and a `run_train.py` that differs only in: (1) CFS log/checkpoint paths, (2) training command flags (e.g., `--augment`), (3) PYTHONPATH for cross-project imports. Use `LOCAL_RANK!=0` guard since magnus spawns 1 process per GPU but you only want 1. Submit all 4 with `9Nctl start` from each directory, then set up a single cron job to monitor all task IDs..

- **8-GPU DDP long training NCCL ALLREDUCE timeout is sporadic** — jobs running 200+ epochs on 8×B200 frequently hit `ProcessGroupNCCL Watchdog caught collective operation timeout: WorkNCCL OpType=ALLREDUCE ran for 600000 milliseconds`. This causes exit code -6 (SIGABRT) and magnus marks the job FAILED. **But training is usually already complete** — checkpoints saved, logs written. Check CFS logs/checkpoints before assuming real failure. Root cause unclear (possibly GPU thermal throttling, NCCL bug, or network hiccup on long runs). Workaround: just resubmit if needed.

- **GPU eval: topk/argmax indices on different device than indexed tensor** — When model output is on GPU, `torch.topk(pred, k).indices` returns GPU tensor. Using it to index a CPU tensor (e.g., `angles_grid[topk_indices]`) crashes with `RuntimeError: indices should be either on cpu or on the same device`. Fix: always `.cpu()` on indices before indexing CPU tensors, or move the indexed tensor to the same device. **Also**: any GPU tensor must call `.cpu()` before `.numpy()` — calling `.numpy()` on a CUDA tensor raises `TypeError: can't convert cuda:0 device type tensor to numpy`. This is a common eval crash when iterating test samples one-by-one on GPU.

- **Don't import optional packages at module level in model files** — `from torchsummary import summary` in models.py crashes in magnus containers where torchsummary isn't installed, even if the import is only used in `if __name__`. Any code importing from models.py (including training scripts) will crash before reaching main(). Fix: either remove the import and replace `summary(model, input)` with `print(model)` + `sum(p.numel() for p in model.parameters())`, or guard with try/except.

- **Inline model + training code in run_train.py for robustness** — importing from CFS (e.g., `from src.models import DeepCNN`) is fragile: CFS sync delays, missing packages at import time, PYTHONPATH issues. For critical training jobs, inline the entire model definition and training loop directly in run_train.py. This makes the tarball self-contained — no CFS dependency except for data loading. The trade-off is code duplication, but it eliminates a whole class of submission failures.

- **Standalone eval/diagnose scripts fail on magnus, use training script as base** — writing a standalone diagnose_fresh_gap.py / diagnose_v2.py as entrance_filename consistently FAILED (4 times in a row) with no logs or error output. The container crashes silently before producing any stdout. **Solution**: copy a known-working training script (e.g., run_train_v3.py), replace its main() function with eval/diagnose logic only, keep all the same imports and utility functions. This guarantees the same environment that successfully ran training. The standalone scripts likely fail due to missing dependencies, import errors, or torch.load issues that only manifest in the container's Python environment — but you never see the error because the container is deleted before you can debug.

- **CRITICAL: Add try-except with CFS crash log to ALL magnus entry scripts** — when scripts crash in magnus containers, there are ZERO diagnostics. Pod is deleted immediately. `9Nctl logs` returns "任务已删除". **Pattern**:

```python

if __name__ == "__main__":

try:

main()

except Exception as e:

import traceback

err_path = Path(CFS_PROJECT) / "logs" / "crash.log"

with open(err_path, "w") as f:

f.write(traceback.format_exc())

print(f"CRASH: {e}", flush=True)

raise

```

This saved us from 5+ failed submissions with no logs — we found `NameError: name 'use_trace_norm' is not defined` and `KeyError: 'Y'` this way.

- **NameError from undefined variables in main()** — when refactoring training scripts into eval/diagnose versions, global variables referenced in main() (like `use_trace_norm`) may not exist. Always define all needed variables at the top of main() or pass them explicitly.

- **torch.load data key naming: use .get() with fallback** — different scripts save with different keys: `"Y"` vs `"doas_rad"` for angle labels, `"doas_deg"` may or may not exist. Use `test_d.get('Y', test_d.get('doas_rad'))` to handle both cases.

- **torch.load data key naming inconsistency** — when saving test data with `torch.save({"X": ..., "Y": ..., "doas_deg": ...})` but loading with `test_d['doas_rad']`, you get a silent KeyError crash. Different scripts may use different key names for the same data (`"Y"` vs `"doas_rad"` for angle labels). **Always use `.get()` with fallback**: `test_Y = test_d.get('Y', test_d.get('doas_rad'))`. This is especially critical for eval/diagnose scripts that load data generated by a different training script.

- **9Nctl CLI commands can hang indefinitely** — `9Nctl status`, `9Nctl list`, `9Nctl logs` may never return, even with timeout. Don't rely on them for monitoring. Instead: (1) submit with `nohup` in background, (2) monitor by checking CFS log file size/content directly with `stat -c%s` and `grep`, (3) use a shell while/sleep loop that checks for completion markers in the log file (e.g., `=== Results ===` or `Exit code:`).

-

-

- **9Nctl uploads a tar.gz SNAPSHOT at submit time** — changes to CFS files AFTER `9Nctl start` are NOT reflected in the running container. The container uses the uploaded tarball. **BUT**: if run_train.py calls scripts from CFS (e.g., `subprocess.run([python, "train.py"], cwd=CFS_PROJECT_DIR)`), those CFS scripts ARE read at runtime and will reflect changes. However, the tarball itself (magnus.py, run_train.py) is fixed. **Gotcha**: if you edit run_train.py on CFS after a failed submission, you MUST resubmit — the old tarball with old run_train.py is what magnus uses. Similarly, if train.py on CFS has a missing argparse definition that run_train.py passes, the container will crash with AttributeError because it reads the current (buggy) CFS train.py at runtime.

- **Always add argparse definitions for ALL flags passed by run_train.py** — a common crash pattern: run_train.py passes `--warmup_epochs 5` but train.py's argparse only has the variable referenced in code (`args.warmup_epochs`) without the corresponding `parser.add_argument("--warmup_epochs", ...)`. This causes `AttributeError: 'Namespace' object has no attribute 'warmup_epochs'`. Before submitting, grep for all `args.X` in train.py and verify each has a matching `add_argument`.

- **`from x import *` inside functions is a SyntaxError in Python 3** — all `import *` statements must be at module level. If using `from src.signal_creation import *` etc., place them at the top of the file, NOT inside `main()` or any other function.

- **CFS logging is mandatory for grid search / multi-config jobs** — use `subprocess.Popen(stdout=PIPE)` + write each line to a CFS log file AND print to stdout. Without CFS logs, pod deletion after FAILED means zero diagnostics.

- **Verify which module exports which function when using `import *`** — e.g., `set_unified_seed` is in `src.utils`, not `src.signal_creation`. When switching from function-level to module-level imports, check that all called functions are actually available.

- **`Vocab(path)` vs `Vocab.load(path)`** — common eval script bug: passing a file path string to `Vocab.__init__(tokens)` which expects a list of strings. The correct classmethod is `Vocab.load(path)`. Similarly, use `vocab.size` not `len(vocab)` (Vocab has no `__len__`). Always verify class API before writing eval scripts.

- **`torch.load` on CFS is extremely slow** — loading a 177MB checkpoint from CFS can hang indefinitely even inside a container with GPU. **Must `shutil.copy2` checkpoint to `/tmp` first, then `torch.load` from local disk.** Add progress logging between each step (copy, load, state_dict, to GPU) to diagnose where hangs occur.

- **`os.path.expanduser("~")` returns `/root` inside magnus container, NOT `/home/pengshuo.10/`** — the CFS user directory is mounted at `/home/pengshuo.10/` inside the container, but `~` expands to `/root`. If your training script uses `expanduser("~")` to find data/CFS paths, it will get `/root/DeepCNNDoA-main/data/` which doesn't exist. **Fix**: entry script (run_train.py) detects CFS mount and sets `os.chdir(CFS_PROJECT_DIR)`. Training scripts called from entry should use `os.getcwd()` instead of `expanduser("~")` to inherit the correct path. Never call `expanduser("~")` inside training code that runs in magnus containers

- **Monitoring mode choice** — default to a shell `while/sleep` loop writing to a CFS log file for cheap status-only monitoring, not Hermes cron. If the user explicitly wants Hermes to reason over live logs and adjust/retry jobs, use a Hermes cron adaptive monitor with `deliver=local`, restricted toolsets, pinned `workdir`, and a self-contained prompt containing job ids, log paths, decision rules, and the resubmit command. See `references/hermes-adaptive-monitoring.md` for the copyable pattern. Minimal status loop:

```bash

LOG=~/project/logs/monitor.log; > $LOG

while true; do

s=$(timeout 10 9Nctl status <job_id> 2>&1 | head -1)

echo "[$(date '+%H:%M:%S')] <job_id> $s" >> $LOG

if [ "$s" = "SUCCEEDED" ] || [ "$s" = "FAILED" ]; then

tail -10 ~/project/logs/eval.log >> $LOG; break

fi

sleep 180

done

```

Run with `terminal(background=true, notify_on_complete=true)`. Use Hermes cron only for adaptive reasoning/action, not simple polling.

# # Hermes-internal adaptive monitoring for Magnus jobs

Use this when the user explicitly wants Hermes itself to reason over live results and adjust/retry jobs, not just a lightweight status loop.

## Pattern

Run two layers:

1. Lightweight shell monitor (preferred default for status-only monitoring)

- `while true; do timeout 20 9Nctl status <job>; tail CFS logs; sleep 180; done`

- Writes to a CFS monitor log.

- Good for heartbeat/status and avoids burning LLM calls.

2. Hermes cron adaptive monitor (only when reasoning/action is needed)

- Schedule every 5-10 minutes with `deliver=local` to avoid chat spam.

- Restrict toolsets to `terminal,file,skills` unless more are needed.

- Pin `workdir` to the project directory.

- Prompt must be self-contained because cron runs in a fresh session.

- Prompt must include job id, project path, log pointer files, project report path, explicit decision rules, and a re-submit command template.

## Decision rules to put in the cron prompt

- Always check `timeout 20 9Nctl status <job>` but continue even if 9Nctl hangs/fails.

- Prefer CFS logs over 9Nctl logs; pods may be deleted after job completion/failure.

- If status is PENDING/RUNNING and CFS log is growing normally: append a heartbeat only.

- If logs contain `Traceback`, `CRASH`, nonzero exit code, or status FAILED:

- Patch and resubmit only for obvious mechanical bugs: argparse/path/import optional package/CUDA tensor `.cpu()`/missing dir/`torch.load(weights_only=False)`/small refactor errors.

- Do not retrain if only evaluation crashed and checkpoints/results already exist; submit eval-only job instead.

- Record any new job id, submit output, crash traceback path, and log path to CFS.

- If SUCCEEDED or final result table appears: parse metrics and append a compact result table and conclusion to the project report.

## Prompt skeleton

```text

你是 <project> 的 Hermes 内部自适应监控器。目标：根据实时日志/状态自动判断是否需要修复、重交或总结结果。

固定信息：

- job: <job_id>

- project: <CFS project path>

- submit_dir: <submit dir>

- submit_log: <submit log>

- raw monitor log: <CFS monitor log>

- latest wrapper pointer: <path or N/A>

- latest outdir pointer: <path or N/A>

- project status report: <report path>

每次运行必须做：

1. `timeout 20 9Nctl status <job_id>`；失败也继续查 CFS 日志。

2. tail 最新 wrapper/eval/train log 和 outdir 结果文件；不要读超大文件。

3. 按上述 decision rules 行动。

4. 所有动作写入 `<project>/logs/hermes_adaptive_monitor.log`。

重交命令模板（只有确认需要重交时才运行）：

cd <submit_dir>

<env vars> 9Nctl start --mode=magnus -g <group> --enable_queue --ratio=0.99 --tensorboard --task_property=exp --queue_priority high --reclaimable=True --start_timeout=3600 --idle_timeout_failed=12 --speed_net .

```

## Example Hermes cron creation

Use the `cronjob` tool or CLI equivalent:

- schedule: `every 5m`

- repeat: enough to cover expected runtime

- deliver: `local`

- skills: `["9nctl-magnus-training"]`

- enabled_toolsets: `["terminal", "file", "skills"]`

- workdir: project root

## Pitfalls

- Do not use Hermes cron for simple status-only monitoring; a shell sleep loop is cheaper and more reliable.

- Do not let adaptive cron spam the active conversation; use `deliver=local` unless the user asks for live chat updates.

- Cron prompts must not depend on current chat context; include all paths and job ids explicitly.

- Do not create recursive cron jobs from inside a cron run.