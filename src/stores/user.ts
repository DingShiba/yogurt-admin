import {defineStore} from "pinia";
import {ref} from "vue";
import router from "@/router";
import axios from "axios";
import Cookies from "js-cookie";
import type {RouteRecordRaw} from "vue-router";
import MainLayout from "@/components/pageLayout/mainLayout.vue";
import NotFound from "@/views/notFound/notFoundIndex.vue";

const moudles = import.meta.glob("../views/**/*.vue")

export const useUserStore = defineStore("user", () => {
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
        homePath: '',
        permission: '',
        menuData: '',
    })

    const _appRouters: Array<RouteRecordRaw> = [
        {
            path: '/404',
            name: 'any',
            component: NotFound,
            meta:{}
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'notFound',
            redirect: "/404",
            meta:{}
        }
    ]
    const onSetAppRouters = function (data: object[],parentMeta:any) {
        try {
            data.forEach((item: any) => {
                // console.log("是什么item",item)
                if (!!item.path && item.path != '') {
                    const _obj={
                        path: item.path,
                        name: item.name,
                        component: moudles["../views/" + item.component + ".vue"] ? moudles["../views/" + item.component + ".vue"] : NotFound,
                        meta: {
                            ...item,
                            // menuPaths:parentMeta.menuPaths.push(item.name)
                        }
                    }
                    console.log("惩恶",_obj)
                    _appRouters.push(_obj)
                    if (!!item.children && item.children.length > 0) {
                        onSetAppRouters(item.children,_obj.meta)
                    }
                }

            })
        } catch (e) {
            console.error(e)
        }

    }
    const isLogin = function () {
        return new Promise((resolve, reject) => {
            axios({
                url: "zuul/oauth/isLogin",
                method: 'get',
                params: {
                    menuMode: "1"
                }
            }).then((res: any) => {
                if (res.data.success) {
                    resolve(res.data.data)
                } else {
                    resolve(false)
                }
            })
        })
    }
    const setUserInfo = function (_data: any) {
        userInfo.value.userName = _data.name
        userInfo.value.loginName = _data.loginName
        userInfo.value.userId = _data.id
        userInfo.value.officeId = _data.officeId
        userInfo.value.officeIds = _data.officeIds
        userInfo.value.officeGrade = _data.officeGrade
        userInfo.value.officeType = _data.officeType
        userInfo.value.officeName = _data.officeName
        userInfo.value.companyId = _data.companyId
        userInfo.value.areaId = _data.areaId
        userInfo.value.homeMenuId = _data.homeMenuId
        userInfo.value.permission = _data.permissions
        userInfo.value.menuData = _data.menuList
        onSetAppRouters(_data.menuList,{
            menuPaths:[]
        })
        userInfo.value.homePath = findHomePath(_appRouters)
        router.addRoute({
            path: '/',
            name: 'root',
            component: MainLayout,
            children: _appRouters
        })
        // 获取主页,把root替换成主页name
        /*  router.push({
              name:"root"
          })*/
    }

    function findHomePath(routes: Array<RouteRecordRaw>) {
        let _path: string = ""
        const _index = routes.findIndex((item: any) => item.meta.home == true)
        if (_index != -1) _path = routes[_index].path
        else _path = routes[0].path
        return _path
    }

// 退出时清除用户信息
    const clearUserInfo = function () {
        userInfo.value = {
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
            homePath: '',
            permission: '',
            menuData: '',
        }
    }
    const logOut = function () {
        Cookies.remove("LESITSID")
        clearUserInfo()
        router.push({
            name: "login"
        })
    }
    return {userInfo, isLogin, logOut, setUserInfo}
})