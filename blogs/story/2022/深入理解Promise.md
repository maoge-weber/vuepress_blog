---
title: 深入理解 Promise
date: 2024-07-23
cover: /bac4.jpg
tags:
 - JavaScript
 - 异步编程
 - ES6
categories:
 - 技术笔记
---

::: tip
对JavaScript Promise 的理解。
:::

<!-- more -->

## 1. Promise 简介

Promise 是 JavaScript 中处理异步操作的一种方式，它代表了一个异步操作的最终完成（或失败）及其结果值。Promise 为异步编程提供了解决方案，避免了回调地狱的问题(其实就是避免一直循环导致程序崩溃)。

### 1.1 基本概念

```javascript
const promise = new Promise((resolve, reject) => {
  // 异步操作
  if (/* 操作成功 */) {
    resolve(value);
  } else {
    reject(error);
  }
});

promise
  .then(value => {
    // 处理成功结果
  })
  .catch(error => {
    // 处理错误
  });
```

## 2. Promise 的状态与方法

### 2.1 三种状态

```javascript
// Promise 有三种状态
const PENDING = 'pending';    // 初始状态
const FULFILLED = 'fulfilled';// 成功状态
const REJECTED = 'rejected';  // 失败状态

// 状态转换示例
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success'); // pending -> fulfilled
  }, 1000);
});
```

### 2.2 常用方法

```javascript
// Promise.all
Promise.all([
  fetch('/api/users'),
  fetch('/api/posts'),
  fetch('/api/comments')
])
.then(([users, posts, comments]) => {
  // 所有请求都成功完成
})
.catch(error => {
  // 任一请求失败
});

// Promise.race
Promise.race([
  fetch('/api/fast'),
  fetch('/api/slow')
])
.then(result => {
  // 最快的请求完成
});
```

## 3. 实战应用

### 3.1 异步请求封装

```javascript
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => resolve(data))
      .catch(error => reject(error));
  });
}

// 使用示例
fetchJSON('/api/data')
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### 3.2 并发控制

```javascript
class PromiseQueue {
  constructor(concurrency = 1) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  add(promiseGenerator) {
    return new Promise((resolve, reject) => {
      this.queue.push({ promiseGenerator, resolve, reject });
      this.dequeue();
    });
  }

  dequeue() {
    if (this.running >= this.concurrency) return;
    
    const item = this.queue.shift();
    if (!item) return;

    this.running++;
    item.promiseGenerator()
      .then(item.resolve)
      .catch(item.reject)
      .finally(() => {
        this.running--;
        this.dequeue();
      });
  }
}
```

## 4. 高级特性

### 4.1 Promise 链式调用

```javascript
function processData() {
  return getData()
    .then(data => filterData(data))
    .then(filtered => sortData(filtered))
    .then(sorted => formatData(sorted))
    .catch(error => {
      console.error('处理数据时出错:', error);
      return defaultData;
    });
}
```

### 4.2 异步迭代器

```javascript
async function* asyncGenerator() {
  yield await Promise.resolve(1);
  yield await Promise.resolve(2);
  yield await Promise.resolve(3);
}

async function processItems() {
  for await (const item of asyncGenerator()) {
    console.log(item);
  }
}
```

## 5. 错误处理最佳实践

### 5.1 全局错误处理

```javascript
window.addEventListener('unhandledrejection', event => {
  console.error('未处理的 Promise 拒绝:', event.reason);
  // 防止错误冒泡
  event.preventDefault();
});

// 统一错误处理
function handlePromiseError(error) {
  if (error.name === 'NetworkError') {
    // 处理网络错误
  } else if (error.name === 'TimeoutError') {
    // 处理超时错误
  } else {
    // 处理其他错误
  }
}
```

### 5.2 超时处理

```javascript
function timeoutPromise(promise, timeout) {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('操作超时')), timeout)
    )
  ]);
}

// 使用示例
timeoutPromise(fetch('/api/data'), 5000)
  .then(response => response.json())
  .catch(error => {
    if (error.message === '操作超时') {
      console.log('请求超时');
    }
  });
```

