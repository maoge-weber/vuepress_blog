---
title: TypeScript基础应用
cover: https://pan.zealsay.com/zealsay/cover/2.jpg
date: 2022-10-07
tags:
 - Vue3
 
categories: 
 - 前端技术

---
::: tip 介绍
TypeScript基础应用<br>
:::

# TypeScript基础应用

1.基础类型及定义

```typescript
//布尔值
let isDone: boolean = false;
isDone = true;
// isDone = 2 // error

//数字
let a1: number = 10 // 十进制
let a2: number = 0b1010  // 二进制
let a3: number = 0o12 // 八进制
let a4: number = 0xa // 十六进制

//字符串
//可以使用双引号（"）或单引号（'）表示字符串 (Eslint标准为双引号)
let name:string = 'tom'
name = 'jack'
// name = 12 // error
let age:number = 12
const info = `My name is ${name}, I am ${age} years old!`

//undefined 和 null
let u: undefined = undefined
let n: null = null

//数组
//1.第一种，可以在元素类型后面接上[]，表示由此类型元素组成的一个数组：
let list1: number[] = [1, 2, 3]

//2.第二种方式是使用数组泛型，Array<元素类型>：
let list2: Array<number> = [1, 2, 3]

//元组 Tuple
//元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。 比如，你可以定义一对值分别为 string 和 number 类型的元组。

let t1: [string, number]
t1 = ['hello', 10] // OK
t1 = [10, 'hello'] // Error
//当访问一个已知索引的元素，会得到正确的类型
console.log(t1[0].substring(1)) // OK
console.log(t1[1].substring(1)) // Error, 'number' 不存在 'substring' 方法

//枚举
//enum 类型是对 JavaScript 的枚举，项目中经常使用。
enum Color {
  Red,
  Green,
  Blue
}

// 枚举数值默认从0开始依次递增
// 根据特定的名称得到对应的枚举数值
let myColor: Color = Color.Green  // 0
console.log(myColor, Color.Red, Color.Blue)

//any
//不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查(一般用于对参数类型未知的情况下)
let notSure: any = 4
notSure = 'maybe a string'
notSure = false // 也可以是个 boolean

//void
//void 类型像是与 any 类型相反，它表示没有任何类型,当一个函数没有返回值时，你通常会见到其返回值类型是 void：
/* 表示没有任何类型, 一般用来说明函数的返回值不能是undefined和null之外的值 */
function fn(): void {
  console.log('fn()')
  // return undefined
  // return null
  // return 1 // error
}
//且void只能赋予undefined 和null
let unusable: void = undefined

//object
function fn2(obj:object):object {
  console.log('fn2()', obj)
  return {}
  // return undefined
  // return null
}
console.log(fn2(new String('abc')))
// console.log(fn2('abc') // error
console.log(fn2(String))

```

