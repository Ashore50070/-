<template>
    <div>
      <!-- 按钮文本基于父组件传入的状态进行切换 -->
      <button @click="toggleTop" class="control-top">{{ isVisible ? '隐藏' : '显示' }}</button>
    </div>
  </template>
  
  <script>
  export default {
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
    font-size: 30px;
    cursor: pointer;
    position: absolute;  /* 确保按钮位置可以自由调整 */
    top: 10px;           /* 距离顶部的距离 */
    right: 1700px;         /* 距离右侧的距离 */
    z-index: 1000;       /* 让按钮浮在其他元素上方 */
  }
  </style>