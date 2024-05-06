<template>
  <div class="pagination" :style="{ 'justify-content': pgPosition }">
    <el-pagination class="pagingModule" v-bind="$attrs">
      <template v-slot:default>
        <slot name="pagination"></slot>
      </template>
    </el-pagination>
  </div>
</template>
<script>
export default {
  name: "pagination"
};
</script>
<script setup>
import { reactive, onMounted, toRefs, watch, nextTick } from "vue";
// eslint-disable-next-line no-undef
const props = defineProps({
  pgPosition: {
    type: String,
    default: "center"
  }
});
// eslint-disable-next-line no-undef
const emit = defineEmits([]);
// eslint-disable-next-line no-undef
defineExpose({});
</script>
<style lang="scss" scoped>
.pagination {
  padding: 20px;
  display: flex;
  justify-content: center;
}
</style>
