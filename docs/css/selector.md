# 选择器

## 基本选择器

- \* 通用元素选择器，匹配任何元素
- E 标签选择器，匹配所有使用 E 标签的元素
- .info class 选择器，匹配所有 class 属性中包含 info 的元素
- #footer id 选择器，匹配所有 id 属性等于 footer 的元素

## 组合选择器

### `E, F`

多元素选择器: 同时匹配所有 E 元素或 F 元素，E 和 F 之间用逗号分隔

### `E F`

后代元素选择器: 匹配所有属于 E 元素后代的 F 元素，E 和 F 之间用空格分隔

### `E > F`

子元素选择器: 子元素选择器，匹配所有 E 元素的子元素 F

### `E + F`

相邻元素选择器: 相邻元素选择器，匹配所有紧随 E 元素之后的同级元素 F

### `E ~ F`

同级元素通用选择器: 匹配任何在 E 元素之后的同级 F 元素

## 属性选择器

### `E[att]`

匹配所有具有 att 属性的 E 元素，不考虑它的值。
注意：E 在此处可以省略，比如"[cheacked]"。以下同。）

### `E[att=val]`

匹配所有 att 属性等于"val"的 E 元素

### `E[att~=val]`

匹配所有 att 属性具有多个空格分隔的值、其中一个值等于"val"的 E 元素

### `E[att|=val]`

匹配所有 att 属性具有多个连字号分隔（hyphen-separated）的值、其中一个值以"val"开头的 E 元素，主要用于 lang 属性，比如"en"、"en-us"、"en-gb"等等

### `E[att^="val"]`

属性 att 的值以"val"开头的元素

### `E[att$="val"]`

属性 att 的值以"val"结尾的元素

### `E[att*="val"]`

属性 att 的值包含"val"字符串的元素

```css
p[title] {
  color: #f00;
}

div[class="error"] {
  color: #f00;
}

td[headers~="col1"] {
  color: #f00;
}

p[lang|="en"] {
  color: #f00;
}

blockquote[class="quote"][cite] {
  color: #f00;
}
```

## 伪元素选择器

### `E:first-line`

匹配 E 元素的第一行

### `E:first-letter`

匹配 E 元素的第一个字母

### `E:before`

在 E 元素之前插入生成的内容

### `E:after`

在 E 元素之后插入生成的内容

### `E:enabled`

匹配表单中激活的元素

### `E:disabled`

匹配表单中禁用的元素

### `E:checked`

匹配表单中被选中的 radio（单选框）或 checkbox（复选框）元素

### `E::selection`

匹配用户当前选中的元素

### `E:root`

匹配文档的根元素，对于 HTML 文档，就是 HTML 元素

### `E:nth-child(n)`

匹配其父元素的第 n 个子元素，第一个编号为 1

### `E:nth-last-child(n)`

匹配其父元素的倒数第 n 个子元素，第一个编号为 1

### `E:nth-of-type(n)`

与:nth-child()作用类似，但是仅匹配使用同种标签的元素

### `E:nth-last-of-type(n)`

与:nth-last-child() 作用类似，但是仅匹配使用同种标签的元素

### `E:last-child`

匹配父元素的最后一个子元素，等同于:nth-last-child(1)

### `E:first-of-type`

匹配父元素下使用同种标签的第一个子元素，等同于:nth-of-type(1)

### `E:last-of-type`

匹配父元素下使用同种标签的最后一个子元素，等同于:nth-last-of-type(1)

### `E:only-child`

匹配父元素下仅有的一个子元素，等同于:first-child:last-child 或 :nth-child(1):nth-last-child(1)

### `E:only-of-type`

匹配父元素下使用同种标签的唯一一个子元素，等同于:first-of-type:last-of-type 或 :nth-of-type(1):nth-last-of-type(1)

### `E:empty`

匹配一个不包含任何子元素的元素，注意，文本节点也被看作子元素
序号 选择器 含义

### `E:not(s)`

匹配不符合当前选择器的任何元素

```css
input[type="text"]:disabled {
  background: #ddd;
}

p:nth-child(3) {
  color: #f00;
}

p:nth-child(odd) {
  color: #f00;
}

p:nth-child(even) {
  color: #f00;
}

p:nth-child(3n + 0) {
  color: #f00;
}

p:nth-child(3n) {
  color: #f00;
}

tr:nth-child(2n + 11) {
  background: #ff0;
}

tr:nth-last-child(2) {
  background: #ff0;
}

p:last-child {
  background: #ff0;
}

p:only-child {
  background: #ff0;
}

p:empty {
  background: #ff0;
}

:not(p) {
  border: 1px solid #ccc;
}
```
