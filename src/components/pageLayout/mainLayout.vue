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
import {ref, reactive , onMounted, VueElement,} from 'vue'
import type {MenuProps, ItemType} from 'ant-design-vue';
import router from "@/router";
import {useUserStore} from "@/stores/user";

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

const menuData: any = userStore.userInfo.menuData

onMounted(() => {
  console.log("zala", userStore.userInfo.menuData)
  // onCreateMenu
  /*  menuData.forEach((item:any)=>{
      console.log("哈哈哈",item)
      _menuData.push(getItem(item.title,item.name,item.icon,item.children))
    })*/
})
const _menuData: Array<any> = []


const onCreateMenu = function (result:any,data: any) {
  data.forEach((item: any) => {
    result.push(getItem(item.title,item.name,null,item.children.length>0?onCreateMenu([],item.children):undefined))
  })
  return result
}
onCreateMenu(_menuData,userStore.userInfo.menuData)
const items: ItemType[] = reactive(_menuData)
console.log("什么啊",items)
const onGoPage = function () {
  router.push({
    path: '/cad/rda/index'
  })
}
// 处理选中
const onSelect:MenuProps['onSelect']=function (item:any){
  router.push({
    name:item.key
  })
}
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