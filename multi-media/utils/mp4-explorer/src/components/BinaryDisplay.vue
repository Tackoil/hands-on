<script setup lang="ts">
import { reactive, watch } from 'vue';

const props = defineProps<{
    binary: Uint8Array,
    startPoint: number,
}>();

const state = reactive({
    avalibleHeight: 10,
    stringfiedBinaryList: [] as string[][]
})

watch(() => [props.binary, props.startPoint], (values) => {
    const [binary, startPoint] = values as [Uint8Array, number];
    const stringfiedBinary = Array.from(binary.slice(startPoint, startPoint + state.avalibleHeight * 16))
        .map((i) => i.toString(16).padStart(2, '0'))
    const stringfiedBinaryList = [];
    let start = 0;
    while (start < stringfiedBinary.length) {
        stringfiedBinaryList.push(stringfiedBinary.slice(start, start + 16));
        start += 16;
    }
    state.stringfiedBinaryList = stringfiedBinaryList;
})

const header = Array.from({ length: 16 }, (_, i) => i.toString(16).padStart(2, '0'));

</script>

<template>
    <div class="binary-value">
        <div class="binary-value__header">
            <span class="binary-value__block" v-for="data in header"> {{ data }} </span>
        </div>
        <div class="binary-value__container">
            <div class="binary-value__line" v-for="(line, index) in state.stringfiedBinaryList" :key="index">
                <span class="binary-value__block" v-for="data in line"> {{ data }} </span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.binary-value {
    font-family: monospace;
    font-size: 2em;
    padding: 8px;

    &__header {
        border-bottom: 1px solid #ccc;
        background-color: #ccc;
    }

    &__container {
        height: calc(100vh - 200px);
        overflow: scroll;
    }

    &__block {
        margin-right: 4px;
    }

    &__block:nth-child(2n) {
        background-color: #eee;
    }
}
</style>