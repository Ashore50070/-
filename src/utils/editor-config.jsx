import { ElInput, ElButton } from 'element-plus';
import { Minus } from '@element-plus/icons-vue';  // 引入线段图标

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
// editorConfig.registrer({
//     label: '文本',
//     preview: () => <div></div>,
//     render: () => <div>渲染文本</div>,
//     key: 'text'
// })
// editorConfig.registrer({
//     label: '按钮',
//     preview: () => <ElButton></ElButton>,
//     render: () => <ElButton>渲染按钮</ElButton>,
//     key: 'button'
// })
// editorConfig.registrer({
//     label: '输入框',
//     preview: () => <ElInput placeholder='' />,
//     render: () => <ElInput placeholder='渲染输入框' />,
//     key: 'input'
// })
editorConfig.registrer({
    label: '文本',
    // 配置组建的映射关系，拖入画布区域container部分前和后
    preview: () => '',
    render: () => '文本',
    key: 'text'
})
editorConfig.registrer({
    label: '连接线',
    preview: () => <div></div>,
    render: () => <div style={{
        width: '100px',        // 线段的长度
        height: '2px',         // 线段的高度
        backgroundColor: 'red',  // 线段的颜色
        margin: '20px auto' }}></div>,
    key:'line'
});
editorConfig.registrer({
    label: '按钮',
    preview: () => <div style={{ fontSize: '10%' , display: 'inline-block'}}></div>,
    render: () => <div style={{ fontSize: '2%' , display: 'inline-block',border: '1px solid black', padding: '50px',borderRadius:'4px'}}>按钮</div>,
    key: 'button'
})
// editorConfig.registrer({
//     label: '按钮',
//     preview: () => <ElButton></ElButton>,
//     render: () => <ElButton>按钮</ElButton>,
//     key: 'button'
// })
editorConfig.registrer({
    label: '输入框',
    preview: () => <div style={{ fontSize: '20%' , display: 'inline-block'}}></div>,
    render: () => <div style={{ fontSize: '10%', display: 'inline-block' ,border: '1px solid black', padding: '50px',borderRadius:'4px'}}>输入框</div>,
    key: 'input'
})
editorConfig.registrer({
    label: '文本',
    preview: () => <div style={{ fontSize: '20%' ,display: 'inline-block' }}></div>,
    render: () => <div style={{ fontSize: '20%' ,display: 'inline-block' ,border: '1px solid black', padding: '50px',borderRadius:'4px'}}>文本</div>,
    key: 'text'
})
editorConfig.registrer({
    label: '文本',
    preview: () => <div style={{ fontSize: '20%' ,display: 'inline-block'}}></div>,
    render: () => <div style={{ fontSize: '20%' ,display: 'inline-block' ,border: '1px solid black', padding: '50px',borderRadius:'4px'}}>文本</div>,
    key: 'text'
})

