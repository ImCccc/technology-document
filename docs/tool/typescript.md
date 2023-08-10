# typescript

官网：<https://www.tslang.cn/>

教程: <https://wangdoc.com/typescript/any>

TypeScript 是一种由微软开发的开源的编程语言，它是 JavaScript 的一个超集，扩展了 JavaScript 的语法

安装：

```
npm install -g typescript
```

使用：

```
tsc greeter.ts
```

## ts 数据类型

JavaScript 语言（注意，不是 TypeScript）将值分成 8 种类型。

1. boolean
2. string
3. number
4. bigint
5. symbol
6. object
7. undefined
8. null

TypeScript 继承了 JavaScript 的类型设计，以上 8 种类型可以看作 TypeScript 的基本类型。
undefined 和 null 既可以作为值，也可以作为类型，取决于在哪里使用它们;

### 布尔值，字符串，数字

```javascript
// 布尔值
let isDone: boolean = false;
// 字符串
let name: string = "bob";
// 数字
let decLiteral: number = 6;
let octalLiteral: number = 0o744;
```

#### 包装对象

JavaScript 的 8 种类型之中，undefined 和 null 其实是两个特殊值，object 属于复合类型，剩下的五种属于原始类型，代表最基本的、不可再分的值。

`boolean,string,number,bigint,symbol` 这五种原始类型的值，都有对应的包装对象。所谓“包装对象”，指的是这些值在需要时，会自动产生的对象。

`'hello'.charAt(1)`: 字符串 hello 执行了 charAt()方法。但在 JavaScript 语言中，只有对象才有方法，原始类型的值本身没有方法。这行代码之所以可以运行，就是因为在调用方法时，字符串会自动转为包装对象，charAt()方法其实是定义在包装对象上。

五种包装对象之中， `symbol` 类型和 `bigint` 类型无法直接获取它们的包装对象（即 Symbol()和 BigInt()不能作为构造函数使用），但是剩下三种可以。

- Boolean()
- String()
- Number()

```javascript
const s = new String("hello");
typeof s; // 'object'
s.charAt(1); // 'e'
```

#### 包装对象类型与字面量类型

TypeScript 对五种原始类型分别提供了大写和小写两种类型。

- Boolean 和 boolean
- String 和 string
- Number 和 number
- BigInt 和 bigint
- Symbol 和 symbol

其中，大写类型同时包含包装对象和字面量两种情况，小写类型只包含字面量，不包含包装对象。

```javascript
const s1: String = "hello"; // 正确
const s2: String = new String("hello"); // 正确

const s3: string = "hello"; // 正确
const s4: string = new String("hello"); // 报错
```

::: tip
建议只使用小写类型，不使用大写类型。因为绝大部分使用原始类型的场合，都是使用字面量，不使用包装对象。
而且，TypeScript 把很多内置方法的参数，定义成小写类型，使用大写类型会报错。
:::

### 枚举

```javascript
// 默认情况下，从0开始为元素编号
enum Color {Red, Green, Blue}
let c: Color = Color.Green;

// 全部手动赋值
enum Color {Red = 1, Green = 2, Blue = 4}
let c: Color = Color.Green;

// 枚举类型提供的一个便利是你可以由枚举的值得到它的名字。
enum Color {Red = 1, Green, Blue}
let colorName: string = Color[2]; // 'Green'
```

### any

any 类型表示没有任何限制，该类型的变量可以赋予任意类型的值。变量类型一旦设为 any，TypeScript 实际上会关闭这个变量的类型检查。即使有明显的类型错误，只要句法正确，都不会报错。尽量避免使用 any 类型，否则就失去了使用 TypeScript 的意义。

1. 对于开发者没有指定类型、TypeScript 必须自己推断类型的那些变量，如果无法推断出类型，TypeScript 就会认为该变量的类型是 any。

```javascript
function add(x, y) {
  return x + y;
}
add(1, [1, 2, 3]); // 不报错
```

2. any 类型除了关闭类型检查，还有一个很大的问题，就是它会“污染”其他变量。它可以赋值给其他任何类型的变量（因为没有类型检查），导致其他变量出错。

```javascript
let x: any = "hello";
let y: number;
y = x; // 不报错
y * 123; // 不报错
y.toFixed(); // 不报错
```

### unknown

1. 跟 any 的相似之处，在于所有类型的值都可以分配给 unknown 类型;
2. unknown 类型跟 any 类型的不同之处在于，它不能直接使用

   > 首先，unknown 类型的变量，不能直接赋值给其他类型的变量（除了 any 类型和 unknown 类型）。
   >
   > 其次，不能直接调用 unknown 类型变量的方法和属性。
   >
   > 再次，unknown 类型变量能够进行的运算是有限的，只能进行比较运算（运算符==、===、!=、!==、||、&&、?）、取反运算（运算符!）、typeof 运算符和 instanceof 运算符这几种，其他运算都会报错。

   ```javascript
   let v: unknown = 123;
   let v1: boolean = v; // 报错
   let v2: number = v; // 报错

   let v1: unknown = { foo: 123 };
   v1.foo; // 报错

   let v2: unknown = "hello";
   v2.trim(); // 报错

   let v3: unknown = (n = 0) => n + 1;
   v3(); // 报错
   ```

3. 怎么才能使用 unknown 类型变量呢？“类型缩小”，unknown 类型变量才可以使用。

   ```javascript
   let a: unknown = 1;
   if (typeof a === "number") {
     let r = a + 10; // 正确
   }

   let s: unknown = "hello";
   if (typeof s === "string") {
     s.length; // 正确
   }
   ```

::: tip 总结:
unknown 可以看作是更安全的 any。一般来说，凡是需要设为 any 类型的地方，通常都应该优先考虑设为 unknown 类型。
:::

### undefined 和 null

```javascript
let u: undefined = undefined;
let n: null = null;
```

> 默认情况下 null 和 undefined 是所有类型的子类型。 就是说你可以把 null 和 undefined 赋值给 number 类型的变量。

### 类型断言

- <尖括号>

```javascript
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;
```

- as(JSX 只支持 as)

```javascript
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;
```

### 函数

函数的类型声明，需要在声明函数时，给出参数的类型和返回值的类型。

```javascript
// void 类型表示没有返回值
function hello(txt: string): void {
  console.log("hello " + txt);
}

/* 变量被赋值为一个函数，变量的类型有两种写法。 */

// 写法一
const hello = function (txt: string): string {
  return txt;
};

// 写法二
const hello: (txt: string) => void = function (txt) {
  console.log("hello " + txt);
};
```

#### 箭头函数

```javascript
const repeat = (str: string, times: number): string => {
  str.repeat(times);
};

function greet(fn: (a: string) => void): void {
  fn("world");
}

type Person = { name: string };
const people = ["alice", "bob", "jan"].map((name): Person => ({ name }));
```

#### 参数解构

```javascript
function f([x, y]: [number, number]) {
  // ...
}

function sum({ a, b, c }: { a: number, b: number, c: number }) {
  console.log(a + b + c);
}

// 代码会看起来简洁一些
type ABC = { a: number, b: number, c: number };
function sum({ a, b, c }: ABC) {
  console.log(a + b + c);
}

// rest 参数为数组
function joinNumbers(...nums: number[]) {
  // ...
}

// rest 参数为元组
function f(...args: [boolean, number]) {
  // ...
}

function f(...args:[boolean, ...string[]]) {
  // ...
}

function multiply(n: number, ...m: number[]) {
  return m.map((x) => n * x);
}

// 等同于下面写法
function repeat(...[str, times]: [string, number]): string {
  return str.repeat(times);
}
function repeat(str: string, times: number): string {
  return str.repeat(times);
}
```

### Object

表示非原始类型，也就是除 number，string，boolean，symbol，null 或 undefined 之外的类型

```javascript
const obj: {
  x: number,
  y: number,
  add(x: number, y: number): number,
  // 或者写成
  add1: (x: number, y: number) => number,
} = {
  x: 1,
  y: 1,
  add: (x, y) => x + y,
};
```

#### 方括号读取属性的类型

```ts
type User = {
  name: string;
  age: number;
};
type Name = User["name"]; // string
```

#### 继承的属性

TypeScript 不区分对象自身的属性和继承的属性，一律视为对象的属性。

```ts
interface MyInterface {
  toString(): string; // 继承的属性
  prop: number; // 自身的属性
}

// obj只写了prop属性，但是不报错。因为它可以继承原型上面的toString()方法
const obj: MyInterface = { prop: 123 };
```

#### 属性名的索引类型

JavaScript 对象的属性名（即上例的 property）的类型有三种可能， `string` ，还有 `number` 和 `symbol` 。

```ts
// 数值索引不能与字符串索引发生冲突，必须服从后者，这是因为在 JavaScript 语言内部，所有的数值属性名都会自动转为字符串属性名。
type MyType = {
  [x: number]: boolean; // 报错
  [x: string]: string;
};

// 单个属性名符合属性名索引的范围，两者不能有冲突，否则报错。
type MyType = {
  foo: boolean; // 报错
  [x: string]: string;
};
```

#### 对象解构

```ts
const { id, name }: { id: string; name: string } = product;
```

目前没法为解构变量指定类型，因为对象解构里面的冒号，JavaScript 指定了其他用途。

```ts
let { x: foo, y: bar } = obj;
// 等同于
let foo = obj.x;
let bar = obj.y;

// 冒号不是表示属性 x 和 y 的类型，而是为这两个属性指定新的变量名。
// 如果要为 x 和 y 指定类型，不得不写成下面这样。
let { x: foo, y: bar }: { x: string; y: number } = obj;

// 下面报错原因是因为： TypeScript 就会解读成，函数体内不存在变量shape，而是属性 shape 的值被赋值给了变量 Shape。
function draw({ shape: Shape, xPos: number = 100 }) {
  let myShape = shape; // 报错
  let x = xPos; // 报错
}
```

#### 严格字面量检查

```ts
// 触发严格字面量检查，只要有类型声明中不存在的属性（本例是z），就会导致报错。
const point: { x: number } = {
  x: 1,
  z: 1, // 报错
};

// 不会触发严格字面量检查
const myPoint = { x: 1, z: 1 };
const point: { x: number } = myPoint; // 正确
```

TypeScript 对字面量进行严格检查的目的，主要是防止拼写错误。一般来说，字面量大多数来自手写，容易出现拼写错误，或者误用 API。编译器选项 suppressExcessPropertyErrors，可以关闭多余属性检查。下面是它在 tsconfig.json 文件里面的写法。

```tsx
{
  "compilerOptions": {
    "suppressExcessPropertyErrors": true
  }
}
```

#### 最小可选属性规则

如果一个对象的所有属性都是可选的，会触发最小可选属性规则。

```tsx
type Options = { a?: number; b?: number };
// 报错
const obj: Options = { d: 123 };
```

上面示例中，类型 Options 是一个对象，它的所有属性都是可选的，这导致任何对象实际都符合 Options 类型。为了避免这种情况，TypeScript 添加了最小可选属性规则，规定这时属于 Options 类型的对象，必须至少存在一个可选属性，不能所有可选属性都不存在。

### interface

文档: <https://wangdoc.com/typescript/interface>

interface 是对象的模板，可以看作是一种类型约定，中文译为“接口”。使用了某个模板的对象，就拥有了指定的类型结构。

```ts
interface Person {
  firstName: string;
  age?: number;
  [prop: string]: number;
}
const p: Person = { firstName: "John", age: 25 };
```

1. 方括号运算符可以取出 interface 某个属性的类型

```tsx
interface Foo {
  a: string;
}
type A = Foo["a"]; // string
```

2. 字符串索引会约束该类型中所有名字为字符串的属性

```tsx
interface MyObj {
  [prop: string]: number;
  a: boolean; // 编译错误
}
```

3. 数值索性必须服从于字符串索引, JavaScript 中数值属性名最终是自动转换成字符串属性名

```tsx
interface A {
  [prop: string]: number;
  [prop: number]: string; // 报错
}
interface B {
  [prop: string]: number;
  [prop: number]: number; // 正确
}
```

4. 对象方法写法

```tsx
// 写法一
interface A {
  f(x: boolean): string;
}
// 写法二
interface B {
  f: (x: boolean) => string;
}
// 写法三
interface C {
  f: { (x: boolean): string };
}

// 写法四
const f = "f";
interface A {
  [f](x: boolean): string;
}
```

5. 方法可以重载

```tsx
interface A {
  f(): number;
  f(x: boolean): boolean;
  f(x: string, y: string): string;
}

function MyFunc(): number;
function MyFunc(x: boolean): boolean;
function MyFunc(x: string, y: string): string;
function MyFunc(x?: boolean | string, y?: string): number | boolean | string {
  if (x === undefined && y === undefined) return 1;
  if (typeof x === "boolean" && y === undefined) return true;
  if (typeof x === "string" && typeof y === "string") return "hello";
  throw new Error("wrong parameters");
}
const a: A = { f: MyFunc };
```

6. 声明函数

```tsx
interface Add {
  (x: number, y: number): number;
}
const myAdd: Add = (x, y) => x + y;
```

#### interface 的继承

1. interface 继承 interface

```tsx
interface Style {
  color: string;
}
interface Shape {
  name: string;
}
// interface 允许多重继承, Circle 同时继承了 Style 和 Shape ，所以拥有三个属性 color、name 和 radius。
interface Circle extends Style, Shape {
  radius: number;
}

// 子接口与父接口存在同名属性，那么子接口的属性会覆盖父接口的属性, 子接口与父接口的同名属性必须是类型兼容的, 否则会报错
interface Foo {
  id: string;
}
interface Bar extends Foo {
  id: number; // 报错
}

// 多重继承时，如果多个父接口存在同名属性，那么这些同名属性不能有类型冲突，否则会报错。
interface Foo {
  id: string;
}
interface Bar {
  id: number;
}
// 报错
interface Baz extends Foo, Bar {
  type: string;
}
```

2. interface 继承 type class

```tsx
// interface 继承 type
type Country = {
  name: string;
  capital: string;
};
interface CountryWithPop extends Country {
  population: number;
}

// interface 继承 class
class A {
  x: string = "";
  y(): boolean {
    return true;
  }
}
interface B extends A {
  z: number;
}

const b: B = {
  x: "",
  z: 123,
  y: () => true,
};
```

#### 接口合并

多个同名接口会合并成一个接口。

```tsx
interface Box {
  height: number;
  width: number;
}
interface Box {
  length: number;
}
```

上面示例中，两个 Box 接口会合并成一个接口，同时有 height、width 和 length 三个属性。这样的设计主要是为了兼容 JavaScript 的行为。开发者常常对全局对象或者外部库，添加自己的属性和方法。那么，只要使用 interface 给出这些自定义属性和方法的类型，就能自动跟原始的 interface 合并，使得扩展外部类型非常方便。

举例来说，如果给 document 对象添加自定义属性，可以把自定义属性写成 interface，合并进原始定义。

```tsx
interface Document {
  foo: string;
}
document.foo = "hello";
```

1. 同名接口合并时，同一个属性如果有多个类型声明，彼此不能有类型冲突。

```tsx
interface A {
  a: number;
}
interface A {
  a: string; // 报错
}
```

2. 两个 interface 组成的联合类型存在同名属性，那么该属性的类型也是联合类型。

```tsx
interface Circle {
  area: bigint;
}
interface Rectangle {
  area: number;
}
declare const s: Circle | Rectangle;
s.area; // bigint | number
```

3. 同名方法有不同的类型声明，那么会发生函数重载。而且，后面的定义比前面的定义具有更高的优先级。下面示例中，clone()方法有不同的类型声明，会发生函数重载。这时，越靠后的定义，优先级越高，排在函数重载的越前面。(参数是字面量类型的例外)

```tsx
interface Cloner {
  clone(animal: Sheep): Sheep;
}
interface Cloner {
  clone(animal: Dog): Dog;
  clone(animal: Cat): Cat;
}
// 等同于
interface Cloner {
  clone(animal: Dog): Dog;
  clone(animal: Cat): Cat;
  clone(animal: Sheep): Sheep;
}

// 这个规则有一个例外。同名方法之中，如果有一个参数是字面量类型，字面量类型有更高的优先级。
interface A {
  f(x: "foo"): boolean;
}
interface A {
  f(x: any): void;
}
// 等同于
interface A {
  f(x: "foo"): boolean;
  f(x: any): void;
}
```

### interface 与 type 的异同

都能为对象类型起名。
class 命令也有类似作用，通过定义一个类，同时定义一个对象类型。但是，它会创造一个值，编译后依然存在。如果只是单纯想要一个类型，应该使用 type 或 interface。

**interface 与 type 的区别有下面几点**

1. type 能够表示非对象类型，而 interface 只能表示对象类型（包括数组、函数等）。

2. interface 可以继承其他类型，type 不支持继承, 但能使用 & 运算符，重新定义一个类型。

```tsx
interface Animal {
  name: string;
}
interface Bear extends Animal {
  honey: boolean;
}

type Animal = {
  name: string;
};
type Bear = Animal & {
  honey: boolean;
};

// 继承时，type 和 interface 是可以换用的。interface 可以继承 type。
type Foo = { x: number };
interface Bar extends Foo {
  y: number;
}

interface Foo {
  x: number;
}
type Bar = Foo & { y: number };
```

3. 同名 interface 会自动合并，同名 type 则会报错。 TypeScript 不允许使用 type 多次定义同一个类型。

```tsx
type A = { foo: number }; // 报错
type A = { bar: number }; // 报错

interface A {
  foo: number;
}
interface A {
  bar: number;
}
const obj: A = { foo: 1, bar: 1 };
```

4. interface 不能包含属性映射（mapping），type 可以

```tsx
interface Point {
  x: number;
  y: number;
}
// 正确
type PointCopy1 = {
  [Key in keyof Point]: Point[Key];
};
// 报错
interface PointCopy2 {
  [Key in keyof Point]: Point[Key];
};

```

5. this 关键字只能用于 interface
6. type 可以扩展原始数据类型，interface 不行。
7. interface 无法表达某些复杂类型（比如交叉类型和联合类型），但是 type 可以。

综上所述，如果有复杂的类型运算，那么没有其他选择只能使用 type；一般情况下，interface 灵活性比较高，便于扩充类型或自动合并，建议优先使用。

## tsconfig.json 配置

如果一个目录下存在一个 tsconfig.json 文件，那么它意味着这个目录是 TypeScript 项目的根目录。 tsconfig.json 文件中指定了用来编译这个项目的根文件和编译选项

**示例**

```ts
{
  "compilerOptions": {
    "module": "system",
    "noImplicitAny": true,
    "removeComments": true,
    "preserveConstEnums": true,
    "outFile": "../../built/local/tsc.js",
    "sourceMap": true
  },
  "extends": "./tsconfig1.ts",
  "files": ["core.ts"],
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### files, include, exclude

```ts
{
  "files": ["core.ts"],
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

- files: 指定一个包含相对或绝对文件路径的列表。优先级比 exclude 高
- include: 从那个文件夹开始编译
- exclude: 编译时忽略哪些文件，默认情况下会排除 <code>node_modules，bower_components，jspm_packages, \<outFile\></code> 目录

**支持的匹配模式**

- 匹配 0 或多个字符（不包括目录分隔符）
- ? 匹配一个任意字符（不包括目录分隔符）
- \*\*/ 递归匹配任意子目录

### extends

```ts
{
  "extends": "./configs/base",
}
```

<font color="#bf414a;">tsconfig.json</font> 文件可以利用 <font color="#bf414a;">extends </font>属性从另一个配置文件里继承配置

> 继承配置文件的 files，include 和 exclude 覆盖源配置文件的属性
>
> 配置文件里的相对路径在解析时相对于它所在的文件

### compilerOptions

参考文档：<https://www.tslang.cn/docs/handbook/compiler-options.html>

compilerOptionsp 是编译配置，包含很多选项

#### paths

模块名到基于 baseUrl 的路径映射的列表（别名配置）

#### jsx

```
"jsx": "react-jsx",
```

在 .tsx 文件里支持 JSX

## 实用技巧

### infer

infer 可以在 extends 的条件语句中推断待推断的类型, 例如在文档的示例中，使用 infer 来推断函数的返回值类型

```tsx
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
```

理解为：

- 如果 T 继承了 (...args: any[]) => any 类型，则返回类型 R，否则返回 any。
- R 被定义在 extends (...args: any[]) => infer R 中，即 R 是从传入参数类型中推导出来的。

```tsx
// 如果泛型 T 是 ()=> infer R 的子集，则返回 infer R 获取到的类型，否则返回 boolean
type Func<T> = T extends () => infer R ? R : boolean;

// 没命中 `T extends () => infer R`, 所以类型是 boolean
let func1: Func<"xxxx">; // boolean
let func2: Func<(p: any) => string>; // boolean

/*
  1. 命中 `T extends () => infer R`;
  2. func3 类型是 R;
  3. R 其实就是 `() => string` 类型的返回值;
*/
let func3: Func<() => string>;

/* 其它例子 */
type Obj<T> = T extends { a: infer VT; b: infer VT } ? VT : number;

let obj1: Obj<string>; // number;
let obj2: Obj<true>; // number;

let obj3: Obj<{ a: string; b: string }>; // string
let obj4: Obj<{ a: number; b: string }>; // a、b 为不同类型时，返回联合类型: string | number
```

例子: 获取第一个元素 First\<T\>

```tsx
type First<T> = T extends [infer P, ...infer Rest] ? P : never;
type FirstType = First<["1", "2"]>; //type FirstType = "1"
```

### Required

- Required\<T\> 将某个类型里的属性全部变为必选项

### Readonly

- Readonly\<T\> 将某个类型所有属性变为只读属性

### Record

<code> Record<K extends keyof any, T> </code> 将对象 K 中的所有属性，都转换为类型 T

```ts
type Record<K extends keyof any, T> = {
  [P in K]: T;
};

type Info = { title: string };
type Page = "home" | "about";

const v: Record<Page, Info> = {
  home: { title: "v1" },
  about: { title: "v2" },
};
```

### Partial

将某个类型的属性，全部变为可选

```ts
type Partial<T> = {
  [K in keyof T]?: T[K];
};
```

### Omit

将一个类型的某些子类型，进行过滤，组成新类型（和 Pick 相反）

```ts
interface Todo = {
  title: sting;
  name: string;
  completed: boolean;
}

type PickTest = Omit<Todo, 'completed'>;
// 等同于
type PickTest = {
  title: sting;
  name: string;
}
```

### Pick

将某个类型的子类型挑选出来，组成一个新的类型（和 Omit 相反）

```ts
interface Todo = {
  title: sting;
  name: string;
  completed: boolean;
}

type PickTest = Pick<Todo, 'name' | 'completed'>;
// 等同于
type PickTest = {
  name: string;
  completed: boolean;
}
```

### in

in 可以遍历多个字符类型

```ts
type Keys = "a" | "b";
type Obj = {
  [k in Keys]: number;
};

// 等同于
type Obj = {
  a: number;
  b: number;
};
```

### typeof

typeof 可以获取一个变量的声明类型

```ts
interface Person {
  name: string;
  age: number;
}
const sem: Person = {
  name: "lcr",
  age: 18,
};
type Sem = typeof sem; // Person
```

### keyof

keyof 返回一个对象所有的 key 组成的类型

```ts
interface Penson = {
  name: string;
  age: number;
}
type K1 = keyof Penson; // 'name' | 'age'
type K2 = keyof Person[]; // 'length' | 'pop' | 'toString' ...
type K3 = keyof { [s: string]: string; } // string | number
```

### Exclude

将 T 中某些属于 U 的类型移除掉

```ts
type Exclude<T, U> = T extends U ? never : T;
type A = number | boolean | string;
type B = number | boolean;
type Foo = Exclude<A, B>; // 相当于 type Foo = string;
```

### Extract

从 T 中提取 U, 和 Exclude 相反

```ts
type Extract<T, U> = T extends U ? T : never;
type A = number | boolean | string;
type B = number | boolean;
type Foo = Extract<A, B>; // 相当于 type Foo = number | boolean;
```

### ReturnType

获取函数的返回值

```ts
type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any;
type t = ReturnType<(name: string) => string | number>; // type t = string | number
```

### NonNullable

从泛型 T 中排除 undefined 和 null

```ts
type NonNullable<T> = T extends null | undefined ? never : T;
type t = NonNullable<"name" | undefined | null>; // type t = 'name'
```

### Parameters

以元组的方式获得函数的入参类型

```ts
type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;

// type t = [string]
type t = Parameters<(name: string) => any>;

// type t2 = [string] | [number]
type t2 = Parameters<((name: string) => any) | ((age: number) => any)>;
```

### declare

declare 是用来定义全局变量、全局函数、全局命名空间、js modules、class 等

- declare global 为全局对象 window 增加的新属性

```ts
declare global {
  interface Window {
    csrf: string;
  }
}
```

### typings.d.ts

某个文件夹添加 typings.d.ts 文件，那么该文件夹下所有\*.ts 和\*.txs 文件，都可以使用 typings.d.ts 定义的类型，无需引入

下面为例子，src 下面所有的.tsx 和.ts 文件可以这样使用 Global.T1 类型

```ts
declare namespace Global {
  type T1 = {
    name: string;
  };
  type T2 = {
    title: string;
  };
}
```

### [三斜线指令](https://www.tslang.cn/docs/handbook/triple-slash-directives.html)

三斜线是引入文件的类型，它用于声明文件间的依赖, 三斜线指令仅可放在包含它的文件的最顶端

> 注意：
>
> 只可使用在 d.ts 文件中

#### \/\/\/\<reference path="..."/\>

用路径声明依赖

```ts
/// <reference path="..." />
```

#### \/\/\/\<reference types="..."/\>

声明对某个包的依赖

```ts
/// <reference types="node" />
```

上面例子表明这个文件使用了 @types/node/index.d.ts 里面声明的名字； 并且这个包需要在编译阶段与声明文件一起被包含进来

#### \/\/\/ \<reference no-default-lib="true"/\>

这个指令把一个文件标记成默认库。 这个指令告诉编译器在编译过程中不要包含这个默认库（比如，lib.d.ts）。 这与在命令行上使用 --noLib 相似

**一些例子：**

```ts
文件: Validation.ts:
namespace Validation {
  export interface StringValidator {}
}

文件: LettersOnlyValidator.ts:
/// <reference path="Validation.ts" />
namespace Validation {
  export class LettersOnlyValidator implements StringValidator {}
}

文件 ZipCodeValidator.ts:
/// <reference path="Validation.ts" />
namespace Validation {
  export class ZipCodeValidator implements StringValidator {}
}

文件 Test.ts:
/// <reference path="Validation.ts" />
/// <reference path="LettersOnlyValidator.ts" />
/// <reference path="ZipCodeValidator.ts" />
let validators: { [s: string]: Validation.StringValidator } = {};
validators["ZIP code"] = new Validation.ZipCodeValidator();
validators["Letters only"] = new Validation.LettersOnlyValidator();
```

### T[number]

```tsx
type T = ["a", "b", "c"];
type BB = T[number]; // type BB = "a" | "b" | "c"
```

### . . . 语法

```tsx
type First<T> = T extends [infer P, ...infer Rest] ? P : never;
```

## 泛型

### 泛型函数

```tsx
function identity<T>(value: T): T {
  return value;
}

function identity2<T, U>(value: T, message: U): T {
  return value;
}

identity2<string, number>("lichirong", 18);

// 简写
identity2("lichirong", 18);
```

### 泛型接口

```tsx
interface Identity<V, U> {
  value: V;
  message: U;
}

function identity<T, U>(value, T, message: U): Identity<T, U> {
  return {
    value,
    message,
  };
}
```

### 泛型类

```tsx
interface GenericInterface<U> {
  value: U;
  getIdentity: () => U;
}

class IdentityClass<T> implements GenericInterface<T> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }

  getIdentity(): T {
    return this.value;
  }
}
```

### 泛型约束

```ts
interface Length {
  length: number;
}

function identity<T extends Length>(value: T): number {
  return value.length;
}

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

### 默认参数

```tsx
interface InterfaceA<T = string> {
  value: T;
}

const obj: InterfaceA = { value: "lichirong" };
const obj1: InterfaceA<number> = { value: 100 };
```

## 试题

<https://juejin.cn/post/7110232056826691591>
