---
title: ArkTS
cover: /bac8.jpg
date: 2023-02-21
tags:
 - 前端技术
 
categories: 
 - 前端技术

---
::: tip 介绍
ArkTS<br>
:::


### TypeScript无缝衔接ArkTS：快速入门鸿蒙ArkTS基本语法

简单来说，TypeScript 是一种通用的、基于 JavaScript 的编程语言，主要应用于前端开发中。ArkTS 则是专门为鸿蒙开发生态系统设计的，基于 TypeScript 的一种扩展语言，拥有更强的稳定性和安全性。

### ArkTS的基本语法

作为前端，我们上手ArkTS基本语法是非常容易的！首先，ArkTS是兼容TS/JavaScript生态的，我们可以使用TS/JS进行开发或复用已有代码，但是要注意一些约束规则：兼容TS/JS的约束。

## 变量声明   



```JS
let a: string = '你好，我是Mao';
// 更改值
a = '溜了溜了，学个毛线';

```

## 常量声明

```JS
const b: string = '卷不动了！不学了';
// 改值会报错
b = "我好难" // 报错


```

## 常用语句

```JS
//if
const study:boolen = fasle
const work:boolen = fasle

if (study) {
  // ...
} else if (work) {
  // ...
} else {
  // ...
}


//Switch
const expression:string = "game"
switch (expression) {
  case "study": 
    // 学习鸿蒙
    // ...
    break; // 可省略
  case "work":
  case "game": 
    // 打游戏逻辑
    // ...
    break; // 可省略
  default:
    // 默认语句
}

//三目
let money:number = 0
let work = money < 10 ? true : false;

//for语句
let sum = 0;
for (let i = 0; i < 10; i += 2) {
  sum += i;
}

```

## 函数

```JS
//函数声明
function add(x: string, y: string): string {
  // 支持js的模板字符串
  return `${x}${y}`;
}
//可选参数
function getName(name?: string) {
  if (name == undefined) {
    console.log('我槽！居然没名字');
  } else {
    console.log(`大家好, ${name}!`);
  }
}
//返回类型
// 显式指定返回类型
function game(): string { return '打游戏'; }

// 推断返回类型为string
function study() { return '学习鸿蒙'; }

//箭头函数
let sum = (x: number, y: number): number => {
  return x + y;
}
// 省略写法
let sum = (x: number, y: number): number => x + y

//函数重载
// 定义函数重载
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: any, b: any): any {
    return a + b;
}

// 使用函数重载
let sum = add(5, 10);        // 调用第一个重载函数，返回数值 15
let concatenated = add("Hello, ", "World!");  // 调用第二个重载函数，返回字符串 "Hello, World!"

console.log(sum);           // 输出: 15
console.log(concatenated);  // 输出: Hello, World!

```
