# 违规知识检测

本页面用于实验违规知识检测功能。将 C/C++ 代码粘贴至编辑器，配置白名单后点击检测按钮，请求后端比对标出违规内容。

<script setup>
import DetectionPage from './DetectionPage.vue'
</script>

<DetectionPage />

---

## 使用方式

1. 通过预设按钮或手动开关各语法类别，配置允许使用的知识范围
2. 在编辑器中编写或粘贴 C/C++ 代码
3. 点击检测按钮，结果面板列出违规的行列和类型
4. 格式化按钮可对代码进行 clang-format 规整（基于项目 `.clang-format` 配置）

## 检测范围

| 类别 | 检测内容 |
| ---- | -------- |
| 基本变量类型 | `int`, `char`, `float`, `double`, `long`, `bool` 等 |
| 标准输入输出 | `scanf`, `printf`, `cin`, `cout`, `<<`/`>>` |
| 选择结构 | `if`, `else`, `switch`, `case`, 比较/逻辑运算符 |
| 循环结构 | `for`, `while`, `do-while`, `continue`, `break` |
| 自定义函数 | 函数定义（`returnType name(params) {`） |
| 数组 | 数组下标访问 `[...]`, `new[]`, `delete[]` |
| 结构体 | `struct` |
| 类与对象 | `class`, `public/private`, `virtual`, `namespace`, `template` 等 |
| goto | `goto` |
| 其他知识 | `#include`, `#define`, `typedef`, `enum`, `union`, `const`, `static`, `try/catch` 等 |

::: tip
当前为前端原型，用于验证交互和检测逻辑，后续集成到作业提交客户端。
:::

