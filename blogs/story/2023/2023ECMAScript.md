---
title: 2023ECMAScript更新
cover: /bac8.jpg
date: 2023-03-28
tags:
 - 前端技术
 
categories: 
 - 前端技术

---
::: tip 介绍
2023ECMAScript更新<br>
:::

 ![图片](https://mmbiz.qpic.cn/mmbiz_png/EO58xpw5UMP510LL9v2pEresbCRs75xBtlgOeBwjEq9HqyXyzNz1BjcCiaLhFJI4aiciacSG1vNuSB15y2iap79mhA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1) 

#### 从尾到头搜索数组

##### 概述

在 JavaScript 中，通过 `find()` 和 `findIndex()` 查找数组中的值是一种常见做法。不过，这些方法从数组的开始进行遍历：

```
 const array = [{v: 1}, {v: 2}, {v: 3}, {v: 4}, {v: 5}]; array.find(elem => elem.v > 3); // {v: 4} array.findIndex(elem => elem.v > 3); // 3
```

如果要从数组的末尾开始遍历，就必须反转数组并使用上述方法。这样做就需要一个额外的数组操作。
`findLast()` 和 `findLastIndex()` 的就解决了这一问题。提出这两个方法的一个重要原因就是：语义。

##### 使用

它们的用法和 `find()`、`findIndex()` 类似，唯一不同的是它们是 从后向前 遍历数组，这两个方法适用于数组和类数组。

- `findLast()` 会返回第一个查找到的元素，如果没有找到，就会返回 undefined；
- `findLastIndex()` 会返回第一个查找到的元素的索引。如果没有找到，就会返回 -1；

```
 const array = [{v: 1}, {v: 2}, {v: 3}, {v: 4}, {v: 5}]; array.findLast(elem => elem.v > 3); // {v: 5} array.findLastIndex(elem => elem.v > 3); // 4 array.findLastIndex(elem => elem.v > 5); // undefined
```

##### polyfill

下面来实现一下这两个方法：

Array.prototype.findLast

```
 Array.prototype.findLast = function(arr, callback, thisArg) {   for (let index = arr.length - 1; index >= 0; index--) {     const value = arr[index];     if (callback.call(thisArg, value, index, arr)) {       return value;     }   }   return undefined; }
```

Array.prototype.findLastIndex

```
 Array.prototype.findLastIndex = function(arr, callback, thisArg) {   for (let index = arr.length - 1; index >= 0; index--) {     const value = arr[index];     if (callback.call(thisArg, value, index, arr)) {       return index;     }   }   return -1; }
```

##### 参考源码

lodash 中也提供了类似方法，下面是相关源码：

findLast()

```
 import findLastIndex from './findLastIndex.js' import isArrayLike from './isArrayLike.js' /**  * This method is like `find` except that it iterates over elements of  * `collection` from right to left.  *  * @since 2.0.0  * @category Collection  * @param {Array|Object} collection The collection to inspect.  * @param {Function} predicate The function invoked per iteration.  * @param {number} [fromIndex=collection.length-1] The index to search from.  * @returns {*} Returns the matched element, else `undefined`.  * @see find, findIndex, findKey, findLastIndex, findLastKey  * @example  *  * findLast([1, 2, 3, 4], n => n % 2 == 1)  * // => 3  */ function findLast(collection, predicate, fromIndex) {   let iteratee   const iterable = Object(collection)   if (!isArrayLike(collection)) {     collection = Object.keys(collection)     iteratee = predicate     predicate = (key) => iteratee(iterable[key], key, iterable)   }   const index = findLastIndex(collection, predicate, fromIndex)   return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined } export default findLast
```

findLastIndex()

```
 import baseFindIndex from './.internal/baseFindIndex.js' import toInteger from './toInteger.js' /**  * This method is like `findIndex` except that it iterates over elements  * of `collection` from right to left.  *  * @since 2.0.0  * @category Array  * @param {Array} array The array to inspect.  * @param {Function} predicate The function invoked per iteration.  * @param {number} [fromIndex=array.length-1] The index to search from.  * @returns {number} Returns the index of the found element, else `-1`.  * @see find, findIndex, findKey, findLast, findLastKey  * @example  *  * const users = [  *   { 'user': 'barney',  'active': true },  *   { 'user': 'fred',    'active': false },  *   { 'user': 'pebbles', 'active': false }  * ]  *  * findLastIndex(users, ({ user }) => user == 'pebbles')  * // => 2  */ function findLastIndex(array, predicate, fromIndex) {   const length = array == null ? 0 : array.length   if (!length) {     return -1   }   let index = length - 1   if (fromIndex !== undefined) {     index = toInteger(fromIndex)     index = fromIndex < 0       ? Math.max(length + index, 0)       : Math.min(index, length - 1)   }   return baseFindIndex(array, predicate, index, true) } export default findLastIndex
```

#### Hashbang Grammar

Unix 的命令行脚本都支持`#!` 命令，又称为 Hashbang。这个命令放在脚本的第一行，用来指定脚本的执行器。Hashbang Grammar 功能就是想为 JavaScript 脚本引入了`#!` 命令，这个命令写在脚本文件或者模块文件的第一行：

```
 // 写在脚本文件的第一行 #!/usr/bin/env node 'use strict'; console.log(1); // 写在模块文件的第一行 #!/usr/bin/env node export {}; console.log(1);
```

这样，Unix 命令行就可以直接执行脚本了：

```
 # 以前执行脚本 node hello.js # 有了 hashbang 之后执行脚本 ./hello.js
```

不过这样的话，hashbang 就必须严格的在文件头，否则就会出现语法错误，导致这个 JavaScript 脚本文件无法使用。

#### 通过副本更改数组

通过副本更改数组的方法有四个：

- `Array.prototype.toReversed()`
- `Array.prototype.toSorted()`
- `Array.prototype.toSpliced()`
- `Array.prototype.with()`

我们知道，大多数的数组方法都是非破坏性的，也就是说，在数组执行该方法时，不会改变原数组，比如 `filter()` 方法：

```
 const arr = ['a', 'b', 'b', 'a']; const result = arr.filter(x => x !== 'b'); console.log(result); // ['a', 'a']
```

当然，也有一些是破坏性的方法，它们在执行时会改变原数组，比如 `sort()` 方法：

```
 const arr = ['c', 'a', 'b']; const result = arr.sort(); console.log(result); // ['a', 'b', 'c']
```

在数组的方法中，下面的方法是具有破坏性的：

- `.reverse()`
- `.sort()`
- `.splice()`

如果我们想要这些数组方法应用于数组而不改变它，可以使用下面任意一种形式：

```
 const sorted1 = arr.slice().sort(); const sorted2 = [...arr].sort(); const sorted3 = Array.from(arr).sort();
```

可以看到，我们首先需要创建数组的副本，再对这个副本进行修改。因此就引入了这三个方法的非破坏性版本，因此不需要手动创建副本再进行操作：

- `.reverse()` 的非破坏性版本：`.toReversed()`
- `.sort()` 非破坏性版本：`.toSorted(compareFn)`
- `.splice()` 非破坏性版本：`.toSpliced(start, deleteCount, ...items)`

这些函数属性引入到了 Array.prototype：

```
 Array.prototype.toReversed() -> Array Array.prototype.toSorted(compareFn) -> Array Array.prototype.toSpliced(start, deleteCount, ...items) -> Array Array.prototype.with(index, value) -> Array
```

除此之外，还有了一个新的非破坏性方法：`with()`。该方法会以非破坏性的方式替换给定 index 处的数组元素，即 `arr[index]=value` 的非破坏性版本。

所有这些方法都将保持目标数组不变，并返回它的副本并执行更改。这些方法适用于数组，也适用于类型化数组，即以下类的实例：

- Int8Array
- Uint8Array
- Uint8ClampedArray
- Int16Array
- Uint16Array
- Int32Array
- Uint32Array
- Float32Array
- Float64Array
- BigInt64Array
- BigUint64Array

如果我们想要这些数组方法应用于数组而不改变它，可以使用下面任意一种形式：

> TypedArray 是一种通用的固定长度缓冲区类型，允许读取缓冲区中的二进制数据。其在 WEBGL 规范中被引入用于解决 Javascript 处理二进制数据的问题。类型化数组也是数组，只不过其元素被设置为特定类型的值。
>
> 类型化数组的核心就是一个名为 ArrayBuffer 的类型。每个 ArrayBuffer 对象表示的只是内存中指定的字节数，但不会指定这些字节用于保存什么类型的数据。通过 ArrayBuffer 能做的就是为了将来使用而分配一定数量的字节。

这些方法也适用于元组，元组相当于不可变的数组。它们拥有数组的所有方法 —— 除了破坏性的方法。因此，将后者的非破坏性版本添加到数组对元组是有帮助的，这意味着我们可以使用相同的方法来非破坏性地更改数组和元组。

Array.prototype.toReversed()

`.toReversed()` 是 `.reverse()` 方法的非破坏性版本：

```
 const arr = ['a', 'b', 'c']; const result = arr.toReversed(); console.log(result); // ['c', 'b', 'a'] console.log(arr);    // ['a', 'b', 'c']
```

下面是 `.toReversed()` 方法的一个简单的 polyfill：

```
 if (!Array.prototype.toReversed) {   Array.prototype.toReversed = function () {     return this.slice().reverse();   }; }
```

Array.prototype.toSorted()

`.toSorted()` 是 `.sort()` 方法的非破坏性版本：

```
 const arr = ['c', 'a', 'b']; const result = arr.toSorted(); console.log(result);  // ['a', 'b', 'c'] console.log(arr);     // ['c', 'a', 'b']
```

下面是 `.toSorted()` 方法的一个简单的 polyfill：

```
 if (!Array.prototype.toSorted) {   Array.prototype.toSorted = function (compareFn) {     return this.slice().sort(compareFn);   }; }
```

Array.prototype.toSpliced()

`.splice()` 方法比其他几种方法都复杂，其使用形式：`splice(start, deleteCount, ...items)`。该方法会从从 start 索引处开始删除 deleteCount 个元素，然后在 start 索引处开始插入 item 中的元素，最后返回已经删除的元素。

`.toSpliced` 是 `.splice()` 方法的非破坏性版本，它会返回更新后的数组，原数组不会变化，并且我们无法再得到已经删除的元素：

```
 const arr = ['a', 'b', 'c', 'd']; const result = arr.toSpliced(1, 2, 'X'); console.log(result); // ['a', 'X', 'd'] console.log(arr);    // ['a', 'b', 'c', 'd']
```

下面是 `.toSpliced()` 方法的一个简单的 polyfill：

```
 if (!Array.prototype.toSpliced) {   Array.prototype.toSpliced = function (start, deleteCount, ...items) {     const copy = this.slice();     copy.splice(start, deleteCount, ...items);     return copy;   }; }
```

Array.prototype.with()

`.with()` 方法的使用形式：`.with(index, value)`，它是 `arr[index] = value` 的非破坏性版本。

```
 const arr = ['a', 'b', 'c']; const result = arr.with(1, 'X'); console.log(result);  // ['a', 'X', 'c'] console.log(arr);     // ['a', 'b', 'c']
```

下面是 `.with()` 方法的一个简单的 polyfill：

```
 if (!Array.prototype.with) {   Array.prototype.with = function (index, value) {     const copy = this.slice();     copy[index] = value;     return copy;   }; }
```

#### Symbol 作为 WeakMap 的键

目前，WeakMaps 仅允许使用对象作为键，这是 WeakMaps 的一个限制。新功能扩展了 WeakMap API，允许使用唯一的 Symbol 作为键。

这样更易于创建和共享 key：

```
 const weak = new WeakMap(); // 更具象征意义的key const key = Symbol('my ref'); const someObject = { /* data data data */ }; weak.set(key, someObject);
```

除此之外，该功能还解决了记录和元组提案中引入的问题：如何在原始数据类型中引用和访问非原始值？Records & Tuples 不能包含对象、函数或方法，当这样做时会抛出 TypeError：

```
 const server = #{     port: 8080,     handler: function (req) { /* ... */ }, // TypeError! };
```

这种限制存在是因为记录和元组提案的关键目标之一是默认具有深度不可变性保证和结构相等性。接受 Symbol 值作为 WeakMap 键将允许 JavaScript 库实现它们自己的类似 RefCollection 的东西，它可以重用同时不会随着时间的推移泄漏内存：

```
 class RefBookkeeper {     #references = new WeakMap();     ref(obj) {         const sym = Symbol();         this.#references.set(sym, obj);         return sym;     }     deref(sym) { return this.#references.get(sym); } } globalThis.refs = new RefBookkeeper(); const server = #{     port: 8080,     handler: refs.ref(function handler(req) { /* ... */ }), }; refs.deref(server.handler)({ /* ... */ });
```