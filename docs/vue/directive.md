# 常见指令

## v-model

### 原理

```html
<input v-model="val" />
等价于：
<input :value="val" @input="val = $event.target.value" />
```

### 基本使用

```html
<!-- 在“change”时而非“input”时更新 -->
<input v-model.lazy="msg" />

<!-- 自动将用户的输入值转为数值类型 -->
<input v-model.number="age" />

<!-- 自动过滤用户输入的首尾空白字符 -->
<input v-model.trim="msg" />
```

### 自定义 v-model

原理:

```html
<custom-input v-model="val" />
等价于：
<custom-input :model-value="val" @update:model-value="val=$event" />
```

基本使用：

```html
<!-- 父组件 -->
<template>
  <CustomInput v-model="modelValue" />
</template>
<script setup lang="ts">
  import { ref, watchEffect } from "vue";
  const modelValue = ref<string>("");
  watchEffect(() => console.log("modelValue.value:", modelValue.value));
</script>

<!-- 子组件 CustomInput.vue -->
<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
<script lang="ts">
  export default {
    props: ["modelValue"],
    emits: ["update:modelValue"],
  };
</script>
```

script setup 方式：

```html
<!-- 子组件 CustomInput.vue -->
<template>
  <input :value="modelValue" @input="input" />
</template>
<script setup lang="ts">
  import { defineEmits, defineProps } from "vue";
  defineProps({
    modelValue: String,
  });

  const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
  }>();

  const input = (evt: Event) => {
    const taget = evt.target as HTMLInputElement;
    emit("update:modelValue", taget.value);
  };
</script>
```

### 多个 v-model

```html
<template>
  <input :value="lastName" @input="input" />
  <input :value="firstName" @input="input($event, 1)" />
</template>
<script setup lang="ts">
  import { defineEmits, defineProps } from "vue";

  defineProps({
    firstName: String,
    lastName: String,
  });

  const emit = defineEmits<{
    (e: "update:firstName", value: string): void;
    (e: "update:lastName", value: string): void;
  }>();

  const input = (evt: Event, type?: number) => {
    const taget = evt.target as HTMLInputElement;
    if (type) return emit("update:firstName", taget.value);
    emit("update:lastName", taget.value);
  };
</script>
```

## v-bind

```html
<!-- 完整语法 -->
<a v-bind:href="url"> ... </a>
<!-- 缩写 -->
<a :href="url"> ... </a>
<!-- 动态参数的缩写 -->
<a :[key]="url"> ... </a>
```

## v-on

```html
<!-- 完整语法 -->
<a v-on:click="doSomething"> ... </a>
<!-- 缩写 -->
<a @click="doSomething"> ... </a>
<!-- 动态参数的缩写 -->
<a @[event]="doSomething"> ... </a>
```
