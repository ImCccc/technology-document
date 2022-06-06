# props

下面是 props 相关的用法

```
props: ['props1', 'props2']
```

## props 验证

### 基本验证

```html
<!-- `null` 和 `undefined` 值会通过任何类型验证 -->
<script lang="ts">
  import { defineComponent } from "vue";
  export default defineComponent({
    props: {
      propA: Number, // 基础的类型检查 (`null` 和 `undefined` 值会通过任何类型验证)
      propB: [String, Number], // 多个类型
      propC: { type: String, required: true }, // 必填
      propD: { type: Number, default: 100 }, //默认值
      propE: {
        type: Object,
        default() {
          return { message: "hello" };
        },
      },
      propF: {
        // 自定义验证函数
        validator(value: string) {
          return ["success", "warning", "danger"].includes(value);
        },
      },
    },
  });
</script>
```

### ts 验证

<https://v3.cn.vuejs.org/guide/typescript-support.html#%E6%B3%A8%E8%A7%A3-props>

```js
import { defineComponent, PropType } from 'vue'
interface Book {
  title: string
  author: string
  year: number
}
const Component = defineComponent({
  props: {
    name: String,
    id: [Number, String],
    success: { type: String },
    callback: {
      type: Function as PropType<() => void>
    },
    book: {
      type: Object as PropType<Book>,
      required: true
    },
    metadata: {
      type: null // metadata的类型是any
    },
  }
})
```

你必须注意对象和数组的 validator 和 default 值：

```html
<template>
  <div>{{ bookA }}</div>
  <div>{{ bookB }}</div>
</template>

<script setup lang="ts">
  import { defineProps, PropType } from "vue";
  interface Book {
    title: string;
    year?: number;
  }

  defineProps({
    bookA: {
      type: Object as PropType<Book>,
      default: () => ({ title: "title default" }), // 请务必使用箭头函数
      validator: (book: Book) => !!book.title, // 请务必使用箭头函数
    },
    bookB: {
      type: Object as PropType<Book>,
      // 或者提供一个明确的 this 参数
      default(this: void) {
        return { title: "title default" };
      },
      // 或者提供一个明确的 this 参数
      validator(this: void, book: Book) {
        return !!book.title;
      },
    },
  });
</script>
```

## 传入一个对象的所有 property

```html
<!-- post: { id: 1, title: '2' } -->
<blog-post v-bind="post"></blog-post>

<!-- 等价于： -->
<blog-post v-bind:id="post.id" v-bind:title="post.title"></blog-post>
```

## Attribute 继承与禁止

### Attribute 继承

当组件返回单个根节点时，非 prop 的 attribute 将自动添加到根节点的 attribute 中

```html
<!-- 父组件 -->
<Child data-status="activated"></Child>

<!-- Child.vue 如果 data-status 不在props中， 渲染后的 Child 组件 -->
<div data-status="activated"></div>

<!-- 父组件 -->
<Child @change="submitChange"></Child>
<!-- Child 组件: this.$attrs = { onChange: () => {} } -->
```

:::tip
如果子组件不是单节点，那么不会继承，例如子组件的模板是这样：

```
<template>
  <div>1</div>
  <div>2</div>
</template>
```

:::

### 禁止继承

inheritAttrs: false 禁止继承

```html
<!-- 父组件 -->
<template>
  <Child data-params="2" :first-name="firstName" />
</template>
<script setup lang="ts">
  import Child from "@/components/Child.vue";
  import { ref } from "vue";
  const firstName = ref<string>("1");
</script>

<!-- 子组件: Child.vue -->
<template>
  <div>test</div>
</template>
<script lang="ts">
  import { defineComponent } from "vue";
  export default defineComponent({
    inheritAttrs: false,
    props: { firstName: String },
    setup(props, context) {
      console.log(context.attrs); //  {data-params: '123'}
      console.log(props); // {firstName: '123'}
    },
  });
</script>
```

:::tip
script setup 的写法暂时不知道如何禁止继承
:::

## script setup 使用

```html
<!-- 父组件 -->
<template>
  <Child :first-name="firstName" :last-name="lastName" />
</template>
<script setup lang="ts">
  import { ref } from "vue";
  const firstName = ref<string>();
  const lastName = ref<string>();
</script>

<!-- 子组件: Child.vue -->
<template>
  <div>{{ firstName }}</div>
  <div>{{ lastName }}</div>
</template>
<script setup lang="ts">
  import { defineProps, withDefaults } from "vue";

  interface Props {
    firstName?: string;
    lastName: string;
  }

  // 需要提供默认参数的写法
  const props2 = withDefaults(defineProps<Props>(), {
    firstName: "1",
    lastName: "2",
  });

  // 无需默认参数
  const { firstName } = defineProps({
    firstName: String,
    lastName: String,
  });
</script>
```
