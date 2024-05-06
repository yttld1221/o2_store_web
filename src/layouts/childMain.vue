<template>
  <div class="child-main">
    <router-view v-slot="{ Component }">
      <keep-alive :include="cacheList">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>
<script>
import { getIncludeList } from '@/utils/utils';
import {
  defineComponent,
  reactive,
  onMounted,
  toRefs,
  getCurrentInstance,
  ref
} from 'vue';
export default defineComponent({
  setup() {
    const _this = getCurrentInstance();
    const API = _this.proxy.$API;
    const data = reactive({
      cacheList: getIncludeList()
    });
    onMounted(() => {});
    return {
      ...toRefs(data)
    };
  }
});
</script>

<style lang="scss" scoped></style>
