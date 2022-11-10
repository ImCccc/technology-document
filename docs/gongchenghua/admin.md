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
  authority?: AuthorityType; // 用户权限
};

// 路由配置需要的属性
export type RouteProps = {
  path: string; // 路径
  Component: React.LazyExoticComponent<React.FC>; // 懒加载的组件
  authority?: AuthorityType; // 和菜单一样, 用户权限
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
  const loop = (routeMenuList: RouteMenuProps[]) => {
    routeMenuList.forEach((route) => {
      const { children, path, Component, authority } = route;
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
      children: [...routes, route404],
    },
    route404,
  ];
};

// 过滤路由数据, 获取菜单配置
export const getMenus = () => {
  const loop = (routeMenuList: RouteMenuProps[]): MeunProps[] => {
    return routeMenuList.map((item) => {
      const { children, path, label, icon, authority } = item;
      return {
        icon,
        label,
        key: path,
        authority,
        children: children ? loop(children) : undefined,
      };
    });
  };
  return loop(routeMenuList);
};

const routes = getRoutes(routeMenuList);

export default routes;
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
        const { authority, children } = menu;
        if (children) menu.children = loop([...children]);
        if (!authority) return true;
        return authority === User.role;
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
  try {
    const token = getToken();
    if (config.headers instanceof Object) {
      config.headers["Content-Type"] = "application/json";
    }
  } catch (e) {}
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
    } else {
      message.error(`${data.code}: ${data.msg}`);
      return Promise.reject(data);
    }
  },
  (error) => {
    if (error.response.status === 401) {
      return goLogin();
    }

    message.error(`${error.code}: ${error.message}`);
    Promise.reject(error);
  }
);

export default request;
```
