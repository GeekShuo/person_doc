两个命令连接，想串行执行，用&&。 
并行执行用 &    command1 & command2

  这表示 command1 在后台运行，而 command2 在前台立即开始执行。shell不会等待 command1 完成。
command1 & command2 &

  两个命令都在后台运行。