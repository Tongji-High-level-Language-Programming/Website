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
  sequence: {
    name: "顺序结构",
    detail: "最基本的程序结构。程序从入口点开始，依次执行每一条语句。",
  },
  "basic-types": {
    name: "基本变量类型",
    detail:
      "[signed/unsigned] [char, short, int, long, long long]<br/>float, double",
  },
  stdio: {
    name: "标准输入输出",
    detail: "C/C++ 基本的输入输出功能。使用 scanf(C 方式) 或 cin(C++ 方式) 从键盘读入，使用 printf(C 方式) 或 cout(C++ 方式) 向屏幕输出。",
  },
  selection: {
    name: "选择结构",
    detail:
      "选择结构中，程序可以根据运行状态（条件）来决定接下来所执行的程序。包括 if-else, if-goto, switch-case, <code>? :</code> 三目运算符等。特别地，比较运算符、逻辑运算符在这里也被禁止。",
  },
  goto: {
    name: "goto 语句",
    detail:
      "使用 goto 进行无条件跳转。这种做法在绝大多数情况下是蹩脚且有害的。",
  },
  loop: {
    name: "循环结构",
    detail:
      "循环结构中，程序可以反复执行某个程度段，直到满足特定条件。包括 while，do-while，for，if-goto 等形式。",
  },
  function: {
    name: "自定义函数",
    detail:
      "函数是执行特定操作的一段代码块。自定义函数允许更好地划分功能块和重用代码。"
  },
  array: {
    name: "数组",
    detail:
      "数组用于存储一组（多个）同类型的变量，是处理大规模数据的基础。"
  },
  struct: {
    name: "结构体",
    detail:
      "结构体（struct）用于将多个简单类型组合起来，创建新的类型。C++ 中，结构体同样具有类的所有功能。"
  },
  class: {
    name: "类与对象",
    detail:
      "“类”是面向对象编程的核心概念，强调“数据”与“方法”作为一个整体，允许定义属于自身的成员函数，允许通过继承实现多态性。"
  },
  others: {
    name: "其他未学知识",
    detail: "其他所有未在课程中涉及的知识也同样不允许使用。"
  }
} as const;

// 提取 Key 的联合类型
export type SyntaxKey = keyof typeof syntaxLib;
