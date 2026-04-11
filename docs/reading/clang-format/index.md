# clang-format 在 Visual Studio 中配置的方法

## 第一步：配置代码清理

在 `Visual Studio` 编辑文件时，默认只会在进行 **添加分号**、**添加右大括号**、**粘贴** 等特定操作时，才会进行代码的默认格式化（如增添一些空格）；我们现在需要先配置代码清理的相关内容，目标是**在按下 `Ctrl+S` 保存文件时，可以自动进行 `C/C++` 代码的格式化**。

### 1-1. 选择顶部菜单栏的“工具”-“选项”

### 1-2. 选项中找到“文本编辑器”，选择其中的“代码清理”

### 1-3. 在右侧“保存配置文件时清理代码”，选择“配置文件1”

![alt text](config-file-1.png)

### 1-4. 选择下方“配置代码清理”，在配置文件1的部分，找到“可用的修复程序”列表中的“设置文档格式(C++)”，将其添加到“包括的修复程序”中

![alt text](setting-format-C++.png)

### 1-5. 添加之后，选择“确定”

## 第二步：完成 .clang-format 文件

`.clang-format` 是一个用于设置约定应用代码格式设置规则的配置文件。简而言之，在需要进行格式化操作时，如果 `Visual Studio` 没找到相应的 `.clang-format` 文件，则按选项中的默认规则来（默认格式设置样式为 `Visual Studio`）；如果找到了相应的 `.clang-format` 文件，则会按 **默认格式设置样式 + 配置文件的规则** 来共同约定文件的格式。

`Visual Studio` 寻找 `.clang-format` 文件的方法是：**从当前项目目录开始寻找，找到则停止，否则依次寻找其父目录**。*例如：对于 `D:/Test/Test2/Project1` 项目中的所有源文件，它们会试图在 `D:/Test/Test2/Project1` 目录中寻找 `.clang-format` 文件，如果有，按照此文件约定设置规则；如果没有，继续在 `D:/Test/Test2` 目录中寻找 `.clang-format` 文件，找到则停止，否则继续往上找，以此类推，直到寻找 `D` 根目录，若仍不存在，按默认格式设置样式来进行代码格式化。*

因此，对于高程课程的编程作业，建议将所有项目建到同一个解决方案中，最后**只需在解决方案的目录下放置一个 `.clang-format` 文件即可**！

### 2-1. 进入解决方案的目录，创建名为 `.clang-format` 的文件

![alt text](create-clang-format.png)

### 2-2. （方法1）记事本中打开该文件，复制以下内容

```yaml
---
# We'll use defaults from the LLVM style, but with 4 columns indentation.
BasedOnStyle: LLVM
IndentWidth: 4
BreakBeforeBraces: Stroustrup
AllowShortBlocksOnASingleLine: Never
AllowShortFunctionsOnASingleLine: None
IndentCaseLabels: true
```

这个配置文件约束的格式设置样式完全遵循高程的要求，且缩进采用 **4 空格** 的形式。

### 2-2. （方法2）记事本中打开该文件，复制以下内容

```yaml
---
# We'll use defaults from the LLVM style, but with 4 columns indentation.
BasedOnStyle: LLVM
IndentWidth: 4
UseTab: Always
TabWidth: 4
BreakBeforeBraces: Stroustrup
AllowShortBlocksOnASingleLine: Never
AllowShortFunctionsOnASingleLine: None
IndentCaseLabels: true

```

这个配置文件约束的格式设置样式完全遵循高程的要求，且缩进采用 **制表符** 的形式。

两个方法均可，根据个人喜好自行选择。

### 2-3. 保存后关闭 `.clang-format` 文件

## 第三步：设置默认格式设置样式

### 3-1. 进入“工具”-“选项”-“语言”-“C/C++”-“代码样式”-“格式设置”-“常规”

### 3-2. 确认“启用 ClangFormat 支持”选项已经勾选上

### 3-3. 将默认格式设置样式改为 `LLVM`

![alt text](change-to-llvm.png)

到此为止，你便成功完成了符合高程课程编程作业源文件格式约束的 `clang-format` 相关配置。后续只要是此解决方案中的项目，其中的源代码均会在按下 `Ctrl+S` 保存时自动进行格式化。

效果如图：

![alt text](before-format.png)

![alt text](after-format.png)

::: warning
如果创建了一个全新的解决方案，其配置会再次回到默认配置，需要重新进行 `clang-format` 的配置！
:::
