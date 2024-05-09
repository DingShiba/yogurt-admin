<template>
<div class="login-index">
  <a-form
      class="login-form"
      :model="formState"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      @submit="onSubmit"
  >
    <a-form-item
        label="用户名"
        name="username"
        :rules="[{ required: true, message: '请输入用户名' }]"
    >
      <a-input v-model:value="formState.username" placeholder="请输入用户名"/>
    </a-form-item>

    <a-form-item
        label="密码"
        name="password"
        :rules="[{ required: true, message: '请输入密码' }]"
    >
      <a-input-password v-model:value="formState.password" placeholder="请输入密码" />
    </a-form-item>

    <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
      <a-checkbox v-model:checked="formState.remember">记住我</a-checkbox>
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-form-item>
  </a-form>
</div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, onUnmounted, inject} from 'vue'
import {useUserStore} from "@/stores/user";
import qs from 'qs'
import router from "@/router";
const $http:any=inject("$http")
const userStore:any=useUserStore()
const formState=reactive({
  username:'552211',
  password:'LESits!@#',
  remember:false
})
// const  modules=import.meta.glob("")
const onSubmit=function (){
  $http({
    url:"/zuul/oauth/",
    data: qs.stringify(formState),
    method: "post"
  }).then((res:any)=>{
    if(res.data.success){
      // console.log("cookie",Cookies.get("LESITSID"))
      // Cookies.set("LESITSID", res.data.data, { expires: 1 })
      userStore.isLogin().then((res:any)=>{
        if(res!==false) {
          userStore.setUserInfo(res)
          const _hasHome=router.hasRoute(userStore.userInfo.homeMenuId)
          if(_hasHome){
            router.push({
              name:userStore.userInfo.homeMenuId
            })
          }else {
            router.push({
              path:"/defaultHome"
            })
          }

        }
      })
    }
  })
}

</script>

<style scoped lang="less">
.login-index{
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-form{
    width: 600px;
    margin: auto;
  }
}
</style>