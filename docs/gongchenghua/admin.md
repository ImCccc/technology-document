# 管理后台系统

react + ts + hooks + vite3 + ant design 构建后台管理系统的技术方案, 主要是纯前端<font color="red">菜单路由权限控制的技术方案设计</font>

::: tip
项目初始框架, eslint prettierrc 之类的 就不细说

:::

## 菜单路由配置

`src\config\routes.tsx:`

```tsx
import { lazy } from "react";
import MeunIcon from "@/components/MeunIcon";

// 有2种角色, admin => 管理员; user => 一般用户
type AuthorityType = "admin" | "user";

// 菜单配置需要的属性
export type MeunProps = {
  label: string; // 中文名
  key?: string; // 路由路径
  icon?: JSX.Element; // 图标
  children?: MeunProps[]; // 子菜单
  hidemenu?: boolean; // 菜单是否隐藏, 通常详情页面需要设置为 true
  authority?: AuthorityType; // 值是角色, 用于指定哪个角色才能显示该菜单
};

// 路由配置需要的属性
export type RouteProps = {
  path: string; // 路径
  Component: React.LazyExoticComponent<React.FC>; // 懒加载的组件
  authority?: AuthorityType; // 值是角色, 用于指定哪个角色才能访问该路由
  isHomepage?: boolean; // 是否主页
  children?: RouteProps[]; // 子路由
};

export type RouteMenuProps = Partial<RouteProps> &
  MeunProps & { children?: RouteMenuProps[] };

const loginRoute = {
  path: "/login",
  Component: lazy(() => import("@/pages/Login")),
};

const route404 = {
  path: "*",
  Component: lazy(() => import("@/pages/404")),
};

const routeMenuList: RouteMenuProps[] = [
  {
    label: "菜单1",
    path: "device",
    children: [
      {
        label: "菜单1-1",
        path: "/device/ota",
        Component: lazy(() => import("@/pages/DeviceOta")),
        authority: "admin", // 管理员才能看到该菜单, 管理员才能进入该路由
      },
    ],
  },
  {
    label: "视频管理",
    path: "/icescreenList",
    Component: lazy(() => import("@/pages/IcescreenList")),
  },
];

// 打平菜单, 获取路由配置
const getRoutes = (routeMenuList: RouteMenuProps[]): RouteProps[] => {
  const routes: RouteProps[] = [];
  // 用于缓存主页的路由配置
  const homeRoute: RouteProps[] = [];
  const loop = (routeMenuList: RouteMenuProps[]) => {
    routeMenuList.forEach((route) => {
      const { children, path, Component, authority } = route;
      if (Component && isHomepage) homeRoute.push({ path: "/", Component });
      if (Component && path) routes.push({ path, Component, authority });
      if (children) loop(children);
    }, routes);
  };
  loop(routeMenuList);

  return [
    loginRoute,
    {
      path: "/",
      Component: lazy(() => import("@/pages/Layout")),
      children: [...homeRoute, ...routes, route404],
    },
    route404,
  ];
};

// 过滤路由数据, 获取菜单配置
export const getMenus = (list = routeMenuList): MeunProps[] =>
  list.map((item) => {
    const { children, path, label, icon, authority, hidemenu } = item;
    return {
      icon,
      label,
      hidemenu,
      key: path,
      authority,
      children: children ? getMenus(children) : undefined,
    };
  });

export default getRoutes(routeMenuList);
```

## 状态管理 mbox

`src\stores\index.ts`:

```tsx
import User from "./User";

export type StoreType = typeof stores;
export type UserExampleProps = typeof stores.User;

const stores = {
  User: new User(),
};

function useMobx<T extends keyof StoreType>(storeName: T) {
  return stores[storeName];
}

export { useMobx };
```

`src\stores\User.ts`:

```tsx
import { makeAutoObservable } from "mobx";

// 有2种角色, admin => 管理员; user => 一般用户
type AuthorityType = "admin" | "user";

// 初始化数据, 需要在缓存获取
const getAuthority = () => {
  return (localStorage.getItem("__AuthorityType__") ||
    "admin") as AuthorityType;
};

class User {
  // 当前登录人的角色, 觉得他拥有什么权限, 哪些路由可以进入, 哪些在页面上进行哪些操作
  thisRole = getAuthority();

  constructor() {
    makeAutoObservable(this);
  }

  get role() {
    return this.thisRole;
  }

  set role(role: AuthorityType) {
    localStorage.setItem("__AuthorityType__", role);
    this.thisRole = role;
  }
}

export default User;
```

## 路由权限控制

`src\components\PageAuth\index.tsx`:

```tsx
import React from "react";
import { useMobx } from "@/stores";
import { observer } from "mobx-react-lite";
import { Navigate } from "react-router-dom";

type PageAuthProps = {
  children?: any; // 页面路由
  authority?: string; // 对应路由配置中的authority
};

const Comp: React.FC<PageAuthProps> = ({ children, authority }) => {
  // 获取用户信息, 因为可能切换用户, 所以不能直接使用localStorage缓存, 需要使用状态管理工具
  const User = useMobx("User");

  // 如果不配置, 所有觉得都可以访问
  if (!authority) return children;

  // 如果配置了, 当前用户是对应的角色, 才可以访问
  return User.role === authority ? children : <Navigate to="/404" replace />;
};

export default observer(Comp);
```

`src\app.tsx`:

```tsx
import { Suspense } from "react";
import { ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import Loading from "@/components/Loading";
import routes, { RouteProps } from "@/config/routes";
import { HashRouter, Route, Routes } from "react-router-dom";
import PageAuth from "./components/PageAuth";

const getRoute = (routes: RouteProps[]) => {
  return routes.map(({ children, path, Component, authority }) => (
    <Route
      key={path}
      path={path}
      element={
        <Suspense fallback={<Loading />}>
          <PageAuth authority={authority}>
            <Component />
          </PageAuth>
        </Suspense>
      }
    >
      {children && getRoute(children)}
    </Route>
  ));
};

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <HashRouter>
        <Routes>{getRoute(routes)}</Routes>
      </HashRouter>
    </ConfigProvider>
  );
}

export default App;
```

## 菜单权限控制

`src\pages\Layout\Sider.tsx`

```tsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, MenuProps } from "antd";
import { getMenus, MeunProps } from "@/config/routes";
import { useMobx } from "@/stores";
import { observer } from "mobx-react-lite";

const Comp: React.FC = () => {
  const User = useMobx("User");
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState<string[]>([]);
  const onClick: MenuProps["onClick"] = (e) => navigate(e.key);

  //  getMenus() 获取所有菜单, 需要过滤掉没有权限的菜单
  const thisMenus = useMemo<any>(() => {
    const loop = (menus: MeunProps[]) => {
      return menus.filter((menu) => {
        const { authority, children, hidemenu } = menu;
        if (hidemenu) return false;
        if (authority && authority !== User.role) return false;
        if (children) menu.children = loop(children);
        return true;
      });
    };
    return loop(getMenus());
  }, [User.role]);

  // 监听路由变化,更新当前激活的菜单
  useEffect(() => {
    setDefaultSelectedKeys([pathname]);
  }, [pathname]);

  // 展开的菜单
  const openKeys = useMemo(() => [pathname.split("/")[1]], [pathname]);

  return (
    <div className={styles.menuwrap}>
      <div onClick={() => navigate("/")} className={styles.m_title}>
        语音标记平台
      </div>
      <Menu
        mode="inline"
        theme="dark"
        items={thisMenus}
        onClick={onClick}
        defaultOpenKeys={openKeys}
        selectedKeys={defaultSelectedKeys}
      />
    </div>
  );
};

export default observer(Comp);
```

## 页面元素权限控制

有时候, 2 个角色都可以访问页面 A, 但是看到的信息却不一样, 这时候需要有一个机制, 根据角色,显示不一样的页面元素; 例如只有管理员才有 "删除" 按钮, 下面是实现方案:

1. 添加权限控制的 hooks `src\hooks\useAuth.tsx`:

```tsx
import { useMobx } from "@/stores";

type AuthorityType = "admin" | "mumber"; // 角色

type DataProps<T> = {
  [key in AuthorityType]?: T;
};

function useAuth<T>(data: DataProps<T>, defauleValue?: T) {
  const User = useMobx("User");
  // User.role 就是当前用户的角色
  return data[User.role] || defauleValue;
}

export default useAuth;
```

2. 在页面上使用

```tsx
import { useMemo, useEffect } from "react";
import { observer } from "mobx-react-lite";
import useAuth from "@/hooks/useAuth";

const Comp: React.FC = () => {
  const dataColumn = useAuth<any>(
    {
      admin: [
        {
          label: "删除",
          confirmKey: "name",
          callback: (row: any) => TaskServiceDelete({ code: row.code }),
        },
      ],
    },
    []
  );

  const columns = useMemo<TableListColumns<SMZX.smzxTaskDetail>>(
    () => [
      { title: "任务名称", dataIndex: "name" },
      { operList: [{ label: "编辑", callback: () => {} }, ...dataColumn] },
    ],
    [dataColumn]
  );

  return <div>{dataColumn.length}</div>;
};

export default observer(Comp);
```

::: tip
需要注意的地方是: 在 `useXxx` 的 `hooks` 上, 如果使用 `mbox` 中的响应式数据, 那么它的页面组件必须需要 `observer` 包裹,
<font color="red">
上述例子, 如果直接 export default Comp; 那么 useAuth.tsx 上的 User.role 就不是响应式
</font>
:::

## 缓存路由

有时候, 有需求需要在列表界面, 点进去查看详情, 返回需要还原之前界面, vue 有 `KeepAlive`很方便实现, react 就需要自己实现, 以下是解决方案:

1. 添加 `src\pages\Layout\KeepAlive.tsx`:

```tsx
import { useUpdate } from "ahooks";
import { useLocation } from "react-router-dom";
import { useRef, useEffect, memo, ReactNode } from "react";

type KeepAliveProps = {
  cacheList: string[]; // 缓存的路由
  children: ReactNode; // 路由界面
};

const KeepAlive = (props: KeepAliveProps) => {
  const { cacheList = [], children } = props;
  const { pathname } = useLocation();

  const componentList = useRef(new Map<string, KeepAliveProps["children"]>());
  const update = useUpdate();
  const activeKey = useRef("");

  useEffect(() => {
    Array.from(componentList.current).map(([key]) => {
      if (!cacheList.includes(key) && key !== pathname) {
        componentList.current.delete(key);
      }
    });

    activeKey.current = pathname;
    if (!componentList.current.has(pathname)) {
      componentList.current.set(pathname, children);
    }

    // 强制刷新界面
    update();
  }, [cacheList, children, pathname, update]);

  return (
    <>
      {Array.from(componentList.current).map(([key, component]) => (
        <div
          key={key}
          className="layout-container__keep-alive"
          style={{ display: key == activeKey.current ? "" : "none" }}
        >
          {component}
        </div>
      ))}
    </>
  );
};

export default memo(KeepAlive);
```

2. 添加全局需要缓存的路由`src\stores\KeepAliveRoute.ts`：

```tsx
import { makeAutoObservable } from "mobx";

class KeepAliveRoute {
  cacheRouteList: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  get cacheList() {
    return this.cacheRouteList;
  }

  addCacheRoute(pathname: string) {
    pathname = pathname || location.hash.replace("#", "").split("?")[0];
    if (!this.cacheRouteList.includes(pathname)) {
      this.cacheRouteList.push(pathname);
    }
  }

  remove(pathname?: string) {
    if (pathname) {
      this.cacheRouteList = this.cacheRouteList.filter(
        (path) => path !== pathname
      );
    } else {
      this.cacheRouteList = [];
    }
  }
}

export default KeepAliveRoute;
```

3. 替换 `<Outlet/>` 使用 `KeepAlive` 包裹：
   `src\pages\Layout\Content.tsx`：

```tsx
import { useMobx } from "@/stores";
import { useOutlet } from "react-router-dom";
import { observer } from "mobx-react-lite";
import KeepAlive from "./KeepAlive";

const Comp: React.FC = () => {
  const outlet = useOutlet();
  // 缓存的路由
  const KeepAliveRoute = useMobx("KeepAliveRoute");
  return <KeepAlive cacheList={KeepAliveRoute.cacheList}>{outlet}</KeepAlive>;
};

export default observer(Comp);
```

4. 页面上使用路由缓存：

```tsx
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { useMobx } from "@/stores";

const Comp: React.FC = () => {
  const navigate = useNavigate();
  const KeepAliveRoute = useMobx("KeepAliveRoute");
  return (
    <div
      className="common-page"
      onClick={() => {
        // 缓存当前路由
        KeepAliveRoute.addCacheRoute();
        // 跳转页面
        navigate("/test");
      }}
    >
      test
    </div>
  );
};

export default observer(Comp);
```

5. 点击菜单， 清空缓存的路由 `src\pages\Layout\Sider.tsx`：

```tsx
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useMobx } from "@/stores";
import { Menu } from "antd";

const Comp: React.FC = () => {
  const KeepAliveRoute = useMobx("KeepAliveRoute");
  const navigate = useNavigate();
  return (
    <Menu
      mode="inline"
      theme="dark"
      items={[]}
      onClick={(e) => {
        navigate(e.key);
        KeepAliveRoute.remove();
      }}
    />
  );
};

export default observer(Comp);
```

### 添加钩子 useEffect

**如果路由已经缓存, 再次进入不会触发 `useEffect`, 下面实现一个类似的功能, 原理其实就是事件监听与派发的模式; <font color="red">下面方案, 不支持多次多个 useEffect</font>**

1. `src\hooks\useEffectCacheRoute.tsx`

```tsx
import { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";

class EventBus {
  allEvent: { [key: string]: any } = {};

  removeEventListener(eventName: string, callback: any) {
    window.removeEventListener(eventName, callback);
    this.allEvent[eventName] = undefined;
  }

  addEventListener(eventName: string, callback: any) {
    if (this.allEvent[eventName]) {
      this.removeEventListener(eventName, this.allEvent[eventName]);
    }
    this.allEvent[eventName] = callback;
    window.addEventListener(eventName, callback);
  }

  dispatchEvent(name: string) {
    window.dispatchEvent(new CustomEvent(name));
  }
}

const eventBus = new EventBus();

function useEffectCacheRoute(callback: () => void) {
  const { pathname } = useLocation();
  useEffect(() => {
    eventBus.addEventListener(pathname, callback);
    return () => eventBus.removeEventListener(pathname, callback);
  }, [callback, pathname]);
}

export function useDispatchEvent() {
  const { pathname } = useLocation();
  const dispatchEvent = useCallback(() => {
    eventBus.dispatchEvent(pathname);
  }, [pathname]);

  return dispatchEvent;
}

export default useEffectCacheRoute;
```

2. 改造 `src\components\KeepAlive\index.tsx`:

```tsx
// .....
import { useDispatchEvent } from "@/hooks/useEffectCacheRoute";
const KeepAlive: React.FC<KeepAliveProps> = ({ cacheList = [], children }) => {
  const dispatchEvent = useDispatchEvent();
  useEffect(() => {
    // .....
    if (!componentList.current.has(pathname)) {
      componentList.current.set(pathname, children);
    } else {
      // 缓存的路由, 再次进入不会触发 useEffect, 使用事件派发模式模拟
      dispatchEvent();
    }
    // .....
  }, [cacheList, children, dispatchEvent, pathname, update]);
  // .....
};
```

3. 界面使用:

```tsx
import useEffectCacheRoute from "@/hooks/useEffectCacheRoute";
useEffectCacheRoute(() => {
  console.log("模拟的 useEffect");
});
```

## 请求接口封装

`src\utils\request.ts`

```tsx
import { message } from "antd";
import axios, {
  AxiosInstance,
  AxiosInterceptorManager,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

interface NewAxiosInstance extends AxiosInstance {
  <T>(url: string, config: AxiosRequestConfig): Promise<T>;
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse>;
  };
}

export const clearLocalStorage = () => {
  localStorage.removeItem("USER_TOKEN");
};

export const getToken = () => {
  return localStorage.getItem("USER_TOKEN");
};

const request: NewAxiosInstance = axios.create({
  baseURL: "",
  timeout: 10000,
});

const goLogin = () => {
  clearLocalStorage();
  location.href = `/#login?redirect=${encodeURIComponent(
    location.hash.replace("#", "")
  )}`;
  message.error("登录信息过期, 请重新登录!");
};

//拦截器
request.interceptors.request.use((config) => {
  const token = getToken();
  if (config.headers instanceof Object) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

request.interceptors.response.use(
  (response) => {
    if (+response.status === 401) {
      return goLogin();
    }

    const { data } = response;
    if (data?.code === "OK" || data?.code === 0) {
      return Promise.resolve(data);
    }

    message.error(`${data.code}: ${data.msg}`);
    return Promise.reject(data);
  },
  (error) => {
    if (error.response.status === 401) return goLogin();
    message.error(`${error.code}: ${error.message}`);
  }
);

export default request;
```
