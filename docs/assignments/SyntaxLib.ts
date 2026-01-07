// 1. 定义具体的语法项结构
export interface SyntaxDefinition {
  name: string;
  detail?: string;
  example?: string;
  link?: string;
}

// 2. 定义数据库 (加上 as const 可以让 TS 推断出精确的字面量类型，而不是宽泛的 string)
// !!! 这一步非常关键 !!!
export const syntaxLib = {
  "basic-types": {
    name: "基本变量类型",
    detail: "[signed/unsigned] [char, short, int, long, long long]\nfloat double",
    reason: "...",
  },
  selection: {
    name: "选择结构",
    detail: "选择结构中，程序可以根据运行状态（条件）来决定接下来所执行的程序。包括 if-else, if-goto, switch-case, <code>? :</code> 三目运算符等。"
  },
  goto: { name: "goto 语句", detail: "使用 goto 进行无条件跳转。这种做法在绝大多数情况下是蹩脚且有害的。" },
  loop: {
    name: "循环结构",
    detail: "循环结构中，程序可以反复执行某个程度段，直到满足特定条件。包括 while，do-while，for，if-goto 等形式。"
  },
  vector: { name: "std::vector", reason: "..." },
  // ... 其他项
} as const;

// 3. 核心：提取 Key 的联合类型
// SyntaxKey 现在等同于: 'cin' | 'if' | 'goto' | 'vector' | ...
export type SyntaxKey = keyof typeof syntaxLib;
