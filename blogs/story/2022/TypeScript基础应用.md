---
title: TypeScript基础应用
cover: /bac8.jpg
date: 2022-10-07
tags:
 - Vue3
 
categories: 
 - 前端技术

---
::: tip 介绍
TypeScript基础应用<br>
:::

# 1.TypeScript基础应用

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
#### 	2.ts数据类型

##### `interface` 用于数据类型定义

```js
// 定义一个data对象,里面的两个属性是Array
interface Data {
		categories: Array,
			series: Array,
}

```



##### 数据定义.声明

 ```js
 // 以下写法均可行
 const nums:Number = 1 //常量
 
 const numsTxt:String = `这是一个模版字符串 ${nums}`
 
 const nums1:number[]=[] //数组
 
 const nums2:Array<number> = [] //数组
 
 //元组 Tuple
 const nums3:[string,number];
 x = ['helllo',1] // 必须按照定义类型顺序进行编译
 
//枚举类型
//常用于数据枚举,转换
enum Type {
		1 = 开,
		2 = 关,
		3 = 锁定
}

const nums4 = Type.1  
 

// 任意值
const nums4 = any = '1' //此变量可以是任何类型
const nums5 : any [] = [1,true]

 // 空值 void : 当数据没有.不存在.或者null undefind等无意义时
 const nums6 :void = null
 
 // Never : 表示不存在的值类型
 function infiniteLoop(): never {
    while (true) {
    }
}
 
 
 ```



**类型断言**

​	类型断言的含义

​	解释型强制类型转换;

​	**类型断言**告诉程序结果类型;

​	**第一种, 尖括号 语法**

```js
let string1:any = '这是一个字符串'
let len : number = (<string>string1).length

```



​	**第二种 as 语法** (如果是jsx文件时,只支持`as`) 

```js
let string1:any = '这是一个字符串'
//如果数据类型是any 不确定数据类型,可用断言告诉程序,这个常量是string
let len : number = (string1 as string).length

```



**第三种真值断言**

```js
interface nums {
  age?:number|undefind,//表示可能是number类型
  age2:number,
}
```



#### 解构

​	**解构数据**

```js
// 解构数组
let input = [1,2]
let [one,two] = input  // one two 相当于索引值
console.log(one,two)

// 解构对象
let input2={
  	a:1,
  	b:2
} 
let {a,b} = input2

//函数运用
//如果函数以数组方式作参,参数直接用数组代替
function f([fir,sec]:[number,number]){
  console(fir,sec)
}
f([6,8])
// 6 8

// 展开  ...展开符创建枚举变量
let num1 = [1,2]
let num2 = [3,4]
let numArr = [...num1,...num2] // 1,2,3,4

// ?: 代表可选属性
// b可能是number类型
let {a,b}:{a:string,b?:number} = A
           
// 属性重命名
let A = {
  a:1,
  b:2
}
let {a:name1,b:name2} = A
console.log(name1) // 1。 这种写法相当于 let name1 = A.a 
//根据数据类型不同, 引用类型会改变原始值,如果是基本类型无法改变
let a = {b:1}
let A = {a,b,c}
A.a = 2
console.log(A) // 2,b,c
           

```



#### 接口

**接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约**

**为什么需要接口?**

​    **以前我们定义对象时,只定义了当前对象的类型,并没有定义这个对象内部具体属性,为了进一步明确数据类型,就有了接口,为了更详细的描述对象内部属性**;

**什么是接口类型?**

  **就像普通数据类型一样,number,string,enum等....,接口也一样,定义内部属性,来约束调用者必须按照定义的属性来使用**

```js
//声明的 两种方法
//第一种 内联注解
declare const pont:{x:number; y:number;};

//第二种 接口形式 
interface pont:{
	x:number;
  y:number  
}


```

```js
//declare在ts中的意义与使用
// declare 更类似于挂载,interface的话只是当前模块声明,declare是全局声明,在项目中任何一个文件下引用都不用import
```

```js
//定义接口 约定内部属性的数据类型
let interface nums{
   age1:number,
   age2:number
}

//定义一个符合条件的对象
let user = {
  firage:1,
  secage:2
}

//调用时
function person ({firage,secage}:nums):void{
  return firage + secage
}

person(user)
```



```js
// 参数会自动取 myobj里的label值
function printLabel(labelledObj: { label: string }) {
  console.log(labelledObj.label);
}

let myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj);

//定义过参数类型以后,自动取myobj里的lable值且必须会string
interface LabelledValue {
  label: string;
}

function printLabel(labelledObj: LabelledValue) {
  console.log(labelledObj.label);
}

let myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj);

//可选属性 定义属性前加一个? 对可能存在的属性进行预定义,意思是可能是string
//定义过对象属性以后,传入参数拼写也必须全部正确,否则程序会认为是错误,执行失败
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): {color: string; area: number} {
  let newSquare = {color: "white", area: 100};
  if (config.color) {
    newSquare.color = config.color;
  }
  if (config.width) {
    newSquare.area = config.width * config.width;
  }
  return newSquare;
}

let mySquare = createSquare({color: "black"});

```

```js

```



**只读属性**

一些对象属性只能在对象刚刚创建的时候修改其值。 你可以在属性名前用`readonly`来指定只读属性:

```javascript
// 只读属性只能被赋值一次,不能再次修改
interface Point {
    readonly x: number;
    readonly y: number;
}
let p1: Point = { x: 10, y: 20 };
p1.x = 5; // error! 

//ReadonlyArray 同理, 定义数组以后不能修改值
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
ro[0] = 12; // error!
ro.push(5); // error!
ro.length = 100; // error!
a = ro; // error!


```

最简单判断该用`readonly`还是`const`的方法是看要把它做为变量使用还是做为一个属性。 做为变量使用的话用`const`，若做为属性则使用`readonly`。



#### 类

我们使用`new`构造了`Greeter`类的一个实例。 它会调用之前定义的构造函数，创建一个`Greeter`类型的新对象，并执行构造函数初始化它

```
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message; // this表示我们访问的是类的成员
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

let greeter = new Greeter("world");
```



**继承**

类从基类中继承了属性和方法

```js
//因为Dog继承了Animal的功能，因此我们可以创建一个Dog的实例，它能够bark()和move()。
class Animal {
    move(distanceInMeters: number = 0) {
        console.log(`Animal moved ${distanceInMeters}m.`);
    }
}

class Dog extends Animal {
    bark() {
        console.log('Woof! Woof!');
    }
}

const dog = new Dog();
dog.bark();
dog.move(10);
dog.bark();
```



#### TS泛型

**泛型通俗讲就是宽泛的类型,通常用于类和函数**

**核心思想其实就是把数据类型当做一个特殊参数传入类或者函数**

```js
//1.泛型类 可以用于类和构造器
// T相当于一个变量 可改, 但是通常写T,在定义时相当于一个参数,具体类型在调用时才会定义
class Person<T>{
  privafunction fn<T>(arg: T): T {
    return arg;
}
fn<number>(12);te val:T;
	constructor(vals:T){
    this.val = vals
  }
}
let p = new Person<number>(12) // 定义p变量 等于 new一个传入类型T为number类型的值

let a = new Array<number>() // 也是泛型的一种

//2.泛类型函数
//泛型可以用于普通函数
function fn<T>(arg: string): T { // 现在这个<T>是入参类型为number 后面的:T 是反参类型number ,后面的:T可以是单独定义 ,不一定和入参一样
    return arg;
}
fn<number>(12); //这里的number就是<T>

```



#### 枚举(enum)

**枚举数据类型 是组织收集一些变量的方式,比如一个特定的业务类型需要前端转换,传统js中 **

```js
// 如果传入数据是1 自动转换成open
enum type {
  open:1,
  close:2,
}
//类型枚举
let nowStatus = type.open // 1
//也可更详细定义枚举的数据类型


//数字枚举
enum noyes {
  no, // 枚举类型中的元素 叫做 枚举成员 ,其实每个成员都有数据类型,如果不写默认是number
  yes
}

function toType (value:noyes){
  if(value == noyes.no){
    return '否'
  }else if(value == noyes.yes){
    return '是'
  }
}

toType(no) //否


//枚举成员也可以赋值
//枚举成员也可以是表达式,常量,数字类型,字符串等
enum nums {
  a,
  b,
  c = 4,
  d,
}
console.log(nums.a,nums.b,nums.c,nums.c) // 0,1,4 如果不赋值 默认上一个值的自增


```





#### 环境声明
