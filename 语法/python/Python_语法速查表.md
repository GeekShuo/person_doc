# Python 算法面试常用语法速查表 (Cheatsheet)

在 LeetCode 刷题和算法面试中，掌握 Python 的核心语法、内置数据结构及高频库函数，能够极大地提升解题速度和代码优雅度。

---

## 1. 基础语法与小技巧

### 1.1 变量与解包 (Unpacking)
```python
# 交换变量（无需中间变量）
a, b = b, a

# 链式比较
if 0 < x < 10:
    pass

# 多重赋值
x, y, z = 1, 2, 3
```

### 1.2 循环与枚举 (Enumerate)
```python
nums = [10, 20, 30]

# 同时获取索引和值
for i, num in enumerate(nums):
    print(i, num)

# 逆序遍历
for i in range(len(nums) - 1, -1, -1):
    pass

# 同时遍历多个数组（以最短的为准）
A = [1, 2, 3]
B = ['a', 'b']
for a, b in zip(A, B):
    print(a, b)  # (1, 'a'), (2, 'b')
```

### 1.3 列表推导式 (List Comprehension)
```python
# 生成二维数组（矩阵）★ 极其重要，千万别用 [[0]*n]*m
m, n = 3, 4
matrix = [[0] * n for _ in range(m)]

# 过滤数据
evens = [x for x in range(10) if x % 2 == 0]
```

### 1.4 无穷大与类型提示
```python
# 初始化最大值/最小值
max_val = float('inf')
min_val = float('-inf')

# 类型提示（Python 3.5+ 推荐，Leetcode 默认带）
def my_func(nums: list[int], name: str) -> bool:
    return True
```

---

## 2. 常用数据结构及操作

### 2.1 列表 (List - 动态数组 / 栈)
可作为数组或**栈 (Stack)** 使用。
```python
stack = []
stack.append(1)   # 压栈 O(1)
top = stack.pop() # 出栈 O(1)
peek = stack[-1]  # 查看栈顶 O(1)

# 常用操作
nums = [3, 1, 2]
nums.sort()       # 原地升序 O(N log N)
nums.sort(reverse=True) # 原地降序
nums.reverse()    # 原地翻转 O(N)

# 列表切片（注意切片会产生新数组，耗时 O(K)）
sub = nums[1:3]   # 左闭右开
copy_nums = nums[:] # 浅拷贝
```

### 2.2 字典 (Dictionary - 哈希表)
```python
hash_map = {}
hash_map['a'] = 1

# 安全获取值（不存在时不报错，返回默认值 0）
val = hash_map.get('b', 0)

# 遍历字典
for key in hash_map:           # 遍历键
for val in hash_map.values():  # 遍历值
for k, v in hash_map.items():  # 同时遍历键值对
```

### 2.3 集合 (Set - 哈希集合)
用于去重或 O(1) 查找。
```python
seen = set()
seen.add(1)       # O(1)
seen.remove(1)    # 删除，若不存在会报错 KeyError
seen.discard(1)   # 删除，若不存在不报错

if 2 in seen:     # O(1) 检查存在性
    pass
    
# 集合运算
A, B = set([1,2]), set([2,3])
union = A | B     # {1, 2, 3} 并集
inter = A & B     # {2} 交集
```

### 2.4 字符串 (String)
**字符串在 Python 中是不可变的**。每次拼接都会生成新对象，如果在循环里拼字符串，务必使用数组暂存再 `join`。
```python
chars = ['a', 'b', 'c']
# 错误做法（O(N^2)）： res += char
# 正确做法（O(N)）：
res = "".join(chars)  # "abc"

s = "hello"
s.isalnum()  # 检查是否全是字母和数字
s.lower()    # 转小写
s.replace('l', 'x') # 替换

# 检查前缀/后缀
if s.startswith("he"): pass
```

---

## 3. 极其重要的库函数 (collections, math, heapq 等)

### 3.1 `collections.deque` (双端队列)
千万**不要**用 `list.pop(0)` 当队列用，那是 O(N) 的。用 `deque`！
```python
from collections import deque

queue = deque([1, 2, 3])
queue.append(4)      # 从右边入队 O(1)
queue.appendleft(0)  # 从左边入队 O(1)

right = queue.pop()      # 从右边出队 O(1)
left = queue.popleft()   # 从左边出队 O(1) (作为核心队列用法)
```

### 3.2 `collections.Counter` (计数器)
```python
from collections import Counter

nums = [1, 1, 2, 3]
count = Counter(nums)   # Counter({1: 2, 2: 1, 3: 1})

# 获取出现次数最高的前 K 个元素
top_2 = count.most_common(2)  # [(1, 2), (2, 1)]
```

### 3.3 `collections.defaultdict` (默认字典)
写图的邻接表、按组分类时必备，省略了初始化判断代码。
```python
from collections import defaultdict

# 值为列表的默认字典（处理图结构超级方便）
adj = defaultdict(list)
adj['A'].append('B')  # 如果 'A' 不存在，会自动创建并初始化为空列表 []

# 值为整数的默认字典（用于累加计数）
freq = defaultdict(int)
freq['foo'] += 1      # 默认初始为 0
```

### 3.4 `heapq` (优先队列 / 堆)
Python 中的堆**默认是小根堆**。
```python
import heapq

heap = []
heapq.heappush(heap, 3)
heapq.heappush(heap, 1)

# 弹出并返回最小元素 O(log N)
min_val = heapq.heappop(heap)  # 1

# 把现有列表原地 O(N) 原地化为堆
arr = [3, 2, 1]
heapq.heapify(arr) 

# 如果要用大根堆怎么办？ 
# 答：把存入的数字全部取反（存 -val），弹出的时候再取反即可。
heapq.heappush(heap, -5)
max_val = -heapq.heappop(heap)
```

### 3.5 `math` 和 `itertools` 库
```python
import math

math.ceil(2.3)    # 向上取整 3
math.floor(2.8)   # 向下取整 2
# Python的整除 // 对负数是向下取整，例如 -3 // 2 = -2，注意与 C++ 不同。

import itertools

# 排列与组合
perms = list(itertools.permutations([1, 2, 3])) # 全排列
combs = list(itertools.combinations([1, 2, 3], 2)) # 组合选2个
```

---

## 4. 类声明与面向对象 (TreeNode, ListNode)

在面试和刷题中，往往题目里预定义了数据结构的类。你需要知道如何去实例化它们或者访问成员变量。

### 4.1 核心类的声明语法
```python
class MyClass:
    # 类变量（所有实例共享）
    class_var = 0
    
    # 构造函数（初始化实例属性）
    def __init__(self, val: int = 0):
        self.val = val
        self.data = []
        
    # 成员方法（第一个参数必须是 self）
    def do_something(self, x: int) -> None:
        self.val += x
```
实例化后，通过 点（.）操作符 直接进行访问或修改：
### 4.2 LeetCode 中的链表节点 (ListNode)
```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

# 构建链表 1 -> 2
node2 = ListNode(2)
node1 = ListNode(1, node2)
# 或者:
# dummy = ListNode(-1)
# dummy.next = ListNode(1)
```

### 4.3 LeetCode 中的二叉树节点 (TreeNode)
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
```
在 Python 中，实例对象变量（成员变量）不需要提前在类中声明。如果你按照 C++ 或 Java 的习惯，把它们写在 def __init__ 的外面（平级）在 Python 中，这就变成了 “类变量”（Class Variables），它们是被所有该类的实例共享的
### 4.4 刷题时自定义排序对象的巧妙写法（用于堆等）
有时候你需要往堆里放复杂的对象或自定义排序逻辑，可以直接覆盖类的魔法方法：
```python
class Item:
    def __init__(self, name, priority):
        self.name = name
        self.priority = priority
        
    # 定义小于操作符，让优先队列知道怎么排
    def __lt__(self, other):
        # 优先级小的排前面
        return self.priority < other.priority
```
## 5.python 特有语法
### 5.1 python指针
没有显式的指针（像 C/C++ 中的 * 和 &），但在本质上，Python 中的变量全都是“引用”（Reference），它们的作用非常类似于指针。
如果想建立一个独立的副本，必须进行拷贝：
# 浅拷贝
b = a[:] 
b = list(a)
b = a.copy()
# 深拷贝（如果列表里面还嵌套了列表）
import copy
b = copy.deepcopy(a)