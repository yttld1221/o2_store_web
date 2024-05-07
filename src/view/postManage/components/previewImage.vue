<template>
  <el-dialog
    :close-on-click-modal="false"
    :before-close="handleClose"
    v-model="dialogVisible"
    title="查看详情"
    width="500px"
    class="dialogContainer"
  >
    <div class="dialogBody">
      <el-image
        style="width: 400px; height: 400px"
        preview-teleported
        :src="url"
        :zoom-rate="1.2"
        :max-scale="7"
        :min-scale="0.2"
        :preview-src-list="srcList"
        :initial-index="0"
        fit="cover"
      />
    </div>
  </el-dialog>
</template>
<script lang="ts" setup name="addBatch">
import { onMounted, getCurrentInstance, ref } from "vue";
let dialogVisible = ref(false);
const url = ref();
const srcList = ref([]);
const openDialog = (row) => {
  dialogVisible.value = true;
  if (row.url) {
    srcList.value = row.url.split(",");
    url.value = srcList.value[0];
  }
};
const closeDialog = () => {
  dialogVisible.value = false;
};

// eslint-disable-next-line no-undef
defineExpose({
  openDialog,
  closeDialog,
});
</script>

<style lang="scss" scoped>
.dialogContainer {
  .dialogBody {
    display: flex;
    justify-content: center;
  }
}
</style>
