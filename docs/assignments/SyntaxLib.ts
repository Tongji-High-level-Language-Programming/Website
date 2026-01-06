
// 1. 定义具体的语法项结构
export interface SyntaxDefinition {
  name: string
  detail?: string
  example?: string
  link?: string
}

// 2. 定义数据库 (加上 as const 可以让 TS 推断出精确的字面量类型，而不是宽泛的 string)
// !!! 这一步非常关键 !!!
export const syntaxLib = {
  'cin': { name: 'std::cin / cout', reason: '...' },
  'if': { name: 'if-else 分支', reason: '...' },
  'goto': { name: 'goto 语句', reason: '...' },
  'vector': { name: 'std::vector', reason: '...' },
  // ... 其他项
} as const 

// 3. 核心：提取 Key 的联合类型
// SyntaxKey 现在等同于: 'cin' | 'if' | 'goto' | 'vector' | ...
export type SyntaxKey = keyof typeof syntaxLib
