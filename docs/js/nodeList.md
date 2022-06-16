# [NodeList](https://developer.mozilla.org/zh-CN/docs/Web/API/NodeList)

NodeList 对象是节点的集合，通常是由属性(Node.childNodes)和方法(document.querySelectorAll)返回

::: warning

- NodeList 是一个类数组的对象。
- 虽然不是数组，但是可以使用 forEach() 来迭代。
- 可以使用 Array.from() 将其转换为数组。

:::

在一些情况下，NodeList 是一个实时集合，文档中的节点树发生变化，NodeList 也会随之变化。例如，Node.childNodes 是实时的：

```js
var parent = document.getElementById("parent");

var child_nodes = parent.childNodes;
console.log(child_nodes.length); // 我们假设结果会是“2”

parent.appendChild(document.createElement("div"));
console.log(child_nodes.length); // 但此时的输出是“3”
```

在其他情况下，NodeList 是一个静态集合，也就意味着随后对文档对象模型的任何改动都不会影响集合的内容。比如 document.querySelectorAll 就会返回一个静态 NodeList。

## `Array.from(NodeList)`

> 转数组

## `NodeList.length`

> NodeList 中包含的节点个数

## `NodeList.item()`

> 返回 NodeList 对象中指定索引的节点，如果索引越界，则返回 null。
>
> 等价的写法是 nodeList[i]，不过，在这种情况下，越界访问将返回 undefined。

## `NodeList.entries()`

```js
let b = document.querySelectorAll(`.class1`);
for (let c of b.entries()) {
  console.log(c); // [0, div.class1]  [1, div.class1]
}
```

## `NodeList.keys()`

```js
for (let c of b.keys()) {
  console.log(c); // 0 1
}
```

## `NodeList.values()`

```js
for (let c of b.values()) {
  console.log(c); // div.class1  div.class1
}
```

## `NodeList.forEach()`

> 遍历节点

- 遍历的方法：

```js
// Array.forEach
Array.prototype.forEach.call(NodeList, function (node) {});

//  forEach() 与 entries()、values()、和 keys()
NodeList.forEach((node) => console.log(node));

// 经典for
for (var i = 0; i < NodeList.length; ++i) {}
```

:::warning
不要尝试使用 for...in 来遍历一个 NodeList 对象中的元素, NodeList 对象中的 length 和 item 属性也会被遍历出来
:::
