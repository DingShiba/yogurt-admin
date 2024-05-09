<template>
  <div class="header-right">
    <a-dropdown>
      <a-avatar @click.prevent alt="无法获取头像" src="/public/user.jpg"/>
      <template #overlay>
        <a-menu>
          <a-menu-item :disabled="true">
            <a href="javascript:;">个人首页</a>
          </a-menu-item>
          <a-menu-item @click="handleLogOut">
            <a-space>
              <poweroff-outlined /> <span>退出登录</span>
            </a-space>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>

    <SettingOutlined @click="openConfig"/>
    <a-drawer
        v-model:open="open"
        title="主题配置"
        :closable="false"
        placement="right"
    >
      <a-descriptions title="主题色" :column="9">
        <a-descriptions-item v-for="item in themeColors" :key="item.key">
          <div class="style-checbox-item">
            <a-tooltip :title="item.title">
              <a-tag :color="item.value" @click="setThemeColor(item.value)">
                <span :style="{ visibility: getThemeColorVisible(item.value) }"> ✔ </span>
              </a-tag>
            </a-tooltip>
          </div>
        </a-descriptions-item>
      </a-descriptions>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, onUnmounted} from 'vue'
import {SettingOutlined,PoweroffOutlined} from '@ant-design/icons-vue'
import {themeColors} from "@/components/DConfigProvider/themeColor";
import {useThemeStore} from "@/stores/theme";
import {useUserStore} from "@/stores/user";

const themeStore = useThemeStore()
const {setColorPrimary} = themeStore
const open = ref(false)

function openConfig() {
  open.value = true
}
function handleLogOut(){
  useUserStore().logOut()
}
function setThemeColor(item: string) {
  setColorPrimary(item)
}

function getThemeColorVisible(color: string) {
  return themeStore.themeConfig.token.colorPrimary === color ? 'visible' : 'hidden';
}


</script>

<style scoped lang="less">
.header-right {
  display: flex;
  gap: 10px;
  align-items: center;

}
</style>