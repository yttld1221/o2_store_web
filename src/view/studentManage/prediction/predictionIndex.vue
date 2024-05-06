<template>
  <div class="regularStudents">
    <div class="queryModule">
      <queryHeader title="竞赛预测">
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
            @click="createTaskFn"
            v-permission="{ action: $route.path + '/add' }"
            >创建任务</el-button
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
        <template v-slot:header|advance="{ column }">
          <el-tooltip
            class="box-item"
            effect="dark"
            content="完成进度=已完成预测教练人数/任务教练总人数"
            placement="bottom"
          >
            <div class="advanceTip">
              <span>完成进度</span>
              <el-icon><Warning /></el-icon>
            </div>
          </el-tooltip>
        </template>
        <template v-slot:column|missionsStatusStr="{ row }">
          <div :class="['missionsStatus', getStatusColor(row.missionsStatus)]">
            {{ row.missionsStatusStr }}
          </div>
        </template>
      </common-table>
      <addTask ref="addTaskRef" @refresh-page="queryData"></addTask>
      <taskDetail ref="taskDetailRef" @refresh-page="queryData"></taskDetail>
    </div>
  </div>
</template>
<script lang="ts" setup name="regularStudents">
import { onMounted, getCurrentInstance, ref, reactive, watchEffect } from 'vue';
import commonTable from '@/components/commonTable.vue';
import queryHeader from '@/components/queryHeader.vue';
import lineRadius from '@/components/lineRadius.vue';
import rowsDynamicForm from '@/components/dynamicForm/rowsDynamicForm.vue';
import addTask from './components/addTask.vue';
import taskDetail from './components/taskDetail.vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ElMessageBox } from 'element-plus';
const router = useRouter();
const _this: any = getCurrentInstance();
const API: any = _this.proxy.$API;
const message: any = _this.proxy.$Message;
const rowsDynamicFormRef = ref(null);
const tableRef = ref(null);
const addTaskRef = ref(null);
const taskDetailRef = ref(null);
const store = useStore();
const subjectOptions = computed(() => store.state.subject);

//重置表单
const resetForm = () => {
  rowsDynamicFormRef?.value.invokeFormFn('resetFields');
  queryData();
};
const formData = ref({});
const formItems = ref([
  {
    label: '任务名称',
    prop: 'missionsName',
    type: 'autocomplete',
    attrs: {
      clearable: true,
      placeholder: '请输入',
      'select-when-unmatched': true,
      'fetch-suggestions': async (query, cb) => {
        if (query) {
          const params = {
            missionsName: query
          };
          API.student.pageMissions(params).then(res => {
            let data = res.records.map(el => {
              return {
                value: el.missionsName
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
    label: '竞赛科目',
    prop: 'competitionSubject',
    type: 'select',
    valueKey: 'code',
    labelKey: 'msg',
    options: subjectOptions.value,
    attrs: {
      clearable: true,
      multiple: true,
      'collapse-tags': true,
      'max-collapse-tags': 1,
      placeholder: '请选择'
    }
  },
  {
    label: '创建时间',
    prop: 'creatTime',
    type: 'date-picker',
    attrs: {
      clearable: true,
      valueFormat: 'YYYY-MM-DD',
      maxlength: '30',
      type: 'daterange',
      'range-separator': '-',
      'start-placeholder': '开始日期',
      'end-placeholder': '结束日期'
    }
  }
]);
const formAttrs = ref({
  'label-width': '80px'
});

watchEffect(() => {
  formItems.value[1].options = subjectOptions.value;
});

//按钮权限
const route = useRoute();
const btnArr = JSON.parse(localStorage.getItem('bjAdminBtns'));
const paramsPage = ref({
  creatTime: [],
  startTime: '',
  endTime: '',
  studentName: '',
  studentID: '',
  coachName: '',
  state: ''
});

const loginUser = JSON.parse(localStorage.getItem('bjAdminUser'));
const tableHeader = reactive([
  {
    label: '任务名称',
    prop: 'missionsName',
    'show-overflow-tooltip': true
  },
  {
    label: '竞赛科目',
    prop: 'competitionSubjectStr'
  },
  {
    label: '创建时间',
    prop: 'createTime',
    'show-overflow-tooltip': true
  },
  {
    label: '创建人',
    prop: 'creator',
    'show-overflow-tooltip': true
  },
  {
    label: '完成进度',
    prop: 'advance',
    hidden: loginUser.roleCode == 'teacher'
  },
  {
    label: '状态',
    colType: 'column',
    prop: 'missionsStatusStr'
  },
  {
    label: '操作',
    colType: 'btns',
    btns: [
      {
        label: '查看',
        type: 'primary',
        link: true,
        click: (row, rowIndex, btnIndex) => {
          const userInfo =
            JSON.parse(localStorage.getItem('bjAdminUser')) || {};
          if (userInfo?.dataType === 1) {
            taskDetailRef.value.openDrawer(row, 'detail');
          } else if (userInfo?.dataType === 2) {
            if (userInfo?.id == row.creatorId) {
              taskDetailRef.value.openDrawer(row, 'detail');
            } else {
              taskDetailRef.value.openDrawer(row, 'coachView');
            }
          }
        },
        hidden: (row, rowIndex, btnIndex) => {
          return getButtonpermissions(row.operationList, 'SELECT');
        }
      },
      {
        label: '预测',
        link: true,
        type: 'primary',
        click: (row, rowIndex, btnIndex) => {
          taskDetailRef.value.openDrawer(row, 'coachEdit');
        },
        hidden: (row, rowIndex, btnIndex) => {
          return (
            getButtonpermissions(row.operationList, 'ANTICIPATE') ||
            !btnArr.includes(route.path + '/prediction')
          );
        }
      },
      {
        label: '结束',
        link: true,
        type: 'primary',
        click: (row, rowIndex, btnIndex) => {
          taskDetailRef.value.openDrawer(row, 'end');
        },
        hidden: (row, rowIndex, btnIndex) => {
          return getButtonpermissions(row.operationList, 'CLOSE');
        }
      }
    ]
  }
]);
const tableData = ref([]);

// 操作按钮权限
const getButtonpermissions = (operationList, type) => {
  let isShow = true;
  if (operationList && operationList.length > 0) {
    let index = operationList.findIndex(el => el === type);
    if (index != -1) {
      isShow = false;
    } else {
      isShow = true;
    }
  }
  return isShow;
};

const initTag = ref(true);
const getTableData = param => {
  if (route.query.missionsName && initTag.value) {
    formData.value.missionsName = route.query.missionsName;
    param.missionsName = route.query.missionsName;
    initTag.value = false;
  }
  return API.student.pageMissions(param).then(res => res);
};
const paginationConfig = reactive({});

const changeModel = (model, value, key) => {
  paramsPage.value = model;
};
const queryData = () => {
  if (paramsPage.value.creatTime && paramsPage.value.creatTime.length > 0) {
    paramsPage.value.startTime = paramsPage.value.creatTime[0];
    paramsPage.value.endTime = paramsPage.value.creatTime[1];
  } else {
    paramsPage.value.startTime = '';
    paramsPage.value.endTime = '';
  }
  tableRef.value.refreshTable();
};
const currentPage = () => {};

//创建任务
const createTaskFn = () => {
  addTaskRef.value.openDrawer();
};

// 获取任务状态展示文字展示的颜色
const getStatusColor = code => {
  let color = '';
  if (code === 1) {
    color = 'doing';
  } else if (code === 2) {
    color = 'end';
  }
  return color;
};
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
    .doing {
      font-size: 14px;
      color: #4eaf49;
    }
    .end {
      font-size: 14px;
      color: #d45547;
    }
  }
  .advanceTip {
    display: flex;
    align-items: center;
    .el-icon {
      margin-left: 3px;
      font-size: 16px;
      font-weight: 400;
    }
  }
}
</style>
