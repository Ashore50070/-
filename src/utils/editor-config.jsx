import { ElInput, ElButton } from 'element-plus';



/**
 * 定义一个 editorConfig 函数 来增加可拖拽组件，用来显示内容区的所有组件物料
 * 并且返回出去 让外面可以拿到
 */



function createEditorConfig() {
    //定义一个组件列表
    const componentList = []

    // 定义一个映射关系omponentMap，哪个key对应哪个组件
    const componentMap = {}

    return {
        componentList,
        componentMap,
        //registrer 是一个方法，它接受 options 作为参数,options是一个参数名,代表传入 registrer 函数的对象如下面label、key
        registrer: (options) => {
            componentList.push(options)// 将 options 添加到 componentList 数组中
            componentMap[options.key] = options// 在 componentMap 对象中，使用 options.key 作为键，options 作为值
        }
    }

}
export let editorConfig = createEditorConfig()

editorConfig.registrer({
    label: '按钮',
    preview: () => <div></div>,
    render: () => (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <span 
                style={{ 
                    position: 'absolute', 
                    top: '-30px',  // 根据需要调整文字与按钮之间的距离
                    left: '50%', 
                    transform: 'translateX(-50%)',  // 使文字水平居中
                    fontSize: '20px',
                    color: '#00ffff'  // 设置文字颜色
                }}
            >
                组件1
            </span>
            <div
                style={{ 
                    width: '150px', 
                    height: '100px',
                    fontSize: '20px',
                    backgroundColor: '#626aef',
                    borderRadius: '10px',
                    border: '1px solid #ffffff'
                }} 
            >
                {/* 直接使用全局注册的图标 */}
                <PictureFilled 
                style={{
                    width: '150px', 
                    height: '100px',
                    color:'#ffffff'
                }}/>
            </div>
        </div>
    ),
    key: 'button'
});
editorConfig.registrer({
    label: '文本',
    preview: () => <div></div>,
    render: () => (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <span 
                
                style={{ 
                    
                    position: 'absolute', 
                    top: '-30px',  // 根据需要调整文字与按钮之间的距离
                    left: '50%', 
                    transform: 'translateX(-50%)',  // 使文字水平居中
                    fontSize: '20px',
                    color: '#59d0a7'  // 设置文字颜色
                }}
            >
                组件2
            </span>
            <div 
                style={{ 
                    width: '150px', 
                    height: '100px',
                    fontSize: '20px',
                    backgroundColor: '#F56C6C',
                    borderRadius: '10px',
                    border: '1px solid #ffffff'
                }} 
            >
                {/* 直接使用全局注册的图标 */}
                <Star style={{
                            width: '150px', 
                            height: '100px',
                            color: '#ffffff'
                }} />
            </div>
        </div>
    ),
    key: 'text1'
});
editorConfig.registrer({
    label: '文本',
    preview: () => <div></div>,
    render: () => (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <span 
                
                style={{ 
                    
                    position: 'absolute', 
                    top: '-30px',  // 根据需要调整文字与按钮之间的距离
                    left: '50%', 
                    transform: 'translateX(-50%)',  // 使文字水平居中
                    fontSize: '20px',
                    color: '#59d0a7'  // 设置文字颜色
                }}
            >
                组件3
            </span>
            <div 
                style={{ 
                    width: '150px', 
                    height: '100px',
                    fontSize: '20px',
                    backgroundColor: '#F56C6C',
                    borderRadius: '10px',
                    border: '1px solid #ffffff'
                }} 
            >
                {/* 直接使用全局注册的图标 */}
                <DataAnalysis  style={{
                            width: '150px', 
                            height: '100px',
                            color: '#ffffff'
                }} />
            </div>
        </div>
    ),
    key: 'text2'
});
editorConfig.registrer({
    label: '文本',
    preview: () => <div></div>,
    render: () => (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <span 
                
                style={{ 
                    
                    position: 'absolute', 
                    top: '-30px',  // 根据需要调整文字与按钮之间的距离
                    left: '50%', 
                    transform: 'translateX(-50%)',  // 使文字水平居中
                    fontSize: '20px',
                    color: '#59d0a7'  // 设置文字颜色
                }}
            >
                组件4
            </span>
            <div 
                style={{ 
                    width: '150px', 
                    height: '100px',
                    fontSize: '20px',
                    backgroundColor: '#F56C6C',
                    borderRadius: '10px',
                    border: '1px solid #ffffff'
                }} 
            >
                {/* 直接使用全局注册的图标 */}
                <DocumentCopy style={{
                            width: '150px', 
                            height: '100px',
                            color: '#ffffff'
                }} />
            </div>
        </div>
    ),
    key: 'text3'
});





