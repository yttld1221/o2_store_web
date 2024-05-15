<template>
  <div class="activity-detail">
    <queryHeader :title="title"
      ><template #queryBtns>
        <el-button @click="goback()">返回</el-button>
      </template></queryHeader
    >
  </div>
</template>
<script lang="ts" setup name="activityListDetail">
import {
  onMounted,
  reactive,
  getCurrentInstance,
  ref,
  nextTick,
  computed,
  watchEffect,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { useStore } from "vuex";
import queryHeader from "@/components/queryHeader.vue";
const router = useRouter();
const route = useRoute();
const _this: any = getCurrentInstance();
const API: any = _this.proxy.$API;
const message: any = _this.proxy.$Message;
const title = ref("新增");
const goback = () => {
  router.go(-1);
};

onMounted(() => {});
</script>

<style lang="scss" scoped>
.activity-detail {
  .flex-align {
    display: flex;
    align-items: center;
  }
}
</style>
