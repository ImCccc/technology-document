# vue3

## 模板语法 v-bind

v-bind 指令指示 Vue 将元素的 id attribute 与 dynamicId 变量保持一致。

```jsx
<div v-bind:id="dynamicId"></div>
// 简写
<div :id="dynamicId"></div>
```

### 同名简写 3.4 +

如果 attribute 的名称与绑定的 JavaScript 值的名称相同，那么可以进一步简化语法，省略 attribute 值：

```jsx
// 等价于 :id="id"
<div :id></div>
// 这也同样有效
<div v-bind:id></div>
```

### 动态绑定多个值

```jsx
// 一个包含多个 attribute 的 JavaScript 对象：
const objectOfAttrs = {
  id: "container",
  class: "wrapper",
};

// 通过不带参数的 v-bind，你可以将它们绑定到单个元素上：
<div v-bind="objectOfAttrs"></div>

// 等价于
<div v-bind:id="objectOfAttrs.id" v-bind:class="objectOfAttrs.class"></div>
```

### 受限的全局访问

模板中的表达式将被沙盒化，仅能够访问到有限的全局对象列表。比如 Math 和 Date。

用户附加在 window 上的不能访问，如果需要可以在 `app.config.globalProperties` 上显式地添加它们，供所有的 Vue 表达式使用。

## 指令 Directives

```js
<a v-on:click="doSomething"> ... </a>
// 简写
<a @click="doSomething"> ... </a>
```

### v-if

```vue
<div v-if="type === 'A'">A</div>
<div v-else-if="type === 'B'">B</div>
<div v-else>Not A/B/C</div>

<!-- <template> 上的 v-if -->
<template v-if="ok">
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>
```

当 v-if 和 v-for 同时存在于一个元素上的时候，v-if 会首先被执行。

### v-for

```jsx
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])

// 基本使用
<li v-for="item in items">
  {{ item.message }}
</li>

// 需要访问 index
<li v-for="(item, index) in items" :key="item.message">
  {{ item.message }} {{ index }}
</li>

// 有 index 的解构
<li v-for="({ message }, index) in items" :key="index">
  {{ message }} {{ index }}
</li>

// of 代替 in
<div v-for="item of items" :key="item.message"></div>

// <template> 标签上使用 v-for
<template v-for="item in items" :key="item.message">
  <li>{{ item.message }}</li>
</template>
```

**v-for 对象**

```jsx
const myObject = reactive({
  key1: '111',
  key2: '222',
})

// 基本使用
<li v-for="value in myObject">
  {{ value }}
</li>

// 访问 key，index
<li v-for="(value, key, index) in myObject">
  {{ index }} - {{ key }} : {{ value }}
</li>
```

注意： v-if 比 v-for 的优先级更高。这意味着 v-if 的条件将无法访问到 v-for 作用域内定义的变量别名

### 动态参数

如果你的组件实例有一个数据属性 attributeName，其值为 "href"，下面的绑定就等价于 v-bind:href

```html
<a v-bind:[attributeName]="url"> ... </a>
<!-- 简写 -->
<a :[attributeName]="url"> ... </a>
```

相似地，你还可以将一个函数绑定到动态的事件名称上：

```html
<a v-on:[eventName]="doSomething"> ... </a>
<!-- 简写 -->
<a @[eventName]="doSomething"> ... </a>
```

动态参数中表达式的值应当是一个字符串，或者是 null。特殊值 null 意为显式移除该绑定。其他非字符串的值会触发警告。

## 响应式基础

### ref

```js
import { ref } from "vue";
const count = ref(0); //  count = { value: 0 }
count.value++; // count.value = 1
```

#### 模板中访问 ref

要在组件模板中访问 ref，请从组件的 setup() 函数中声明并返回它们：

```js
import { ref } from "vue";

export default {
  setup() {
    const count = ref(0);
    return { count };
  },
};

// 使用：不需要附加 .value
<div>{{ count }}</div>;
```

#### ref 原理

```js
const myRef = {
  _value: 0,
  get value() {
    track();
    return this._value;
  },
  set value(newValue) {
    this._value = newValue;
    trigger();
  },
};
```

#### ref 深层响应性

Ref 会使它的值具有深层响应性。这意味着即使改变嵌套对象或数组时，变化也会被检测到：

```js
import { ref } from "vue";

const obj = ref({
  nested: { count: 0 },
  arr: ["foo", "bar"],
});

function mutateDeeply() {
  // 以下都会按照期望工作
  obj.value.nested.count++;
  obj.value.arr.push("baz");
}
```

#### 模板中解包的注意事项

只有顶级的 ref 属性才会被解包。 在下面的例子中，count 和 object 是顶级属性，但 object.id 不是：

```js
const count = ref(0);
const object = { id: ref(1) };

// 按预期工作：{{ count + 1 }}

// 这个不会:  {{ object.id + 1 }}

// 但是 ref 是文本插值的最终计算值，那么它将被解包，因此 {{ object.id }} 渲染为 1, 等价于 {{ object.id.value }}
```

### nextTick()

等待 DOM 更新完成后再执行额外的代码，可以使用 nextTick() 全局 API：

```js
import { nextTick } from "vue";
async function increment() {
  count.value++;
  await nextTick();
  // 现在 DOM 已经更新了
}
```

### script setup

setup() 函数中手动暴露大量的状态和方法非常繁琐。 我们可以使用 `<script setup>` 来大幅度地简化代码：

```vue
<script setup>
import { ref } from "vue";
const count = ref(0);
function increment() {
  count.value++;
}
</script>
<template>
  <button @click="increment">
    {{ count }}
  </button>
</template>
```

### reactive

与 ref 不同，访问对象不需要 .value ，reactive() 将使对象本身具有响应性：

```js
import { reactive } from "vue";
const state = reactive({ count: 0 });

// 模板中使用：
<button @click="state.count++">
  {{ state.count }}
</button>
```

注意：reactive() 返回的是一个原始对象的 Proxy，它和原始对象是不相等的

#### reactive() 的局限性

1. 只能用于对象类型 (对象、数组和如 Map、Set 这样的集合类型)。它不能持有如 string、number 或 boolean 这样的原始类型。

2. 对解构操作不友好：当我们将响应式对象的原始类型属性解构为本地变量时，或者将该属性传递给函数时，我们将丢失响应性连接：

```js
const state = reactive({ count: 0 });
let { count } = state; // 当解构时，count 已经与 state.count 断开连接
count++; // 不会影响原始的 state

// 该函数接收到的是一个普通的数字, 并且无法追踪 state.count 的变化
callSomeFunction(state.count);

// 正确的做法
callSomeFunction(state);
```

## 计算属性

1. 返回值为一个计算属性 ref。
2. .value 访问计算结果。
3. 在模板中自动解包，模板引用时无需添加 .value。

```vue
<script setup>
import { reactive, computed } from "vue";

const author = reactive({
  name: "John Doe",
  books: ["Vue 2 - Advanced Guide", "Vue 3 - Basic Guide"],
});

// 一个计算属性 ref
const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? "Yes" : "No";
});
</script>

<template>
  <span>{{ publishedBooksMessage }}</span>
</template>
```

### 与方法区别

计算属性值会基于其响应式依赖被缓存，一个计算属性仅会在其响应式依赖更新时才重新计算。
方法调用总是会在重渲染发生时再次执行函数。

### 可写计算属性

使用场景：依赖发生变化，计算属性发生变化；计算属性发生变化，依赖也发生变化；
通过同时提供 getter 和 setter 来创建：

```vue
<script setup>
import { ref, computed } from "vue";

const firstName = ref("John");
const lastName = ref("Doe");

const fullName = computed({
  get() {
    return firstName.value + " " + lastName.value;
  },
  set(newValue) {
    [firstName.value, lastName.value] = newValue.split(" ");
  },
});
</script>

<!-- 现在当你再运行 fullName.value = '111 222' 时，setter 会被调用而 firstName 和 lastName 会随之更新。-->
```
