---
title: React Hooks 进阶指南
date: 2021-05-18
cover: /bac5.jpg
tags:
 - React
 - 前端
categories:
 - 技术笔记
---

::: tip
深入理解 React Hooks 的原理和高级用法。
:::

<!-- more -->

## 1. 自定义 Hooks

```javascript
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue)
  
  const increment = () => setCount(c => c + 1)
  const decrement = () => setCount(c => c - 1)
  
  return { count, increment, decrement }
}
```

## 2. useEffect 的清理机制

```javascript
useEffect(() => {
  const subscription = someAPI.subscribe()
  
  return () => {
    subscription.unsubscribe()
  }
}, [])
```

## 3. useCallback 性能优化

```javascript
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b)
  },
  [a, b],
)
```

## 4. useMemo 计算缓存

```javascript
const memoizedValue = useMemo(() => {
  return computeExpensiveValue(a, b)
}, [a, b])
``` 