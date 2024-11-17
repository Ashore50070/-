import { defineComponent, ref, computed, onMounted,watch ,nextTick} from "vue";

export default defineComponent({
    props: {
        block: { type: Object, required: true },
        componentMap: { type: Object, required: true },
        startConnection: { type: Function, required: true },
        updateConnection: { type: Function, required: true },
        updateLinesOnBlockMove: { type: Function, required: true }, // 新增的 prop
        endConnection: { type: Function, required: true }
    },
    setup(props) {
        const blockStyle = computed(() => ({
            top: `${props.block.top}px`,
            left: `${props.block.left}px`,
            zIndex: props.block.zIndex,
            position: 'absolute'
        }));

        const blockRef = ref(null);

        onMounted(async() => {
            await nextTick(); // 确保在 DOM 元素挂载完成后执行
            if (blockRef.value) {
                const { offsetWidth, offsetHeight } = blockRef.value;
                props.block.width = offsetWidth;
                props.block.height = offsetHeight;

                // 更新连接线
                props.updateLinesOnBlockMove(props.block);
            }
        });

             // 监听 block 的位置变化，并更新连接线
        watch(() => [props.block.left, props.block.top], () => {
                props.updateLinesOnBlockMove(props.block);
        });

        const handleMouseDownOnNode = (side, e) => {
            props.startConnection(props.block, side, e);
        };

        return () => {
            const component = props.componentMap[props.block.key];
            if (!component) return <div>组件未找到</div>;

            return (
                <div style={blockStyle.value} ref={blockRef} class="editor-block">
                    {/* 左侧连接节点 */}
                    <div
                        class="connection-node left-node"
                        onMousedown={(e) => handleMouseDownOnNode('left', e)}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '-10px',
                            transform: 'translateY(-50%)',
                            width: '10px',
                            height: '10px',
                            backgroundColor: 'red',
                            borderRadius: '50%',
                            cursor: 'pointer'
                        }}
                    />
                    {/* 渲染组件内容 */}
                    {component.render()}
                    {/* 右侧连接节点 */}
                    <div
                        class="connection-node right-node"
                        onMousedown={(e) => handleMouseDownOnNode('right', e)}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            right: '-10px',
                            transform: 'translateY(-50%)',
                            width: '10px',
                            height: '10px',
                            backgroundColor: 'red',
                            borderRadius: '50%',
                            cursor: 'pointer'
                        }}
                    />
                </div>
            );
        };
    }
});
