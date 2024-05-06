<template>
  <div class="ctree" @click.stop>
    <el-cascader
      v-on="events"
      v-bind="attrs"
      :props="attrs.props"
      v-model="val"
      :options="
        treeDataChangeField(
          tree,
          attrs.settings || {
            data: { id: 'value', name: 'label' },
            treeNodes: 'children',
          }
        )
      "
      @change="handleChange"
      style="width: 100%"
    />
  </div>
</template>
<script lang="ts">
import {
  getCurrentInstance,
  watch,
  ref,
  defineComponent,
  onBeforeMount,
  computed,
} from "vue";

import Utils from "./utils";
export default defineComponent({
  name: "DfCascader",
  props: {
    /**
     * 值
     */
    value: [String, Number, Array],
    /**
     * 组件配置
     */
    config: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, context) {
    const { proxy } = getCurrentInstance();
    const tree = ref([]);
    let val = ref(props.value);
    const treeDataChangeField = Utils.treeDataChangeField;
    const handleChange = (value) => {
      //当级联选中节点变化时触发
      //console.log(value);
    };

    /**
     * 属性配置
     */
    let attrs = computed(() => {
      return props.config.attrs || {};
    });
    let events = computed(() => {
      return props.config.events || {};
    });
    watch(val, () => {
      context.emit("input", val.value);
      context.emit("change-value", val.value);
      context.emit("change-label", props.config.prop, val.value);
    });
    watch(
      () => props.value,
      () => {
        val.value = props.value;
      }
    );

    watch(
      () => attrs.value.tree,
      (newValue, oldValue) => {
        if (attrs.value.getData) {
          return;
        }
        tree.value = newValue || [];
      },
      { immediate: true }
    );

    onBeforeMount(() => {
      //多tags模式下不建议使用getData方式获取数据,会导致多次重复创建重复请求
      attrs.value.getData &&
        attrs.value.getData().then((res) => {
          tree.value = Utils.deleteEmpty(res.data || res || [], "");
        });
    });
    return {
      tree,
      treeDataChangeField,
      handleChange,
      val,
      attrs,
      events,
    };
  },
});
</script>
<style lang="scss" scoped>
.ctree {
  &-input :deep(input) {
    cursor: pointer;
  }

  &-pos {
    position: absolute;
    left: 0;
    top: 100%;
    z-index: 1111;
    right: 0;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    background-color: #fff;
    padding: 6px 20px;
    box-sizing: border-box;
    margin-bottom: 40px;
  }
}
</style>
