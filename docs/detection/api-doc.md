# 代码语法检测 — 接口需求文档

## 1. 获取作业列表

### 请求

```
GET /listHomework
```

无请求参数。

### 响应

`200 OK`，JSON 数组：

| 字段 | 类型 | 说明 |
|------|------|------|
| `title` | `string` | 作业名称 |
| `limits` | `string[]` | 允许使用的语法模块列表 |

示例：

```json
[
  { "title": "作业1白名单", "limits": ["sequence", "basic-types", "stdio"] },
  { "title": "作业2白名单", "limits": ["sequence", "basic-types", "stdio", "selection"] }
]
```

`limits` 中可能出现的值（对应 `docs/.vitepress/theme/components/syntaxLib.ts` 中的 key）：

| Key | 名称 | 说明 |
|-----|------|------|
| `sequence` | 顺序结构 | 最基本的程序结构，依次执行每一条语句 |
| `basic-types` | 基本变量类型 | `char, short, int, long, long long, float, double` 等 |
| `stdio` | 标准输入输出 | `scanf`/`printf`（C）或 `cin`/`cout`（C++） |
| `selection` | 选择结构 | `if-else`, `if-goto`, `switch-case`, `? :` 三目运算符等 |
| `goto` | goto 语句 | 无条件跳转 |
| `loop` | 循环结构 | `while`, `do-while`, `for`, `if-goto` 等 |
| `function` | 自定义函数 | 自定义函数，划分功能块和重用代码 |
| `array` | 数组 | 存储一组同类型变量 |
| `struct` | 结构体 | 将多个简单类型组合成新类型 |
| `class` | 类与对象 | 面向对象核心概念，数据与方法作为整体 |
| `others` | 其他未学知识 | 所有未在课程中涉及的知识 |

---

## 2. 提交代码检测

### 请求

```
POST /api/check
Content-Type: application/json
```

请求体：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | `string` | 是 | 作业名称，对应 `/listHomework` 返回的 `title`，用于确定检测规则（白名单） |
| `code` | `string` | 是 | 待检测的源代码文本 |

示例：

```json
{
  "title": "作业1白名单",
  "code": "#include <stdio.h>\nint main() {\n  for (int i = 0; i < 10; i++) {\n  }\n  return 0;\n}"
}
```

### 响应

`200 OK`，JSON 数组。数组为空表示代码通过检测（未发现违规）。非空时每项表示一个违规位置：

| 字段 | 类型 | 说明 |
|------|------|------|
| `startLine` | `number` | 违规起始行号 |
| `startCol` | `number` | 违规起始列号 |
| `endLine` | `number` | 违规结束行号 |
| `endCol` | `number` | 违规结束列号 |
| `type` | `string` | 违规类型描述 |

示例：

```json
[
  { "startLine": 3, "startCol": 5, "endLine": 3, "endCol": 8, "type": "for 循环" },
  { "startLine": 9, "startCol": 7, "endLine": 9, "endCol": 11, "type": "if-else 选择结构" }
]
```

### 错误响应

| 状态码 | 说明 |
|--------|------|
| 4xx/5xx | `{ "title" }` 对应的作业不存在，或服务端内部错误 |

---

## 3. Mock 模式

前端通过 `isMock` 标志位控制是否走真实后端。`isMock = true` 时，两个接口均返回写死的模拟数据，不发起网络请求。部署到生产环境前需将 `isMock` 置为 `false`。
