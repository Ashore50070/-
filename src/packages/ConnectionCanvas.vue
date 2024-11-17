<!-- <template>
  <svg
    ref="svg"
    :width="width"
    :height="height"
    class="connection-svg"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line
      v-for="(line, index) in lines"
      :key="index"
      :x1="line.start.x"
      :y1="line.start.y"
      :x2="line.end.x"
      :y2="line.end.y"
      stroke="rgba(220, 233, 126, 1)"
      stroke-width="2"
    />
    <line
      v-if="isDrawing"
      :x1="startPoint.x"
      :y1="startPoint.y"
      :x2="currentPoint.x"
      :y2="currentPoint.y"
      stroke="rgba(220, 233, 126, 1)"
      stroke-width="2"
      stroke-dasharray="5,5"
    />
  </svg>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted, defineComponent } from "vue";

export default defineComponent({
  props: {
    width: Number,
    height: Number,
    containerRef: Object
  },
  setup(props) {
    const svg = ref(null);
    const lines = reactive([]);
    const state = reactive({
      startPoint: { x: 0, y: 0 },
      currentPoint: { x: 0, y: 0 },
      isDrawing: false
    });

    const startConnection = (event) => {
      if (!props.containerRef.value) return; // 确保 containerRef.value 是 DOM 元素

      const { left, top } = props.containerRef.value.getBoundingClientRect();
      state.startPoint = { x: event.clientX - left, y: event.clientY - top };
      state.currentPoint = { ...state.startPoint };
      state.isDrawing = true;
      document.addEventListener("mousemove", drawConnection);
      document.addEventListener("mouseup", endConnection);
    };

    const drawConnection = (event) => {
      if (!state.isDrawing) return;
      const { left, top } = props.containerRef.getBoundingClientRect();
      state.currentPoint = { x: event.clientX - left, y: event.clientY - top };
    };

    const endConnection = (event) => {
      state.isDrawing = false;
      const { left, top } = props.containerRef.value.getBoundingClientRect();
      const endPoint = { x: event.clientX - left, y: event.clientY - top };
      lines.push({ start: { ...state.startPoint }, end: endPoint });
      document.removeEventListener("mousemove", drawConnection);
      document.removeEventListener("mouseup", endConnection);
    };

    onMounted(() => {
  if (props.containerRef?.value) { // 确保是 DOM 元素
    props.containerRef.value.addEventListener("mousedown", startConnection);
  }
});

onUnmounted(() => {
  if (props.containerRef?.value) {
    props.containerRef.value.removeEventListener("mousedown", startConnection);
  }
});

    return {
      svg,
      lines,
      ...state
    };
  }
});
</script>

<style scoped>
.connection-svg {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
</style> -->
