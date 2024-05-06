<template>
<div class="bread-crumb">
</div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, onUnmounted, computed, watch} from 'vue'
import {useUserStore} from "@/stores/user";
import {useRouter,useRoute, type RouteRecordRaw} from "vue-router";

const userStore=useUserStore()
defineProps({

})
const router = useRouter();
const route = useRoute();
const _menuData=userStore.userInfo.menuData
console.log("菜单数据",router.getRoutes())
watch(route,()=>{
  console.log("菜单数据",route)
})

const _menus=computed(()=>{
  // _menuData.forEach(item)
  // return _currentRoute
})
function getMenuChildren(){

}
</script>

<style scoped lang="less">

</style>