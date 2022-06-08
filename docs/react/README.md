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
