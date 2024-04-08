import {defineStore} from "pinia";
import {ref} from "vue";
export const useAppStore=defineStore("app",()=>{
    const appInfo=ref({
        currentRoute:{}
    })
    function setCurrentRoute(value:object){
        appInfo.value.currentRoute=value
    }
    return {appInfo,setCurrentRoute}
})