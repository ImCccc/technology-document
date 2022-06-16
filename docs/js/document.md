# document

## [NodeList](https://developer.mozilla.org/zh-CN/docs/Web/API/NodeList)

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

### `Array.from(NodeList)`

> 转数组

### `NodeList.length`

> NodeList 中包含的节点个数

### `NodeList.item()`

> 返回 NodeList 对象中指定索引的节点，如果索引越界，则返回 null。
>
> 等价的写法是 nodeList[i]，不过，在这种情况下，越界访问将返回 undefined。

### `NodeList.entries()`

```js
let b = document.querySelectorAll(`.class1`);
for (let c of b.entries()) {
  console.log(c); // [0, div.class1]  [1, div.class1]
}
```

### `NodeList.keys()`

```js
for (let c of b.keys()) {
  console.log(c); // 0 1
}
```

### `NodeList.values()`

```js
for (let c of b.values()) {
  console.log(c); // div.class1  div.class1
}
```

### `NodeList.forEach()`

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

## [HTMLCollection](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCollection)

HTMLCollection 接口表示一个包含了元素（元素顺序为文档流中的顺序）的通用集合，还提供了用来从该集合中选择元素的方法和属性。<font color="red">HTMLCollection 不是数组，不能使用 map , filter 等等 api</font>

### `Array.from(HTMLCollection)`

> 转数组

### `HTMLCollection.length`

> 返回元素的数目

### `HTMLCollection.item()`

> 根据给定的索引（从 0 开始），返回具体的节点。如果索引超出了范围，则返回 null。
>
> 访问 collection[i]（在索引 i 超出范围时会返回 undefined）的替代方法。

### `HTMLCollection.namedItem()`

> 根据 ID 返回指定节点，若不存在，则根据字符串所表示的 name 属性来匹配。不存在返回 null。
>
> 访问 collection[name]（在 name 不存在时会返回 undefined）的替代方法。

## 查询 dom 元素相关

### `getElementsByClassName()`

Element 也有该方法，[参考](/js/element.html#getelementsbyclassname)

### `Element.getElementsByTagName()`

Element 也有该方法，[参考](/js/element.html#element-getelementsbytagname)

### `Element.querySelector()`

Element 也有该方法，[参考](/js/element.html#element-queryselector)

### `Element.querySelectorAll()`

Element 也有该方法，[参考](/js/element.html#element-queryselectorall)

### `getElementById()`

返回: 一个匹配特定 `ID` 的 [ Element ](/js/document.html#element)

语法: `var element = document.getElementById(id)`

:::tip
Element 没有该方法
:::

### `getElementsByName()`

- [语法](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/getElementsByName)： `document.getElementsByName(name)`
- 返回：实时集合 NodeList <font color="red">（可以自动更新自己来保持和 DOM 树的同步）</font>
- 参数：name 是元素的 name 属性的值

:::tip
Element 没有该方法
:::

```js
<form name="up" id="form1"></form>
<form name="up" id="form2"></form>

var forms = document.getElementsByName("up");
console.log(forms);  // NodeList(2) [form#form1, form#form2]

document.getElementById("form1").remove();
console.log(forms); // NodeList [form#form2]
```

::: danger
有浏览器兼容性问题。在 IE 和 Opera 中， getElementsByName() 方法还会返回那些 id 为指定值的元素。不要为元素的 name (en-US) 和 id 赋予相同的值。

IE 和 Edge 都返回一个 HTMLCollection, 而不是 NodeList 。
:::

## 创建 dom 元素相关

### createTextNode

创建一个新的文本节点。这个方法可以用来转义 HTML 字符。

- 语法: `document.createTextNode(data)`
- 返回: 文本节点
- 参数: data 是一个字符串，包含了要放入文本节点的内容

```js
var text = document.createTextNode(`<span>1</span>`);
const p1 = document.getElementById("p1").appendChild(text);
```

### createElement

创建一个由标签名称 tagName 指定的 HTML 元素

- 语法: `document.createElement(tagName, [options])`
- 返回: 新建的元素（Element）
- 参数 tagName: 指定要创建元素类型的字符串
- 参数 options:
