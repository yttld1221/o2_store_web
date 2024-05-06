import { App } from "vue";
import clickoutclose from "./main";

export { clickoutclose };

// 导出自定义指令插件
export default {
  install(app: App) {
    app.directive(clickoutclose.name, clickoutclose.option);
  },
};
