# Python 多进程编程教程 (基于 `multiprocessing` 库)

> **💡 核心纠错：多线程 vs 多进程**
> 很多人常把 Python 的并发编程统称为“多线程”。但在 Python 中，由于 **GIL（全局解释器锁）** 的存在，原生的 `threading` 多线程并不能实现真正的多核并行计算，它只适合**I/O 密集型任务**（如爬虫、读写文件）。
> 
> 如果你想充分利用 CPU 的多核性能来加速纯计算任务（**CPU 密集型任务**），必须使用多进程！这就是 `multiprocessing` 库大显身手的地方。

---

## 1. 基础篇：创建与启动一个进程
`multiprocessing.Process` 是创建进程最基础的类。它的用法和 `threading.Thread` 几乎一模一样。

### 基本示例
```python
import multiprocessing
import time
import os

def worker(name):
    print(f"[{os.getpid()}] 进程 {name} 开始执行...")
    time.sleep(2)
    print(f"[{os.getpid()}] 进程 {name} 执行结束。")
if __name__ == '__main__':
    # 注意：在 Windows macOS 上，创建进程的代码必须放在 if __name__ == '__main__': 下面
    print(f"主进程 ID: {os.getpid()}")
    
    # 1. 实例化一个进程对象
    p = multiprocessing.Process(target=worker, args=("Alice",))
    
    # 2. 启动进程
    p.start()
    
    # 3. 等待子进程结束 (阻塞主进程，直到 p 运行完毕)
    p.join()
    
    print("主进程结束。")
```

---

## 2. 进阶篇：进程池 (Process Pool)
如果你有成百上千个任务，手动为每个任务创建一个 `Process` 会导致系统崩溃（创建销毁进程开销极大）。这时候我们需要使用**进程池**。

### `Pool.map` （推荐用法，最简单）
```python
from multiprocessing import Pool
import time

def compute_square(n):
    time.sleep(0.5)  # 模拟耗时计算
    return n * n

if __name__ == '__main__':
    numbers = [1, 2, 3, 4, 5, 6, 7, 8]

    # 创建一个包含 4 个工作进程的进程池
    with Pool(processes=4) as pool:
        # map 会自动把 numbers 列表里的元素分发给核心去并行计算
        # 并且会保持返回结果的顺序！
        results = pool.map(compute_square, numbers)
        
    print(f"计算结果: {results}")
```

### `Pool.apply_async` （异步非阻塞调用，适合回调）
```python
from multiprocessing import Pool

def complex_task(x, y):
    return x ** y

def on_success(result):
    print(f"回调拿到结果: {result}")

if __name__ == '__main__':
    with Pool(2) as pool:
        # 异步提交任务，主进程不会在这里卡住
        async_result = pool.apply_async(complex_task, args=(2, 10), callback=on_success)
        
        # 等待异步任务完成并获取返回值
        print("等待结果中...")
        print(f"最终结果: {async_result.get()}")
```

---

## 3. 通信篇：进程间数据共享
**这是多进程和多线程最大的区别！**在同一个 Python 脚本里，如果声明了一个全局变量，多线程是可以直接修改并相互看到的。但**多进程之间内存是绝对隔离的**！你需要使用特定的工具来传递数据。

### 工具 1：`Queue` (进程安全队列)
```python
from multiprocessing import Process, Queue

def producer(q):
    print("生产者正在生产数据...")
    q.put("Data-1")
    q.put("Data-2")

def consumer(q):
    # 阻塞获取队列中的数据
    print(f"消费者拿到了: {q.get()}")
    print(f"消费者拿到了: {q.get()}")

if __name__ == '__main__':
    # 创建一个多进程通信队列
    q = Queue()
    
    p1 = Process(target=producer, args=(q,))
    p2 = Process(target=consumer, args=(q,))
    
    p1.start()
    p2.start()
    
    p1.join()
    p2.join()
```

### 工具 2：`Manager` (字典/列表共享)
如果你必须要像多线程那样共享一个 `dict` 或 `list`，可以使用 `Manager`。它会在底层为你处理好内存同步。

```python
from multiprocessing import Process, Manager

def worker(d, l, idx):
    d[idx] = f"Value_{idx}"
    l.append(idx)

if __name__ == '__main__':
    with Manager() as manager:
        # 创建可以被多进程共享的字典和列表
        shared_dict = manager.dict()
        shared_list = manager.list()
        
        processes = []
        for i in range(5):
            p = Process(target=worker, args=(shared_dict, shared_list, i))
            processes.append(p)
            p.start()
            
        for p in processes:
            p.join()
            
        print("共享字典:", shared_dict)
        print("共享列表:", shared_list)
```

---

## 4. 必懂的避坑指南 (重要)

1. **`if __name__ == '__main__':` 绝对不能省**
   - 在 macOS 和 Windows 下，Python 启动子进程其实是重新导入了一遍你的主脚本（通过 `spawn` 模式）。如果不加这行判断，子进程会在导入时就会执行那些创建进程的任务，导致无限递归创建进程，直到机器死机。
2. **尽量别在进程池里共享大对象**
   - 当你向另一个进程传递参数时，Python 底层是用 `pickle` 序列化过去再反序列化回来的。传递几百 MB 的列表耗时极高，往往抵消了并行的优势。
3. **僵尸进程与关闭资源**
   - 如果用进程池，记得使用 `with Pool()` 上下文管理器，或者在最后显式调用 `pool.close()` 和 `pool.join()` 回收所有子进程，防止资源泄漏。
