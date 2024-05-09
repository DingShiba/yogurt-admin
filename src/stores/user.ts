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
        menuData: [],
    })

    const _appRouters: Array<RouteRecordRaw> = [
       /* {
            path: '/defaultHome',
            name: 'defaultHome',
            component: ()=> import('../components/defaultHome/homeIndex.vue'),
            meta: {
            }
        }*/
    ]
    const onSetAppRouters = function (data: object[]) {
        try {
            data.forEach((item: any) => {
                const _menuPath = item.parentIds || [];
                _menuPath.push(item.name)
                const _redirectName = findRedirctName(item)
                const _obj = {
                    path: item.path,
                    name: item.name,
                    component: moudles["../views/" + item.component + ".vue"] ? moudles["../views/" + item.component + ".vue"] : NotFound,
                    meta: {
                        ...item,
                        menuPaths: _menuPath,
                        redirect: _redirectName,
                    }
                }
                _appRouters.push(_obj)
                if (!!item.children && item.children.length > 0) {
                    item.redirect = _redirectName
                    onSetAppRouters(item.children)
                }
            })
        } catch (e) {
            console.error(e)
        }

    }
    const findRedirctName = function (obj: any):any {
        if (!obj.children || obj.children.length == 0) {
            return obj.name
        } else {
            return  findRedirctName(obj.children[0])
        }
    }
    const isLogin = function () {
        return new Promise((resolve) => {
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
        onSetAppRouters(_data.menuList)
        userInfo.value.homePath = findHomePath(_appRouters)
        _appRouters.push({
            path: '/:pathMatch(.*)*',
            name: 'notFound',
            meta: {
                hideMenu: true,
            },
            children: [
                {
                    path: '/:pathMatch(.*)*',
                    name: "notFound",
                    component: NotFound,
                    meta: {
                        title: 'PageNotFound',
                    },
                },
            ],
        })
        router.addRoute({
            path: '/',
            name: 'root',
            component: MainLayout,
            children: _appRouters
        })
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
            menuData: [],
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