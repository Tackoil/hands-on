<script setup lang="ts">
import { reactive, watch } from 'vue';
import type { HightLight } from './Mp4Explorer.vue';

const props = defineProps<{
    binary: Uint8Array | null,
    startPoint: number,
    highlights: HightLight[],
}>();

const state = reactive<{
    avalibleHeight: number,
    lineIndexs: string[],
    stringfiedBinaryList: {
        data: string,
        highlight: boolean
    }[][]
}>({
    avalibleHeight: 15,
    lineIndexs: [],
    stringfiedBinaryList: [],
})

watch(() => props, (values) => {
    const { binary, startPoint, highlights } = values;
    if (!binary) {
        state.lineIndexs = [];
        state.stringfiedBinaryList = [];
        return;
    }
    const stringfiedBinary = Array.from(binary.slice(startPoint, startPoint + state.avalibleHeight * 16))
        .map((i) => i.toString(16).padStart(2, '0'))
    const stringfiedBinaryList = [];
    let start = 0;
    while (start < stringfiedBinary.length) {
        stringfiedBinaryList.push(stringfiedBinary.slice(start, start + 16).map((item, index) => ({
            data: item,
            highlight: highlights.some((highlight) => highlight.binaryStartPoint <= startPoint + start + index && highlight.binaryStartPoint + highlight.binaryLength > startPoint + start + index)
        })));
        start += 16;
    }
    state.stringfiedBinaryList = stringfiedBinaryList;
    // lineIndexs
    const lineIndexs = [];
    for (let i = 0; i < state.avalibleHeight; i++) {
        lineIndexs.push((startPoint + i * 16).toString(16).padStart(8, '0'));
    }
    state.lineIndexs = lineIndexs;
}, { deep: true })

const header = Array.from({ length: 16 }, (_, i) => i.toString(16).padStart(2, '0'));

</script>

<template>
    <div class="binary-value">
        <div class="binary-value__header">
            <span class="binary-value__line-header">xxxxxxxx</span>
            <span class="binary-value__block" v-for="data in header"> {{ data }} </span>
        </div>
        <div class="binary-value__container">
            <div class="binary-value__line" v-for="(line, index) in state.stringfiedBinaryList" :key="index">
                <span class="binary-value__line-header"> {{ state.lineIndexs[index] }}  </span>
                <span :class="`binary-value__block ${highlight && ' binary-value__block--highlight'}` " v-for="{data, highlight} in line"> {{ data }} </span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.binary-value {
    font-family: monospace;
    font-size: 20px;
    padding: 8px;

    &__header {
        border-bottom: 1px solid #ccc;
        background-color: #aaa;
    }

    &__line-header {
        padding-right: 8px;
    }

    &__container {
        height: 100%;
        overflow: scroll;
    }

    &__block {
        padding: 0 4px;
    }

    &__block:nth-child(2n) {
        background-color: #eee;
    }

    &__block--highlight {
        color: #00f;
    }
}
</style>