import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import system from './modules/system';
import actvity from './modules/actvity';
import finance from './modules/finance';
import Main from '/src/layouts/main.vue';
import store from "../store/index";
const routes: Array<RouteRecordRaw> = [
  // **********首页**********
  {
    path: '/',
    redirect: '/home',
    component: Main,
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('/src/view/home/home.vue').catch(() => { }),
        meta: { title: '欢迎' }
      },
      {
        path: '/postManage',
        name: 'postManage',
        redirect: '/postManage/list',
        component: () =>
          import('/src/view/postManage/postIndex.vue').catch(() => { }),
        meta: { title: '朋友圈管理' },
        children: [
          {
            path: '/postManage/list',
            name: 'postManageList',
            component: () =>
              import('/src/view/postManage/postIndex.vue').catch(
                () => { }
              ),
            meta: {
              title: ''
            }
          }
        ]
      },
      {
        path: '/schoolManage',
        name: 'schoolManage',
        redirect: '/schoolManage/list',
        component: () =>
          import('/src/view/schoolManage/schoolIndex.vue').catch(() => { }),
        meta: { title: '学校管理' },
        children: [
          {
            path: '/schoolManage/list',
            name: 'schoolManage',
            component: () =>
              import('/src/view/schoolManage/schoolIndex.vue').catch(
                () => { }
              ),
            meta: {
              title: ''
            }
          }
        ]
      },
      {
        path: '/wechatUser',
        name: 'wechatUser',
        redirect: '/wechatUser/list',
        component: () =>
          import('/src/view/wechatUser/wechatUserIndex.vue').catch(() => { }),
        meta: { title: '小程序用户管理' },
        children: [
          {
            path: '/wechatUser/list',
            name: 'wechatUserList',
            component: () =>
              import('/src/view/wechatUser/wechatUserIndex.vue').catch(
                () => { }
              ),
            meta: {
              title: ''
            }
          }
        ]
      },
      {
        path: '/merchantManage/merchantOrder',
        name: 'merchantOrder',
        redirect: '/merchantManage/merchantOrder/list',
        component: () =>
          import('/src/view/merchantManage/merchantOrder/merchantOrderIndex.vue').catch(() => { }),
        meta: { title: '订单列表' },
        children: [
          {
            path: '/merchantManage/merchantOrder/list',
            name: 'merchantOrderList',
            component: () =>
              import('/src/view/merchantManage/merchantOrder/merchantOrderIndex.vue').catch(
                () => { }
              ),
            meta: {
              title: ''
            }
          }
        ]
      },

      {
        path: '/merchantManage/merchantActivity',
        name: 'merchantActivity',
        redirect: '/merchantManage/merchantActivity/list',
        component: () =>
          import('/src/view/merchantManage/merchantActivity/merchantListIndex.vue').catch(() => { }),
        meta: { title: '活动列表' },
        children: [
          {
            path: '/merchantManage/merchantActivity/list',
            name: 'merchantActivityList',
            component: () =>
              import('/src/view/merchantManage/merchantActivity/merchantListIndex.vue').catch(
                () => { }
              ),
            meta: {
              title: ''
            }
          }
        ]
      },
    ]
  },
  // 系统管理
  system,
  // //活动管理
  actvity,
  // 财务管理
  finance,
  // **********404**********
  {
    path: '/:catchAll(.*)',
    name: '404',
    component: () => import('/src/layouts/error.vue').catch(() => { }),
    meta: { title: '404' }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('/src/view/login/index.vue'),
    meta: { title: '登录' }
  }
];

const Router = createRouter({
  history: createWebHashHistory(),
  routes
});
Router.beforeEach(async (to: any, form: any, next: any) => {
  //console.log(to);
  // next();
  let title = '';
  if (to.meta.title) {
    title = to.meta.title;
  } else {
    let index = to.matched.findIndex(el => el.path == to.path);
    if (index > -1 && to.matched.length > 2) {
      title = to.matched[index - 1].meta.title;
    }
  }
  document.title = title + ' - 校园氧气仓库';
  const token = window.localStorage.getItem("token")
  if (to.path === "/login") {
    if (token) {
      next('/');
    } else {
      next();
    }
  } else {
    if (token) {
      next();
    } else {
      next({ path: "/login" });
    }
  }
});
export default Router;
