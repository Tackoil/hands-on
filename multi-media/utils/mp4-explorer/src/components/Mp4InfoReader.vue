<script setup lang="ts">
import type { TreeNodeData } from '@arco-design/web-vue';
import type { BoxItem, PairItem } from '../utils/mp4Parser';
import { reactive, watch } from 'vue';
import { isBoxItem } from '../utils/mp4Parser';
import mp4Parser from '../utils/mp4Parser';

type TreeItem = TreeNodeData

const props = defineProps<{
    binary: Uint8Array,
}>();

const emits = defineEmits<{
    (e: 'select', binaryStartPoint: number, binaryLength: number): void;
}>()

const state = reactive<{
    treeData: TreeItem[]
}>({
    treeData: [],
})

watch(() => props.binary, () => {
    try {
        const boxData = mp4Parser(props.binary);
        const treeData = boxItem2TreeItem(boxData);
        state.treeData = treeData;
    } catch (e) {
        console.error(e);
    }
})

function boxItem2TreeItem(boxItems: (BoxItem | PairItem)[]): TreeItem[] {
    const treeItems: TreeItem[] = [];
    boxItems.forEach((item) => {
        if (isBoxItem(item)) {
            const treeItem: TreeItem = {
                title: item.type,
                key: `${item.binaryStartPoint}-${item.binaryLength}`,
            }
            if (item.contents) {
                treeItem.children = boxItem2TreeItem(item.contents);
            }
            treeItems.push(treeItem);
        } else {
            let value = item.value;
            if (typeof value === 'string' || typeof value === 'number') {
                const treeItem: TreeItem = {
                    title: `${item.key}: ${value}`,
                    key: `${item.binaryStartPoint}-${item.binaryLength}`,
                }
                treeItems.push(treeItem);
            } else {
                const treeItem: TreeItem = {
                    title: item.key,
                    key: `${item.binaryStartPoint}-${item.binaryLength}`,
                    children: boxItem2TreeItem(value),
                }
                treeItems.push(treeItem);
            }
        }

    });
    return treeItems;
}

function onTreeSelect(selectedKeys: Array<string | number>){
    if (selectedKeys.length > 1) {
        console.warn('too many keys selected');
    }
    const [binaryStartPoint, binaryLength] = selectedKeys[0].toString().split('-').map(item => parseInt(item));
    emits('select', binaryStartPoint, binaryLength);
}

</script>

<template>
    <a-tree 
        :data="state.treeData" 
        @select="onTreeSelect"
        show-line
    />
</template>

<style scoped lang="scss"></style>