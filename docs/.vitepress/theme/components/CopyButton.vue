<script setup lang="ts">
import { ref } from "vue";
import { useClipboard } from "@vueuse/core";

/**
 * text: 需要复制的内容
 */
const props = defineProps<{
  text: string;
}>();

const { copy, isSupported } = useClipboard();

const copied = ref(false);

let resetStateTimeout : number | null = null;

const handleClick = () => {
  copy(props.text);
  copied.value = true;
  if (resetStateTimeout !== null) {
    clearTimeout(resetStateTimeout);
  }

  // 独立的计时器，互不干扰
  resetStateTimeout = setTimeout(() => {
    copied.value = false;
    resetStateTimeout = null;
  }, 1500);
};
</script>

<template>
  <button
    v-if="isSupported"
    @click="handleClick"
    title="复制到剪贴板"
    class="vp-raw text-xs px-2 py-0.5 rounded transition-colors duration-200 cursor-pointer"
    :class="[ 
      copied
        ? 'text-green-600 font-bold bg-green-50/50'
        : 'text-(--vp-c-brand) hover:bg-(--vp-c-brand-dimm)',
    ]"
  >
    {{ copied ? "已复制!" : "复制" }}
  </button>
</template>
