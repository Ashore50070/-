

<template>
  <div class="app">
    <!-- 主组件vue接受子组件editor.jsx，并且为其命名Editor ，并且子组件获得父组件已有的属性data,vue3中默认绑定数据名字是modelValue    
     即v-mode：modelValue="state"是v-model="state"-->
    <Editor v-model="state"/>

  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import data from './data.json'
import Editor from './packages/editor.jsx'

let state = ref(data)//定义data数据源的响应式，可以让template中（放入的全部组件）全部接受到


</script>

<style lang="scss" scoped>
// 为 <div class="app">整个大盒子进行留白处理
.app {
  position: absolute;
  top: 10px;
  left: 10px;
  bottom: 10px;
  right: 10px;
  z-index: 10;
}

</style>
