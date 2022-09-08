# taro

官网完档: <https://taro-docs.jd.com/taro/docs/react-page>

Taro 是一个开放式跨端跨框架解决方案，支持使用 React/Vue/Nerv 等框架来开发 微信 / 京东 / 百度 / 支付宝 / 字节跳动 / QQ / 飞书 小程序 / H5 / RN 等应用。本文描述使用 react 开发的要点

## 快速开始

1. 安装:

```javascript
npm install -g @tarojs/cli
// or
yarn global add @tarojs/cli
// or
cnpm install -g @tarojs/cli
```

2. 初始化

```javascript
taro init myApp
cd myApp
yarn
```

<img width="80%" src="./imgs/taro1.jpg" />

3. 编译运行

```javascript
// 运行微信小程序
yarn dev:weapp
// 编译微信小程序
yarn build:weapp
```

## 目录结构

<img src="./imgs/目录结构.jpg" />

## react

### 事件

```tsx
function Comp() {
  function clickHandler(e) {
    e.stopPropagation(); // 阻止冒泡
  }
  function scrollHandler() {}
  // 只有小程序的 bindtap 对应 Taro 的 onClick
  // 其余小程序事件名把 bind 换成 on 即是 Taro 事件名
  return <ScrollView onClick={clickHandler} onScroll={scrollHandler} />;
}
```

小程序模板中绑定的 catchtouchmove 事件除了可以阻止回调函数冒泡触发外，还能阻止视图的滚动穿透，这点 Taro 的事件系统是做不到的。解决方案见官网说明:<https://taro-docs.jd.com/taro/docs/react-overall>

### React 的生命周期

1. componentWillMount (): onLoad 之后，页面组件渲染到 Taro 的虚拟 DOM 之前触发

2. componentDidMount (): 页面组件渲染到 Taro 的虚拟 DOM 之后触发。
   能访问到 Taro 的虚拟 DOM（使用 React ref、document.getElementById 等手段）
   <font color="red">无法通过 createSelectorQuery 等方法获取小程序渲染层 DOM 节点。 只能在 onReady 生命周期中获取</font>

### 获取小程序 DOM

```javascript
// 页面组件
import React from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";

export default class Test extends React.Component {
  onReady() {
    // onReady 触发后才能获取小程序渲染层的节点
    Taro.createSelectorQuery()
      .select("#only")
      .boundingClientRect()
      .exec((res) => console.log(res));
  }

  render() {
    return <View id="only" />;
  }
}
```
