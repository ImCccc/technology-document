# nextjs

要从头开始使用 React 构建一个完整的 Web 应用程序，需要考虑许多重要的细节：

1. 必须使用打包程序（例如 webpack）打包代码，并使用 Babel 等编译器进行代码转换。
2. 你需要针对生产环境进行优化，例如代码拆分。
3. 你可能需要对一些页面进行预先渲染以提高页面性能和 SEO。你可能还希望使用服务器端渲染或客户端渲染。
4. 你可能必须编写一些服务器端代码才能将 React 应用程序连接到数据存储。

Next.js 为上述所有问题提供了解决方案:

- 直观的、 基于页面 的路由系统（并支持 动态路由）
- 预渲染。支持在页面级的 静态生成 (SSG) 和 服务器端渲染 (SSR)
- 自动代码拆分，提升页面加载速度
- 具有经过优化的预取功能的 客户端路由
- 内置 CSS 和 Sass 的支持，并支持任何 CSS-in-JS 库
- 开发环境支持 快速刷新
- 利用 Serverless Functions 及 API 路由 构建 API 功能
- 完全可扩展

## 快速上手

1. 使用 create-next-app 创建新的 Next.js 应用程序

```javascript
npx create-next-app@latest
# or
yarn create next-app
```

使用 TypeScript:

```javascript
npx create-next-app@latest --typescript
# or
yarn create next-app --typescript
```

2. 运行 `npm run dev` 或 `yarn dev` 来启动开发服务器，访问地址为 http://localhost:3000。

<!-- ## 页面（Pages） -->

## 基本 api

下面列举了开发过程中, 常使用的组件和 api

### 页面路由

页面和路由有对应关系:

1. `pages/index.js` 对应路由 `/`
2. `pages/posts/first-post.js` 对应路由 `/posts/first-post`
3. `pages/xxx/xxx.js` 对应路由 `/xxx/xxx`

### 页面跳转(导航)

```tsx
import Link from "next/link";
<Link href="/posts/first-post">页面跳转</Link>;
```

### 静态资源

Next.js 可以在顶级公共目录下提供静态文件，如图像。public 内部的文件可以从应用程序的根目录引用:

![1683171181670](./image/nextjs/1683171181670.png)

```tsx
import Image from "next/image";
<Image src="/vercel.svg" alt="Vercel Logo" width={100} height={24} />;
```

### 修改页面的 title

```tsx
import Head from "next/head";
<Head>
  <title>page title</title>
</Head>;
```

### 使用 css modules

内置了插件, 直接可以使用 css modules

`pages/posts/first-post.module.css`

```css
.page {
  padding: 30px;
}
```

`pages/posts/first-post.tsx`

```tsx
import styles from "./first-post.module.css";
<main className={styles.page}></main>;
```

![1683172576508](./image/nextjs/1683172576508.png)
