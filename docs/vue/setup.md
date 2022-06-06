# script setup

**顶层的绑定会被暴露给模板**：任何在 \<script setup\> 声明的顶层的绑定 (包括变量，函数声明，以及 import 引入的内容，组件) 都能在模板中直接使用

```html
<template>
  <MyComponent />
  <div @click="log">{{ msg }}</div>
  <div>{{ capitalize('hello') }}</div>
  <button @click="count++">{{ count }}</button>
</template>

<script setup>
  import { ref } from "vue";
  // 组件
  import MyComponent from "./MyComponent.vue";
  // import
  import { capitalize } from "./xxx.ts";
  // 响应式变量
  const count = ref(0);
  // 变量
  const msg = "Hello!";
  // 函数
  const log = () => console.log(msg);
</script>
```

## 递归组件

一个单文件组件可以通过它的文件名被其自己所引用。
例如：名为 FooBar.vue 的组件可以在其模板中用 \<FooBar/\> 引用它自己。

如果有命名的 import 导入和组件的推断名冲突了，可以使用 import 别名导入：

```js
import { FooBar as FooBarChild } from "./components";
```

## 命名空间组件

```html
<template>
  <Form.Input>
    <Form.Label>label</Form.Label>
  </Form.Input>
</template>

<script setup>
  import * as Form from "./form-components";
</script>
```

## 自定义指令

必须以 vNameOfDirective 的形式来命名本地自定义指令，以使得它们可以直接在模板中使用：

```html
<template> <h1 v-my-directive>This is a Heading</h1> </template>;
<script setup>
  const vMyDirective = {
    beforeMount: (el) => {},
  };
</script>
```

## defineProps 和 defineEmits

:::tip

- defineProps 声明 props
- defineEmits 声明 emits
- defineProps 和 defineEmits 都是只在 \<script setup\> 中才能使用
- defineProps 接收与 props 选项相同的值，defineEmits 也接收 emits 选项相同的值
  :::

## defineExpose

使用 \<script setup\> 的组件是默认关闭的，也即通过模板 ref 或者 $parent 链获取到的组件的公开实例，不会暴露任何在 \<script setup\> 中声明的绑定。

为了在 \<script setup\> 组件中明确要暴露出去的属性，使用 defineExpose 编译器宏：

```html
<script setup>
  import { ref } from "vue";
  const a = 1;
  const b = ref(2);
  defineExpose({ a, b });
</script>
```

## useSlots 和 useAttrs

使用 slots 和 attrs 的情况应该是很罕见的，因为可以在模板中通过 $slots 和 $attrs 来访问它们。确需要可以分别用 useSlots 和 useAttrs 两个辅助函数：

```html
<script setup>
  import { useSlots, useAttrs } from "vue";
  const slots = useSlots();
  const attrs = useAttrs();
</script>
```
