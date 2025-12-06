# js

Owner: xqer

五种数据类型

- Boolean (true, false)
- Number (12, 1.618, -46.7, 0, etc.)
- String (“hello”, “world!”, “12”, “”, etc.)
- Null
- Undefined

undefined means  “declared but not yet assigned a value”

null means “no value”

赋值：

let 作用域是块

const

var 作用域是函数

**console.log()**

输出到控制台

alert();

弹框

数组：

- *

[](https://lh4.googleusercontent.com/iFaCXkte8Mqzw6PFUMOMWeIwv63g375amG9yT85s0wa-AjHIfTR0W9NJ4djwxYDAvN_V5O2RtRSqKVxN6AQA6yUC5RfYARY6xpoH6fwNTUdO9tBSoEdkd_PMoW9pFHx3sV8Y-qbhI_BJtZ8f9JJ_l2KywlND0OTtDQu0stJ9W2prRvgiCV7-cS8COF1hm-tJ)

pets.length

迭代 for(const animal of pets) {}

函数

语法： (parameters) => { body };

const add = (a,b) =>{ return a+b;

};

回调函数

[](https://lh4.googleusercontent.com/y1747qEDxtj7PhvfvYETUqFZ-UKpY49nU4wgda9YeLWWaYummfMLTF7P7-InavzRi1bnxKqGwP8rgrXZbiONrnWHYXi1kuSjKCmvr-rH0UoFaJdrZ-m16l_UEQFQ9d4mGLcJlJukG5wBjbtlNAW_hKbrBKcJ-aDFwaejTd22M-aKJOSEUKVeQ5nX_bg3aYd_)

把函数作为参数传递给另一个函数

匿名函数:

modifyArray(myArray,x=>{

return x+2;

});

简化的匿名函数:

modifyArray(myArray,x=>x+2);

内置函数

map（参数为回调函数） 将回调函数应用于所有的参数

filter （参数为回调函数） 选择数组中通过给定测试的元素

对象

键值对集合

[](https://lh6.googleusercontent.com/WamIqxN0Hi0lBUubl-HNvZlTEDIZLuBww4M1OGblUkrofqtMwq_dy_BqvuyvifwI87Jw02wHnwOC4Q3r8hxp6cCHQf2GrFYuVkj0YdLLCjpilnAR0nSc-gcwa1Ywuv90kOYqDWM-GZIrIpBYt4Tn0pZcYmTxO4pRqk0kGFA4Hbc3xUwSH03EMtNli_Po2Gu3)

===即比较类型，也比较值

==只比较值（会执行类型转换）

===比较对象时，实际比较的是对象的引用(地址）

数组与对象的拷贝

用...

let arr = [1,2,3]

let copy =[...arr];

不可以

let copy = arr;//这是浅拷贝

类

- *

[](https://lh5.googleusercontent.com/BH3l3ytZ3YjHBlAxlzsGZq24yASc6xV92ghIPEHEyPXYeH5z5-9euEsz1xw12F-TpVXXfJUWUGyBNQ3igxlnsWtllgWwsVyxZPmRgd-2LKmxSQxhZStvByAPK94vQsXZ8gz2kAEUTw9zeR1C0nD1Prgfm09sTiiplz60iOgzrpsS0lFceENvmYT6peBcnqn4)

- *