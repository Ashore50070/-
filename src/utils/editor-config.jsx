import { ElInput,ElButton } from 'element-plus'

/**
 * 定义一个 editorConfig 函数 来增加可拖拽组件
 * 并且返回出去 让外面可以拿到
 */

function createEditorConfig() {
    const componentList = []
    const componentMap = {}

    return {
        componentList,
        componentMap,
        registrer: (options) => {
            componentList.push(options)
            componentMap[options.key] = options
        }
    }

}
export let editorConfig = createEditorConfig()
editorConfig.registrer({
    label: '文本',
    preview: () => <div style={{ fontSize: '20%' ,display: 'inline-block'}}></div>,
    render: () => <div style={{ fontSize: '20%' ,display: 'inline-block'}}>1</div>,
    key: 'text'
})
editorConfig.registrer({
    label: '按钮',
    preview: () => <div style={{ fontSize: '10%' , display: 'inline-block'}}></div>,
    render: () => <div style={{ fontSize: '20%' , display: 'inline-block'}}>1</div>,
    key: 'button'
})
editorConfig.registrer({
    label: '输入框',
    preview: () => <div style={{ fontSize: '20%' , display: 'inline-block'}}></div>,
    render: () => <div style={{ fontSize: '20%', display: 'inline-block' }}>1</div>,
    key: 'input'
})
editorConfig.registrer({
    label: '文本',
    preview: () => <div style={{ fontSize: '20%' }}>预览文本</div>,
    render: () => <div style={{ fontSize: '20%' }}>1</div>,
    key: 'text'
})
editorConfig.registrer({
    label: '文本',
    preview: () => <div style={{ fontSize: '20%' }}>预览文本</div>,
    render: () => <div style={{ fontSize: '20%' }}>1</div>,
    key: 'text'
})