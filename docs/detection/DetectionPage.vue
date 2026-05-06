<script setup lang="ts">
import { ref, shallowRef, nextTick, computed } from "vue";
import MonacoEditor from "./MonacoEditor.vue";
import type { HighlightRange } from "./MonacoEditor.vue";
import { checkCode, fetchHomeworkList } from "./api";
import type { ViolationItem, HomeworkItem } from "./api";
import { syntaxLib } from "../.vitepress/theme/components/syntaxLib";
import type { SyntaxKey } from "../.vitepress/theme/components/syntaxLib";

const code = ref(`\
#include <stdio.h>

int main() {
    int a, b;
    scanf("%d %d", &a, &b);

    if (a > b) {
        printf("Max: %d\\n", a);
    } else {
        printf("Max: %d\\n", b);
    }

    for (int i = 0; i < 10; i++) {
        printf("%d ", i);
    }

    return 0;
}
`);

const editorRef = shallowRef<InstanceType<typeof MonacoEditor>>();

// --- 白名单预设 ---
const selectedHomework = ref<string>("");

const homeworkList = ref<HomeworkItem[]>([]);
const presetsLoading = ref(false);
const presetsError = ref<string | null>(null);

async function loadHomeworkList() {
  presetsError.value = null;
  presetsLoading.value = true;
  try {
    homeworkList.value = await fetchHomeworkList();
  } catch (e) {
    presetsError.value = e instanceof Error ? e.message : "获取作业列表失败";
  } finally {
    presetsLoading.value = false;
  }
}

function getLimitName(key: string): string {
  if (key in syntaxLib) {
    return syntaxLib[key as SyntaxKey].name;
  }
  return key;
}

function selectHomework(title: string) {
  selectedHomework.value = title;
}

// --- 检测 ---
const checking = ref(false);
const violations = ref<ViolationItem[] | null>(null);
const checkError = ref<string | null>(null);

async function runCheck() {
  checkError.value = null;
  violations.value = null;
  editorRef.value?.clearHighlights();

  const trimmed = code.value.trim();
  if (!trimmed) {
    checkError.value = "代码为空，请先输入代码";
    return;
  }

  checking.value = true;
  try {
    const result = await checkCode(selectedHomework.value, trimmed);
    violations.value = result;

    await nextTick();
    const ranges: HighlightRange[] = result.map((v) => ({
      line: v.startLine,
      col: v.startCol,
      endLine: v.endLine,
      endCol: v.endCol,
    }));
    editorRef.value?.highlightViolations(ranges);
  } catch (e) {
    checkError.value = e instanceof Error ? e.message : "检测失败";
  } finally {
    checking.value = false;
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Presets -->
    <div
      class="flex flex-col gap-3 p-4 rounded-lg border border-(--vp-c-divider) bg-(--vp-c-bg-soft) not-prose"
    >
      <div class="flex items-center gap-4">
        <span class="text-sm font-bold shrink-0">白名单</span>
        <button
          @click="loadHomeworkList"
          :disabled="presetsLoading"
          class="px-4 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          :class="
            homeworkList.length > 0
              ? 'border-(--vp-c-divider) hover:bg-(--vp-c-bg) text-(--vp-c-text-1)'
              : 'bg-(--vp-c-brand) text-white border-(--vp-c-brand) hover:bg-(--vp-c-brand-dark)'
          "
        >
          <span v-if="presetsLoading" class="inline-flex items-center gap-1.5">
            <span
              class="inline-block w-3 h-3 border-2 border-current/30 border-t-current rounded-full animate-spin"
            />
            加载中...
          </span>
          <span v-else-if="homeworkList.length > 0">刷新作业列表</span>
          <span v-else>获取作业列表</span>
        </button>
      </div>

      <p v-if="presetsError" class="text-xs text-red-500">{{ presetsError }}</p>

      <!-- Homework cards -->
      <div v-if="homeworkList.length > 0" class="flex flex-wrap gap-3">
        <!-- "无限制" card -->
        <div
          @click="selectHomework('')"
          class="flex flex-col gap-1.5 p-3 rounded-lg border-2 cursor-pointer transition-colors min-w-[180px]"
          :class="
            selectedHomework === ''
              ? 'border-(--vp-c-brand) bg-(--vp-c-brand)/5'
              : 'border-(--vp-c-divider) hover:border-(--vp-c-brand)/40'
          "
        >
          <span class="text-sm font-semibold text-(--vp-c-text-1)">无限制</span>
          <span class="text-xs text-(--vp-c-text-3)">不限制任何知识点</span>
        </div>

        <!-- Homework cards -->
        <div
          v-for="hw in homeworkList"
          :key="hw.title"
          @click="selectHomework(hw.title)"
          class="flex flex-col gap-1.5 p-3 rounded-lg border-2 cursor-pointer transition-colors min-w-[200px]"
          :class="
            selectedHomework === hw.title
              ? 'border-(--vp-c-brand) bg-(--vp-c-brand)/5'
              : 'border-(--vp-c-divider) hover:border-(--vp-c-brand)/40'
          "
        >
          <span class="text-sm font-semibold text-(--vp-c-text-1)">{{
            hw.title
          }}</span>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="limit in hw.limits"
              :key="limit"
              class="px-1.5 py-0.5 text-[11px] rounded bg-(--vp-c-bg) border border-(--vp-c-divider) text-(--vp-c-text-2)"
              >{{ getLimitName(limit) }}</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Editor + check -->
    <div class="flex flex-col gap-4 not-prose">
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-(--vp-c-text-1)"
            >代码编辑器</span
          >
          <button
            @click="editorRef?.formatCode()"
            class="px-3 py-1 text-xs font-medium rounded-md border border-(--vp-c-divider) hover:bg-(--vp-c-bg-soft) transition-colors cursor-pointer text-(--vp-c-text-1)"
          >
            格式化代码
          </button>
        </div>
        <MonacoEditor
          ref="editorRef"
          v-model="code"
          language="c"
          theme="vs-dark"
          height="420px"
        />
      </div>

      <!-- Check bar -->
      <div
        class="flex items-center gap-4 p-3 rounded-lg border border-(--vp-c-divider) bg-(--vp-c-bg-soft) not-prose"
      >
        <button
          @click="runCheck"
          :disabled="checking"
          class="px-5 py-2 text-sm font-medium rounded-md text-white bg-(--vp-c-brand) hover:bg-(--vp-c-brand-dark) transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="checking" class="inline-flex items-center gap-1.5">
            <span
              class="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"
            />
            检测中...
          </span>
          <span v-else>检测代码</span>
        </button>
        <span
          v-if="violations && !checking"
          class="text-xs text-(--vp-c-text-2)"
        >
          检测完成，违规
          <span class="font-bold text-red-500">{{ violations.length }}</span> 处
        </span>
        <span
          v-else-if="!violations && !checking"
          class="text-xs text-(--vp-c-text-3)"
          >选择作业后点击检测</span
        >
      </div>

      <!-- Error -->
      <div
        v-if="checkError"
        class="px-4 py-3 text-sm rounded-lg border border-red-300 bg-red-50 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 not-prose"
      >
        {{ checkError }}
      </div>

      <!-- Results -->
      <div v-if="violations">
        <div class="text-sm font-medium mb-2 text-(--vp-c-text-1)">
          检测结果
          <span v-if="violations.length > 0" class="text-red-500"
            >（存在违规项）</span
          >
          <span v-else class="text-green-600">（未检出违规）</span>
        </div>
        <div
          v-if="violations.length > 0"
          class="border border-(--vp-c-divider) rounded-lg bg-(--vp-c-bg)"
        >
          <div class="p-3">
            <table class="w-full text-xs">
              <thead>
                <tr
                  class="border-b border-(--vp-c-divider) text-left text-(--vp-c-text-2)"
                >
                  <th class="pb-2 pr-4 font-medium">起始</th>
                  <th class="pb-2 pr-4 font-medium">结束</th>
                  <th class="pb-2 font-medium">错误类型</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(v, i) in violations"
                  :key="i"
                  class="border-b border-(--vp-c-divider)/50 last:border-0"
                >
                  <td class="py-1.5 pr-4 font-mono text-(--vp-c-text-1)">
                    {{ v.startLine }}行{{ v.startCol }}列
                  </td>
                  <td class="py-1.5 pr-4 font-mono text-(--vp-c-text-1)">
                    {{ v.endLine }}行{{ v.endCol }}列
                  </td>
                  <td class="py-1.5 text-red-600 dark:text-red-400">
                    {{ v.type }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div
          v-else
          class="border border-(--vp-c-divider) rounded-lg bg-(--vp-c-bg) p-6 text-center text-xs text-(--vp-c-text-3)"
        >
          未检出违规
        </div>
      </div>
    </div>
  </div>
</template>
