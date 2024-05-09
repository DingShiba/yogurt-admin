<template>
<a-config-provider v-bind="$props" :theme="theme">
  <slot/>
</a-config-provider>
</template>

<script setup lang="ts">
import { computed} from 'vue'
import {useThemeStore} from "@/stores/theme";
defineOptions({
  name: 'DConfigProvider',
});

const themeStore=useThemeStore()
const theme=computed(()=>themeStore.themeConfig)
console.log("zala",theme.value)
</script>
