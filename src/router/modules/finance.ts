import Main from '/src/layouts/main.vue';
import childMain from '/src/layouts/childMain.vue';
const finance = {
  // path与文件夹名称不同就不显示一级面包屑
  path: '/financeManage',
  name: 'financeManage',
  component: Main,
  redirect: '/financeManage/withdrawManage',
  meta: {
    title: '财务管理'
  },
  children: [
    {
      path: '/financeManage/withdrawManage',
      name: 'withdrawManage',
      redirect: '/financeManage/withdrawManage/list',
      component: childMain,
      meta: {
        title: '提现管理'
      },
      children: [
        {
          path: '/financeManage/withdrawManage/list',
          name: 'withdrawManageList',
          component: () =>
            import('/src/view/financeManage/withdrawManage/withdrawIndex.vue')
        }
      ]
    },
    // {
    //   path: '/financeManage/flowWater',
    //   name: 'flowWater',
    //   redirect: '/financeManage/flowWater/list',
    //   component: childMain,
    //   meta: {
    //     title: '流水管理'
    //   },
    //   children: [
    //     {
    //       path: '/financeManage/flowWater/list',
    //       name: 'flowWater',
    //       component: () =>
    //         import('/src/view/financeManage/flowWater/activityListIndex.vue')
    //     },
    //   ]
    // },
  ]
};

export default finance;
