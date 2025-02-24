---
title: TypeScript 高级类型实战
date: 2021-11-05
cover: /bac4.jpg
tags:
 - TypeScript
 - 前端
categories:
 - 技术笔记
---

::: tip
探索 TypeScript 中的高级类型用法，提升代码类型安全性。
:::

<!-- more -->

## 1. 泛型工具类型

```typescript
// Partial
type Partial<T> = {
  [P in keyof T]?: T[P]
}

// Pick
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}
```

## 2. 条件类型

```typescript
type IsString<T> = T extends string ? true : false

// 使用示例
type A = IsString<string> // true
type B = IsString<number> // false
```

## 3. 映射类型

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

interface User {
  name: string
  age: number
}

type ReadonlyUser = Readonly<User>
```

## 4. 联合和交叉类型

```typescript
type StringOrNumber = string | number
type NameAndAge = { name: string } & { age: number }
``` 