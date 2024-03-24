import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  base:"./",
  publicDir:"assets",

/*  build:{
    "minify":'terser',
    "terserOptions":{
      compress:{
        drop_console:true,
        drop_debugger:true
      }
    }
  },*/
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server:{
    hmr:{
      overlay:true
    },
    proxy:{
      '/zuul':{
        target:"http://192.168.110.143:30080",
        ws:true,
        changeOrigin:true,
        rewrite:path => path.replace(/^\/zuul/,'')
      }
    }
  }
})
