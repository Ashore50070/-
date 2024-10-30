
<!-- editor.jsx使用到TogglePanel.vue是因为在editor.jsx中
import TogglePanel from './TogglePanel.vue';
和<TogglePanel></TogglePanel>的使用吗 -->


<template>
    <div> 
        <div 
      class="toggle-panel-wrapper" 
      @mousedown="startDragging"
      :style="{ left: panelLeft + 'px', top: panelTop + 'px' }"
        > 
      <!-- 下面这个加一层div使用选择器class，用于放入在主组件的editor.scss中修改按钮位置，也可以直接放在子组件中 -->
      <!-- <div className="toggle-panel-wrapper"></div> -->
    <!-- 属性需要放在一个选择器中，才能被使用，调整按钮样式就需要这样 -->
      <button @click="togglePanel" class="toggle-btn">{{ isVisible ?'>':'>' }}</button>
      </div>
      <!-- 如果面板可见，显示插槽内容 -->
      <transition name="slide">
      <div v-if="isVisible" class="panel-content">
        <slot></slot> <!-- 用插槽来包含传入的内容 -->
      </div>
    </transition>
    </div>
  </template>
  

  <script>
  export default {
    name: "TogglePanel",
    data() {
      return {
        isVisible: true, // 控制面板显示和隐藏
      };
    },
    methods: {
      // 切换面板的显示状态
      togglePanel() {
        this.isVisible = !this.isVisible;
      }
    }
  };
  </script>
  
<style scoped>
  .toggle-btn {
           /* 按钮文字颜色 */
    border: none;             /* 移除边框 */
    font-size: 20px;
     /* 圆角按钮 */
    cursor: pointer;          /* 鼠标悬停时显示为手型 */

    display: flex;
    justify-content: center;  /* 控制按钮水平居中 */
    align-items: flex-end;    /* 控制按钮垂直位置到下方 */
    position: absolute;
    left: 230px;               /* 左对齐，确保按钮靠近左侧面板 */
    bottom: 97%;             /* 确保按钮靠近底部，可以根据需要调整 */
    z-index: 100;   
  }             
</style>
  