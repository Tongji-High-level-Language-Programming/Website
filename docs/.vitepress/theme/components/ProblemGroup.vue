<!-- components/ProblemGroup.vue -->
<script setup lang="ts">
import { ref, provide, readonly } from "vue";

// 定义 Tab 数据结构
interface Tab {
  id: string;
  name: string;
  title: string;
}

const tabs = ref<Tab[]>([]);
const activeId = ref<string>("");

// 提供给子组件的注册函数
const registerTab = (id: string, name: string, title: string) => {
  tabs.value.push({ id, name, title });
  // 默认选中第一个注册的
  if (tabs.value.length === 1) {
    activeId.value = id;
  }
  return tabs.value.length;
};

// 提供 Context 给子组件
provide("problem-group-ctx", {
  activeId: readonly(activeId),
  registerTab,
});
</script>

<template>
  <div
    class="mt-6 border border-(--vp-c-divider) rounded-lg bg-(--vp-c-bg) overflow-hidden flex flex-col"
  >
    <!-- 头部 Tab 导航 -->
    <div
      class="vp-raw flex border-b border-(--vp-c-divider) overflow-x-auto scrollbar-hide"
    >
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeId = tab.id"
        class="px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-200 border-b-2"
        :class="[
          activeId === tab.id
            ? 'text-(--vp-c-brand) border-(--vp-c-brand) bg-(--vp-c-bg-soft)'
            : 'text-(--vp-c-text-2) border-transparent hover:text-(--vp-c-brand)',
        ]"
      >
        {{ tab.name }}. {{ tab.title }}
      </button>
    </div>

    <!-- 子组件渲染区域 -->
    <div class="p-6 bg-(--vp-c-bg)">
      <slot></slot>
    </div>
  </div>
</template>
