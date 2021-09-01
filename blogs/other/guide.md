---
title: 数组排序
date: 2020-12-20
cover: https://pan.zealsay.com/mweb/blog/WechatIMG5.png
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

原理： 首先，js中的sort会将排序的元素类型转化成字符串进行排序。不过它是一个高阶函数，可以接受一个函数作为参数。而我们可以通过传入内部的函数，来调整数组的升序或者降序。
```js
const arr = [1,27,16,34,8,100,78,82,19,48,95,63];
console.log(arr.sort());
console.log( arr.sort( (item1,item2) => item1- item2 ) ) 
```

### 冒泡排序

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

### 关于JS常用或者新奇方法会持续更新,方便开发中使用
- 🍓 欢迎关注作者 [博客],后期会分享一些开发心得。