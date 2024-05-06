<template>
  <el-autocomplete
    style="width: 100%; height: 32px; margin-top: -2px"
    v-model="val"
    v-bind="attrs"
    v-on="events"
    class="autocomplete"
  />
</template>

<script lang="ts">
import {
  getCurrentInstance,
  watch,
  ref,
  onMounted,
  nextTick,
  defineComponent,
  computed,
  inject
} from 'vue';

export default defineComponent({
  name: 'DfAutocomplete',
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
      default: () => ({})
    }
  },
  setup(props, context) {
    // 值
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
    // 监听val变化，只对labelProp为空值的情况做清空处理及值变化向上传递
    watch(val, (newVal, oldVal) => {
      context.emit('change-value', val.value);
      if (newVal) {
        context.emit('change-label', props.config.prop, val.value);
      } else {
        props.config.labelProp &&
          context.emit('change-label', props.config.labelProp, val.value);
      }
    });

    /**
     * 更新值
     */
    watch(
      () => props.value,
      () => {
        val.value = props.value;
      }
    );
    onMounted(() => {});
    return {
      attrs,
      events,
      val
    };
  }
});
</script>

<style lang="scss" scoped>

</style>
