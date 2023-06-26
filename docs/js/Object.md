# Object

下面列出 Object 对象上的方法

## defineProperty

es5 可以通过 Object.defineProperty 来设置对象自身某个 property 的属性语法:

`Object.defineProperty(object, propertyname, descriptor)`

- object： 待修改的对象
- propertyname： 属性名
- descriptor：

```javascript
{
  configurable: false, // 是否可以删除属性,是否可以修改属性的 writable 、 enumerable 、 configurable 属性。
  enumerable: false,   // 是否可以枚举 (for...in, Object.keys 等只能遍历可枚举属性)
  writable: false,     // 是否可以对属性进行重新赋值
  value: null,         // 属性的值
  set: undefined,      // 属性被赋值时,此方法被自动调用
  get: undefined,      // 属性被读取时,此方法被自动调用
}
```

## constructor

`Object.prototype.constructor`返回创建该对象的构造函数

```javascript
var arr = [];
arr.constructor == function Array() { [native code] }
var str = "";
str .constructor == function String() { [native code] }
```

## hasOwnProperty

`Object.prototype.hasOwnProperty` 能判断一个对象是否包含自定义属性而不是原型链上的属性，hasOwnProperty 是 JavaScript 中唯一一个处理属性但是不查找原型链的函数

```javascript
Object.prototype.bar = 1;
var foo = { goo: undefined };
"bar" in foo; // true
foo.hasOwnProperty("bar"); // false
foo.hasOwnProperty("goo"); // true
```

## isPrototypeOf

语法： `object2.prototype.isPrototypeOf(object1)`, 判断指定对象 object1 是否存在于另一个对象 object2 的原型链中，是则返回 true，否则返回 false。

```javascript
var re = /^\s*/;
RegExp.prototype.isPrototypeOf(re); // true

var a = [];
Array.prototype.isPrototypeOf(a); // true
Object.prototype.isPrototypeOf(a); // true
```

## propertyIsEnumerable

`Object.prototype.propertyIsEnumerable`

如果 key 存在于 object 中，且可以使用 for 循环对其进行枚举，则 propertyIsEnumerable 方法返回 true。

如果 object 不具有所指定名称的属性或者所指定的属性是不可枚举的，则 propertyIsEnumerable 方法将返回 false。

通常，预定义的属性是不可枚举的，而用户定义的属性始终是可枚举的, propertyIsEnumerable 方法不考虑原型链中的对象。

```javascript
Object.prototype.name = "lcr";
var a = { age: 18 };
for (let k in a) {
  console.log(k); // age name
}
a.propertyIsEnumerable("age"); // true
a.propertyIsEnumerable("name"); // false
```

## Object.create

Object.create() 静态方法以一个现有对象作为原型，创建一个新对象。

```javascript
const person = {
  isHuman: false,
  print: () => console.log(`${this.name} ${this.isHuman}`),
};

const me = Object.create(person);
me.name = "Matthew";
me.isHuman = true;

// Matthew true
me.print();
```

## Object.is

比较两个值是否严格相等，与严格比较运算符（===）的行为基本一致 ，不同之处只有两个：一是+0 不等于-0，二是 NaN 等于自身。

```javascript
Object.is(+0, -0); // false
Object.is(NaN, NaN); // true
```

## Object.isExtensible

Object.isExtensible() 静态方法判断一个对象是否是可扩展的（是否可以在它上面添加新的属性） `Object.isExtensible(obj)` obj 要检查的对象。

可以使用 Object.preventExtensions()、Object.seal()、Object.freeze() 或 Reflect.preventExtensions() 中的任一方法将对象标记为不可扩展

```javascript
const object1 = {};

// true
console.log(Object.isExtensible(object1));

// 新对象是可拓展的。
const empty = {};
Object.isExtensible(empty); // true

// 它们可以变为不可拓展的
Object.preventExtensions(empty);
Object.isExtensible(empty); // false

// 根据定义，密封对象是不可拓展的。
const sealed = Object.seal({});
Object.isExtensible(sealed); // false

// 根据定义，冻结对象同样也是不可拓展的。
const frozen = Object.freeze({});
Object.isExtensible(frozen); // false
```

## Object.assign

用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target）, 合并策略如下：

1. 目标对象与源对象有同名属性，或多个源对象有同名属性，则后面的属性会覆盖前面的属性
2. 只拷贝源对象的自身属性（不拷贝继承属性），也不拷贝不可枚举的属性（enumerable: false）
3. 实行的是浅拷贝，而不是深拷贝。也就是说，如果源对象某个属性的值是对象，那么目标对象拷贝得到的是这个对象的引用

## Object.getOwnPropertyDescriptor

获取该对象的描述对象

```javascript
let obj = { foo: 123 };
Object.getOwnPropertyDescriptor(obj, "foo");
/*
  {
  　　value: 123,
  　　writable: true,
  　　enumerable: true,
  　　configurable: true
  }
*/
```

## Object.values

`Object.values` 方法返回一个数组，成员是参数对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的值

## Object.entries

`Object.entries` 方法返回一个数组，成员是参数对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键值对数组

## Object.keys

`Object.keys` 返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）

## Object.getOwnPropertyNames

`Object.getOwnPropertyNames` 和 `Object.keys` 一样， 返回一个数组，包含对象自身的所有属性（不含 Symbol 属性），但是包括不可枚举属性

## 其他

- `Object.getOwnPropertySymbols(obj)` 返回一个数组，包含对象自身的所有 Symbol 属性。

- `Reflect.ownKeys(obj)` 返回一个数组，包含对象自身的所有属性，不管是属性名是 Symbol 或字符串，也不管是否可枚举。

- `Object.setPrototypeOf(obj)` 与\_\_proto\_\_相同，用来设置一个对象的 prototype 对象,它是 ES6 正式推荐的设置原型对象的方法

- `Object.getPrototypeOf(obj)` 该方法与 Object.setPrototypeOf 方法配套，用于读取一个对象的原型对象

## 总结

ES5 有三个操作会忽略 enumerable 为 false 的属性

```javascript
var a = { age: 18 };
Object.defineProperty(a, "address", {
  value: 666,
  writable: true,
  enumerable: false,
  configurable: true,
});
Object.prototype.name = "lcr";

// for...in循环：只遍历对象自身的和继承的可枚举的属性 => age name
for (let k in a) console.log(k);

// [18]
Object.values(a);

// [['age', 18]]
Object.entries(a);

// 返回对象自身的所有可枚举的属性(不含继承的)的键名 => ['age']
Object.keys(a);

// 返回对象自身的所有属性(不含继承的)的键名 => ['age', 'address']
Object.getOwnPropertyNames(a);

// 只串行化对象自身的可枚举的属性 => '{"age":18}'
JSON.stringify(a);
```
