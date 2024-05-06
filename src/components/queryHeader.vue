<template>
  <div class="queryHeader">
    <div class="queryTitle">
      <h3 class="titleTxt">{{ title }}</h3>
      <div class="btns">
        <slot name="queryBtns"></slot>
      </div>
    </div>
    <div class="queryBody">
      <slot name="queryForm"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const props = defineProps({
  //标题
  title: {
    type: String,
    required: true,
    default: () => {
      return '';
    }
  },
  //是否展示分页
  isShowPaging: {
    type: Boolean,
    default: true
  },
  //是否立即执行接口请求表格数据
  immediateLoad: {
    type: Boolean,
    default: () => {
      return true;
    }
  }
});
</script>

<style scoped lang="scss">
.queryHeader {
  padding: 20px 20px 0;
  background: #ffffff;
  .queryTitle {
    padding-bottom: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ebeef5;
    .titleTxt {
      font-size: 18px;
      font-weight: 600;
      color: #333333;
    }
    .btns {
    }
  }
  .queryBody {
    padding-top: 15px;
  }
}
</style>
