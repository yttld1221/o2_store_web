<template>
  <div class="home">
    <div class="title">欢迎</div>
    <div class="home-tip">欢迎使用 校园氧气仓库</div>
  </div>
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

const getSel = () => {
  API.activity.getCategoryTree({ status: 1 }).then((res) => {});
};
onMounted(() => {
  getSel();
});
</script>

<style lang="scss" scoped>
.home {
  box-sizing: border-box;
  background: #f4f7fa;
  min-height: 100%;
  padding: 16px 24px;
  .title {
    color: rgba(0, 0, 0, 0.88);
    font-weight: 600;
    font-size: 20px;
    line-height: 32px;
  }
  .home-tip {
    margin-top: 30px;
    padding: 24px;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    background: white;
    color: rgba(0, 0, 0, 0.88);
    font-size: 14px;
  }
}
</style>
