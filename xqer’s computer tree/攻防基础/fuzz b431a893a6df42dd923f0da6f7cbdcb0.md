# fuzz

Owner: xqer

# 正常执行流程

![](fuzz/pmD5mXFaQLCpcM5FjmdNTTccfcspmediaimage.png)

拖动至printfile

![](fuzz/pmD5mXFaQLCpcM5FjmdNTTccfcsp语法mediaimage_1.png)

输出了两个缓冲区的地址

printfile

```
#include <stdio.h>
#include <tchar.h>
#include <Windows.h>
int outputContent(char *szRead,unsigned uRead){
    char buf[64]={0};
    printf("Buffer address in 0x%08X\n",buf);
    memcpy(buf,szRead,uRead);
    puts(buf);
    return 0;
}
int main(int argc, _TCHAR* argv[]){
    char szBuf[1024]={0};
    FILE *fData=NULL;
    char *szFileName=NULL;
    unsigned uBytesRead=0;
    if1w (1<argc)    {
        szFileName=argv[1];
    }    else    {
        szFileName="data.bin";
    }
    fData=fopen(szFileName,"r");
    if (NULL==fData)    {
        printf("Error:\nNo file named as \"%s\".\n",szFileName);
        return 0;
    }
    uBytesRead=fread(szBuf,1,sizeof(szBuf),fData);
    fclose(fData);
    outputContent(szBuf,uBytesRead);
    system("pause >nul");
    return 0;
}
```

fuzz

![](fuzz/pmD5mXFaQLCpcM5FjmdNTTccfcsp语法mediaimage_2.png)

![](fuzz/pmD5mXFaQLCpcM5FjmdNTTccfcsp语法mediaimage_3.png)

![](fuzz/pmD5mXFaQLCpcM5FjmdNTTccfcsp语法mediaimage_4.png)

进行fuzz

![](fuzz/pmD5mXFaQLCpcM5FjmdNTTccfcsp语法mediaimage_5.png)

选择一个异常的文件拖到print

![](fuzz/pmD5mXFaQLCpcM5FjmdNTTccfcsp语法mediaimage_6.png)

调试

![](fuzz/pmD5mXFaQLCpcM5FjmdNTTccfcsp语法mediaimage_7.png)

修改该文件

![](fuzz/pmD5mXFaQLCpcM5FjmdNTTccfcsp语法mediaimage_8.png)

之后EIP变成了修改后的内容，说明成功修改了返回地址

![](fuzz/pmD5mXFaQLCpcM5FjmdNTTccfcsp语法mediaimage_9.png)