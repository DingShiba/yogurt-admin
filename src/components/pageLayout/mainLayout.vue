<template>
  <div class="main-layout">
    <a-config-provider
        :theme="{
          token: {
            colorPrimary: '#165dff',
          },
        }"
    >
      <a-layout>
        <a-layout-header class="main-layout-header">
          <div>
            <a-space class="logo">
              <img src="/public/logo.png" width="45">
              <span class="app-title">智慧交通管理系统</span>
            </a-space>
          </div>
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
                  <UserOutlined />
                </template>
              </a-avatar>
              <PoweroffOutlined title="注销系统" @click="logOff"/>
            </a-space>
          </div>
        </a-layout-header>
        <a-layout>
          <a-layout-sider v-model:collapsed="collapsed"
                          collapsible class="main-layout-sider">
            <a-menu
                id="mainMenu"
                mode="inline"
                :items="items"
                @select="onSelect"
            ></a-menu>
          </a-layout-sider>
          <a-layout-content class="main-layout-content">
            <div class="main-container">
              <router-view/>
            </div>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-config-provider>
  </div>
</template>

<script setup lang="ts">

import {ref, reactive, onMounted, VueElement, onUnmounted,} from 'vue'
import type {MenuProps, ItemType} from 'ant-design-vue';
import {UserOutlined,PoweroffOutlined} from '@ant-design/icons-vue'
import router from "@/router";
import {useUserStore} from "@/stores/user";
import moment from "moment";

const userStore = useUserStore()
const collapsed=ref(false)
function getItem(
    label: VueElement | string,
    key: string,
    icon?: any,
    children?: ItemType[],
    type?: 'group',
): ItemType {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as ItemType;
}

const _menuData: Array<any> = []


const onCreateMenu = function (result:any,data: any) {
  data.forEach((item: any) => {
    result.push(getItem(item.title,item.name,null,item.children.length>0?onCreateMenu([],item.children):undefined))
  })
  return result
}
onCreateMenu(_menuData,userStore.userInfo.menuData)
const items: ItemType[] = reactive(_menuData)
// 处理选中
const onSelect:MenuProps['onSelect']=function (item:any){
  router.push({
    name:item.key
  })
}
function logOff(){
userStore.logOut()
}
interface Clock{
  timer:number,
  day: string,
  second: string,
  week: string
}
const  clockObj=reactive({
  timer:0,
  day: "",
  second: "",
  week: ""
}) as Clock
onMounted(()=>{
  // 获取时钟
  clockObj.timer=setInterval(()=>{
    const _clock = moment().format("YYYY-MM-DD HH:mm:ss dddd")
    const _clockArr = _clock.split(" ")
    clockObj.day = _clockArr[0]
    clockObj.second = _clockArr[1]
    clockObj.week = _clockArr[2]
  })
})
onUnmounted(()=>{
  if(clockObj.timer) clearInterval(clockObj.timer)
})
</script>

<style scoped lang="less">
.main-layout {
  @layoutHeader: #165dff;
  @layoutHeaderText: #FFFFFF;
  @layoutSider: #FFFFFF;
  @layoutContentBg: #f5f5f5;


  .main-layout-header, .main-layout-sider, .main-layout-content {
    transition: background-color 1s ease-in-out;
  }
  .main-layout-header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #ffffff;
    line-height: unset;
  }

  .main-layout-sider {
    background-color: @layoutSider;
    height: calc(100vh - 64px);
    overflow-y: auto;

  }
  .main-layout-content{
    padding: 24px;
    .main-container{
      width: 100%;
      height:100%;
      background-color: #ffffff;
    }
  }
  .main-layout-sider::-webkit-scrollbar{
    width: 0;
  }

}

</style>