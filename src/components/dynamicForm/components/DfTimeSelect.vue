<template>
  <el-time-select v-model="val" v-bind="attrs" v-on="events"></el-time-select>
</template>

<script lang="ts">
export default {
  name: "DfTimeSelect",
};
</script>
<script lang="ts" setup>
import { watch, ref, computed } from "vue";

interface Props {
  //默认值
  value?: String;
  //组件配置
  config?: configProps;
}
interface configProps {
  attrs: Object;
  events: Object;
}
// eslint-disable-next-line no-undef,no-unused-vars
const props = withDefaults(defineProps<Props>(), {
  value: () => {
    return "";
  },
  config: () => {
    return {
      attrs: {},
      events: {},
    };
  },
});

let val = ref(props.value);
// eslint-disable-next-line no-undef
const emit = defineEmits(["change-label", "change-value"]);
/**
 * 属性配置
 */
let attrs = computed(() => {
  return props?.config?.attrs || {};
});
let events = computed(() => {
  return props?.config?.events || {};
});

watch(
  () => val.value,
  () => {
    emit("change-value", val.value);
    emit("change-label", props.config.prop, val.value);
  }
);
watch(
  () => props.value,
  () => {
    val.value = props.value;
  }
);
</script>
