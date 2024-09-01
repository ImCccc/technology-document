# vue3

## 模板语法

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

## 指令

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

### v-model

<https://cn.vuejs.org/guide/components/v-model.html>

#### 原理

```html
<input v-model="val" />
<!-- 等价于： -->
<input :value="val" @input="val = $event.target.value" />
```

#### 基本使用

```html
<!-- 在“change”时而非“input”时更新 -->
<input v-model.lazy="msg" />

<!-- 自动将用户的输入值转为数值类型 -->
<input v-model.number="age" />

<!-- 自动过滤用户输入的首尾空白字符 -->
<input v-model.trim="msg" />
```

#### v-model 自定义组件实现

Vue 3.4 开始，推荐 defineModel() 宏实现。defineModel 是一个便利宏。编译器将其展开为以下内容：

1. 一个名为 modelValue 的 prop，本地 ref 的值与其同步；
2. 一个名为 update:modelValue 的事件，当本地 ref 的值发生变更时触发。

```html
<!-- Child.vue -->
<script setup>
  const model = defineModel();
</script>

<template>
  <button @click=" model.value++">click {{ model }}</button>
</template>

<!-- Parent.vue -->
<Child v-model="countModel" />
```

3.4 版本之前的实现

```html
<!-- Child.vue -->
<script setup>
  const props = defineProps(["modelValue"]);
  const emit = defineEmits(["update:modelValue"]);
</script>

<input
  :value="modelValue"
  @input="emit('update:modelValue', $event.target.value)"
/>

<!-- Parent.vue -->
<Child :modelValue="foo" @update:modelValue="$event => (foo = $event)" />
```

<font color="red">如果为 defineModel 设置了一个 default 值且父组件没有为该 prop 提供任何值，会导致父组件与子组件之间不同步。</font>

#### v-model 参数

```html
<!-- 子组件 -->
<script setup>
  const title = defineModel("title");
</script>

<template>
  <input type="text" v-model="title" />
</template>

<!-- 父组件 -->
<MyComponent v-model:title="bookTitle" />

<!-- 需要额外的 prop 选项 -->
const title = defineModel('title', { required: true })

<!-- 3.4 之前的用法 -->
<!-- 子组件 -->
<script setup>
  defineEmits(["update:title"]);
  defineProps({
    title: { required: true },
  });
</script>

<input :value="title" @input="$emit('update:title', $event.target.value)" />
```

#### 多个 v-model

```html
<!-- 子组件 -->
<script setup>
  const firstName = defineModel("firstName");
  const lastName = defineModel("lastName");
</script>
<template>
  <input type="text" v-model="firstName" />
  <input type="text" v-model="lastName" />
</template>

<!-- 父组件 -->
<UserName v-model:first-name="first" v-model:last-name="last" />
```

3.4 之前的用法

```html
<!-- 父组件 -->
<UserName v-model:first-name="first" v-model:last-name="last" />

<!-- 子组件 -->
<script setup>
  defineProps({
    firstName: String,
    lastName: String,
  });
  defineEmits(["update:firstName", "update:lastName"]);
</script>

<input
  :value="firstName"
  @input="$emit('update:firstName', $event.target.value)"
/>
<input
  :value="lastName"
  @input="$emit('update:lastName', $event.target.value)"
/>
```

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

## 事件

### 参数

```jsx
function greet(event) {
  // `event` 是 DOM 原生事件
  alert(event.target.tagName)
}
<button @click="greet">Greet</button>

// 参数
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
function something(item, e) {
  e.preventDefault()
}
<li v-for="item in items" @click="something(item, $event)"></li>
```

### 事件修饰符

1. .stop
2. .prevent
3. .self
4. .capture
5. .once
6. .passive

```html
<!-- 单击事件将停止传递 -->
<a @click.stop="doThis"></a>

<!-- 提交事件将不再重新加载页面 -->
<form @submit.prevent="onSubmit"></form>

<!-- 修饰语可以使用链式书写 -->
<a @click.stop.prevent="doThat"></a>

<!-- 也可以只有修饰符 -->
<form @submit.prevent></form>

<!-- 仅当 event.target 是元素本身时才会触发事件处理器。例如：事件处理器不来自子元素 -->
<div @click.self="doThat">...</div>

<!-- 添加事件监听器时，使用 `capture` 捕获模式 -->
<div @click.capture="doThis">...</div>

<!-- 点击事件最多被触发一次 -->
<a @click.once="doThis"></a>
```

### 按键修饰符

按键别名：

1. enter
2. tab
3. delete (捕获“Delete”和“Backspace”两个按键)
4. esc
5. space
6. up
7. down
8. left
9. right

```html
<!-- 仅在 `key` 为 `Enter` 时调用 `submit` -->
<input @keyup.enter="submit" />

<!-- Alt + Enter -->
<input @keyup.alt.enter="clear" />

<!-- Ctrl + 点击 -->
<div @click.ctrl="doSomething">Do something</div>
```

官方文档地址： <https://cn.vuejs.org/guide/essentials/event-handling.html>

**方法与内联事件判断**

模板编译器会通过检查 v-on 的值是否是合法的 JavaScript 标识符或属性访问路径来断定是何种形式的事件处理器。举例来说，foo、foo.bar 和 foo['bar'] 会被视为方法事件处理器，而 foo() 和 count++ 会被视为内联事件处理器。

## 生命周期

```html
<script setup>
  import { onMounted } from "vue";

  // onMounted 钩子可以用来在组件完成初始渲染并创建 DOM 节点后运行代码：
  onMounted(() => {
    console.log(`the component is now mounted.`);
  });
</script>
```

## watch

基本使用：

```html
<script setup>
  import { ref, watch } from "vue";

  const x = ref(0);
  const y = ref(0);

  // 基本使用
  watch(x, async (newX, oldX) => {
    const res = await fetch("https://yesno.wtf/api");
  });

  // getter 函数
  watch(
    () => x.value + y.value,
    (sum) => {}
  );

  // 多个来源
  watch([x, () => y.value], ([newX, newY]) => {});

  /*
    不能直接侦听响应式对象的属性值
    const obj = reactive({ count: 0 });
    watch(obj.count, (count) => {});  // 错误
    watch(() => obj.count, (count) => {}); // 正确
  */
</script>
```

深层侦听器：

```js
const state = reactive({
  age: 1,
  count: 0,
  someObject: { a: 1 },
});

// 直接传入一个响应式对象，会创建一个深层侦听器
watch(state, (newValue, oldValue) => {
  // 在嵌套的属性变更时触发，例如 age 和 count 变化就会触发
  // 注意：`newValue` 此处和 `oldValue` 是相等的, 因为它们是同一个对象！
});

// 一个返回响应式对象的 getter 函数，只有在返回不同的对象时，才会触发回调：
watch(
  () => state.someObject,
  () => {} // 仅当 state.someObject 被替换时触发
);

// deep
watch(
  () => state.someObject,
  (newValue, oldValue) => {}, // 强制转成深层侦听器
  { deep: true }
);

// immediate
watch(
  state,
  (newValue, oldValue) => {}, // 立即执行
  { immediate: true }
);

// once 3.4+
watch(
  state,
  (newValue, oldValue) => {} // 源变化时触发一次
  { once: true }
);

/*
  默认情况下，侦听器回调会在父组件更新之后、所属组件的 DOM 更新之前被调用。
  在侦听器回调中访问所属组件的 DOM，那么 DOM 将处于更新前的状态。
  flush: 'post' 可以解决这个问题
*/
watch(
  state,
  (newValue, oldValue) => {} // 能访问最新的dom
  { flush: 'post' }
);
```

## watchEffect

下面的代码，在每当 todoId 的引用发生变化时使用侦听器来加载一个远程资源：

```js
const todoId = ref(1);
const data = ref(null);
watch(
  todoId,
  async () => {
    const response = await fetch(`https://jsonplaceholder/${todoId.value}`);
    data.value = await response.json();
  },
  { immediate: true }
);
```

watchEffect 简化上面的代码：

```js
const todoId = ref(1);
const data = ref(null);

// 回调会立即执行，不需要指定 immediate: true
watchEffect(async () => {
  const response = await fetch(`https://jsonplaceholder/${todoId.value}`);
  // 为什么 data.value 发生变化不会触发回调？
  // 因为 watchEffect 使用异步回调时，只有在第一个 await 正常工作前访问到的属性才会被追踪。
  data.value = await response.json();
});

// 访问最新的dom
watchEffect(callback, { flush: "post" });
// 访问最新的dom， 有个更方便的别名 watchPostEffect()
import { watchPostEffect } from "vue";
watchPostEffect(() => {});
```

注意：

1. watchEffect 仅会在其同步执行期间，才追踪依赖。
2. 在使用异步回调时，只有在第一个 await 正常工作前访问到的属性才会被追踪。

## 访问 vue 实例

### 基本使用

```html
<script setup>
  import { ref, onMounted, watchEffect } from "vue";
  const input = ref(null);

  onMounted(() => input.value.focus());

  // 需要侦听一个模板引用 ref 的变化，确保考虑到其值为 null 的情况：
  watchEffect(() => {
    if (input.value) input.value.focus();
  });
</script>

<input ref="input" />

<!-- 函数模板引用 -->
<input :ref="e => { /* 将 el 赋值给 ref 变量 */ }" />
```

ref 使用在自定义组件，获取的就是组件实例

### v-for 使用

```html
<script setup>
  import { ref, onMounted } from "vue";
  const list = ref([1, 2, 3, 4]);
  const itemRefs = ref([]);
  // 输出数组，数组是实例
  onMounted(() => console.log(itemRefs.value));
</script>

<template>
  <li v-for="item in list" ref="itemRefs">{{ item }}</li>
</template>
```

### setup 访问实例

使用了 `<script setup>` 的组件是默认私有的，父组件无法访问到一个使用了 `<script setup>` 的子组件中的任何东西，除非子组件在其中通过 defineExpose 宏显式暴露：

```html
<script setup>
  import { ref } from "vue";
  const a = 1;
  const b = ref(2);

  // 像 defineExpose 这样的编译器宏不需要导入
  defineExpose({ a, b });
</script>
```

## 组件相关

### props

```html
<!-- 子组件 BlogPost.vue -->
<script setup>
  // defineProps 是一个仅 <script setup> 中可用的编译宏命令，并不需要显式地导入。
  defineProps(["title"]);

  const props = defineProps(["title"]);
  console.log(props.title);
</script>
<template>
  <h4>{{ title }}</h4>
</template>

<!-- 父组件 -->
<script setup>
  import { ref } from "vue";
  import BlogPost from "./BlogPost.vue";
  const title = ref("李cr");
</script>
<template>
  <BlogPost :title="title" />
</template>
```
