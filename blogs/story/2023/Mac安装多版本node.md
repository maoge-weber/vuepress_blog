---
title: MAC安装多个版本node命令
cover: https://pan.zealsay.com/zealsay/cover/2.jpg
date: 2023-04-03
tags:
 - 杂物收纳
 
categories: 
 - 杂物收纳

---
::: tip 介绍
MAC安装多个版本node命令指南<br>
:::
今天在自己电脑上紧急修复线上问题,但是项目down下来以后install后启动发生报错,谷歌以后发现是node版本问题,但是自己开发的ui组件库是18+的node版本,项目是16+的node版本才能启动,所以需要在电脑上安装多个node版本进行管理,后期考虑到项目的多样性,需要用到不同版本的node做支持，并且需要根据项目需要切换，以下就是Mac管理node环境常用的命令行。

Mac下使用n去安装多个指定版本的Node.js，并使用命令随时切换。

1.全局安装n

```
npm install -g n
```

2.指定版本的Node安装

```
sudo -E n 16.17.0
```

3.查看已经安装的Node

```
n list
```

4.删除指定版本的Node

```
n rm 11.0.0
```

5.Node版本切换

```
sudo n
```

# 上下箭头选择版本， 回车即可

6.查看当前Node和npm版本

```
node -v
npm -v
```



以上就是MAC下常用的关于Node的命令，希望对你有所帮助