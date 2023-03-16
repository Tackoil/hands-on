<script setup lang="ts">
import { reactive, watch } from 'vue';
import BinaryDisplay from './BinaryDisplay.vue';
import Mp4InfoReader from './Mp4InfoReader.vue';

const props = defineProps<{
    file: File | null | undefined
}>();

const state = reactive({
    boxes: [],
    binary: new Uint8Array(200),
});

function loadArrayBuffer(arrayBuffer: ArrayBuffer) {
    const binary = new Uint8Array(arrayBuffer);
    state.binary = binary;
}

watch(() => props.file, (value) => {
    if (!value) {
        state.boxes = [];
        state.binary = new Uint8Array(200);
        return;
    }
    value.arrayBuffer().then(arrayBuffer => {
        loadArrayBuffer(arrayBuffer);
    })
})

</script>

<template>
    <div class="mp4-explorer-container">
        <Mp4InfoReader :binary="state.binary" />
        <BinaryDisplay :binary="state.binary" :start-point="272" />
    </div>
</template>

<style scoped lang="scss">
.mp4-explorer-container {
    display: flex;
    flex-direction: row;
    height: 100%;
}
</style>