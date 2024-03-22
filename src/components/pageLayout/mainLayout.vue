<template>
<div class="main-layout">
  <a-layout>
    <a-layout-header></a-layout-header>
    <a-layout>
      <a-layout-sider></a-layout-sider>
      <a-layout-content>
        <h1 @click="onGoPage">我是内容</h1>
        <router-view/>
      </a-layout-content>
    </a-layout>
  </a-layout>
</div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, onUnmounted} from 'vue'
import router from "@/router";

const onGoPage=function (){
  console.log("怎么",router.getRoutes())
  router.push({
    path:'/cad/rda/index'
  })
}
</script>

<style scoped lang="less">

</style>