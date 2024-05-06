import Main from '/src/layouts/main.vue';
import childMain from '/src/layouts/childMain.vue';
const student = {
  // path与文件夹名称不同就不显示一级面包屑
  path: '/studentManage',
  name: 'studentManage',
  component: Main,
  redirect: '/studentManage/testStudents',
  meta: {
    title: '学生管理'
  },
  children: [
    {
      path: '/studentManage/testStudents',
      name: 'testStudents',
      redirect: '/studentManage/testStudents/list',
      component: childMain,
      meta: {
        title: '测试学生'
      },
      children: [
        {
          path: '/studentManage/testStudents/list',
          name: 'testStudentsList',
          component: () =>
            import('/src/view/studentManage/testStudents/testIndex.vue')
        }
      ]
    },
    {
      path: '/studentManage/regularStudents',
      name: 'regularStudents',
      redirect: '/studentManage/regularStudents/list',
      component: childMain,
      meta: {
        title: '正式学生'
      },
      children: [
        {
          path: '/studentManage/regularStudents/list',
          name: 'regularStudentsList',
          component: () =>
            import('/src/view/studentManage/regularStudents/regularIndex.vue')
        }
      ]
    },
    {
      path: '/studentManage/prediction',
      name: 'prediction',
      redirect: '/studentManage/prediction/list',
      component: childMain,
      meta: {
        title: '竞赛预测'
      },
      children: [
        {
          path: '/studentManage/prediction/list',
          name: 'predictionList',
          component: () =>
            import('/src/view/studentManage/prediction/predictionIndex.vue')
        }
      ]
    }
  ]
};

export default student;
