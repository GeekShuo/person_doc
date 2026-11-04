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

  推荐顺序：lscpu → top → cat /proc/cpuinfo（从简到详）`
``` 
Architecture:          x86_64
CPU op-mode(s):        32-bit, 64-bit
Byte Order:            Little Endian
CPU(s):                4
On-line CPU(s) list:   0-3
Thread(s) per core:    2
Core(s) per socket:    2
Socket(s):             1
NUMA node(s):          1
Vendor ID:             GenuineIntel
CPU family:            6
Model:                 79
Model name:            Intel(R) Xeon(R) CPU E5-2683 v4 @ 2.10GHz
Stepping:              1
CPU MHz:               2099.998
BogoMIPS:              4199.99
Hypervisor vendor:     KVM
Virtualization type:   full
L1d cache:             32K
L1i cache:             32K
L2 cache:              4096K
L3 cache:              16384K
NUMA node0 CPU(s):     0-3
Flags:                 fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush mmx fxsr sse sse2 ss ht syscall nx pdpe1gb rdtscp lm constant_tsc arch_perfmon rep_good nopl xtopology eagerfpu pni pclmulqdq ssse3 fma cx16 pcid sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand hypervisor lahf_lm abm 3dnowprefetch invpcid_single fsgsbase tsc_adjust bmi1 hle avx2 smep bmi2 erms invpcid rtm rdseed adx smap xsaveopt arat
```


CPU信息字段解释

  基本信息

  - Architecture: x86_64 - 64位x86架构
  - CPU op-mode(s): 32-bit, 64-bit - 支持32位和64位运行
  - Byte Order: Little Endian - 小端字节序

  核心配置

  - CPU(s): 4 - 总共4个逻辑CPU
  - On-line CPU(s) list: 0-3 - 在线的CPU编号0-3
  - Thread(s) per core: 2 - 每个物理核心2个线程（超线程）
  - Core(s) per socket: 2 - 每个CPU插槽2个物理核心
  - Socket(s): 1 - 1个CPU插槽
  - NUMA node(s): 1 - 1个NUMA节点

  CPU型号

  - Vendor ID: GenuineIntel - Intel处理器
  - Model name: Intel Xeon CPU E5-2683 v4 @ 2.10GHz - 服务器级处理器
  - CPU MHz: 2099.998 - 当前运行频率2.1GHz

  缓存

  - L1d cache: 32K - L1数据缓存
  - L1i cache: 32K - L1指令缓存
  - L2 cache: 4096K - L2缓存4MB
  - L3 cache: 16384K - L3缓存16MB

  虚拟化

  - Hypervisor vendor: KVM - 运行在KVM虚拟机中
  - Virtualization type: full - 完全虚拟化

  重要特性（Flags）

  - sse/sse2/sse3/ssse3/sse4_1/sse4_2 - SIMD指令集
  - avx/avx2 - 高级向量扩展
  - aes - 硬件AES加密
  - hypervisor - 虚拟化支持

  总结：这是一台云服务器，运行在KVM虚拟机上，配置为2核4线程的Intel至强处理器。