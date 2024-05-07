<template>
  <a-menu
      v-model:selected-keys="selectedKeys"
      :open-keys="layoutMode=='horizontal'?openKey:[]"
      id="mainMenu"
      mode="inline"
      :items="items"
      @select="onSelect"
      theme="dark"
  ></a-menu>
</template>

<script setup lang="ts">

import type {MenuProps} from 'ant-design-vue';
import router from "@/router";
import {useRoute} from "vue-router";
import {useAppStore} from "@/stores/app";
import {computed, reactive, ref, watch} from "vue";
defineProps({
  items:Array

})
const appStore=useAppStore()
const currentRoute=useRoute()
const selectedKeys=ref([currentRoute.name])
const openKey=currentRoute.meta.menuPaths
const layoutMode=computed(()=>appStore.appInfo.layout)

watch(selectedKeys,(value)=>{
})
// 处理选中
const onSelect: MenuProps['onSelect'] = function (item: any) {
  router.push({
    name: item.key
  })
}
</script>

<style scoped lang="less">

</style>