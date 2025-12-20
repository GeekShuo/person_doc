https://github.com/zai-org/Open-AutoGLM
部署还是很简单的，按照readme一步一步来，但是只能连接到电脑，用adb控制，我还以为直接手机内置呢。 无法内置手机，但是可以adb远程调试，远程调试的前提是连到同一个网络下（手机自己开热点，电脑连手机是不行的） jd这边手机和电脑连不到同一个网络下，放弃） ，并且远程调试也只能在电脑上下发指令，这一点必须得改进。
- 测试任务一：
打开美团，找到附近的火锅
这个任务是默认任务，肯定是没问题，确实打开了美团，查找了火锅
- 测试任务二：
打开微信，给xxx发一条消息，成功查找到了联系人，一字不差地发送了过去。
- 测试任务三：
这次给它上上强度，帮我玩社交软件
1。让他进行一个任务，把所有牵手app上匹配到的女生右划，结果是他确实可以帮我完成这个任务，但他进行的是左划，而且每划一次都要思考个五六秒左右，很慢
2。第二次指定必须左划，它这次直接找不到这个app了，它说这个app是系统信息app，然后推理牵手不是一个app名字，而是在某个软件里面的功能，给了一堆软件列表
3.这次指定在当前app里操作，它还是没识别出来，还自作聪明打开了小红书软件，尝试左划也一直没划成功。
4.这次直接让他在当前页面左右划，但是它滑动一直是上下划，不是左右划
```
用户说要"从左向右滑动"来"交友匹配"，这看起来像是某个社交app的操作。但是当前显示的是Home屏幕，不是某个特定的app。

用户说"在当前app里面"，所以应该是在Home这个系统桌面app中。但是Home不是典型的社交app。

让我重新理解：用户可能是想让我打开某个社交app，然后进行从左向右的滑动操作来查找好友或进行匹配。

常见的社交app有：微信、QQ、抖音、快手、小红书、微博、bilibili等。

由于用户说"当前app"，可能是指当前正在使用的app。但从截图看，当前在Home屏幕。

我应该先打开一个社交app，然后进行从左向右的大幅度滑动操作。最常用的社交app是微信，我可以先打开微信，然后进行滑动操作。

让我先启动微信。
常见的社交app有：微信、QQ、抖音、快手、小红书、微博、bilibili等。

由于用户说"当前app"，可能是指当前正在使用的app。但从截图看，当前在Home屏幕。
```

目前几个大问题：
- 不能部署到手机上面，必须和电脑绑定
- 模型太蠢了
- 最大step 100 长任务肯定不够
- 每一步都要进行推理，速度太慢

这遇到的问题咋跟browser-use这么像？这俩完全一回事，autoglm反响这么大，browser-use却没出圈



好耶，问题2有救了，这个agent可以切换模型，正好gemini 3 flash 最近开源免费,试一试
check_deployment_cn.py 把这个文件91行注释掉。
```shell
python scripts/check_deployment_cn.py --base-url https://generativelanguage.googleapis.com/v1beta/openai/  --model gemini-2.5-flash  --apikey "AIzaSyAT1T0eau2r85ZpQLP9jYCu2tgH_mtVR8c"
开始测试模型推理...
Base URL: https://generativelanguage.googleapis.com/v1beta/openai/
Model: gemini-2.5-flash
Messages file: scripts/sample_messages.json
================================================================================

模型推理结果:
================================================================================
<think>The task is to compare prices of "LUMMI MOOD" shampoo on JD.com and Taobao, then choose the cheaper platform to order. I am currently on Xiaohongshu. The first step is to launch JD.com.</think>
<answer>do(action="Launch", app="京东")</answer>
================================================================================

统计信息:
  - Prompt tokens: 2163
  - Completion tokens: 72
  - Total tokens: 2400

请根据上述推理结果判断模型部署是否符合预期。
```

3 flash 直接不给推理