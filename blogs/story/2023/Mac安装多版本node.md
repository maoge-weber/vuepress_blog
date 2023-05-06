---
title: MAC/Win安装多个版本node命令
cover: https://pan.zealsay.com/zealsay/cover/2.jpg
date: 2023-04-03
tags:
 - 杂物收纳
 
categories: 
 - 杂物收纳

---
::: tip 介绍
MAC/Win安装多个版本node命令指南<br>
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

Win下可以使用nvm进行node版本管理及切换。

1.下载安装

nvm安装包下载地址：https://github.com/coreybutler/nvm-windows/releases，windows系统下载nvm-setup.zip安装包

2.查看安装的版本

```
nvm ls

```
3.查看可安装版本

```
nvm list available

```
4.安装指定版本/卸载指定版本

```
nvm install <version> 
nvm uninstall 14.17.3 

```
```
nvm off                     // 禁用node.js版本管理(不卸载任何东西)
nvm on                      // 启用node.js版本管理
nvm install <version>       // 安装node.js的命名 version是版本号 例如：nvm install 8.12.0
nvm uninstall <version>     // 卸载node.js是的命令，卸载指定版本的nodejs，当安装失败时卸载使用
nvm ls                      // 显示所有安装的node.js版本
nvm list available          // 显示可以安装的所有node.js的版本
nvm use <version>           // 切换到使用指定的nodejs版本
nvm v                       // 显示nvm版本
nvm install stable          // 安装最新稳定版

````

以上就是MAC/Win下常用的关于Node的命令，希望对你有所帮助