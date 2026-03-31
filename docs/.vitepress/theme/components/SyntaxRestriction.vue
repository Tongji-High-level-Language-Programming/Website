<!-- components/SyntaxCheck.vue -->
<script setup lang="ts">
import { computed } from "vue";
import { SyntaxDefinition, syntaxLib } from "./syntaxLib";

const props = defineProps<{
  allowed?: string[]; // 也可以改成接收 key 字符串 'if, while'
  banned?: string[];
}>();

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
        typeof item === "object" && item.name
          ? item.name
          : libData?.name || key,
      details:
        typeof item === "object" && item.detail
          ? item.detail
          : libData?.detail || "无详细说明",
      link: libData?.link,
    };
  });
};

const computedAllowed = computed(() =>
  props.allowed ? resolveSyntax(props.allowed, "allowed") : [],
);
const computedBanned = computed(() =>
  props.banned ? resolveSyntax(props.banned, "banned") : [],
);
</script>

<template>
  <div class="vp-raw flex flex-col gap-2 p-2">
    <!-- 允许列表 -->
    <div
      v-if="computedAllowed.length > 0"
      class="flex flex-wrap items-center gap-2"
    >
      <span class="text-sm font-bold text-(--vp-c-text-1) mr-1"
        >✅ 允许使用:</span
      >
      <div
        v-for="(item, i) in computedAllowed"
        :key="i"
        class="group relative cursor-help"
      >
        <span
          class="px-2 py-0.5 rounded text-xs font-mono bg-(--vp-c-green-dimm) text-(--vp-c-green-darker) border border-(--vp-c-green-dimm)"
        >
          {{ item.name }}
        </span>
        <!-- Tooltip 内容 -->
        <div
          class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-50 hidden group-hover:block z-10"
        >
          <div
            class="px-3 py-2 text-xs text-white bg-gray-800 rounded shadow-lg whitespace-normal text-center relative after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-t-gray-800 after:border-transparent"
            v-html="item.details"
          ></div>
        </div>
      </div>
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
            v-html="item.details"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
