<script setup lang="ts">
import { reactive, watch } from 'vue';
import mp4Parser from '../utils/mp4Parser';


const props = defineProps<{
    binary: Uint8Array,

}>();

const state = reactive<{
    treeData: TreeItem[],
}>({
    treeData: [],
})

watch(() => props.binary, () => {
    try {
        const boxData = mp4Parser(props.binary);
        console.log(boxData);
    } catch (e) {
        console.error(e);
    }
})

</script>

<template>
    <a-tree :data="state.treeData" />
</template>

<style scoped lang="scss"></style>