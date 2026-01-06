<script setup lang="ts">
import { ref, computed } from "vue";
import { useClipboard, useStorage } from "@vueuse/core";
import type { Problem } from "./Types";
import { SyntaxDefinition, syntaxLib } from "./SyntaxLib";

const props = defineProps<{
  problems: Problem[];
  storageKey?: string;
}>();

const activeIndex = useStorage(props.storageKey || "problem-tab-idx", 0);
const safeActiveIndex = computed(() => {
  if (!props.problems || props.problems.length === 0) return 0;
  return activeIndex.value >= props.problems.length ? 0 : activeIndex.value;
});
const currentProblem = computed(() => props.problems[safeActiveIndex.value]);
const { copy, isSupported } = useClipboard();

// 简单的辅助函数，解析语法对象
const resolveSyntax = (items: any[], type: "allowed" | "banned") => {
  if (!items) return [];
  return items.map((item) => {
    const key = typeof item === "string" ? item : item.key;
    const libData = syntaxLib[
      key as keyof typeof syntaxLib
    ] as SyntaxDefinition;
    // 简单的回退逻辑
    return {
      name:
        typeof item !== "string" && item.name
          ? item.name
          : libData?.name || key,
      reason:
        typeof item !== "string" && item.reason
          ? item.reason
          : libData?.detail || "无详细说明",
      link: libData?.link,
    };
  });
};

const computedAllowed = computed(() =>
  currentProblem.value
    ? resolveSyntax(currentProblem.value.allowedSyntax, "allowed")
    : []
);
const computedBanned = computed(() =>
  currentProblem.value
    ? resolveSyntax(currentProblem.value.bannedSyntax, "banned")
    : []
);
</script>

<template>
  <!-- 外层容器：使用 VitePress 主题变量作为边框和背景 -->
  <div
    class="mt-6 border border-(--vp-c-divider) rounded-lg bg-(--vp-c-bg-soft) overflow-hidden"
  >
    <!-- 1. 选项卡导航 -->
    <!-- overflow-x-auto 允许在移动端横向滚动 Tabs -->
    <div
      class="flex border-b border-(--vp-c-divider) overflow-x-auto scrollbar-hide"
    >
      <button
        v-for="(problem, index) in problems"
        :key="index"
        @click="activeIndex = index"
        class="px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-200"
        :class="[
          index === safeActiveIndex
            ? 'text-(--vp-c-brand) border-b-2 border-(--vp-c-brand) bg-(--vp-c-bg)'
            : 'text-(--vp-c-text-2) hover:text-(--vp-c-brand)',
        ]"
      >
        {{ problem.name }}
      </button>
    </div>

    <!-- 2. 题目内容区域 -->
    <div v-if="currentProblem" class="p-5">
      <h3 class="text-xl font-bold mb-4 text-(--vp-c-text-1)">
        {{ currentProblem.name }}
      </h3>

      <!-- 题目描述 -->
      <!-- prose 类通常来自 @tailwindcss/typography 插件，如果没有可以用 text-base -->
      <div
        class="text-(--vp-c-text-1) leading-relaxed mb-6"
        v-html="currentProblem.description"
      ></div>

      <!-- 语法限制区域 -->
      <div class="my-4 p-4 bg-(--vp-c-bg-alt) rounded-md space-y-3">
        <!-- 允许列表 -->
        <div
          v-if="computedAllowed.length > 0"
          class="flex flex-wrap items-center gap-2"
        >
          <span class="text-sm font-bold text-(--vp-c-text-1) mr-1"
            >✅ 允许使用:</span
          >
          <span
            v-for="(item, i) in computedAllowed"
            :key="i"
            class="px-2 py-0.5 rounded text-xs font-mono bg-(--vp-c-green-dimm) text-(--vp-c-green-darker) border border-(--vp-c-green-dimm)"
          >
            {{ item.name }}
          </span>
        </div>

        <!-- 禁止列表 -->
        <div
          v-if="computedBanned.length > 0"
          class="flex flex-wrap items-center gap-2"
        >
          <span class="text-sm font-bold text-(--vp-c-text-1) mr-1"
            >🚫 禁止使用:</span
          >

          <!-- Tooltip 实现：使用 group relative + absolute hidden group-hover:block -->
          <div
            v-for="(item, i) in computedBanned"
            :key="i"
            class="group relative cursor-help"
          >
            <span
              class="px-2 py-0.5 rounded text-xs font-mono bg-(--vp-c-red-dimm) text-(--vp-c-red-darker) border border-(--vp-c-red-dimm)"
            >
              {{ item.name }}
            </span>

            <!-- Tooltip 内容 -->
            <div
              class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-50 hidden group-hover:block z-10"
            >
              <div
                class="px-3 py-2 text-xs text-white bg-gray-800 rounded shadow-lg whitespace-normal text-center relative after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-t-gray-800 after:border-transparent"
              >
                {{ item.reason }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 格式说明 -->
      <div class="space-y-1 mb-6 text-sm text-(--vp-c-text-2)">
        <div>
          <strong class="text-(--vp-c-text-1)">输入格式：</strong>
          <div class="whitespace-pre-wrap leading-relaxed">
            {{ currentProblem.inputFormat }}
          </div>
        </div>
        <div>
          <strong class="text-(--vp-c-text-1)">输出格式：</strong>
          <div class="whitespace-pre-wrap leading-relaxed">
            {{ currentProblem.outputFormat }}
          </div>
        </div>
      </div>

      <!-- 样例区域 -->
      <div
        v-for="(sample, idx) in currentProblem.samples"
        :key="idx"
        class="flex flex-col md:flex-row gap-4 mt-4"
      >
        <!-- 输入框 -->
        <div
          class="flex-1 border border-(--vp-c-divider) rounded-md bg-(--vp-c-bg) overflow-hidden"
        >
          <div
            class="flex justify-between items-center px-3 py-2 bg-(--vp-c-bg-soft) border-b border-(--vp-c-divider)"
          >
            <span class="text-xs font-medium text-(--vp-c-text-2)"
              >样例输入 {{ idx + 1 }}</span
            >
            <CopyButton
              v-if="isSupported"
              :text="sample.input"
            >
            </CopyButton>
          </div>
          <pre
            class="p-3 m-0 overflow-x-auto font-mono text-sm leading-snug text-(--vp-c-text-1)"
            >{{ sample.input }}</pre
          >
        </div>

        <!-- 输出框 -->
        <div
          class="flex-1 border border-(--vp-c-divider) rounded-md bg-(--vp-c-bg) overflow-hidden"
        >
          <div
            class="vp-raw flex justify-between items-center px-3 py-2 bg-(--vp-c-bg-soft) border-b border-(--vp-c-divider)"
          >
            <span class="text-xs font-medium text-(--vp-c-text-2)"
              >样例输出 {{ idx + 1 }}</span
            >
            <CopyButton
              v-if="isSupported"
              :text="sample.output"
            >
            </CopyButton>
          </div>
          <pre
            class="p-3 m-0 overflow-x-auto font-mono text-sm leading-snug text-(--vp-c-text-1)"
            >{{ sample.output }}</pre
          >
        </div>
      </div>
    </div>
  </div>
</template>
