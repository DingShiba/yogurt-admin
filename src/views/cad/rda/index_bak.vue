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
                            @click="handleOpenEntry"/>
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
                <span> 欢迎您，{{ userStore.userInfo.userName }}</span>
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
  </transition>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, onUnmounted, computed, inject} from 'vue'
import  moment from 'moment'
import {LesStomp} from "@/views/cad/utils/lesStomp";
import {
  getWorkFlowData,
  getOfficeChildByOAuth
} from "@/views/cad/utils/httpInterfaceApi";
import {Modal,message} from "ant-design-vue";
import {useRdaStore} from "@/views/cad/rda/store/rda";
import {useUserStore} from "@/stores/user";
import type {receiveInter} from "@/views/cad/types/rda";
import {routerBackToHome} from '@/views/cad/utils/common'

const $http: any = inject('$http')
const rdaStore = useRdaStore()
const userStore = useUserStore()
let initLoadObj = reactive({
  loading: true,
  percent: 0,
  tip: ""
})
const rdaConfigObj = reactive({
  spinning: false,
  visible: false
})
const settingVisible = ref(false)
const debounceTimer = ref(0)
const collapsed = ref(false)
const menuData = reactive([
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
let currentMenu:string[]= reactive([])
let rdaWS: any = undefined,
    rdaTelWS: any = undefined;
let componentId: any = undefined;
let websocketStatus = ref(false)
type Clock = {
  timer: number | null,
  day: string,
  second: string,
  week: string
}

let clockObj: Clock = reactive({
  timer: null,
  day: "",
  second: "",
  week: ""
})

let revInitData: receiveInter[] = reactive([])
const originalAlarmData = computed(() => {
return ""
})
const rdaConfig = computed(() => {
  return rdaStore.rdaInfo.rdaConfig;
})
const role:any = computed(() => {
  return rdaStore.rdaInfo.role;
})
const alarmEntry = computed(() => {
  return rdaStore.rdaInfo.alarmEntry;
})

// 打开接入电话的表单
function handleOpenEntry(obj: receiveInter): void {
  rdaStore.setAlarmEntry({
    visible: true,
    ringEvent: obj
  })
}

//注销系统，回退到首页
function handleGoHome(): void {
  routerBackToHome()
}

function selectMenu(info: any) {
  setCurrentComponentId(info.key)
}

function setCurrentComponentId(key: string) {
  const _component = menuData.filter(item => item.key == key)[0]
  componentId = () => _component.component
}

function handleCloseAlarmEntry() {
  rdaStore.setAlarmEntry({
    visible: false,
    ringEvent: null
  })
  getRevInitData()
}

function getRevInitData() {
  $http({
    url: '/zuul/rda/query/rev/init/page',
    params: {
      page: 1,
      size: 100
    }
  }).then((res: any) => {
    if (res.data.success) {
      revInitData = res.data.data.results;
    }
  })
}

function getElement(): HTMLElement {
  return document.querySelector('.main-container')!
}

function initClock() {
  clockObj.timer = setInterval(() => {
    const _clock = moment().format("YYYY-MM-DD HH:mm:ss dddd")
    const _clockArr = _clock.split(" ")
    clockObj.day = _clockArr[0]
    clockObj.second = _clockArr[1]
    clockObj.week = _clockArr[2]
  }, 1000)
}

function handleRdaRole(): Promise<boolean> {
  const _permissions = userStore.userInfo.permission;
  let _dataLevel = "TOP",
      _workflowDefinition = "rda_tp_pri"
  if (_permissions.includes("cad:data:top")) {
    _dataLevel = "TOP"
    _workflowDefinition = "rda_tp_pri"
  } else if (_permissions.includes("cad:data:primary")) {
    _dataLevel = "PRIMARY"
    _workflowDefinition = "rda_tp_pri"
  } else if (_permissions.includes("cad:data:second")) {
    _dataLevel = "SECOND"
    _workflowDefinition = "rda_tp_sec"
  }
  rdaStore.setRdaRole("DATA_LEVEL", _dataLevel)
  rdaStore.setRdaRole("WORKFLOW_DEFINITION", _workflowDefinition)
  return new Promise((resolve) => {
    getWorkFlowData(_workflowDefinition + ',rda_police').then((res: any) => {
      if (res.data.success) {
        const _index = res.data.data.findIndex((item: { name: string }) => item.name == _workflowDefinition)
        if (_index >= 0) rdaStore.setWorkFlowStep({
          key: "allStep",
          value: res.data.data[_index].nodeList
        })
        const policeFlowIndex = res.data.data.findIndex((item: { name: string }) => item.name == 'rda_police')
        if (policeFlowIndex >= 0) rdaStore.setPoliceFlowStep("allStep", res.data.data[policeFlowIndex].nodeList)
        resolve(true)
      } else {
        resolve(false)
      }
    })
  })
}

function getAlarmGBDict() {
  return $http({
    url: "/zuul/rda/query/dict",
    method: "get"
  })
}

function getOfficeDict() {
  return $http({
    url: '/zuul/duty/office/dict',
    params: {
      category: 0
    },
    method: 'get'
  })
}
interface dictInter{
  [propName:string]:any
}
function getFormItemDict(alarmGBDict:object[]) {

  const alarmFormDictObj:dictInter = {
    JQDJDM: [],
    JJLX: [],
    LHLX: [],
    JQZL: [],
    BJRXB: [],
    HPZL: [],
    JQCLZTDM:[],
    JQLYFS:[]
  }
  for (let key in alarmFormDictObj) {
    alarmFormDictObj[key] = alarmGBDict.filter((_dic:any) => _dic.category == key)
  }
  return alarmFormDictObj
}
function recursionCreateTree(data:object[], parenId:string | null):any {
  const copyData = JSON.parse(JSON.stringify(data));
  const child = data.filter((item:any, index) => {
    if (item.parentCode == parenId) {
      copyData.splice(index, 1)
      return true
    }
  })
  return child.map((item:any) => ({
    ...item,
    children: recursionCreateTree(copyData, item.value)
  }))
}
function   getPoliceByTreeLayer() {
  $http({
    url: "/zuul/duty/police/treeLayer",
    method: "get",
    params: {
      delFlag: "0"
    }
  }).then((res:any) => {
    if (res.data.success) {
      rdaStore.setPreLoadData( "policeTreeData", res.data.data)
    }
  })
}
function preLoadData() {
  //   1、加载树状警员结构
  getPoliceByTreeLayer()
}
function messageErrorTip(content:string) {
  Modal.error({
    title: '接处警系统初始化失败',
    content: content,
    onOk() {
      routerBackToHome()
    }
  });
}
function cacheStaticData():Promise<boolean> {
  return new Promise((resolve, reject) => {
    $http.all([
      getAlarmGBDict(),
      getOfficeDict(),
      getOfficeChildByOAuth(userStore.userInfo.officeId)
    ]).then($http.spread(
        (alarmGBDict:any, officeDict:any, officeChild:any) => {
          if (alarmGBDict.data.success && officeDict.data.success) {
            rdaStore.setOfficeDict(officeDict.data.data)
            rdaStore.setOfficeChild(officeChild.data.data)
            const _alarmGBDict = getFormItemDict(alarmGBDict.data.data)
            const _JQZLCascader = recursionCreateTree(_alarmGBDict.JQZL, null)
            rdaStore.setAlarmGBDict(_alarmGBDict)
            rdaStore.setJQZLCascader(_JQZLCascader)
            resolve(true)
          } else {
            messageErrorTip("加载静态资源失败，请联系管理员！")
            resolve(false)
          }
        }))
  })
}
function  getRdaConfig() {
  return new Promise((resolve, reject) => {
    try {
      $http({
        url: "/zuul/rda/settings",
        method: "get"
      }).then((res:any) => {
        if (res.data.success) {
          resolve(res.data.data)
        } else {
          messageErrorTip("读取接处警用户配置失败，请联系管理员")
          resolve(false)
        }
      })
    } catch (e) {
      reject(e)
    }

  })
}
function handleMenuData() {
  menuData[0].isShow = rdaConfig.value.baseForm.isDip
  menuData[1].isShow = rdaConfig.value.baseForm.isRecive
  const _fil:any = menuData.filter((item:any) => item.isShow == true)
  if (_fil.length > 0) {
    setCurrentComponentId(_fil[0].key)
    currentMenu = [_fil["0"].key]
  }

}
function handleRdaConfig(data:any) {
  // 检测初次登陆,确认配置
  if (!!data && !!data.settings) {
    const _data = JSON.parse(data.settings)
    if (!_data.isNotFirstUse) {
      rdaConfigObj.visible = true
    } else {
      rdaStore.setRdaConfig(JSON.parse(data.settings))
      handleMenuData()
    }
  } else {
    rdaConfigObj.visible = true
  }
}
function     display(result:any) {
  switch (result.noticeType) {
    case 'DIP_ADD':
      clearTimeout(debounceTimer.value)
      debounceTimer.value = setTimeout(() => {
        message.info("您有一条新的警情信息，请注意查收！")
      }, 1000)
      break
    case 'DIP_UPDATE' || 'DIP_ADD_UP':
      break
    case 'DIP_FIN':
      break
    case 'DIP_DEL':
      break
  }
}
function getEventById(id:string) {
  return new Promise(resolve => {
    $http({
      url: '/zuul/rda/alarm/rev/' + id,
      method: 'get',
    }).then((res:any) => {
      if (res.data.success) {
        resolve(res.data.data)
      } else {
        resolve(false)
      }
    })
  })
}
async function handleTelEvent(obj:any) {
  const _rev:any = await getEventById(obj.revId)
  if (!!alarmEntry.value.ringEvent && _rev.id == alarmEntry.value.ringEvent.id) {
    rdaStore.setAlarmEntry({
      visible: true,
      ringEvent: _rev
    })
  }
  if (!alarmEntry.value.ringEvent) {
    if (obj.msgType == "upsert") {
      rdaStore.setAlarmEntry({
        visible: true,
        ringEvent: _rev
      })
    }
  }
  getRevInitData()
}
function buildWSLink() {
  try {
    rdaWS = new LesStomp({
      url: "ws://192.168.110.228:15674/ws",
      username: "admin",
      password: "admin",
      /* url: "ws://61.10.19.125:15674/ws",
       username: "admin",
       password: "admin",*/
      channel: 'icp.topic/rda.' + (role.value.DATA_LEVEL == 'TOP' ? '*' : userStore.userInfo.officeId),
      subId: "dealWebsocket",
      stateCallBack: (frame:any) => {
        /**
         * 判断frame中的command字段,"ERROR"连接失败,"CONNECTED"连接成功*/
        websocketStatus.value = frame.command == "CONNECTED" ? true : false;
      },
      onSubscribeCallBack: (res:any) => {
        let result = JSON.parse(res)
        /**
         * dipType: 0 代表发给机构
         *          2 代表发给警员*/
        if (result.topic == 'rda' && result.dipType == '0') {
            display(result)
        }
      }
    })
  } catch (e) {
    console.error(e)
  }
  //订阅来电信息
  if (rdaConfig.value.baseForm.isDip) {
    try {
      rdaTelWS = new LesStomp({
        url: "ws://192.168.110.228:15674/ws",
        username: "admin",
        password:"admin",
        channel: 'icp.topic/device_off.' + userStore.userInfo.officeId,
        subId: "rdaTelWebsocket",
        stateCallBack: (frame:any) => {
          /**
           * 判断frame中的command字段,"ERROR"连接失败,"CONNECTED"连接成功*/
          /*console.log("frame.command", frame)
          _this.websocketStatus = frame.command == "CONNECTED" ? true : false;*/
        },
        onSubscribeCallBack: (res:any) => {
          const _result = JSON.parse(res)
          handleTelEvent(_result)
        }
      })
    } catch (e) {
      console.error(e)
    }
  }
}
async function initRdaSystem() {
  // 1、第一步：设置rdaRole
  initLoadObj.tip = '1、配置数据权限'
  await handleRdaRole()
  initLoadObj.percent = 20
  //2、第二步：加载静态资源（字典等值）
  initLoadObj.tip = '2、加载静态资源（字典等值）'
  const step2 = await cacheStaticData()
  if (!step2) return
  initLoadObj.percent = 40
  //3、第三步：读取接处警用户配置
  initLoadObj.tip = '3、读取接处警用户配置'
  const rdaConfig = await getRdaConfig()
  if (rdaConfig != false) {
    initLoadObj.percent = 60
    //4、第四步：根据配置筛选菜单
    initLoadObj.tip = '4、根据用户配置设置菜单...'
    handleRdaConfig(rdaConfig)

    //5、第五步：建立websocket连接
    initLoadObj.tip = '5、建立websocket连接'
    buildWSLink();
    initLoadObj.percent = 80
    initLoadObj.tip = '初始化完成'
    initLoadObj.percent = 100
    //6.读取正在排队的警情,并做相应的处理
    getRevInitData()
    setTimeout(() => {
      initLoadObj.loading = false
    }, 500)
  }
}

onMounted(() => {
  /*创建时钟*/
  initClock()
  initRdaSystem()
  /*预加载一些数据量大的、不经常变化的数据*/
  preLoadData()
})
</script>

<style scoped lang="less">
//@import './rdaMain.less';
.rda-index {
  position: relative;
  width: 100vw;
  height: 100vh;
  font-family: MiSans;
  .rda-drawer-handle {
    position: absolute;
    top: 240px;
    right: 400px;
    z-index: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    font-size: 16px;
    text-align: center;
    background-color: rgb(24, 144, 255);
    border-radius: 4px 0 0 4px;
    cursor: pointer;
    pointer-events: auto;
  }

  .alarm-entry-modal {
    position: fixed;
    display: flex;
    z-index: 999;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.45);
  }
}

.rda-index .logo {
  //width: 200px;
  height: 64px;
  //background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  padding: 12px;
  float: left;
}

.rda-index .header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px;
  background: linear-gradient(90deg, #165DFF 0%, #1890ff 100%);
  box-shadow: 0px 4px 4px 0px #B8C1C4, 0px 2px 12px 0px #ECEEF3;
  font-family: MiSans-Medium;
  color: #fff;
  font-weight: 500;
  line-height: unset;

  .right-area {
    padding: 12px;

    .add-alarm {
      cursor: pointer;
    }
  }
}

.rda-title {
  font-size: 30px;
  font-weight: 500;
  font-family: YouSheBiaoTiHei;
}

.main-container {
  height: calc(100vh - 64px);
}

.header-user {
  padding: 0 20px;
  min-width: 200px;
  height: 64px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-user /deep/ .ant-badge-status-dot {
  width: 10px;
  height: 10px;
}

.rda-progress {
  width: 300px;
}

.rda-settings-container {
  height: 700px;
}

.fz-menu-container {
  width: 100%;
  height: calc(100vh - 55px - 48px);
  overflow-y: scroll;
}

.ant-popover .rev-init-item:hover {
  background-color: #E8F7FF;
}
</style>
<style>
.rda-index {
  font-family: MiSans;
  --base-title-font-familly: MiSans-Medium;
}

.rda-flex {
  display: flex;
  align-items: center;
}

.rda-danger-a {
  color: #ff4d4f;
}
</style>