---
title: JavaScript 学习笔记（Array篇）
date: 2024-03-26
cover: /bac3.png
tags:
 - JavaScript
 - 前端
categories:
 - 技术笔记
---

::: tip
这篇文章主要整理了 JavaScript 中数组（Array）的常用方法和实践技巧。
:::

<!-- more -->

## 1. 数组基础操作

### 1.1 创建数组

#### 添加元素
```javascript
array.push(value);    // 数组末尾添加元素并返回新的长度
array.unshift(value);    // 数组首位添加元素并返回新的长度
```
删除元素

```javascript 
array.pop();    // 删除数组最后一位并返回删除的元素
array.shift();    // 删除数据第一位并返回删除的元素
array.filter(el => el != 'a');    // 删除指定元素 'a'
```
查找元素
 
```javascript 
array.slice(0,1);    // 获取数组中指定索引的元素，并返回新的数组，0：数组下标，1：选择位数
array.splice(0,1);    // 删除数组指定元素，0：数组下标，1：位数
array.splice(0,1,'value');    // 指定数组索引添加元素
array.indexOf('a');    // 获取元素'a'的索引
array.lastIndexOf('a');    // 反向获取元素'a'的索引
array.find(el => el.id == 1);    // 查询数组id为1的元素
array.findIndex(el => el.id == 1);    // 查询数组id为1的索引
```
排序
```javascript 
array.sort();    // 数组排序
array.sort((a, b) =>  b - a);    // 倒序排序
array.reverse();    // 数组倒序
```
高阶函数
 ```javascript
array.fill('1');    // 使用'1'填充数组
array.filter((el, index, array) => el >= 10);    // 过滤10以下的数字
array.map(el => el.toLowerCase());    // 将数组转换成小写字母
array.some(el => el > 10);    // 检查数组是否有大于10的数字，有则返回true
array.every(el => el > 10);    // 检查数组是否有小于10的数字，效果与some相反
array.reduce((total, el) => total + el);    // 返回数组的总和
array.reduceRight((total, el) => total + el);    // 返回数组的总和(从右到左)
array.find(el => el > 10);    // 返回数组中第一个大于10的元素
array.findIndex(el => el > 10);    // 返回数组中第一个大于10的元素索引
array.includes('a');    // 确定数组是否包含'a'，返回boolean
array.includes('a', 0);    // 确定数组的第一位是否为'a'，返回boolean
array.copyWithin(2, 1, 0);    // 复制数组的第一个元素到第三个元素上
```
判断变量是否为数组
 ```javascript
arr instanceof Array;
Array.isArray(arr);
Object.getPrototypeof(arr) === Array.prototype;
Object.prototype.toString.call(arr) === '[object Array]'
```
其他
 ```javascript
array.concat(data);    // 数组拼接
array.join('-');    // 用 - 分割数组，将数组转换成字符串
array.toString();    // 将数组转换成字符串
array.toSource();    // 返回数组的源代码
array.toLocaleString();    // 将数组转换成本地字符
array.valueOf();    // 返回对象的原始值
array2 = [...array1];    //数组复制
array3 = [...array1, ...array2];    //数组拼接
// 遍历数组
array.forEach(function (el, index) {
    console.log('第' + index + '个元素是：' + el);
});
```