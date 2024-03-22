import {defineStore} from "pinia";
import { defineAsyncComponent, ref} from "vue";
import router from "@/router";
import axios from "axios";
import type {RouteRecordRaw} from "vue-router";
import MainLayout from "@/components/pageLayout/mainLayout.vue";
export const useUserStore=defineStore("user", () => {
    const userInfo = ref({
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

    const _appRouters:Array<RouteRecordRaw>=[
        {
            path: '/:pathMatch(.*)*',
            name: 'notFound',
            component: () => import('@/views/notFound/notFoundIndex.vue'),
        },
    ]
    const onSetAppRouters=function (data:Array<object>){
        try {
            data.forEach((item:any)=>{
                if(!!item.path && item.path!=''){
                    _appRouters.push(  {
                        path: item.path,
                        name: item.name,
                        component:defineAsyncComponent(()=>import("../views/"+item.component+".vue")),
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
    const  isLogin= function (){
        return new Promise((resolve, reject)=>{
            axios({
                url:"zuul/oauth/isLogin",
                method:'get',
                params:{
                    menuMode:"1"
                }
            }).then((res:any)=>{
                if(res.data.success){
                    resolve(res.data.data)
                }else {
                    resolve(false)
                }
            })
        })
    }
    const setUserInfo=function (_data:any){
        userInfo.value.userName=_data.name
        userInfo.value.loginName=_data.loginName
        userInfo.value.userId=_data.id
        userInfo.value.officeId=_data.officeId
        userInfo.value.officeIds=_data.officeIds
        userInfo.value.officeGrade=_data.officeGrade
        userInfo.value.officeType=_data.officeType
        userInfo.value.officeName=_data.officeName
        userInfo.value.companyId=_data.companyId
        userInfo.value.areaId=_data.areaId
        userInfo.value.homeMenuId=_data.homeMenuId
        userInfo.value.permission=_data.permission
        userInfo.value.menuData=_data.menuList
        onSetAppRouters(_data.menuList)
        router.addRoute({
            path: '/',
            name: 'root',
            component: MainLayout,
            children:_appRouters
        })

        router.push({
            name:"root"
        })
    }
    return {userInfo,isLogin,setUserInfo}
})