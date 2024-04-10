import {defineStore} from "pinia";
import {reactive, ref} from "vue";

import {getEvent} from '@/views/cad/utils/httpInterfaceApi'
import type {workFlowType,rdaInfoType} from '@/views/cad/types/store'
export const useRdaStore = defineStore("rda", () => {
    const rdaInfo = reactive({
        allDict: {
            alarmGBDict: {},
            officeDict: [],
            callType: [],
            causeArr: [],
            genderArr: [
                {
                    label: '男',
                    value: "1"
                }, {
                    label: '女',
                    value: "0"
                }
            ],
            officeChild: [],
            eventFrom: [],
            dutyDict: [],
            tagDict: []
        },
        JQZLCascader: [],
        workFlowStep: {
            allStep: [],
            targetNodes: []
        },
        policeFlowStep: {
            allStep: [],
            targetNodes: []
        },
        tagColors: ['green', 'pink', 'red', 'orange', 'cyan', 'blue', 'purple'],
        currentEvent: undefined,
        currentDip:undefined,
        rdaConfig: {
            isNotFirstUse: false,
            baseForm: {
                isRecive: false,
                isDip: false,
                pzUnit: []
            }
        },
        role: {
            WORKFLOW_DEFINITION: undefined,
            DATA_LEVEL: "TOP"
        },
        preLoadData: {
            policeTreeData: []
        },
        alarmEntry: {
            visible: false,
            ringEvent: null
        }
    })
    function setAlarmGBDict(value:any) {
        rdaInfo.allDict.alarmGBDict = value
    }

    function setJQZLCascader(value:any): void {
        rdaInfo.JQZLCascader = value
    }

    function setOfficeDict(value:any): void {
        rdaInfo.allDict.officeDict = value
    }

    function setCurrentEvent( obj:any): void {
        rdaInfo.currentEvent = obj
    }

    function setCurrentDip(obj:any) {
        rdaInfo.currentDip = obj
        //   根据currentDip变化计算出流程下个节点
        const _index = rdaInfo.workFlowStep.allStep.findIndex((item:any) => item.name == rdaInfo.currentDip.flowNode)
        rdaInfo.workFlowStep.targetNodes = _index > -1 ? rdaInfo.workFlowStep.allStep[_index].execute : []
    }

    /*保存流程步骤*/
    function setWorkFlowStep(obj:{key:string,value:any}) {
        rdaInfo.workFlowStep[obj.key as keyof typeof rdaInfo.workFlowStep] = obj.value
    }

    function setPoliceFlowStep(state, {key, value}) {
        rdaInfo.value.policeFlowStep[key] = value
    }

    /*保存配置的管辖单位*/
    function setOfficeChild(state, value) {
        rdaInfo.value.allDict.officeChild = value
    }

    function setRdaConfig(state, value) {
        Object.assign(rdaInfo.value.rdaConfig, value)
    }

    function setRdaRole(state, {key, value}) {
        rdaInfo.value.role[key] = value
    }

    function setPreLoadData(state, {key, value}) {
        rdaInfo.value.preLoadData[key] = value
    }

    function setAlarmEntry(state, value) {
        rdaInfo.value.alarmEntry = value
    }
    function getEventAction(id:string) :Promise<any>{
        return new Promise((resolve, reject) => {
            getEvent(id).then(result => {
                if (result.data.success) {
                    let $data = transferEvent(result.data.data)
                    commit("setCurrentEvent", $data);
                } else {
                    commit("setCurrentEvent", undefined);
                }
                resolve(true)
            }).catch(err => {
                reject(err)
            })
        })
    }
    function getDipAction(dipId:string) :Promise{
        return new Promise((resolve, reject) => {
            try {
                getDipById(dipId).then(res => {
                    if (res.data.success) {
                        commit("setCurrentDip", res.data.data);
                        resolve(res.data.data)
                    } else {
                        commit("setCurrentDip", undefined);
                        resolve(false)
                    }
                })
            } catch (e) {
                reject(e)
            }
        })

    }

    return {
        rdaInfo,
        setAlarmGBDict,
        setJQZLCascader,
        setOfficeDict,
        setCurrentEvent,
        setCurrentDip,
        setWorkFlowStep,
        setPoliceFlowStep,
        setOfficeChild,
        setRdaConfig,
        setRdaRole,
        setPreLoadData,
        setAlarmEntry
    }
})