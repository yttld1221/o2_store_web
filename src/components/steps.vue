<template>
  <div class="stepContainer">
    <div :class="['step', active != '' ? 'activeStep' : '']">
      <span class="icon" v-if="active == '1'">1</span>
      <span class="iconSuccess" v-else>
        <span class="iconBox">
          <el-icon><Select /></el-icon>
        </span>
      </span>
      <span class="text">文件上传</span>
    </div>
    <div :class="['line', active == '2' ? 'activeLine' : '']"></div>
    <div :class="['step', active == '2' ? 'activeStep' : '']">
      <span class="icon">2</span>
      <span class="text">完成导入</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

// eslint-disable-next-line no-undef
const props = defineProps({
  //当前所在步骤
  active: {
    type: String,
    required: true,
    default: () => {
      return '';
    }
  }
});

// 监听当前路由变化
watch(
  () => props.active,
  () => {
    //console.log(props.active);
  },
  {
    deep: true
  }
);
</script>
<style scoped lang="scss">
.stepContainer {
  display: flex;
  justify-content: left;
  align-items: center;
  .step {
    display: flex;
    align-items: center;
    .icon {
      display: inline-block;
      width: 24px;
      height: 24px;
      line-height: 24px;
      border-radius: 50%;
      background-color: #f5f5f5;
      color: #bfbfbf;
      text-align: center;
    }
    .iconSuccess {
      display: inline-block;
      .iconBox {
        width: 24px;
        height: 24px;
        line-height: 24px;
        background-color: #ecf5ff;
        text-align: center;
        border-radius: 50%;
        font-size: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        .el-icon {
          color: #1966ff;
        }
      }
    }
    .text {
      line-height: 24px;
      font-size: 14px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #bfbfbf;
      margin-left: 5px;
    }
  }
  .line {
    width: 100px;
    height: 2px;
    background: #f0f0f0;
    opacity: 1;
    margin: 0 5px;
  }
  .activeStep {
    .icon {
      background-color: #1966ff;
      color: #fff;
    }
    .text {
      color: #333333;
    }
  }
  .activeLine {
    background-color: #1966ff;
  }
}
</style>
