<template>
  <div class="instruction-flow">
    <div class="editor-toolbar">
      <a-tooltip title="开启/关闭网格" placement="bottom">
        <div class="toobar-item">
          <TableOutlined/>
          <div>网格</div>
        </div>
      </a-tooltip>


    </div>
    <div class="editor-container">
      <div class="layout-sider">
        <!--        <h1>{{flowData.description}}</h1>-->
      </div>
      <div class="layout-content">
        <div id="myFlow"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {TableOutlined} from '@ant-design/icons-vue'
import {ref, reactive, onMounted, onUnmounted, inject} from 'vue'
import FlowEditor from "@/views/cad/utils/flowEditor";
import AppData from './data'

const $http: any = inject("$http");
let flowEditor: any;

let flowData: any;
onMounted(() => {
  $http({
    url: "/zuul/workflow1/definition/latest/chuchai",
    method: 'get'
  }).then((res: any) => {
    console.log(res)
    if (res.data.success) {
      flowData = res.data.data
    }
  })
  flowEditor = new FlowEditor({
    el: "#myFlow",
    width: 200,
    data:AppData
  })
  console.log(flowEditor.canvasWidth)
})
setTimeout(() => {
  console.log("zala", flowEditor)
})

</script>

<style scoped lang="less">
.editor-toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 64px;
  padding: 0 16px;
  box-shadow: 0 2px 8px #f0f1f2;

  .toobar-item {
    width: 50px;
    height: 50px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    cursor: pointer;

    &:hover {
      background-color: #f6f6f6;
      border-radius: 2px;
    }
  }
}

.editor-container {
  display: flex;
  gap: 10px;
  justify-content: space-between;

  .layout-sider {
    width: 100px;
  }

  .layout-content {
    width: 100%;
    #myFlow {
      width: 100%;
      height: 600px;
    }
  }
}
</style>