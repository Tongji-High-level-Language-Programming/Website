<script setup lang="ts">
import { computed } from "vue";
import { withBase } from "vitepress";

const props = withDefaults(
  defineProps<{
    href: string;
    label: string;
    downloadName?: string;
  }>(),
  {
    downloadName: "",
  },
);

const resolvedHref = computed(() => withBase(props.href));
</script>

<template>
  <a :href="resolvedHref" :download="downloadName || undefined">
    {{ label }}
  </a>
</template>
