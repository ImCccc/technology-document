# document 常见的 api

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

### `HTMLCollection.item(index)`

> 根据给定的索引（从 0 开始），返回具体的节点。如果索引超出了范围，则返回 null。
>
> 访问 collection[i]（在索引 i 超出范围时会返回 undefined）的替代方法。

### `HTMLCollection.namedItem()`

> 根据 ID 返回指定节点，若不存在，则根据字符串所表示的 name 属性来匹配。不存在返回 null。
>
> 访问 collection[name]（在 name 不存在时会返回 undefined）的替代方法。

## getElementById

Document 的方法 getElementById()返回一个匹配特定 ID 的元素。

语法：
`var element = document.getElementById(id);`

## [getElementsByClassName](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/getElementsByClassName)

- 语法： `document.getElementsByClassName(names)` 或者 `element.getElementsByClassName(names)`
- 返回：实时集合 HTMLCollection<font color="red">（可以自动更新自己来保持和 DOM 树的同步）</font>
- 参数：names 是一个字符串，表示要匹配的类名列表

```js
var elements = document.getElementsByClassName("className");
// or
var rootElement = document.getElementById("#id");
var elements = rootElement.getElementsByClassName("className");
```

## [getElementsByName](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/getElementsByName)

- 语法： `document.getElementsByName(name)`
- 返回：实时集合 NodeList <font color="red">（可以自动更新自己来保持和 DOM 树的同步）</font>
- 参数：name 是元素的 name 属性的值

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

## getElementsByTagName

- 语法：`document.getElementsByTagName(name)`
- 返回：实时集合 HTMLCollection <font color="red">（可以自动更新自己来保持和 DOM 树的同步）</font>
- 参数：name 是一个代表元素的名称的字符串。特殊字符 "\*" 代表了所有元素

```js
var elements = document.getElementsByTagName("div");
// or
var div1 = document.getElementById("div1");
var div1Paras = div1.getElementsByTagName("p");
```

::: danger
最新的 W3C 规范 说明这些元素是 HTMLCollection（HTML 集合）； 然而这个方法在 WebKit 内核的浏览器中返回一个 NodeList
:::

## querySelector

- 语法： `document.querySelector(selectors)` 或者 `element.querySelector(selectors)`
- 返回：方法返回匹配的第一个 Element 对象，找不到返回 null。
- 参数：包含一个或多个要匹配的选择器的 DOM 字符串

```js
// id选择器
document.querySelector("#id");
// 属性选择器
document.querySelector(`[name="down"]`);
// 类选择器
document.querySelector(".class");
// Node 元素上使用
var elements = document.getElementsByTagName("div");
elements.querySelector(".class");
```

## querySelectorAll

- 语法： `document.querySelectorAll(selectors)` 或者 `element.querySelectorAll(selectors)`
- 返回：静态 NodeList 集合<font color="red">（不能保持 DOM 树的同步）</font>
- 参数：包含一个或多个要匹配的选择器的 DOM 字符串

```js
// 返回文档中所有<div>元素的列表，其中 class 包含"note"或"alert"
var matches = document.querySelectorAll("div.note, div.alert");

// 返回文档中属性名为"data-src"的iframe元素列表：
var matches = document.querySelectorAll("iframe[data-src]");

// 返回 ID 为"userlist"的列表中包含值为"1"的"data-active"属性的元素
var container = document.querySelector("#userlist");
var matches = container.querySelectorAll("li[data-active='1']");
```

## createTextNode

创建一个新的文本节点。这个方法可以用来转义 HTML 字符。

- 语法：`document.createTextNode(data)`
- 返回：文本节点
- 参数：data 是一个字符串，包含了要放入文本节点的内容

```js
var text = document.createTextNode(`<span>1</span>`);
const p1 = document.getElementById("p1").appendChild(text);
```

## createElement

创建一个由标签名称 tagName 指定的 HTML 元素
