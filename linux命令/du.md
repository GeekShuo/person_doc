 基本语法

  du [选项] [目录/文件]

  常用选项

  -h (human-readable) - 人类可读格式

  du -h /tmp
  # 输出：4.0K    /tmp/file1
  #      12M     /tmp/logs

  -s (summarize) - 显示总计

  du -sh /tmp
  # 输出：156M   /tmp

  -a (all) - 显示所有文件和目录

  du -ah /home

  -c (total) - 显示总计

  du -ch /tmp/*  # 最后会有一行 total

  --max-depth=N - 限制显示深度

  du -h --max-depth=1 /   # 只显示一级目录
  du -h --max-depth=2 /home  # 显示两级目录

  常用组合

  1. 查看当前目录总大小

  du -sh .
  du -sh /path/to/directory

  2. 查看当前目录下各子目录大小（排序）

  du -sh * | sort -hr
  du -h --max-depth=1 | sort -hr

  3. 查找大文件（>100MB）

  find . -type f -size +100M -exec du -h {} \;
  du -ah . | grep -E '^[0-9.]+[GT]'  # 查找GB/TB级文件

  4. 查看磁盘空间紧张的情况

  # 查看根目录各子目录大小
  du -h --max-depth=1 / | sort -hr

  # 查看用户目录大小
  du -sh /home/*
  du -sh /home/user1 /home/user2

  实用示例

  分析系统空间使用

  # 1. 查看根目录占用
  du -h -d 1 / | sort -hr | head -10

  # 2. 查看var目录详细占用
  du -h --max-depth=2 /var | sort -hr

  # 3. 查看日志目录
  du -sh /var/log/*

  监控特定目录

  # 实时监控目录大小变化
  watch -n 60 "du -sh /workspace"

  # 比较两个时间点的大小
  du -sh /workspace > size_before.txt
  # ... 一段时间后 ...
  du -sh /workspace > size_after.txt
  diff size_before.txt size_after.txt

  清理空间前分析

  # 查找最大的10个目录
  du -sh /* 2>/dev/null | sort -hr | head -10

  # 查看用户主目录大小分布
  du -sh ~/.* ~/* 2>/dev/null | sort -hr

  高级技巧

  输出到文件进行后续分析

  du -ah / > disk_usage_full.txt
  du -sh /* > root_dirs_size.txt

  结合其他命令

  # 查看最大文件和目录
  du -ah . | sort -hr | head -20

  # 查找特定类型文件大小
  find . -name "*.log" -exec du -ch {} + | grep total

  # 按日期查看文件大小
  find . -type f -mtime -7 -exec du -ch {} + | grep total

  性能优化

  # 对于大目录，使用 --max-depth 限制深度
  du -h --max-depth=3 /large/directory

  # 排除某些目录（比如挂载点）
  du -sh --exclude=/mnt --exclude=/proc /

  快速参考

  | 命令                         | 用途       |
  |----------------------------|----------|
  | du -sh .                   | 当前目录总大小  |
  | du -h * | sort -hr         | 子目录大小排序  |
  | du -h --max-depth=1 /      | 根目录一级子目录 |
  | du -ah . | grep G          | 查找GB级文件  |
  | du -ch /tmp/* | grep total | 临时文件总大小  |

  这些命令可以帮助你快速定位磁盘空间问题并进行针对性清理！