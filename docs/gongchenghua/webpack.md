# webpack5

以下例子中, 配置文件都放在项目根目录的 config 文件夹中, 设计到地址配置,稍微留言下

## 开发环境插件

1. 安装

```
yarn add webpack-dev-server -D
```

2. webpack5 配置

```javascript
module.exports = {
  devServer: {
    host: "localhost",
    port: 3000,
    open: true, // 自动打开浏览器
    hot: true, // 热模块更新 （默认true）
  },
};
```

3. 修改 package.json

```json
{
  "scripts": {
    "dev": "webpack server --config ./config/webpack.config.js"
  }
}
```

## css 相关的 loader

1. 安装

```
yarn add style-loader css-loader -D
yarn add sass sass-loader -D
yarn add less less-loader -D
yarn add postcss-loader postcss postcss-preset-env -D
yarn add mini-css-extract-plugin -D
yarn add css-minimizer-webpack-plugin -D
```

2. 配置

```javascript
// css 单独生成文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// css 压缩
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const postcssLoader = {
  loader: "postcss-loader",
  options: {
    postcssOptions: {
      plugins: ["postcss-preset-env"],
    },
  },
};

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // 'style-loader'
          "css-loader",
          postcssLoader,
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader, // 'style-loader'
          "css-loader",
          postcssLoader,
          "sass-loader",
        ],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader, // 'style-loader'
          "css-loader",
          postcssLoader,
          "less-loader",
        ],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
  optimization: {
    minimizer: [new CssMinimizerPlugin()],
  },
};
```

3. 修改 package.json (postcss-loader 用到)

```json
{
  "browserslist": [
    "last 2 version", // 最近2个版本
    "> 1%", // 覆盖 99%
    "not dead" // 不要废弃的浏览器
  ]
}
```

**说明**

1. [mini-css-extract-plugin](https://www.webpackjs.com/plugins/mini-css-extract-plugin/): 将 CSS 提取到单独的文件中
2. postcss-loader: 解决样式兼容性
3. style-loader: 将样式插入到 html 中(使用 MiniCssExtractPlugin 插件后需要替换)
4. css-loader: 将 css 转化为 js 能
5. less-loader: less 转 css
6. sass-loader: scss 转 css
7. css-minimizer-webpack-plugin: 压缩 css

## 图片资源

<https://www.webpackjs.com/guides/asset-modules#inlining-assets>

1. webpack5 配置

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|git|webp)$/,
        type: "asset",
        parser: {
          // 默认 小于 8kb 的图片变为 base64, 现在改为 10kb
          dataUrlCondition: { maxSize: 10 * 1024 },
        },
      },
    ],
  },
};
```

图片压缩: <https://www.webpackjs.com/plugins/image-minimizer-webpack-plugin/>

1. 安装

```
yarn add image-minimizer-webpack-plugin -D
yarn add imagemin-gifsicle imagemin-jpegtran imagemin-optipng imagemin-svgo -D
```

## html 插件

```javascript
/*
  yarn add html-webpack-plugin -D
*/
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
  ],
};
```

## eslint 插件

1. webpack5 配置

```javascript
/*
  yarn add eslint-webpack-plugin eslint -D
*/
const EslintPlugin = require("eslint-webpack-plugin");
const path = require("path");

module.exports = {
  plugins: [
    new EslintPlugin({
      // 开始缓存
      cache: true,
      // 缓存地址配置
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/eslintcache"
      ),
      context: path.resolve(__dirname, "src"),
    }),
  ],
};
```

2. 添加配置文件 `.eslintrc.js`

```javascript
module.exports = {
  extends: ["eslint:recommended"],
  env: {
    node: true,
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
  },
  // 不能使用 var
  rules: { "no-var": 2 },
  // 可以使用 import() 动态导入
  plugins: ["import"],
};
```

4. 添加忽略文件 `.eslintignore`

```
/node_modules
/dist
/config
```

::: tip
`cache: true` 开启缓存, `cacheLocation` 设置缓存目录
:::

## babel 插件

主要用于将 es6 语法转化为 es5 语法, 以便能在旧浏览器上运行: <https://www.webpackjs.com/loaders/babel-loader/>

1. webpack5 配置

```javascript
/*
  yarn add babel-loader @babel/core @babel/preset-env -D
  yarn add @babel/plugin-transform-runtime -D

  按需还需要安装:
  yarn add core-js@3 -D
*/
module.exports = {
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true, // 开启缓存
            cacheCompression: false, // 关闭缓存文件压缩
          },
          // 可以直接配置, 也可以通过配置文件
          // options: { presets: ["@babel/preset-env"] },
        },
      },
    ],
  },
};
```

2. 添加配置文件 `babel.config.js`

```javascript
// https://babeljs.io/docs/babel-preset-env#corejs
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      // core-js 按需加载配置
      { useBuiltIns: "usage", corejs: 3 },
    ],
  ],
};
```

::: tip

1. 不知道为什么需要配置按需加载引入 es6 转 es5, 但是就是不生效
2. cacheDirectory 开启缓存, 缓存文件目录在 `node_modules\.cache\babel-loader`
3. `@babel/plugin-transform-runtime` 可以将公共方法单独抽离,它禁用了自动对每一个文件 runtime 注入，使所有辅助代码能够复用

:::

## core-js 解决兼容性问题

`babel-loader` 只能对箭头函数，点点点运算等转换， 不能解决类似于 Promise 数组的 includes 类似的 api, 下面使用 core-js 解决；

安装: `yarn add core-js -D`

1. 直接使用 (体积很大)

```js
import "core-js";
```

2. 按需加载 (用到什么就引用什么, 缺点太麻烦)

```js
import "core-js/es/promise";
```

3. 配置 `babel.config.js` 配置 (参考 babel 插件那一章, <font color="red">不过不知道为什么不生效</font> )

## 环境变量

1. 安装

```
yarn add cross-env -D
```

2. 修改 `package.json`

```json
{
  "scripts": {
    "dev": "cross-env NODE_ENV=development webpack server --config ./config/webpack.config.js",
    "prd": "cross-env NODE_ENV=production webpack --config ./config/webpack.config.js"
  }
}
```

3. 配置文件 `webpack.config.js` 使用

```js
console.log(process.env.NODE_ENV);
```

## SourceMap

原理： 生成一个 xxx.map 文件， 里面包含源码和构建后的代码的每一行每一列的对应关系；当构建后的代码在浏览器上出错了，可以帮助我们快速找到出错的位置.

webpack5 配置:

```js
module.exports = {
  mode: 'development' // production
  devtool: "cheap-module-source-map",
};
```

## 多进程打包

webpack5 配置

```js
/*
  yarn add eslint-webpack-plugin eslint -D
  yarn add babel-loader @babel/core @babel/preset-env @babel/plugin-transform-runtime -D
  yarn add thread-loader -D
*/
const os = require("os");
const path = require("path");
const EslintPlugin = require("eslint-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const threads = os.cpus().length; // cpu 核数

module.exports = {
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: [
          // 多进程打包
          {
            loader: "thread-loader",
            options: { works: threads },
          },
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              cacheCompression: false,
              plugins: ["@babel/plugin-transform-runtime"],
            },
          },
        ],
      },
    ],
  },

  optimization: {
    minimizer: [
      // 多进程压缩 js
      new TerserPlugin({ parallel: threads }),
    ],
  },

  plugins: [
    new EslintPlugin({
      context: path.resolve(__dirname, "../src"),
      cache: true,
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/eslintcache"
      ),
      threads, // 多进程打包
    }),
  ],
};
```

## 动态导入

```js
module.exports = {
  optimization: {
    // 代码分割配置 https://www.webpackjs.com/plugins/split-chunks-plugin/
    splitChunks: {
      chunks: "all",
    },
  },
};
```

添加后， 发现`import("xxx.js").then(() => {});` 会单独打包成一个文件，引入 node_modules 的模块也会单独打包

**给打包输出的文件命名：**

```js
// 使用
import(/* webpackChunkName: "sum" */ "./js/index.js");

// 配置
module.exports = {
  output: {
    filename: "xxx",
    chunkFilename: "js/chunk.[name].[contenthash:5].js",
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};
```

::: tip
如果 eslint 报错： Parsing error: 'import' and 'export' may only appear at the top leveleslint , 可以这样做:

1. package.json 添加 `plugins: ["import"]` 配置：

```js
module.exports = {
  extends: ["eslint:recommended"],
  plugins: ["import"],
};
```

2. 安装`yarn add @babel/eslint-parser -D`,修改`.eslintrc.js` 配置:

```js
module.exports = {
  extends: ["eslint:recommended"],
  parser: "@babel/eslint-parser",
};
```

:::

## Preload Prefetch

`Preload` `Prefetch` 共同点：

1. 只会加载资源，不会执行；
2. 浏览器兼容性差；

`Preload` `Prefetch` 不同点:

1. preload: 告诉浏览器马上加载资源；prefetch: 告诉浏览器空闲的时候才加载资源；
2. preload 优先级高，prefetch 低
3. prefetch 可以加载下一个页面的资源，preload 不可以

```js
/*
  yarn add @vue/preload-webpack-plugin -D
*/
const PreloadPlugin = require("@vue/preload-webpack-plugin");

module.exports = {
  plugins: [
    // new PreloadPlugin({
    //   rel: "prefetch",
    // }),
    new PreloadPlugin({
      rel: "preload",
      as: "script", // 优先级最高：style
    }),
  ],
};
```

## 打包缓存优化

打包的时候， 只修改一个 sum.js, 但是发现引用了 sum 模块的 js 也跟着重新打包， 这一节我们修改配置来解决这个问题：

```js
module.exports = {
  output: {
    filename: "js/[name].[contenthash:10].js",
    chunkFilename: "js/chunk.[name].[contenthash:5].js",
  },
  optimization: {
    splitChunks: { chunks: "all" },
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}.js`,
    },
  },
};
```

::: tip

为什么使用`contenthash`不使用`hash`？因为打包的时候，不改变的文件，不需要修改文件名称，上线后就可以缓存

:::

## PWA

参考: <https://www.webpackjs.com/guides/progressive-web-application/#registering-our-service-worker>

解决断网不能访问的问题, 下面是使用方法:

1. webpack5 配置

```javascript
/*
  yarn add workbox-webpack-plugin -D
*/
const WorkboxPlugin = require("workbox-webpack-plugin");
const config = {
  plugins: [
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
};
module.exports = config;
```

2. 入口文件添加如下代码

```javascript
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("注册成功: ", registration);
      })
      .catch((registrationError) => {
        console.log("注册失败: ", registrationError);
      });
  });
}
```

打包后, 会自动生成 `service-worker.js`, 启动时候会加载该文件, 不过 pwa 兼容性比较差

## 一些使用技巧

**1. 使用 JSDoc 添加配置文件的代码提示, 已 pwd 配置为例:**

文档: <https://jsdoc.bootcss.com/about-plugins.html>

```javascript
const WorkboxPlugin = require("workbox-webpack-plugin");

/** @type import("webpack").Configuration */
const config = {
  plugins: [
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
};
module.exports = config;
```

注意不能这样写 `module.exports = {xxxx}`

**2. 使用 serve 在某一个目录下开启服务**

- 安装 `npm i serve -g`
- 启动 `serve dist`

## 总结

webpack 优化方案包括:

1. eslint 开启缓存配置
2. babel 开启缓存配置
3. 多进程打包
4. 图片压缩
5. 开启 SourceMap
6. Tree shaking 移除 js 中无用的代码,依赖 Es Module, webpack 默认开启该功能
7. 使用 import 方法实现动态导入
8. 使用 runtimeChunk 实现文件缓存
9. 使用 PWA 离线优化
