import { ref } from "vue";

export interface ViolationItem {
  startLine: number;
  startCol: number;
  endLine: number;
  endCol: number;
  type: string;
}

/** true = mock 写死数据，false = 请求后端 */
export const isMock = ref(true);

export interface HomeworkItem {
  title: string;
  limits: string[];
}

export async function fetchHomeworkList(): Promise<HomeworkItem[]> {
  if (isMock.value) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [
      { title: "作业1白名单", limits: ["sequence", "basic-types", "stdio"] },
      {
        title: "作业2白名单",
        limits: ["sequence", "basic-types", "stdio", "selection"],
      },
      {
        title: "作业3白名单",
        limits: ["sequence", "basic-types", "stdio", "selection", "loop"],
      },
      {
        title: "作业4白名单",
        limits: [
          "sequence",
          "basic-types",
          "stdio",
          "selection",
          "loop",
          "function",
        ],
      },
      {
        title: "作业5白名单",
        limits: [
          "sequence",
          "basic-types",
          "stdio",
          "selection",
          "loop",
          "function",
          "array",
        ],
      },
    ];
  }

  const res = await fetch("/listHomework");
  if (!res.ok) {
    throw new Error(`获取作业列表失败: ${res.status}`);
  }
  return res.json();
}

export async function checkCode(
  title: string,
  code: string,
): Promise<ViolationItem[]> {
  if (isMock.value) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [
      { startLine: 3, startCol: 5, endLine: 3, endCol: 8, type: "for 循环" },
      {
        startLine: 9,
        startCol: 7,
        endLine: 9,
        endCol: 11,
        type: "if-else 选择结构",
      },
    ];
  }

  const res = await fetch("/api/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, code }),
  });
  if (!res.ok) {
    throw new Error(`检测请求失败: ${res.status}`);
  }
  return res.json();
}
