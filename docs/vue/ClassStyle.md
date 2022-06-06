# class and style

下面列出常见的 class 语法和 style 语法

## 对象语法

我们可以传给 :class (v-bind:class 的简写) 一个对象，以动态地切换 class：

```html
<div class="static" :class="{ active: true }"></div>
<div :style="{color: 'red', fontSize: '30px'}"></div>

<!-- active 样式是否存在，在于active的值是否为 truthy，上面渲染结果为： -->
<div class="static active"></div>
<div style="color: red; font-size: 30px;"></div>
```

## 数组语法

```html
<template>
  <div :class="['active', 'text-danger']"></div>
  <div :style="[style1, style2]"></div>
</template>

<script setup lang="ts">
  import { CSSProperties } from "vue";
  const style1: CSSProperties = { fontSize: "30px" };
  const style2: CSSProperties = { color: "red" };
</script>

<!-- 渲染结果 -->
<div class="active text-danger"></div>
<div style="font-size: 30px; color: red;"></div>
```

## 三元表达式

```html
<div :class="[isActive ? activeClass : '', errorClass]"></div>
```

## 数组中使用对象语法

```html
<div :class="[{ active: isActive }, errorClass]"></div>
```

## 自定义组件添加 class

如果在父组件组件中给子组件添加样式，如果子组件

- 只有一个根元素：会自动添加到子组件跟元素上
- 有多个根元素：不会自动添加，可以使用$attrs.class 添加到某一个元素上

```html
<!-- 父组件 -->
<template>
  <HelloWorld class="xxxx" />
</template>

<!-- 子组件：一个跟节点，自动添加class="xxxx" -->
<template>
  <div>child1</div>
</template>

<!-- 子组件：多个根节点，手动添加 -->
<template>
  <div>child1</div>
  <div :class="$attrs.class">child2</div>
</template>
```

## 样式隔离 scoped

```html
<style lang="scss" scoped>
  .example {
    color: red;
  }
</style>
```

## CSS Modules

\<style module\> 标签会被编译为 CSS Modules 并且将生成的 CSS 类作为 $style 对象的键暴露给组件：

```html
<template>
  <p :class="$style.red">red</p>
</template>
<style module>
  .red {
    color: red;
  }
</style>
```

## 动态 CSS

单文件组件的 \<style\> 标签可以通过 v-bind 这一 CSS 函数将 CSS 的值关联到动态的组件状态上:

```html
<template>
  <div class="text">bookB</div>
</template>
<script lang="ts">
  import { defineComponent } from "vue";
  export default defineComponent({
    setup() {
      return { color: "red" };
    },
  });
</script>
<style>
  .text {
    color: v-bind(color);
  }
</style>
```

script setup:

```html
<template>
  <div class="text">bookB</div>
</template>
<script setup lang="ts">
  const theme = {
    color: "red",
  };
</script>
<style>
  .text {
    color: v-bind("theme.color");
  }
</style>
```
