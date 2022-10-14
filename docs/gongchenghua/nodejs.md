# nodejs

## 在 node 环境使用 axios

```javascript
const axios = require("axios");
const axiosService = axios.create({
  timeout: 600000,
  baseURL: "https://ybstest.qxfoodom.com/api/",
});
axiosService.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";
axiosService.interceptors.response.use(
  (res) =>
    res.status === 200 ? Promise.resolve(res.data) : Promise.reject(res),
  (error) => Promise.reject(error.response)
);

const _request = (url, params, method) => {
  let getParams = {};
  let postParams = {};
  method = (method || "post").toLowerCase();
  if (method === "post") {
    postParams = params;
  } else {
    getParams = params;
  }
  return axiosService({
    url,
    method: method,
    data: postParams,
    params: getParams,
  }).then((rs) => rs);
};

_request("/xxx/aaa", { name: "lcr" }, "get").then((data) => {
  console.log("返回数据:", data);
});
```

## 判断是文件夹还是文件

- isFile() 和 isDirectory() 方法来判断是文件还是文件夹
- isFile() 方法可检测是否为常规文件，如果是则返回 true
- isDirectory()方法可检测是否为文件夹，如果是则返回 true

```javascript
const fs = require("fs");
const fileData = fs.statSync("文件路径");
fileData.isFile(); // 是否是文件
fileData.isDirectory(); // 是否是文件夹
```

## 判断文件是否存在

```js
const fs = require("fs");
fs.existsSync("文件地址"); // true 存在, false 不存在
```

## 文件的读写

2. 读取文件内容

```javascript
const fs = require("fs");
if (fs.existsSync("文件地址")) {
  const content = fs.readFileSync("文件地址", "utf-8");
}
```

3. 写入文件, 存在则覆盖

```javascript
const fs = require("fs");

fs.writeFileSync(
  "写入文件的地址",
  JSON.stringify({ name: "lcr" }, null, 2),
  "utf8"
);
```

- 例子: 下载音频后将音频放到本地目录

```javascript
const fs = require("fs");
const https = require("https");
https.get("https://minio.dev.inrobot.cloud/smzx/video/icescreen/1", (res) => {
  const file = fs.createWriteStream("C:Userslicr1Desktop\1.mp4");
  res.pipe(file);
  file.on("finish", () => {
    file.close();
    console.log("download success ....................");
  });
});
```

## 根据路径, 创建文件

### 创建文件夹 mkdirSync

`mkdirSync` 创建文件夹, 如果文件夹存在会报错 `file already exists`, 创建之前先去判断下是否存在

```javascript
const fs = require("fs");
if (fs.existsSync("../aaa")) return; // 判断文件夹是否存在
fs.mkdirSync("../aaa"); // 当前目录的上层目录创建文件夹aaa
```

- 例子: 传入文件路径, 如果没有文件夹,那么创建文件夹, 一层层创建, 直到创建文件为止

```javascript
const fs = require("fs");

const createFileByPath = function (filePath, data) {
  let dirCache = {};
  if (!fs.existsSync(filePath)) {
    const arr = filePath.split("/");
    let dir = arr[0];
    for (let i = 1; i < arr.length; i++) {
      if (!dirCache[dir] && !fs.existsSync(dir)) {
        dirCache[dir] = true;
        fs.mkdirSync(dir);
      }
      dir = dir + "/" + arr[i];
    }
    fs.writeFileSync(filePath, data);
  } else {
    fs.appendFile(filePath, data, function (err) {});
  }
};

createFileByPath("路径1/路径2/路径3/文件.txt", "文件内容");
```

## 删除文件

- 删除一个文件

  ```javascript
  const fs = require("fs");
  const filePath = "111/22/33/ttt.txt";
  fs.unlinkSync(filePath);
  ```

- 使用系统命令, 删除文件夹或文件

  1. 先安装 rimraf: `yarn add rimraf -D`

  2. 代码逻辑

  ```javascript
  const exec = require("child_process").exec;
  exec("rimraf 文件或文件夹路径", (err) => {
    if (err) return console.log("delete error:", err);
    console.log("delete success..........");
  });
  ```

- 使用 node 提供的 api 递归删除文件夹

  ```javascript
  const fs = require("fs");
  function deleteAll(path) {
    const fileData = fs.statSync(path);
    if (!fileData.isDirectory()) return fs.unlinkSync(path); // 如果是文件, 直接删除
    let files = [];
    if (fs.existsSync(path)) {
      files = fs.readdirSync(path);
      files.forEach(function (file, index) {
        let curPath = path + "/" + file;
        if (fs.statSync(curPath).isDirectory()) {
          deleteAll(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  }
  deleteAll("111/22");
  ```

## 路径相关

### `process.cwd()`

process.cwd() 是用于获取当前当前终端的目录, 看下面例子:

`C:\Users\licr1\Desktop\test\folder2\index.js`:

```javascript
function testCwd() {
  const cwd = process.cwd();
  console.log("cwd: ", cwd);
}
module.exports = { testCwd };
```

`C:\Users\licr1\Desktop\test\folder1\index.js`:

```javascript
const { testCwd } = require("../folder2/index");
testCwd();
```

如果在 `folder1` 打开终端, 执行 `node index.js` 那么 `process.cwd()` 就是 <font color="red">当前终端的目录</font>, 即使调用的是其他文件夹的方法:

```
PS C:\Users\licr1\Desktop\test\folder1> node .\index.js
cwd:  C:\Users\licr1\Desktop\test\folder1
```

### `__dirname`

`__dirname` 代表<font color="red">当前执行文件的所在目录</font>, 还是上面的例子:

```javascript
// C:\Users\licr1\Desktop\test\folder2\index.js:
function testCwd() {
  const cwd = process.cwd();
  console.log("folder2 cwd:", cwd);
  console.log("folder2 __dirname:", __dirname);
}
module.exports = { testCwd };

// `C:\Users\licr1\Desktop\test\folder1\index.js`:
const cwd = process.cwd();
console.log("folder1 cwd:", cwd);
console.log("folder1 __dirname:", __dirname);

const { testCwd } = require("../folder2/index");
testCwd();
```

终端执行:

```
PS C:\Users\licr1\Desktop\test\folder1> node .\index.js
folder1 cwd: C:\Users\licr1\Desktop\test\folder1
folder1 __dirname: C:\Users\licr1\Desktop\test\folder1
folder2 cwd: C:\Users\licr1\Desktop\test\folder1
folder2 __dirname: C:\Users\licr1\Desktop\test\folder2
```

### `path.join()`

将多个参数组合成一个 path

例子: 在 `C:\Users\licr`下有文件 `index.js` 内容如下, 在该文件夹下启动终端执行 `node index.js`:

```javascript
const cwd = process.cwd();
const join = require("path").join;

join(cwd, "1", "2/3", "/4/"); // C:\Users\licr\1\2\3\4\

join(cwd, "1", "2\\3", "/4/"); // // C:\Users\licr\1\2\3\4\

join(cwd, "1", "2/3", "/4"); // C:\Users\licr\1\2\3\4

join(cwd, "1", "2/3", ".."); // C:\Users\licr\1\2

join(cwd, "1", "2///3///", "../../"); // C:\Users\licr\1\

join(cwd, "1", "2/3", "../.."); // C:\Users\licr\1
```
