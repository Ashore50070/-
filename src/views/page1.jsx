
import { computed, defineComponent, ref, watch } from "vue";
import { RollbackOutlined, RetweetOutlined, CloudUploadOutlined, CloudDownloadOutlined, VerticalAlignTopOutlined, VerticalAlignBottomOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import "../packages/editor.scss";
import EditorBlock from '../packages/editor-block';
import { useMenuDrag } from '../packages/useMenuDrag';
import { useBlockFocus } from '../packages/useBlockFocus';
import { useBlockDrag } from "../packages/useBlockDrag";
import { useCommand } from "../packages/useCommand";
import { $dialog } from "@/components/Dialog.jsx";
import {componentList, componentMap, componentState, updateComponentProps} from "../packages/componentmodel"; 
import EditorOpearator from "../packages/Editor-opearator";
import { ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton, ElInputNumber ,ElIcon,ElMenu,ElMenuItem,ElSubMenu} from "element-plus";
import { useRouter } from 'vue-router';
import dataJson from '../data.json'

export default defineComponent({
    props: {
        modelValue: { type: Object }
    },
    emits: ["update:modelValue", "update:blockPosition"], // 确保所有事件都已声明
    name: 'HomePage1',
    setup(props, { emit }) {

        const dataStore =ref(dataJson)
        
        const data = computed({
            get: () => dataStore.value,//定义一个计算属性data，每次返回结果自动反回取值props.modelValue，也就是获取data
            set: (newVal) => {
                dataStore.value = newVal
            }
        });
    
        const router = useRouter();

        const navigateToPage1 = () => {
          router.push('/page1'); // 跳转到 Page1
        };
    
        const navigateToPage2 = () => {
          router.push('/page2'); // 跳转到 Page2
        };
    
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
                currentLine.value.endX = (e.clientX-270);
                currentLine.value.endY = (e.clientY-95);
                // currentLine.value.endX = e.clientX;
                // currentLine.value.endY = e.clientY;
                isDragging.value = true; // 鼠标移动时设置为 true，开始绘制连接线
            }
        };

        const SNAP_OFFSET = 20; // 吸附范围（增加的像素大小）
        const findTargetBlock = (mouseX, mouseY) => {
            // 遍历所有块，判断鼠标位置是否在某个块内
            return data.value.blocks.find((block) => {
                const { left, top, width, height } = block;
                return (
                    mouseX >= left - SNAP_OFFSET && mouseX <= left + width + SNAP_OFFSET &&
                    mouseY >= top - SNAP_OFFSET && mouseY <= top + height + SNAP_OFFSET
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

        const isCollapsed = ref(false) // 初始为折叠状态
        const isCollapse = ref(false) // 初始为折叠状态
        const activeIndex = ref('1'); // 默认选中的菜单项
        
        return () => (
            <div class="editor">
                <div style={{ display: 'flex', height: '100vh' }}>
                    {/* 收起/展开按钮始终可见 */}
                    <div
                        style={{
                            position: 'absolute',
                            left: isCollapsed.value ? '0' : '100px',
                            top: '10px',
                            zIndex: 1000,
                            transition: 'left 0.3s ease',
                        }}
                    >
                        <ElButton
                            type="primary"
                            size="small"
                            circle
                            onClick={() => (isCollapsed.value = !isCollapsed.value)}
                        >
                            <ElIcon>
                            {isCollapsed.value ? <ArrowRight /> : <ArrowLeft />}
                            </ElIcon>
                        </ElButton>
                    </div>

                    {/* 菜单栏 */}
                    <div
                        style={{
                            transition: 'width 0.3s ease',
                            width: isCollapsed.value ? '0' : '100px',
                            overflow: 'hidden',
                            backgroundColor: '#71b1d1',
                            height: '100%',
                        }}
                    >
                        <ElMenu
                            default-active={activeIndex.value}
                            background-color="#71b1d1"
                            text-color="#FFF"
                            active-text-color="#FFD04B"
                            style={{ border: 'none', height: '100%' }}
                        >
                            <ElMenuItem index="1" onClick={navigateToPage1} style={{margin:'0px 0px 10px'}}>
                                <ElIcon>
                                    <Document />
                                </ElIcon>
                                <span>模型1</span>
                            </ElMenuItem>

                            <ElMenuItem index="2" onClick={navigateToPage2} style={{margin:'0px 0px 10px'}}>
                                <ElIcon>
                                    <Document />
                                </ElIcon>
                                <span>模型2</span>
                            </ElMenuItem>
                        </ElMenu>
                    </div>
                </div>
                {/* 顶部工具栏部分 */}   
                
                {isTopVisible.value && (
                        <div className="editor-top">
                        {buttons.map((btn) => (
                            <div onClick={btn.handler} className="editor-top-button">
                                {btn.icon}
                                <span>{btn.label}</span>
                            </div>
                        ))}
                        
                        <div style={{ marginTop: '20px' }}>
                        </div>
                    </div>
                )}

                <div className="editor-left">
                    {/* 切换折叠按钮 */}
                    <ElButton
                      type="primary"
                      onClick={() => (isCollapse.value = !isCollapse.value)} // 注意 .value 修改
                      style={{ 
                        margin: '10px 150px ', // 水平居中
                        width: '40%', // 按钮宽度
                        transition: 'all 0.3s ease',
                      }}         
                    >
                      {isCollapse.value ? '展开菜单' : '折叠菜单'}
                    </ElButton>
                    {/* 菜单容器 */}



                    <div style={{ width: isCollapse.value ? '64px' : '220px', transition: 'width 0.3s ease-in-out', overflow: 'hidden', whiteSpace: 'nowrap', backgroundColor: '#fff', padding: '0px 20px 15px' }}>
                        <ElMenu default-active="1" collapse={isCollapse.value} style={{ width: isCollapse.value ? '60px' : '200px', transformOrigin: 'left', borderRight: 'none', transition: 'all 0.3s ease-in-out' }}>
                            <ElSubMenu index="1" v-slots={{ title: () => (<div style={{ display: 'flex', alignItems: 'center' }}><ElIcon><Menu /></ElIcon>{!isCollapse.value && <span style={{ marginLeft: '8px' }}>模型算法配置</span>}</div>) }}>
                                {componentList.filter(item => ['text2', 'text3'].includes(item.key)).map(item => (
                                    <ElMenuItem key={item.key} index={item.key} draggable onDragstart={(e) => handleDragstart(e, item)} onDragend={handleDragEnd}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}><ElIcon style={{ marginRight: '8px' }}><Bell /></ElIcon>{!isCollapse.value && <span>{item.label}</span>}</div>
                                    </ElMenuItem>
                                ))}
                            </ElSubMenu>
                        </ElMenu>
                    </div>

                    <div style={{ width: isCollapse.value ? '64px' : '220px', transition: 'width 0.3s ease-in-out', overflow: 'hidden', whiteSpace: 'nowrap', backgroundColor: '#fff', padding: '0px 20px 15px' }}>
                        <ElMenu default-active="1" collapse={isCollapse.value} style={{ width: isCollapse.value ? '60px' : '200px', transformOrigin: 'left', borderRight: 'none', transition: 'all 0.3s ease-in-out' }}>
                            <ElSubMenu index="1" v-slots={{ title: () => (<div style={{ display: 'flex', alignItems: 'center' }}><ElIcon><Menu /></ElIcon>{!isCollapse.value && <span style={{ marginLeft: '8px' }}>模型训练</span>}</div>) }}>
                                {componentList.filter(item => ['text2', 'text3'].includes(item.key)).map(item => (
                                    <ElMenuItem key={item.key} index={item.key} draggable onDragstart={(e) => handleDragstart(e, item)} onDragend={handleDragEnd}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}><ElIcon style={{ marginRight: '8px' }}><Bell /></ElIcon>{!isCollapse.value && <span>{item.label}</span>}</div>
                                    </ElMenuItem>
                                ))}
                            </ElSubMenu>
                        </ElMenu>
                    </div>
                   

                    <div style={{ width: isCollapse.value ? '64px' : '220px', transition: 'width 0.3s ease-in-out', overflow: 'hidden', whiteSpace: 'nowrap', backgroundColor: '#fff', padding: '0px 20px 15px' }}>
                        <ElMenu default-active="1" collapse={isCollapse.value} style={{ width: isCollapse.value ? '60px' : '200px', transformOrigin: 'left', borderRight: 'none', transition: 'all 0.3s ease-in-out' }}>
                            <ElSubMenu index="1" v-slots={{ title: () => (<div style={{ display: 'flex', alignItems: 'center' }}><ElIcon><Menu /></ElIcon>{!isCollapse.value && <span style={{ marginLeft: '8px' }}>模型预测</span>}</div>) }}>
                                {componentList.filter(item => ['text2', 'text3'].includes(item.key)).map(item => (
                                    <ElMenuItem key={item.key} index={item.key} draggable onDragstart={(e) => handleDragstart(e, item)} onDragend={handleDragEnd}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}><ElIcon style={{ marginRight: '8px' }}><Bell /></ElIcon>{!isCollapse.value && <span>{item.label}</span>}</div>
                                    </ElMenuItem>
                                ))}
                            </ElSubMenu>
                        </ElMenu>
                    </div>

                    <div style={{ width: isCollapse.value ? '64px' : '220px', transition: 'width 0.3s ease-in-out', overflow: 'hidden', whiteSpace: 'nowrap', backgroundColor: '#fff', padding: '0px 20px 15px' }}>
                        <ElMenu default-active="1" collapse={isCollapse.value} style={{ width: isCollapse.value ? '60px' : '200px', transformOrigin: 'left', borderRight: 'none', transition: 'all 0.3s ease-in-out' }}>
                            <ElSubMenu index="1" v-slots={{ title: () => (<div style={{ display: 'flex', alignItems: 'center' }}><ElIcon><Menu /></ElIcon>{!isCollapse.value && <span style={{ marginLeft: '8px' }}>模型评估</span>}</div>) }}>
                                {componentList.filter(item => ['text2', 'text3'].includes(item.key)).map(item => (
                                    <ElMenuItem key={item.key} index={item.key} draggable onDragstart={(e) => handleDragstart(e, item)} onDragend={handleDragEnd}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}><ElIcon style={{ marginRight: '8px' }}><Bell /></ElIcon>{!isCollapse.value && <span>{item.label}</span>}</div>
                                    </ElMenuItem>
                                ))}
                            </ElSubMenu>
                        </ElMenu>
                    </div>

                </div>

                

               
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
                <div className="editor-botton">结果栏</div>
                

            </div>
        );
        
    }
});

// export default defineComponent({
//   name: 'HomePage1',
//   setup() {
//     return () => <div>页面 1</div>
//   }
// })