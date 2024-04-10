import axios from "axios";
/*获取事件*/
export const getEvent = (id:string) => {
    return axios.request({
        url: '/zuul/rda/alarm/rev/' + id,
        method: 'get',
    })
};