<!--
<template>
<div class="bright-c">
  <a-layout >
    <a-layout-sider class="main-layout-sider">
      <div>
        <div class="logo">
          <img src="/public/logo.png" width="45">
          <span class="app-title">智慧交通管理系统</span>
        </div>
      </div>
      <a-menu
          id="mainMenu"
          mode="inline"
          :items="items"
          @select="onSelect"
          theme="dark"
      ></a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="main-layout-header">

        <div class="right-area">
          <a-space :size="12">
            <span>{{ clockObj.week }}</span>
            <div style="text-align: center;">
              <div>{{ clockObj.day }}</div>
              <div>{{ clockObj.second }}</div>
            </div>
            <a-divider type="vertical"/>
            <span> 欢迎您，{{ userStore.userInfo.userName }}</span>
            <a-avatar>
              <template #icon>
                <UserOutlined/>
              </template>
            </a-avatar>
            <PoweroffOutlined title="注销系统" @click="logOff"/>
          </a-space>
        </div>
      </a-layout-header>
      <a-layout-content class="main-layout-content">
        <div class="main-container" :class="mainContentClassName">
          <router-view/>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, onUnmounted} from 'vue'
import {PoweroffOutlined, UserOutlined} from "@ant-design/icons-vue";
import type {MenuProps, ItemType} from 'ant-design-vue';
defineProps({
  items:ItemType
})
</script>

<style scoped lang="less">

</style>-->
