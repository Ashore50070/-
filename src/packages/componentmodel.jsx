import { defineComponent, ref, reactive, computed, onMounted, watch, nextTick } from "vue";
import { ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton, ElInputNumber ,ElTree } from "element-plus";

// 创建组件配置
const componentList = [];
const componentMap = {};

const registerComponent = (options) => {
    componentList.push(options);
    componentMap[options.key] = options;
};
// 组件状态（独立于共享状态）
const componentState = reactive({});

const createInputProp1 = (label) => ({ type: 'input', label, model: 'button' });
const createInputProp2 = (label) => ({ type: 'input', label, model: 'text2' });
const createSelectProp = (label, options) => ({ type: 'select', label, options });
const createColorProp = (label) => ({ type: 'color', label });
// 注册按钮组件



registerComponent({
    label: '按钮',
    preview: () => (
        <div style={{ width: '30px', height: '20px', color: 'black', margin: '0 auto', backgroundColor: '#f5f7fa', borderRadius: '4px', border: '1px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginBottom: '40px' }}>
            按钮
        </div>
    ),
    render: (props) => {
        const { text = '', content = '' } = props || {};
        return (
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <span style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', fontSize: '20px', color: '#00ffff' }}>组件1</span>
                <div style={{ width: '150px', height: '100px', backgroundColor: '#626aef', borderRadius: '10px', border: '1px solid #ffffff' }}>
                    <PictureFilled style={{ width: '150px', height: '100px', color: '#ffffff' }} />
                </div>
                {/* 仅展示 props，无需绑定更新 */}
                <div>{text}</div>
                <div>{content}</div>
            </div>
            

        );
    },
    key: 'button',
    props: {
        text: createInputProp1('按钮文本'),
        content: createSelectProp('内容选择', [
            { label: '内容1', value: 'content1' },
            { label: '内容2', value: 'content2' }
        ])
    }
});


// 注册文本组件
registerComponent({
    label: '文本',
    preview: () => (
        <div style={{ width: '30px', height: '20px', color: 'black', margin: '0 auto', backgroundColor: '#f5f7fa', borderRadius: '4px', border: '1px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginBottom: '40px' }}>
            文本预览
        </div>
    ),
    render: (props) => {
        const { text = '', content = '' } = props || {};
        return (
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <span style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', fontSize: '20px', color: '#59d0a7' }}>组件2</span>
                <div style={{ width: '150px', height: '100px', backgroundColor: '#F56C6C', borderRadius: '10px', border: '1px solid #ffffff' }}>
                    <Star style={{ width: '150px', height: '100px', color: '#ffffff' }} />
                </div>
                <div>{text}</div>
                <div>{content}</div>
            </div>
        );
    },
    key: 'text1',
    props: {
        text: createInputProp2('文本内容'),
        content: createSelectProp('选项', [
            { label: '选择1', value: 'select1' },
            { label: '选择2', value: 'select2' },
            { label: '选择3', value: 'select3' }
        ])
    }
});

// 注册文本块组件
registerComponent({
    label: '文本块',
    preview: () => (
        <div style={{ width: '30px', height: '20px', color: 'black', margin: '0 auto', backgroundColor: '#f5f7fa', borderRadius: '4px', border: '1px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginBottom: '40px' }}>
            文本块预览
        </div>
    ),
    render: (props) => {
        const { text = '', content = '' } = props || {};
        return (
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <span style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', fontSize: '20px', color: '#59d0a7' }}>组件3</span>
                <div style={{ width: '150px', height: '100px', backgroundColor: '#FF6347', borderRadius: '10px', border: '1px solid #ffffff' }}>
                    <DataAnalysis style={{ width: '150px', height: '100px', color: '#ffffff' }} />
                </div>
                <div>{text}</div>
                <div>{content}</div>
            </div>
        );
    },
    key: 'text2',
    props: {
        text: createInputProp2('文本内容'),
        content: createSelectProp('选项', [
            { label: '选择1', value: 'select1' },
            { label: '选择2', value: 'select2' },
            { label: '选择3', value: 'select3' }
        ])
    }
});

registerComponent({
    label: '文档',
    preview: () => <div style={{ width: '30px', height: '20px', color: 'black', margin: '0 auto', backgroundColor: '#f5f7fa', borderRadius: '4px', border: '1px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginBottom: '40px' }}>文档预览</div>,
    render: () => (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', fontSize: '20px', color: '#59d0a7' }}>组件4</span>
            <div style={{ width: '150px', height: '100px', backgroundColor: '#FFD700', borderRadius: '10px', border: '1px solid #ffffff' }}>
                            {/* 直接使用全局注册的图标 */}
                <DocumentCopy style={{
                    width: '150px', 
                    height: '100px',
                    color: '#ffffff'
                }} />
            </div>
        </div>
    ),
    key: 'text3',
    props:{
        text:createInputProp1('文本内容'),
        content:createSelectProp('选项',
            [
                {laber:'选择1',value:'select1'},
                {laber:'选择2',value:'select2'},
                {laber:'选择3',value:'select3'},
            ]
        )
    }
});

registerComponent({
    label: '文档',
    preview: () => <div style={{ width: '30px', height: '20px', color: 'black', margin: '0 auto', backgroundColor: '#f5f7fa', borderRadius: '4px', border: '1px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginBottom: '40px' }}>任务1</div>,
    render: () => (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', fontSize: '20px', color: '#59d0a7' }}>组件5</span>
            <div style={{ width: '150px', height: '100px', backgroundColor: '#FFD700', borderRadius: '10px', border: '1px solid #ffffff' }}>
                            {/* 直接使用全局注册的图标 */}
                <DocumentCopy style={{
                    width: '150px', 
                    height: '100px',
                    color: '#ffffff'
                }} />
            </div>
        </div>
    ),
    key: 'text4',
    props:{
        text:createInputProp1('文本内容4'),
        content:createSelectProp('选项',
            [
                {laber:'选择1',value:'select1'},
                {laber:'选择2',value:'select2'},
                {laber:'选择3',value:'select3'},
            ]
        )
    }
});

registerComponent({
    label: '文档',
    preview: () => <div style={{ width: '30px', height: '20px', color: 'black', margin: '0 auto', backgroundColor: '#f5f7fa', borderRadius: '4px', border: '1px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginBottom: '40px' }}>任务2</div>,
    render: () => (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', fontSize: '20px', color: '#59d0a7' }}>组件6</span>
            <div style={{ width: '150px', height: '100px', backgroundColor: '#FFD700', borderRadius: '10px', border: '1px solid #ffffff' }}>
                            {/* 直接使用全局注册的图标 */}
                <DocumentCopy style={{
                    width: '150px', 
                    height: '100px',
                    color: '#ffffff'
                }} />
            </div>
        </div>
    ),
    key: 'text5',
    props:{
        text:createInputProp1('文本内容5'),
        content:createSelectProp('选项',
            [
                {laber:'选择1',value:'select1'},
                {laber:'选择2',value:'select2'},
                {laber:'选择3',value:'select3'},
            ]
        )
    }
});

registerComponent({
    label: '文档',
    preview: () => <div style={{ width: '30px', height: '20px', color: 'black', margin: '0 auto', backgroundColor: '#f5f7fa', borderRadius: '4px', border: '1px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginBottom: '40px' }}>任务3</div>,
    render: () => (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', fontSize: '20px', color: '#59d0a7' }}>组件7</span>
            <div style={{ width: '150px', height: '100px', backgroundColor: '#FFD700', borderRadius: '10px', border: '1px solid #ffffff' }}>
                            {/* 直接使用全局注册的图标 */}
                <DocumentCopy style={{
                    width: '150px', 
                    height: '100px',
                    color: '#ffffff'
                }} />
            </div>
        </div>
    ),
    key: 'text6',
    props:{
        text:createInputProp1('文本内容6'),
        content:createSelectProp('选项',
            [
                {laber:'选择1',value:'select1'},
                {laber:'选择2',value:'select2'},
                {laber:'选择3',value:'select3'},
            ]
        )
    }
});

registerComponent({
    label: '文档',
    preview: () => <div style={{ width: '30px', height: '20px', color: 'black', margin: '0 auto', backgroundColor: '#f5f7fa', borderRadius: '4px', border: '1px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginBottom: '40px' }}>任务4</div>,
    render: () => (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', fontSize: '20px', color: '#59d0a7' }}>组件8</span>
            <div style={{ width: '150px', height: '100px', backgroundColor: '#FFD700', borderRadius: '10px', border: '1px solid #ffffff' }}>
                            {/* 直接使用全局注册的图标 */}
                <DocumentCopy style={{
                    width: '150px', 
                    height: '100px',
                    color: '#ffffff'
                }} />
            </div>
        </div>
    ),
    key: 'text7',
    props:{
        text:createInputProp1('文本内容7'),
        content:createSelectProp('选项',
            [
                {laber:'选择1',value:'select1'},
                {laber:'选择2',value:'select2'},
                {laber:'选择3',value:'select3'},
            ]
        )
    }
});

registerComponent({
    label: '文档',
    preview: () => <div style={{ width: '30px', height: '20px', color: 'black', margin: '0 auto', backgroundColor: '#f5f7fa', borderRadius: '4px', border: '1px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginBottom: '40px' }}>任务5</div>,
    render: () => (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', fontSize: '20px', color: '#59d0a7' }}>组件9</span>
            <div style={{ width: '150px', height: '100px', backgroundColor: '#FFD700', borderRadius: '10px', border: '1px solid #ffffff' }}>
                            {/* 直接使用全局注册的图标 */}
                <DocumentCopy style={{
                    width: '150px', 
                    height: '100px',
                    color: '#ffffff'
                }} />
            </div>
        </div>
    ),
    key: 'text8',
    props:{
        text:createInputProp1('文本内容8'),
        content:createSelectProp('选项',
            [
                {laber:'选择1',value:'select1'},
                {laber:'选择2',value:'select2'},
                {laber:'选择3',value:'select3'},
            ]
        )
    }
});

registerComponent({
    label: '文档',
    preview: () => <div style={{ width: '30px', height: '20px', color: 'black', margin: '0 auto', backgroundColor: '#f5f7fa', borderRadius: '4px', border: '1px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginBottom: '40px' }}>任务6</div>,
    render: () => (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', fontSize: '20px', color: '#59d0a7' }}>组件10</span>
            <div style={{ width: '150px', height: '100px', backgroundColor: '#FFD700', borderRadius: '10px', border: '1px solid #ffffff' }}>
                            {/* 直接使用全局注册的图标 */}
                <DocumentCopy style={{
                    width: '150px', 
                    height: '100px',
                    color: '#ffffff'
                }} />
            </div>
        </div>
    ),
    key: 'text9',
    props:{
        text:createInputProp1('文本内容9'),
        content:createSelectProp('选项',
            [
                {laber:'选择1',value:'select1'},
                {laber:'选择2',value:'select2'},
                {laber:'选择3',value:'select3'},
            ]
        )
    }
});

registerComponent({
    label: '文档',
    preview: () => <div style={{ width: '30px', height: '20px', color: 'black', margin: '0 auto', backgroundColor: '#f5f7fa', borderRadius: '4px', border: '1px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginBottom: '40px' }}>任务7</div>,
    render: () => (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', fontSize: '20px', color: '#59d0a7' }}>组件11</span>
            <div style={{ width: '150px', height: '100px', backgroundColor: '#FFD700', borderRadius: '10px', border: '1px solid #ffffff' }}>
                            {/* 直接使用全局注册的图标 */}
                <DocumentCopy style={{
                    width: '150px', 
                    height: '100px',
                    color: '#ffffff'
                }} />
            </div>
        </div>
    ),
    key: 'text10',
    props:{
        text:createInputProp1('文本内容10'),
        content:createSelectProp('选项',
            [
                {laber:'选择1',value:'select1'},
                {laber:'选择2',value:'select2'},
                {laber:'选择3',value:'select3'},
            ]
        )
    }
});


// 组件状态更新的函数
const updateComponentProps = (key, newProps) => {
    componentState[key] = { ...componentState[key], ...newProps };
};

// 导出组件列表和映射
export { componentList, componentMap, componentState, updateComponentProps};

