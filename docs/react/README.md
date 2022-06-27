# React

## JSX

<https://react.docschina.org/docs/introducing-jsx.html>

它被称为 JSX，是一个 JavaScript 的语法扩展。JSX 可能会使人联想到模版语言，但它具有 JavaScript 的全部功能。

### 基本使用

```js
const element = <h1>Hello, world!</h1>;
```

### 变量

```js
const name = "Josh Perez";
const element = <h1>Hello, {name}</h1>;
```

### 属性

```js
const element = <div tabIndex="0"></div>;
const element = <img src={user.avatarUrl}></img>;
```

### 防止注入攻击

你可以安全地在 JSX 当中插入用户输入内容，React DOM 在渲染输入内容之前，会进行转义。所有的内容在渲染之前都被转换成了字符串。这样可以有效地防止 XSS（cross-site-scripting, 跨站脚本）攻击。

### 原理

Babel 会把 JSX 转译成一个名为 React.createElement() 函数调用。以下两种示例代码完全等效：

```js
// 写法1
const element = <h1 className="greeting">Hello, world!</h1>;

// 写法2
const element = React.createElement(
  "h1",
  { className: "greeting" },
  "Hello, world!"
);
```

## 父组件调用子组件的方法

下面是父组件（函数组件）调用子组件（函数组件）的方法的例子：

子组件 components/Comp.tsx：

```js
import { useImperativeHandle, forwardRef } from "react";
const Comp: React.FC<any> = forwardRef((props, ref) => {
  // 暴露给父组件调用的方法
  useImperativeHandle(ref, () => ({
    showModal: () => {},
    hideModal: () => {},
  }));
  return <div>test</div>;
});
export default Comp;
```

父组件：

```tsx
import Comp from "@/components/Comp";
import { useRef } from "react";

const Comp: React.FC = () => {
  const modalFormRef = useRef<{
    showModal: () => void;
  }>(null);
  return (
    <>
      <button onClick={() => modalFormRef.current?.showModal()}>调用</button>
      <Comp ref={modalFormRef} />
    </>
  );
};
```

## React.memo

`React.memo()`是一个高阶函数，它与 `React.PureComponent` 类似，但是一个函数组件而非一个类。
可接受 2 个参数，第一个参数为纯函数的组件，第二个参数用于对比 `props` 控制是否刷新，与 `shouldComponentUpdate()`功能类似。

<font color="red">一般配合 useCallback 使用,防止使用 onClick={ () => {} }导致子组件每次渲染</font>

<img src="./imgs/1.png" />

## react 18

<https://secstep.com/react-18-is-now-available-on-npm/>

### 新的 Root API

`createRoot` 创建要渲染或卸载的根的新方法。使用它来代替 `ReactDOM.render`。没有它，React 18 中的新功能就无法工作。

更新之前:

```tsx
ReactDOM.render(<APP />, document.getElementById(root));
```

更新之后:

```tsx
import { StrictMode } from "react";
import ReactDOM from "react-dom";
import App from "./App";
ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

### 新的严格模式行为 StrictMode

为了实现类似于 vue 缓存组件 keep-alive 的功能, React 18 为严格模式引入了一个新的<font color="red"> 仅限开发的检查 </font>, 每当第一次安装组件时，此新检查将自动卸载并重新安装每个组件，并在第二次安装时恢复先前的状态。表现的效果,最直接的就是 <font color="red"> useEffects 执行 2 次</font>

### 节点自动批量重渲染

#### React 17

Promise、setTimeout、native event 或任何其他事件内部的更新不会在 React 中批处理。例如 setState 在这些场景是同步的。

#### react 18

如果使用 createRoot 则所有状态更新都将在发生时自动批量重渲染。

不想被自动更新可以使用 ReactDOM.flushSync() 退出操作

```tsx
import { flushSync } from "react-dom";
function handleClick() {
  flushSync(() => setCounter((c) => c + 1));
  // React has updated the DOM by now
  flushSync(() => setFlag((f) => !f));
  // React has updated the DOM by now
}
```

### 新的 Suspense 组件

之前的 Suspense, 支持的用例是使用 React.lazy 进行代码拆分，并且在服务器上渲染时根本不支持。**在 React 18 中，我们在服务器上添加了对 Suspense 的支持，并使用并发渲染特性扩展了它的功能。**

React 18 中的 Suspense 与 transition API 结合使用时效果最佳。如果你在过渡期间挂起，React 将防止已经可见的内容被替换为后备内容。相反，React 会延迟渲染，直到加载了足够的数据以防止出现错误的加载状态。

### SuspenseList

Suspense List 作为 Suspense 的容器组件通过编排这些组件向用户显示的顺序，帮助协调许多可以挂起的组件。

### startTransition

这是 V18 引入的新 API，这有助于保持当前的网页响应，并且能够同时进行计算量大复杂度高的的非阻塞 UI 更新。
以前可能会加防抖这样的操作去人为的延迟过滤数据的计算和渲染。新的 startTransition API 可以让我们把响应数据标记成 transitions 状态延迟处理。两个应用场景:

> 1. 慢速渲染：React 需要执行大量计算，以便过渡 UI 来显示结果。(如搜索引擎的关键词联想)
> 2. 慢速网络：React 正在等待来自网络的某些数据。这种用例与 Suspense 紧密集成。(懒加载)

```tsx
import { useState, startTransition } from "react";

export default function App() {
  let [value, setValue] = useState(0);

  return (
    <div>
      <input
        value={value}
        onChange={(e) => startTransition(() => setValue(event.target.value))}
      />
      <div>{value}</div>
    </div>
  );
}
```

所有在 startTransition 回调中的更新都会被认为是非紧急处理，如果出现更紧急的更新（比如用户又输入了新的值），则上面的更新都会被中断，直到没有其他紧急操作之后才会去继续执行更新。

### useTransition

`useTransition` 和 `startTransition` 让您将一些状态更新标记为不紧急。默认情况下，其他状态被更新为是紧急的。 React 将允许紧急状态更新（例如，更新文本输入）以中断非紧急状态更新（例如，呈现搜索结果列表）。

```tsx
function App() {
  const [isPending, startTransition] = useTransition();
  const [count, setCount] = useState(0);

  function handleClick() {
    startTransition(() => setCount((c) => c + 1));
  }

  return (
    <div>
      {isPending && <Spinner />}
      <button onClick={handleClick}>{count}</button>
    </div>
  );
}
```

### useDeferredValue

`useDeferredValue` 允许您推迟重新渲染树的非紧急部分。它类似于去抖动，但与之相比有一些优点。没有固定的时间延迟，因此 React 将在第一次渲染反映在屏幕上后立即尝试延迟渲染。延迟渲染是可中断的，不会阻塞用户输入。

```tsx
function Typeahead() {
  let [value, setValue] = useState(0);
  const deferredQuery = useDeferredValue(value);

  const suggestions = useMemo(
    () => <SearchSuggestions query={deferredQuery} />,
    [deferredQuery]
  );

  return (
    <>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <Suspense fallback="Loading results...">{suggestions}</Suspense>
    </>
  );
}
```
