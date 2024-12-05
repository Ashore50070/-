import { computed, defineComponent, ref, watch } from "vue";
import TogglePanel from './TogglePanel.vue';
import ControlTop from './ControlTop.vue';
import { RollbackOutlined, RetweetOutlined, CloudUploadOutlined, CloudDownloadOutlined, VerticalAlignTopOutlined, VerticalAlignBottomOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import "./editor.scss";
import EditorBlock from './editor-block';
import { useMenuDrag } from './useMenuDrag';
import { useBlockFocus } from './useBlockFocus';
import { useBlockDrag } from "./useBlockDrag";
import { useCommand } from "./useCommand";
import { $dialog } from "@/components/Dialog.jsx";
import {componentList, componentMap, componentState, updateComponentProps} from "./componentmodel"; 
import EditorOpearator from "./Editor-opearator";
import { ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton, ElInputNumber ,ElIcon} from "element-plus";
import paymentIcon from '@/images/待付款.svg'; // 使用 import 导入图片

export default defineComponent({
    props: {
        modelValue: { type: Object }
    },
    emits: ["update:modelValue", "update:blockPosition"], // 确保所有事件都已声明
    
    setup(props, { emit }) {
        const data = computed({
            get: () => props.modelValue,//定义一个计算属性data，每次返回结果自动反回取值props.modelValue，也就是获取data
            set: (newVal) => emit("update:modelValue", newVal)
        });
    
        
    
        //定义一个计算属性containerStyle，每次组件自动取值data中container部分的宽高
        const containerStyle = computed(() => {
            return {
                width: data.value.container.width + 'px',
                height: data.value.container.height + 'px',
            };
        });
    
        
        const containerRef = ref(null);
        const lines = ref([]);
        const currentLine = ref(null);
    
        // 1实现菜单拖拽，主组件获得了这个方法，要想使用就需要实现这个功能，
        const { handleDragstart, handleDragEnd } = useMenuDrag(containerRef, data);
    
        // 2实现组件聚焦，主组件获得了这个方法，要想使用就需要实现这个功能（选中焦点，鼠标点击），laseSelectBlock是为拖拽做一个辅助线
        
        const { blockMousedwn, clearBlockFocus, foucsData, laseSelectBlock } = useBlockFocus(data, (e) => {
            mouseDown(e);
        });

    
        const updateLinesOnBlockMove = (block) => {// 拖动模块（block）时动态更新连接线的位置,更新连接线
            if (!block || !block.key) {
                console.error("Block or block key is undefined");
                return;
            }
            // 遍历所有连接线，更新其起点和终点
                lines.value.forEach(line => {
                    // 更新起点坐标
                    if (line.from && line.from.blockId === block.key) {
                        if (line.from.side === 'right') {
                            line.startX = block.left + block.width; // 对准右侧节点
                            line.startY = block.top + block.height / 2;
                        } else if (line.from.side === 'left') {
                            line.startX = block.left;
                            line.startY = block.top + block.height / 2;
                        }
                    }
                
                    // 更新终点坐标
                    if (line.to && line.to.blockId === block.key) {
                        const targetBlock = data.value.blocks.find(b => b.key === line.to.blockId);
                        if (targetBlock) {
                            if (line.to.side === 'left') {
                                line.endX = targetBlock.left; // 对准左侧节点
                                line.endY = targetBlock.top + targetBlock.height / 2;
                            } else if (line.to.side === 'right') {
                                line.endX = targetBlock.left + targetBlock.width; // 对准右侧节点
                                line.endY = targetBlock.top + targetBlock.height / 2;
                            }
                        }
                    }
                });
            };

        // 3实现画布中组件拖拽
        const { mouseDown, markLine } = useBlockDrag(foucsData, laseSelectBlock, data,updateLinesOnBlockMove);
    
        const { commands } = useCommand(data, foucsData,lines);

        
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
        
               // 连接线的处理函数
        const isDragging = ref(false);  // 新增拖拽标志
        const startConnection = (block, side, e) => {
            const { left, top, width, height } = block;
            let startX, startY;
            if (side === 'left') {
                startX = left;
                startY = top + height / 2;
            } else if (side === 'right') {
                startX = left + width;
                startY = top + height / 2;
            } else if (side === 'top') {
                startX = left + width / 2;
                startY = top;
            } else if (side === 'bottom') {
                startX = left + width / 2;
                startY = top + height;
            }
            currentLine.value = {
                startX,
                startY,
                endX: startX,
                endY: startY,
                from: { blockId: block.key, side }
            };
            isDragging.value = false; // 初始设置为 false
        };


        const endConnection = (block, side) => {
            if (currentLine.value) {
                // 确保 block 和 block.key 存在
                if (!block || !block.key) {
                    console.error("Block or block key is undefined");
                    return;
                }
        
                currentLine.value.to = { blockId: block.key, side };
        
                // 检查 currentLine 是否已正确初始化
                if (currentLine.value.from && currentLine.value.to) {
                    lines.value.push({ ...currentLine.value });
                } else {
                    console.error("Connection line is incomplete", currentLine.value);
                }
        
                currentLine.value = null;
            }
        };


        const handleMouseMove = (e) => {
            if (currentLine.value) {
                currentLine.value.endX = (e.clientX-300);
                currentLine.value.endY = (e.clientY-132);
                // currentLine.value.endX = e.clientX;
                // currentLine.value.endY = e.clientY;
                isDragging.value = true; // 鼠标移动时设置为 true，开始绘制连接线
            }
        };


        const findTargetBlock = (mouseX, mouseY) => {
            // 遍历所有块，判断鼠标位置是否在某个块内
            return data.value.blocks.find((block) => {
                const { left, top, width, height } = block;
                return (
                    mouseX >= left && mouseX <= left + width &&
                    mouseY >= top && mouseY <= top + height
                );
            });
            
        };
        
        const handleMouseUp = (e) => {
            // 如果当前正在绘制连接线，并且没有连接到另一个节点，则保存连接线
            if (currentLine.value) {
                // 找到释放位置上的目标节点
                const targetBlock = findTargetBlock(e.clientX-300, e.clientY-132);
        
                if (targetBlock) {
                    // 连接到目标节点
                    endConnection(targetBlock, 'left'); // 你可以根据需要设置为 `left`, `right`, `top`, `bottom` 等
                } else {
                    // 如果没有目标节点，仍然保存当前连接线（可能是连接到鼠标释放的位置）
                    lines.value.push({ ...currentLine.value });
                }
        
                currentLine.value = null;
                isDragging.value = false; // 停止拖动，隐藏连接线
            }
        };
        
        return () => (
            <div class="editor">
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


                <TogglePanel>
                    <div className="editor-left">
                    <ElIcon><Bell /></ElIcon>
                        {/* 数据导入选择框 */}
                        <ElSelect placeholder="数据导入" style={{ width: '220px', margin: '30px auto', display: 'block' }}>
                            {componentList
                                .filter(item => ['button', 'text1'].includes(item.key)) // 过滤出key为'button'和'text1'的组件
                                .map((item) => (
                                    <ElOption

                                        key={item.key}
                                        value={item.key}
                                        draggable
                                        onDragstart={(e) => handleDragstart(e, item)}
                                        onDragend={handleDragEnd}
                                    >
                                        {/* 渲染组件的预览内容 */}
                                        <div>{item.preview()}</div>
                                    </ElOption>
                                ))}
                        </ElSelect>
                        
                        {/* 数据处理选择框 */}
                        <ElSelect placeholder="数据处理" style={{ width: '220px' , margin: '60px auto',display: 'block',}}>
                            {componentList
                                .filter(item => ['text2', 'text3'].includes(item.key)) // 过滤出key为'button'和'text1'的组件
                                .map((item) => (
                                    <ElOption
                                        key={item.key}
                                        value={item.key}
                                        draggable
                                        onDragstart={(e) => handleDragstart(e, item)}
                                        onDragend={handleDragEnd}
                                    >
                                        {/* 渲染组件的预览内容 */}
                                        <div>{item.preview()}</div>
                                    </ElOption>
                                ))}
                        </ElSelect>

                        {/* 工作任务管理选择框 */}
                        <ElSelect placeholder="工作任务管理" style={{ width: '220px' , margin: '30px auto',display: 'block',}}>
                            {componentList
                                .filter(item => ['text4', 'text5'].includes(item.key)) // 过滤出key为'button'和'text1'的组件
                                .map((item) => (
                                    <ElOption
                                        key={item.key}
                                        value={item.key}
                                        draggable
                                        onDragstart={(e) => handleDragstart(e, item)}
                                        onDragend={handleDragEnd}
                                    >
                                        {/* 渲染组件的预览内容 */}
                                        <div>{item.preview()}</div>
                                    </ElOption>
                                ))}
                        </ElSelect>

                        {/* 算法模型配置选择框 */}
                        <ElSelect placeholder="算法模型配置" style={{ width: '220px', margin: '60px auto',display: 'block',}}>
                            {componentList
                                .filter(item => ['text6', 'text7'].includes(item.key)) // 过滤出key为'button'和'text1'的组件
                                .map((item) => (
                                    <ElOption
                                        key={item.key}
                                        value={item.key}
                                        draggable
                                        onDragstart={(e) => handleDragstart(e, item)}
                                        onDragend={handleDragEnd}
                                    >
                                        {/* 渲染组件的预览内容 */}
                                        <div>{item.preview()}</div>
                                    </ElOption>
                                ))}
                        </ElSelect>
                        
                        {/* 模型训练选择框 */}
                        <ElSelect placeholder="模型训练" style={{ width: '220px' , margin: '60px auto',display: 'block',}}>
                            {componentList
                                .filter(item => ['text8', 'text9'].includes(item.key)) // 过滤出key为'button'和'text1'的组件
                                .map((item) => (
                                    <ElOption
                                        key={item.key}
                                        value={item.key}
                                        draggable
                                        onDragstart={(e) => handleDragstart(e, item)}
                                        onDragend={handleDragEnd}
                                    >
                                        {/* 渲染组件的预览内容 */}
                                        <div>{item.preview()}</div>
                                    </ElOption>
                                ))}
                        </ElSelect>

                        {/* 模型预测选择框 */}
                        <ElSelect placeholder="模型预测" style={{ width: '220px' , margin: '60px auto',display: 'block',}}>
                            {componentList
                                .filter(item => ['text10', 'text3'].includes(item.key)) // 过滤出key为'button'和'text1'的组件
                                .map((item) => (
                                    <ElOption
                                        key={item.key}
                                        value={item.key}
                                        draggable
                                        onDragstart={(e) => handleDragstart(e, item)}
                                        onDragend={handleDragEnd}
                                    >
                                        {/* 渲染组件的预览内容 */}
                                        <div>{item.preview()}</div>
                                    </ElOption>
                                ))}
                        </ElSelect>

                        {/* 模型评估选择框 */}
                        <ElSelect placeholder="模型评估" style={{ width: '220px' , margin: '60px auto',display: 'block',}}>
                            {componentList
                                .filter(item => ['text2', 'text3'].includes(item.key)) // 过滤出key为'button'和'text1'的组件
                                .map((item) => (
                                    <ElOption
                                        key={item.key}
                                        value={item.key}
                                        draggable
                                        onDragstart={(e) => handleDragstart(e, item)}
                                        onDragend={handleDragEnd}
                                    >
                                        {/* 渲染组件的预览内容 */}
                                        <div>{item.preview()}</div>
                                    </ElOption>
                                ))}
                        </ElSelect>
                    </div>
                </TogglePanel>

               
                <div className="editor-right">
                    {/* <EditorOpearator block={laseSelectBlock.value}    modelValue={props.modelValue}>
                        
                    </EditorOpearator> */}
                    {/* <!-- 动态绑定 EditorOperator 的属性 --> */}
                    <EditorOpearator
                        block={laseSelectBlock.value}   // 传递当前选中的组件
                        modelValue={props.modelValue}   // 绑定 modelValue，确保数据双向绑定
                        updateComponentProps={updateComponentProps}  // 传递更新组件属性的函数
                    />
                </div>

                                
                <div className="editor-botton">结果栏</div>
                <div class="editor-container" >
                <div class="editor-container-content_canvas" 
                    style={containerStyle} 
                    ref={containerRef} 
                    onMousedown={clearBlockFocus} 
                    onMousemove={handleMouseMove}
                    onMouseup={handleMouseUp}

                >
                    {data.value.blocks.map((block, index) => (
                        <EditorBlock 
                            v-model:modelValue={data.value} 
                            key={index} 
                            block={block} 
                            componentMap={componentMap} 
                            startConnection={startConnection} 
                            endConnection={endConnection} 
                            updateLinesOnBlockMove={updateLinesOnBlockMove}
                            onMousedown={(e) => blockMousedwn(e, block, index)}
                        />
                    ))}
                    
                    {/* 绘制连接线 */}
                    <svg class="editor-svg">
                        {lines.value.map((line, index) => (
                            <line
                                key={index}
                                x1={line.startX}
                                y1={line.startY}
                                x2={line.endX}
                                y2={line.endY}
                                stroke="#ff6347"
                                stroke-width="2"
                                onClick={() => handleLineClick(index)}  // 添加点击事件
                                style={{ cursor: 'pointer' }} // 鼠标悬停时显示为可点击状态
                            />
                        ))}
                        {isDragging.value && currentLine.value &&(
                            <line
                                x1={currentLine.value.startX}
                                y1={currentLine.value.startY}
                                x2={currentLine.value.endX}
                                y2={currentLine.value.endY}
                                stroke="gray"
                                stroke-width="2"
                                stroke-dasharray="5,5"
                            />
                        )}
                    </svg>
                </div>

                </div>
            </div>
        );
        
    }
});
