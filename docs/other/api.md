# 常见的 API

## dom 元素的距离相关

### box-sizing

语法: <code>box-sizing: content-box|border-box|inherit:</code>

- content-box

  > 默认值。一个元素的 width 为 100px，那么这个元素的内容区(content)会有 100px 宽，并且任何边框和内边距的宽度都会被增加到最后绘制出来的元素宽度中

- border-box
  > 设置的 border 和 padding 的值是包含在 width 内的。
  >
  > 将一个元素的 width 设为 100px，那么这 100px 会包含它的 border 和 padding，内容区的实际宽度是 width - border - padding

<font size="6">下面介绍元素的距离，宽高相关的 api</font>

参考：<https://www.runoob.com/jsref/prop-element-offsetheight.html>

### clientHeight 和 clientWidth

```js
// 使用
document.getElementById("id").clientHeight;
```

clientHeight: **padding(上下) + 内容**

clientWidth: **padding(左右) + 内容**

> 如果设置 box-sizing: border-box
>
> clientHeight = height - border(上下) - padding(上下)
>
> clientWidth = width - border(左右) - padding(左右)

### offsetHeight 和 offsetWidth

```js
// 使用
document.getElementById("id").offsetWidth;
```

offsetHeight: **内容 + padding(上下) + 水平滚动条** (不包括 margin)

offsetWidth: **内容 + padding(左右) + 垂直滚动条** (不包括 margin)

> 如果设置 box-sizing: border-box
>
> offsetHeight = height (class 或者 style 设置的 height)
>
> offsetWidth = width (class 或者 style 设置的 width)

clientHeight 、offsetHeight、clientWidth、offsetWidth 和元素的滚动、位置没有关系

### scrollHeight 和 scrollWidth

```js
// 使用
document.getElementById("id").scrollHeight;
```

scrollHeight 和 scrollWidth = 可见区域宽高 + 隐藏区域的宽高 (其实就是实际宽高)

- 如果出现滚动条:

  - scrollHeight = clientHeight + 隐藏区域高度
  - scrollWidth = clientWidth + 隐藏区域高度

- 如果没有滚动条:
  - scrollHeight = clientHeight
  - scrollWidth = clientWidth

<font color="red">注意: scrollHeight 不包括 border 和 滚动条</font>

### scrollTop 和 scrollLeft

```js
// 使用
document.getElementById("id").scrollTop;
```

scrollTop: 有滚动条时，元素顶部被遮住部分的高度。没有滚动条时 scrollTop = 0。单位 px，可读可设置。同理，scrollLeft: 有滚动条时，元素左侧被遮住部分的高度。

> 注意：没有 scrollBottom 和 scrollRight

### offsetTop 和 offsetLeft

```js
// 使用
document.getElementById("id").offsetTop;
```

offsetTop: 当前元素距离上一级定位元素的上边的偏移量

offsetLeft: 当前元素距离上一级定位元素的左边的偏移量

:::tip
offsetTop 和 offsetLeft 的值跟父级元素没关系；
跟其上一级的定位元素 （除 `position:static` 外的所有定位如 `fixed`,`relative`,`absolute`）有关系
:::

### clientTop 和 clientLeft

```js
// 使用
document.getElementById("id").clientLeft;
```

`clientLeft` `clientTop` 返回的是元素周围边框的厚度, 也就是`border`, 没有边框就是 0

### innerWidth 和 innerHeight

- `window.innerWidth` 和 `window.innerHeight` 理解为浏览器内容区域的宽高，不包括菜单栏

```css
/* 如果设置下面的样式, 那么 window.innerHeight === document.body.offsetHeight */
body,
html {
  height: 100%;
}
```

> 备注：
>
> - 浏览器缩放,这 2 个值也会随着变化
> - 浏览器窗口变化,这 2 个值也会随着变化

### outerHeight 和 outerWidth

window.outerHeight 和 window.outerWidth 理解为浏览器窗口的宽高，包括菜单栏、地址栏。只和浏览器客户端有关，和浏览器地址栏，侧边栏，浏览器显示区域内容无关

> 备注:
>
> - 浏览器缩放,这 2 个值 <font color="red">不会</font> 随着变化
> - 浏览器窗口变化,这 2 个值也会随着变化

### screen.height 和 screen.width

是指的屏幕，表示当前整个显示器显示的屏幕部分，不限于当前的窗口。height 是屏幕的宽度，例如屏幕分辨率 1920\*1080 的话，一般情况下 screen.heigth 即为 1080。

> 备注:
>
> - 只和电脑分辨率有关，和浏览器无关

### screen.availHeight 和 screen.availWidth

- `availHeight` 只读属性，返回屏幕上可用于浏览器的区域的高度

- 浏览器的区域是除任务栏以外的整个屏幕

## 浏览器常用的 api

### URL

构造、解析、规范化和编码 URL

```js
/*
  {
    hash: ""
    host: "blog.csdn.net"
    hostname: "blog.csdn.net"
    href: "https://blog.csdn.net/hello?id=kasd&name=skhf"
    origin: "https://blog.csdn.net"
    password: ""
    pathname: "/hello"
    port: ""
    protocol: "https:"
    search: "?id=kasd&name=skhf"
    searchParams: URLSearchParams {}
    username: ""
  }
*/
var url = new URL("https://blog.csdn.net/hello?name=xxx&age=1");

// 获取参数
var name = url.searchParams.get("name");

// 设置 hash
url.hash = "hee";

// 设置参数
url.search = "aaa=xxx";

// url.href = https://blog.csdn.net/hello?aaa=xxx#hee
```

### URLSearchParams

处理 url 的查询字符串

- <code>append(name,value)</code> : 添加一个数据
- <code>delete(name)</code> : 删除指定参数名的数据
- <code>entries()</code> : 迭代遍历键/值对的对象.
- <code>get(name)</code> : 获取到指定参数名的第一个值.
- <code>getAll(name)</code> : 返回指定参数名的所有值,数组
- <code>has(name)</code> : 判断是否存在某个参数.
- <code>keys()</code> : 所有参数的键的迭代对象.
- <code>set(name,value)</code> : 设置某个参数的值.
- <code>sort()</code> : 按键名排序.
- <code>toString()</code> : 返回查询字符串.
- <code>values()</code> : 包含所有值的迭代对象.

```js
/*
  params1.toString() = name=xx1&age=1
  params2.toString() = name=xx2&age=2
  params3.toString() = name=xx3&age=3
*/
var params1 = new URLSearchParams("?name=xx1&age=1");
var params2 = new URLSearchParams({
  age: 2,
  name: "name1",
});
var params3 = new URLSearchParams([
  ["name", "xx1"],
  ["age", 3],
]);
```

## 编码解码

### 编码 encodeURIComponent 和 encodeURI

encodeURIComponent 和 encodeURI 用来编码和解码 URI 的,URI 叫统一资源标识符，是用来标识互联网上的资源（例如，网页或文件）和怎样访问这些资源的传输协议（例如，HTTP 或 FTP）的字符串

```
encodeURI(url)
encodeURIComponent(url)
```

### 解码 decodeURIComponent 和 decodeURI

就是对 encodeURIComponent 和 encodeURI 解码的函数

```js
var url = "https://www.w3.org/hello?name=搜索";
// https://www.w3.org/hello?name=搜索
console.log(decodeURI(encodeURI(url)));
// https://www.w3.org/hello?name=搜索
console.log(decodeURIComponent(encodeURIComponent(url)));
```

### encodeURIComponent 和 encodeURI 区别

```js
var url = "https://www.w3.org/hello?name=搜索&age=123#abc!*().'";
// https://www.w3.org/hello?name=%E6%90%9C%E7%B4%A2&age=123#abc!*().'
console.log(encodeURI(url));
// https%3A%2F%2Fwww.w3.org%2Fhello%3Fname%3D%E6%90%9C%E7%B4%A2%26age%3D123%23abc!*().'
console.log(encodeURIComponent(url));
```

相同点:

1. 都不会对[a-zA-Z0-9]的字符以及!\*()'.进行编码
2. 如果遇到中文的话，两者的解析结果是一样的

不同点:

encodeURIComponent 会对特殊字符编码

<font color="red">encodeURI 不会对一些特殊字符进行编码，例如: ":"、"/"、";" 、"?" </font>

所以一般处理浏览器链接，例如将地址作为参数放进地址栏，设置参数等，都使用 encodeURIComponent

## event 对象

### event.pageX、event.pageY

鼠标相对于文档区域的 X，Y 坐标, 这 2 个属性不是标准属性，但得到了广泛支持。在页面没有滚动的情况下， pageX 和 pageY 的值与 clientX 和 clientY 的值相等。

### event.clientX、event.clientY

鼠标相对于浏览器窗口可视区域的 X，Y 坐标（窗口坐标），可视区域不包括工具栏和滚动条。当有滚动条时 clientX 小于 pageX。

### event.offsetX、event.offsetY

鼠标相对于事件源元素（srcElement）的 X,Y 坐标，只有 IE 事件有这 2 个属性，标准事件没有对应的属性。

### event.screenX、event.screenY

鼠标相对于用户显示器屏幕左上角的 X,Y 坐标。screenX 指的是鼠标到电脑屏幕左侧的距离。例如：当网页缩小，拖动到屏幕中间时，screnX 大于 clientX .
