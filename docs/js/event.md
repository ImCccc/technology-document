# Event

[Event](https://developer.mozilla.org/zh-CN/docs/Web/API/Event) 接口表示在 DOM 中出现的事件。有许多不同类型的事件，其中一些使用基于 Event 主接口的二次接口。Event 本身包含适用于所有事件的属性和方法。

- 事件触发的类型：

1. 用户触发的，例如鼠标或键盘事件；
2. API 生成，例如指示动画已经完成运行的事件，视频已被暂停等等
3. 脚本代码触发，例如对元素调用 `HTMLElement.click()` 方法
4. 自定义事件，使用 `EventTarget.dispatchEvent()` 方法将自定义事件派发往指定的目标（target）

## `Event.bubbles`

一个布尔值，用来表示该事件是否会在 DOM 中冒泡。

## `Event.cancelable`

一个布尔值，表示事件是否可以取消。

## `Event.currentTarget`

- 当事件沿着 DOM 触发时事件的当前目标。

- 它总是指向事件绑定的元素，而 `Event.target` 则是事件触发的元素。

## `Event.target`

触发事件的对象 (某个 DOM 元素) 的引用。它与 `event.currentTarget` 不同。

## `Event.defaultPrevented`

一个布尔值，表示 event.preventDefault() 方法是否取消了事件的默认行为。

## `Event.type`

只读属性 Event.type 会返回一个字符串，表示该事件对象的事件类型。例子：`click`

## `Event.isTrusted`

只读属性，当事件是由用户行为生成的时候，这个属性的值为 `true` ，而当事件是由脚本创建、修改、通过 EventTarget.dispatchEvent() 派发的时候，这个属性的值为 `false`

## `event.preventDefault()`

是否取消默认默认的动作

## `event.stopPropagation()`

1. 阻止捕获和冒泡阶段中当前事件的进一步传播

2. 不能防止任何默认行为的发生，如果要停，调用`preventDefault()`

3. 不能阻止附加到相同元素的相同事件类型的其它事件处理器，如果要阻止，调用`stopImmediatePropagation() `

## `event.stopImmediatePropagation()`

阻止监听同一事件的其他事件监听器被调用，如果多个事件监听器被附加到相同元素的相同事件类型上，当此事件触发时，它们会按其被添加的顺序被调用。如果在其中一个事件监听器中执行 `stopImmediatePropagation()` ，那么剩下的事件监听器都不会被调用。
