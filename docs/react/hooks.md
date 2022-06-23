# hooks api

## useContext

- 父组件 `Parent.tsx`

```tsx
import { createContext } from "react";
export const FlowContext = createContext<any>(null);

const Parent: React.FC = () => (
  <FlowContext.Provider value={{ name: "lcr" }}>
    {children}
  </FlowContext.Provider>
);

export default Parent;
```

- 子组件

```tsx
import { useContext } from "react";
import { FlowContext } from "@/pages/Parent";

const Child: React.FC = () => {
  const data = useContext(FlowContext);
  return <div>{data.name}</div>;
};

export default Child;
```

## useCallback

配合 `React.memo` , 优化组件, 例如如下:

<img src="./imgs/2.png" />

解决: 那就是使用 useCallback 包裹函数:

```tsx
const callback = useCallback((e: any) => setnum(Math.random()), []);
```

<font color="red">问题: useCallback 第二个参数,是依赖项, 如果依赖项变化, 那么函数还是会频繁创建, 导致 React.meno 包裹的组件重新渲染. 有什么方法可以保证函数地址一值不变?</font>

官方临时提议,使用 `ref`, 变量重新缓存 `useCallback` 需要访问的值,`ahooks` 中的 `usePersistFn`(3.x 是 `useMemoizedFn` ) 就是这种思路实现不需要传递依赖项的, 下面是源码:

```tsx
type noop = (this: any, ...args: any[]) => any;

type PickFunction<T extends noop> = (
  this: ThisParameterType<T>,
  ...args: Parameters<T>
) => ReturnType<T>;

function useMemoizedFn<T extends noop>(fn: T) {
  const fnRef = useRef<T>(fn);
  fnRef.current = useMemo(() => fn, [fn]);
  const memoizedFn = useRef<PickFunction<T>>();
  if (!memoizedFn.current) {
    memoizedFn.current = function (this, ...args) {
      return fnRef.current.apply(this, args);
    };
  }
  return memoizedFn.current;
}
```
