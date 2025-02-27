---
title: Vue3 组件通信最佳实践
date: 2021-03-15
cover: /bac1.jpg
tags:
 - Vue3
 - 前端
categories:
 - 技术笔记
---

::: tip
本文详细介绍了 Vue3 中各种组件通信的方式及其最佳实践。
:::

<!-- more -->

## 1. Props 和 Emits

### 1.1 父子组件通信
```javascript
// 子组件
const props = defineProps({
  message: String
})
const emit = defineEmits(['update'])

// 父组件
<child-component
  :message="msg"
  @update="handleUpdate"
/>
```

## 2. Provide/Inject

```javascript
// 父组件提供数据
provide('key', value)

// 子组件注入数据
const value = inject('key')
```

## 3. Vuex/Pinia 状态管理

```javascript
// store 定义
const store = defineStore('main', {
  state: () => ({
    count: 0
  }),
  actions: {
    increment() {
      this.count++
    }
  }
})
```

## 4. EventBus 替代方案

```javascript
// 使用 mitt
import mitt from 'mitt'
const emitter = mitt()

// 发送事件
emitter.emit('event', data)

// 监听事件
emitter.on('event', data => {
  console.log(data)
})
```

## 5. Refs 直接访问

```javascript
const childRef = ref(null)

onMounted(() => {
  childRef.value.someMethod()
})
``` 