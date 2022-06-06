# 事件

## 基本事件

```html
<template>
  <!-- 基本使用 -->
  <button @click="greet1">Greet</button>
  <!-- 传参使用 -->
  <button v-for="num in [1, 2, 3]" @click="greet2($event, num)">Greet</button>
</template>

<script setup lang="ts">
  const greet1 = (evt: Event) => {
    const target = evt.target as HTMLButtonElement;
    console.log(target.tagName);
  };
  const greet1 = (evt: Event, num: number) => {
    console.log(evt, num);
  };
</script>
```

## 自定义事件

基本使用：

```html
<!-- 父组件 -->
<template>
  <my-component @my-event="doSomething"></my-component>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  export default defineComponent({
    setup() {
      return { doSomething: (params) => {} };
    },
  });
</script>

<!-- 子组件 -->
<script lang="ts">
  import { defineComponent } from "vue";
  export default defineComponent({
    emits: ["doSomething"],
    setup(_, context) {
      context.emit("doSomething", "参数");
    },
  });
</script>
```

script setup 使用:

```html
<!-- 子组件 -->
<template>
  <div @click="setupClick2">setupClick2</div>
  <div @click="$emit('setupClick1', '参数')">setupClick1</div>
</template>

<script setup lang="ts">
  import { defineEmits } from "vue";

  // 一般写法
  // const emit = defineEmits(["setupClick1", "setupClick2"]);

  // ts 写法
  const emit = defineEmits<{
    (e: "setupClick1", params: string): void;
    (e: "setupClick2", params: string): void;
  }>();

  const setupClick2 = (evt: Event) => {
    const dom = evt.target as HTMLInputElement;
    emit("setupClick2", dom.value);
  };
</script>
```

## 事件修饰符

```html
<!-- 提交事件不再重载页面 -->
<form @submit.prevent="onSubmit"></form>

<!-- 修饰符可以串联 -->
<a @click.stop.prevent="doThat"></a>

<!-- 只有修饰符 -->
<form @submit.prevent></form>

<!-- 添加事件监听器时使用事件捕获模式 -->
<div @click.capture="doThis">...</div>

<!-- 只当在 event.target 是当前元素自身时触发处理函数 -->
<div @click.self="doThat">...</div>

<!-- 滚动事件的默认行为 (即滚动行为) 将会立即触发 -->
<!-- 不要把 .passive 和 .prevent 一起使用，因为 .prevent 将会被忽略 -->
<div @scroll.passive="onScroll">...</div>
```

## 按键修饰符

常见的修饰符:

- .tab
- .esc
- .enter
- .space
- .delete (捕获“删除”和“退格”键)
- .up .down .left .right

```html
<!-- 按下 `Enter` 时调用 `vm.submit()` -->
<input @keyup.enter="submit" />
```

按键组合:

- .ctrl
- .alt
- .shift
- .meta (Mac: ⌘; Windows: ⊞)

```html
<!-- Alt + Enter -->
<input @keyup.alt.enter="clear" />

<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Do something</div>
```
