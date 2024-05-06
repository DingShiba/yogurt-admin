import {defineStore} from "pinia";
import {reactive} from "vue";
export const useAppStore=defineStore("app",()=>{
    const appInfo=reactive({
        currentRoute:{},
        menuPaths:[],
        theme:"dark",
        layout:"horizontal"
    })
    function setCurrentRoute(value:object){
        appInfo.currentRoute=value
    }
    function setTheme(value:string){
        appInfo.theme=value
    }
    function setLayout(value:string){
        appInfo.layout=value
    }
    function setMenuPaths(value:[]){
        appInfo.menuPaths=value
    }
    return {appInfo,setCurrentRoute,setTheme,setLayout,setMenuPaths}
})