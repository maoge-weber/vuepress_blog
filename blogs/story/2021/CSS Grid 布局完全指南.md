---
title: CSS Grid 布局完全指南
date: 2021-07-22
cover: /bac2.png
tags:
 - CSS
 - 前端
categories:
 - 技术笔记
---

::: tip
深入理解 CSS Grid 布局系统，掌握现代网页布局技术。
:::

<!-- more -->

## 1. Grid 容器基础

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 20px;
}
```

## 2. Grid 项目定位

```css
.item {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
}
```

## 3. Grid 区域命名

```css
.container {
  grid-template-areas: 
    "header header header"
    "sidebar main main"
    "footer footer footer";
}
```

## 4. 响应式布局

```css
@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
    grid-template-areas: 
      "header"
      "main"
      "sidebar"
      "footer";
  }
}
``` 