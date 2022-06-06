# 正则

下面列出常见的使用方法

## 修饰符

### /i

不区分大小写 将匹配设置为不区分大小写

```js
var str = "Google runoob taobao RUNoob";
var n1 = str.match(/runoob/g); // ['runoob']
var n2 = str.match(/runoob/gi); // ['runoob', 'RUNoob']
```

### /g

全局匹配 查找所有的匹配项

```js
var str = "Google runoob taobao runoob";
var n1 = str.match(/runoob/); // ['runoob']
var n2 = str.match(/runoob/g); // ['runoob', 'runoob']
```

### /m

多行匹配 使边界字符 ^ 和 $ 匹配每一行的开头和结尾，记住是多行不是整个字符串开头和结尾

```js
var str = "runoobgoogle\ntaobao\nrunoobweibo";
var n1 = str.match(/^runoob/g); // ['runoob']
var n2 = str.match(/^runoob/gm); // 多行匹配: ['runoob', 'runoob']
```

### /s

默认 . 是匹配除换行符 \n 之外的任何字符，加 s 后包含换行符 \n。

```js
var str = "google\nrunoob\ntaobao";
var n1 = str.match(/google./); // 无法匹配\n: n1 = null
var n2 = str.match(/runoob./s); // 匹配\n: n2 = ['runoob\n']
```

## 元字符

### 正则\

1. 将字符标记为一个特殊字符: \n \s \d
2. 或一个原义字符: \\\\ 匹配 \\; \\( 则匹配 (
3. 或一个 向后引用、或一个八进制转义符

### 正则^

1. 匹配输入字符串的<font color="red"> 开始位置 </font>
2. 如果设置了 RegExp 对象的 Multiline 属性，^ 也匹配 \n 或 \r 之后的位置

### 正则$

1. 匹配输入字符串的<font color="red"> 结束位置 </font>
2. 如果设置了 RegExp 对象的 Multiline 属性，$ 也匹配 \n 或 \r 之前的位置

### 正则\*

1. 匹配前面的子表达式<font color="red"> 零次或多次 </font>,等价于{0,}
2. zo\* 能匹配 z 以及 zoo

### 正则+

1. 匹配前面的子表达式<font color="red"> 一次或多次 </font>,等价于 {1,}
2. zo+ 能匹配 zo 以及 zoo，但不能匹配 z

### 正则?

1. 匹配前面的子表达式<font color="red"> 零次或一次 </font>,等价于 {0,1}
2. do(es)? 可以匹配 do 或 does

3. 当该字符紧跟在任何一个其他限制符 (\*, +, ?, {n}, {n,}, {n,m}) 后面时，匹配模式是非贪婪的,
   > 该模式尽可能少的匹配所搜索的字符串，而默认的贪婪模式则尽可能多的匹配所搜索的字符串
   >
   > 例如: 对于字符串 oooo，o+? 将匹配单个 o，而 o+ 将匹配所有 o

### 正则{n}

1. 匹配确定的 n 次
2. o{2} 不能匹配 Bob 中的 o，但是能匹配 food 中的两个 o

### 正则{n,}

1. 至少匹配 n 次
2. o{2,} 不能匹配 Bob 中的 o，但能匹配 foooood 中的所有 o
3. o{1,} 等价于 o+
4. o{0,} 则等价于 o\*

### 正则{n,m}

1. 最少匹配 n 次且最多匹配 m 次
2. o{1,3} 将匹配 fooooood 中的前三个 o ; o{0,1} 等价于 o?
3. 请注意在逗号和两个数之间不能有空格

### 正则.

1. 匹配除换行符（\n、\r）之外的任何单个字符
2. 要匹配包括 \n 在内的任何字符，可以这样 (.|\n)

### 正则 x|y

匹配 x 或 y

> z|food 能匹配 z 或 food。(z|f)ood 则匹配 zood 或 food

### 正则 [xyz] [^xyz]

[xyz]：匹配所包含的任意一个字符

> [abc] 可以匹配 plain 中的 a

[^xyz]：匹配未包含的任意字符

> [^abc] 可以匹配 "plain" 中的'p'、'l'、'i'、'n'

### 正则 [a-z]

[a-z]：可以匹配 'a' 到 'z' 范围内的任意小写字母字符

[^a-z]：可以匹配不在 'a' 到 'z' 范围内的任意字符

### 正则 \d, \D, \s, \S, \w, \W

- \d: 匹配一个数字字符。等价于 [0-9]
- \D: 匹配一个非数字字符。等价于 [^0-9]

- \w: 匹配字母、数字、下划线。等价于'[A-Za-z0-9_]'
- \W: 匹配非字母、数字、下划线。等价于 '[^a-za-z0-9_]'

- \s: 匹配任何空白字符，包括空格、制表符、换页符等等。等价于 [ \f\n\r\t\v]
- \S: 匹配任何非空白字符。等价于 [^ \f\n\r\t\v]

### 正则 \n, \f, \r, \t, \v, \b, \B

- \b: 匹配一个单词边界，也就是指单词和空格间的位置
  > 'er\b' 可以匹配"never" 中的 'er'，但不能匹配 "verb" 中的 'er'
- \B: 匹配非单词边界
  > 'er\B' 能匹配 "verb" 中的 'er'，但不能匹配 "never" 中的 'er
- \r: 匹配一个回车符
- \f: 匹配一个换页符
- \t: 匹配一个制表符
- \v: 匹配一个垂直制表符

## 优先级

最高到最低说明了各种正则表达式运算符的优先级顺序：

1. 转义符\
2. (), (?：), (?=), [] 圆括号和方括号
3. \*, +, ?, {n}, {n,}, {n,m} 限定符
4. ^, $, \任何元字符、任何字符
5. | 替换，"或"操作
   > 字符具有高于替换运算符的优先级，使得"m|food"匹配"m"或"food"
   >
   > 若要匹配"mood"或"food"，请使用括号创建子表达式，从而产生"(m|f)ood"
