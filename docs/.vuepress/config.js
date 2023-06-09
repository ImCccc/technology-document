const sidebar = {
  "/gongchenghua/": [
    "/gongchenghua/vite.md",
    "/gongchenghua/webpack.md",
    "/gongchenghua/admin.md",
    "/gongchenghua/sso.md",
    "/gongchenghua/cli.md",
    "/gongchenghua/openapi.md",
    "/gongchenghua/eslint.md",
    "/gongchenghua/nextjs.md",
    "/gongchenghua/小程序.md",
    "/gongchenghua/低代码.md",
    "/gongchenghua/taro.md",
    "/gongchenghua/electron.md",
  ],
  "/mianshi/": [
    "/mianshi/",
    "/mianshi/mianshi-react.md",
    "/mianshi/mianshi-vue.md",
    "/mianshi/mianshi-cssHtml.md",
  ],
  "/tool/": [
    "/tool/vscode.md",
    "/tool/",
    "/tool/yarn.md",
    "/tool/RegExp.md",
    "/tool/github.md",
    "/tool/typescript.md",
  ],
  "/vue/": [
    "/vue/",
    "/vue/slot.md",
    "/vue/event.md",
    "/vue/props.md",
    "/vue/setup.md",
    "/vue/ClassStyle.md",
    "/vue/ProvideInject.md",
    "/vue/directive.md",
    "/vue/element-plus.md",
  ],
  "/react/": [
    "/react/",
    "/react/mobx.md",
    "/react/react-router-dom.md",
    "/react/hooks.md",
    "/react/ahooks.md",
    "/react/AntDesignPro.md",
  ],
  "/css/": [
    "/css/",
    "/css/less.md",
    "/css/sass.md",
    "/css/flex.md",
    "/css/css-module.md",
    "/css/animation.md",
    "/css/selector.md",
    "/css/tailwindcss.md",
    "/css/transform.md",
    "/css/background.md",
  ],
  "/js/": [
    "/js/event.md",
    "/js/node.md",
    "/js/element.md",
    "/js/document.md",
    "/js/nodeList.md",
    "/js/htmlCollection.md",
    "/js/request.md",
    "/js/",
  ],
  "/nodejs/": ["/nodejs/", "/nodejs/package.md"],
  "/other/": [
    "/other/",
    "/other/api.md",
    "/other/suanfa.md",
    "/other/package.md",
    "/other/GraphQL.md",
    "/other/wavesurfer.md",
  ],
};

module.exports = {
  // 配置插件  plugins: ["demo-container"],
  title: "前端文档",
  base: "/",
  port: "8880",
  evergreen: true,
  themeConfig: {
    sidebar,
    head: [],
    markdown: {},
    sidebarDepth: 2,
    nav: [
      { text: "前端工程化", link: "/gongchenghua/vite.md" },
      { text: "工具", link: "/tool/" },
      { text: "vue", link: "/vue/" },
      { text: "react", link: "/react/" },
      { text: "javascript", link: "/js/" },
      { text: "css", link: "/css/" },
      { text: "nodejs", link: "/nodejs/" },
      { text: "面试", link: "/mianshi/" },
      { text: "其他", link: "/other/" },
    ],
  },
};
