<template>
  <div>
    <div class="logo">
      <img src="/public/logo.png" width="45">
      <span v-if="!collapsed"
            class="app-title"
            :class="theme">智慧交通管理系统</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, onUnmounted} from 'vue'
import {useAppStore} from "@/stores/app";
defineProps({
  collapsed: Boolean
})
const appStore=useAppStore()
const theme=appStore.appInfo.theme

</script>

<style scoped lang="less">
.logo{
  display: flex;
  align-items: center;
  gap:10px;
  height: 100%;
  justify-content: center;
}
.app-title{
  display: inline-block;
  min-width: max-content;
  &.light{
    color: black;
  }
  &.dark,&.dark-black{
    color: #fff;
  }

}

</style>