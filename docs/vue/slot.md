# slot

## 基本使用

```html
<!-- 子组件 Child.vue -->
<div class="btn-primary">
  <slot> 备用内容 </slot>
</div>

<!-- 父组件 -->
<Child> Add todo (没有内容，就使用备用内容)</Child>
```

## 具名插槽

```html
<!-- 子组件 -->
<div class="container">
  <header><slot name="header"></slot></header>
  <main><slot></slot></main>
  <footer><slot name="footer"></slot></footer>
</div>

<!-- 父组件 -->
<div>
  <template v-slot:header><span>header</span></template>
  <template v-slot:default><span>main</span></template>
  <template v-slot:footer><span>footer</span></template>
</div>

<!-- 父组件: 简写 -->
<div>
  <template #header><span>header</span></template>
  <template #default><span>main</span></template>
  <template #footer><span>footer</span></template>
</div>

<!-- 父组件: 带参数简写 -->
<div>
  <template #header="{ item }"><span>header</span></template>
  <template #default="{ item }"><span>main</span></template>
  <template #footer="{ item }"><span>footer</span></template>
</div>
```

## 插槽作用域

```html
<!-- 子组件 todo-list.vue -->
<ul>
  <li v-for="(item, index) in items">
    <slot :item="item" :index="index"></slot>
  </li>
</ul>

<!-- 父组件写法1 -->
<todo-list>
  <template v-slot:default="slotProps">
    <span>{{ slotProps.item }}</span>
  </template>
</todo-list>

<!-- 父组件写法2 -->
<todo-list v-slot:default="slotProps">
  <span>{{ slotProps.item }}</span>
</todo-list>

<!-- 父组件写法3：简写 + 解构 -->
<todo-list v-slot="{ item }">
  <span>{{ item }}</span>
</todo-list>
```

## 动态插槽名

```html
<!-- 父组件 -->
<div v-slot:[变量名]></div>
```
