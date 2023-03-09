# 单点登录

如果有很多个子系统, 但它们是同一套权限, 那么最佳实现应该是所有子系统一个登录入口,登录完成跳回子系统,关键代码如下:

1. 子系统代码

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>子系统</title>
  </head>
  <style>
    button {
      padding: 10px 0;
      margin: 10px;
      width: 120px;
    }
  </style>

  <body>
    <div class="main">
      <h1>子系统</h1>
      <button onclick="login()">跳转登录</button>
      <button onclick="getToken()">获取token</button>
      <button onclick="clearLocalStorage()">清缓存</button>
    </div>
  </body>

  <script>
    function login() {
      location.href = `http://127.0.0.1:5501/index.html?redirect=http://${location.host}`;
    }

    function clearLocalStorage() {
      localStorage.clear();
    }

    function getToken() {
      console.log(localStorage.getItem("token"));
      return localStorage.getItem("token");
    }

    window.addEventListener("message", function (e) {
      console.log("子系统收到消息了", e);
      localStorage.setItem("token", e.data);
    });
  </script>
</html>
```

2. 登录界面代码

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>单点登录界面</title>
  </head>
  <style>
    button {
      padding: 10px 30px;
    }
  </style>

  <body>
    <div class="main">
      <h1>单点登录界面</h1>
      <button onclick="login()">登录</button>
    </div>
  </body>

  <script>
    var iframeWindow;
    var redirectUrl = getRedirect();

    // 获取子系统地址
    function getRedirect() {
      var params = new URLSearchParams(location.search) || {};
      return params.get("redirect");
    }

    // 新建iframe,用于跨域通讯
    function getLoginIframe() {
      var iframe = document.createElement("iframe");
      iframe.setAttribute("src", redirectUrl);
      iframe.setAttribute("onload", "iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);
      iframe.onload = () => {
        iframeWindow = iframe.contentWindow;
      };
    }

    // 登录后， 发送token给子系统, 子系统会放到自己的localStorage中
    function login() {
      iframeWindow.postMessage(
        JSON.stringify({
          token: "token:" + new Date().valueOf(),
          refreshToken: "refreshToken:" + new Date().valueOf(),
        }),
        redirectUrl
      );
      location.href = redirectUrl;
    }

    getLoginIframe();
  </script>
</html>
```
