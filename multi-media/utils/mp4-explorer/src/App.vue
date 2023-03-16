<script setup lang="ts">
import { RequestOption } from '@arco-design/web-vue/es/upload/interfaces';
import { reactive } from 'vue';
import Mp4Explorer from './components/Mp4Explorer.vue';

const state = reactive({
  fileList: [],
  targetFile: undefined as File | undefined,
});

function customRequest(opt: RequestOption) {
  const {onProgress, onError, onSuccess, fileItem, name} = opt;
  const file = fileItem.file;
  state.targetFile = file;
  onSuccess();
  return {
    abort: () => {
      console.log('upload progress is aborted.');
    },
  }
}

</script>

<template>
  <a-upload draggable action="/" :file-list="state.fileList" :limit="1" accept=".mp4" :custom-request="customRequest" />
  <Mp4Explorer :file="state.targetFile"/>
</template>

<style scoped></style>
