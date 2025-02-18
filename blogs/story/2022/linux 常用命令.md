---
title: linux 常用命令
cover: /bac9.png
date: 2023-04-03
tags:
 - 杂物收纳
 
categories: 
 - 杂物收纳

---
::: tip 介绍
linux 常用命令<br>
:::

显示操作系统的发行版号

```
uname -r
```

显示系统名、节点名称、操作系统的发行版号、内核版本等等

```uname -a```

 

查看当前Linux系统的发行版本

```cat /etc/issue```

 

```cat /etc/os-release```

 

查看当前Ubuntu型号

C/C++ Code复制内容到剪贴板

1. ```lsb_release -a ```

 

查询当前TCP端口列表：

C# Code复制内容到剪贴板

```
1. netstat -ntlp  ##查看当前所有tcp端口 

   netstat命令各个参数说明如下：

　　-t : 指明显示TCP端口

　　-u : 指明显示UDP端口

　　-l : 仅显示监听套接字(所谓套接字就是使应用程序能够读写与收发通讯协议(protocol)与资料的程序)

　　-p : 显示进程标识符和程序名称，每一个套接字/端口都属于一个程序。

　　-n : 不进行DNS轮询，显示IP(可以加速操作) 

 
```

查看所有端口：

```netstat -a -n -o```

 

根据进程名称查询其文件地址：

![QQ截图20181012163228.jpg](http://www.yoyo88.cn/d/file/study/control/2018-10-12/127366e2a80a354e22136edb8cbed420.jpg)

 

C/C++ Code复制内容到剪贴板

1. ```find / -name wnTKYg  ```

 

 

 

查看指定端口的使用情况：

C/C++ Code复制内容到剪贴板

1. ```netstat -ntulp |grep 80  // 查看所有80端口使用情况· ```
2. ```netstat -an | grep 3306  // 查看所有3306端口使用情况 ```

 

查看指定端口：

C/C++ Code复制内容到剪贴板

1. ```netstat -nat | grep 9100 ```

 

80端口被占用：

C/C++ Code复制内容到剪贴板

```
1. **## win** 
2. netstat -aon|findstr "80" 
3.  
4. **## TCP 127.0.0.1:80 0.0.0.0:0 LISTENING 2448** 
5.  
6. tasklist|findstr "2448" 
7.  
8. **thread**.exe 2016 Console 0 16,064 K 
```

1. **##thread占用了80端口,Kill** 

通常情况下是被System占用，右击结束进程无法结束，结束进程树的话直接蓝屏~ 修改端口号为8080端口：

httpd.conf下设置Listen 8080

httpd-vhosts.conf下设置 原来的80换成8080

 

 

Linux查询进程和结束进程

C/C++ Code复制内容到剪贴板

1. ```ps -ef |grep redis ```

ps:将某个进程显示出来
-A 　显示所有程序。
-e 　此参数的效果和指定"A"参数相同。
-f 　显示UID,PPIP,C与STIME栏位。
grep命令是查找
中间的|是管道命令 是指ps命令与grep同时执行

这条命令的意思是显示有关redis有关的进程

 

C/C++ Code复制内容到剪贴板

1. ```kill -9 4394 ```

kill[参数][进程号]

kill就是给某个进程id发送了一个信号。默认发送的信号是SIGTERM，而kill -9发送的信号是SIGKILL，即exit。exit信号不会被系统阻塞，所以kill -9能顺利杀掉进程。当然你也可以使用kill发送其他信号给进程。

![1055294-20180111160429238-2108424884.gif](http://www.yoyo88.cn/d/file/study/control/2018-05-06/7f267928192acedcdf13cb45b91523a2.gif) 

 

查看当前登录用户：

PHP Code复制内容到剪贴板

1. ```who am i ```
2. ```root   pts/0    2017-11-02 09:53 (192.168.0.1) ```

 

查看当前登录用户，并修改密码：

C/C++ Code复制内容到剪贴板

```
1. root@xxxx:/tmp# id 
2. uid=0(root) gid=0(root) groups=0(root) 
4. root@xxxx:/tmp# passwd 
5. Enter **new** UNIX password:  
6. Retype **new** UNIX password:  
7. passwd: password updated successfully 
```



 

创建用户/添加用户

创建用户user1的时候指定其所属工作组users，例：

```useradd –g users user1 ```

 

使用 passwd 命令为新建用户设置密码

C/C++ Code复制内容到剪贴板

1. ```passwd user1  ```

注意：没有设置密码的用户不能使用

 

查看指定用户组下用户列表：

C/C++ Code复制内容到剪贴板

1. ```$ grep 'ssh' /etc/group ```
2. ```$ grep 'git' /etc/group ```

 

查看所有用户组：cat /etc/group

查看用户组：groups

 

查看内存使用情况：

C/C++ Code复制内容到剪贴板

1. free -h 

![WX20180327-092916@2x.png](http://www.yoyo88.cn/d/file/study/control/2018-03-27/a3ec60275d08730b70f3b7803d48025e.png)

 

查看所有进程及相关使用的CPU情况：

C/C++ Code复制内容到剪贴板

1. ```ps aux ```

 

 ![WX20180327-093630@2x.png](http://www.yoyo88.cn/d/file/study/control/2018-03-27/37529d590aa5a81e258abda378237593.png)

 

给指定的用户修改密码：

 如，给git用户修改密码，输入命令后，再输入两次密码

C/C++ Code复制内容到剪贴板

1. ```passwd git ```

![WX20180330-145213@2x.png](http://www.yoyo88.cn/d/file/study/control/2018-03-30/28779dba99a9bcb2984d778dc30ec808.png)

 

linux将本地文件上传到服务器目录下 

C/C++ Code复制内容到剪贴板

1. ```scp /Users/yoyo/Downloads/zhgd.sql root@47.75.85.33:/data-disk/ ```

 

将文件移动到指定目录下：

C/C++ Code复制内容到剪贴板

1. mv zhgd.sql widom-site/ 
2. **## mv 文件名 新的路径/文件夹下/** 

 

 

列出 PHP CLI 已经安装的扩展

PHP Code复制内容到剪贴板

1. php -m 

 

确定PHP CLI 的php.ini文件的位置

PHP Code复制内容到剪贴板

1. php --ini 

 

查看php ini所在的文件路径：

PHP Code复制内容到剪贴板

1. php -i | grep php.ini 

 

 

查看本机是32位还是64位

C/C++ Code复制内容到剪贴板

1. getconf LONG_BIT 

![QQ20180602-095332@2x.png](http://www.yoyo88.cn/d/file/study/control/2018-06-02/90cec5bedbd966de82cc5b460bb6892c.png)

 

修改文件/文件夹名称

C/C++ Code复制内容到剪贴板

1. mv file1 file2  

 

 linux下文件的复制、移动与删除命令为：cp，mv，rm

 

导入mysql文件

mysql -u 用户名 -p 数据库名 < 数据库名.sql

mysql -u abc -p abc < abc.sql

 

------

centos系统

关闭防火墙随机启动

systemctl disable firewalld

 

关闭防火墙

systemctl stop firewalld

 

停止docker

sudo systemctl stop docker.socket

 

查看docker状态

systemctl status docker 

 

重启服务器

reboot

shutdown -r now