<!-- components/ProblemItem.vue -->
<script setup lang="ts">
import { inject, onMounted, computed, ref } from "vue";
import { v7 as uuidv7 } from "uuid";
const props = defineProps<{ name: string; title: string }>();

const id = uuidv7();
const ctx = inject("problem-group-ctx") as any;

onMounted(() => {
  ctx.registerTab(id, props.name, props.title);
});

const isActive = computed(() => ctx.activeId.value === id);
</script>

<template>
  <div v-show="isActive" class="problem-item">
    <h3 class="mt-0!">
      {{ props.title }}
    </h3>
    <slot></slot>
  </div>
</template>

<style>
@reference "../tailwind.css";

.problem-item {
  div p {
    @apply font-sans;
  }
}
</style>
