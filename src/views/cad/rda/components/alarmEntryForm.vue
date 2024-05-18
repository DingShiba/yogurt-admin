<template>
  <div ref="alarmEntryForm"
       class="alarm-entry-form" @click="fetch.visible=false">
    <!--    <div class="container-body">
          <div ref="formArea" class="form-area">
            <div class="toolbar-header rda-flex">
              <span>新进警单</span>
              <a-icon style="cursor: pointer;" @click="handleActiveClose" type="close"/>
            </div>
            <div class="content-container" style="position: relative">
              <a-form-model v-if="!!alarmFormDictObj"
                            ref="alarmForm"
                            labelAlign="right"
                            :colon="true"
                            :model="alarmObj"
                            :rules="ruleValidate">
                <div class="rda-flex first-form">
                  <a-form-model-item label="接警类型" prop="revType">
                    <a-select v-model="alarmObj.revType" style="width: 150px;">
                      <a-select-option v-for="item in alarmFormDictObj.JJLX"
                                       :value="item.value"
                                       :key="item.value">
                        {{ item.label }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item label="报警时间" prop="alarmTime">
                    <a-date-picker showTime
                                   style="width: 150px;"
                                   v-model="alarmObj.alarmTime"
                                   :allowClear="false"
                                   :disabled-date="disabledDate"
                                   :disabled-time="disabledTime"
                                   format="YYYY-MM-DD HH:mm:ss"
                                   value-format="YYYY-MM-DD HH:mm:ss"
                                   placeholder="报警时间"></a-date-picker>
                  </a-form-model-item>
                  <a-form-model-item label="报警电话"
                                     prop="tel">
                    <span>{{ alarmObj.tel }}</span>
                  </a-form-model-item>
                  <a-form-model-item label="通话状态">
                    <div v-if="!!ringEvent && !!ringEvent.callStartTime" class="call-status">
                      <template v-if="!!ringEvent.callEndTime">
                        <span>通话结束</span>
                        <span class="status status-red"></span>
                        <audio controls style="height: 40px;">
                          <source v-if="!!alarmObj.callRecorder" :src="alarmObj.callRecorder">
                          <span v-else>无录音文件</span>
                        </audio>
                      </template>
                      <template v-else>
                        <span style="letter-spacing: 2px">通话中...</span>
                      </template>
                    </div>
                    <div v-else class="flex call-status">
                      <span>坐席空闲</span>
                      <span class="status status-blue"></span>
                    </div>
                  </a-form-model-item>
                </div>
                <div class="main-area ">
                  <div class="form-base-content flex">
                    <div class="alarm-info">
                      <div class="secondary-header">
                        <div class="rda-flex" style="justify-content: space-between">
                          <div class="rda-flex" style="gap: 10px;">
                            <div class="rect"></div>
                            <span class="title">事件信息</span>
                          </div>
                          <div class="radio-calltype">
                            <div v-for="item in lhlxRadioData"
                                 class="radio-calltype-item"
                                 @click="handleSelectCallType(item)"
                                 :class="{active:item.value==currentTab}">{{ item.label }}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="alarm-info-container">
                        <a-form-model-item label="来话类型"
                                           prop="callType" v-if="currentTab=='9999'">
                          <a-select v-model="alarmObj.callType" placeholder="请选择来话类型"
                                    allow-clear>
                            <a-select-option
                                v-for="item in alarmFormDictObj.LHLX"
                                :key="item.value"
                                :value="item.value">
                              {{ item.label }}
                            </a-select-option>
                          </a-select>
                        </a-form-model-item>
                        <a-form-model-item label="警情种类" prop="cause"
                        >
                          <a-cascader :options="filterJQZLData"
                                      placeholder="请选择警情种类"
                                      style="width:100%;"
                                      allowClear
                                      v-model="causeCascader"
                                      @change="selectCause"
                          ></a-cascader>
                        </a-form-model-item>
                        <div v-if="currentTab=='01'" class="quick-chose-jqzl">
                          <a-radio-group v-model="defaltJQZLRadio"
                                         @change="changeJQZLRadio" size="small">
                            <a-radio value="03010101">机动车事故</a-radio>
                            <a-radio value="03010104">机动车与行人</a-radio>
                            <a-radio value="03010102">机动车与非机动车</a-radio>
                            <a-radio value="03010108">单方事故</a-radio>

                          </a-radio-group>
                        </div>
                        <a-form-model-item label="事件详情" prop="text">
                          <a-textarea v-model="alarmObj.text"
                                      type="textarea"
                                      show-word-limit :max-length="800"
                                      placeholder="最长输入800个字符"
                                      :autoSize="{minRows:4,maxRows:4}"></a-textarea>
                        </a-form-model-item>
                        <div class="custom-address">
                          <a-form-model-item label="事发地址"
                                             prop="address">
                            <a-input-search v-model="alarmObj.address"
                                            @change="fetchAddress"
                                            @focus="fetchAddress"
                                            :loading="fetch.loading"
                                            placeholder="事发地址">
                            </a-input-search>
                          </a-form-model-item>
                          <div v-show="fetch.visible" class="pio-address">
                            <div class="pio-address-item rda-flex"
                                 v-for="item in fetch.data" @click="handleChange(item)">
                              <span>{{ item.name }}</span>
                              <span style="color: #bdbbbb">{{ item.city }}{{ item.district }}</span>
                            </div>
                          </div>
                          <div class="map-area" style="width: 566px;">
                            <les-map @on-map="setMap"
                                     class="address-map"
                            ></les-map>
                          </div>

                        </div>
                        <a-form-model-item prop="tags" label="警情标签">
                          <a-tree-select
                              v-model="selectedTags"
                              multiple
                              :maxTagCount="5"
                              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                              :tree-data="tagsTreeData"
                              placeholder="请选择警情标签"
                              tree-default-expand-all
                              @change="handleChangeTags"
                          >
                          </a-tree-select>
                        </a-form-model-item>
                        <div class="quick-chose-tags">
                          <div class="quick-tag-container rda-flex">
                            <div v-for="item in quickTags"
                                 class="quick-tag-item rda-flex">
                              <a-icon type="tags"/>
                              <span @click="choseTag(item)">{{ item.title }}</span>
                            </div>
                          </div>
                        </div>

                        <a-row :gutter="24">
                          <a-col span="9">
                            <a-row :gutter="24">
                              &lt;!&ndash;                    <a-col span="12">
                                             <a-form-model-item label="关联警情单号">
                                               <a-select v-model="relationId"
                                                         show-search
                                                         placeholder="根据报警电话检索"
                                                         option-label-prop="label"
                                                         style="width: 100%"
                                                         :filter-option="false"
                                                         @focus="handleSearch"
                                                         @search="handleSearch">
                                                 <a-spin v-if="relatedSpinning"
                                                         slot="notFoundContent"
                                                         :spinning="relatedSpinning"/>
                                                 <a-select-option v-for="item in orgGeneralData"
                                                                  :key="item.id"
                                                                  :label="item.id"
                                                                  :value="item.id">
                                                   <div class="accident-item">
                                                     <div class="rda-flex accident-item-title">
                                                       <h3>[单号: {{ item.id }}]</h3>
                                                       <span>{{ item.alarmTime }}</span>
                                                     </div>
                                                     <div class="address-text"
                                                          :title="item.address+'【详情：'+item.text+'】'">
                                                       {{ item.address }}【详情：{{ item.text }}】
                                                     </div>
                                                   </div>
                                                   <a-divider/>
                                                 </a-select-option>
                                               </a-select>
                                             </a-form-model-item>
                                           </a-col>&ndash;&gt;


                            </a-row>
                          </a-col>
                        </a-row>

                      </div>
                    </div>
                    <div class="person-vehicles-else">
                      <div class="person-info ">
                        <div class="secondary-header">
                          <a-space>
                            <div class="rect"></div>
                            <span class="title">报警人信息</span>
                          </a-space>
                        </div>
                        <a-form-model-item label="报警人" prop="people">
                          <a-input v-model="alarmObj.people"
                                   placeholder="匿名"
                                   style="width: 150px;"
                                   :max-length="12"></a-input>
                        </a-form-model-item>
                        <a-form-model-item label="联系电话"
                                           prop="tel">
                          <a-input v-model="alarmObj.callNumber"
                                   placeholder="最多输入11数字"
                                   style="width: 150px;"
                                   :max-length="11"></a-input>
                        </a-form-model-item>
                        <a-form-model-item label="性别" prop="gender">
                          <a-radio-group v-model="alarmObj.callerMale">
                            <a-radio value="1"
                                     key="1">
                              男
                            </a-radio>
                            <a-radio value="2"
                                     key="2">
                              女
                            </a-radio>
                          </a-radio-group>
                        </a-form-model-item>
                      </div>
                      <div class="vehicles-info">
                        <div class="secondary-header rda-flex">
                          <a-space>
                            <div class="rect"></div>
                            <span class="title">涉事车辆信息</span>
                          </a-space>
                          <a-space @click="addNewVehicle" style="color: #165DFF;cursor: pointer;">
                            <a-icon type="plus"/>
                            新增车辆信息
                          </a-space>
                        </div>
                        <a-row v-for="(item,index) in vehiclesData" :gutter="12" style="width: 100%;">
                          <a-col span="12">
                            <a-form-model-item :wrapper-col="{span:24}">
                              <car-plate v-model="item.hphm"
                                         :province="['陕','J']"></car-plate>
                            </a-form-model-item>
                          </a-col>
                          <a-col span="10">
                            <a-form-model-item :wrapper-col="{span:24}">
                              <a-select v-model="item.hplx"
                                        allowClear
                                        placeholder="号牌类型">
                                <a-select-option v-for="item in alarmFormDictObj.HPZL"
                                                 :value="item.label"
                                                 :key="item.value">
                                  {{ item.label }}
                                </a-select-option>
                              </a-select>
                            </a-form-model-item>
                          </a-col>
                          <a-col span="2">
                            <a-form-model-item :wrapper-col="{span:24}">
                              <a-button @click="deleteVehicle(index)"
                                        :disabled="vehiclesData.length<=1"
                                        type="danger" icon="delete"></a-button>
                            </a-form-model-item>
                          </a-col>
                        </a-row>
                      </div>
                      <div class="else-info">
                        <div class="secondary-header rda-flex">
                          <a-space>
                            <div class="rect"></div>
                            <span class="title">特殊标记</span>
                          </a-space>
                        </div>
                        <a-form-model-item label="是否关注" prop="focus">
                          <a-radio-group v-model="alarmObj.focus">
                            <a-radio v-for="item in focusDict" :value="item.value"
                                     :key="item.value">
                              {{ item.label }}
                            </a-radio>
                          </a-radio-group>
                        </a-form-model-item>
                        <a-form-model-item label="警情等级" prop="level">
                          <a-radio-group v-model="alarmObj.level">
                            <a-radio v-for="item in alarmFormDictObj.JQDJDM" :value="item.value"
                                     :key="item.value">
                              {{ item.label }}
                            </a-radio>
                          </a-radio-group>
                        </a-form-model-item>

                      </div>
                    </div>
                    <div class="dispose-info">
                      <div class="secondary-header">
                        <a-space>
                          <div class="rect"></div>
                          <span class="title">网络派警</span>
                        </a-space>
                      </div>
                      <a-form-model-item label="转派单位">
                        <a-tree-select
                            v-model="selectedOffice"
                            allow-clear
                            :dropdown-style="{ maxHeight: '250px', overflow: 'auto' }"
                            placeholder="请选择转派单位"
                            :tree-data="officeTreeData"
                            :replaceFields="{
                              children: 'children',
                              title: 'name',
                              value: 'code',
                            }"
                        />
                      </a-form-model-item>
                      <a-form-model-item prop="selectedPolice"
                                         style="align-items: flex-start"
                                         label="调度警员">

                        <a-input-search v-model="searchVal" placeholder="搜索"></a-input-search>
                        <div>

                          <a-tree v-if="policeTreeData.length>0"
                                  class="select-police-tree"
                                  :style="{height:selectedUsers.length>0?'300px':'400px'}"
                                  style="width: 100%"
                                  v-model="checkedKeys"
                                  checkable
                                  blockNode
                                  defaultExpandAll
                                  @check="onCheck"
                                  :tree-data="policeTreeData"
                                  :show-icon="true"
                                  :replaceFields="{
                                  children:'children',
                                  title:'name',
                                  key:'id'
                                }"
                          >
                            <a-icon slot="bank" type="bank"/>
                            <a-icon slot="user" type="user"/>
                          </a-tree>
                          <a-skeleton v-else active :paragraph="{ rows: 8 }"/>
                        </div>
                      </a-form-model-item>
                      <div class="selected-police rda-flex">
                        <div v-for="item in selectedUsers"
                             :key="item.id"
                             class="selected-police-item">
                          <span>{{ item.name }}</span>
                          <a-icon style="color: #165DFF;cursor: pointer;"
                                  @click="handleCancel(item)"
                                  type="close"/>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </a-form-model>
            </div>
            <div class="form-footer">
              <a-space>
                <a-button class="action-btn" type="danger"
                          :disabled="!alarmObj.id"
                          :loading="submitLoading "
                          ghost
                          @click="handleDiscard"
                          block>无效警情
                </a-button>
                <a-button class="action-btn" type="primary"
                          @click="handleOpenRepeatModal"
                          ghost
                          :disabled="!alarmObj.id"
                          :loading="submitLoading"
                          block>关联警情
                </a-button>
                <a-button class="action-btn" type="primary"
                          @click="handleSaveAndEnd"
                          ghost
                          :loading="submitLoading"
                          block>保存结案
                </a-button>
                <a-button class="action-btn"
                          type="primary"
                          :disabled="!selectedOffice && checkedKeys.length==0"
                          :loading="submitLoading "
                          @click="handleDispose"
                          block>处置
                </a-button>
              </a-space>
            </div>
          </div>
        </div>
        <a-modal v-model="repeatInfo.visible"
                 wrapClassName="alarm-entry-form"
                 :maskClosable="false"
                 :closable="false"
                 destroyOnClose
                 :footer="null"
                 :width="800">
          <div class="repeat-header rda-flex">
            <span class="title">关联警情</span>
            <a-icon type="close" class="repeat-modal-close" @click="repeatInfo.visible=false"/>
          </div>
          <div class="repeat-container">
            <div class="search-area rda-flex">
              <a-range-picker v-model="repeatInfo.searchParams.range"
                              show-time
                              value-format="YYYY-MM-DD HH:mm:ss" style="width: max-content"/>
              <a-input-search v-model="repeatInfo.searchParams.keyWord"
                              @change="handleSearch"
                              :loading="repeatInfo.loading"
                              style="width: 200px"
                              placeholder="关键字查询">
              </a-input-search>
            </div>
            <div class="result-list" >
              <div class="result-header">
                <a-row :gutter="24">
                  <a-col span="5">
                    <span class="result-header-label">接警时间</span>
                  </a-col>
                  <a-col span="5">
                    <span class="result-header-label">事件详情</span>
                  </a-col>
                  <a-col span="5">
                    <span class="result-header-label">报警人</span>
                  </a-col>
                  <a-col span="5">
                    <span class="result-header-label">报警电话</span>
                  </a-col>
                  <a-col span="4">
                    <span class="result-header-label">操作</span>
                  </a-col>
                </a-row>
              </div>

              <a-skeleton :loading="repeatInfo.result.length==0" active :title="false"
                          :paragraph="{ rows: 10,width:'100%' }">
                <div class="result-content">
                  <a-row :gutter="24"
                         class="result-row"
                         v-for="item in repeatInfo.result" :key="item.id">
                    <a-col span="5">
                      <span class="result-content-item">{{ item.alarmTime }}</span>
                    </a-col>
                    <a-col span="5">
                      <span class="result-content-item">{{ item.text }}</span>
                    </a-col>
                    <a-col span="5">
                      <span class="result-content-item">{{ item.people }}</span>
                    </a-col>
                    <a-col span="5">
                      <span class="result-content-item">{{ item.tel }}</span>
                    </a-col>
                    <a-col span="4">
                      <span class="result-content-item"><a @click="handleGoRelate(item)">关联</a></span>
                    </a-col>
                  </a-row>
                </div>
              </a-skeleton>
            </div>

          </div>

        </a-modal>-->
  </div>
</template>

<script>
/*import CarPlate from "@/views/cad/components/carPlate/index.vue";
import PinYinMatch from "pinyin-match";
import {
  goRelate,
  saveAlarm,
  postRdaRevGeneral,
  getCadTagsData, dispatchPoliceHttp
} from "@/views/cad/utils/api";
import {debounce, deepClone} from '@/views/cad/utils/common'

import {startAlarm} from "@/views/cad/rda/api/alarm";
import alarmCoord from "@/views/cad/theme/images/coord.png";
import LesMap from "@/views/cad/maptalks/index.vue";
import {startSecFlow} from "@/views/cad/rda/api/proc";
import {mapState} from "vuex";
import anime from "animejs";
import TreeSelect from "@/views/cad/components/treeSelect.vue";
import HeaderIcon from "@/main/template/main/header-icon.vue";
import PinyinMatch from "pinyin-match";*/

export default {
  name: "alarmReceptionDesk",
  components: {
   /* HeaderIcon,
    TreeSelect,
    LesMap,
    CarPlate*/
  },
  props: ["ringEvent"],
  computed: {
/*    ...mapState({
      baseForm: state => state.rda.rdaConfig.baseForm
    }),
    policeTreeData() {
      let _result = []
      if (!!this.searchVal) {
        this.findFilterObj(_result, this.orgData, this.searchVal)
      } else {
        _result = deepClone(this.orgData)
      }
      return _result
    },
    automatically() {
      const _vehicles = this.handleVehicles()
      const jqzlLabel = this.setjqzlLabel()
      return this.alarmObj.alarmTime + (!!this.alarmObj.address ? "在" + this.alarmObj.address : '') +
          (!!jqzlLabel ? "发生" + jqzlLabel : '') +
          (!!_vehicles ? '，涉事车辆' + _vehicles : '');
    },*/
    /*警情种类字典*/

  },
  data() {
    return {
      checkedKeys: [],
      spinning: false,
      selectedUsers: [],
      officeTreeData: [],
      searchVal: "",
      orgData: [],
      map: null,
      relationId: undefined,
      selectedTags: undefined,
      repeatInfo: {
        visible: false,
        searchParams: {
          range: [
            this.$moment().startOf('day').format("YYYY-MM-DD HH:mm:ss"),
            this.$moment().format("YYYY-MM-DD HH:mm:ss"),
          ],
          keyWord: ""
        },
        loading: false,
        orgGeneralData: [],
        result: []
      },
      alarmObj: {
        cause: '03010101',
        focus: '0',
        callType: undefined,
        level: "03",// 一般警情
        callerMale: null,
        alarmTime: this.$moment().format("YYYY-MM-DD HH:mm:ss"),
        address: undefined,
        text: undefined,
        tel: undefined,
        callNumber: undefined,
        people: undefined,
        telephonist: this.$store.state.user.userName,
        longitude: undefined,
        latitude: undefined,
        alarmTags: undefined,
        revType: "01",
        carPlate: undefined
      },
      tagsTreeData: [],
      quickTags: [
        {
          title: "受伤"
        },
        {
          title: "死亡"
        },
        {
          title: "大风"
        }
      ],
      mapOption: GlobalConfig.mapServer,
      submitLoading: false,
      ruleValidate: {
        cause: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!!value && value.length > 0) {
                return true
              } else {
                return false
              }
            },
            message: '必填',
            trigger: 'change'
          }],
        alarmTime: [{required: true,}],
        callType: [{required: true, message: '必填', trigger: 'change'}],
        focus: [{required: true, message: '必填', trigger: 'change'}],
        people: [
          {
            required: true, message: '必填', trigger: 'blur', transform(value) {
              if (value) {
                return value.trim()
              }
            }
          },
          {max: 12, message: '最多输入12位'}
        ],
        /* tel: [
           /!*{required: true, message: '必填', trigger: 'blur'},
           {validator: validatePhoneTwo, trigger: 'blur'},*!/
         ],*/
        address: [
          {
            required: true, transform(value) {
              if (value) {
                return value.trim()
              }
            },
            message: '必填',
            trigger: 'blur'
          },
          {max: 100, message: '事发地址最多输入100位字符', trigger: 'change'}
        ],
        text: [
          {
            required: true,
            trigger: 'blur',
            transform(val) {
              if (val) {
                return val.trim()
              }
            },
            message: '必填'
          },
          {max: 2000, message: '事件详情最多输入2000位字符'}
        ],
        revType: [{required: true, message: '必填', trigger: 'change'}],
      },
      focusDict: [
        {
          label: "非关注",
          value: "0"
        },
        {
          label: "关注",
          value: "1"
        },
      ],
      causeCascader: ["03010000", "03010100", "03010102"],

      baseFormWidth: "100%",
      alarmFormDictObj: this.$store.state.rda.allDict.alarmGBDict,
      JQZLCascader: this.$store.state.rda.JQZLCascader,
      duringCall: false,
      jqzlLabel: undefined,
      fetch: {
        value: undefined,
        visible: false,
        loading: false,
        data: []
      },
      selectedPolice: [],
      selectedOffice: undefined,
      vehiclesData: [
        {
          hphm: undefined,
          hplx: undefined
        }
      ],
      lhlxRadioData: [
        {
          label: "报警",
          value: '01'
        },
        {
          label: "投诉",
          value: '03'
        }, {
          label: "警务咨询",
          value: '04'
        }, {
          label: "其它类型",
          value: '9999'
        },
      ],
      currentTab: "",
      defaltJQZLRadio: "03010101",
      filterLHLXData: [],
      filterJQZLData: []
    }
  },
  watch: {
    ringEvent: {
      handler: function (val) {
        if (!!val) {
          for (let key in val) {
            if (!!val[key]) {
              this.alarmObj[key] = val[key]
            }
          }
        }
      },
      deep: true,
      immediate: true
    },
    automatically(val) {
      this.alarmObj.text = val
    }
  },
  mounted() {
    // 给来话类型赋值，第一个当作默认值
    this.setDefaultCallType()
    //  获取警情标签数据,创建标签树
    this.getAlarmTags()
    //   获取警员树状结构，造tree
    this.loadData()
    //  获取机构树状结构,造treeSelect
    this.getOfficeTreeData()
  },
  methods: {
    /**
     * 选择警员*/
    loadData() {
      this.spinning = true
      this.$http({
        url: "/zuul/duty/police/treeLayer",
        method: "get",
        params: {
          delFlag: "0",
        }
      }).then(res => {
        this.spinning = false
        if (res.data.success) {
          const _result = res.data.data
          this.editData("root", "root", _result)
          this.orgData = _result
        }
      })
    },
    findParentIds(id, data) {
      for (let index = 0; index < data.length; index++) {
        if (id == data[index].id) {
          const _arr = data[index].parentIds.split(",")
          _arr.forEach(item => {
            const _index = this.checkedKeys.findIndex(check => check == item)
            if (_index != -1) this.checkedKeys.splice(_index, 1)
          })
          break;
        } else {
          if (!!data[index].children && data[index].children.length > 0) {
            this.findParentIds(id, data[index].children)
          }
        }
      }
    },
    editData(parentId, parentIds, data) {
      data = data.sort((a, b) => b.rdaSort - a.rdaSort)
      data.forEach(item => {
        item.parentId = parentId
        item.parentIds = parentIds
        if (!!item.children && item.children.length > 0) {
          item.slots = {icon: "bank"}
          item.isNeed = false
          const _parentIds = item.parentIds + ',' + item.id
          this.editData(item.id, _parentIds, item.children)
        } else {
          item.isNeed = true
          item.slots = {icon: "user"}
        }
      })
    },
    findFilterObj(result, searchData, keyword) {
      searchData.forEach(item => {
        if (!!item.children && item.children.length > 0) {
          this.findFilterObj(result, item.children, keyword)
        } else {
          const text = item.title + item.name + item.phone
          const m = PinyinMatch.match(text, keyword)
          item.isNeed = true
          item.slots = {icon: "user"}
          if (m) {
            result.push(item)
          }
        }
      })
    },
    onCheck(checkedKeys, info) {
      let arr = []
      info.checkedNodes.forEach(item => {
        if (item.data.props.isNeed) {
          arr.push({
            id: item.data.props.id,
            name: item.data.props.name,
            type: item.data.props.type
          })
        }
      })
      this.selectedUsers = arr
    },
    linshiXunhuan(data) {
      data.forEach(item => {
        if (!item.name) item.name = item.officeName
        if (!!item.children && item.children.length > 0) {
          this.linshiXunhuan(item.children)
        }
      })
      return data
    },
    handleCancel(obj) {
      const _index = this.checkedKeys.findIndex(item => item == obj.id)
      this.checkedKeys.splice(_index, 1)
      /*根据id去原始数据里面找到对应的parentIds,然后删除其项*/
      this.findParentIds(obj.id, this.orgData)

      const _userIndex = this.selectedUsers.findIndex(item => item.id == obj.id)
      this.selectedUsers.splice(_userIndex, 1)
    },
    getContainer() {
      return document.querySelector('.tree-select')
    },
    async handleDispose() {
      const _callbackEvent = await this.handleSaveAlarm()
      if (!!_callbackEvent) {
        this.handleRelatedFunc(_callbackEvent)
        const _startedAlarm = await this.handleStartAlarm(_callbackEvent)
        // 得到了处警单,可以进行派警了
        this.dispatchOfficeAndPolice(_startedAlarm.id)
        if (!!_startedAlarm) this.closePage()
      }
    },
    dispatchOfficeAndPolice(dipId) {
      if (!!this.selectedOffice) this.handleStartAlarm(this.selectedOffice)
      for (const item of this.selectedUsers) {
        const obj = {
          "sendComment": "尽快处理",
          "dipPeopleCode": item.id,
          "dipPeople": item.name,
          "procType": "rda_police"
        }
        dispatchPoliceHttp(dipId, obj).then(res => {
          if (res.data.success) {
            this.$message.success(item.name + ":派警成功")
          } else {
            this.$message.error(item.name + ":派警失败")
          }
        })
      }
    },
    /**
     *警员选择结束*/
    setjqzlLabel() {
      let label = ""
      if (this.causeCascader.length > 0) {
        const _index = this.alarmFormDictObj.JQZL.findIndex(dict => dict.value == this.causeCascader[this.causeCascader.length - 1])
        label = _index != -1 ? this.alarmFormDictObj.JQZL[_index].label : ''
      }
      return label
    },
    setDefaultCallType() {
      this.handleSelectCallType(this.lhlxRadioData[0])
    },
    deleteVehicle(index) {
      this.vehiclesData.splice(index, 1)
    },
    changeJQZLRadio() {
      this.causeCascader = ["03010000", "03010100", this.defaltJQZLRadio]
    },
    addNewVehicle() {
      this.vehiclesData.push({
        hphm: undefined,
        hplx: undefined
      })
    },
    handleVehicles() {
      const _res = []
      this.vehiclesData.forEach(item => {
        if (!!item.hphm && item.hphm != '') {
          _res.push(!!item.hplx ? item.hphm + '(' + item.hplx + ')' : item.hphm)
        }
      })
      return _res.length > 0 ? _res.join("|") : null
    },
    deleteWaitPolice(obj) {
      const tags = this.selectedPolice.filter(item => item.id !== obj.id);
      this.selectedPolice = tags;
    },
    // 处理快速选择标签
    choseTag(obj) {
      if (!this.selectedTags) {
        this.selectedTags = [obj.title]
      } else {
        const _index = this.selectedTags.findIndex(item => item == obj.title)
        if (_index == -1) {
          this.selectedTags.push(obj.title)
        }
      }
    },
    handleActiveClose() {
      let _this = this;
      _this.stagingAlarm()
      _this.closePage()
      /*    _this.$confirm({
            content: '当前警单未保存，关闭编辑将会失去编辑内容，是否关闭？',
            onOk() {
              _this.$destroyAll();
              _this.closePage()
            },
            okText:"关闭",
            cancelText: '继续编辑',
            onCancel() {
              _this.$destroyAll();
            },
          });*/
    },
    /**暂存:不做表格校验,直接存*/
    stagingAlarm() {
      if (!!this.causeCascader) this.alarmObj.cause = this.causeCascader[this.causeCascader.length - 1]
      let dataObject = Object.assign({}, this.alarmObj)
      dataObject.details = JSON.stringify(this.alarmObj.details)
      dataObject.alarmTime = this.$moment(this.alarmObj.alarmTime).format('YYYY-MM-DD HH:mm:ss')
      saveAlarm(dataObject)
    },
   /* fetchAddress: debounce(function () {
      this.fetch.loading = true
      this.fetch.data = []
      this.$http({
        url: "http://61.10.19.249:35001/as/sug",
        params: {
          query: this.alarmObj.address,
          ak: "ec85d3648154874552835438ac6a02b2"
        }
      }).then(res => {
        this.fetch.loading = false
        if (res.data.status == '0') {
          this.fetch.data = res.data.results;
          if (!!this.fetch.data && this.fetch.data.length > 0) this.fetch.visible = true
        }
      })
    }),*/
    handleChange(obj) {
      this.fetch.visible = false
      this.alarmObj.address = obj.name
      this.addPoint([obj.location.lng, obj.location.lat])
    },
    handleSelectCallType(obj) {
      this.currentTab = obj.value
      if (obj.value != "9999") this.alarmObj.callType = obj.value
      let _jqzl = ""
      switch (obj.label) {
        case "报警":
          _jqzl = "03010000"
          break;
        case "其它类型":
          _jqzl = "03049900"
          /*过滤来话类型*/
          this.filterLHLX()
          break;
        case "投诉":
          _jqzl = "10000000"
          break;
        case "警务咨询":
          _jqzl = "11000000"
          break;
        default:
          _jqzl = "";
          break;
      }
      this.filterJQZL(_jqzl)
    },
    filterJQZL(value) {
      this.filterJQZLData = this.JQZLCascader.filter(item => item.value == value)
      console.log("value", value)
      console.log("啥一万", this.filterJQZLData)
      this.causeCascader = this.setCascaderValue([], this.filterJQZLData)
      if (this.causeCascader.length > 0) this.defaltJQZLRadio = this.causeCascader[this.causeCascader.length - 1]
    },
    filterLHLX() {
      this.alarmFormDictObj.LHLX = this.alarmFormDictObj.LHLX.filter(item => {
        const _index = this.lhlxRadioData.findIndex(_radio => _radio.value == item.value)
        return _index == -1
      })
      this.alarmObj.callType = this.alarmFormDictObj.LHLX[0].value
    },
    setCascaderValue(result, data) {
      if (data.length > 0) {
        result.push(data[0].value)
        if (!!data[0].children && data[0].children.length > 0) this.setCascaderValue(result, data[0].children)
      }
      return result
    },
    closePage() {
      this.$emit("close")
    },
    getOfficeTreeData() {
      this.$http({
        url: "zuul/duty/office/find?category=JJ"
      }).then(res => {
        if (res.data.success) {
          this.officeTreeData = res.data.data
        }
      })
    },
    getAlarmTags() {
      getCadTagsData().then(res => {
        if (res.data.success) {
          this.tagsTreeData = this.recursionCreateTagTree(res.data.data, "root")
        }
      })
    },
    recursionCreateTagTree(data, parentId) {
      let _copyData = JSON.parse(JSON.stringify(data))
      const _childs = data.filter((item, index) => {
        if (item.parentId == parentId) {
          _copyData.splice(index, 1)
          return true
        }
      })
      return _childs.map(item => ({
        ...item,
        title: item.name,
        value: item.name,
        key: item.id,
        children: this.recursionCreateTagTree(_copyData, item.id)
      }))
    },
    handleChangeTags(value) {
      if (value.length > 0) {
        this.alarmObj.alarmTags = value.join("|")
      }
    },
 /*   handleSearch: debounce(function () {
      let result = [];
      if (this.repeatInfo.searchParams.keyWord == '') {
        result = this.repeatInfo.orgGeneralData
      } else {
        this.repeatInfo.orgGeneralData.forEach(item => {
          const text = item.text + item.people + item.tel
          const m = PinyinMatch.match(text, this.repeatInfo.searchParams.keyWord)
          if (m) {
            result.push(item)
          }
        })
      }
      this.repeatInfo.result = result.slice(0, 10)


    }),*/
    getGeneralData() {
      const _params = {
        startTime: this.repeatInfo.searchParams.range[0],
        endTime: this.repeatInfo.searchParams.range[1],
        page: 1,
        size: 2000,
      }
      this.repeatInfo.loading = true
      postRdaRevGeneral(_params).then(res => {
        this.repeatInfo.loading = false
        if (res.data.success) {
          this.repeatInfo.orgGeneralData = res.data.data.results
          this.handleSearch()
        }
      })
    },
    setMap(map) {
      this.map = map
      this.getCoord()
    },
    handleRelated(alarm) {
      if (!!this.relationId && this.relationId != '') {
        const revId = alarm.id
        const data = {
          relatedId: this.relationId,
          force: false
        }
        goRelate(revId, data).then(res => {
          if (!!res && !!res.data) this.$message[res.data.success ? 'success' : 'error'](res.data.message)
        })
      }
    },
    //保存函数
    handleSaveAlarm(params) {
      return new Promise((resolve, reject) => {
        this.$refs['alarmForm'].validate(valid => {
          if (valid) {
            /*处理车辆信息*/
            this.alarmObj.carPlate = this.handleVehicles()
            this.alarmObj.cause = this.causeCascader[this.causeCascader.length - 1]
            let dataObject = Object.assign({}, this.alarmObj)
            dataObject.details = JSON.stringify(this.alarmObj.details)
            dataObject.alarmTime = this.$moment(this.alarmObj.alarmTime).format('YYYY-MM-DD HH:mm:ss')

            this.submitLoading = true
            saveAlarm(dataObject).then(res => {
              this.submitLoading = false
              if (res.data.success) {
                this.$message.success("警情保存成功")
                resolve(res.data.data)
              } else {
                this.$message.error("警情保存失败")
                resolve(false)
              }
            })
          } else {
            resolve(false)
          }
        })
      })
    },
    //关联重复报警单函数
    handleRelatedFunc(alarmObj) {
      return new Promise((resolve) => {
        if (!!this.relationId && this.relationId != '') {
          const revId = alarmObj.id
          const data = {
            relatedId: this.relationId,
            force: false
          }
          goRelate(revId, data).then(res => {
            if (!!res && !!res.data) {
              this.$message[res.data.success ? 'success' : 'error'](res.data.message)
              if (res.data.success) {
                resolve(true)
              } else {
                resolve(false)
              }
            }
          })
        }
      })
    },
    selectCause(value, selectedOptions) {
      this.alarmObj.cause = value[value.length - 1]
      this.defaltJQZLRadio = value[value.length - 1]
      if (!!selectedOptions) {
        this.jqzlLabel = selectedOptions[selectedOptions.length - 1].label
      } else {
        this.jqzlLabel = undefined
      }
    },
    downloadFile(file) {
      let link = document.createElement('a')
      link.download = file.filename
      link.style.display = 'none'
      link.href = file.url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    /**保存结案
     * 先保存,再结案*/
    async handleSaveAndEnd() {
      const callbackAlarmData = await this.handleSaveAlarm()
      if (!!callbackAlarmData) {
        this.handleRelatedFunc(callbackAlarmData)
        this.$http({
          url: "/zuul/rda/alarm/rev/fin_immediate/" + callbackAlarmData.id,
          method: "post",
        }).then(res => {
          if (res.data.success) {
            this.$message.success("结案成功!")
            this.closePage()
          } else {
            this.$message.error("结案失败!")
          }
        })
      }
    },
    async handleSubmit() {
      const callbackAlarmData = await this.handleSaveAlarm()
      if (!!callbackAlarmData) {
        this.handleRelatedFunc(callbackAlarmData)
        this.closePage()
      }
    },
    handleDiscard() {
      this.submitLoading = true
      this.$http({
        url: "/zuul/rda/alarm/rev/discard/" + this.alarmObj.id,
        method: "post"
      }).then(res => {
        this.submitLoading = false
        if (res.data.success) {
          this.$message.success("废弃成功。")
          this.closePage()
        }
      })

    },
    async processAtThisLevel() {
      const _callbackEvent = await this.handleSaveAlarm()
      if (!!_callbackEvent) {
        this.handleRelatedFunc(_callbackEvent)
        const _startedAlarm = this.handleStartAlarm(_callbackEvent)
        if (!!_startedAlarm) this.closePage()
      }
    },
    handleStartAlarm(data) {
      let _this = this
      return new Promise((resolve, reject) => {
        startAlarm(data.id, {
          'officeName': _this.$store.state.user.officeName,
          'toOffice': _this.$store.state.user.officeId,
          'areaId': _this.$store.state.user.areaId,
          'procType': _this.$store.state.rda.role.WORKFLOW_DEFINITION
        }).then(result => {
          if (result.data.success) {
            resolve(result.data.data)
          } else {
            resolve(false)
            _this.$message.error({
              content: result.data.message,
            })
          }
        })
      })

    },
    disabledDate(current) {
      return current > this.$moment().endOf('day')
    },
    disabledTime(current) {
      let _hour = current.hour() + 1
      let _minute = current.minute() + 1
      let _second = current.second() + 1
      if (current.isSameOrAfter(this.$moment(), 'day')) {
        return {
          disabledHours: () => this.range(0, 24).splice(_hour, 24),
          disabledMinutes: () => this.range(_minute, 60),
          disabledSeconds: () => this.range(_second, 60)
        };
      }

    },
    range(start, end) {
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    },
    //选取坐标
    getCoord() {
      let _this = this
      if (!!this.alarmObj.longitude) {
        this.map.removeLayer("alarmForm")
        this.map.addFeature({
          data: [{
            icon: alarmCoord,
            lngLat: [this.alarmObj.longitude, this.alarmObj.latitude],
            id: "realMadrid",
            width: 16,
            height: 16
          }]
        }, "alarmForm")
      }
      this.map.draw(0, {
        icon: null,
        type: 'point',
        id: 'realMadrid',
        name: '',
        offset: [16, 32],
        markerWidth: 0.001,
        markerHeight: 0.001,
        markerFill: "transparent",
        markerLineWidth: 0.001,
        endCallback: function (fe) {
          _this.alarmObj.longitude = fe[0]
          _this.alarmObj.latitude = fe[1]
          _this.map.removeLayer("myPoint")
          _this.getCoord()
          //   根据坐标反查地址
          _this.$http({
            url: "http://61.10.19.249:35001/gss/geocode/v2",
            params: {
              location: fe.join(','),
              pois: 1,
              ak: "ec85d3648154874552835438ac6a02b2"
            }
          }).then(res => {
            if (res.data.status == '0') {
              if (res.data.result.length > 0) {
                _this.fetch.data = res.data.result.map((item, index) => {
                  return {
                    uid: index,
                    name: item.formatted_address,
                    city: item.addressComponent.city,
                    district: item.addressComponent.district
                  }
                })
                _this.fetch.value = _this.fetch.data[0].uid
                _this.alarmObj.address = _this.fetch.data[0].name
              }
            }
          })
        }
      })
    },
    addPoint(fe) {
      let _this = this
      _this.map.removeLayer("myPoint")
      _this.map.addFeature({
        type: 'point',
        data: [{
          icon: alarmCoord,
          lngLat: fe,
          id: 'realMadrid',
          name: '',
          offset: [16, 32],
          size: [16, 16],
        }],
      }, 'myPoint')
      _this.alarmObj.longitude = fe[0]
      _this.alarmObj.latitude = fe[1]
      _this.map.moveTo(fe)
    },
    causeFilterOption(inputValue, option) {
      if (!PinYinMatch.match(option.componentOptions.propsData.title + option.componentOptions.propsData.value, inputValue)) {
        return false
      } else {
        return true;
      }
    },
    handleOpenRepeatModal() {
      this.repeatInfo.visible = true
      this.getGeneralData()
    },
    handleGoRelate(alarm) {
      const data = {
        relatedId: alarm.id,
        force: false
      }
      goRelate(this.alarmObj.id, data).then(res => {
        if (!!res && !!res.data) {
          this.$message[res.data.success ? 'success' : 'error'](res.data.message)
          this.repeatInfo.visible = false
        }
      })
    },

  }
}
</script>

<style scoped lang="less">

.alarm-entry-form {
  width: 100%;
  height: 100%;
  padding: 0 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  :deep(.ant-form-item) {
    margin: 0px;
  }

  .container-body {
    box-shadow: 0 4px 12px rgba(0, 0, 0, .15);
    display: flex;
    justify-content: center;
    height: max-content;


    .form-area {
      background-color: #fff;
      width: 1400px;

    :deep(.ant-form-item) {
        display: flex;
      }

      :deep(.ant-form-item-label ){
        width: 81px;
        min-width: 81px;
      }

      .toolbar-header {
        height: 40px;
        padding: 0px 24px;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        font-weight: normal;
        letter-spacing: 0px;
        color: rgba(0, 0, 0, 0.8);
        border-bottom: 1px solid #D8D8D8;

        .toolbar-btn {
          padding: 0px 6px;
          line-height: 30px;
          text-align: center;
          font-size: 14px;
          height: 30px;
          border: 1px solid #4e5969;
          border-radius: 6px;
          cursor: pointer;
        }
      }

      .person-info {
        justify-content: space-between;
        align-items: center;
      }

      .secondary-header {
        height: 50px;

        .rect {
          width: 4px;
          height: 21px;
          background: #165DFF;
        }

        .title {
          font-family: MiSans-Medium;
          font-weight: 500;
          font-size: 16px;
          color: #3D3D3D;
        }
      }


      .content-container {
        .first-form {
          gap: 24px;
          padding: 0px 24px;
          height: 60px;
          justify-content: space-between;
        }

        .call-status {
          display: flex;
          align-items: center;
          gap: 10px;

          .status {
            width: 14px;
            height: 14px;
            border-radius: 50%;

          }

          .status-red {

            background-color: #F01010;
          }

          .status-blue {
            background-color: #165DFF;
          }
        }

        .main-area {
          padding: 0px 24px 24px;
          border-radius: 4px;

          .form-base-content {
            background: rgba(22, 93, 255, 0.05);
            gap: 24px;
            padding: 20px;

            .alarm-info {
              width: 565px;
              height: max-content;
              transition: height 0.5s ease-in-out;

              .radio-calltype {
                display: flex;
                align-items: center;
                gap: 10px;

                .radio-calltype-item {
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 80px;
                  height: 32px;
                  border-radius: 4px;
                  opacity: 1;
                  color: #3D3D3D;
                  background: #FCFBFC;
                  box-sizing: border-box;
                  /* 主题色 */
                  border: 1px solid rgba(0, 0, 0, 0.1);
                }

                .active {
                  border: 2px solid #165DFF;
                }
              }

              .quick-chose-jqzl {
                padding: 0px 0px 10px 81px;
                position: relative;
                top: -6px;
              }

              .custom-address {
                position: relative;
                padding-bottom: 16px;

                .map-area {
                  width: 100%;
                  height: 260px;
                  padding-left: 81px;
                }

                .pio-address {
                  background-color: #FFFFFF;
                  width: calc(100% - 81px);
                  position: absolute;
                  left: 81px;
                  top: 42px;
                  z-index: 5;
                  height: 200px;
                  overflow: scroll;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, .15);

                  .pio-address-item {
                    width: 100%;
                    height: 34px;
                    padding: 0px 10px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    word-break: break-word;
                    -webkit-line-clamp: 1;
                    gap: 10px;
                  }

                  .pio-address-item:hover {
                    cursor: pointer;
                    background-color: #e6f7ff;
                  }
                }
              }

              .quick-chose-tags {
                position: relative;
                width: 100%;
                padding-left: 81px;

                .quick-tag-container {
                  gap: 24px;

                  .quick-tag-item {
                    gap: 5px;
                    cursor: pointer;
                  }

                  .quick-tag-item:hover {
                    color: #3D3D3D;
                  }
                }
              }
            }

            .person-vehicles-else {
              width: 357px;

              .vehicles-info {
                margin-top: 40px;

                .secondary-header {
                  justify-content: space-between;

                }
              }

              .else-info {
                margin-top: 40px;
              }
            }

            .select-police-tree {
              width: 225px;
              overflow-y: scroll;
              overflow-x: hidden;
              margin-top: 10px;
              transition: height 0.5s ease-in-out;
            }

            .dispose-info {
              width: 340px;
              height: 605px;
              border-radius: 2px;
              background: #FFFFFF;
              padding: 20px;
              overflow: hidden;

              .selected-police {
                flex-wrap: wrap;
                justify-content: space-between;
                gap: 10px;
                height: 80px;
                margin: 24px 0px;

                overflow: auto;

                .selected-police-item {
                  padding: 4px 8px;
                  min-width: 80px;
                  height: 24px;
                  border: 1px solid #165DFF;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  opacity: 1;
                  color: #165DFF;
                  background: rgba(22, 93, 255, 0.1);
                }

                .selected-police-item:hover {
                  opacity: 0.85;
                  transition: opacity .5s ease-in-out;
                }
              }
            }
          }

        }
      }

      .form-footer {
        display: flex;
        justify-content: flex-end;
        padding: 0px 24px 24px 0px;

        .action-btn {
          width: 120px;
          height: 40px;
        }
      }
    }

  }

  .repeat-header {
    font-family: MiSans-Medium;
    font-size: 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.9);
    height: 40px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    padding: 0px 20px;
    justify-content: space-between;
  }

  .repeat-container {
    padding: 12px 20px 20px;

    .search-area {

      gap: 20px;
    }

    .result-list {
      .result-header {
        padding: 12px 0px;

        .result-header-label {
          opacity: 1;
          font-size: 14px;
          line-height: 22px;
          color: rgba(0, 0, 0, 0.5);
        }
      }

      .result-content {
        /* 请输入 */
        color: rgba(0, 0, 0, 0.85);

        .result-row {
          margin: 16px 0px;
        }
      }
    }

  }

}

.accident-item-title {
  justify-content: space-between;
}

.alarm-entry-form .address-text {
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.alarm-entry-form .related-item {
  position: relative;
}

.alarm-entry-form .related-item:hover {
  background-color: #eae9e9;
  cursor: pointer;
}

.alarm-entry-form .related-item-check-icon {
  position: absolute;
  left: 2px;
  top: 2px;
  width: 15px;
  height: 15px;
}

.alarm-entry-form .system-commendation {
  position: absolute;
  right: 2px;
  top: -2px;
  font-size: 12px;
  color: #1890ff;
}

.alarm-entry-form .has-checked {
  background-color: rgba(29, 161, 242, 0.2);
}

.alarm-entry-form .has-checked:hover {
  background-color: rgba(29, 161, 242, 0.2);
}

.biaozhu-didian {
  position: absolute;
  z-index: 1;
  top: 10px;
  left: 100px;
  cursor: pointer;
  width: 30px;
  font-size: 20px;
}

:deep(.address-map canvas):hover {
  //cursor: url(../../theme/images/coord.png), auto;
}

:deep(.ant-modal-body){
  padding: 0px;
}


</style>
