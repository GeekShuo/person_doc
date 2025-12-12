查看cpu信息的命令 

⏺ CPU信息查看命令

  1. 基本CPU信息
  lscpu                    # 最常用的CPU信息命令
  cat /proc/cpuinfo        # 详细的CPU信息

  2. 简洁查看
  lscpu | grep "Model name"    # CPU型号
  lscpu | grep "CPU(s):"       # CPU核心数
  lscpu | grep "Architecture"  # 架构类型

  3. 实时CPU使用率
  top                      # 实时系统信息
  htop                     # 更友好的top（需要安装）
  mpstat                   # CPU统计信息

  4. CPU频率
  lscpu | grep "CPU MHz"       # 当前频率
  cat /proc/cpuinfo | grep MHz # 每个核心频率

  5. CPU缓存信息
  lscpu | grep Cache           # 缓存信息
  cat /proc/cpuinfo | grep cache

  常用组合

  # 查看CPU核心数和型号
  lscpu | grep -E "(Model name|CPU\(s\)|Thread)"

  # 查看CPU架构和位数
  uname -p                    # 处理器类型
  uname -m                    # 机器硬件架构
  getconf LONG_BIT           # 系统位数

  # 查看CPU温度（需要lm-sensors）
  sensors

  推荐顺序：lscpu → top → cat /proc/cpuinfo（从简到详）