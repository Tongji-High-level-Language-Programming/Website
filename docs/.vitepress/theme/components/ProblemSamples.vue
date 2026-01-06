<!-- components/ProblemSamples.vue -->
<script setup lang="ts">
import CopyButton from './CopyButton.vue'

defineProps<{
  data: { input: string; output: string }[]
}>()
</script>

<template>
  <div class="space-y-4 my-4 not-prose vp-raw">
    <div v-for="(item, idx) in data" :key="idx" class="flex flex-col md:flex-row gap-4">
      
      <!-- 输入框 -->
      <div class="flex-1 border border-(--vp-c-divider) rounded-md bg-(--vp-c-bg) overflow-hidden flex flex-col">
         <div class="flex justify-between items-center px-3 py-2 bg-(--vp-c-bg-soft) border-b border-(--vp-c-divider)">
            <span class="text-xs font-medium text-(--vp-c-text-2)">样例输入 {{ idx + 1 }}</span>
            <CopyButton :text="item.input" />
         </div>
         <pre class="p-3 m-0 overflow-x-auto font-mono text-sm leading-snug text-(--vp-c-text-1)">{{ item.input }}</pre>
      </div>

      <!-- 输出框 -->
      <div class="flex-1 border border-(--vp-c-divider) rounded-md bg-(--vp-c-bg) overflow-hidden flex flex-col">
         <div class="flex justify-between items-center px-3 py-2 bg-(--vp-c-bg-soft) border-b border-(--vp-c-divider)">
            <span class="text-xs font-medium text-(--vp-c-text-2)">样例输出 {{ idx + 1 }}</span>
            <CopyButton :text="item.output" />
         </div>
         <pre class="p-3 m-0 overflow-x-auto font-mono text-sm leading-snug text-(--vp-c-text-1)">{{ item.output }}</pre>
      </div>

    </div>
  </div>
</template>