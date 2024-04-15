
export interface rdaInfoInter {
    allDict: {
        alarmGBDict:object,
        officeDict:object[],
        callType: object[],
        causeArr: object[],
        genderArr: object[],
        officeChild: object[],
        eventFrom: object[],
        dutyDict: object[],
        tagDict: object[]
    },
    JQZLCascader: Array<object>,
    workFlowStep: {
        allStep: object[],
        targetNodes: object[]
    },
    policeFlowStep: {
        [allStep:string]: object[],
        [targetNodes:string]: object[]
    },
    currentEvent: undefined | object,
    currentDip: {
        flowNode:string,
        [propName:string]:any
    } | null,
    rdaConfig: {
        isNotFirstUse: boolean,
        baseForm: {
            isRecive: boolean,
            isDip: boolean,
            pzUnit: object[]
        }
    },
    role: {
        [WORKFLOW_DEFINITION:string]: undefined | string,
        [DATA_LEVEL:string]: string
    },
    preLoadData: {
        [policeTreeData:string]: object[]
    },
    alarmEntry: {
        visible:boolean,
        ringEvent:object|null
    }
}
export interface transferEventInter{
    officeArray?:string | '[]',
    telPlace?:string | null,
    vehicles:string | string[],
    gender?:string | '未知',
    details?:string | null
}