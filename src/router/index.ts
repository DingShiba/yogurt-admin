import {createRouter, createWebHistory, createWebHashHistory} from 'vue-router'
import LoginView from '../views/Login/LoginIndex.vue'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'
import Cookies from 'js-cookie'
import {useUserStore} from "@/stores/user";
import {useAppStore} from '@/stores/app'

const router = createRouter({
    // history: createWebHistory(import.meta.env.BASE_URL),
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: LoginView
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView
        }
    ]
})

router.beforeEach(async (to, from, next) => {
    const LESITSCOOKIE = Cookies.get("LESITSID")
    const userStore = useUserStore()
    const appStore=useAppStore()
    NProgress.start()
    if (!LESITSCOOKIE) {
        if (to.name !== 'login') {
            NProgress.done()
            next({name: 'login'})
        } else next()
    } else {
        if (userStore.userInfo.loginName == '') {
            const _res = await userStore.isLogin()
            userStore.setUserInfo(_res)
            NProgress.done()
            next({
                path: to.path
            })
        } else {
            NProgress.done()
            next()
        }
    }
    appStore.setCurrentRoute(to)
    NProgress.done()
})
export default router
