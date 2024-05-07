<template>
  <div class="wechat-user"></div>
</template>
<script setup>
import { onMounted, getCurrentInstance, ref } from "vue";
const _this = getCurrentInstance();
const API = _this.proxy.$API;
</script>

<style lang="scss" scoped>
.wechat-user {
}
</style>