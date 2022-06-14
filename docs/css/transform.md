# transform

通过使用 CSS transform 属性，您可以利用以下 2D 转换方法：

- translate()
- rotate()
- scaleX()
- scaleY()
- scale()
- skewX()
- skewY()
- skew()
- matrix()

## 位移 translate

1. `transform: translate(50px, 100px)`
2. `transform: translateX(50px)`
3. `transform: translateY(50px)`

## 旋转 rotate

1. 顺时针旋转 20 度：`transform: rotate(20deg);`
2. 逆时针旋转 20 度：`transform: rotate(-20deg);`

## 缩放 scale

1. 缩小一般：`transform: scale(0.5, 0.5);`
2. 原始宽度的一半: `transform: scaleX(0.5);`
3. 原始高度的一半: `transform: scaleY(0.5);`

## 倾斜 skew

1. X 轴倾斜 20 度: `transform: skewX(20deg);`
2. Y 轴倾斜 20 度: `transform: skewY(20deg);`
3. X 轴倾斜 20 度，同时沿 Y 轴倾斜 10 度：`transform: skew(20deg, 10deg);`
