# vscode 常见配置

下面列出 `vscode` 常见问题与配置

## 常见插件

<img width="400px" src="./imgs/vscode9.jpg" />

- 中文: Chinese (Simplified) (简体中文)

- 括号有颜色: [Deprecated] Bracket Pair Colorizer

  <font color="red">有自带的,需要设置下</font>
  <img src="./imgs/13.png" />

- 开启简单服务器: Live Server

- 右键在浏览器打开 html 文件: open in browser

- 代码格式: Prettier - Code formatter

- vue3 代码格式: Vue Language Features (Volar)

- 代码校验: ESLint

## 看不到远程分支

执行：

```
git remote update origin --prune
```

## 不能使用 cnpm

1、打开 vs code（以管理员身份运行）

2、在终端执行：get-ExecutionPolicy，显示 Restricted（表示状态是禁止的）

3、在终端执行：set-ExecutionPolicy RemoteSigned

4、在终端执行：get-ExecutionPolicy，显示 RemoteSigned

## 设置代码片段

<img src="./imgs/vscode10.png" width="100%">

### css | less | scss 代码片段

::: details 点击查看 less.json

```json
{
  "mixins-variables": {
    "prefix": "aaa-import",
    "body": [
      "@import '~@/styles/mixins.less';",
      "@import '~@/styles/variables.less';"
    ]
  },

  "display: flex": {
    "prefix": "aaa-flex",
    "body": ["display: flex;"]
  },

  "flex-grow: 1": {
    "prefix": "aaa-grow1",
    "body": ["flex-grow: 1;"]
  },

  "flex-shrink: 0": {
    "prefix": "aaa-shrink0",
    "body": ["flex-shrink: 0;"]
  },

  "flex-direction: column": {
    "prefix": "aaa-column",
    "body": ["display: flex;", "flex-direction: column;"]
  },

  "flex-column-between": {
    "prefix": "aaa-between-column",
    "body": [
      "display: flex;",
      "flex-direction: column;",
      "justify-content: space-between;"
    ]
  },

  "flex-center": {
    "prefix": "aaa-center",
    "body": [
      "display: flex;",
      "align-items: center;",
      "justify-content: center;"
    ]
  },

  "flex-between": {
    "prefix": "aaa-between",
    "body": [
      "display: flex;",
      "align-items: center;",
      "justify-content: space-between;"
    ]
  },

  "cursor: pointer": {
    "prefix": "aaa-cursor",
    "body": ["cursor: pointer;"]
  },

  "ellipsis": {
    "prefix": "aaa-ellipsis",
    "body": ["width: ${0};", "overflow: hidden;", "text-overflow: ellipsis;"]
  }
}
```

:::

### tsx 代码片段 (typescriptreact.json)

::: details 点击查看 typescriptreact.json

```json
{
  "init-tsx": {
    "prefix": "aaainit",
    "body": [
      "import styles from './index.module.less';\n",
      "const Comp: React.FC = () => {",
      "\treturn <div>test</div>;",
      "};\n",
      "export default Comp;"
    ]
  },

  "import-style": {
    "prefix": "aaastyles",
    "body": ["import styles from './index.module.less';\n"]
  },

  "classNames": {
    "prefix": "aaaclassNames",
    "body": "import classNames from 'classnames';"
  },

  "Modal.confirm": {
    "prefix": "aaaModal",
    "body": [
      "Modal.confirm({",
      "\ttitle: '提示',",
      "\tcontent: '数据未保存，确定要离开吗？',",
      "\tcancelText: '取消',",
      "\tokText: '确定',",
      "\tonOk: () => {",
      "\t},",
      "});"
    ]
  },

  "import-utils": {
    "prefix": "aaautils",
    "body": ["import { ${1:clone} } from '@/utils/util';"]
  },

  "umi-history": {
    "prefix": "aaacomp",
    "body": ["import { $1 } from '@/components$1';"]
  },

  "antd-Button": {
    "prefix": "aaaButton",
    "body": ["import { Button } from 'antd';"]
  },

  "数组promise": {
    "prefix": "aaapromise",
    "body": ["return new Promise((resolve, reject) => {\n\t${1}\n})"]
  },

  "定时器setTimeout": {
    "prefix": "aaasettimeout",
    "body": ["const ${1:timer} = setTimeout(() => {\n\t$3\n}, ${2:60})"]
  },

  "数组reduce": {
    "prefix": "aaareduce",
    "body": ["${1:arr}.reduce((data, cur) => {\n\t${2}\n\treturn data\n}, {})"]
  }
}
```

:::

### markdown 代码片段

`markdown` 文档的代码片段配置文件为 <font color="red">markdown.json </font>

::: details 点击查看 markdown.json 配置

````json
{
  "Print ···javascript": {
    "prefix": "···js",
    "body": ["```javascript", "$1", "$2", "```"],
    "description": "js代码片段"
  },

  "Print ···css": {
    "prefix": "···css",
    "body": ["```css", "$1", "$2", "```"],
    "description": "css代码片段"
  },

  "Print ···html": {
    "prefix": "···html",
    "body": ["```html", "$1", "$2", "```"],
    "description": "html代码片段"
  },

  "Print ···json": {
    "prefix": "···json",
    "body": ["```json", "$1", "$2", "```"],
    "description": "json代码片段"
  },

  "Print ```javascript": {
    "prefix": "```js",
    "body": ["```javascript", "$1", "$2", "```"],
    "description": "js代码片段"
  },

  "Print ```css": {
    "prefix": "```css",
    "body": ["```css", "$1", "$2", "```"],
    "description": "css代码片段"
  },

  "Print ```html": {
    "prefix": "```html",
    "body": ["```html", "$1", "$2", "```"],
    "description": "html代码片段"
  },

  "Print ```json": {
    "prefix": "```json",
    "body": ["```json", "$1", "$2", "```"],
    "description": "json代码片段"
  },

  "Print img": {
    "prefix": "aaaimg",
    "body": ["<img  src=\"${0}\" />"],
    "description": "img"
  },

  "Print font": {
    "prefix": "aaafont",
    "body": ["<font color=\"${0:red}\">$1</font>"],
    "description": "字体"
  }
}
````

:::

**给 md 文档添加代码片段, 请看下面步骤:**

1. 找到 markdown.json 配置文件:

<img height="250px" src="./imgs/vscode6.jpg" />

2. 这时还不行, 需要在配置文件 `setting.json` 添加配置:

<img  src="./imgs/vscode8.jpg" />
<img height="100px" src="./imgs/vscode7.jpg" />

```json
{
  "[markdown]": {
    "editor.quickSuggestions": true
  }
}
```

## 不能使用 rm-rf 删除文件夹

- 方法 1

全局安装:

```
npm install rimraf –g
```

执行命令:

```
rimraf node_modules
```

- 方法 2

当前安装：

```
npm install rimraf –D
```

package.json 添加：

```
"scripts": {
  "rm": :rimraf node_modules"
}
```

执行命令:

```
npm run rm
```

## 没有文件名提示

vite 创建的 vue 项目中 import 引入文件会有路径提示，不过除了 ts 文件，其他文件都没有文件名的提示，导致手敲，很麻烦：

<img height="120px" src="./imgs/vscode1.png">

解决方案：

1. 安装插件 Path Autocomplete

<img height="120px" src="./imgs/vscode2.png">

2. 按下 ctrl + shift + p, 输入 setting, 打开配置文件

<img src="./imgs/vscode3.jpg">

setting.json:

```json
{
  //导入文件时是否携带文件的拓展名
  "path-autocomplete.extensionOnImport": true,
  //配置@的路径提示
  "path-autocomplete.pathMappings": { "@": "${folder}/src" }
}
```

3. 完成：

<img height="80px" src="./imgs/vscode4.jpg">

## css module 配置代码提示

1. 安装

```
yarn add -D typescript-plugin-css-modules
```

2. vs code 的 setting.json 添加：

```json
{
  "typescript.tsserver.pluginPaths": ["typescript-plugin-css-modules"]
}
```

3. 配置 tsconfig.json

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "typescript-plugin-css-modules",
        "options": { "customMatcher": "\\.(c|le|sc)ss" }
      }
    ]
  }
}
```

<img height="150px" src="./imgs/vscode5.jpg">

::: warning

注意: 使用该插件后, 引入 less 变量, 不能使用别名的方式, 要使用相对路径, 不然 ts 会报错

例子: `@import '../../styles/var.less';`
:::

## 保存自动格式化

配置 setting.json

```json
{
  "editor.formatOnSave": true
}
```

## less 使用函数或者混入报红

原因 vscode 安装了插件 Stylelint, 禁用就行了

## 我的 vscode 快捷键

下面是我本人自定义的快捷键:

<img height="150px" src="./imgs/vscode11.jpg" />

## 如何批量重命名变量和函数

1. 双击变量名
2. 右键 或者 按下 F2
3. 此时会出现输入框,输入新名称,按下回车键即可完成

<img src="./imgs/vscode12.jpg" />
