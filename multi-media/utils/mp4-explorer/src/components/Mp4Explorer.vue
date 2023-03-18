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
    binary: Uint8Array | null,
    highlights: HightLight[],
    startPoint: number
}>({
    binary: null,
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
        state.binary = null;
        return;
    }
    value.arrayBuffer().then(arrayBuffer => {
        loadArrayBuffer(arrayBuffer);
    })
})

function onTreeSelect(binaryStartPoint: number, binaryLength: number) {
    state.highlights = [{
        binaryStartPoint,
        binaryLength,
    }];
    state.startPoint = Math.floor(binaryStartPoint / 16) * 16;
}

</script>

<template>
    <div class="mp4-explorer">
        <Mp4InfoReader class="mp4-explorer__tree" :binary="state.binary" @select="onTreeSelect" />
        <BinaryDisplay class="mp4-explorer__block" :binary="state.binary" :start-point="state.startPoint" :highlights="state.highlights" />
    </div>
</template>

<style scoped lang="scss">
.mp4-explorer {
    display: flex;
    height: 100%;
    padding: 0 16px;

    &__tree {
        flex:1;
        height: 100%;
        overflow: scroll;
    }
    
}
</style>