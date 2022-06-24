# npm

[官网](https://www.npmjs.com/)<https://www.npmjs.com/>

[中文官网](https://www.npmjs.com.cn/)<https://www.npmjs.com.cn/>

npm 是 JavaScript 包管理工具,并且是 Node.js 平台的默认包管理工具，也是世界上最大的软件注册表，里面包含超过 600000 个 包的结构，能够使您轻松跟踪依赖项和版本

## npm 安装

---

```
开发依赖(devDependencies):
npm install axios –D
npm install axios –save-dev

生产依赖(dependencies):
npm install axois
npm install axios –S
npm install axios --save

指定版本:
npm install axios@0.26.0

全局安装:
npm install axios -g
```

## npm 卸载

```
npm uninstall axios
```

## npm 更新

```
npm update axios
npm update axios@0.27.0
```

<font color="red">问题:</font>

<font color="red">1. 不会同步更新 package.json</font>

<font color="red">2. 不知道为什么,只能更新最后的小版本,例如 0.26.0,可以更新到 0.26.1,但是不能更新到 0.27.0</font>

## npm 镜像

---

```
默认镜像:
https://registry.npmjs.org/

获取镜像：
npm config get registry

设置淘宝镜像：
npm config set registry https://registry.npm.taobao.org

安装淘宝镜像：
npm install -g cnpm --registry=https://registry.npm.taobao.org

临时使用淘宝镜像安装：
npm install axios --registry https://registry.npm.taobao.org
```

## 查看版本

```
本地版本
npm list axois
npm ls axios

线上版本列表
npm view axios versions

线上最新版本
npm view axios version
```

## npmrc 配置

官网: <https://www.npmjs.cn/misc/config/>

一般公司都有自己的私有服务器，如果公司的包需要公司内网才可以安装，那么我们可以添加.npmrc 文件，让某些包可以使用某些服务器安装，具体设置如下：

**项目根目录添加.npmrc 文件:**

```
# 默认的依赖包指定源
registry=https://registry.npm.taobao.org

# @infore 开头的包,都使用下面的下载地址
@infore:registry=http://nexus.infore-robotics.cn/repository/infore-npm-group/
```

## 发布 npm 包

1. 先有账号，在官网申请 <https://www.npmjs.com/>

2. 登录 npm, 在终端输入 <code>npm login</code>然后 输入账号, 密码, 邮箱

- 账号: `vs1435`
- 邮箱: `306022598@qq.com`
- 密码: `最后一位-`

3. npm publish 发布

4. 发布完成后，在官网就可以看到

## 删除已发布的包

运行 npm unpublish 包名-force 命令，即可从 npm 删除已发布的包

```javascript
 npm unpublish 包名 -force
```

## npx

npx 是 npm 的高级版本，npx 具有更强大的功能

1. 直接运行 node_modules 中的某个指令

```
npx eslint --init
```

原理就是运行的时候，会到 node_modules/.bin 路径和环境变量$PATH 里面，检查命令是否存在

2. 避免全局安装模块

```
 npx create-react-app my-react-app
```

上面代码运行时，npx 将 create-react-app 下载到一个临时目录，使用以后再删除。所以，以后再次执行上面的命令，会重新下载 create-react-app

3. 强制使用本地模块 --no-install

```
npx --no-install http-server
```

让 npx 强制使用本地模块，不下载远程模块，可以使用--no-install 参数。如果本地不存在该模块，就会报错

4. 强制安装使用远程模块

```
npx --ignore-existing create-react-app my-react-app
```

忽略本地的同名模块，强制安装使用远程模块，可以使用--ignore-existing 参数。比如，本地已经全局安装了 create-react-app，但还是想使用远程模块
