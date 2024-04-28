export interface receiveInter {
    [propName: string]: any
}

type nodeType = {
    definitionId: string,
    delFlag: string,
    execute: nodeType[],
    id: string,
    name: string,
    nodeIdx: number,
    remark: string

}

export interface flowInter {
    date: string,
    delFlag: string
    deploymentId: string
    description: string
    id: string
    name: string
    nodeList: nodeType[]
}
