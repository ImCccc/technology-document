# eslint

eslint 文档: <https://zh-hans.eslint.org/docs/latest/use/getting-started>

eslint-ts 文档: <https://typescript-eslint.io/rules/no-explicit-any>

## webpack5 使用 eslint

安装插件:

```
yarn add eslint-webpack-plugin eslint -D
```

`webpack.config.js`

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");
const EslintPlugin = require("eslint-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "development",

  entry: {
    index: "./src/index.js",
  },

  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].[hash:10].js",
    clean: true, // 每次构建删除原来的文件
  },

  plugins: [
    new HtmlWebpackPlugin({ template: "./src/index.html" }),
    new EslintPlugin({ context: path.join(__dirname, "src") }),
  ],
};
```

`.eslintrc.js`

```javascript
module.exports = {
  extends: ["eslint:recommended"],
  env: {
    node: true,
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module", // 使用 es module 模块
  },
  rules: {
    "no-var": 2, // 不能使用 var
  },
};
```

`.eslintignore`

```
/node_modules
/dist
```

## ts 中使用 eslint

安装插件

```
yarn add typescript @typescript-eslint/eslint-plugin @typescript-eslint/parser -D
```

如果使用 webpack5 构建的项目, 还需要安装 ts-loader

```js
yarn add ts-loader -D

// 在 webpack.config.js 添加 loader
module: {
  rules: [
    {
      test: /\.ts$/,
      use: "ts-loader",
    },
  ],
},
```

`.eslintrc.js`

```javascript
module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  env: {
    node: true,
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
  },
  rules: {
    "@typescript-eslint/no-explicit-any": 0,
  },
  ignorePatterns: ["webpack.config.js"],
};
```
