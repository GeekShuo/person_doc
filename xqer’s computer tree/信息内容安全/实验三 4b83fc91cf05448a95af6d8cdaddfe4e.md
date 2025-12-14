# 实验三

Owner: xqer

# 1.一个简单图像特征提取算法（颜色直方图）

主要代码：

```
function Color = color_histogram(Im)
%COLOR_HISTOGRAM 此处显示有关此函数的摘要
%   此处显示详细说明
Im = rgb2hsv(Im);
[L,C]=size(Im);
Im=Im(:,:,1);
Im=Im(:);
edges=0:0.04:1;
[Color]=histcounts(Im,edges);
Color=Color'
```

先将rgb图片转化为hsv，将hsv值按色彩值划分为不同的区间，每段区间长度设置为0.04，然后统计各区间频量，得到颜色直方图

余弦距离：

![](../../基本八股/操作系统/实验三/pmD5mXFaQLCpcM5FjmdNTTccfcspmediaimage.png)

欧式距离：

![](../../基本八股/操作系统/实验三/pmD5mXFaQLCpcM5FjmdNTTccfcsp语法mediaimage_1.png)

# 2.一个略微复杂的图像特征提取算法（HOG）

一、 计算图像每个像素的梯度（包括大小和方向），主要是为了捕获轮廓信息，同时**进一步弱化光照的干扰**；

```
angles=atan2(grad_yu,grad_xr);
magnit=((grad_yu.^2)+(grad_xr.^2)).^.5;
```

二、得到HOG

1. 将图像划分成小cells/block（此代码分成了8个cell）；

```
nwin_x=7;%set here the number of HOG windows per bound box
nwin_y=7;

nwin_x=7;%set here the number of HOG windows per bound box
nwin_y=7;
```

2.统计每个cell的梯度直方图（不同梯度的个数），即可形成每个cell的descriptor；(此例按照梯度的方向分为了9个方向

```
angles2=angles(n*step_y+1:(n+2)*step_y,m*step_x+1:(m+2)*step_x);
        magnit2=magnit(n*step_y+1:(n+2)*step_y,m*step_x+1:(m+2)*step_x);
        v_angles=angles2(:);
        v_magnit=magnit2(:);
        K=max(size(v_angles));
        %assembling the histogram with 9 bins (range of 20 degrees per bin)
        bin=0;
        H2=zeros(B,1);
        for ang_lim=-pi+2*pi/B:2*pi/B:pi
            bin=bin+1;
            for k=1:K
                if v_angles(k)<ang_lim
                    v_angles(k)=100;
                    H2(bin)=H2(bin)+v_magnit(k);
                end
            end
        end
```

3.一个block内所有cell的特征descriptor 标准化便得到该lock的HOG特征descriptor。

```
        H2=H2/(norm(H2)+0.01);
        H((cont-1)*B+1:cont*B,1)=H2;
```

4.将图像image内的所有block的HOG特征descriptor串联起来就可以得到该image（你要检测的目标）的HOG特征descriptor了。这个就是最终的可供分类使用的特征向量了。

三、.图像与图像之间的匹配（欧式距离）

选择一个图像，计算跟其他图像的HOG特征的欧式相似度，找出最小的几张图片

```
for ImgID = 1:length(fileName)          % 扫描数据库所有图像
     RScore(ImgID) = cosmetric(QueryFeature,BaseFeature(:,ImgID));  % COS余弦距离
   % DisScore(ImgID) = eucmetric(QueryFeature,BaseFeature(:,ImgID));    % EUC欧式距离
end
[B, Index] = sort(RScore,"ascend");   % 距离向量按升序排序，B保存排序后的距离，Index保存对应排序后的序号
```

# 自由实验：一个简单的以图搜图系统（用到的系统函数，排序返回Index）

输入想要搜索的图片，找出最接近的几个图片的下标

![](../../基本八股/操作系统/实验三/pmD5mXFaQLCpcM5FjmdNTTccfcsp语法mediaimage_2.png)

```
clear;
load DataBase.mat;                      % 提取特征矩阵等索引数据
% QueryPath = 'DataBase\16.jpg';        % 制定查询图像名
QueryPath = input("Please enter the name of the image you want to search for");                   % 制定查询图像名

QueryFeature = HOG(imread(QueryPath));  % 提取查询图像HOG特征向量
BaseFeature = HOGFeature;               % 创建副本

DisScore = zeros(1,length(fileName));   % 创建距离向量
for ImgID = 1:length(fileName)          % 扫描数据库所有图像
     RScore(ImgID) = cosmetric(QueryFeature,BaseFeature(:,ImgID));  % COS余弦距离
   % DisScore(ImgID) = eucmetric(QueryFeature,BaseFeature(:,ImgID));    % EUC欧式距离
end
[B, Index] = sort(RScore,"ascend");   % 距离向量按升序排序，B保存排序后的距离，Index保存对应排序后的序号

NumResult = 4;                          % 规定返回结果数量
figure;
set(gcf,'unit','normalized','position',[0.05,0.1,0.95,0.4]);          %使其在屏幕上的显示位置是以（0.2，0.2）为原点，长0.64，宽0.32
subplot(1,NumResult+1,1),imshow(imread(QueryPath)); title('Query');   %补充title等信息
for m = 1:NumResult
    resultPath =  [fileName(Index(m)).folder '\' fileName(Index(m)).name];
    subplot(1,NumResult+1,1+m),imshow(imread(resultPath)); title(['R#' int2str(m) '-' fileName(Index(m)).name ]);
    disp(Index(m))
end

```