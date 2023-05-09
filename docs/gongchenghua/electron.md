# electron

桌面应用 electron: <https://www.electronjs.org/zh/docs/latest/api/browser-window>

## 常见的问题

下面列出开发过程中, 常见的问题

### 获取当前系统

```ts
type Platform =
  | "aix"
  | "android"
  | "darwin"
  | "freebsd"
  | "haiku"
  | "linux"
  | "openbsd"
  | "sunos"
  | "win32"
  | "cygwin"
  | "netbsd";
const platform: Platform = process.platform;
```

### 是否开发环境

```tsx
const { app } = require("electron");
// 是否开发环境
const isDev = !app.isPackaged;
```

### 通讯方式

1. 主线程向浏览器通讯

```tsx
// 主线程 main.js
const { BrowserWindow } = require("electron");
win = new BrowserWindow({
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
  },
});
win.webContents.send("eventName", { name: 123 });

// 浏览器 index.js
const { ipcRenderer } = window.require("electron");
ipcRenderer.on("eventName", (_, data) => {
  console.log(data); // { name: 123 }
});
```

2. 浏览器向主线程发通讯 - 异步

```tsx
// 浏览器 index.js
const { ipcRenderer } = window.require("electron");
ipcRenderer.send("evenName", { name: 123 });

// 主线程 main.js
const { ipcMain } = require("electron");
ipcMain.on("evenName", (event, data) => {
  console.log(data); // { name: 123 }
});
```

3. 浏览器向主线程发通讯 - 同步

```tsx
// 浏览器 index.js
const { ipcRenderer } = window.require("electron");
const returnData = ipcRenderer.sendSync("evenName", { name: 123 });
console.log(returnData); // 浏览器收到回复, 这个过程阻塞进程, 'success'

// 主线程 main.js
const { ipcMain } = require("electron");
ipcMain.on("even-name", (event, data) => {
  console.log(data); // { name: 123 }
  event.returnValue = "success";
});
```

### 自动更新

```tsx
const { app } = require("electron");
const { NsisUpdater, AppImageUpdater } = require("electron-updater");


function updateVersion() {
  const updaterOptions = {
    provider: "generic",
    url: REQUEST_URL.updaterUrl,
  };

  let autoUpdater = new NsisUpdater(updaterOptions);

  if (process.platform; === "linux") {
    autoUpdater = new AppImageUpdater(updaterOptions);
  }

  return new Promise((resolve) => {
    // 当有可用更新的时候触发, 更新将自动下载
    autoUpdater.on("update-available", (info) => {
      resolve(true);
    });

    // 下载进度
    autoUpdater.on("download-progress", (progress) => {
      win.webContents.send("download-progress", progress);
    });

    // 在更新下载完成的时候触发
    autoUpdater.on("update-downloaded", (info) => {
      autoUpdater.quitAndInstall(false, true);
    });

    // 当没有可用更新的时候触发
    autoUpdater.on("update-not-available", (info) => {
      resolve(false);
    });

    // 更新失败
    autoUpdater.on("error", (error) => {
      console.error(error);
      resolve(false);
    });

    // 自动更新
    autoUpdater.checkForUpdatesAndNotify();
  });

  // 初始化后 调用函数
  app.on("ready", async () => {
    const hasUpdate = await updateVersion();
    console.log(hasUpdate)
  });
}
```

### 添加本地日志

<https://github.com/megahertz/electron-log/>

```tsx
// ./src/main/log.js
const fs = require("fs");
const join = require("path").join;
const logger = require("electron-log");

const BASE_PATH = join(env.USERPROFILE || env.PWD, "/electron-data");
const LOG_PATH = join(BASE_PATH, "/logs");

function formatNumber(n) {
  const s = n.toString();
  return s[1] ? s : "0" + s;
}

function _getName() {
  const date = new Date();
  return `${date.getFullYear()}-${formatNumber(
    date.getMonth() + 1
  )}-${formatNumber(date.getDate())}.log`;
}

logger.transports.file.level = "debug";
// 最大10M
logger.transports.file.maxSize = 10 * 1024 * 1024;
// 设置文件内容格式
logger.transports.file.format = "{h}:{i}:{s} [{level}]:{text}";
// 指定日志文件夹位置
logger.transports.file.resolvePath = () => join(LOG_PATH, _getName());

// 保留10天日志
function deleteLog(n = 10) {
  const currDate = new Date();
  const date = new Date(currDate.getTime() - n * 24 * 60 * 60 * 1000);
  const year = date.getFullYear() + "";
  const month = formatNumber(date.getMonth() + 1);
  const day = formatNumber(date.getDate());
  const beforeDate = +(year + month + day); // 10 天前
  fs.readdir(LOG_PATH, (_, files) => {
    files.forEach((filename) => {
      if (!filename.includes(".log")) return;
      const arr = filename.replace(".log", "").split("-");
      if (arr.length !== 3) return;
      const thisDate = +(arr[0] + formatNumber(arr[1]) + formatNumber(arr[2]));
      if (thisDate > beforeDate) return;
      const deletePath = join(LOG_PATH, filename);
      if (fs.existsSync(deletePath)) fs.unlinkSync(deletePath);
    });
  });
}

module.exports = { deleteLog, logger };
```

```tsx
// main.js
const { logger, deleteLog } = require("./src/main/log.js");

// 初始化后 调用函数
app.on("ready", async () => {
  logger.info(`基本信息`);
  logger.error(`错误信息`);
  deleteLog(); // 删除10天前的日志
});
```
