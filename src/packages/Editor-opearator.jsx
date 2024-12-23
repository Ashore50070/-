


import { defineComponent, reactive, watch ,ref} from "vue";
import { ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton, ElInputNumber } from "element-plus";
import { componentList } from "./componentmodel";
import deepcopy from 'deepcopy'; // 确保你引入了 deepcopy 函数
import dataJson from '../data.json'
export default defineComponent({
  props: {
    block: { type: Object }, // 用户最后选中的元素
    modelValue: {
      type: Object,
      default: () => reactive({ container: {} }), // 确保 data 是响应式对象
    },
  },
  setup(props, ctx) {
    // 为每个组件维护独立的状态
    const dataStore =ref(dataJson)
    const componentsState = reactive({});

    // 初始化状态
    const state = reactive({
      editData: deepcopy(dataStore.container || { width: 100, height: 100 }), // 默认宽高为 100
    });

    // 监听 props.block 变化
    watch(
      () => props.block,
      (newBlock) => {
        if (newBlock && newBlock.key) {
          // 如果当前有新的块被选中，初始化对应的状态
          if (!(newBlock.key in componentsState)) {
            componentsState[newBlock.key] = deepcopy(props.modelValue.container || { width: 100, height: 100 }); // 初始化块的属性数据
          }
          state.editData = componentsState[newBlock.key]; // 设置当前选中的块的属性数据
        }
      },
      { immediate: true }
    );

    // 更新选中块的状态
    const updateComponentState = () => {
      if (props.block && props.block.key) {
        componentsState[props.block.key] = state.editData; // 更新选中块的属性
        ctx.emit("update:modelValue", { ...props.modelValue, container: state.editData });
      }
    };

    // 渲染表单项
    const renderFormItem = (propKey, propValue) => {
      if (!(propKey in state.editData)) {
        state.editData[propKey] = ""; // 确保有默认值
      }

      switch (propValue.type) {
        case "input":
          return (
            <ElFormItem key={propKey}>
              <ElInput v-model={state.editData[propKey]} placeholder={propValue.label} />
            </ElFormItem>
          );
        case "select":
          return (
            <ElFormItem key={propKey}>
              <ElSelect v-model={state.editData[propKey]} placeholder={propValue.label}>
                {propValue.options?.map((option) => (
                  <ElOption label={option.label} value={option.value} key={option.value} />
                ))}
              </ElSelect>
            </ElFormItem>
          );
        default:
          return null;
      }
    };

    const renderComponentProps = () => {
      // 如果没有选中组件，直接渲染宽高
      if (!props.block || !props.block.key) {
        return (
          <>
            <ElFormItem label="容器宽度" >
              <ElInputNumber v-model={state.editData.width} onUpdate:modelValue={updateComponentState} />
            </ElFormItem>
            <ElFormItem label="容器高度" style={{ }}>
              <ElInputNumber v-model={state.editData.height} onUpdate:modelValue={updateComponentState} />
            </ElFormItem>
          </>
        );
      }

      const selectedComponent = componentList.find(
        (component) => component.key === props.block.key
      );

      if (!selectedComponent) return null;

      return (
        <div>
          {Object.entries(selectedComponent.props).map(([propKey, propValue]) =>
            renderFormItem(propKey, propValue)
          )}
        </div>
      );
    };



    return () => {
      return (
        <ElForm labelPosition="top">
          {/* 渲染拖入的组件对应的表单控件 */}
          {renderComponentProps()}
          <ElFormItem>
            <ElButton 
              type="primary" 
              style={{ display: "flex", justifyContent: "center", alignItems: "center" }} 
              onClick={updateComponentState}>
              应用
            </ElButton>
            <ElButton
              onClick={() => {
                // 重置 state.editData 为初始值
                state.editData = deepcopy(props.modelValue || {});
                updateComponentState(); // 同时通知父组件更新数据
              }}
              style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              重置
            </ElButton>
          </ElFormItem>
        </ElForm>
      );
    };
  },
});


