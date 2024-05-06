import clickoutclose from "./clickoutclose";
import scrolloutclose from "./scrolloutclose";
const directives = {
  clickoutclose,
  scrolloutclose,
};

const install = function (Vue) {
  Object.keys(directives).forEach((key) => {
    Vue.directive(key, directives[key].option);
  });
};
/** 判断是否直接引入 */
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export { install, directives as default };

// 导出模块
export { default as clickoutclose } from "./clickoutclose";
export { default as scrolloutclose } from "./scrolloutclose";
