# css 动画

## transition 过渡

如需创建过渡效果，必须明确两件事：

1. 添加效果的 CSS 属性
2. 效果的持续时间

- transition 简写属性，用于将四个过渡属性设置为单一属性
- transition-delay 规定过渡效果的延迟（以秒计）
- transition-duration 规定过渡效果要持续多少秒或毫秒
- transition-property 规定过渡效果所针对的 CSS 属性的名称(`all`代表全部)
- transition-timing-function 规定过渡效果的速度曲线

```css
div {
  width: 100px;
  height: 100px;
  background: red;
  transition: width 2s, height 4s;
}
div:hover {
  width: 300px;
}
```

**速度曲线 transition-timing-function**

`transition-timing-function` 属性规定过渡效果的速度曲线。可接受以下值：

- ease - 规定过渡效果，先缓慢地开始，然后加速，然后缓慢地结束（默认）
- linear - 规定从开始到结束具有相同速度的过渡效果
- ease-in -规定缓慢开始的过渡效果
- ease-out - 规定缓慢结束的过渡效果
- ease-in-out - 规定开始和结束较慢的过渡效果
- cubic-bezier(n,n,n,n) - 允许您在三次贝塞尔函数中定义自己的值

## animation 动画

### @keyframes

在 @keyframes 规则中指定了 CSS 样式，动画将在特定时间逐渐从当前样式更改为新样式。
要使动画生效，必须将动画绑定到某个元素。

```css
/* 动画代码1 */
@keyframes example1 {
  from {
    background-color: red;
  }
  to {
    background-color: yellow;
  }
}

/* 动画代码2 */
@keyframes example2 {
  0% {
    background-color: red;
  }
  50% {
    background-color: blue;
  }
  100% {
    background-color: red;
  }
}

/* 使用动画的元素上的样式 */
.animation1 {
  width: 100px;
  height: 100px;
  color: red;
  animation-name: example2;
  animation-duration: 4s;
}
```

### 动画时长 animation-duration

4 秒完成： `animation-duration: 4s`（默认 0s）

### 动画延迟 animation-delay

2 秒的延迟：`animation-delay: 2s`

### 运行次数 animation-iteration-count

3 次： `animation-iteration-count: 3`

### 永远执行 infinite

永远执行：`animation-iteration-count: infinite`

### 反向或交替运行 animation-direction

animation-direction 属性指定是向前播放、向后播放还是交替播放动画。可接受以下值：

- normal - 动画正常播放（向前）。默认值
- reverse - 动画以反方向播放（向后）
- alternate - 动画先向前播放，然后向后
- alternate-reverse - 动画先向后播放，然后向前

### 动画的速度曲线 animation-timing-function

animation-timing-function 属性可接受以下值：

- ease - 指定从慢速开始，然后加快，然后缓慢结束的动画（默认）
- linear - 规定从开始到结束的速度相同的动画
- ease-in - 规定慢速开始的动画
- ease-out - 规定慢速结束的动画
- ease-in-out - 指定开始和结束较慢的动画
- cubic-bezier(n,n,n,n) - 运行您在三次贝塞尔函数中定义自己的值

### animation-fill-mode

CSS 动画不会在第一个关键帧播放之前或在最后一个关键帧播放之后影响元素。animation-fill-mode 属性能够覆盖这种行为。animation-fill-mode 属性可接受以下值：

- none - 默认值。动画在执行之前或之后不会对元素应用任何样式。
- forwards - 元素将保留由最后一个关键帧设置的样式值
- backwards - 元素将获取由第一个关键帧设置的样式值，并在动画延迟期间保留该值。
- both - 动画会同时遵循向前和向后的规则，从而在两个方向上扩展动画属性。

### 动画简写属性

```css
div {
  animation-name: example;
  animation-delay: 2s;
  animation-duration: 5s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

/* 简写 */
div {
  animation: example 5s linear 2s infinite alternate;
}
```

### 例子：loading 加载中

```html
<img class="loading" src="xxx.png" / >
<style>
  .loading {
    width: 40px;
    animation: fadenum 1.5s linear infinite;
  }
  @keyframes fadenum {
    100% {
      transform: rotate(360deg);
    }
  }
</style>
```
