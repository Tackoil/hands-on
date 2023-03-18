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

function beforRemove() {
  state.targetFile = undefined;
  return Promise.resolve;
}

</script>

<template>
  <a-upload class="upload" action="/" :file-list="state.fileList" :limit="1" accept=".mp4" :custom-request="customRequest" :on-before-remove="beforRemove"/>
  <Mp4Explorer class="explorer" :file="state.targetFile"/>
</template>

<style scoped>
.upload {
  width: 30%;
  margin: 16px;
}
.explorer {
  height: calc(100vh - 90px);
}
</style>
