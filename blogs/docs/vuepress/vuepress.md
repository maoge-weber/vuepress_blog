---
title: 谈谈我的第一篇博客1111
date: 2020-08-31
cover: https://pan.zealsay.com/mweb/blog/WechatIMG11.png
tags:
 - vuepress
categories:
 -  技术笔记
---

::: tip 介绍
懒癌使用vuepress_blog搭建的第一篇博客<br>
:::

<!-- more -->


## 懒癌下午突发奇想博客搭了一半还没搭玩

首先安装node环境

如何使用vuepress搭建并发布一个博客`express`,`vuepress-theme-reco`


创建项目文件目录
```
mkdir vuepress-starter && cd vuepress-starter
```
初始化项目
```
yarn init # npm init
```
安装vuepress
```
yarn add -D vuepress # npm install -D vuepress
```
创建docs .md文件

```
mkdir docs && echo '# Hello VuePress' > docs/README.md
```
配置项目启动命令
```
{
  "scripts": {
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  }
}
```
启动项目
```
yarn docs:dev # npm run docs:dev
```

### 主题安装

推荐[vuepress-theme-reco](https://vuepress-theme-reco.recoluan.com/),有问题邮箱咨询
