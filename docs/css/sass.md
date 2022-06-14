# sass

<https://www.sass.hk/docs/>

Sass 是一款强化 CSS 的辅助工具，它在 CSS 语法的基础上增加了变量 (variables)、嵌套 (nested rules)、混合 (mixins)、导入 (inline imports) 等高级功能，这些拓展令 CSS 更加强大与优雅。Sass 有两种语法格式:

1. scss (Sassy CSS) 这种格式仅在 CSS3 语法的基础上进行拓展，所有 CSS3 语法在 SCSS 中都是通用的，同时加入 Sass 的特色功能, 这种格式以 .scss 作为拓展名

2. sass 缩进格式 (Indented Sass) 通常简称 "Sass"，是一种简化格式。它使用 “缩进” 代替 “花括号” 表示属性属于某个选择器，用 “换行” 代替 “分号” 分隔属性, 这种格式以 .sass 作为拓展名

```js
// 在命令行中运行 Sass：
sass input.scss output.css

// 监视单个 Sass 文件，每次修改并保存时自动编译：
sass --watch input.scss:output.css

// 监视整个文件夹：
sass --watch app/sass:public/stylesheets
```

## 变量

变量以美元符号开头，赋值方法与 CSS 属性的写法一样, 变量支持块级作用域，嵌套规则内定义的变量只能在嵌套规则内使用（局部变量），不在嵌套规则内定义的变量则可在任何地方使用（全局变量）

```css
$width: 5em;

#main {
  width: $width;
}
```

**将局部变量转换为全局变量可以添加 !global 声明：**

```css
#main {
  /* 局部变量，添加 !global 后变为全局变量 */
  $width: 5em !global;
  width: $width;
}

#sidebar {
  width: $width;
}
```

## 父选择器

用 & 代表嵌套规则外层的父选择器:

```css
a {
  font-weight: bold;
  &:hover {
    text-decoration: underline;
  }
  body.firefox & {
    font-weight: normal;
  }
}

/* 编译为 */
a {
  font-weight: bold;
}
a:hover {
  text-decoration: underline;
}
body.firefox a {
  font-weight: normal;
}
```

& 必须作为选择器的第一个字符，其后可以跟随后缀生成复合的选择器，例如

```css
#main {
  &-sidebar {
    border: 1px solid;
  }
}

/* 编译为 */
#main-sidebar {
  border: 1px solid;
}
```

## 嵌套属性

反复写 border-styleborder-widthborder-color 以及 border-\*等也是非常烦人的。在 sass 中，你只需敲写一遍 border：

```scss
// 例子1
nav {
  border: {
    style: solid;
    width: 1px;
    color: #ccc;
  }
}
// 编译后
nav {
  border-style: solid;
  border-width: 1px;
  border-color: #ccc;
}

// 例子2
nav {
  border: 1px solid #ccc {
    left: 0px;
    right: 0px;
  }
}
// 编译后
nav {
  border: 1px solid #ccc;
  border-left: 0px;
  border-right: 0px;
}
```

## 默认变量值 !default

```scss
$fancybox-width: 400px !default;
.fancybox {
  width: $fancybox-width;
}
```

上例中，如果用户在导入你的 sass 局部文件之前声明了一个$fancybox-width变量，那么你的局部文件中对$fancybox-width 赋值 400px 的操作就无效。如果用户没有做这样的声明，则$fancybox-width 将默认为 400px。

## 导入 @import

sass 局部文件的文件名以下划线开头。这样，sass 就不会在编译时单独编译这个文件输出 css,而只把这个文件用作导入:

你想导入 `themes/_night-sky.scss` 这个局部文件里的变量，你只需在样式表中写`@import "themes/night-sky"`

- **三种情况下会生成原生的 CSS@import:**
  1.  被导入文件的名字以.css 结尾
  2.  被导入文件的名字是一个 URL 地址（比如http://www.sass.hk/css/css.css）
  3.  被导入文件的名字是 CSS 的 url()值

## 混合 @mixin

```scss
@mixin rounded-corners {
  border-radius: 5px;
}
.notice {
  @include rounded-corners;
}
```

混合嵌套规则：

```scss
@mixin no-bullets {
  list-style: none;
  li {
    margin-left: 0px;
  }
}
ul.plain {
  color: #444;
  @include no-bullets;
}

// 编译后
ul.plain {
  color: #444;
  list-style: none;
}
ul.plain li {
  margin-left: 0px;
}
```

混合器传参 + 默认参数：

```scss
// $hover: red 默认参数
@mixin link-colors($normal, $hover: red, $visited: green) {
  color: $normal;
  &:hover {
    color: $hover;
  }
  &:visited {
    color: $visited;
  }
}

a {
  @include link-colors(blue, red, green);
}
// 忽略参数顺序，也可以这样使用
a {
  @include link-colors($normal: blue, $visited: green, $hover: red);
}
```

## 继承 @extend

```scss
.error {
  border: 1px solid red;
  background-color: #fdd;
}
.error a {
  //应用到.seriousError a
  color: red;
  font-weight: 100;
}
h1.error {
  //应用到hl.seriousError
  font-size: 1.2rem;
}

.seriousError {
  @extend .error;
  border-width: 3px;
}
```

上例子 `.seriousError` 不仅会继承 `.error` 自身的所有样式，任何跟 `.error` 有关的组合选择器样式也会被 `.seriousError` 以组合选择器的形式继承
