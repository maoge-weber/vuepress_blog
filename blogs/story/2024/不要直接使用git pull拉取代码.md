---
title: 不要直接使用git pull拉取代码
cover: /bac6.jpg
date: 2024-07-16
tags:
 - git
 
categories: 
 - 前端技术

---
::: tip 介绍
git 使用技巧<br>
:::

 *注意！代码拉取不要用merge！！你这让提交历史变得很复杂，难以追溯问题*！ 

# git pull里的大学问

我们一起了解git pull的知识

我想，几乎所有的开发都知道git pull 命令用于从远程仓库获取最新的更改并合并到当前分支，但估计只有部分知道它其实是 `git fetch` 和 `git merge` 的组合。

## git fetch

`git fetch` 命令从远程仓库获取最新的代码到本地，但不会自动合并代码。

```xml
xml 代码解读复制代码git fetch <remote> <branch>
```

示例：从名为 origin 的远程仓库获取最新代码：

```sql
sql 代码解读复制代码git fetch origin
```

## git merge

`git merge` 相信大家不陌生，就是将另一个分支的更改合并到当前分支。

通常在使用 git fetch 获取了最新的远程更改后，使用 git merge 将这些更改合并到当前分支。

```sql
sql 代码解读复制代码git merge <branch>
```

## git pull 的过程发生了什么

当我们远端有代码更新，我们需要拉取时

![img](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/7074608cfa4a4027ae2ace2742ffbb63~tplv-73owjymdk6-watermark.image?rk3s=f64ab15b&x-expires=1721352046&x-signature=EQBMj%2Bc8OG9I0PdKiXPSvk8Vw0M%3D)

当我们执行git pull的时候，相当于以此执行了

- git fetch ：从云端拉取最新代码
- git merge：将云端代码与本地代码合并

![img](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/ff057a674a0c4352a8cb456784e5568a~tplv-73owjymdk6-watermark.image?rk3s=f64ab15b&x-expires=1721352046&x-signature=ftG2VIDacBQLjlbhm1m5z9HPB3s%3D)

## git pull为什么会导致git历史混乱

假设我和我的同事在 master 分支上进行开发，我们都拉取了mater的B节点开发。

![img](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/27a6f7158a3c4b23a7ce3dc6017ad54a~tplv-73owjymdk6-watermark.image?rk3s=f64ab15b&x-expires=1721352046&x-signature=61mGC50V8aiGR6ED3uq1UWJP%2BZY%3D)

同事开发的快，提交了新的分支，现在远程分支最新是C节点了。

![img](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/692efb1f8dc44deead50a545eb35eae6~tplv-73owjymdk6-watermark.image?rk3s=f64ab15b&x-expires=1721352046&x-signature=fHOt1j1CYL0g4F%2FeFmH1E%2Bqwa2U%3D)

随后，我们也开发完毕了，但我们的代码落后远端仓库了，所以我们需要运行git pull拉取代码。这会从远程仓库获取最新C节点的代码，和我们本地的代码合并，产生新的节点D。![img](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/46cc91f330304a7aaf39066d2ca26b6e~tplv-73owjymdk6-watermark.image?rk3s=f64ab15b&x-expires=1721352046&x-signature=1VmuOkBu3ecnPAmeJ0J%2FgkdzoT0%3D)

最后，我们使用git push推送代码，远程master分支就会产生一个新的D节点。

![img](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/74592dadf3654cf6a74268113749ca4f~tplv-73owjymdk6-watermark.image?rk3s=f64ab15b&x-expires=1721352046&x-signature=jWCMPJKvEvk5%2BlDOAyHCquUzFDE%3D)

这种历史记录包含了多个分叉点和合并提交，就会导致git历史看起来非常混乱，就像我这样。

![img](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/dabc2bb97fb246c89e0cbd6ddd8bdc59~tplv-73owjymdk6-watermark.image?rk3s=f64ab15b&x-expires=1721352046&x-signature=on3HokroRABuhKgphFjeZ3U1V0k%3D)

# 如何保证git历史的线性

那么，我们如何保证git 历史的线性，像下图这样呢？

![img](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/dee86096c1a64150b458bfb39c24fb0d~tplv-73owjymdk6-watermark.image?rk3s=f64ab15b&x-expires=1721352046&x-signature=3wKDD4pfILsibQjS4zwPH3FRSUA%3D)

非常简单，我们只需要使用rebase（变基）命令即可！在正式的介绍命令的使用前，我们先说说什么是变基！

## rebase变基简介

简单来说，rebase的作用就是永远会让我们本地的代码处于最新状态。

比如，我们一开始是使用B节点开发代码的，开发到B2时，此时远程已经有人推送了C节点。

![img](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/9a217c4dd02b4309b3421437b560421c~tplv-73owjymdk6-watermark.image?rk3s=f64ab15b&x-expires=1721352046&x-signature=1N05OycQnR2ZTo0n%2Bd79xn%2FwcoE%3D)

在B2节点使用rebase变基，会让我们的B1节点和B2节点位于C节点上。大概是这样：

![img](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/4651f5d9d66b41c0bedbed81237c83c4~tplv-73owjymdk6-watermark.image?rk3s=f64ab15b&x-expires=1721352046&x-signature=tSGLgzjcDxAN5RH5WO%2FXsbc1AIs%3D)

因此，使用rebase变基后，git永远只有一条线性历史，非常直观。（感谢倔友[abc_d_e](https://juejin.cn/post/7388753413309349903)指出文字错误）

## rebase命令使用

`rebase`的使用非常简单，我们只需要在git pull的时候，添加上额外命令即可！

```css
css 代码解读复制代码git pull --rebase
```

## 自动变基

每次提交代码都使用`git pull --rebase`命令繁琐而且容易出错，我们可以全局设置git pull默认使用变基的方式，一劳永逸！

```arduino
arduino 代码解读复制代码// git pull默认使用变基操作
git config --global pull.rebase true
```

如果你还是执意喜欢merge，那么使用下面的命令

```arduino
arduino 代码解读复制代码// git pull默认使用合并操作
git config --global pull.rebase false
```

## 自动变基的问题

自动变基会面临一个额外的问题：**就是如果你本地文件有更改的话，变基会失败，因为变基前服务区必须是干净的。**

有两种方法解决这个问题

- git pull前，先使用git commit暂存代码
- git pull前，先将使用 git stash将保存

git commit大家肯定在熟悉不过，这里简单介绍下`git stash`。

> `git stash` 是一个有用的 Git 命令，它允许你将当前工作目录中的未提交更改（包括已暂存和未暂存的更改）保存到一个栈（stash）中，并将工作目录恢复到干净的状态。这在你需要在多个任务之间切换但又不想提交不完整的代码时非常有用
>  它的用法非常简单：

![img](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/5ff18821552245c79da0d3b5f88518e2~tplv-73owjymdk6-watermark.image?rk3s=f64ab15b&x-expires=1721352046&x-signature=LNJXsNhlVZgDHZnW2tprIPtFRYg%3D)

假设我们代码进行了更改，但没有完全改好，我们git pull前，可以先执行

```
 代码解读复制代码git stash
```

![img](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/14f0ae7238ab4562b07dec313d168954~tplv-73owjymdk6-watermark.image?rk3s=f64ab15b&x-expires=1721352046&x-signature=UGgh8nGWXeZ7tvX4bc6c4Ex%2BG%2FY%3D)

此时，我们修改的代码就看不见了。

![img](https://p3-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/3a6d24c945f54645a9d4e4a61eb12809~tplv-73owjymdk6-watermark.image?rk3s=f64ab15b&x-expires=1721352046&x-signature=M0YIKBCcR0eECc7O89T%2BMSy3Bwc%3D)

此时，我们可以使用git pull拉取代码，拉取完代码，我们使用下面的命令

```perl
perl 代码解读复制代码git stash pop
```

此时，我们修改的代码又可以看见了！

## 冲突问题

**如果使用git pull有冲突，则合并完冲突之后，执行一下** **git rebase --continue** **就好了**，其它和原先的用法没有任何区别。

# 总结

本篇文章我们介绍了`git pull`的用法，明白了它有**merge和rebase**两种模式。默认情况下，它使用的是merge。使用merge的方式拉取代码会导致git历史变得复杂，不利于维护和溯源。

因此，建议使用rebase的方式拉取代码。我们只需要做如下设置即可

```js
js 代码解读复制代码git config --global pull.rebase true
```

然后，我们就可以开开心心的使用git pull了！

