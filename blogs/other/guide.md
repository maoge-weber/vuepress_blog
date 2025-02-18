---
title: 数组排序.去重
date: 2019-12-20
cover: /bac8.jpg
tags:
 - JS
 - vue
categories:
 -  技术笔记
---

::: tip 摘要
JS数组排序及数组去重<br>
:::

<!-- more -->


---
数组排序
---


---
### 使用Array.sort 

**sort本意就是排序方法，也可通过sort传参进行排序**

原理： 首先，js中的sort会将排序的元素类型转化成字符串进行排序。不过它是一个高阶函数，可以接受一个函数作为参数。而我们可以通过传入内部的函数，来调整数组的升序或者降序。 
```js
const arr = [1,27,16,34,8,100,78,82,19,48,95,63];
console.log(arr.sort());
console.log( arr.sort( (item1,item2) => item1- item2 ) ) 

如果在一些数组对象中没有可判断的属性可先为对象加上sort排序条件再次对数组对象进行排序

```

### 冒泡排序.去重

**比较常规的排序方法**

思路： 第一次循环，开始比较当前元素与下一个元素的大小，如果比下一个元素小或者相等，则不需要交换两个元素的值；若比下一个元素大的话，则交换两个元素的值。然后，遍历整个数组，第一次遍历完之后，相同操作遍历第二遍。

```js
const arr = [1,20,24,2,33,51,77,18,100,88]
//定义比较的回数
const time = arr.length-1;
//外层for循环控制比较的回数
for( let i = 0; i < time; i++ ){
  //内层for循环控制每一回比较的次数
   for ( let j =  0; j < time - i; j++){
    //核心：比较，交换
    if( arr[j] - arr[j+1] > 0 ){
      const temp = arr[j];
      arr[j] = arr[j+1];
      arr[j+1] = temp;
    }
  }
}
console.log(arr);
```

### set与解构赋值去重

ES6中新增了数据类型set，set的一个最大的特点就是数据不重复。Set函数可以接受一个数组（或类数组对象）作为参数来初始化，利用该特性也能做到给数组去重

```js
function unique(arr) {
    if (!Array.isArray(arr)) {
        console.log('type error!')
        return
    }
    return [...new Set(arr)]
}
```

### Array.from与set去重

Array.from方法可以将Set结构转换为数组结果，而我们知道set结果是不重复的数据集，因此能够达到去重的目的

```js
function unique(arr) {
    if (!Array.isArray(arr)) {
        console.log('type error!')
        return
    }
    return Array.from(new Set(arr))
}
```
### Array.prototype.indexOf()

如果索引不是第一个索引，说明是重复值。
实现一：
利用Array.prototype.filter()过滤功能，
Array.prototype.indexOf()返回的是第一个索引值，
只将数组中元素第一次出现的返回，
之后出现的将被过滤掉
```js
Array.prototype.unique = function () {
  return this.filter((item, index) => {
    return this.indexOf(item) === index;
  })
}

```
实现二：
```js
let arr = [1, 2, 3, 22, 233, 22, 2, 233, 'a', 3, 'b', 'a'];
Array.prototype.unique = function () {
  const newArray = [];
  this.forEach(item => {
    if (newArray.indexOf(item) === -1) {
      newArray.push(item);
    }
  });
  return newArray;
}
```

这两种方法都可以实现去重效果，但是复杂度和消耗时间不同
```js
test1: 4887.201904296875ms
test2: 3766.324951171875ms
```

### 关于JS常用或者新奇方法会持续更新,方便开发中使用
- 🍓 欢迎关注作者 [博客],后期会分享一些开发心得。