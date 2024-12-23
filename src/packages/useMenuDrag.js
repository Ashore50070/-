import { events } from "./events";

/**
 * 实现菜单(左侧栏)拖拽到画布
 * @param {ElementRef} containerRef dom元素
 * @param {Object} data 已经注册的菜单组件数据 
 */
export function useMenuDrag (containerRef, data) {
    let currentComponent
    const handleDragstart = (e, component) => {
        // 进入目标容器内， 添加一个移动比标识
        containerRef.value.addEventListener("dragenter", dragenter, false);
        // 经过目标容器  阻止默认动作以启用drop
        containerRef.value.addEventListener("dragover", dragover, false);
        // 当拖动元素离开可放置目标节点， 添加一个禁用标识
        containerRef.value.addEventListener("dragleave", dragleave, false);
        // 将拖动的元素到所选择的放置目标节点中
        containerRef.value.addEventListener("drop", drop, false);
        currentComponent = component

        events.emit('start') // 发布start方法
    }
    const handleDragEnd = (e) => {
        containerRef.value.removeEventListener("dragenter", dragenter, false);
        containerRef.value.removeEventListener("dragover", dragover, false);
        containerRef.value.removeEventListener("dragleave", dragleave, false);
        containerRef.value.removeEventListener("drop", drop, false);
        events.emit('end') // 发布end方法
    }
    const dragenter = (e) => {
        e.dataTransfer.dropEffect = 'copy'
    }
    const dragover = (e) => {
        e.preventDefault();
    }
    const dragleave = (e) => {
        e.dataTransfer.dropEffect = 'none'
    }
    //当我对组件进行拖拽，释放的时候，对释放的组件，实现居中操作
    const drop = (e) => {
        // 假设当前组件有默认宽高，可以通过 currentComponent 获取
        const componentWidth = currentComponent.width || 150;  // 组件默认宽度
        const componentHeight = currentComponent.height || 100; // 组件默认高度
    
        // 计算居中位置
        const centerX = e.offsetX - componentWidth / 2;
        const centerY = e.offsetY - componentHeight / 2;
    
        // 更新数据，放置居中后的组件
        data.value = {
            ...data.value,
            blocks: [
                ...data.value.blocks,
                {
                    top: centerY,          // 居中后的 Y 坐标
                    left: centerX,         // 居中后的 X 坐标
                    zIndex: 1,
                    key: currentComponent.key,
                    alignCenter: true
                }]
        }
    
        currentComponent = null;  // 清空当前组件
    }
    return {
        handleDragstart,
        handleDragEnd
    }
}