<template>
<div class="header-index">
  <div class="header-left">
    <slot name="headerLeft"></slot>
    <bread-crumb></bread-crumb>
  </div>
  <div class="header-menu">
    <slot name="menu" />
  </div>
  <div class="header-right">
    <header-right></header-right>
  </div>
</div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, onUnmounted} from 'vue'
import BreadCrumb from "@/components/pageLayout/header/components/breadCrumb.vue";
import HeaderRight from "@/components/pageLayout/header/components/headerRight.vue";
</script>

<style scoped lang="less">
.header-index{
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  .header-left{
    display: flex;
    align-items: center;
  }
}
</style>