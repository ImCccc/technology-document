# Document

## 查询 dom 元素相关

### `getElementsByClassName()`

Element 也有该方法，[参考](/js/element.html#getelementsbyclassname)

### `getElementsByTagName()`

Element 也有该方法，[参考](/js/element.html#element-getelementsbytagname)

### `querySelector()`

Element 也有该方法，[参考](/js/element.html#element-queryselector)

### `querySelectorAll()`

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
