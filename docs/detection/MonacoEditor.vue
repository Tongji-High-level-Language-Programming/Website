<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, shallowRef } from "vue";
import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import type { editor, languages } from "monaco-editor";

// clang-format WASM
import initClangFormat, {
  format as clangFormat,
} from "@wasm-fmt/clang-format/vite";

// Project .clang-format config: LLVM base + Stroustrup braces + 4-space indent
const CLANG_FORMAT_STYLE =
  "{BasedOnStyle: LLVM, IndentWidth: 4, BreakBeforeBraces: Stroustrup, AllowShortBlocksOnASingleLine: Never, AllowShortFunctionsOnASingleLine: None, IndentCaseLabels: true}";

let clangFormatReady = false;

// Initialize clang-format WASM (runs once at module level)
const initPromise = initClangFormat().then(() => {
  clangFormatReady = true;
});

// Configure Monaco environment
self.MonacoEnvironment = {
  getWorker(_: string, label: string) {
    switch (label) {
      case "css":
      case "less":
      case "scss":
        return new cssWorker();
      case "html":
      case "handlebars":
      case "razor":
        return new htmlWorker();
      case "json":
        return new jsonWorker();
      case "typescript":
      case "javascript":
        return new tsWorker();
      default:
        return new editorWorker();
    }
  },
};

// --- Register C/C++ format providers via clang-format WASM ---
const cFamilyLanguages = ["c", "cpp"];

function registerFormatProviders() {
  for (const lang of cFamilyLanguages) {
    monaco.languages.registerDocumentFormattingEditProvider(lang, {
      async provideDocumentFormattingEdits(
        model: editor.ITextModel,
      ): Promise<languages.TextEdit[]> {
        if (!clangFormatReady) return [];

        const filename = lang === "c" ? "main.c" : "main.cpp";
        try {
          const formatted = clangFormat(
            model.getValue(),
            filename,
            CLANG_FORMAT_STYLE,
          );

          const fullRange = model.getFullModelRange();
          return [{ range: fullRange, text: formatted }];
        } catch {
          // If formatting fails, return empty (no changes)
          return [];
        }
      },
    });
  }
}

// Register once at module level
registerFormatProviders();

// --- Component ---
const props = withDefaults(
  defineProps<{
    modelValue?: string;
    language?: string;
    theme?: "vs" | "vs-dark";
    readOnly?: boolean;
    height?: string;
  }>(),
  {
    modelValue: "",
    language: "c",
    theme: "vs-dark",
    readOnly: false,
    height: "500px",
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
  change: [value: string];
}>();

const containerRef = ref<HTMLDivElement>();
const editorInstance = shallowRef<editor.IStandaloneCodeEditor>();
const decorations = ref<string[]>([]);

onMounted(() => {
  if (!containerRef.value) return;

  editorInstance.value = monaco.editor.create(containerRef.value, {
    value: props.modelValue,
    language: props.language,
    theme: props.theme,
    automaticLayout: true,
    readOnly: props.readOnly,
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: "on",
    scrollBeyondLastLine: false,
    tabSize: 4,
  });

  editorInstance.value.onDidChangeModelContent(() => {
    const value = editorInstance.value!.getValue();
    emit("update:modelValue", value);
    emit("change", value);
  });
});

onUnmounted(() => {
  editorInstance.value?.dispose();
});

watch(
  () => props.modelValue,
  (newVal) => {
    if (editorInstance.value && editorInstance.value.getValue() !== newVal) {
      editorInstance.value.setValue(newVal);
    }
  },
);

watch(
  () => props.language,
  (newLang) => {
    if (editorInstance.value) {
      const model = editorInstance.value.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, newLang);
      }
    }
  },
);

watch(
  () => props.theme,
  (newTheme) => {
    if (editorInstance.value) {
      monaco.editor.setTheme(newTheme);
    }
  },
);

export interface HighlightRange {
  line: number;
  col: number;
  endLine: number;
  endCol: number;
}

function highlightViolations(ranges: HighlightRange[]) {
  if (!editorInstance.value) return;
  const newDecorations = ranges.map((r) => ({
    range: new monaco.Range(r.line, r.col, r.endLine, r.endCol),
    options: {
      inlineClassName: "violation-squiggle",
    },
  }));
  decorations.value = editorInstance.value.deltaDecorations(
    decorations.value,
    newDecorations,
  );
}

function clearHighlights() {
  decorations.value =
    editorInstance.value?.deltaDecorations(decorations.value, []) ?? [];
}

async function formatCode() {
  if (!editorInstance.value) return;
  await initPromise;
  await editorInstance.value.getAction("editor.action.formatDocument")?.run();
}

defineExpose({ highlightViolations, clearHighlights, formatCode });
</script>

<template>
  <div ref="containerRef" class="monaco-editor-container" :style="{ height }" />
</template>

<style scoped>
.monaco-editor-container {
  width: 100%;
  min-height: 300px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}
</style>

<style>
.violation-squiggle {
  text-decoration: underline wavy rgba(255, 0, 0, 0.85) !important;
  text-underline-offset: 3px;
}
</style>
