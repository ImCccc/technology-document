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
```

2. 配置

```javascript
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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

## eslint 插件

1. 安装

```
yarn add eslint-webpack-plugin eslint -D
```

2. webpack5 配置

```javascript
const EslintPlugin = require("eslint-webpack-plugin");
const path = require("path");

module.exports = {
  plugins: [
    new EslintPlugin({
      context: path.resolve(__dirname, "src"),
    }),
  ],
};
```

3. 添加配置文件 `.eslintrc.js`

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
  rules: {
    "no-var": 2, // 不能使用 var
  },
};
```

4. 添加忽略文件 `.eslintignore`

```
/node_modules
/dist
/config
```

## babel 插件

主要用于将 es6 语法转化为 es5 语法, 以便能在旧浏览器上运行: <https://www.webpackjs.com/loaders/babel-loader/>

1. 安装

```
yarn add babel-loader @babel/core @babel/preset-env -D
```

2. webpack5 配置

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          // 可以直接配置, 也可以通过配置文件
          // options: { presets: ["@babel/preset-env"] },
        },
      },
    ],
  },
};
```

3. 添加配置文件 `babel.config.js`

```javascript
module.exports = {
  presets: ["@babel/preset-env"],
};
```

## html 插件

1. 安装

```
yarn add html-webpack-plugin -D
```

2. webpack5 配置

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  plugins: [new HtmlWebpackPlugin({ template: "src/index.html" })],
};
```
