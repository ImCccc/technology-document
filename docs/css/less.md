# less

<https://less.bootcss.com/>

安装：

```
npm install less -g
npm install less@2.7.1 -g
npm i less --save-dev
```

命令行用法:

```
lessc [option option=parameter ...] <source> [destination]
```

将 bootstrap.less 编译为 bootstrap.css

```
lessc bootstrap.less bootstrap.css
```

## 变量

```css
@width: 10px;
@height: @width + 10px;
#header {
  width: @width;
  height: @height;
}
```

## 混合

```css
.bordered {
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}

.post {
  color: red;
  .bordered();
}
```

## 嵌套

```css
/* & 表示当前选择器的父级 */
.clearfix {
  display: block;
  zoom: 1;
  &:after {
    content: " ";
    display: block;
    font-size: 0;
    height: 0;
    clear: both;
    visibility: hidden;
  }
}
```

## 运算

```less
// 所有操作数被转换成相同的单位
@conversion-1: 5cm + 10mm; // 结果是 6cm
@conversion-2: 2 - 3cm - 5mm; // 结果是 -1.5cm

@base: 5%;
@filler: @base * 2; // 结果是 10%
@other: @base + @filler; // 结果是 15%
```

## 转义

```less
@min768: (min-width: 768px);
.element {
  @media @min768 {
    font-size: 1.2rem;
  }
}

// 编译为：
@media (min-width: 768px) {
  .element {
    font-size: 1.2rem;
  }
}
```

## 函数

```less
#bundle() {
  .button {
    display: block;
    border: 1px solid black;
    background-color: grey;
    &:hover {
      background-color: white;
    }
  }
  .tab {
    ...;
  }
}
```

现在，如果我们希望把 .button 类混合到 #header a 中，我们可以这样做：

```less
#header a {
  color: orange;
  #bundle.button(); // 还可以书写为 #bundle > .button 形式
}
```

## 映射（版本 3.5）

```less
#colors() {
  primary: blue;
  secondary: green;
}
.button {
  color: #colors[primary];
  border: 1px solid #colors[secondary];
}
```

## 作用域

Less 中的作用域与 CSS 中的作用域非常类似。首先在本地查找变量和混合（mixins），如果找不到，则从“父”级作用域继承。

```less
@var: red;

#page {
  @var: white;
  #header {
    color: @var; // white
  }
}
```

## 导入

“导入”的工作方式和你预期的一样。你可以导入一个 .less 文件，此文件中的所有变量就可以全部使用了。如果导入的文件是 .less 扩展名，则可以将扩展名省略掉：

```less
@import "library"; // library.less
@import "typo.css";
```
