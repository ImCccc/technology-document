# [HTMLCollection](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCollection)

HTMLCollection 接口表示一个包含了元素（元素顺序为文档流中的顺序）的通用集合，还提供了用来从该集合中选择元素的方法和属性。<font color="red">HTMLCollection 不是数组，不能使用 map , filter 等等 api</font>

## `Array.from(HTMLCollection)`

> 转数组

## `HTMLCollection.length`

> 返回元素的数目

## `HTMLCollection.item()`

> 根据给定的索引（从 0 开始），返回具体的节点。如果索引超出了范围，则返回 null。
>
> 访问 collection[i]（在索引 i 超出范围时会返回 undefined）的替代方法。

## `HTMLCollection.namedItem()`

> 根据 ID 返回指定节点，若不存在，则根据字符串所表示的 name 属性来匹配。不存在返回 null。
>
> 访问 collection[name]（在 name 不存在时会返回 undefined）的替代方法。
