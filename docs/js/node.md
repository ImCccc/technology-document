# [Node](https://developer.mozilla.org/zh-CN/docs/Web/API/Node)

Node 是一个接口，各种类型的 DOM API 对象会从这个接口继承。它允许我们使用相似的方式对待这些不同类型的对象；比如，继承同一组方法。以下接口都从 Node 继承其方法和属性：`Document, Element, DocumentFragment, ...`

下面举例 span 元素的继承关系：

```js
// HTMLElement 元素的继承关系
var s = document.querySelector(".span1");
s.__proto__; // HTMLSpanElement
s.__proto__.__proto__; // HTMLElement
s.__proto__.__proto__.__proto__; // Element
s.__proto__.__proto__.__proto__.__proto__; // Node
s.__proto__.__proto__.__proto__.__proto__.__proto__; // EventTarget
s.__proto__.__proto__.__proto__.__proto__.__proto__.__proto__; // Object.prototype
s.__proto__.__proto__.__proto__.__proto__.__proto__.__proto__.__proto__; // null

// text 文本元素的继承关系
var t = document.querySelector(".class").childNodes[0]; // <div class="class">1</div>
console.log(a.__proto__); // Text
console.log(a.__proto__.__proto__); // CharacterData
console.log(a.__proto__.__proto__.__proto__); // Node

// 注释元素 comment ....
```

下面列出常见属性方法，注意不是全部

## `Node.childNodes`

只读, 返回一个包含了该节点所有子节点的实时的 NodeList，空字符串也算一个 `Text` 节点 <font color="red">（如果该节点的子节点发生了变化，NodeList 对象就会自动更新）</font>

## `Node.firstChild`

只读, 返回该节点的第一个子节点 Node，如果该节点没有子节点则返回 null。

## `Node.lastChild`

只读, 返回该节点的最后一个子节点 Node，如果该节点没有子节点则返回 null。

## `Node.nextSibling`

只读, 返回与该节点同级的下一个节点 Node，如果没有返回 null。

## `Node.parentNode`

只读, 返回一个当前节点 Node 的父节点 。没有返回 null。

## `Node.parentElement`

只读, 返回一个当前节点的父节点 Element 。没有返回 null。

## `Node.previousSibling`

只读, 返回一个当前节点同辈的前一个 Node。没有返回 null。

## `Node.textContent`

返回或<font color="red"> 设置 </font> 一个元素内所有子节点及其后代的文本内容。

## `Node.nodeName`

返回一个包含该节点名字的 DOMString。HTMLElement 的名字跟它所关联的标签对应。

- span 元素返回 SPAN；
- Text 节点对应的是 '#text' ；
- Document 节点对应的是 '#document'

## `Node.nodeValue`

Node 的 nodeValue 属性返回或设置当前节点的值。

- 对于文档节点 `HTMLElement` 来说，nodeValue 返回 null.
- 对于 text, comment，和 CDATA 节点来说，nodeValue 返回该节点的文本内容.
- 对于 attribute 节点来说，返回该属性的属性值。

## `Node.appendChild()`

将指定的 childNode 参数作为最后一个子节点添加到当前节点。

- 语法: `element.appendChild(aChild)`
- 返回: 返回追加后的子节点 `aChild`
- 参数: `aChild` 要追加给父节点的节点

## `Node.cloneNode()`

- 语法: `var dupNode = node.cloneNode(deep)`
- node: 将要被克隆的节点
- 返回: 克隆生成的副本节点
- 参数: `deep` 是否采用深度克隆；true 节点的后代也被克隆；false 只克隆本身。

## `Node.contains()`

- 语法: `node.contains(otherNode)`
- 返回: 如果 `otherNode` 是 `node` 的后代或是 `node` 节点本身。则返回 true , 否则返回 false
- 参数: `node`节点

## `Node.hasChildNodes()`

返回一个 Boolean 布尔值，来表示该元素是否包含有子节点。

## `Node.insertBefore()`

语法: `parentNode.insertBefore(newNode, referenceNode)`

- `parentNode` 新插入节点的父节点
- 返回 : 被插入节点 (newNode)
- 参数 1: `newNode` 用于插入的节点
- 参数 2:: `referenceNode` newNode 将要插在这个节点之前

## `Node.removeChild()`

语法 `let oldChild = node.removeChild(child)` 或者 `element.removeChild(child)`

返回值 `oldChild === child`

## `Node.replaceChild()`

替换一个子节点 Node 为另外一个节点

语法 `let oldChild = parentNode.replaceChild(newChild, replaceChild)`

返回值 `oldChild === replaceChild`
