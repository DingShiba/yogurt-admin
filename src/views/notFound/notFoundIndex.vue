<template>
<div class="not-found">
  <a-result status="404" title="404" sub-title="很抱歉，您访问的页面不存在。">
    <template #extra>
      <a-button type="primary">返回主页</a-button>
    </template>
  </a-result>
</div>

</template>

<script setup lang="ts">
import {ref, reactive, onMounted, onUnmounted} from 'vue'
</script>

<style scoped lang="less">

</style>