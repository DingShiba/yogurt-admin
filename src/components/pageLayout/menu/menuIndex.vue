<template>
  <a-menu
      v-model:selected-keys="selectedKeys"
      :open-keys="openKey"
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
  items: Array

})
const appStore = useAppStore()
const currentRoute = useRoute()
// const selectedKeys=computed(()=>[currentRoute.name])
const selectedKeys = ref<string[]>([currentRoute.name as string])
const layoutMode = computed(() => appStore.appInfo.layout)
const openKey = computed(() => {
  return layoutMode.value == 'horizontal' ? currentRoute.meta.menuPaths : []
})
watch(
    () => currentRoute.name,
    (value) => {
      selectedKeys.value=[value as string]
    }
)
// 处理选中
const onSelect: MenuProps['onSelect'] = function (item: any) {
  router.push({
    name: item.key
  })
}
</script>

<style scoped lang="less">

</style>