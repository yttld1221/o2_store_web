import Main from '/src/layouts/main.vue';
import childMain from '/src/layouts/childMain.vue';
const actvity = {
  // path与文件夹名称不同就不显示一级面包屑
  path: '/activityManage',
  name: 'activityManage',
  component: Main,
  redirect: '/activityManage/activityType',
  meta: {
    title: '活动管理'
  },
  children: [
    {
      path: '/activityManage/activityType',
      name: 'activityType',
      redirect: '/activityManage/activityType/list',
      component: childMain,
      meta: {
        title: '活动分类管理'
      },
      children: [
        {
          path: '/activityManage/activityType/list',
          name: 'activityTypeList',
          component: () =>
            import('/src/view/activityManage/activityType/activityTypeIndex.vue')
        }
      ]
    },
    {
      path: '/activityManage/activityList',
      name: 'activityList',
      redirect: '/activityManage/activityList/list',
      component: childMain,
      meta: {
        title: '活动管理'
      },
      children: [
        {
          path: '/activityManage/activityList/list',
          name: 'activityList',
          component: () =>
            import('/src/view/activityManage/activityList/activityListIndex.vue')
        },
      ]
    },
    {
      path: '/activityManage/auditActivity',
      name: 'auditActivity',
      redirect: '/activityManage/auditActivity/list',
      component: childMain,
      meta: {
        title: '分部活动审核'
      },
      children: [
        {
          path: '/activityManage/auditActivity/list',
          name: 'auditActivity',
          component: () =>
            import('/src/view/activityManage/auditActivity/auditActivityIndex.vue')
        },
      ]
    },
    {
      path: '/activityManage/orderManage',
      name: 'orderManage',
      redirect: '/activityManage/orderManage/list',
      component: childMain,
      meta: {
        title: '订单管理'
      },
      children: [
        {
          path: '/activityManage/orderManage/list',
          name: 'orderManageList',
          component: () =>
            import('/src/view/activityManage/orderManage/orderManageIndex.vue')
        }
      ]
    },
    {
      path: '/activityManage/businessManage',
      name: 'businessManage',
      redirect: '/activityManage/businessManage/list',
      component: childMain,
      meta: {
        title: '商家管理'
      },
      children: [
        {
          path: '/activityManage/businessManage/list',
          name: 'businessManageList',
          component: () =>
            import('/src/view/activityManage/businessManage/businessIndex.vue')
        }
      ]
    }
  ]
};

export default actvity;
