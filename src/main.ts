import { createApp } from 'vue';
import App from './App.vue';
import Router from './router';
import store from './store';
import API from './api/apiList';
import vue3PreviewImage from 'vue3-preview-image';
import svgIcon from './icons/component/svgIcon.vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

// ElementPlus
import { ElMessage } from 'element-plus';
import '@/assets/diystyle.scss'; //改变主题样式

import '@/assets/reset.scss'; //重置样式
import moment from 'moment';
import { debounce } from './utils/debounce';

// import * as Sentry from '@sentry/vue';
// import { Integrations } from '@sentry/tracing';

const app = createApp(App);
// 挂载
app.config.globalProperties.$moment = moment;
app.config.globalProperties.$API = API;
// 全局提示
app.config.globalProperties.$Message = (
  message: string,
  type: '' | 'success' | 'warning' | 'info' | 'error' | undefined,
  time?: number
) => {
  ElMessage({
    message: message,
    type: type,
    duration: time
  });
};
app.directive('permission', {
  mounted: function (el, binding) {
    const action = binding.value.action;
    let btn = localStorage.getItem('bjAdminBtns');
    const permissions = typeof btn === 'string' ? JSON.parse(btn) : [];
    if (!permissions.includes(action)) {
      el.parentNode.removeChild(el);
    }
  }
});

// element icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.component('Debounce', {
  abstract: true,
  props: ['time', 'events', 'immediate'],
  created() {
    this.eventKeys = this.events && this.events.split(',');
  },
  render() {
    const vnode = this.$slots.default()[0];
    this.eventKeys.forEach((key: any) => {
      if (vnode.props) {
        vnode.props[`on${key}`] = debounce(
          vnode.props[`on${key}`],
          this.time,
          vnode,
          this.immediate
        );
      }
    });
    return vnode;
  }
});
const { MODE, DEV } = import.meta.env;
// if (MODE == 'production') {
//   console.warn = function () {};
//   console.log = function () {};
//   console.error = function () {};
//   console.dir = function () {};
// }

// Sentry.init({
//   app,
//   dsn: 'https://588a435d9a3246688500693e53d2050a@sentry.hailiangedu.com:9000/15',
//   integrations: [
//     new Integrations.BrowserTracing({
//       routingInstrumentation: Sentry.vueRouterInstrumentation(Router),
//       tracingOrigins: ['localhost', 'my-site-url.com', /^\//]
//     })
//   ],
//   tracesSampleRate: 1.0,
//   release: '1.0.0'
// });
// app.config.globalProperties.$captureException = function (err: any) {
//   Sentry.captureException(err);
// };

// 使用svg
app.component('svg-icon', svgIcon);
app.use(vue3PreviewImage);
app.use(Router);
app.use(store);
app.mount('#app');
