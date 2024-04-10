<template>
  <div v-if="initLoadObj.loading"
       style="display: flex;align-items: center;justify-content: center;height: 100vh;">
    <div class="rda-progress">
      <a-progress
          :stroke-color="{
            from: '#108ee9',
            to: '#87d068',
          }"
          :stroke-width="20"
          :percent="initLoadObj.percent"
          status="active"
      />
      <div style="text-align: center;margin-top: 10px;">
        {{ initLoadObj.tip }}
      </div>
    </div>
  </div>
  <transition v-else name="fade">
    <a-spin :spinning="rdaConfigObj.spinning" tip="正在更新配置...">
      <div class="rda-index">
        <a-layout>
          <a-layout-header class="header" theme="light">
            <div>
              <a-space class="logo">
                <img src="../../../assets/images/china.png" width="45">
                <span class="rda-title">接处警系统</span>
              </a-space>
            </div>
            <div class="right-area">
              <a-space :size="12">
                <a-space v-if="rdaConfig.baseForm.isRecive"
                         :size="12">
                  <a-tooltip title="手动录入警单">
                    <a-icon type="plus-square" class="add-alarm"
                            @click="openAlarmEntry"/>
                  </a-tooltip>
                  <a-divider type="vertical"/>
                  <span>排队警情：</span>
                  <a-popover v-if="revInitData.length>0">
                    <template slot="content">
                      <vue-scroll style="height: 150px;">
                        <div v-for="(item,index) in revInitData" :key="item.id"
                             style="height: 35px;cursor: pointer;border-bottom: 1px solid #efefef"
                             class="rev-init-item rda-flex"
                             @click="handleOpenEntry(item)">
                          <a-space>
                          <span class="sort-index">
                            <a-badge
                                :count="index+1"
                                :number-style="{
                              backgroundColor: '#fff',
                              color: '#999',
                              boxShadow: '0 0 0 1px #d9d9d9 inset',
                            }"
                            />
                          </span>
                            <span>{{ item.alarmTime.split(' ')[1] }}</span>
                            <span>{{ item.tel }}</span>
                            <span v-if="!!item.telPlace">
                            <span>{{ JSON.parse(item.telPlace).prov }}</span>
                            <span>{{ JSON.parse(item.telPlace).city }}</span>
                            <span>{{ JSON.parse(item.telPlace).isp }}</span>
                          </span>
                          </a-space>
                        </div>
                      </vue-scroll>
                    </template>
                    <a-badge :count="revInitData.length"
                             showZero
                             :number-style="{ backgroundColor: '#52c41a' }"/>
                  </a-popover>
                  <a-badge v-else
                           :count="revInitData.length"
                           showZero
                           :number-style="{ backgroundColor: '#52c41a' }"/>
                  <a-divider type="vertical"/>
                </a-space>
                <span>连接状态</span>
                <a-badge :status="websocketStatus?'success':'error'"
                         style="width: 10px;height: 10px;"/>
                <a-divider type="vertical"/>
                <span>{{ clockObj.week }}</span>
                <div style="text-align: center;">
                  <div>{{ clockObj.day }}</div>
                  <div>{{ clockObj.second }}</div>
                </div>
                <a-divider type="vertical"/>
                <span> 欢迎您，{{ $store.state.user.userName }}</span>
                <a-avatar icon="user"/>
                <a-icon type="poweroff"
                        @click="handleGoHome"
                        title="注销系统"/>
              </a-space>
            </div>
          </a-layout-header>
          <a-layout>
            <a-layout-sider
                v-model="collapsed"
                collapsible
                theme="dark"
                style="font-family: MiSans-Medium;font-weight: 500;"
                width="200">
              <a-menu
                  @select="selectMenu"
                  theme="light"
                  v-model="currentMenu"
                  :style="{ lineHeight: '64px' }"
              >
                <a-menu-item v-for="item in menuData.filter(_menu=>!!_menu.isShow)"
                             :key="item.key">
                  <a-icon :type="item.icon"/>
                  <span>{{ item.name }}</span>
                </a-menu-item>
              </a-menu>
            </a-layout-sider>
            <a-layout class="main-container"
                      style="padding: 12px;background: rgb(240, 242, 245);">
              <a-layout-content style="margin: 0; min-height: 280px;position: relative;">
                <component v-if="!!componentId"
                           :is="componentId"></component>
              </a-layout-content>
            </a-layout>
          </a-layout>
        </a-layout>
        <div v-if="alarmEntry.visible"
             class="alarm-entry-modal">
          <alarm-entry-form :ring-event="alarmEntry.ringEvent"
                            @close="handleCloseAlarmEntry"></alarm-entry-form>
        </div>
      </div>
      <a-modal
          v-model="rdaConfigObj.visible"
          :width="600"
          :footer="null"
          :closable="false">
        <a-alert
            message="系统检测到您是初次使用，请首先确认个人用户配置！"
            type="info"
            showIcon/>
        <div class="rda-settings-container">
          <rda-setting @close="rdaConfigObj.visible=false"></rda-setting>
        </div>
      </a-modal>
      <!--      TODO : 暂时隐藏配置窗口-->
      <a-drawer :visible="settingVisible"
                placement="right"
                :get-container="getElement"
                :closable="false"
                :width="400">
        <template v-slot:handle>
          <a-button
              class="rda-drawer-handle"
              @click="settingVisible=!settingVisible"
              type="primary" :icon="settingVisible?'close':'setting'">
          </a-button>
        </template>
        <rda-setting></rda-setting>

      </a-drawer>
    </a-spin>
  </transition> <div v-if="initLoadObj.loading"
                     style="display: flex;align-items: center;justify-content: center;height: 100vh;">
  <div class="rda-progress">
    <a-progress
        :stroke-color="{
        from: '#108ee9',
        to: '#87d068',
      }"
        :stroke-width="20"
        :percent="initLoadObj.percent"
        status="active"
    />
    <div style="text-align: center;margin-top: 10px;">
      {{ initLoadObj.tip }}
    </div>
  </div>
</div>
  <transition v-else name="fade">
    <a-spin :spinning="rdaConfigObj.spinning" tip="正在更新配置...">
      <div class="rda-index">
        <a-layout>
          <a-layout-header class="header" theme="light">
            <div>
              <a-space class="logo">
                <img src="../../../assets/images/china.png" width="45">
                <span class="rda-title">接处警系统</span>
              </a-space>
            </div>
            <div class="right-area">
              <a-space :size="12">
                <a-space v-if="this.rdaConfig.baseForm.isRecive"
                         :size="12">
                  <a-tooltip title="手动录入警单">
                    <a-icon type="plus-square" class="add-alarm"
                            @click="openAlarmEntry"/>
                  </a-tooltip>
                  <a-divider type="vertical"/>
                  <span>排队警情：</span>
                  <a-popover v-if="revInitData.length>0">
                    <template slot="content">
                      <vue-scroll style="height: 150px;">
                        <div v-for="(item,index) in revInitData" :key="item.id"
                             style="height: 35px;cursor: pointer;border-bottom: 1px solid #efefef"
                             class="rev-init-item rda-flex"
                             @click="handleOpenEntry(item)">
                          <a-space>
                          <span class="sort-index">
                            <a-badge
                                :count="index+1"
                                :number-style="{
                              backgroundColor: '#fff',
                              color: '#999',
                              boxShadow: '0 0 0 1px #d9d9d9 inset',
                            }"
                            />
                          </span>
                            <span>{{ item.alarmTime.split(' ')[1] }}</span>
                            <span>{{ item.tel }}</span>
                            <span v-if="!!item.telPlace">
                            <span>{{ JSON.parse(item.telPlace).prov }}</span>
                            <span>{{ JSON.parse(item.telPlace).city }}</span>
                            <span>{{ JSON.parse(item.telPlace).isp }}</span>
                          </span>
                          </a-space>
                        </div>
                      </vue-scroll>
                    </template>
                    <a-badge :count="revInitData.length"
                             showZero
                             :number-style="{ backgroundColor: '#52c41a' }"/>
                  </a-popover>
                  <a-badge v-else
                           :count="revInitData.length"
                           showZero
                           :number-style="{ backgroundColor: '#52c41a' }"/>
                  <a-divider type="vertical"/>
                </a-space>
                <span>连接状态</span>
                <a-badge :status="websocketStatus?'success':'error'"
                         style="width: 10px;height: 10px;"/>
                <a-divider type="vertical"/>
                <span>{{ clockObj.week }}</span>
                <div style="text-align: center;">
                  <div>{{ clockObj.day }}</div>
                  <div>{{ clockObj.second }}</div>
                </div>
                <a-divider type="vertical"/>
                <span> 欢迎您，{{ $store.state.user.userName }}</span>
                <a-avatar icon="user"/>
                <a-icon type="poweroff"
                        @click="handleGoHome"
                        title="注销系统"/>
              </a-space>
            </div>
          </a-layout-header>
          <a-layout>
            <a-layout-sider
                v-model="collapsed"
                collapsible
                theme="light"
                style="font-family: MiSans-Medium;font-weight: 500;"
                width="200">
              <a-menu
                  @select="selectMenu"
                  theme="light"
                  v-model="currentMenu"
                  :style="{ lineHeight: '64px' }"
              >
                <a-menu-item v-for="item in menuData.filter(_menu=>!!_menu.isShow)"
                             :key="item.key">
                  <a-icon :type="item.icon"/>
                  <span>{{ item.name }}</span>
                </a-menu-item>
              </a-menu>
            </a-layout-sider>
            <a-layout class="main-container"
                      style="padding: 12px;background: rgb(240, 242, 245);">
              <a-layout-content style="margin: 0; min-height: 280px;position: relative;">
                <component v-if="!!componentId"
                           :is="componentId"></component>
              </a-layout-content>
            </a-layout>
          </a-layout>
        </a-layout>
        <div v-if="alarmEntry.visible"
             class="alarm-entry-modal">
          <alarm-entry-form :ring-event="alarmEntry.ringEvent"
                            @close="handleCloseAlarmEntry"></alarm-entry-form>
        </div>
      </div>
      <a-modal
          v-model="rdaConfigObj.visible"
          :width="600"
          :footer="null"
          :closable="false">
        <a-alert
            message="系统检测到您是初次使用，请首先确认个人用户配置！"
            type="info"
            showIcon/>
        <div class="rda-settings-container">
          <rda-setting @close="rdaConfigObj.visible=false"></rda-setting>
        </div>
      </a-modal>
      <!--      TODO : 暂时隐藏配置窗口-->
      <a-drawer :visible="settingVisible"
                placement="right"
                :get-container="getElement"
                :closable="false"
                :width="400">
        <template v-slot:handle>
          <a-button
              class="rda-drawer-handle"
              @click="settingVisible=!settingVisible"
              type="primary" :icon="settingVisible?'close':'setting'">
          </a-button>
        </template>
        <rda-setting></rda-setting>

      </a-drawer>
    </a-spin>
  </transition>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, onUnmounted, computed} from 'vue'
const initLoadObj=reactive({
  loading: true,
  percent: 0,
  tip: ""
})
const rdaConfigObj=reactive({
  spinning: false,
  visible: false
})
const settingVisible=ref(false)
const debounceTimer=ref(0)
const collapsed=ref(false)
const menuData=reactive([
  {
    name: "接警台",
    key: "alarmReceptionDesk",
    icon: "form",
    component: import("./alarmReceptionDesk.vue"),
    isShow: false
  },
  {
    name: "警情查询",
    key: "query",
    icon: "file-search",
    component: import("./query.vue"),
    isShow: true
  },
  {
    name: "统计分析",
    key: "trafficStatistics",
    icon: "bar-chart",
    component: import("../rdaAnalyze/trafficStatistics.vue"),
    isShow: true
  },
 {
    key: "plan",
    icon: "laptop",
    name: "预案管理",
    component: import("../plan/index.vue"),
    isShow: true
  }
])
const currentMenu=reactive([])
const rdaWS:any=undefined,
    rdaTelWS:any=undefined,
    componentId:any=undefined;
const websocketStatus=ref(false)
const clockObj=reactive({
  timer: null,
  day: "",
  second: "",
  week: ""
})
const revInitData=reactive([])
const originalAlarmData=computed(()=>{

})
</script>

<style scoped lang="less">

</style>