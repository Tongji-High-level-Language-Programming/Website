# 参考图表

## 运算符优先级表

| 运算符 | 描述 |
| :-- | :-- |
| **优先级第1组** | |
| `::` <Badge type="info" text="C++" /> | 作用域解析运算符 |
| **优先级第2组** | **结合性：L-R** |
| `(表达式)` | 分组 |
| `()` | 函数调用 |
| `()` <Badge type="info" text="C++" /> | 值构造，即`type(expr)` |
| `[]` | 数组下标 |
| `->` | 间接成员运算符 |
| `.` | 直接成员运算符 |
| `const_cast` <Badge type="info" text="C++" /> | 专用的类型转换 |
| `dynamic_cast` <Badge type="info" text="C++" /> | 专用的类型转换 |
| `reinterpret_cast` <Badge type="info" text="C++" /> | 专用的类型转换 |
| `static_cast` <Badge type="info" text="C++" /> | 专用的类型转换 |
| `typeid` <Badge type="info" text="C++" /> | 类型标识 |
| `++` | 加1运算符，后缀 |
| `--` | 减1运算符，后缀 |
| **优先级第3组（均为一元运算符）** | **结合性：R-L** |
| `!` | 逻辑非 |
| `~` | 位非 |
| `+` | 一元加号（正号） |
| `-` | 一元减号（负号） |
| `++` | 加1运算符，前缀 |
| `--` | 减1运算符，前缀 |
| `&` | 地址 |
| `*` | 解除引用（间接值） |
| `()` | 类型转换，即`(type)expr` |
| `sizeof` | 长度，以字节为单位，类型是`size_t` |
| `new` <Badge type="info" text="C++" /> | 动态分配内存 |
| `new []` <Badge type="info" text="C++" /> | 动态分配数组 |
| `delete` <Badge type="info" text="C++" /> | 动态释放内存 |
| `delete []` <Badge type="info" text="C++" /> | 动态释放数组 |
| **优先级第4组** | **结合性：L-R** |
| `.*` | 成员解除引用 |
| `->*` | 间接成员解除引用 |
| **优先级第5组（均为二元运算符）** | **结合性：L-R** |
| `*` | 乘 |
| `/` | 除 |
| `%` | 模（余数） |
| **优先级第6组（均为二元运算符）** | **结合性：L-R** |
| `+` | 加 |
| `-` | 减 |
| **优先级第7组** | **结合性：L-R** |
| `<<` | 左移 |
| `>>` | 右移 |
| **优先级第8组** | **结合性：L-R** |
| `<` | 小于 |
| `<=` | 小于或等于 |
| `>=` | 大于或等于 |
| `>` | 大于 |
| **优先级第9组** | **结合性：L-R** |
| `==` | 等于 |
| `!=` | 不等于 |
| **优先级第10组（二元运算符）** | **结合性：L-R** |
| `&` | 按位AND |
| **优先级第11组** | **结合性：L-R** |
| `^` | 按位XOR（异或） |
| **优先级第12组** | **结合性：L-R** |
| `\|` | 按位OR |
| **优先级第13组** | **结合性：L-R** |
| `&&` | 逻辑AND |
| **优先级第14组** | **结合性：L-R** |
| `\|\|` | 逻辑OR |
| **优先级第15组** | **结合性：R-L** |
| `:?` | 条件（唯一的三元运算符） |
| **优先级第16组** | **结合性：R-L** |
| `=` | 简单赋值 |
| `*=` | 乘并赋值 |
| `/=` | 除并赋值 |
| `%=` | 求模并赋值 |
| `+=` | 加并赋值 |
| `-=` | 减并赋值 |
| `&=` | 按位AND并赋值 |
| `^=` | 按位XOR并赋值 |
| `\|=` | 按位OR并赋值 |
| `<<=` | 左移并赋值 |
| `>>=` | 右移并赋值 |
| **优先级第17组** | **结合性：L-R** |
| `throw` <Badge type="info" text="C++" /> | 引发异常 |
| **优先级第18组** | **结合性：L-R** |
| `,` | 将两个表达式合并成一个 |

## ASCII 码表

| Dec (十进制) | Hex (十六进制) | 缩写/字符 | 解释 |
| ------------ | -------------- | ---------- | ---- |
| 0 | 0x00 | NUL (null) | 空字符 |
| 1 | 0x01 | SOH (start of headline) | 标题开始 |
| 2 | 0x02 | STX (start of text) | 正文开始 |
| 3 | 0x03 | ETX (end of text) | 正文结束 |
| 4 | 0x04 | EOT (end of transmission) | 传输结束 |
| 5 | 0x05 | ENQ (enquiry) | 请求 |
| 6 | 0x06 | ACK (acknowledge) | 收到通知 |
| 7 | 0x07 | BEL (bell) | 响铃 |
| 8 | 0x08 | BS (backspace) | 退格 |
| 9 | 0x09 | HT (horizontal tab) | 水平制表符 |
| 10 | 0x0A | LF (NL line feed, new line) | 换行键 |
| 11 | 0x0B | VT (vertical tab) | 垂直制表符 |
| 12 | 0x0C | FF (NP form feed, new page) | 换页键 |
| 13 | 0x0D | CR (carriage return) | 回车键 |
| 14 | 0x0E | SO (shift out) | 不用切换 |
| 15 | 0x0F | SI (shift in) | 启用切换 |
| 16 | 0x10 | DLE (data link escape) | 数据链路转义 |
| 17 | 0x11 | DC1 (device control 1) | 设备控制1 |
| 18 | 0x12 | DC2 (device control 2) | 设备控制2 |
| 19 | 0x13 | DC3 (device control 3) | 设备控制3 |
| 20 | 0x14 | DC4 (device control 4) | 设备控制4 |
| 21 | 0x15 | NAK (negative acknowledge) | 拒绝接收 |
| 22 | 0x16 | SYN (synchronous idle) | 同步空闲 |
| 23 | 0x17 | ETB (end of trans. block) | 结束传输块 |
| 24 | 0x18 | CAN (cancel) | 取消 |
| 25 | 0x19 | EM (end of medium) | 媒介结束 |
| 26 | 0x1A | SUB (substitute) | 代替 |
| 27 | 0x1B | ESC (escape) | 换码(溢出) |
| 28 | 0x1C | FS (file separator) | 文件分隔符 |
| 29 | 0x1D | GS (group separator) | 分组符 |
| 30 | 0x1E | RS (record separator) | 记录分隔符 |
| 31 | 0x1F | US (unit separator) | 单元分隔符 |
| 32 | 0x20 | (space) | 空格 |
| 33 | 0x21 | ! | 叹号 |
| 34 | 0x22 | " | 双引号 |
| 35 | 0x23 | # | 井号 |
| 36 | 0x24 | $ | 美元符 |
| 37 | 0x25 | % | 百分号 |
| 38 | 0x26 | & | 和号 |
| 39 | 0x27 | ' | 闭单引号 |
| 40 | 0x28 | ( | 开括号 |
| 41 | 0x29 | ) | 闭括号 |
| 42 | 0x2A | * | 星号 |
| 43 | 0x2B | + | 加号 |
| 44 | 0x2C | , | 逗号 |
| 45 | 0x2D | - | 减号/破折号 |
| 46 | 0x2E | . | 句号 |
| 47 | 0x2F | / | 斜杠 |
| 48 | 0x30 | 0 | 字符0 |
| 49 | 0x31 | 1 | 字符1 |
| 50 | 0x32 | 2 | 字符2 |
| 51 | 0x33 | 3 | 字符3 |
| 52 | 0x34 | 4 | 字符4 |
| 53 | 0x35 | 5 | 字符5 |
| 54 | 0x36 | 6 | 字符6 |
| 55 | 0x37 | 7 | 字符7 |
| 56 | 0x38 | 8 | 字符8 |
| 57 | 0x39 | 9 | 字符9 |
| 58 | 0x3A | : | 冒号 |
| 59 | 0x3B | ; | 分号 |
| 60 | 0x3C | < | 小于 |
| 61 | 0x3D | = | 等号 |
| 62 | 0x3E | > | 大于 |
| 63 | 0x3F | ? | 问号 |
| 64 | 0x40 | @ | 电子邮件符号 |
| 65 | 0x41 | A | 大写字母A |
| 66 | 0x42 | B | 大写字母B |
| 67 | 0x43 | C | 大写字母C |
| 68 | 0x44 | D | 大写字母D |
| 69 | 0x45 | E | 大写字母E |
| 70 | 0x46 | F | 大写字母F |
| 71 | 0x47 | G | 大写字母G |
| 72 | 0x48 | H | 大写字母H |
| 73 | 0x49 | I | 大写字母I |
| 74 | 0x4A | J | 大写字母J |
| 75 | 0x4B | K | 大写字母K |
| 76 | 0x4C | L | 大写字母L |
| 77 | 0x4D | M | 大写字母M |
| 78 | 0x4E | N | 大写字母N |
| 79 | 0x4F | O | 大写字母O |
| 80 | 0x50 | P | 大写字母P |
| 81 | 0x51 | Q | 大写字母Q |
| 82 | 0x52 | R | 大写字母R |
| 83 | 0x53 | S | 大写字母S |
| 84 | 0x54 | T | 大写字母T |
| 85 | 0x55 | U | 大写字母U |
| 86 | 0x56 | V | 大写字母V |
| 87 | 0x57 | W | 大写字母W |
| 88 | 0x58 | X | 大写字母X |
| 89 | 0x59 | Y | 大写字母Y |
| 90 | 0x5A | Z | 大写字母Z |
| 91 | 0x5B | [ | 开方括号 |
| 92 | 0x5C | \ | 反斜杠 |
| 93 | 0x5D | ] | 闭方括号 |
| 94 | 0x5E | ^ | 脱字符 |
| 95 | 0x5F | _ | 下划线 |
| 96 | 0x60 | ` | 开单引号 |
| 97 | 0x61 | a | 小写字母a |
| 98 | 0x62 | b | 小写字母b |
| 99 | 0x63 | c | 小写字母c |
| 100 | 0x64 | d | 小写字母d |
| 101 | 0x65 | e | 小写字母e |
| 102 | 0x66 | f | 小写字母f |
| 103 | 0x67 | g | 小写字母g |
| 104 | 0x68 | h | 小写字母h |
| 105 | 0x69 | i | 小写字母i |
| 106 | 0x6A | j | 小写字母j |
| 107 | 0x6B | k | 小写字母k |
| 108 | 0x6C | l | 小写字母l |
| 109 | 0x6D | m | 小写字母m |
| 110 | 0x6E | n | 小写字母n |
| 111 | 0x6F | o | 小写字母o |
| 112 | 0x70 | p | 小写字母p |
| 113 | 0x71 | q | 小写字母q |
| 114 | 0x72 | r | 小写字母r |
| 115 | 0x73 | s | 小写字母s |
| 116 | 0x74 | t | 小写字母t |
| 117 | 0x75 | u | 小写字母u |
| 118 | 0x76 | v | 小写字母v |
| 119 | 0x77 | w | 小写字母w |
| 120 | 0x78 | x | 小写字母x |
| 121 | 0x79 | y | 小写字母y |
| 122 | 0x7A | z | 小写字母z |
| 123 | 0x7B | { | 开花括号 |
| 124 | 0x7C | \| | 垂线 |
| 125 | 0x7D | } | 闭花括号 |
| 126 | 0x7E | ~ | 波浪号 |
| 127 | 0x7F | DEL (delete) | 删除 |

## C++ 方式输入输出的格式化控制

| 控制符 | 作用 |
| ------ | ---- |
| dec | 设置整数为10进制 |
| hex | 设置整数为16进制 |
| oct | 设置整数为8进制 |
| setbase(n) | 设置整数为n进制(n=8,10,16) |
| setfill(c) | 设置填充字符，c可以是字符常量或字符变量 |
| setprecision(n) | 设置实数的精度为n位。在以一般十进制形式输出时，n代表有效数字。在以fixed(固定小数位)形式和scientific(指数)形式输出时，n为小数位数 |
| setw(n) | 设置字段宽度为n |
| setiosflags(ios::fixed) | 设置浮点数以固定的小数位数显示 |
| setiosflags(ios::scientific) | 设置浮点数以科学计数法（即指数形式）显示 |
| setiosflags(ios::left) | 输出数据左对齐 |
| setiosflags(ios::right) | 输出数据右对齐 |
| setiosflags(ios::skipws) | 忽略前导的空格 |
| setiosflags(ios::uppercase) | 在以科学计数法输出E和十六进制输出字母X时，以大写表示 |
| setiosflags(ios::showpos) | 输出正数时，给出“+”号 |
| resetiosflags(*) | 终止已设置的输出格式状态，括号内为具体内容(本处用*替代) |

## C 方式输入输出的格式化控制

<table border="1" cellpadding="8" cellspacing="0" style="width: auto">
  <thead>
    <tr>
      <th>格式字符</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <!-- printf所用的格式字符 -->
    <tr>
      <td colspan="2" style="font-weight: bold;">printf所用的格式字符的种类：</td>
    </tr>
    <tr><td>d, i</td><td>带符号的十进制形式整数(正数不带+)</td></tr>
    <tr><td>o</td><td>八进制无符号形式输出整数(不带前导0)</td></tr>
    <tr><td>x, X</td><td>十六进制无符号形式输出整数(不带前导0x)</td></tr>
    <tr><td>u</td><td>十进制无符号形式输出整数</td></tr>
    <tr><td>c</td><td>以字符形式输出(一个字符)</td></tr>
    <tr><td>s</td><td>输出字符串</td></tr>
    <tr><td>f</td><td>以小数形式输出浮点数</td></tr>
    <tr><td>e, E</td><td>以指数形式输出浮点数</td></tr>
    <tr><td>g, G</td><td>从f，e中选择宽度较短的形式输出浮点数</td></tr>
    <tr>
      <td colspan="2" style="font-weight: bold;">printf所用的附加格式字符的种类：</td>
    </tr>
    <tr><td>字母l</td><td>表示长整型整数，用于d,o,x,u前</td></tr>
    <tr><td>字母h</td><td>表示短整型整数，用于d,o,x,u前</td></tr>
    <tr><td>正整数m</td><td>表示输出数据的宽度</td></tr>
    <tr><td>正整数.n</td><td>对浮点数，表示n位小数；对字符串，表示前n个字符</td></tr>
    <tr><td>-</td><td>输出左对齐</td></tr>
    <tr>
      <td colspan="2" style="font-weight: bold;">scanf所用的格式字符的种类：</td>
    </tr>
    <tr><td>d, i</td><td>输入带符号的十进制形式整数</td></tr>
    <tr><td>o</td><td>输入八进制无符号形式整数(不带前导0)</td></tr>
    <tr><td>x, X</td><td>输入十六进制无符号形式整数(不带前导0x)</td></tr>
    <tr><td>u</td><td>输入十进制无符号形式整数</td></tr>
    <tr><td>c</td><td>输入单个字符</td></tr>
    <tr><td>s</td><td>输入字符串</td></tr>
    <tr><td>f</td><td>输入小数/指数形式的浮点数</td></tr>
    <tr><td>e, E, g, G</td><td>同f</td></tr>
    <tr>
      <td colspan="2" style="font-weight: bold;">scanf所用的附加格式字符的种类：</td>
    </tr>
    <tr><td>字母l</td><td>输入长整型数，用于d,o,x,u前；输入double型数，用于f,e,g前</td></tr>
    <tr><td>字母h</td><td>输入短整型数，用于d,o,x,u前</td></tr>
    <tr><td>正整数n</td><td>指定输入数据所占的宽度</td></tr>
    <tr><td>*</td><td>本输入项不赋给相应的变量</td></tr>
  </tbody>
</table>
