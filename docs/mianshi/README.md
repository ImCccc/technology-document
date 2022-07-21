# 常见面试题

## 浏览器缓存

### 强制缓存

跟强制缓存相关的 Response Headers 头属性有（Pragma/Cache-Control/Expires）

- Expires: 字面意思表示的是有效期, 表示的就是一个具体的时间. 例如：Expires: Wed, Nov 11 2020 08:00:00 GMT；

- Cache-Control 强缓存（http/1.1）下面是常用指令，可以组合使用

  1. public/private：private 只有客户端（浏览器）缓存; Public 服务器缓存,就是所有客户端都可用
  2. no-cache 表示不进行强缓存验证, 而是用协商缓存来验证
  3. no-store 所有内容都不会被缓存, 也不进行协商缓存
  4. max-age 过期时间, max-age=300 表示在 300s 后缓存内容失效

  例子：Cache-Control: public, max-age=300 任何客户端都可缓存, 且过期时长为 300 秒；

- 强制缓存 返回状态码: 200

**Cache-Control 和 Expires 对比：**

1. Expires 产于 HTTP/1.0, Cache-control 产于 HTTP/1.1;
2. Expires 是一个具体的时间, Cache-control 设置具体时常还有其它的属性;
3. 两者同时存在, Cache-control 的优先级更高;
4. 在不支持 HTTP/1.1 的环境下, Expires 就会发挥作用

### 协商缓存

如果没有使用强缓存，那么就会判断是否需要协商缓存，主要是通过文件最后修改时间是否一样，或者文件内容的哈希值是否改变，来决定。

如果修改时间一样，或者文件哈希值一样，那么就会返回 304 状态码，告诉浏览器可以使用缓存中的数据。否则服务器就会返回更新后的资源并且将缓存信息一起返回，这时状态码为 200

_**跟协商缓存相关的 header 头属性有（ETag/If-Not-Match 、Last-Modified/If-Modified-Since）请求头和响应头需要成对出现**_

#### Last-Modified / If-Modified-Since

1. 第一次请求这个资源，在响应体的 response header 中带上 Last-Modified, 值为该资源在服务器上最后的修改时间。浏览器收到后缓存文件和这个 header

2. 再次请求的时候，会在请求头 request header 中带上 If-Modified-Since, 值就是 Last-Modified

3. 根据 If-Modified-Since 与服务器的最后修改时间做对比, 相同返回 304，不同则重新获取数据，返回 200(同时返回最新的 Last-Modified)

#### ETag / If-None-Match

1. 在浏览器请求服务器资源的时候, 服务器根据当前文件的内容, 给文件生成一个唯一的标识, 若是文件发生了改变, 则这个标识就会改变
2. 首次请求, 在响应体的 response header 中带上 ETag, 值就是那个唯一标识
3. 再次加载该资源时, 会在请求头 request header 带上 If-None-Match,值就是上次缓存的 ETag
4. 服务器接收到了之后与该资源自身的 ETag 做对比, 一致,返回 304 知会客户端直接使用本地缓存;若是不一致, 返回 200 和最新的资源文件(包括最新的 ETag)

#### ETag/If-Not-Match 解决以下问题：

1. Last-Modified 标注的最后修改只能精确到秒级，如果某些文件在 1 秒钟以内，被修改多次的话，它将不能准确标注文件的修改时间
2. 如果某些文件被修改了，但内容并没变化，而 Last-Modified 却改变了，导致文件没法使用缓存
3. 有可能存在服务器没有准确获取文件修改时间，或者与代理服务器时间不一致等情形

## 前端模块化

前端早期是没有模块化的概念，只能把所有的 js 写到一个文件中，文件越写越大，于是就用几个文件去存放代码，然后依次引入，浏览器会依次加载解析执行，但是加载的文件越多，浏览器就假死时间越长，而且要严格保证加载顺序，你不知道谁在依赖谁，代码难以维护，模块化就是解决这些问题

### AMD(RequireJS)

AMD 即 Asynchronous Module Definition：异步模块加载

- RequireJS 是一个遵守 AMD 规范的工具库，用于客户端的模块管理

1. 通过 define 方法，将代码定义为模块；
2. 通过 require 方法，实现代码的模块加载，使用时需要下载和导入项

```javascript
let factories = {};
function define(moduleName, factory) {
  factories[moduleName] = factory;
}
function require(modules, callback) {
  modules = modules.map(function (item) {
    let factory = factories[item]; // 定义好每一个 然后把它执行
    return factory(); // 执行之后返回的东西 放到modules
  });
  callback(...modules); // 然后回掉函数执行这些modules
}
define("moduleA", function () {
  return {
    fn() {
      console.log("moduleA");
    },
  };
});
define("moduleB", function () {
  return {
    fn() {
      console.log("moduleB");
    },
  };
});
require(["moduleB", "moduleA"], function (moduleB, moduleA) {
  moduleB.fn();
  moduleA.fn();
});
```

### CMD (sea.js)

AMD 虽然实现了异步加载，但是开始的时候就会把依赖关系都整理好，可不可以向 CommonJs 一样使用的时候再加载呢？所以 CMD 就诞生了，sea.js 是比较好的实现，是依赖就近; CMD 依赖后置，我们在使用的时候才会加载，这样就可能造成一点点的延迟，这也是大部分人诟病的地方

### AMD 和 CMD 区别

1. AMD 是 RequireJS 在推广过程中对模块定义的规范化产出;CMD 是 SeaJS 在推广过程中对模块化定义的规范化产出:
2. 对于依赖的模块，AMD 是提前执行，CMD 是延迟执行。
3. CMD 推崇依赖就近，AMD 推崇依赖前置。

### CommonJs (node.js)

CommonJs 只能在 node 环境下支持，客户端/浏览器不支持 CommonJS 规范

webpack 打包工具对 CommonJS 的支持和转换；也就是前端应用也可以在编译之前，尽情使用 CommonJS 进行开发。

1. exports 和 module.exports 可以负责对模块中的内容进行导出；
2. require 函数可以帮助我们导入其他模块

### ES Module

ES6 起，引入了一套新的 ES6 Module 规范，在语言标准的层面上实现了模块功能，而且实现得相当简单，有望成为浏览器和服务器通用的模块解决方案

- tree-shaking

  tree-shaking 意思是编译时去除不必要代码， ES6 Module 是静态编译, 静态编译使得在编译时就知道程序只用哪些方法，其他方法是不需要的

- 兼容性

  目前浏览器对 ES6 Module 兼容还不太好，我们平时在 Webpack 中使用的 export 和 import，会经过 Babel 转换为 CommonJS 规范

#### import()

import 函数出现可以解决 <font color="red"> import 和 export 不能出现在块级作用域内,无法动态加载 </font>的问题

vue 路由懒加载, 异步组件, 动态组件 都是基于这个原理实现

### CommonJs 和 ES module 的区别

1. CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用
2. CommonJS 模块是运行时加载; ES6 模块是编译时输出接口, 支持 tree-shaking
3. CommonJs 是单个值导出，ES6 Module 可以导出多个
4. CommonJs 是动态语法可以写在判断里，ES6 Module 静态语法只能写在顶层
5. CommonJs 的 this 是当前模块，ES6 Module 的 this 是 undefined

#### h5 script 标签

在 script 标签设置后，浏览器才知道是 es module ，下面是配置说明

```html
<script src="./a.js" defer></script>
<script src="./b.js" async></script>
<script src="./c.js" defer async></script>
<script src="./a.js" type="module"></script>
<script type="module">
  import "./a.js";
</script>
```

- async script：异步下载，下载成功立马执行，有可能会阻断 HTML 的解析
- defer script：完全不会阻碍 HTML 的解析，解析完成之后再按照顺序执行脚本
- type='module'：浏览器会异步加载，等同于 defer

#### nodejs 支持 es mudule

Node 既可以使用 Commonjs 也可以使用 ES Module，对于使用 ES Module 规范的文件要求后缀必须为
<code>.mjs</code> <font color="red">(require 和 import 不可以共存)</font>

## 前端跨域

### JSONP

简单适用，老式浏览器全部支持，服务器改造非常小, 原理是使用 script 标签可以跨域的特点实现

1. 网页动态插入 script 元素，由它向跨源网址发出请求，请求的查询字符串有一个 callback 参数，指定回调函数的名字
2. 服务器返回 script 标签的内容，内容就是调用指定的回调函数，并且将返回数据以参数的显示传递

### CORS

CORS 是一个 W3C 标准，全称是"跨域资源共享"（Cross-origin resource sharing）。
它允许浏览器向跨源服务器，发出 XMLHttpRequest 请求，从而克服了 AJAX 只能同源使用的限制

参考：<http://www.ruanyifeng.com/blog/2016/04/cors.html>

CORS 需要浏览器和服务器同时支持。目前所有浏览器都支持该功能，IE 浏览器不能低于 IE10；

CORS 请求分成两类：<font color="brown">简单请求</font>（simple request）和<font color="brown"> 非简单请求 </font>（not-so-simple request）整个通信过程，都是浏览器自动完成。浏览器一旦发现 AJAX 请求跨源，就会自动添加一些附加的头信息，有时还会多出一次附加的请求，但用户不会有感觉

#### 简单请求

- 前提条件：

1. 请求方法是 HEAD， GET， POST 三种方法之一
2. HTTP 的头信息不超出以下几种字段：
   <code>Accept</code>
   <code>Accept-Language</code>
   <code>Content-Language</code>
   <code>Last-Event-ID</code>
   <code>Content-Type</code>只限于三个值
   <code>application/x-www-form-urlencoded</code>
   <code>multipart/form-data</code>
   <code>text/plain</code>

**简单请求流程**

1. 浏览器发现是简单请求, 自动在头信息之中，添加一个 Origin 字段:

```
Origin: http://api.bob.com
```

2. 服务器根据 Origin 字段判断当前域名是否在许可范围内,不在报错;在, 服务器返回的响应,会多出一些字段: 三个与 CORS 请求相关的字段，都以 Access-Control-开头:

```
Access-Control-Allow-Origin: http://api.bob.com
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: FooBar
```

- Access-Control-Allow-Origin:
  该字段是必须的。它的值要么是请求时 Origin 字段的值，要么是一个\*，表示接受任意域名的请求;

- Access-Control-Allow-Credentials:
  该字段可选。它的值是一个布尔值，表示是否允许发送 Cookie。

- Access-Control-Expose-Headers:
  该字段可选。CORS 请求时，XMLHttpRequest 的 getResponseHeader()方法只能拿到 6 个基本字段：Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma。如果想拿到其他字段，就要指定。上面的例子指定，getResponseHeader('FooBar')可以返回 FooBar 字段的值

#### 非简单请求

> 比如请求方法是 PUT 或 DELETE，或者 Content-Type 字段的类型是 application/json;

非简单请求会增加一次"预检"请求: 浏览器先询问服务器，当前域名是否在服务器的许可名单之中，以及可以使用哪些 HTTP 动词和头信息字段。只有得到肯定答复，浏览器才会发出正式的 XMLHttpRequest 请求，否则就报错

- 预请求

预请求的 http 头信息:

```
Origin: http://api.bob.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: X-Custom-Header
```

<code>Access-Control-Request-Method:</code>
该字段是必须的，用来列出浏览器的 CORS 请求会用到哪些 HTTP 方法

<code>Access-Control-Request-Headers:</code>
指定 CORS 请求会额外发送的头信息字段

预请求回应:

```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://api.bob.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: X-Custom-Header
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 1728000
```

<code>Access-Control-Allow-Origin</code>
可以请求的域名, \*表示同意任意跨源请求

<code>Access-Control-Allow-Methods</code>
表明服务器支持的所有跨域请求的方法

<code>Access-Control-Allow-Headers</code>
表明服务器支持的所有头信息字段

<code>Access-Control-Allow-Credentials</code>
表示是否允许发送 Cookie

<code>Access-Control-Max-Age</code>
本次预检请求的有效期, 在有效期内，下次请求就不需要预请求

- 正常请求

一旦服务器通过了"预检"请求，以后每次浏览器正常的 CORS 请求，就都跟简单请求一样，会有一个 Origin 头信息字段。服务器的回应，也都会有一个 Access-Control-Allow-Origin 头信息字段

下面是"预检"请求之后，浏览器的正常 CORS 请求

```
Origin: http://api.bob.com
Host: api.alice.com
X-Custom-Header: value
Connection: keep-alive
User-Agent: Mozilla/5.0...
```

下面是服务器正常的回应:

```
Access-Control-Allow-Origin: http://api.bob.com
Content-Type: text/html; charset=utf-8
```

### CORS 与 JSONP 的比较

1. JSONP 只支持 GET 请求，CORS 支持所有类型的 HTTP 请求
2. JSONP 的优势在于支持老式浏览器，可以向不支持 CORS 的网站请求数据

### websocket

> 使用 websocket 也是可以达到跨域的效果

## http 和 https 区别

### http1.1

1. 超文本传输协议，允许传输文本、图片、音频等，传输的类型由 Content-Type 标记
2. 无状态，HTTP 请求不具备保存之前发送过的请求或响应的功能，每一次请求都是独立无关的
3. http1.1 版引入了持久连接, 即 TCP 连接默认不关闭，可以被多个请求复用
4. http1.1 版还引入了管道机制（pipelining），即在同一个 TCP 连接里面，客户端可以同时发送多个请求。这样就进一步改进了 HTTP 协议的效率。

### http2

1. HTTP/2 则是一个彻底的二进制协议，头信息和数据体都是二进制
2. HTTP/2 复用 TCP 连接，在一个连接里，客户端可以同时发送多个请求或回应，而且不用按照顺序一一对应，这样就避免了"队头堵塞"
3. HTTP 协议不带有状态，每次请求都必须附上所有信息, HTTP/2 对这一点做了优化，引入了头信息压缩机制（header compression）

### http2 和 http1 区别

1. h1 数据传输可以是文本或者二进制; h2 使用 ssl 加密传输协议，只能传输二进制，可防止内容被窃听
2. h1,h2 都复用 TCP 链接，一个链接可同时发送多个请求，但 h2 不用按顺序一一对应，避免队头阻塞
3. 完全不同的连接方式，端口也不一样，h1 是 80，h2 是 443
4. h2 是基于 ssl + http 协议构成，可进行加密、身份认证，比 h1 安全

## Event Loop 是什么

`Event loop` 是一个执行模型，浏览器和 NodeJS 基于不同的技术实现了各自的 `Event Loop`

- 宏队列

一些异步任务的回调会依次进入宏队列(`macro task queue`)，等待后续被调用，这些异步任务包括：

1. setTimeout
2. setInterval
3. requestAnimationFrame (浏览器独有)
4. setImmediate (Node 独有)

- 微队列

一些异步任务的回调会依次进入微队列, 这些异步任务包括：

1. Promise
2. process.nextTick (Node 独有)

**浏览器的 Event Loop**

1. 执行全局 Script 同步代码，遇到异步回调,就会放在宏队列或者微队列中

2. 从微队列取出位于队首的任务，放入调用栈 Stack 中执行，执行完后微队列长度减 1

3. 继续执行微队的任务，直到直到把微队列所有任务都执行完毕。
   <font color="red">(注意: 如果在执行过程中，又产生了微任务，那么会加入到队列的末尾，也会在这个周期被调用执行)</font>

4. 从宏队列取出位于队首的任务，放入调用栈 Stack 中执行，执行完后宏队列长度减 1
   <font color="red">(注意: 执行完成后, 会先看看是否有微任务, 有会先执行微任务)</font>

5. 重复第 2-4 个步骤
