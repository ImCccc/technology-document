# 打造自己 cli

本章节会从 0 开发自己的 cli，实现功能如下：

1. 输入 cli create xxx
2. 选择 github 上的项目初始化模板
3. 将 github 上对应的模板代码下载到本地缓存目录，如果再次选择该模板，直接去缓存
4. 根据项目模板是否存在 ask.js 判断是否需要动态配置信息
5. 如果不需要，直接新建 xxx 文件夹，并将代码复制到 xxx 文件夹；如果需要，用户可以在命令行输入信息，通过模板引擎，将模板代码中需要转义的内容，转义为用户输入的内容

下面是总体目录结构

```
cli
└───bin
│ │ www.js
└───src
│ │ config.js
│ │ constants.js
│ │ create.js
│ │ index.js
│ package.json
│ README.md
│ .eslintrc.js
```

## 初始化 package.json, eslint

```
npm init -y
yarn add eslint -D
npx eslint --init
```

::: details .eslintrc.js 生成过程

```js
npx eslint --init
You can also run this command directly using 'npm init @eslint/config'.
Need to install the following packages: @eslint/create-config
Ok to proceed? (y) y
√ How would you like to use ESLint? · problems
√ What type of modules does your project use? · commonjs
√ Which framework does your project use? · none
√ Does your project use TypeScript? · No / Yes
√ Where does your code run? · node
√ What format do you want your config file to be in? · JavaScript
Successfully created .eslintrc.js file in C:\Users\30602\Desktop\ttt-cli
```

:::

::: details 点击查看.eslintrc.js

```js
module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {},
};
```

:::

## 安装项目使用到的安装包

```sh
yarn add commander consolidate download-git-repo handlebars inquirer metalsmith ncp ora@5.1.0 -S
```

::: danger
ora 最新版本不支持 commomjs;
<code>指定版本 yarn add ora@5.1.0</code>
:::

### commander

> 完整的 node.js 命令行解决方案
>
> <https://www.npmjs.com/package/commander> >
> <https://github.com/tj/commander.js/blob/HEAD/Readme_zh-CN.md>

### consolidate

> 集成大部分模板引擎，提供统一的 api
>
> <https://www.npmjs.com/package/consolidate>

### download-git-repo

> 用于下载 git 上仓库的代码
>
> <https://www.npmjs.com/package/download-git-repo>

### handlebars

> 这是一个模板引擎
>
> <https://www.npmjs.com/package/handlebars>

### inquirer

> 通用交互式命令行用户界面的集合, 例如创建 package.json 会要求用户输入项目名称，邮箱这写
>
> <https://www.npmjs.com/package/inquirer>

### metalsmith

> 可以获取某个文件夹下面的所有文件的 clone 版本，通过遍历，可以对文件删除，修改，然后复制到某一个目录里
>
> <https://www.npmjs.com/package/metalsmith>

### ncp

> 文件复制插件，可快速将某一个文件夹下所有文件，复制到另一个文件夹下
>
> <https://www.npmjs.com/package/ncp>

### ora

> 在命令行显示加载提示,
>
> <https://www.npmjs.com/package/ora>

## 新建入口文件, 修改 package.json

- 新建 bin/www.js

第一行是必须的，目的告诉系统要使用 nodejs 执行这个文件

```js
#! /usr/bin/env node
require("../src/index.js");
```

- 修改 package.json

```js
{
  "name": "cli",
  "bin": "bin/www.js",
  ...
}
```

- 新建 src/index.js

```js
console.log(888888);
```

::: details package.json

```js
{
  "name": "cli",
  "version": "1.0.0",
  "description": "",
  "bin": "bin/www.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "eslint": "^8.15.0"
  },
  "dependencies": {
    "commander": "^9.2.0",
    "consolidate": "^0.16.0",
    "download-git-repo": "^3.0.2",
    "handlebars": "^4.7.7",
    "inquirer": "^8.2.4",
    "metalsmith": "^2.4.3",
    "ncp": "^2.0.0",
    "ora": "^6.1.0"
  }
}
```

:::

## 使用 link，将当前目录链接到全局

```
npm link
```

命令执行成功后，无论在哪个文件夹，在终端执行命令 cli，都会进入 "bin": "bin/www.js"

::: tip

- 命令配置是在 package.json 的 name 字段，上述配置了 cli;
- 入口文件配置实在 package.json 的 bin 字段，上述配置了 bin/www.js;
- 卸载 npm unlink

:::

## constants.js

```js
const { version } = require("../package.json");
// process.env.USERPROFILE 获取用户目录，max系统是HOME
const downloadDirectory = process.env.HOME || process.env.USERPROFILE;
module.exports = {
  version,
  // 下载git仓库后需要缓存，缓存的文件命令
  downloadDirectory: downloadDirectory + "\\.clitemplate",
};
```

## src/index.js

```js
const path = require("path");
const program = require("commander");
const { version } = require("./constants");

// 所有参数指令列表
const mapActions = [
  {
    command: "create",
    alias: "c",
    description: "新建项目",
    examples: ["bb create <project-name>"],
  },
  {
    command: "config",
    alias: "conf",
    description: "配置项目",
    examples: ["bb config set <key> <value>", "bb config get <key>"],
  },
  {
    command: "*",
    description: "command not find",
    examples: [],
  },
];

/*
  下面方法的意思是说：
  如果：输入 cli create xxx
  那么：在当前文件所在目录下，require('create.js'), 然后执行返回结果,参数为[xxx]

  如果：输入 cli config xxx
  那么：在当前文件所在目录下，require('config.js'), 然后执行返回结果,参数为[xxx]
*/
mapActions.forEach((options) => {
  program
    .command(options.command) // 参数指令
    .alias(options.alias || "") // 别名
    .description(options.description || "") // 描述
    .action(() => {
      // 输入的命令无效
      if (options.command === "*") return console.log(options.description);

      // 根据输入的命令，动态加载对应的js，然后执行导出的方法
      const actionPath = path.resolve(__dirname, options.command);
      let action = require(actionPath);
      if (typeof action === "function") action(process.argv.slice(3));
    });
});

// 监听 --help命令， 做一些格外处理
program.on("--help", () => {
  console.log("\n例子: ");
  mapActions.forEach((options) => {
    if (options.command === "*") return;
    console.log(`  ${options.description}:`);
    options.examples.forEach((example) => console.log(`    ${example}`));
  });
});

program.version(version).parse(process.argv);
```

## create.js

```js
const fs = require("fs");
const ora = require("ora");
const path = require("path");
const inquirer = require("inquirer");
const { promisify } = require("util");
const npc = promisify(require("ncp"));
const { downloadDirectory } = require("./constants");
const downloadGitRepo = promisify(require("download-git-repo"));

const metalsmith = require("metalsmith");
const { render } = require("consolidate").handlebars;

const waitLoading =
  (fn, text) =>
  async (...args) => {
    const spinner = ora(text || "loading...").start();
    try {
      await fn(...args);
      spinner.succeed();
    } catch (error) {
      spinner.fail();
    }
  };

module.exports = async (args) => {
  // 用户选择模板
  let { temp } = await inquirer.prompt([
    {
      type: "list",
      name: "temp",
      message: "选择模板:",
      choices: ["后台模板1:lic-test", "后台模板2:lic-test1"],
    },
  ]);

  // lic-test or lic-test1
  const repo = temp.split(":")[1];

  // 如果输入 cli create name, 那么：projectName = name
  const projectName = args[0];

  // 下载地址
  const downloadAddress = `${downloadDirectory}/${repo}`;

  // 如果第一次下载，需要在github下载，下载完成后，将代码放到 downloadAddress 中
  if (!fs.existsSync(downloadAddress)) {
    await waitLoading(downloadGitRepo, "加载模板.......")(
      "github:ImCccc/" + repo,
      downloadAddress
    );
  }

  const askPath = path.join(downloadAddress, "ask.js");
  // 没有ask.js 文件，直接将代码复制到 当前执行目录/projectName 文件夹下
  if (!fs.existsSync(askPath))
    return npc(downloadAddress, path.resolve(projectName));

  // 有ask.js 文件，说明需要模板转义

  metalsmith(__dirname)
    .source(downloadAddress) // 源文件路径
    .destination(path.resolve(projectName)) // 处理后的文件存放路径
    .use(async (files, metal, done) => {
      // files：文件对象， key是文件名称， value是文件相关信息
      const args = require(path.join(downloadAddress, "ask.js"));
      let answer = await inquirer.prompt(args);

      // 数据可以传递给下一个use
      const meta = metal.metadata();
      Object.assign(meta, answer);

      // 执行下一个use
      done();
    })
    .use((files, metal, done) => {
      delete files["ask.js"];

      //  Reflect.ownKeys == Object.keys
      Reflect.ownKeys(files).forEach(async (file) => {
        // 只处理 .js 和 .json
        if (!file.includes(".js") && !file.includes(".json")) return;

        // files[file].contents 是当前文件的二进制数据，需要转化为字符串
        let content = files[file].contents.toString();

        // 需要转义的格式 {{ xxx }}, 过滤掉无需转义的文件
        if (!content.includes("{{")) return;

        // 模板转义
        content = await render(content, metal.metadata());

        // 需要将数据转化为二进制，才可以保存在磁盘中
        files[file].contents = Buffer.from(content);
      });
      done();
    })
    .build((err) => {
      if (err) console.log(err);
    });
};
```

以上就是用户可以选择 github 上的项目模板，然后将代码拉去到本地的 cli 开发的过程，在这过程中，可以定制很多需求，具体需求具体分析。
