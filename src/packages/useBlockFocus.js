import { computed, ref } from 'vue'
/**
 * 获取哪些对象（画布中组件）被选中了，选中的组件可以在画布中自由拖拽
 * @param {Object} data 已有的菜单数据
 * @param {callback} callback 回调函数 
 */
export function useBlockFocus (data, callback) {
    const selectIndex = ref(-1) // 当前被选中的block的索引

    
    const laseSelectBlock = computed(() =>{ 
        
         return data.value.blocks[selectIndex.value]
        }
    )
    

    const clearBlockFocus = () => {//遍历实现其余未被点击的组件都清空focus
        data.value.blocks.forEach(block => {
            block.focus = false
        });
        selectIndex.value = -1
    }

    const blockMousedwn = (e, block, idx) => {
        e.stopPropagation()
        e.preventDefault()
        
        if (e.shiftKey) {
            // 加一个判断。当前只有一个节点被选中时，按住shift，也不会focus
            if (foucsData.value.focus.length <= 1) block.focus = true;
            else block.focus = !block.focus
        } else {
            if (!block.focus) {// block上我们规划一个属性，focus 获取焦点后就将focus变为true
                clearBlockFocus()//规定当前点击的组件显示被点击，其余未被点击的都清空focus 
                block.focus = true
            }
        }
        selectIndex.value = idx
        callback(e)
    }
    //写一个计算属性，计算哪些组件焦点选中了，哪些没有选中
    const foucsData = computed(() => {
        let focus = []
        let unfocused = []
        data.value.blocks.forEach(block => (block.focus ? focus : unfocused).push(block))
        return {
            focus,unfocused}
    })

//把外部方法（主组件中需要实现的部分导出去）
    return {
        clearBlockFocus,
        blockMousedwn,
        foucsData,
        laseSelectBlock
    }
}