// 获取主组件中对应函数的所有内容，包括主组件获取到的其余子组件
import { computed, defineComponent,inject, onMounted, ref, watch } from "vue";
// 这一部分是画布区域内容块（editor.jsx中{/* 内容区域 */}）（拖入组件）的配置信息。对应每个单独的组件位置
export default defineComponent({
    props: {
        block: {type: Object}
    },
    setup(props) {
        const config = inject('config')//注入方法直接获取主组件的config依赖项，里面有key属性，inject 用于接收上层组件使用 provide 提供的数据
        const blockStyle = computed(() => {
            return {
                top: props.block.top + 'px',
                left: props.block.left + 'px',
                zIndex: props.block.zIndex
            }
        })
        const blockRef = ref(null)
        onMounted(() => {
            let { offsetWidth,offsetHeight } = blockRef.value
            if(props.block.alignCenter) { // 说明拖拽松手的时候才渲染，其他的默认渲染到页面上
                props.block.left = props.block.left - offsetWidth / 2
                props.block.top = props.block.top - offsetHeight / 2
                props.block.alignCenter = false // 让渲染后的结果才能去居中
            }
            props.block.width = offsetWidth
            props.block.height = offsetHeight
        })
        return () => {
            //通过block的key属性（block的key属性是由主组件里config获取到的）直接获取对应的组件
            const component = config.componentMap[props.block.key]
            return <div style={blockStyle.value} class="editor-block" ref={blockRef}>{component.render()}</div>
        }
    }
})