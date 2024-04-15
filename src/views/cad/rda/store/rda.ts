import {defineStore} from "pinia";
import {reactive, ref} from "vue";

import {getDipById, getEvent} from '@/views/cad/utils/httpInterfaceApi'
import type {rdaInfoInter,transferEventInter} from '@/views/cad/types/store'
export const useRdaStore = defineStore("rda", () => {
    const rdaInfo:rdaInfoInter = reactive({
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
        currentEvent: undefined,
        currentDip: null,
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

    function setCurrentDip(obj: {flowNode:string,[propName:string]:any} | null) {
        rdaInfo.currentDip  = obj
        //   根据currentDip变化计算出流程下个节点
        const _index = rdaInfo.workFlowStep.allStep.findIndex((item:any) => item.name == (rdaInfo.currentDip as {
            flowNode:string
        }).flowNode)
        rdaInfo.workFlowStep.targetNodes = _index > -1 ? (rdaInfo.workFlowStep.allStep[_index] as any).execute!: []
    }

    /*保存流程步骤*/
    function setWorkFlowStep(obj:{key:string,value:any}) {
        rdaInfo.workFlowStep[obj.key as keyof typeof rdaInfo.workFlowStep] = obj.value
    }

    function setPoliceFlowStep(key:string, value:object[]) {
        rdaInfo.policeFlowStep[key]  = value
    }

    /*保存配置的管辖单位*/
    function setOfficeChild( value:object[]) {
        rdaInfo.allDict.officeChild = value
    }

    function setRdaConfig( value:object) {
        Object.assign(rdaInfo.rdaConfig, value)
    }

    function setRdaRole(key:string, value:string) {
        rdaInfo.role[key] = value
    }

    function setPreLoadData(key:string, value:object[]) {
        rdaInfo.preLoadData[key] = value
    }

    function setAlarmEntry( value: { visible:boolean, ringEvent:any}) {
        rdaInfo.alarmEntry = value
    }
    function getEventAction(id:string) :Promise<any>{
        return new Promise((resolve, reject) => {
            getEvent(id).then(result => {
                if (result.data.success) {
                    const $data = transferEvent(result.data.data)
                    setCurrentEvent($data)
                } else {
                    setCurrentEvent(undefined)
                }
                resolve(true)
            }).catch(err => {
                reject(err)
            })
        })
    }
    function getDipAction(dipId:string):Promise<object | boolean> {
        return new Promise((resolve, reject) => {
            try {
                getDipById(dipId).then((res:any) => {
                    if (res.data.success) {
                        setCurrentDip(res.data.data)
                        resolve(res.data.data)
                    } else {
                        setCurrentDip(null)
                        resolve(false)
                    }
                })
            } catch (e) {
                reject(e)
            }
        })

    }

    function transferEvent(obj:transferEventInter):object{
        obj.officeArray = JSON.parse(<string>obj.officeArray);
        obj.telPlace = JSON.parse(<string>obj.telPlace)
        if(typeof obj.vehicles ==='string'){
            obj.vehicles = obj.vehicles.split('|')
        }
        if(obj.gender !='未知' ) obj.gender = obj.gender == '1' ? '男' : '女';
        obj.details = JSON.parse(<string>obj.details)
        return obj
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