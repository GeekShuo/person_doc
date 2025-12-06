# 口令破解

Owner: xqer

- 针对Windows/Linux系统平台，在获得系统控制权限的基础上，提取出用户账户的口令明文 •包含两个主要步骤：

1）如何获取用户账户的口令密文；

passwd seed 修改用户密码为204603

![](口令破解/pmD5mXFaQLCpcM5FjmdNTTccfcspmediaimage.png)

获取密文 cat /etc/shadow

![](口令破解/pmD5mXFaQLCpcM5FjmdNTTccfcsp语法mediaimage_1.png)

$6$57okJO0t$s7ugbMOuLlONNbu9eqkfmJN/RlFWg9zeEJTBhqYz4ezE.Mrs1NoUu6YZF3DGkdm5Cha2NroENe1GKFcPAHIgK.

unshadow /etc/passwd /etc/shadow > mypasswd.txt

2）如何通过破解工具获取口令明文

![](口令破解/pmD5mXFaQLCpcM5FjmdNTTccfcsp语法mediaimage_2.png)

john mypasswd.txt

john --show mypasswd.txt --wordlist=rockme.txt

![](口令破解/pmD5mXFaQLCpcM5FjmdNTTccfcsp语法mediaimage_3.png)

![](口令破解/pmD5mXFaQLCpcM5FjmdNTTccfcsp语法mediaimage_4.png)