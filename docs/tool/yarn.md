# yarn

[yarn 官网](https://yarnpkg.com/)<https://yarnpkg.com/>

[中文官网](https://yarn.bootcss.com/)<https://yarn.bootcss.com/>

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
yarn upgrade-interactive –latest
```

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
