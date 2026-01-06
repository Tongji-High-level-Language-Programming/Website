<script setup lang="ts">
import { ref, watch } from 'vue';
import { Decimal } from 'decimal.js';

Decimal.set({ precision: 112 });

const numberInput = ref<string>('');

const validateInput = (value: string) => {
    const regex = /^([01]{0,112})$/;
    return regex.test(value);
};

const binaryOutput = ref<string>();

watch(numberInput, (newVal: string, oldVal: string) => {
    if (!validateInput(newVal)) {
        numberInput.value = oldVal;
    } else {
        binaryOutput.value = computeBinaryToDecimal(newVal);
    }
});

function computeBinaryToDecimal(binaryStr: string): string | null {
    if (binaryStr === '') {
        return null;
    }
    let decimalValue: Decimal = new Decimal(0);
    let base = new Decimal(1);
    for (let i = 0; i < binaryStr.length; i++) {
        base = base.dividedBy(2);
        if (binaryStr[i] === '1') {
            decimalValue = decimalValue.add(base);
        }
    }
    return decimalValue.toFixed();
}

</script>

<template>
    <div class="mt-8 p-6 rounded-xl border border-(--vp-c-divider) bg-(--vp-c-bg-soft)">

        <div class="space-y-4">
            <!-- 标题行 -->
            <div class="flex justify-between items-baseline">
                <label for="number_input" class="block font-bold text-(--vp-c-text-1)">
                    输入纯二进制小数
                </label>
                <span class="text-xs font-mono"
                    :class="numberInput.length === 112 ? 'text-(--vp-c-red)' : 'text-(--vp-c-text-2)'">
                    {{ numberInput.length }} / 112 位
                </span>
            </div>

            <!-- 输入区域：Input Group 设计 -->
            <div class="flex items-center w-full px-4 py-2 mt-1 rounded-lg 
                border border-(--vp-c-divider) bg-(--vp-c-bg)
                focus-within:ring-2 focus-within:ring-(--vp-c-brand) focus-within:border-transparent
                transition-all duration-200">
                <span class="text-xl font-mono text-(--vp-c-text-2) mr-1 select-none shrink-0">
                    0.
                </span>

                <!-- 真正的 Input -->
                <!-- 
                    关键样式的重置：
                    1. bg-transparent: 背景透明，显示父级的背景
                    2. border-none: 去掉边框，使用父级的边框
                    3. focus:ring-0: 去掉自身聚焦圈，使用父级的
                    4. p-0: 强制去掉 padding，紧贴前缀（即便 VitePress 设置了 padding，p-0 权重通常够高，或者因为它是 flex item，padding 影响变小）
                -->
                <input type="text" v-model="numberInput" id="number_input" autocomplete="off" class="flex-1 w-full min-w-0 bg-transparent border-none p-0
                    text-lg font-mono text-(--vp-c-text-1) 
                    placeholder:text-(--vp-c-text-3)
                    focus:ring-0 focus:outline-none" placeholder="101101..." />

            </div>

            <!-- 箭头指引 (纯装饰) -->
            <div class="flex justify-center text-(--vp-c-text-3) opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 animate-pulse" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>

            <!-- 结果展示区域 -->
            <div>
                <div class="text-sm font-medium text-(--vp-c-text-2) mb-2">对应十进制小数：</div>

                <div
                    class="relative min-h-15 p-4 rounded-lg border border-(--vp-c-divider) bg-(--vp-c-bg) transition-colors duration-300">
                    <div class="font-mono text-lg break-all leading-relaxed"
                        :class="binaryOutput ? 'text-(--vp-c-brand)' : 'text-(--vp-c-text-3) italic'">
                        {{ binaryOutput ? binaryOutput : 'N/A' }}
                    </div>

                    <!-- 一个小小的水印/图标，增加层次感 -->
                    <div class="absolute top-2 right-2 text-(--vp-c-text-3) opacity-20 pointer-events-none">
                        <span class="text-xs font-bold border border-current px-1 rounded">DEC</span>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>