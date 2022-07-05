# css module

<https://www.ruanyifeng.com/blog/2016/06/css_modules.html>

**CSS 的规则都是全局的，任何一个组件的样式规则，都对整个页面有效。**

产生局部作用域的唯一方法，就是使用一个独一无二的 class 的名字，不会与其他选择器重名。这就是 CSS Modules 的做法。

## 全局作用域

CSS Modules 允许使用 `:global(.className)` 的语法，声明一个全局规则。凡是这样声明的 class，都不会被编译成哈希字符串。

如果需要覆盖第三方库的样式, 可以这样使用:

```css
:global(.title) {
  color: green;
}
```

## Class 的组合

在 CSS Modules 中，一个选择器可以继承另一个选择器的规则，这称为"组合"（"composition"）。

`App.css`中，让 `.title` 继承 `.className`

```css
.className {
  background-color: blue;
}

.title {
  composes: className;
  color: red;
}
```
