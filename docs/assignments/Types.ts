import type { SyntaxDefinition, SyntaxKey } from "./SyntaxLib";

// 语法规则配置项：可以是纯字符串 Key，也可以是对象覆盖
export type SyntaxConfig =
  | SyntaxKey
  | {
      key: SyntaxKey; // <--- 这里限制了必须是存在的 Key
    } & SyntaxDefinition;

export interface Problem {
  name: string;
  title: string;
  description: string;
  allowedSyntax?: SyntaxConfig[];
  bannedSyntax?: SyntaxConfig[];
  inputFormat: string;
  outputFormat: string;
  samples: { input: string; output: string }[];
  tips?: string;
}
