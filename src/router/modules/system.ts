import Main from '/src/layouts/main.vue';
import childMain from '/src/layouts/childMain.vue';
const system = {
  path: '/systemManage',
  name: 'systemManage',
  component: Main,
  redirect: '/systemManage/personalInfo',
  meta: {
    title: '管理页'
  },
  children: [
    {
      path: '/systemManage/homeMenu',
      component: childMain,
      meta: {
        title: ''
      },
      children: [
        {
          path: '/systemManage/homeMenu',
          name: 'homeMenu',
          component: () => import('/src/view/system/homeMenu.vue'),
          meta: {
            title: '首页菜单管理'
          }
        }
      ]
    },
    {
      path: '/systemManage/personalInfo',
      component: childMain,
      meta: {
        title: ''
      },
      children: [
        {
          path: '/systemManage/personalInfo',
          name: 'personalInfo',
          component: () => import('/src/view/system/personalInfo.vue'),
          meta: {
            title: '个人信息'
          }
        }
      ]
    },
    // {
    //   path: '/systemManage/roleManage',
    //   component: childMain,
    //   meta: {
    //     title: ''
    //   },
    //   children: [
    //     {
    //       path: '/systemManage/roleManage',
    //       name: 'roleManage',
    //       component: () => import('/src/view/system/roleManage.vue'),
    //       meta: {
    //         title: '角色管理'
    //       }
    //     }
    //   ]
    // },
    // {
    //   path: '/systemManage/userManage',
    //   component: childMain,
    //   meta: {
    //     title: ''
    //   },
    //   children: [
    //     {
    //       path: '/systemManage/userManage',
    //       name: 'userManage',
    //       component: () => import('/src/view/system/userManage.vue'),
    //       meta: {
    //         title: '用户管理'
    //       }
    //     }
    //   ]
    // }
  ]
};

export default system;
