import Main from '/src/layouts/main.vue';
import childMain from '/src/layouts/childMain.vue';
const teacher = {
  path: '/teacherMange',
  name: 'teacherMange',
  component: Main,
  redirect: '/teacherManage/list',
  meta: {
    title: '教师管理'
  },
  children: [
    {
      path: '/teacherManage/list',
      name: 'teacherManageList',
      component: () =>
        import('/src/view/teacherMange/teacherIndex.vue').catch(() => {}),
      meta: { title: '' }
    }
  ]
};

export default teacher;
