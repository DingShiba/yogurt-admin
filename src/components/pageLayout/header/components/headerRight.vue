<template>
<div class="header-right">
  <a-avatar alt="无法获取头像" src="/public/user.jpg" />
  <SettingOutlined />
</div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, onUnmounted} from 'vue'
import {SettingOutlined}  from '@ant-design/icons-vue'
</script>

<style scoped lang="less">
.header-right{
  display: flex;
  gap:10px;
  align-items: center;

}
</style>