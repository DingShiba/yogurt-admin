import {createRouter, createWebHistory, createWebHashHistory} from 'vue-router'
import LoginView from '../views/Login/LoginIndex.vue'
import NotFound from "@/views/notFound/notFoundIndex.vue";
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'
import Cookies from 'js-cookie'
import {useUserStore} from "@/stores/user";

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
    console.log("路由", router.getRoutes())
    console.log("路由", useUserStore().userInfo)
    console.log("来者不善", from)
    console.log("要去得", to)

    const LESITSCOOKIE = Cookies.get("LESITSID")
    const userStore = useUserStore()
    NProgress.start()
    if (!LESITSCOOKIE) {
        console.log(11)
        if (to.name !== 'login') {
            NProgress.done()
            next({name: 'login'})
        } else next()
    } else {
        if (userStore.userInfo.loginName == '') {
            console.log(22)
            const _res = await userStore.isLogin()
            console.log("解惑", _res)
            userStore.setUserInfo(_res)
            NProgress.done()
            next({
                path: to.path
            })
        } else {
            console.log(33)
            NProgress.done()
            next()
        }
    }
    NProgress.done()
})
export default router
