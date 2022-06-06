# Composition api

## ref

通过一个新的 ref 函数使任何响应式变量在任何地方起作用:

```html
<template>
  <!-- 模板使用不需要 .value -->
  <div>{{ counter }}</div>
  <div>{{ list.length }}</div>
  <span>{{ obj.name }}</span>
</template>
<script setup lang="ts">
  import { ref } from "vue";
  const counter = ref<number>(0); // 基本类型
  const list = ref<numbwe[]>([]); // 数组
  const obj = ref<any>({ name: "lcr" }); // 对象
  // counter.value++; list.value.push(5); obj.value.name = "lcr1";
</script>
```

:::tip

- ref 新建的变量，script 访问需要 .value
- ref 新建的变量, 在 template 用不需要 .value
  :::

## reactive

与 ref 相比，有下面的区别：

1. reactive 不能创建 string, number, boolean 这些基本类型的变量
2. script 访问不需要.value (将解包所有深层的 refs，同时维持 ref 的响应性)

```js
import { reactive } from "vue";
const obj = reactive({ name: "lcr" });
const list = reactive([1, 2, 3]);

obj.name = "lichir";
number.push(4);
```

## toRef

可以用来为源响应式对象上的某个 property 新创建一个 ref。 ref 可以被传递，它会保持对其源 property 的响应式连接

```js
const state = reactive({ foo: 1, bar: 2 });
const fooRef = toRef(state, "foo");
setTimeout(() => {
  fooRef.value++; // 2
  state.foo++; // 3
}, 1000);
```

:::tip
当你要将 prop 的 ref 传递给复合函数时，toRef 很有用：
<code>useSomeFeature(toRef(props, 'foo'))</code>
:::

## toRefs

将响应式对象转换为普通对象，其中结果对象的每个 property 都是指向原始对象相应 property 的 ref

```js
const state = reactive({ foo: 1, bar: 1 });
/*
  stateAsRefs: {
    foo: Ref<number>,
    bar: Ref<number>
  }
*/
const stateAsRefs = toRefs(state);

state.foo++;
console.log(stateAsRefs.foo.value); // 2

stateAsRefs.foo.value++;
console.log(state.foo); // 3
```

## watch

<https://v3.cn.vuejs.org/guide/reactivity-computed-watchers.html#watch>

### 监听 1 个源

```js
import { ref, watch } from "vue";
const counter = ref(0);
watch(counter, (newValue, oldValue) => {
  console.log("newValue: ", newValue);
  console.log("oldValue: ", oldValue);
});

const state = reactive({ count: 0 });
watch(
  () => state.count,
  (count, prevCount) => {}
);
```

### 监听多个源

```js
// watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {});
const firstName = ref("");
const lastName = ref("");
watch([firstName, lastName], (newValues, prevValues) => {
  console.log(newValues, prevValues);
});
```

### 侦听响应式对象

检查深度嵌套对象或数组中的 property 变化时，仍然需要 deep 选项设置为 true

```js
const state = reactive({
  id: 1,
  attr: { name: "Alex1" },
});

watch(
  () => state,
  (cur, prev) => console.log("not deep", cur.attr.name, prev.attr.name)
);

watch(
  () => state,
  (cur, prev) => console.log("deep", cur.attr.name, prev.attr.name),
  { deep: true }
);

state.attributes.name = "Alex2"; // 日志: "deep" "Alex2" "Alex2"
```

<font color="red">上面例子，打印 2 个 Alex2， 显然不是我们想要的答案, 为了完全侦听深度嵌套的对象和数组，可以通过诸如 lodash.cloneDeep 这样的实用工具来实现。</font>

```js
import _ from "lodash";
const state = reactive({
  attributes: { name: "Alex1" },
});
watch(
  () => _.cloneDeep(state),
  (cur, prev) => console.log(cur.attributes.name, prev.attributes.name)
);
state.attributes.name = "Alex2"; // 日志: "Alex2" "Alex1"
```

## watchEffect

<https://v3.cn.vuejs.org/guide/reactivity-computed-watchers.html#watcheffect>

立即执行传入的一个函数，同时响应式追踪其依赖，并在其依赖变更时重新运行该函数。

```js
const count = ref(0);
const stop = watchEffect(() => console.log(count.value));
setTimeout(() => count.value++, 100);
```

停止侦听:

```js
stop();
```

## computed

基本使用：

```js
import { ref, computed } from "vue";
const counter = ref(1);
const twiceTheCounter = computed(() => counter.value * 2);
// twiceTheCounter.value: 2
```

get set 函数：

```js
const count = ref(1);
const plusOne = computed({
  get: () => count.value + 1,
  set: (val) => (count.value = val - 1),
});
plusOne.value = 1;
console.log(count.value); // 0
```

## setup

当我们没有使用 setup 语法糖时，使用 setup 函数时，它将接收两个参数：<code> props 和 context </code>

### Props

```js
export default {
  props: {
    title: String,
  },
  setup(props) {
    console.log(props.title);
  },
};
```

:::warning
props 是响应式的，你不能使用 ES6 解构，它会消除 prop 的响应性。

```js
// 解构 prop，可以在 setup 函数中使用 toRefs 函数来完成此操作
import { toRefs } from 'vue'
setup(props) {
  const { title } = toRefs(props)
  console.log(title.value)
}

// 如果 title 是可选的 prop，则传入的 props 中可能没有 title 。
// 在这种情况下，toRefs 将不会为 title 创建一个 ref 。使用 toRef:
import { toRef } from 'vue'
setup(props) {
  const title = toRef(props, 'title')
  console.log(title.value)
}
```

:::

### Context

context 是一个普通 JavaScript 对象，暴露了其它可能在 setup 中有用的值：

```js
export default {
  setup(props, context) {
    // Attribute (非响应式对象，等同于 $attrs)
    console.log(context.attrs);
    // 插槽 (非响应式对象，等同于 $slots)
    console.log(context.slots);
    // 触发事件 (方法，等同于 $emit)
    console.log(context.emit);
    // 暴露公共 property (函数)
    console.log(context.expose);
  },
};
```

:::tip

1.  context 不是响应式的,可以解构 { attrs, slots, emit, expose }
2.  attrs 和 slots 的 property 是非响应式的

:::

### getCurrentInstance

getCurrentInstance 支持访问内部组件实例:

```js
import { getCurrentInstance } from "vue";

// 在组合式函数中调用也可以正常执行
function useComponentId() {
  return getCurrentInstance().uid
}

setup() {
  const internalInstance = getCurrentInstance();
  const id = useComponentId(); // 有效

  const handleClick = () => {
    getCurrentInstance(); // 无效
    useComponentId(); // 无效
    internalInstance; // 有效
  };

  onMounted(() => {
    getCurrentInstance(); // 有效
  });
},
```

:::tip

getCurrentInstance 只能在 setup 或生命周期钩子中调用。

不要把它当作在组合式 API 中获取 this 的替代方案来使用

:::
