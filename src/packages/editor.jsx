import { computed, defineComponent, inject, ref, watch } from "vue";
import TogglePanel from './TogglePanel.vue';
import ControlTop from './ControlTop.vue';
import { 
    RollbackOutlined, 
    RetweetOutlined, 
    CloudUploadOutlined, 
    CloudDownloadOutlined, 
    VerticalAlignTopOutlined, 
    VerticalAlignBottomOutlined,
    DeleteOutlined
} from '@ant-design/icons-vue';

import "./editor.scss";
import EditorBlock from './editor-block'
import { useMenuDrag } from './useMenuDrag'
import { useBlockFocus } from './useBlockFocus'
import { useBlockDrag } from "./useBlockDrag";
import { useCommand } from "./useCommand";
import { $dialog } from "@/components/Dialog.jsx";

// defineComponent就是定义放各种组件的地方
export default defineComponent({
    props: {
        modelValue: { type: Object }
    },
    emits: ["update:modelValue"],
    
    setup(props, ctx) {
        const data = computed({
            get: () => props.modelValue,//定义一个计算属性data，每次返回结果自动反回取值props.modelValue，也就是获取data
            set: (newVal) => ctx.emit("update:modelValue", newVal)
        });
    
        //定义一个计算属性containerStyle，每次组件自动取值data中container部分的宽高
        const containerStyle = computed(() => {
            return {
                width: data.value.container.width + 'px',
                height: data.value.container.height + 'px',
            };
        });
    
        const config = inject('config');
        const containerRef = ref(null);
    
        // 1实现菜单拖拽，主组件获得了这个方法，要想使用就需要实现这个功能，
        const { handleDragstart, handleDragEnd } = useMenuDrag(containerRef, data);
    
        // 2实现组件聚焦，主组件获得了这个方法，要想使用就需要实现这个功能（选中焦点，鼠标点击），laseSelectBlock是为拖拽做一个辅助线
        const { blockMousedwn, clearBlockFocus, foucsData, laseSelectBlock } = useBlockFocus(data, (e) => {
            mouseDown(e);
        });
    
        // 3实现画布中组件拖拽
        const { mouseDown, markLine } = useBlockDrag(foucsData, laseSelectBlock, data);
    
        const { commands } = useCommand(data, foucsData);
        const buttons = [
            {
                label: '撤销',
                icon: <RollbackOutlined style={{ fontSize: '20px' }} />,
                handler: () => commands.undo()
            },
            {
                label: '重做',
                icon: <RetweetOutlined style={{ fontSize: '20px' }} />,
                handler: () => commands.redo()
            },
            {
                label: '导出',
                icon: <CloudUploadOutlined style={{ fontSize: '20px' }} />,
                handler: () => {
                    $dialog({
                        title: '导出json使用',
                        content: JSON.stringify(data.value),
                    });
                }
            },
            {
                label: '导入',
                icon: <CloudDownloadOutlined style={{ fontSize: '20px' }} />,
                handler: () => {
                    $dialog({
                        title: '导入json使用',
                        content: '',
                        footer: true,
                        onConfirm(text) {
                            commands.updateContainer(JSON.parse(text));
                        }
                    });
                }
            },
            {
                label: '置顶',
                icon: <VerticalAlignTopOutlined style={{ fontSize: '20px' }} />,
                handler: () => commands.placeTop()
            },
            {
                label: '置底',
                icon: <VerticalAlignBottomOutlined style={{ fontSize: '20px' }} />,
                handler: () => commands.placeBottom()
            },
            {
                label: '删除',
                icon: <DeleteOutlined style={{ fontSize: '20px' }} />,
                handler: () => commands.delete()
            }
        ];


        const isTopVisible = ref(true); // 控制顶部栏的显示状态
        // 处理顶部栏显示和隐藏的逻辑
        const handleToggleTop = () => {
            isTopVisible.value = !isTopVisible.value;
        };
       
        return () => (
            <div className="editor">
            
                {/* 顶部工具栏部分 */}   
                <ControlTop onToggle-top={handleToggleTop} />
                {isTopVisible.value && (
                    <div className="editor-top">
                        {buttons.map((btn) => (
                            <div onClick={btn.handler} className="editor-top-button">
                                {btn.icon}
                                <span>{btn.label}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* 左侧面板 */}
                <TogglePanel>
                    <div className="editor-left">
                        <div className="editor-left-content">
                            {config.componentList.map((item, index) => (
                                <div
                                    key={index} // 使用 key 属性，保持唯一性
                                    className="editor-left-content-item"
                                    draggable
                                    onDragstart={(e) => handleDragstart(e, item)}
                                    onDragend={(e) => handleDragEnd(e)}
                                    //下面item.labe，item.preview是为左侧组件内容栏中获取到配置的组件
                                >
                                    
                                    <span className="label">{item.label}</span>
                                    <div className="com">{item.preview()}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TogglePanel>

                <div className="editor-right">属性控制栏</div>
                <div className="editor-botton">结果栏</div>
                
                <div className="editor-container">
                    {/* 负责产生滚动条 */}
                    <div className="editor-container-content">
                        {/* 内容区域 */}
                        <div className="editor-container-content_canvas"
                            style={containerStyle}
                            ref={containerRef}
                            onMousedown={clearBlockFocus}
                        >
                            {/* .map拿到里面的代码块 */}
                            {data.value.blocks.map((block, index) => (
                                // 内容中代码块的编辑，定位直接作为另一个组件editor-block
                                <EditorBlock
                                    block={block}
                                    onMousedown={e => blockMousedwn(e, block, index)}//鼠标点击画布中的组件可拖动，e是事件源，block是被点击的东西，就是组件
                                    class={block.focus ? 'editor-block-focus' : ''} />
                            ))}
                            {markLine.value.x !== null && <div className="line-x" style={{ left: markLine.value.x + 'px' }}></div>}
                            {markLine.value.y !== null && <div className="line-y" style={{ top: markLine.value.y + 'px' }}></div>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
})