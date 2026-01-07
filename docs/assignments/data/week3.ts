import type { Problem } from "../Types";

export const week3Problems : Problem[] = [
    {
        name: "3-b1",
        title: "求圆相关",
        description: "键盘输入半径和高度（类型为 double 型，不考虑各种输入错误），依次求圆周长、圆面积、圆球表面积、圆球体积、圆柱体积，要求输入输出有对应提示信息，输出结果保留小数点后 2 位。",
        allowedSyntax: ["sequence", "basic-types", "stdio"],
        bannedSyntax: ["selection", "goto", "loop"],
        inputFormat: "共 1 行，包含由空格隔开的两个浮点数，分别表示半径和高度。",
        outputFormat: "共 6 行，如下所示：\n" +
        "Line 1: 提示“请输入半径和高度”\n" +
        "Line 2-6: 要求的五个值，每个一行",
        samples: [{
            input: "1 1",
            output: "请输入半径和高度\n" +
            "圆周长     : 6.28\n" +
            "圆面积     : 3.14\n" +
            "圆球表面积 : 12.57\n" +
            "圆球体积   : 4.19\n" +
            "圆柱体积   : 3.14\n"
        }],
        tips: "π 使用 <code>const double pi = 3.14159</code> 方式定义即可。"
    },
    {
        name: "3-b2",
        title: "整数分解",
        description: "键盘输入一个[1..30000]之间的整数（假设输入保证正确，不必考虑各种输入错误的情况），要求把每一位数字分解并打印出来。",
        inputFormat: "共 1 行，包含一个整数。",
        outputFormat: "共 6 行，如下所示：\n" +
        "Line 1: 提示“请输入一个[1..30000]间的整数:”\n" +
        "Line 2-6: 分解的各位值",
        samples: [{
            input: "307",
            output: "请输入一个[1..30000]间的整数:\n" +
            "万位 : 0\n" +
            "千位 : 0\n" +
            "百位 : 3\n" +
            "十位 : 0\n" +
            "个位 : 7\n"
        }, {
            input: "23154",
            output: "请输入一个[1..30000]间的整数:\n" +
            "万位 : 2\n" +
            "千位 : 3\n" +
            "百位 : 1\n" +
            "十位 : 5\n" +
            "个位 : 4\n"
        }],
    }
]
