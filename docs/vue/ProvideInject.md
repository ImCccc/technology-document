# provide / inject

<https://v3.cn.vuejs.org/api/composition-api.html#provide-inject>

解决深层次父子组件数据传递的问题

## 基本用法

```html
<!-- 父组件 -->
<template>
  <Children />
</template>
<script setup lang="ts">
  import { provide } from "vue";
  provide("user", 123);
</script>

<!-- 子组件 Children.vue -->
<script setup lang="ts">
  import { inject } from "vue";
  const user = inject("user");
</script>
```

## ts 用法

Vue 提供了一个 InjectionKey 接口。它可用于在生产者和消费者之间同步 inject 值的类型

```js
// provide-key.ts
import { InjectionKey, ComputedRef } from "vue";
export const key: InjectionKey<ComputedRef<number>> = Symbol("user");

// 父组件
import { key } from "@/components/provide-key";
import { provide, ref } from "vue";
const num = ref < number > 123;
provide(key, num);

// 子组件
import { inject } from "vue";
import { key } from "@/components/provide-key";
const num = inject(key);
```

:::tip
传递的变量，是响应式的，那么子组件使用也是响应式
:::
