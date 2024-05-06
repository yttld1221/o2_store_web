<template>
  <el-switch v-model="val" v-bind="attrs" v-on="events" />
</template>

<script lang="ts">
import { watch, ref, defineComponent, computed } from "vue";

export default defineComponent({
  name: "DfSwitch",
  props: {
    /**
     * 值
     */
    value: {},
    /**
     * 组件配置
     */
    config: {
      type: Object,
      default: () => ({}),
    },
  },

  setup(props, context) {
    let val = ref(props.value);

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
      context.emit("change-value", val.value);
      context.emit("change-label", props.config.prop, val.value);
    });
    watch(
      () => props.value,
      () => {
        val.value = props.value;
      }
    );

    return {
      val,
      attrs,
      events,
    };
  },
});
</script>

<style lang="scss" scoped></style>
