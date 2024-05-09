<template>
  <div class="main-layout">
      <a-layout>
        <a-layout-sider v-if="layout=='horizontal'"
                        collapsible
                        :trigger="null"
                        v-model:collapsed="collapsed" style="height: 100vh">
          <Logo class="side-logo" :collapsed="collapsed"></Logo>
          <Menu :items="items" class="side-menu"></Menu>
        </a-layout-sider>
        <a-layout>
          <a-layout-header :style="headerStyle">
            <Header>
              <template v-if="layout=='horizontal'" #headerLeft>
                <span @click="handleToggleSide"
                      style="cursor: pointer;"
                      class="trigger-icon"
                      :class="theme">
                  <MenuFoldOutlined v-show="!collapsed" :style="{color:theme=='dark-black'?'#fff':'black'}"/>
                  <MenuUnfoldOutlined v-show="collapsed" :style="{color:theme=='dark-black'?'#fff':'black'}"/>
                </span>
              </template>
            </Header>
          </a-layout-header>
          <a-layout-content class="main-layout-content">
            <div :class="mainContentClassName">
              <RouterView  />
            </div>
          </a-layout-content>
        </a-layout>
      </a-layout>
  </div>
</template>

<script setup lang="ts">

import {ref, reactive, onMounted, VueElement, onUnmounted, computed} from 'vue'
import type {MenuProps, ItemType} from 'ant-design-vue';
import {UserOutlined, PoweroffOutlined,MenuFoldOutlined,MenuUnfoldOutlined} from '@ant-design/icons-vue'
import Logo from "@/components/pageLayout/logo/logoIndex.vue";
import Menu from "@/components/pageLayout/menu/menuIndex.vue";
import Header from "@/components/pageLayout/header/headerIndex.vue";

import {useUserStore} from "@/stores/user";
import {useAppStore} from "@/stores/app";
import moment from "moment";

moment.locale('zh-cn')

const userStore = useUserStore()
const appStore = useAppStore()
const layout:string=appStore.appInfo.layout
const theme:string=appStore.appInfo.theme
const headerStyle=computed(()=>{
  let _style={
    backgroundColor:'#fff',
    color:"black",
    paddingInline:'12px'
  }
  if(theme=='dark-black'){
    _style={
      backgroundColor:'#001529',
      color:"fff",
      paddingInline:'12px'
    }
  }
  return _style
})
const collapsed = ref(false)
const mainContentClassName = computed(() => {
  let _className: string = "default"
  const _currentRoute: any = appStore.appInfo.currentRoute
  if (_currentRoute.meta.template == "fullScreen") {
    _className = "full-screen"
  }
  return _className
})

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


const onCreateMenu = function (result: any, data: any) {
  data.forEach((item: any) => {
    result.push(getItem(item.title, item.name, null, item.children.length > 0 ? onCreateMenu([], item.children) : undefined))
  })
  return result
}
onCreateMenu(_menuData, userStore.userInfo.menuData)
const items: ItemType[] = reactive(_menuData)


function logOff() {
  userStore.logOut()
}

interface Clock {
  timer: number,
  day: string,
  second: string,
  week: string
}

const clockObj = reactive({
  timer: 0,
  day: "",
  second: "",
  week: ""
}) as Clock
onMounted(() => {
  // 获取时钟
  clockObj.timer = setInterval(() => {
    const _clock = moment().format("YYYY-MM-DD HH:mm:ss dddd")
    const _clockArr = _clock.split(" ")
    clockObj.day = _clockArr[0]
    clockObj.second = _clockArr[1]
    clockObj.week = _clockArr[2]
  }, 1000)
})
onUnmounted(() => {
  if (clockObj.timer) clearInterval(clockObj.timer)
})
function handleToggleSide():void{
  collapsed.value=!collapsed.value
}
</script>

<style scoped lang="less">
.main-layout {
  @layoutHeader: #165dff;
  @layoutHeaderText: #FFFFFF;
  @layoutSider: #FFFFFF;
  @layoutContentBg: #f5f5f5;

  .trigger-icon{
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
/*    &:hover{
      background-color: rgba(0, 0, 0, 0.06);
    }
    &.dark-black:hover{
      background-color: rgba(0, 0, 0, 0.06);
    }*/
  }
  .main-layout-header, .main-layout-sider, .main-layout-content {
    transition: background-color 1s ease-in-out;
  }

  .main-layout-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #ffffff;
    line-height: unset;
    padding-inline:12px;
  }

  .main-layout-sider {
    background-color: @layoutSider;
    height: calc(100vh);

    #mainMenu {
      height: calc(100vh);
      overflow-y: auto;
    }

    #mainMenu::-webkit-scrollbar {
      width: 0px;
    }
  }

  .main-layout-content {
    .main-container {
      width: 100%;
      height: 100%;
      background-color: #ffffff;
    }
    .full-screen {
      position: fixed;
      z-index: 999999;
      left: 0;
      top: 0;
      width: 100vw;
      height: 100vh;
      background-color: #f5f5f5;
    }
  }

  .main-layout-sider::-webkit-scrollbar {
    width: 0;
  }
  .side-logo{
    height: 64px;
  }
  .side-menu{
    height: calc(100vh - 64px);
    overflow-x: hidden;
    overflow-y: scroll;
    &::-webkit-scrollbar{
      width: 0px;
    }
  }

}

</style>