# vue

## 你了解的 MVVM

全称`Model-View-ViewModel`。`Model` 表示数据模型层; `view` 表示视图层; `ViewModel` 是 `View` 和 `Model` 层的桥梁，数据绑定到 viewModel 层并自动渲染到页面中，视图变化通知 viewModel 层更新数据。

## vue 是如何实现响应式数据

Vue2：`Object.defineProperty` 重新定义 `data` 中所有的属性， `Object.defineProperty` 可以使数据的获取与设置增加一个拦截的功能，拦截属性的获取，进行依赖收集。拦截属性的更新操作，进行通知。

## vue 中是如何检测数组变化

也是使用 `object.defineProperty` 重新定义数组的每一项，函数劫持的方式，重写了数组 7 个方法， `pop 、 push 、 shift 、 unshift 、 splice 、 sort 、 reverse` ，具体就是更改了数组的原型，用户调数组的这些方法的时候，通知视图去更新。

<font color="red">vue3：改用 proxy ，可直接监听对象数组的变化。 </font>

## vue 的性能优化

- 事件代理
- keep-alive
- 拆分组件
- key 保证唯一性
- 路由懒加载、异步组件
- 防抖节流
