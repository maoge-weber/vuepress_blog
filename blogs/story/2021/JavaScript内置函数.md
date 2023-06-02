---
title: JavaScript内置函数
cover: https://pan.zealsay.com/zealsay/cover/3.jpg
date: 2021-08-10
tags:
 - 前端技术
 
categories: 
 - 前端技术

---
::: tip 介绍
JavaScript内置函数<br>
:::

---
常用JavaScript内置函数集(持续更新..)
---

#### 	1.toLocaleString() 来对数字进行千分号操作

```js
const number = 1234567890.123;

// 使用 toLocaleString() 方法对数字进行千分号操作
// number需要是number类型
const result = number.toLocaleString('en-US');

console.log(result); // 输出 "1,234,567,890.123"

```

#### 	2.字符串处理函数

```js
// toUpperCase()：将字符串转换为大写字母。
const str = "hello world";
console.log(str.toUpperCase()); // 输出 "HELLO WORLD"

// toLowerCase()：将字符串转换为小写字母
const str = "HELLO WORLD";
console.log(str.toLowerCase()); // 输出 "hello world"

// arAt()：返回字符串中指定位置的字符。
const str = "hello world";
console.log(str.charAt(0)); // 输出 "h"
console.log(str.charAt(6)); // 输出 "w"

```