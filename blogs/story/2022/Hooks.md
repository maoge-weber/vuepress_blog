---
title: Hooks
cover: /bac11.jpg
date: 2023-04-03
tags:
 - JS
 
categories: 
 - 技术笔记

---
::: tip 介绍
Hooks解析<br>
:::


**首先我们要知道什么事Hooks**

"Hooks" 是一种让你在函数组件中使用状态和副作用的方式。通俗讲就是可以让你直接在函数组件中就能用来管理，修改，处理等功能的工具。

例如我们在vue中的使用
``` JS
 // Vue 3 使用 Composition API
<template>
  <div>
    <p>当前计数: {{ count }}</p>
    <button @click="increment">增加</button>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const count = ref(0);  // 使用 ref 创建一个响应式变量

    // 定义方法来更新状态
    const increment = () => {
      count.value += 1;
    };

    // 通过 setup 返回需要在模板中使用的值
    return {
      count,
      increment
    };
  }
};
</script>
```

这样我们就不用封装完成的处理模块功能的逻辑，直接可以调用函数进行逻辑处理；

