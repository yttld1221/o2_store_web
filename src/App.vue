<template>
  <el-config-provider :locale="zhCn" :z-index="zIndex">
    <div v-if="isRouterAlive">
      <router-view v-slot="{ Component }">
        <keep-alive :include="cacheList">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </el-config-provider>
</template>

<script>
import {
  defineComponent,
  toRefs,
  reactive,
  provide,
  nextTick,
  getCurrentInstance,
  onMounted
} from 'vue';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { getIncludeList } from '@/utils/utils';
import { useStore } from "vuex";
export default defineComponent({
  name: 'App',
  setup() {
    provide('reload', reload);
    const data = reactive({
      isRouterAlive: true,
      cacheList: getIncludeList()
    });
    function reload() {
      data.isRouterAlive = false;
      nextTick(() => {
        data.isRouterAlive = true;
      });
    }
    onMounted(() => {});
    const store = useStore();
    function windowResize(){
      let wSise = {
        width: window.innerWidth,
        height: window.innerHeight,
      }
      // let wSise2 = {
      //   width: document.documentElement.clientWidth,
      //   height: document.documentElement.clientHeight,
      // }
      store.commit("setWindowSize", wSise);
    }
    onMounted(() => {
      windowResize();
      nextTick(() => {
        window.addEventListener('resize', windowResize)
      })
    });
    onBeforeUnmount(() => {
      window.removeEventListener('resize', windowResize)
    })
    return {
      reload,
      ...toRefs(data),
      zhCn,
      zIndex: 2000,
    };
  }
});
</script>
<style>
@import '@/assets/fonts/font.scss';
/* 兼容safari列头与td对不齐问题 */
.el-table__header,
.el-table__body,
.el-table__footer {
  width: 100% !important;
  table-layout: fixed !important;
}
.el-popover.el-popper {
  text-align: center !important;
}

.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #386df7 !important;
  border-color: #386df7 !important;
}
</style>
