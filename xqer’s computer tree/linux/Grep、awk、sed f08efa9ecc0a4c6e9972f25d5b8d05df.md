# Grep、awk、sed

Owner: xqer

# grep

对文本内容过滤，查找

语法

grep [options] [pattern] file

- i ignorecase 忽略大小写
- o 仅显示匹配到的字符串本身
- v 显示不能被模式匹配到的行
- E 使用拓展的正则表达式
- n 显示行号

sed和awk使用单引号

# sed

stream editor

sed [option] 匹配范围+内置命令 文件名

option： -n 取消默认输出

- i 直接将修改结果写入文件
- e 多个修改规则 不需要管道符
- r 支持正则拓展

内置命令

a d i p 增加 删除 插入 打印

s/正则/替换内容/g 替换 g代表全局

匹配范围：

空地址： 全文

单地址

/pattern/

范围区间 10，20 10到20 10，+5 10~15

步长

例子：

sed -i 's/^ [ t]*//g' 1.txt 删除行首空格

# awk

文本内容格式化

根据给出的文本分割符（默认为空格），将文本分为一个个字段，按行输出指定的数据

语法

awk 【option】 'pattern[action]' file

- F, 设置分隔符为,
    
    ![image (8).png](Grep、awk、sed/image_(8).png)
    

例子：

awk '{print > "file"}' file 输出重定向

awk '{print $1,$2,$3}' 1.txt

# sort