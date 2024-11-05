

<template>
    <div>
      <!-- 按钮文本基于父组件传入的状态进行切换 -->
      
      <!-- <button @click="toggleTop" class="control-top">{{ isVisible ? '隐藏' : '显示' }}</button> -->
      <button @click="toggleTop" class="control-top">
        <div v-if="isVisible">
          <View 
                :style="{
                    width: '50px', 
                    height: '50px',
                    color:'#ffffff'
                }"/>
        </div>
        <div v-else="isVisible">
          <Hide 
                :style="{
                    width: '50px', 
                    height: '50px',
                    color:'#ffffff'
                }"/>
        </div>
      </button>
    </div>
  </template>
  
  <script >
  import { ref } from 'vue';
  export default {
    setup(){
      const isVisible =ref(true);
      return{
      isVisible
    };
    },
    name: "ControlTop",
    methods: {
      toggleTop() {
        this.$emit('toggle-top'); // 发射事件通知父组件切换顶部栏的显示状态
      },
    },
  };
  </script>
  
  <style scoped>
  .control-top {   
    cursor: pointer;
    background-color:#2c2c2c;
    border: '2px solid #2c2c2c';
    border: none; /* 去掉边框*/
    position: absolute;  /* 确保按钮位置可以自由调整 */
    top: 10px;           /* 距离顶部的距离 */
    right: 255px;         /* 距离右侧的距离 */
    z-index: 10;       /* 让按钮浮在其他元素上方 */
  }
  </style>