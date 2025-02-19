---
title: 前端八股文持续更新......
cover: /bac7.jpg
date: 2025-01-26
tags:
 - git
 
categories: 
 - 前端技术

---
::: tip 介绍

最近公司要招新牛马，咱也不知道最新该问啥，咱只能套着绳子重新温习一下前端的面试问题，也算自己重新复习一下基础，后续持续更新，不断充电......(内容为自己理解+网上总结，有错误可留言讨论)<br>
:::

 前端八股文大合集

1、js数据类型

- js的八种基本数据类型：undefind，null，boolean,number,string,symbol,biginit

- js的引用类型（复杂类型）：Object，Function，Array，Date,RegEXp(正则)

- Symbol和Bigint为ES6新增类型

  - Symbol代表创建后独一无二且不可变的数据类型，它主要是为了解决可能出现全局变量的冲突的问题

  - Bigint是一种数字类型，它可以代表任何精度格式的整数，使用Bigint可以安全操作大数值，即使这个数超出了Number能够表示的安全整数范围

  - 堆:存放引用数据类型，引用数据类型占据空间大，大小不固定，能够影响到程序运行的性能；引用数据类型在栈中存储了指针，该指针指向堆中该实体的起始地址，如object，Array，Function，

  - 栈:存放原始数据类型，栈中的简单数据段，占据空间小，属于被频繁使用的数据，比如String，Number，null，boolean

    ```JS
    console.log(typeof 1);               // number
    console.log(typeof true);            // boolean
    console.log(typeof 'mc');            // string
    console.log(typeof Symbol)           // function
    console.log(typeof Symbol());        // symbol
    console.log(typeof function(){});    // function
    console.log(typeof console.log());   // undefined
    console.log(typeof []);              // object 
    console.log(typeof {});              // object
    console.log(typeof null);            // object
    console.log(typeof undefined);       // undefined
    
    ```

    

2、null和undefined的区别

​	 首先null和undefined都是基本数据类型，且都只有一个只就是它本身。

- null代表空对象，typeof打印类型为object，主要用于赋值给一些可能返回对象的变量
- undefined代表未定义，typeof打印类型为undefined，主要是声明了但是没有定义的变量



3、 instantceof运算复的实现原理及实现

​	instantceof运算符用于检测构造函数的prototype属性上是否出现在某个实例对象的原型链上，一般是去查找某个函数上是否存在constructor.prototype是否存在，如果存在则返回true，如果不在继续在原型链上查找，如果查到原型链顶端仍没有找到，则返回false



4、typeof和instanceof，Object.prototype.toString.call()的区别

- typeof返回的是一个运算数的基本类型，可以判断数据类型但是无法判断引用的数据类型（function除外）
- instanceof返回的是布尔值，可以判断引用的数据类型，但是无法判断原始数据类型
- Object.prototype.toString.call()能够精准判断数据类型，但是写法繁琐
- 那为什么typeof能判断null为object呢？js历史遗留问题 

```
console.log(typeof 1);               // number
console.log(typeof true);            // boolean
console.log(typeof 'mc');            // string
console.log(typeof Symbol)           // function
console.log(typeof Symbol());        // symbol
console.log(typeof function(){});    // function
console.log(typeof console.log());   // undefined
console.log(typeof []);              // object 
console.log(typeof {});              // object
console.log(typeof null);            // object
console.log(typeof undefined);       // undefined



console.log(1 instanceof Number);                    // false
console.log(true instanceof Boolean);                // false 
console.log('str' instanceof String);                // false  
console.log([] instanceof Array);                    // true
console.log(function(){} instanceof Function);       // true
console.log({} instanceof Object);                   // true


var toString = Object.prototype.toString;
console.log(toString.call(1));                      //[object Number]
console.log(toString.call(true));                   //[object Boolean]
console.log(toString.call('mc'));                   //[object String]
console.log(toString.call([]));                     //[object Array]
console.log(toString.call({}));                     //[object Object]
console.log(toString.call(function(){}));           //[object Function]
console.log(toString.call(undefined));              //[object Undefined]
console.log(toString.call(null));                   //[object Null]


```



5、HTTP请求跨域问题

- 跨域的原理：由于浏览器的同源策略，对js的安全限制，必须协议，域名，端口必须相同，否则则视为不同的域
- 解决方案：开发时可以使用proxy代理，线上可以使用ng代理转发，也可添加请求头设置 Access-Control-Allow-Origin HTTP响应头之后，浏览器将会允许跨域请求 



6、前端缓存:Cookie，sessionStorage，localStorage的区别

- 相同点：以上都能存储在客户端

- 不同点：

  - 大小：cookie储存4k，sessionStorage和localStorage较大可以达到5M+

  - 储存时间：cookie设置时间以后一直有效；localStorage永久储存，浏览器关闭依旧不丢失，手动可删除；sessionStorage关闭浏览器丢失

  - cookie数据会自动传递给服务器；其余的不会

    

7、从输入URL到页面加载的全过程

- 浏览器输入url
- 查找缓存(浏览器查找浏览器缓存，系统缓存，路由缓存是否有该页面，如果有直接加载)
- DNS域名解析（浏览器向DNS服务器发送请求，解析该域名对应的ip地址）
- 建立TCP连接（解析出ip地址后，根据ip地址和默认80端口和服务器建立TCP链接）
- 发送HTTP请求（浏览器发起读取文件的http请求）
- 服务器响应请求返回结果（浏览器响应请求，返回html文件发给浏览器）
- 关闭TCP链接（第四次握手释放TCP链接）
- 浏览器渲染（浏览器构建dom树，构建css，构建render树，布局，绘制）
- JS引擎解析（调用JS引擎解析并执行js代码）



8、浏览器重绘和重排

- 重排/回流（Reflow）：当dom元素的几何信息发生变化，浏览器需要重新排布，就需要重排
- 重绘（Repaint）：当元素的外观样式变化，但是布局没改变，则需要重新绘制
- 重绘不一定会重排，重排一定会重绘
- 任何添加，删除，更新Dom都回触发重绘或重排，包括但不限于，display隐藏，visibility:hidden；移动；添加样式；用户改变窗口大小
- 如何避免？1.集中改变样式，不一条一条修改dom样式；2.不把dom当成循环中的变量；3.动画类的HTML元素使用fixed或者absoult的position4，不实用table布局

​	

9、进程，线程，协程

- 进程：
- 线程
- 协程



10、var && let && const

​	ES6之前创建变量一般都是var，之后为let/const

- 区别：

  -  var定义的变量没有块的概念，可以跨块访问，但是不能跨函数访问；

  ​		let定义的变量，只能在块作用域中访问，不能跨块，跨函数

  ​		const用来定义常量，使用时必须初始化（赋值），只能在块作用域里访问，且不能修改

   

  -   var可以先使用再声明，因为存在变量提升；let/const 必须先声明再使用

  -   var是允许在相同作用域内重复声明同一个变量的，其他不能 
  -  全局上下文中var声明的变量可以和window映射，其他不能
  - let /const/function会把当前所在的大括号(除函数之外)作为一个全新的块级上下文，应用这个机制，在开发项目的时候，遇到循环事件绑定等类似的需求，无需再自己构建闭包来存储，只要基于let的块作用特征即可解决



11、闭包的两大作用：保存/保护（详细）

- 闭包的概念

  ​	 闭包是指有权访问另一个函数作用域中的变量的函数--《JavaScript高级程序设计》 

  ​	在js中变量的作用域属于函数作用域, 在函数执行完后,作用域就会被清理,内存也会随之被回收,但是由于闭包函数是建立在函数内部的子函数, 由于其可访问上级作用域,即使上级函数执行完, 作用域也不会随之销毁, 这时的子函数(也就是闭包),便拥有了访问上级作用域中变量的权限,即使上级函数执行完后作用域内的值也不会被销毁。

- **闭包的特性**：

  - 1、内部函数可以访问定义他们外部函数的参数和变量。(作用域链的向上查找，把外围的作用域中的变量值存储在内存中而不是在函数调用完毕后销毁)设计私有的方法和变量，避免全局变量的污染。

    1.1.闭包是密闭的容器，，类似于set、map容器，存储数据的

    1.2.闭包是一个对象，存放数据的格式为 key-value 形式

  - 2、函数嵌套函数

  - 3、本质是将函数内部和外部连接起来。优点是可以读取函数内部的变量，让这些变量的值始终保存在内存中，不会在函数被调用之后自动清除

- **闭包形成的条件**：

1. 函数的嵌套
2. 内部函数引用外部函数的局部变量，延长外部函数的变量生命周期

- **闭包的用途**：

1. 模仿块级作用域
2. 保护外部函数的变量 能够访问函数定义时所在的词法作用域(阻止其被回收)
3. 封装私有化变量
4. 创建模块

- **闭包应用场景**
  - 闭包的两个场景，闭包的两大作用：`保存/保护`。 在开发中, 其实我们随处可见闭包的身影, 大部分前端JavaScript 代码都是“事件驱动”的,即一个事件绑定的回调方法; 发送ajax请求成功|失败的回调;setTimeout的延时回调;或者一个函数内部返回另一个匿名函数,这些都是闭包的应用。

- **闭包的优点**：延长局部变量的生命周期

- **闭包缺点**：会导致函数的变量一直保存在内存中，过多的闭包可能会导致内存泄漏



12、JS中的this的五种情况

- 作为普通函数，this指向window
- 当函数作为对象方法被调用时，this指向该对象
- 构造器调用，this指向返回的这个对象
- 箭头函数的this绑定看在this所在的函数定义在哪个对象下，就绑定的哪个对象，如果是嵌套，则指向最近的一层对象
- 基于Function.prototype上的 `apply 、 call 和 bind `调用模式，这三个方法都可以显示的指定调用函数的 this 指向。`apply`接收参数的是数组，`call`接受参数列表，`` bind`方法通过传入一个对象，返回一个` this `绑定了传入对象的新函数。这个函数的 `this`指向除了使用`new `时会被改变，其他情况下都不会改变。若为空默认是指向全局对象window。