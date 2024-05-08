<template>
  <div class="bread-crumb">
    <a-breadcrumb>
      <template v-for="(routeItem, rotueIndex) in menus" :key="routeItem?.name">
        <a-breadcrumb-item>
          {{ routeItem.title }}
          <template v-if="routeItem?.children?.length" #overlay>
            <a-menu :selected-keys="getSelectKeys(rotueIndex)">
              <template v-for="childItem in routeItem?.children" :key="childItem.name">
                <a-menu-item
                    @click="clickMenuItem(childItem)"
                >
                  {{childItem.title}}
                </a-menu-item>
              </template>
            </a-menu>
          </template>
        </a-breadcrumb-item>
      </template>
    </a-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, onUnmounted, computed, watch} from 'vue'
import {useUserStore} from "@/stores/user";
import {useRouter, useRoute, type RouteRecordRaw} from "vue-router";

const userStore = useUserStore()
const router = useRouter();
const currentRoute = useRoute();
const _menuData:object[] = userStore.userInfo.menuData
const menus = computed(() => {
  if (currentRoute.meta?.menuPaths) {
    let children:object[] = _menuData;
    const paths = currentRoute.meta?.menuPaths?.map((item: any) => {
      const a = children.find((n: any) => n.name === item);
      children = a?.children || [];
      return a;
    });
    return [
      {
        name: '_index',
        title: '首页',
        children: _menuData,
      },
      ...paths,
    ];
  }
  return [{
    name: '_index',
    title: '首页',
    children: _menuData,
  }]
});

const getSelectKeys = (rotueIndex: number) => {
  return [menus.value[rotueIndex + 1]?.name] as string[];
};
const clickMenuItem = (menuItem: RouteRecordRaw) => {

  router.push({
    name:menuItem.redirect?menuItem.redirect:menuItem.name
  });
};
watch(currentRoute, () => {
})
</script>

<style scoped lang="less">

</style>