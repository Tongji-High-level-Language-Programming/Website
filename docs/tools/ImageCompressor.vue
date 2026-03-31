<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from "vue";
import { useDropZone, useFileDialog } from "@vueuse/core";
import Compressor from "compressorjs";

interface CompressResult {
  id: string;
  originalFile: File;
  compressedBlob: Blob | null;
  originalUrl: string;
  compressedUrl: string;
  originalSize: number;
  compressedSize: number;
  status: "pending" | "compressing" | "done" | "error";
  error?: string;
}

// --- 压缩选项 ---
const options = reactive({
  quality: 0.4,
  maxWidth: 1024,
  maxHeight: 0,
  mimeType: "image/webp", // '' = auto
});

const results = ref<CompressResult[]>([]);
const dropZoneRef = ref<HTMLDivElement>();
const isOverDropZone = ref(false);

// --- 格式化文件大小 ---
function formatSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// --- 计算压缩率 ---
function compressionRatio(original: number, compressed: number): string {
  if (original === 0) return "0%";
  const ratio = ((1 - compressed / original) * 100).toFixed(1);
  return `${ratio}%`;
}

// --- 总计统计 ---
const stats = computed(() => {
  const done = results.value.filter((r) => r.status === "done");
  const totalOriginal = done.reduce((sum, r) => sum + r.originalSize, 0);
  const totalCompressed = done.reduce((sum, r) => sum + r.compressedSize, 0);
  return {
    count: done.length,
    totalOriginal,
    totalCompressed,
    saved: totalOriginal - totalCompressed,
    ratio:
      totalOriginal > 0
        ? ((1 - totalCompressed / totalOriginal) * 100).toFixed(1) + "%"
        : "0%",
  };
});

// --- 核心压缩逻辑 ---
function compressFile(file: File): Promise<CompressResult> {
  function generateRandomId() {
    if (window.isSecureContext) {
      return crypto.randomUUID();
    } else {
      // Fallback for non-secure contexts
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);

      bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
      bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10xx

      const hex = Array.from(bytes, (b) =>
        b.toString(16).padStart(2, "0"),
      ).join("");

      return [
        hex.slice(0, 8),
        hex.slice(8, 12),
        hex.slice(12, 16),
        hex.slice(16, 20),
        hex.slice(20, 32),
      ].join("-");
    }
  }
  const id = generateRandomId();
  const originalUrl = URL.createObjectURL(file);
  const result: CompressResult = {
    id,
    originalFile: file,
    compressedBlob: null,
    originalUrl,
    compressedUrl: "",
    originalSize: file.size,
    compressedSize: 0,
    status: "compressing",
  };

  return new Promise((resolve) => {
    new Compressor(file, {
      quality: options.quality,
      maxWidth: options.maxWidth || undefined,
      maxHeight: options.maxHeight || undefined,
      mimeType: options.mimeType || undefined,
      success(blob) {
        result.compressedBlob = blob;
        result.compressedUrl = URL.createObjectURL(blob);
        result.compressedSize = blob.size;
        result.status = "done";
        resolve(result);
      },
      error(err) {
        result.status = "error";
        result.error = err.message;
        resolve(result);
      },
    });
  });
}

// --- 处理文件列表 ---
async function handleFiles(files: File[] | FileList | null) {
  if (!files) return;
  const imageFiles = Array.from(files).filter((f) =>
    f.type.startsWith("image/"),
  );
  if (imageFiles.length === 0) return;

  for (const file of imageFiles) {
    const result = await compressFile(file);
    results.value.unshift(result);
  }
}

// --- 拖拽区域 ---
const { isOverDropZone: _isOver } = useDropZone(dropZoneRef, {
  onDrop(files) {
    isOverDropZone.value = false;
    handleFiles(files);
  },
  onOver() {
    isOverDropZone.value = true;
  },
  onLeave() {
    isOverDropZone.value = false;
  },
  dataTypes: [
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/gif",
    "image/bmp",
  ],
});

// --- 文件选择对话框 ---
const { open: openFileDialog, onChange: onFileChange } = useFileDialog({
  accept: "image/*",
  multiple: true,
});
onFileChange((files) => {
  handleFiles(files);
});

// --- 粘贴支持 ---

function handlePaste(event: ClipboardEvent) {
  const items = event.clipboardData?.items;
  if (!items) return;
  const files: File[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.type.startsWith("image/")) {
      const file = item.getAsFile();
      if (file) files.push(file);
    }
  }
  if (files.length > 0) {
    event.preventDefault();
    handleFiles(files);
  }
}

onMounted(() => {
  document.addEventListener("paste", handlePaste);
});

onUnmounted(() => {
  document.removeEventListener("paste", handlePaste);
});
// --- 下载单个 ---
function downloadFile(result: CompressResult) {
  if (!result.compressedBlob) return;
  const a = document.createElement("a");
  a.href = result.compressedUrl;
  const ext = result.compressedBlob.type.split("/")[1] || "jpg";
  const name = result.originalFile.name.replace(/\.[^.]+$/, "");
  a.download = `${name}_compressed.${ext}`;
  a.click();
}

// --- 下载全部 (逐个下载) ---
function downloadAll() {
  results.value
    .filter((r) => r.status === "done")
    .forEach((r) => downloadFile(r));
}

// --- 删除单个 ---
function removeResult(id: string) {
  const idx = results.value.findIndex((r) => r.id === id);
  if (idx !== -1) {
    URL.revokeObjectURL(results.value[idx].originalUrl);
    if (results.value[idx].compressedUrl) {
      URL.revokeObjectURL(results.value[idx].compressedUrl);
    }
    results.value.splice(idx, 1);
  }
}

// --- 清空全部 ---
function clearAll() {
  results.value.forEach((r) => {
    URL.revokeObjectURL(r.originalUrl);
    if (r.compressedUrl) URL.revokeObjectURL(r.compressedUrl);
  });
  results.value = [];
}

// --- 重新压缩全部 ---
async function recompressAll() {
  const oldResults = [...results.value];
  results.value = [];
  for (const old of oldResults) {
    URL.revokeObjectURL(old.originalUrl);
    if (old.compressedUrl) URL.revokeObjectURL(old.compressedUrl);
    const result = await compressFile(old.originalFile);
    results.value.push(result);
  }
}

// --- 预览相关 ---
const previewItem = ref<CompressResult | null>(null);
const showPreview = ref(false);
const previewMode = ref<"original" | "compressed" | "slider">("slider");

function openPreview(item: CompressResult) {
  previewItem.value = item;
  previewMode.value = "slider";
  showPreview.value = true;
}
function closePreview() {
  showPreview.value = false;
  previewItem.value = null;
}

const sliderPosition = ref(50);
</script>

<template>
  <div class="w-full max-w-5xl mx-auto py-8 px-4">
    <!-- 标题 -->
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        🖼️ 在线图片压缩
      </h2>
      <p class="text-gray-500 dark:text-gray-400 text-sm">
        基于 Compressor.js · 纯浏览器端处理 · 图片不会上传到任何服务器
      </p>
    </div>

    <!-- 压缩选项面板 -->
    <details
      class="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <summary
        class="px-6 py-4 cursor-pointer select-none font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-xl transition-colors"
      >
        ⚙️ 压缩选项
      </summary>
      <div
        class="px-6 pb-5 pt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <!-- 质量 -->
        <div>
          <label
            class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
          >
            质量 (Quality):
            <span class="text-blue-600 dark:text-blue-400 font-bold">{{
              options.quality
            }}</span>
          </label>
          <input
            v-model.number="options.quality"
            type="range"
            min="0.01"
            max="1"
            step="0.01"
            class="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div class="flex justify-between text-xs text-gray-400 mt-1">
            <span>0.01</span>
            <span>1.0</span>
          </div>
        </div>
        <!-- 最大宽度 -->
        <div>
          <label
            class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
          >
            最大宽度 (px)
          </label>
          <input
            v-model.number="options.maxWidth"
            type="number"
            min="0"
            step="100"
            placeholder="0 = 不限制"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        <!-- 最大高度 -->
        <div>
          <label
            class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
          >
            最大高度 (px)
          </label>
          <input
            v-model.number="options.maxHeight"
            type="number"
            min="0"
            step="100"
            placeholder="0 = 不限制"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        <!-- 输出格式 -->
        <div>
          <label
            class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
          >
            输出格式
          </label>
          <select
            v-model="options.mimeType"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="">自动 (保持原格式)</option>
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WebP</option>
          </select>
        </div>
      </div>
    </details>

    <!-- 拖拽上传区域 -->
    <div
      ref="dropZoneRef"
      :class="[
        'relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 mb-6',
        isOverDropZone
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]'
          : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50',
      ]"
      @click="() => openFileDialog()"
    >
      <div class="space-y-3">
        <div class="text-5xl">
          {{ isOverDropZone ? "📥" : "📁" }}
        </div>
        <div class="text-lg font-medium text-gray-700 dark:text-gray-200">
          拖拽图片到此处 / 点击选择 /
          <kbd
            class="px-2 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs font-mono"
            >Ctrl+V</kbd
          >
          粘贴
        </div>
        <div class="text-sm text-gray-400">
          支持 JPEG、PNG、WebP、GIF、BMP 格式，可批量处理
        </div>
      </div>
    </div>

    <!-- 统计栏 + 操作按钮 -->
    <div
      v-if="results.length > 0"
      class="flex flex-wrap items-center justify-between gap-4 mb-6 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-4 border border-blue-100 dark:border-gray-700"
    >
      <div class="flex flex-wrap items-center gap-4 text-sm">
        <span
          class="inline-flex items-center gap-1 font-medium text-gray-700 dark:text-gray-200"
        >
          📊 已处理
          <span class="text-blue-600 dark:text-blue-400 font-bold">{{
            stats.count
          }}</span>
          张
        </span>
        <span class="text-gray-400">|</span>
        <span class="text-gray-600 dark:text-gray-300">
          {{ formatSize(stats.totalOriginal) }} →
          {{ formatSize(stats.totalCompressed) }}
        </span>
        <span class="text-gray-400">|</span>
        <span class="text-green-600 dark:text-green-400 font-bold">
          节省 {{ formatSize(stats.saved) }} ({{ stats.ratio }})
        </span>
      </div>
      <div class="flex gap-2">
        <button
          @click="recompressAll"
          class="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          🔄 重新压缩
        </button>
        <button
          @click="downloadAll"
          class="px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          💾 全部下载
        </button>
        <button
          @click="clearAll"
          class="px-3 py-1.5 text-xs font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          🗑️ 清空
        </button>
      </div>
    </div>

    <!-- 结果列表 -->
    <TransitionGroup name="list" tag="div" class="space-y-3">
      <div
        v-for="item in results"
        :key="item.id"
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-md"
      >
        <!-- 错误状态 -->
        <div v-if="item.status === 'error'" class="flex items-center gap-4 p-4">
          <div
            class="w-14 h-14 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-2xl shrink-0"
          >
            ❌
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-medium text-gray-800 dark:text-gray-200 truncate">
              {{ item.originalFile.name }}
            </div>
            <div class="text-sm text-red-500">压缩失败: {{ item.error }}</div>
          </div>
          <button
            @click="removeResult(item.id)"
            class="p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- 压缩中 -->
        <div
          v-else-if="item.status === 'compressing'"
          class="flex items-center gap-4 p-4"
        >
          <div
            class="w-14 h-14 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0"
          >
            <svg
              class="w-7 h-7 text-blue-500 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-medium text-gray-800 dark:text-gray-200 truncate">
              {{ item.originalFile.name }}
            </div>
            <div class="text-sm text-blue-500">压缩中...</div>
          </div>
        </div>

        <!-- 压缩完成 -->
        <div v-else class="flex flex-col sm:flex-row items-stretch">
          <!-- 缩略图 -->
          <div
            class="sm:w-28 h-24 sm:h-auto bg-gray-100 dark:bg-gray-700 flex items-center justify-center cursor-pointer shrink-0 overflow-hidden"
            @click="openPreview(item)"
          >
            <img
              :src="item.compressedUrl"
              :alt="item.originalFile.name"
              class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>
          <!-- 信息 -->
          <div
            class="flex-1 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 min-w-0"
          >
            <div class="flex-1 min-w-0">
              <div
                class="font-medium text-gray-800 dark:text-gray-200 truncate text-sm"
                :title="item.originalFile.name"
              >
                {{ item.originalFile.name }}
              </div>
              <div
                class="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-gray-500 dark:text-gray-400"
              >
                <span
                  >原始:
                  <span class="font-medium text-gray-700 dark:text-gray-300">{{
                    formatSize(item.originalSize)
                  }}</span></span
                >
                <span
                  >压缩后:
                  <span class="font-medium text-gray-700 dark:text-gray-300">{{
                    formatSize(item.compressedSize)
                  }}</span></span
                >
                <span
                  :class="[
                    'font-bold',
                    item.compressedSize < item.originalSize
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-orange-500',
                  ]"
                >
                  {{ item.compressedSize < item.originalSize ? "↓" : "↑" }}
                  {{ compressionRatio(item.originalSize, item.compressedSize) }}
                </span>
              </div>
            </div>
            <!-- 操作按钮 -->
            <div class="flex items-center gap-1.5 shrink-0">
              <button
                @click="openPreview(item)"
                class="p-2 text-gray-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                title="预览对比"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
              <button
                @click="downloadFile(item)"
                class="p-2 text-gray-400 hover:text-green-500 transition-colors rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
                title="下载"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </button>
              <button
                @click="removeResult(item.id)"
                class="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                title="删除"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>

    <!-- 空状态 -->
    <div
      v-if="results.length === 0"
      class="text-center py-12 text-gray-400 dark:text-gray-500"
    >
      <div class="text-6xl mb-4 opacity-50">🌄</div>
      <div>还没有图片，快来试试吧</div>
    </div>

    <!-- 预览弹窗 -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showPreview && previewItem"
          class="fixed inset-0 z-9999 flex items-center justify-center p-4"
          @click.self="closePreview"
        >
          <!-- 遮罩 -->
          <div
            class="absolute inset-0 bg-black/70 backdrop-blur-sm"
            @click="closePreview"
          />
          <!-- 弹窗内容 -->
          <div
            class="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden z-10 flex flex-col"
          >
            <!-- 头部 -->
            <div
              class="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-700"
            >
              <h3
                class="font-semibold text-gray-800 dark:text-gray-100 truncate text-sm"
              >
                {{ previewItem.originalFile.name }}
              </h3>
              <div class="flex items-center gap-2">
                <!-- 模式切换 -->
                <div class="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
                  <button
                    v-for="mode in [
                      'original',
                      'slider',
                      'compressed',
                    ] as const"
                    :key="mode"
                    @click="previewMode = mode"
                    :class="[
                      'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                      previewMode === mode
                        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300',
                    ]"
                  >
                    {{
                      mode === "original"
                        ? "原图"
                        : mode === "compressed"
                          ? "压缩后"
                          : "对比"
                    }}
                  </button>
                </div>
                <button
                  @click="closePreview"
                  class="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <!-- 图片区域 -->
            <div
              class="flex-1 overflow-auto p-4 flex items-center justify-center bg-[repeating-conic-gradient(#f3f4f6_0%_25%,#fff_0%_50%)] dark:bg-[repeating-conic-gradient(#1f2937_0%_25%,#111827_0%_50%)] bg-size-[20px_20px]"
            >
              <!-- 原图模式 -->
              <img
                v-if="previewMode === 'original'"
                :src="previewItem.originalUrl"
                class="max-w-full max-h-[65vh] object-contain"
              />
              <!-- 压缩后模式 -->
              <img
                v-else-if="previewMode === 'compressed'"
                :src="previewItem.compressedUrl"
                class="max-w-full max-h-[65vh] object-contain"
              />
              <!-- 滑块对比模式 -->
              <div
                v-else
                class="relative w-full max-h-[65vh] overflow-hidden select-none"
                style="aspect-ratio: auto"
              >
                <!-- 压缩后图 (底层) -->
                <img
                  :src="previewItem.compressedUrl"
                  class="w-full h-full max-h-[65vh] object-contain"
                />
                <!-- 原图 (裁剪层) -->
                <div
                  class="absolute inset-0 overflow-hidden"
                  :style="{ width: sliderPosition + '%' }"
                >
                  <img
                    :src="previewItem.originalUrl"
                    class="w-full h-full object-contain"
                    :style="{
                      minWidth: '100%',
                      maxWidth: 'none',
                      width: (100 / sliderPosition) * 100 + '%',
                    }"
                    style="max-width: none"
                  />
                </div>
                <!-- 分割线 -->
                <div
                  class="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg cursor-ew-resize z-10"
                  :style="{ left: sliderPosition + '%' }"
                >
                  <div
                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center"
                  >
                    <svg
                      class="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </div>
                </div>
                <!-- 标签 -->
                <div
                  class="absolute top-3 left-3 px-2 py-1 bg-black/50 text-white text-xs rounded-md"
                >
                  原图
                </div>
                <div
                  class="absolute top-3 right-3 px-2 py-1 bg-black/50 text-white text-xs rounded-md"
                >
                  压缩后
                </div>
                <!-- 滑块控制 -->
                <input
                  v-model.number="sliderPosition"
                  type="range"
                  min="0"
                  max="100"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                />
              </div>
            </div>
            <!-- 底部信息 -->
            <div
              class="px-5 py-3 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400"
            >
              <span
                >原始大小:
                <strong class="text-gray-700 dark:text-gray-200">{{
                  formatSize(previewItem.originalSize)
                }}</strong></span
              >
              <span
                >压缩大小:
                <strong class="text-gray-700 dark:text-gray-200">{{
                  formatSize(previewItem.compressedSize)
                }}</strong></span
              >
              <span>
                压缩率:
                <strong
                  :class="
                    previewItem.compressedSize < previewItem.originalSize
                      ? 'text-green-600'
                      : 'text-orange-500'
                  "
                >
                  {{
                    compressionRatio(
                      previewItem.originalSize,
                      previewItem.compressedSize,
                    )
                  }}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* 列表动画 */
.list-enter-active {
  transition: all 0.4s ease;
}
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 弹窗动画 */
.modal-enter-active {
  transition: all 0.3s ease;
}
.modal-leave-active {
  transition: all 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from > div:last-child {
  transform: scale(0.95);
}
</style>
