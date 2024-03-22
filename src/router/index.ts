import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/Login/LoginIndex.vue'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css'
import {useUserStore} from "@/stores/user";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: LoginView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },

  ]
})

router.beforeEach(async (to,from)=>{
  const userStore = useUserStore()
  const _res=await userStore.isLogin()
  if(!_res && to.name !== 'login'){
    return { name: 'login' }
  }else if(userStore.userInfo.loginName==''){
    userStore.setUserInfo(_res)
    return true
  }

})
export default router
