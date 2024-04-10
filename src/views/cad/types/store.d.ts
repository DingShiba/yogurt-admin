export interface workFlowType{
    key:string,
    value?:any
}
export interface rdaInfoType{
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
}