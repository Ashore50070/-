//对于画布中的组件，点击后就可以进行托拽的功能了
import { ref } from "vue"
import { events } from "./events"
/**
 * 实现组件拖拽
 * @param {Object} foucsData 选中的元素 
 * @param {Object} laseSelectBlock 最后一个选中的元素
 * @param {Object} data 已有的菜单和画布的宽高
 * @param {Function} updateLinesOnBlockMove 更新连接线的函数
 */
export function useBlockDrag (foucsData, laseSelectBlock, data,updateLinesOnBlockMove) {
    let dragState = {
        startY: 0,
        startX: 0,
        startPosition: []
    }
    let markLine = ref({
        x: null,
        y: null
    })
    const mouseDown = (e) => {
        // 在 mouseDown 函数中，增加一个检查，确保点击的元素不是节点。如果点击的是节点，则不触发拖拽逻辑。如果点击的是节点，则不执行组件的拖拽逻辑
        if (e.target.classList.contains('connection-node')) {
            return;
        }
        const { width: BWidth, height: BHeight } = laseSelectBlock.value

        // 记录鼠标按下的位置
        dragState = {
            startY: e.clientY,
            startX: e.clientX,// 记录每一个选中的位置
            startLeft: laseSelectBlock.value.left, // b点拖拽欠的位置 left和top  b点：当前拖拽的元素
            startTop: laseSelectBlock.value.top,
            // 记录每个选中的元素的位置，方便后续计算
            startPosition: foucsData.value.focus.map(({ left, top }) => ({ left, top })),
            // TODO 居中整个盒子，需要把data.container 中的 width height 拿过来 push到unfocused
            // lines: (() => {
            //     const { unfocused } = foucsData.value // 获取其他没选中的以他们的位置作为辅助线
            //     let lines = { x: [], y: [] }; // 计算横线的位置用y来存，x存的是纵向
            //     [...unfocused, {
            //         top: 0,
            //         left: 0,
            //         width: data.value.container.width,
            //         height: data.value.container.height
            //     }].forEach((block) => {
            //         const { top: ATop, left: ALeft, width: AWidth, height: AHeight } = block
            //         // 当此元素(laseSelectBlock)推拽到于A元素top一致的时候，要显示这根辅助线
            //         lines.y.push({ showTop: ATop, top: ATop })
            //         lines.y.push({ showTop: ATop, top: ATop - BHeight }) // 顶对底
            //         lines.y.push({ showTop: ATop + AHeight / 2, top: ATop + AHeight / 2 - BHeight / 2 }) // 中间最齐
            //         lines.y.push({ showTop: ATop + AHeight, top: ATop + AHeight }) // 底对顶
            //         lines.y.push({ showLeft: ALeft + AHeight, top: ATop + AHeight - BHeight }) // 底对底

            //         lines.x.push({ showLeft: ALeft, left: ALeft }) // 左对左
            //         lines.x.push({ showLeft: ALeft + AWidth, left: ALeft + AWidth }) // 右对左
            //         lines.x.push({ showLeft: ALeft + AWidth / 2, left: ALeft + AWidth / 2 - BWidth / 2 }) // 中间最齐
            //         lines.x.push({ showLeft: ALeft + AWidth, left: ALeft + AWidth - BWidth }) // 右对左
            //         lines.x.push({ showLeft: ALeft, left: ALeft - BWidth })
            //     });
            //     return lines
            // })()
            lines: calculateLines(foucsData.value, data.value, BWidth, BHeight)
        }
        document.addEventListener('mousemove', mouseMove)
        document.addEventListener('mouseup', mouseUp)
    }


     // 计算辅助线
     const calculateLines = (focusData, containerData, BWidth, BHeight) => {
        const { unfocused } = focusData;
        let lines = { x: [], y: [] };

        [...unfocused, {
            top: 0,
            left: 0,
            width: containerData.container.width,
            height: containerData.container.height
        }].forEach((block) => {
            const { top: ATop, left: ALeft, width: AWidth, height: AHeight } = block;

            // 计算水平线
            lines.y.push({ showTop: ATop, top: ATop });
            lines.y.push({ showTop: ATop, top: ATop - BHeight });
            lines.y.push({ showTop: ATop + AHeight / 2, top: ATop + AHeight / 2 - BHeight / 2 });
            lines.y.push({ showTop: ATop + AHeight, top: ATop + AHeight });

            // 计算垂直线
            lines.x.push({ showLeft: ALeft, left: ALeft });
            lines.x.push({ showLeft: ALeft + AWidth, left: ALeft + AWidth });
            lines.x.push({ showLeft: ALeft + AWidth / 2, left: ALeft + AWidth / 2 - BWidth / 2 });
        });

        return lines;
    };

    const mouseMove = (e) => {
        let { clientX: moveX, clientY: moveY } = e
        if(!dragState.dragging) {
            dragState.dragging = true
            events.emit('start') // 触发事件就会记住拖拽前的位置
        }

        // 计算当前元素最新的left和top 去线里面找，找到显示线
        // 鼠标移动后 - 鼠标移动前 + left 就好了
        let left = moveX - dragState.startX + dragState.startLeft
        let top = moveY - dragState.startY + dragState.startTop

        // 先计算横线 距离参照物元素 还有5像素的时候 显示辅助线
        let x = null
        let y = null
        for (let i = 0; i < dragState.lines.y.length; i++) {
            const { showTop: s, top: t } = dragState.lines.y[i] // 获取每一根线
            if (Math.abs(t - top) <= 5) {
                y = s;
                moveY = dragState.startY - dragState.startTop + t // 容器距离顶部的距离 + 目标距离
                // 实现快速贴边
                break; // 找到一根线后就跳出循环
            }
        }
        for (let i = 0; i < dragState.lines.x.length; i++) {
            const { showLeft: s, left: l } = dragState.lines.x[i] // 获取每一根线
            if (Math.abs(l - left) <= 5) {
                x = s;
                moveX = dragState.startX - dragState.startLeft + l // 容器距离顶部的距离 + 目标距离
                // 实现快速贴边
                break; // 找到一根线后就跳出循环
            }
        }
        markLine.value.x = x // markLine 是一个响应式数据，x y更新了会导致视图更新
        markLine.value.y = y

        const dragX = moveX - dragState.startX // 元素拖拽前和拖拽后的距离
        const dragY = moveY - dragState.startY
        // 因为foucsData是一个计算属性获取到的值，所以直接修改，props可以代理数据
        foucsData.value.focus.forEach((el, idx) => {
            el.left = dragState.startPosition[idx].left + dragX
            el.top = dragState.startPosition[idx].top + dragY
        })

          // **更新连接线位置**
          foucsData.value.focus.forEach(el => {
            updateLinesOnBlockMove(el);
        });
    }
    const mouseUp = () => {
        document.removeEventListener('mousemove', mouseMove)
        document.removeEventListener('mouseup', mouseUp)
        markLine.value.x = null
        markLine.value.y = null
        if(dragState.dragging) { // 拖拽结束才触发end, 如果只是点击，不会触发end
            events.emit('end')
        }
    }

    return {
        mouseDown,
        markLine
    }
}