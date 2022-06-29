# css module

<https://www.ruanyifeng.com/blog/2016/06/css_modules.html>

### 全局作用域

CSS Modules 允许使用 `:global(.className)` 的语法，声明一个全局规则。凡是这样声明的 class，都不会被编译成哈希字符串。

如果需要覆盖第三方库的样式, 可以这样使用:

```css
:global(.title) {
  color: green;
}
```
