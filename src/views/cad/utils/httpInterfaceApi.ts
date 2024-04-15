import axios from "axios";
/**
 * 根据接警单id获取警情事件*/
export const getEvent = (id:string) => {
    return axios.request({
        url: '/zuul/rda/alarm/rev/' + id,
        method: 'get',
    })
};
/**
 * 根据处警单id查询处警单*/
export const getDipById = (dipId:string) => {
    return axios({
        url: "/zuul/rda/alarm/dip/"+dipId,
        method: 'get',
    })
};

/**
 * 根据procedurePrefix获取流程数据*/
export const getWorkFlowData = (name:string) => {
    return axios.request({
        url: '/zuul/workflow1/definition/total',
        params: {name: name},
        method: 'get',
    })
};
/**
 * 根据当前用户的机构获取下一级机构信息*/
export const getOfficeChildByOAuth = (parentId:string) => {
    return axios({
        url: '/zuul/upm/office/child',
        params: {
            parentId: parentId
        },
        method: 'get'
    })
}