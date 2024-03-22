import {defineStore} from "pinia";
import { reactive,defineAsyncComponent} from "vue";
import router from "@/router/index"
import axios from "axios";
import type {RouteRecordRaw} from "vue-router";
import MainLayout from "@/components/pageLayout/mainLayout.vue";
export const useUserStore=defineStore("user", () => {
    const user = reactive({
        userName: '',
        loginName: "",
        userId: '',
        officeId: '',
        officeIds: '',
        officeGrade: "",
        officeType: "",
        officeName: "",
        companyId: "",
        areaId: '',
        homeMenuId: '',
        permission: '',
        menuData: '',

    })

    const onGetAndSetUser=function (){
        axios({
            url:"zuul/oauth/isLogin",
            method:'get',
            params:{
                menuMode:"1"
            }
        }).then((res:any)=>{
            if(res.data.success){
                const _data=res.data.data
                user.userName=_data.name
                user.loginName=_data.loginName
                user.userId=_data.id
                user.officeId=_data.officeId
                user.officeIds=_data.officeIds
                user.officeGrade=_data.officeGrade
                user.officeType=_data.officeType
                user.officeName=_data.officeName
                user.companyId=_data.companyId
                user.areaId=_data.areaId
                user.homeMenuId=_data.homeMenuId
                user.permission=_data.permission
                user.menuData=_data.menuList
                onSetAppRouters(_data.menuList)
                router.addRoute({
                    path: '/',
                    name: 'root',
                    component: MainLayout,
                    children:_appRouters
                })
              /*  _appRouters.forEach((item)=>{
                    router.addRoute( item)
                })*/
                console.log('咋回事',router.getRoutes())
                router.push({
                    name:"root"
                })
            }
         })
    }
    const _appRouters:Array<RouteRecordRaw>=[]
    const onSetAppRouters=function (data:Array<object>){
        try {
            data.forEach((item:any)=>{
                if(!!item.path && item.path!=''){
                    _appRouters.push(  {
                        path: item.path,
                        name: item.name,
                        component:defineAsyncComponent(()=>import("../views"+item.path+".vue")),
                        meta:item
                    })
                }
                if(!!item.children && item.children.length>0){
                    onSetAppRouters(item.children)
                }
            })
        }catch (e){
            console.error(e)
        }

    }
    return {user,onGetAndSetUser}
})