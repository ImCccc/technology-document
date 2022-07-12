/* 其它例子 */
type Obj<T> = T extends { a: infer VT; b: infer VT } ? VT : number;

let obj1: Obj<string>; // number;
let obj2: Obj<true>; // number;

let obj3: Obj<{ a: string; b: string }>; // string
let obj4: Obj<{ a: number; b: string }>; // a、b 为不同类型时，返回联合类型: string | number
