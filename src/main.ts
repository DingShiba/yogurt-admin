import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from "ant-design-vue"
import "ant-design-vue/dist/reset.css"

import App from './App.vue'
import router from './router'
import axios from 'axios'
import moment from "moment";
moment.locale("zh-cn");
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)
app.use(moment)
app.provide('$http',axios)

app.mount('#app')
