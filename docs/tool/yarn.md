# yarn

[yarn 官网](https://yarnpkg.com/)<https://yarnpkg.com/>

[中文官网](https://yarn.bootcss.com/)<https://yarn.bootcss.com/>

[其他](https://cloud.tencent.com/developer/section/1477724)<https://cloud.tencent.com/developer/section/1477724>

yarn 是快速、可靠、安全的依赖管理工具。

1. 离线模式：如果你以前安装过某个包，再次安装时可以在没有任何互联网连接的情况下进行
2. 确定性：不管安装顺序如何，相同的依赖关系将在每台机器上以相同的方式安装
3. 网络性能：对请求进行排队处理，避免发起的请求如瀑布般倾泻，以便最大限度地利用网络资源
4. 相同的软件包：从 npm 安装软件包并保持相同的包管理流程
5. 网络弹性：重试机制确保单个请求失败并不会导致整个安装失败
6. 扁平模式：将依赖包的不同版本归结为单个版本，以避免创建多个副本

## yarn 安装卸载

---

```
全局安装
yarn add axios –g
yarn add axios –global

生产包
yarn add axios
yarn add axios -S
yarn add axios --save

开发依赖
yarn add axios –dev
yarn add axios –D

指定版本
yarn add axios axios@0.27.0

卸载
yarn remove axios
```

## yarn 更新

```
yarn upgrade
yarn upgrade axios
yarn upgrade axios@0.27.0
```

交互式更新模式: `yarn upgrade-interactive`

```js
yarn upgrade-interactive –latest

[1/? Choose which packages to update. (Press <space> to select, <a> to toggle all)
 devDependencies
❯◯ autoprefixer      6.7.7  ❯  7.0.0          https://github.com/postcss/autoprefixer#readme
 ◯ webpack           2.4.1  ❯  2.5.1          https://github.com/webpack/webpack

 dependencies
 ◯ bull              2.2.6  ❯  3.0.0-alpha.3  https://github.com/OptimalBits/bull#readme
 ◯ fs-extra          3.0.0  ❯  3.0.1          https://github.com/jprichardson/node-fs-extra
 ◯ socket.io         1.7.3  ❯  1.7.4          https://github.com/socketio/socket.io#readme
```

:::tip
你可以把它 `yarn upgrade-interactive` 看作是 `yarn outdated` 和 `yarn upgrade [package...]` 命令的组合。在`yarn outdated` 显示过期软件包列表 `yarn upgrade [package...]`并可用于升级所需软件包的位置，`yarn upgrade-interactive` 显示相同的过期软件包列表，并让您立即选择要升级的软件包。
:::

## yarn 镜像

```
获取当前源
yarn config get registry

设置淘宝源
yarn config set registry https://registry.npm.taobao.org/

设置官方源
yarn config set registry https://registry.yarnpkg.com

临时设置源
yarn add axios -D --registry=https://registry.npm.taobao.org/
```

## .yarnrc.yml 配置

<https://www.yarnpkg.cn/configuration/yarnrc/>
