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

## 变量 $

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

## 数据类型

- 字符串 (Strings)
  SassScript 支持 CSS 的两种字符串类型：有引号字符串 (quoted strings)，如 "Lucida Grande" ；与无引号字符串 (unquoted strings)，如 sans-serif bold，在编译 CSS 文件时不会改变其类型。只有一种情况例外，使用 #{} (interpolation) 时，有引号字符串将被编译为无引号字符串，这样便于在 mixin 中引用选择器名：

```css
@mixin firefox-message($selector) {
  body.firefox #{$selector}:before {
    content: "Hi, Firefox users!";
  }
}
@include firefox-message(".header");
```
