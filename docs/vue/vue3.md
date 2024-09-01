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

1. 模板表达式中，使用 $emit 方法触发自定义事件：`<button @click="$emit('eventName')">Click</button>`
2. 父组件可以通过 v-on(缩写@)来监听事件：`<MyComponent @event-name="callback" />`

### 基本使用

```html
<!-- 子组件 BlogPost.vue -->
<script setup>
  // 通过 defineEmits 宏来声明需要抛出的事件, 返回emit函数触发事件
  const emit = defineEmits(["enlarge-text"]);
  function emitEvent() {
    emit("enlarge-text");
  }
</script>

<!-- 组件没使用 setup, 可从 setup() 函数的第二个参数访问到 emit 函数：
  export default {
    emits: ['enlarge-text'],
    setup(props, ctx) { ctx.emit('enlarge-text') }
  }
-->

<template>
  <h4>{{ title }}</h4>
  <button @click="$emit('enlarge-text')">模板触发事件</button>
  <button @click="emitEvent">script 触发事件</button>
</template>

<!-- 父组件 -->
<script setup>
  import { ref } from "vue";
  import BlogPost from "./BlogPost.vue";
  const title = ref("李cr");
</script>
<template>
  <BlogPost :title="title" @enlarge-text="($event) => { }" />
</template>
```

### 事件参数

```html
<!-- 子组件 -->
<button @click="$emit('eventName', '参数1', '参数2')">click</button>

<!-- 父组件 -->
<MyButton @event-name="(p1, p2) => { } />
```

### TypeScript 使用

```html
<script setup lang="ts">
  const emit = defineEmits<{
    (e: "change", id: number): void;
    (e: "update", value: string): void;
  }>();
  emit("change", 123);
  emit("update", "123");
</script>
```

#### 事件校验

```html
<script setup>
  const emit = defineEmits({
    // 没有校验
    click: null,
    // 校验 submit 事件
    submit: ({ email, password }) => {
      if (email && password) return true;
      return false;
    },
  });
  function submitForm(email, password) {
    emit("submit", { email, password });
  }
</script>
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

### 基本使用

```html
<!-- 父组件 -->
<script setup>
  import ComponentA from "./ComponentA.vue";
</script>
<template>
  <ComponentA />
</template>

<!-- 父组件：没有使用 script setup 
 import ComponentA from './ComponentA.js'
  export default {
    components: { ComponentA },
    setup() { }
  }
-->
```

### props

注意事项：

1. 子组件的 Prop 名字格式应使用 camelCase 形式: `defineProps({ greetingMessage: String })`
2. 父组件模板传递属性使用 kebab-case 形式：`<MyComponent greeting-message="hello" />`
3. 传递静态值：`<BlogPost title="xxx" />`; 动态值需要添加冒号 `<BlogPost :title="post.title" />`

#### 基本使用

```html
<!-- 子组件 BlogPost.vue -->
<script setup>
  // 通过 defineProps 宏来声明需要接受的属性, 返回所有的props
  const props = defineProps(["title"]);
  console.log(props.title);
</script>
<template>
  <h4>{{ title }}</h4>
</template>

<!-- 
  // 子组件没有使用 script setup:
  export default {
    props: ['title'],
    setup(props) { console.log(props.title) }
  }
 -->

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

#### 所有的使用方式

```jsx
// 使用 <script setup>
defineProps({
  title: String,
  likes: Number,
});

// 非 <script setup>
export default {
  props: {
    title: String,
    likes: Number,
  },
};

// TypeScript
<script setup lang="ts">
  defineProps<{
    title?: string
    likes?: number
  }>()
</script>
```

#### 将一个对象所有的属性向子组件传递

```js
const post = { id: 1, title: "xxx" };
<BlogPost v-bind="post" />;
// 而这实际上等价于:
<BlogPost :id="post.id" :title="post.title" />
```

#### 检验

```js
defineProps({
  // （给出 `null` 和 `undefined` 值则会跳过任何类型检查）
  propA: Number,
  propB: [String, Number],
  propC: {
    type: String,
    required: true,
  },
  propD: {
    type: [String, null],
    required: true,
  },
  propE: {
    type: Number,
    default: 100,
  },
  // 对象类型的默认值
  propF: {
    type: Object,
    // 必须从一个工厂函数返回。该函数接收组件所接收到的原始 prop 作为参数。
    default(rawProps) {
      return { message: "hello" };
    },
  },
  // 自定义类型校验函数, 在 3.4+ 中完整的 props 作为第二个参数传入
  propG: {
    validator(value, props) {
      return ["success", "warning", "danger"].includes(value);
    },
  },
  propH: {
    type: Function,
    default: () => {},
  },
});
```

### 全局注册组件

使用 Vue 应用实例的 .component() 方法，让组件在当前 Vue 应用中全局可用。

```js
import { createApp } from "vue";
import ComponentA from "./ComponentA.vue";
import ComponentB from "./ComponentB.vue";
const app = createApp({});
app.component("ComponentA", ComponentA).component("ComponentB", ComponentB);
```

存在问题：

1. 不能被 tree-shaking。全局注册了一个组件，即使它并没有被使用，仍会出现在打包后的 JS 文件中。
2. 使项目的依赖关系变得不那么明确。在父组件中使用子组件时，不太容易定位子组件的实现。和使用过多的全局变量一样，这可能会影响应用长期的可维护性。

### 透传 Attributes

“透传 attribute” 父组件传递一个属性给子组件， 但子组件没写接收属性的代码。常见例子：class、style、id；

注意：多个根节点的组件没有自动 attribute 透传行为

#### 样式透传

对 class 和 style 属性：如果一个子组件的根元素已经有了 class 或 style，它会和从父组件上继承的值合并。

```html
<!-- 子组件 MyButton.vue -->
<button>子组件</button>
<!-- 父组件 -->
<MyButton class="large" />
<!-- 最后渲染出的 DOM 结果是 -->
<button class="large">Click</button>
```

#### 深层组件继承

1. 有些情况下一个组件会在根节点上渲染另一个组件，这样的情况属性会透传到孙子组件；
2. 如果子组件已经使用过属性， 使用过的属性不会透传到孙子组件；

```html
<!-- 父组件 -->
<template>
  <Child msg="你好" title="我是谁" />
</template>

<!-- 子组件 Child.vue-->
<script setup>
  import BaseButton from "./BaseButton.vue";
  defineProps({ title: String }); // title 不会传到 BaseButton 组件
</script>
<template>
  <BaseButton />
</template>

<!-- 孙子组件 BaseButton.vue-->
<script setup>
  defineProps({ msg: String, title: String });
</script>
<template>
  <h1>能接收到 msg：{{ msg }}</h1>
  <h1>不能接收到 title： {{ title }}</h1>
</template>
```

**禁用继承**

组件选项中设置 `inheritAttrs: false`

```html
<!-- 3.3+ -->
<script setup>
  defineOptions({ inheritAttrs: false });
</script>
```

**$attrs**

$attrs 对象包含了除组件所声明的 props 和 emits 之外的所有其他 attribute，例如 class，style，v-on 监听器等。

```html
<!-- 父组件 -->
<template>
  <HelloWorld msg="Vite-Vue" title="licr" class="ddd" />
</template>

<!-- 子组件 -->
<script setup>
  defineProps({ title: String });
</script>

<template>
  <!-- $attrs：{ "msg": "Vite-Vue", "class": "ddd" } -->
  <span> {{ $attrs }}</span>
</template>
```

**透传到非外层的组件**

如果需要被透传的组件不在最外层，又或者子组件最外层有多个组件，
可以通过设定 `inheritAttrs: false` 和使用 `v-bind="$attrs"` 来实现

```html
<!-- 父组件 -->
<HelloWorld msg="Vue" title="licr" class="ddd" />

<!-- 子组件：最外层有2个元素 -->
<script setup>
  import BaseButton from "./BaseButton.vue";
  defineProps({ title: String });
  defineOptions({ inheritAttrs: false });
</script>
<template>
  <BaseButton v-bind="$attrs" />
  <!-- { "msg": "Vue", "class": "ddd" } -->
  <h1>{{ $attrs }}</h1>
</template>

<!-- 孙子组件 -->
<script setup>
  defineProps({ msg: String, title: String });
</script>
<template>
  <!-- vue -->
  <h1>{{ msg }}</h1>
  <!-- 空 -->
  <h1>{{ title }}</h1>
  <!-- { "class": "ddd" } -->
  <h1>{{ $attrs }}</h1>
</template>
```

**js 访问透传 Attr**

```html
<script setup>
  import { useAttrs } from "vue";
  const attrs = useAttrs();
</script>

<!-- 没使用 script setup 
  export default {
    setup(props, ctx) { console.log(ctx.attrs) }
  }  
-->
```

## 插槽 slot

```html
<!-- 子组件 AlertBox.vue -->
<template>
  <strong> xxx </strong>
  <slot> 默认内容 </slot>
</template>
<style scoped></style>

<!-- 父组件 -->
<AlertBox> Something bad happened. </AlertBox>
```

### 具名插槽

```html
<!-- 子组件 BaseLayout.vue -->
<div class="container">
  <header><slot name="header"></slot></header>
  <main><slot></slot></main>
</div>

<!-- 父组件 -->
<BaseLayout>
  <template v-slot:header>header</template>
  <template v-slot:default>main</template>
</BaseLayout>

<!-- 父组件: 简写 -->
<BaseLayout>
  <template #header>header</template>
  <template #default>main</template>
</BaseLayout>

<!-- 父组件: 带参数简写，默认插槽 -->
<BaseLayout>
  <template #header="{ item }">header</template>
  <!-- 所有位于顶级的非 <template> 节点都被隐式地视为默认插槽的内容 -->
  <p>默认插槽内容1</p>
  <p>默认插槽内容2</p>
</BaseLayout>
```

### 条件插槽

当 header、 default 存在时，我们希望包装它们以提供额外的样式：

```html
<template>
  <div v-if="$slots.header" class="card-header">
    <slot name="header" />
  </div>
  <div v-if="$slots.default" class="card-content">
    <slot />
  </div>
</template>
```

### 作用域插槽

意思是子组件传递参数，父组件接收参数

```html
<!-- 子组件 MyComponent.vue  -->
<slot :text="2" :count="1"></slot>

<!-- 父组件：只有默认插槽接收参数可写在 MyComponent 上 -->
<MyComponent v-slot="slotProps">
  {{ slotProps.text }} {{ slotProps.count }}
</MyComponent>

<!-- 子组件：有具名插槽 BaseLayout.vue -->
<header><slot name="header" :text="2"></slot></header>
<header><slot name="main" :text="2"></slot></header>
<main><slot :text="1"></slot></main>

<!-- 父组件写法 -->
<BaseLayout>
  <!-- 正常 -->
  <template v-slot:header="heaProps"> {{ heaProps.text }} </template>
  <!-- 简写 -->
  <template #main="mainProps"> {{ mainProps.text }} </template>
  <!-- 解构 -->
  <template #default="{ text }"> {{ text }} </template>
</BaseLayout>
```

## provide 和 inject

一个父组件相对于其所有的后代组件，会作为依赖提供者。任何后代的组件树，无论层级有多深，都可以注入由父组件提供给整条链路的依赖。

```html
<!-- 父组件 -->
<script setup>
  import { provide } from "vue";
  const location = ref("123");
  function updateLocation() {
    location.value = "345";
  }
  provide("location", { location, updateLocation });
</script>

<!-- 后代组件 -->
<script setup>
  import { inject } from "vue";
  const { location, updateLocation } = inject("location");
</script>

<!-- 
  父组件：
  import { provide } from 'vue'
  export default {
    setup() { provide("location", {}) }
  }
  后代组件：
  import { inject } from 'vue'
  export default {
    setup() {
      const location = inject("location", "默认值");
      return { location }
    }
  } 
-->
```

**使用 Symbol 作注入名**

```js
// keys.js
export const myInjectionKey = Symbol();

// 在供给方组件中
import { myInjectionKey } from "./keys.js";
provide(myInjectionKey, {});

// 注入方组件
import { myInjectionKey } from "./keys.js";
const injected = inject(myInjectionKey);
```
