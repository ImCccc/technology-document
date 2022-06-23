# 常见事件

本章节列出常见的元素事件

## 剪贴板事件

### copy

当用户通过浏览器 UI（例如，使用 `Ctrl/⌘ + C` 键盘快捷方式或从菜单中选择“复制”）启动复制操作并响应允许的 `document.execCommand('copy')` 调用时触发 copy 事件

- 如果默认事件没有取消，就复制选中内容到剪切板；
- 如果取消了默认事件，但是调用了 setData()方法：就复制 clipboardData 的内容到到剪切板；
- 如果取消了默认行为，而且没有调用 setData()方法，就没有任何行为；

```js
// Ctrl + C 会进入该方法，Ctrl + v 的内容是 xxx
document.addEventListener("copy", function (e) {
  e.clipboardData.setData("text/plain", "xxx");
  e.preventDefault(); // 取消了默认事件，调用了setData('xxx')方法：就复制'xxx'到到剪切板
});
```

### cut

用户剪切操作`Ctrl/⌘ + x`触发; 行为和`copy`事件基本一样

```js
// Ctrl + X 会进入该方法，Ctrl + v 的内容是 cut
document.addEventListener("cut", function (e) {
  e.clipboardData.setData("text/plain", "cut");
  e.preventDefault();
});
```

### paste

当用户在浏览器用户界面发起粘贴 `Ctrl/⌘ + v` 操作时，会触发 paste 事件。

- 如果光标位于可编辑的上下文中，则默认操作是将剪贴板的内容插入光标所在位置的文档中
- 访问剪贴板内容: `e.clipboardData.getData("text")`
- 要转换剪贴板的内容，必须 `event.preventDefault()` 取消默认操作，然后手动插入想要的数据

---

例子： 将粘贴板的内容全部转为大写

```js
// element.addEventListener("paste",(e) => {}) 也是可以的
document.addEventListener("paste", function (event) {
  // 获取粘贴板上文本
  let paste = (event.clipboardData || window.clipboardData).getData("text");

  paste = paste.toUpperCase();

  // window.getSelection(): 返回的对象表示用户选择的文本范围或光标的当前位置。
  const selection = window.getSelection();
  if (!selection.rangeCount) return false;

  // 删除选区中的内容
  selection.deleteFromDocument();

  // 插入新内容
  selection.getRangeAt(0).insertNode(document.createTextNode(paste));

  // 将当前的选区折叠到最末尾的一个点 （页面效果：粘贴后，光标在粘贴文本的最后）
  selection.collapseToEnd();

  // 阻止默认行为，自定义行为
  event.preventDefault();
});
```

:::tip
也可以在具体某一个 dom 元素上监听 `paste` 事件
:::

[参考资源：window.getSelection()](https://developer.mozilla.org/zh-CN/docs/Web/API/Selection)

## 键盘事件

### keydown

keydown 事件触发于键盘按键按下的时候。与 keypress (en-US) 事件不同的是，所有按键均会触发 keydown 事件，无论这些按键是否会产生字符值

```js
const input = document.querySelector("input");
input.addEventListener("keydown", (e) => {
  console.log(e.keyCode);
  console.log(e.code);
});
// 输入大写 A,  e.keyCode = 65;  e.code = 'KeyA'
// 输入小写 a,  e.keyCode = 65;  e.code = 'KeyA'
// 不能区分大小写
```

:::danger
keypress 事件能区分大小写，不过准备废弃
:::

### keyup

keyup 事件在按键被松开时触发。

```js
const input = document.querySelector("input");
input.addEventListener("keyup", (e) => {
  console.log("keyup keyCode :", e.keyCode);
  console.log("keyup code :", e.code);
});
```

## 鼠标事件

### dblclick

在单个元素上单击两次鼠标的指针设备按钮 (通常是小鼠的主按钮) 时，将触发 dblclick 事件。

### mousedown

mousedown 事件在指针设备（鼠标）按钮按下时触发。

```js
element.addEventListener("mousedown", (e) => {
  console.log("mousedown", e);
});
```

### mouseup

mousedown 事件在指针设备（鼠标）按钮放开时触发。与 mousedown 事件相反。

```js
element.addEventListener("mouseup", (e) => {
  console.log("mouseup", e);
});
```

### mouseenter

当定点设备（通常指鼠标）移动到元素上时就会触发 mouseenter 事件

```js
element.addEventListener("mouseenter", (e) => {
  console.log("mouseenter", e);
});
```

### mouseleave

指点设备（通常是鼠标）的指针移出某个元素时，会触发 mouseleave 事件。

```js
element.addEventListener("mouseleave", (e) => {
  console.log("mouseleave", e);
});
```

### mousemove

当指针设备 ( 通常指鼠标 ) 在元素上移动时，mousemove 事件被触发。

```js
element.addEventListener("mousemove", (e) => {
  console.log("mousemove");
});
```

### mouseout

- 当移动指针设备（通常是鼠标），使指针不再包含在这个元素或其子元素中时， `mouseout` 触发
- 父元素移入子元素时， `mouseout` 也会触发; `mouseleave` 不会

```js
element.addEventListener("mouseout", (e) => {
  console.log("mouseout");
});
```

### mouseover

- 当使用定点设备（如鼠标或触控板）将光标移动到元素或其子元素上时，将向元素激发 mouseover 事件。
- 父元素移入子元素时， `mouseover` 也会触发; `mouseenter` 不会

```js
element.addEventListener("mouseover", (e) => {
  console.log("mouseover");
});
```

### contextmenu

该事件通常在鼠标点击右键或者按下键盘上的菜单键时被触发

例子： noContext 上禁止菜单右键

```js
let noContext = document.getElementById("noContextMenu");
noContext.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});
```

## Touch 事件

```js
const el = document.getElementById("canvas");
el.addEventListener("touchstart", handleStart);
el.addEventListener("touchend", handleEnd);
el.addEventListener("touchcancel", handleCancel);
el.addEventListener("touchmove", handleMove);

function handleStart(e) {
  console.log(e);
}
```

### touchstart

当一个或多个触摸点与触控设备表面接触时触发 touchstart 事件。

### touchcancel

当触摸点被中断时会触发 touchcancel 事件，中断方式基于特定实现而有所不同（例如， 创建了太多的触摸点）。

### touchend

当从触摸表面移除一个或多个触摸点时，触发 touchend 事件。

### touchmove

当一个或多个触摸点沿触摸表面移动时，触发 touchmove 事件。

## 拖拽事件

### drag

当元素被拖动时触发 drag 事件 （每几百毫秒触发一次）

```js
document.addEventListener("drag", (e) => {
  console.log("drag");
});
// or
var targetEle = document.getElementById("targetId");
targetEle.addEventListener("drag", (e) => {
  console.log("drag");
});
```

### dragstart

当用户开始拖动一个元素 dragstart 事件就会触发。

```js
document.addEventListener("dragstart", (e) => {
  console.log("dragstart");
});
// or
var targetEle = document.getElementById("targetId");
targetEle.addEventListener("dragstart", (e) => {
  console.log("dragstart");
});
```

### dragend

拖放结束时触发 (释放鼠标按钮 或 单击`esc`键)。

```js
document.addEventListener("dragend", (e) => {
  console.log("dragend");
});
// or
var targetEle = document.getElementById("targetId");
targetEle.addEventListener("dragend", (e) => {
  console.log("dragend");
});
```

### dragenter

当拖动元素进入有效的放置目标时，dragenter 事件被触发。

```js
document.addEventListener("dragenter", (e) => {
  console.log("dragenter");
});
// or
var targetEle = document.getElementById("targetId");
targetEle.addEventListener("dragenter", (e) => {
  console.log("dragenter");
});
```

### dragleave

当拖动元素离开可放置目标节点，将会触发 dragleave 事件。

```js
document.addEventListener("dragleave", (e) => {
  console.log("dragleave");
});
// or
var targetEle = document.getElementById("targetId");
targetEle.addEventListener("dragleave", (e) => {
  console.log("dragleave");
});
```

### dragover

当拖动元素被拖拽到一个有效的放置目标上时，触发 dragover 事件 （每几百毫秒触发一次）

```js
document.addEventListener("dragover", (e) => {
  console.log("dragover");
});
// or
var targetEle = document.getElementById("targetId");
targetEle.addEventListener("dragover", (e) => {
  console.log("dragover");
});
```

### drop

当拖动的元素放到一个有效的释放目标位置时，drop 事件被抛出。

```js
document.addEventListener("drop", (e) => {
  e.preventDefault();
  // 将拖动的元素到所选择的放置目标节点中
  if (e.target.className == "dropzone") console.log(drop);
});
// or
var targetEle = document.getElementById("targetId");
targetEle.addEventListener("drop", (e) => {
  console.log("drop");
});
```

## 其他事件

### 选择文本事件 select

只有在选择了`<input type=“text”>`或`<textarea>`中的文本后，选择事件才会触发。

```js
var inputDom = document.getElementById("input");
inputDom.onselect = (e) => console.log(e);
// or
inputDom.addEventListener("select", (e) => console.log(e));
```

### 窗口变化事件 resize

浏览器调整窗口大小后，将触发 resize 事件。

```js
window.onresize = () => console.log(2);
window.addEventListener("resize", () => console.log(1));
```
