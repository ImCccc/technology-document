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

## 变量（Variables）

```css
@width: 10px;
@height: @width + 10px;
#header {
  width: @width;
  height: @height;
}
```

## 混合（Mixins）

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

## 嵌套（Nesting）

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
