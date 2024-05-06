import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import system from './modules/system';
import student from './modules/student';
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
        component: () => import('/src/view/home/index.vue').catch(() => {}),
        meta: { title: '首页' }
      },
      {
        path: '/teacherManage',
        name: 'teacherManage',
        redirect: '/teacherManage/list',
        component: () =>
          import('/src/view/teacherManage/teacherIndex.vue').catch(() => {}),
        meta: { title: '教师管理' },
        children: [
          {
            path: '/teacherManage/list',
            name: 'teacherManageList',
            component: () =>
              import('/src/view/teacherManage/teacherIndex.vue').catch(
                () => {}
              ),
            meta: {
              title: ''
            }
          }
        ]
      }
    ]
  },
  // 系统管理
  system,
  // 学生管理
  student,
  // **********404**********
  {
    path: '/:catchAll(.*)',
    name: '404',
    component: () => import('/src/layouts/error.vue').catch(() => {}),
    meta: { title: '404' }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('/src/view/login/index.vue')
  }
];

const Router = createRouter({
  history: createWebHashHistory(),
  routes
});
Router.beforeEach(async (to: any, form: any, next: any) => {
  //console.log(to);
  let title = '';
  if (to.meta.title) {
    title = to.meta.title;
  } else {
    let index = to.matched.findIndex(el => el.path == to.path);
    if (index > -1 && to.matched.length > 2) {
      title = to.matched[index - 1].meta.title;
    }
  }
  document.title = title;

  let { hash } = location;
  if (hash.split("Authorization=") && hash.split("Authorization=")[1]) {
    localStorage.setItem("bjAdminToken", hash.split("Authorization=")[1]);
  }
  if (to.path === "/login") {
    next();
  } else {
    if (
        !window.localStorage.getItem("bjAdminToken") ||
        window.localStorage.getItem("bjAdminToken") === ""
    ) {
      next({ path: "/login" });
    } else {
      next();
      await store.dispatch("getDict");
      await store.dispatch("getYearsDict");
    }
  }
});
export default Router;
