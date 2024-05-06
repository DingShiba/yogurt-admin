<template>
  <a-menu
      v-model:selected-keys="selectedKeys"
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
import {reactive, ref, watch} from "vue";
defineProps({
  items:Array

})
const selectedKeys=ref<string[]>([''])
watch(selectedKeys,(value)=>{
  console.log("怎么说",value)
})
// 处理选中
const onSelect: MenuProps['onSelect'] = function (item: any) {
  console.log("select",item)
  router.push({
    name: item.key
  })
}
</script>

<style scoped lang="less">

</style>