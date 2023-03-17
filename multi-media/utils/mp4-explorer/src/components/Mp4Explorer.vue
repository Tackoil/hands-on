<script setup lang="ts">
import { reactive, watch } from 'vue';
import BinaryDisplay from './BinaryDisplay.vue';
import Mp4InfoReader from './Mp4InfoReader.vue';

export type HightLight = {
    binaryStartPoint: number,
    binaryLength: number,
}

const props = defineProps<{
    file: File | null | undefined
}>();

const state = reactive<{
    binary: Uint8Array,
    highlights: HightLight[],
    startPoint: number
}>({
    binary: new Uint8Array(200),
    highlights: [],
    startPoint: 0
});

function loadArrayBuffer(arrayBuffer: ArrayBuffer) {
    const binary = new Uint8Array(arrayBuffer);
    state.binary = binary;
}

watch(() => props.file, (value) => {
    if (!value) {
        state.highlights = [];
        state.binary = new Uint8Array(200);
        return;
    }
    value.arrayBuffer().then(arrayBuffer => {
        loadArrayBuffer(arrayBuffer);
    })
})

function onTreeSelect(binaryStartPoint: number, binaryLength: number) {
    console.log(binaryStartPoint, binaryLength)
    state.highlights = [{
        binaryStartPoint,
        binaryLength,
    }];
    state.startPoint = Math.floor(binaryStartPoint / 16) * 16;
}

</script>

<template>
    <div class="mp4-explorer-container">
        <Mp4InfoReader :binary="state.binary" @select="onTreeSelect" />
        <BinaryDisplay :binary="state.binary" :start-point="state.startPoint" :highlights="state.highlights" />
    </div>
</template>

<style scoped lang="scss">
.mp4-explorer-container {
    display: flex;
    flex-direction: row;
    height: 100%;
}
</style>