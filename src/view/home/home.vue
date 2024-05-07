<template>
  <div class="home"></div>
</template>
<script lang="ts" setup name="home">
import { onMounted, getCurrentInstance, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessageBox } from "element-plus";

const router = useRouter();
const route = useRoute();
const _this: any = getCurrentInstance();
const API: any = _this.proxy.$API;
const message: any = _this.proxy.$Message;
</script>

<style lang="scss" scoped>
.home {
  background: #f4f7fa;
  min-height: 100%;
  display: flex;
  align-items: flex-start;
}
</style>
