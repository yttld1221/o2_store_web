<template>
  <div class="regularStudents">
    <div class="queryModule">
      <queryHeader title="正式学生">
        <template #queryBtns>
          <el-button @click="resetForm">重置</el-button>
          <el-button type="primary" @click="queryData">查询</el-button>
        </template>
        <template #queryForm>
          <rowsDynamicForm
            ref="rowsDynamicFormRef"
            :formData="formData"
            :formItems="formItems"
            :formAttrs="formAttrs"
            :colsMax="4"
            @change-value="changeModel"
          ></rowsDynamicForm>
        </template>
      </queryHeader>
    </div>
    <line-radius />
    <div class="listModule">
      <div class="btnsContainer">
        <div class="btns left">
          <el-button
            type="primary"
            @click="addStudentFn"
            v-permission="{ action: $route.path + '/add' }"
            >新增学生</el-button
          >
          <el-button
            type="primary"
            @click="addBatchFn"
            v-permission="{ action: $route.path + '/moreAdd' }"
            >批量新增</el-button
          >
          <el-button
            class="plainPrimary"
            @click="editBatchFn"
            v-permission="{ action: $route.path + '/moreEdit' }"
            >批量修改</el-button
          >
        </div>
        <div class="btns right">
          <el-button
            type="primary"
            @click="exportData"
            v-permission="{ action: $route.path + '/export' }"
            >导出全部</el-button
          >
        </div>
      </div>
      <common-table
        ref="tableRef"
        :tableHeader="tableHeader"
        :propsTableData="tableData"
        :loading="true"
        :queryParams="paramsPage"
        :ajaxGetData="getTableData"
        :paginationConfig="paginationConfig"
        @current-change="currentPage"
      >
        <template v-slot:column|trainingPlanStrList="{ row, $index }">
          {{ getTrainingPlanName(row.trainingPlanStrList) }}
        </template>
        <template v-slot:column|teacherName="{ row, $index }">
          {{ getTeacherName(row.teacherInfoList) }}
        </template>
        <template v-slot:column|studentStatusStr="{ row }">
          <div class="studentStatus">
            <span :class="['statusLabel', getStatusColor(row.studentStatus)]">
              {{ row.studentStatusStr }}</span
            >
          </div>
        </template>
      </common-table>
      <addBatch ref="addBatchRef" @uploadFile="queryData"></addBatch>
      <editBatch ref="editBatchRef" @uploadFile="queryData"></editBatch>
      <addStudent ref="addStudentRef" @refresh-page="queryData"></addStudent>
      <editStudent ref="editStudentRef" @refresh-page="queryData"></editStudent>
      <studentDetail ref="studentDetailRef"></studentDetail>
    </div>
  </div>
</template>
<script lang="ts" setup name="regularStudents">
import { onMounted, getCurrentInstance, ref, reactive, watchEffect } from 'vue';
import commonTable from '@/components/commonTable.vue';
import queryHeader from '@/components/queryHeader.vue';
import lineRadius from '@/components/lineRadius.vue';
import rowsDynamicForm from '@/components/dynamicForm/rowsDynamicForm.vue';
import addBatch from './components/addBatch.vue';
import editBatch from './components/editBatch.vue';
import addStudent from './components/addStudent.vue';
import editStudent from './components/editStudent.vue';
import studentDetail from './components/studentDetail.vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
const router = useRouter();
const _this: any = getCurrentInstance();
const API: any = _this.proxy.$API;
const message: any = _this.proxy.$Message;
const rowsDynamicFormRef = ref(null);
const tableRef = ref(null);
const addBatchRef = ref(null);
const editBatchRef = ref(null);
const addStudentRef = ref(null);
const editStudentRef = ref(null);
const studentDetailRef = ref(null);
const store = useStore();
const trainingPlanOptions = computed(() => store.state.trainingPlan);
const studentStatusOptions = computed(() => store.state.studentStatus);

//重置表单
const resetForm = () => {
  rowsDynamicFormRef?.value.invokeFormFn('resetFields');
  queryData();
};
const formData = ref({});
const formItems = ref([
  {
    label: '学生姓名',
    prop: 'studentName',
    type: 'autocomplete',
    attrs: {
      clearable: true,
      placeholder: '请输入',
      'select-when-unmatched': true,
      'fetch-suggestions': async (query, cb) => {
        if (query) {
          const params = {
            studentName: query
          };
          API.student.searchStudentByword(params).then(res => {
            let data = res.map(el => {
              return {
                value: el
              };
            });
            cb(data);
          });
        } else {
          cb([]);
        }
      }
    }
  },
  {
    label: '学号',
    prop: 'studentCode',
    type: 'input',
    attrs: {
      clearable: true,
      placeholder: '请输入'
    }
  },
  {
    label: '学生类型',
    prop: 'trainingPlan',
    type: 'select',
    valueKey: 'code',
    labelKey: 'msg',
    attrs: {
      clearable: true,
      multiple: true,
      'collapse-tags': true,
      'max-collapse-tags': 1,
      placeholder: '请选择'
    },
    options: trainingPlanOptions.value
  },
  {
    label: '教师姓名',
    prop: 'teacherName',
    type: 'autocomplete',
    attrs: {
      clearable: true,
      placeholder: '请输入',
      'select-when-unmatched': true,
      'fetch-suggestions': async (query, cb) => {
        if (query) {
          const params = {
            teacherName: query
          };
          API.teacher.likeKeyWord(params).then(res => {
            let data = res.map(el => {
              return {
                value: el
              };
            });
            cb(data);
          });
        } else {
          cb([]);
        }
      }
    }
  },
  {
    label: '状态',
    prop: 'studentStatus',
    type: 'select',
    valueKey: 'code',
    labelKey: 'msg',
    attrs: {
      clearable: true,
      multiple: true,
      'collapse-tags': true,
      'max-collapse-tags': 1,
      placeholder: '请选择'
    },
    options: studentStatusOptions.value
  }
]);
const formAttrs = ref({
  'label-width': '80px'
});

watchEffect(() => {
  formItems.value[2].options = trainingPlanOptions.value;
  formItems.value[4].options = studentStatusOptions.value;
});

//按钮权限
const route = useRoute();
const btnArr = JSON.parse(localStorage.getItem('bjAdminBtns'));
const paramsPage = ref({
  studentName: '',
  studentID: '',
  coachName: '',
  state: ''
});
const tableHeader = reactive([
  {
    label: '学生姓名',
    prop: 'studentName'
  },
  {
    label: '学号',
    prop: 'studentCode'
  },
  {
    label: '培养类型',
    prop: 'trainingPlanStrList',
    'show-overflow-tooltip': true,
    colType: 'column'
  },
  {
    label: '教练姓名',
    prop: 'teacherName',
    'show-overflow-tooltip': true,
    colType: 'column'
  },
  {
    label: '状态',
    colType: 'column',
    prop: 'studentStatusStr'
  },
  {
    label: '操作',
    colType: 'btns',
    width: 120,
    btns: [
      {
        label: '查看',
        type: 'primary',
        link: true,
        click: (row, rowIndex, btnIndex) => {
          studentDetailRef.value.openDrawer(row);
        }
      },
      {
        label: '编辑',
        link: true,
        type: 'primary',
        click: (row, rowIndex, btnIndex) => {
          editStudentRef.value.openDrawer(row);
        },
        hidden: (row, rowIndex, btnIndex) => {
          let isShow = row.studentStatus === 1 ? true : false;
          return !isShow || !btnArr.includes(route.path + '/edit');
        }
      }
    ]
  }
]);
const tableData = ref([]);
const getTableData = param => {
  return API.student.pageStudentInfo(param).then(res => res);
};
const paginationConfig = reactive({});

const currentPage = () => {};

// 获取培养类型name
const getTrainingPlanName = computed(() => {
  return list => {
    if (list && list.length > 0) {
      return list.join('、');
    }
  };
});
// 获取教练姓名
const getTeacherName = computed(() => {
  return list => {
    let names = [];
    if (list && list.length > 0) {
      list.forEach(item => {
        if (item.teacherName) {
          names.push(item.teacherName);
        }
      });
      return names.join('、');
    }
  };
});

const changeModel = (model, value, key) => {
  paramsPage.value = model;
};
//查询
const queryData = () => {
  tableRef.value.refreshTable();
};

//新增学生
const addStudentFn = () => {
  addStudentRef.value.openDrawer();
};
//批量新增
const addBatchFn = () => {
  addBatchRef.value.openDialog();
};
//批量修改
const editBatchFn = () => {
  editBatchRef.value.openDialog();
};
//导出全部数据
const exportData = () => {
  const loading = ElLoading.service({
    target: '.publishDialog',
    lock: true,
    text: '导出中'
  });
  const params = { ...paramsPage.value, pageNum: 1, pageSize: -1 };
  API.student
    .exportStudentInfo(params)
    .then(res => {
      loading.close();
    })
    .catch(e => {
      downloadFileWithUrl(e);
      ElMessage({
        message: '导出成功',
        type: 'success'
      });
      loading.close();
    });
};

const downloadFileWithUrl = (blob, fileName = '正式学生.xlsx') => {
  // 创建一个临时的 Blob URL
  const url = window.URL.createObjectURL(new Blob([blob]), {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  // 创建一个 <a> 标签用于触发下载
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName; // 设置下载的文件名
  document.body.appendChild(link);
  // 触发下载
  link.click();
  // 清理临时 URL
  URL.revokeObjectURL(url);
  // 移除 <a> 标签
  document.body.removeChild(link);
};

// 获取学生状态展示文字展示的颜色
const getStatusColor = code => {
  let color = '';
  if (code === 1) {
    color = 'zd';
  } else if (code === 2) {
    color = 'by';
  } else if (code === 3) {
    color = 'ls';
  } else if (code === 4) {
    color = 'wp';
  }
  return color;
};
onMounted(() => {});
</script>

<style lang="scss" scoped>
.regularStudents {
  .queryModule {
    border-radius: 0 0 4px 4px;
  }
  .line {
    width: 100%;
    height: 20px;
    background-color: #f4f7fa;
  }
  .listModule {
    padding: 20px;
    background: #ffffff;
    .btnsContainer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 15px;
      .left {
      }
      .right {
      }
    }
    .studentStatus {
      .statusLabel {
        display: inline-block;
        padding: 0 6px;
        border-radius: 4px;
      }
      .zd {
        background-color: #eaf1ff;
        color: #2c65d6;
      }
      .by {
        background-color: #ffefdb;
        color: #db792a;
      }
      .ls {
        background-color: #ffefef;
        color: #d45547;
      }
      .wp {
        background-color: #f6f6f6;
        color: #999999;
      }
    }
  }
}
</style>
