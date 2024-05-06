import Main from '/src/layouts/main.vue';
import childMain from '/src/layouts/childMain.vue';
const system = {
  path: '/systemManage',
  name: 'systemManage',
  component: Main,
  redirect: '/systemManage/roleManage',
  meta: {
    title: '权限管理'
  },
  children: [
    {
      path: '/systemManage/roleManage',
      component: childMain,
      meta: {
        title: ''
      },
      children: [
        {
          path: '/systemManage/roleManage',
          name: 'roleManage',
          component: () => import('/src/view/system/roleManage.vue'),
          meta: {
            title: '角色管理'
          }
        }
      ]
    },
    {
      path: '/systemManage/userManage',
      component: childMain,
      meta: {
        title: ''
      },
      children: [
        {
          path: '/systemManage/userManage',
          name: 'userManage',
          component: () => import('/src/view/system/userManage.vue'),
          meta: {
            title: '用户管理'
          }
        }
      ]
    }
  ]
};

export default system;
