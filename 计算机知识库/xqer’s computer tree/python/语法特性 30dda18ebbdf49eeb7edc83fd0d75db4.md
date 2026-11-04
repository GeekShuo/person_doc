# 语法特性

Owner: xqer

# python参数传递

python函数中调用的参数是值传参还是引用传参？

都不是！值传参和引用传参是C系列语言中的说法，值传参（pass by value）指的是被调用函数的形参作为局部变量来使用，简单来说就是在栈中新开辟了内存空间来存放调用函数传递过来的实参的**值**。

# 装饰器

```
def deco(func):
    def wrapper():
        start_time = time.time()
        func()
        end_time = time.time()
        timer = end_time - start_time
        print("run time spend :", timer, 's', sep='')
    return wrapper
```

Python装饰器就是用于拓展原来函数的一种函数，在不改动原函数的代码的前提下给函数增加新的功能，这也是代码可拓展性保证了核心代码不被破坏的重要函数。而这个函数的特殊之处也是在于他的返回值也是一个函数。