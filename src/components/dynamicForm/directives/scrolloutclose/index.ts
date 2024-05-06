import { App } from "vue";
import scrolloutclose from "./main";

export { scrolloutclose };

// 导出自定义指令插件
export default {
  install(app: App) {
    app.directive(scrolloutclose.name, scrolloutclose.option);
  },
};
