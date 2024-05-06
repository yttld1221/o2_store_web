<template>
  <div class="teacher-manage">
    <div class="queryModule">
      <queryHeader title="教师管理">
        <template #queryBtns>
          <el-button @click="resetForm(true)">重置</el-button>
          <el-button type="primary" @click="searchForm">查询</el-button>
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
            @click="addTeacher"
            v-permission="{ action: $route.path + '/add' }"
            >新增教师</el-button
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
        :loading="true"
        :queryParams="paramsPage"
        :ajaxGetData="getTableData"
        :paginationConfig="paginationConfig"
      >
      </common-table>
    </div>
    <el-drawer v-model="drawer" direction="rtl" :before-close="handleClose">
      <template #header>
        <div class="drawer-title flex-align">
          <div class="title-text">{{ dialogTitle }}</div>
          <el-button
            v-if="dialogTitle != '教师详情'"
            type="primary"
            @click="submitTeacher()"
            >提交</el-button
          >
        </div>
      </template>
      <div class="teacher-info" :style="{'padding-bottom':dialogTitle == '教师详情'?'20px':'10px'}">
        <div class="info-title">基本信息</div>
        <el-form
          :class="[
            { 'detail-form': dialogTitle == '教师详情' },
            { 'detail-form-text': dialogTitle == '教师详情' }
          ]"
          style="margin-top: 20px; padding: 0 10px"
          label-position="left"
          label-width="85px"
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
        >
          <div
            class="flex-align"
            :class="{ 'detail-form': dialogTitle == '编辑教师' }"
            style="justify-content: space-between"
          >
            <el-form-item label="教师姓名" prop="teacherName">
              <el-input
                v-if="dialogTitle == '新增教师'"
                style="width: 170px"
                maxlength="30"
                show-word-limit
                v-model="ruleForm.teacherName"
                placeholder="请输入"
              />
              <div v-else style="width: 170px">{{ ruleForm.teacherName }}</div>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-select
                v-if="dialogTitle == '新增教师'"
                style="width: 170px"
                v-model="ruleForm.gender"
                placeholder="请选择"
              >
                <el-option
                  :key="index"
                  v-for="(item, index) in getSel('gender')"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <div v-else style="width: 170px">{{ ruleForm.genderStr }}</div>
            </el-form-item>
          </div>
          <div
            class="flex-align"
            v-if="dialogTitle != '新增教师'"
            style="justify-content: space-between"
          >
            <el-form-item label="学科">
              <div style="width: 170px">{{ ruleForm.subjectStr }}</div>
            </el-form-item>
            <el-form-item label="工号"
              ><div style="width: 170px">{{ ruleForm.staffCode }}</div>
            </el-form-item>
          </div>
          <div class="flex-align" style="justify-content: space-between">
            <el-form-item label="联系方式" prop="contacts">
              <el-input
                v-if="dialogTitle != '教师详情'"
                style="width: 170px"
                maxlength="11"
                show-word-limit
                v-model="ruleForm.contacts"
                placeholder="请输入"
              />
              <div v-else style="width: 170px">{{ ruleForm.contacts }}</div>
            </el-form-item>
            <el-form-item label="星级评定" prop="starRating">
              <el-select
                v-if="dialogTitle != '教师详情'"
                style="width: 170px"
                v-model="ruleForm.starRating"
                placeholder="请选择"
              >
                <el-option
                  :key="index"
                  v-for="(item, index) in getSel('starRating')"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <div v-else style="width: 170px">
                {{ ruleForm.starRatingStr }}
              </div>
            </el-form-item>
          </div>
          <el-form-item
            v-if="dialogTitle == '新增教师'"
            label="学科"
            prop="subject"
          >
            <el-select
              style="width: 170px"
              v-model="ruleForm.subject"
              placeholder="请选择"
            >
              <el-option
                :key="index"
                v-for="(item, index) in getSel('subject')"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="教师简介" prop="summary">
            <el-input
              v-if="dialogTitle != '教师详情'"
              type="textarea"
              style="width: 100%"
              maxlength="300"
              show-word-limit
              :rows="4"
              v-model="ruleForm.summary"
              placeholder="请输入"
            />
            <div
              v-else
              v-html="ruleForm.summary"
              style="width: 100%; word-break: break-all; white-space: pre-wrap"
            ></div>
          </el-form-item>
        </el-form>
      </div>
      <div class="teacher-detail" v-if="dialogTitle == '教师详情'">
        <el-tabs v-model="activeName">
          <el-tab-pane label="成就展示" name="1"></el-tab-pane>
          <el-tab-pane v-if="showSs" label="双师讲堂" name="2"></el-tab-pane>
        </el-tabs>
        <div class="components-box">
          <achieve :teacherCode="ruleForm?.staffCode" v-if="activeName == 1" />
          <template v-else>
            <classroom v-if="showSs" :teacherCode="ruleForm?.staffCode" />
          </template>
        </div>
      </div>
    </el-drawer>
    <addBatch @success-upload="resetForm(true)" ref="addBatchRef"></addBatch>
    <editBatch
      @success-upload="resetForm(false)"
      ref="editBatchRef"
    ></editBatch>
  </div>
</template>
<script lang="ts" setup name="teacherIndex">
import {
  onMounted,
  reactive,
  getCurrentInstance,
  ref,
  nextTick,
  computed,
  watchEffect
} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useStore } from 'vuex';
import classroom from './components/classroom.vue';
import achieve from './components/achieve.vue';
import addBatch from './components/addBatch.vue';
import editBatch from './components/editBatch.vue';
import commonTable from '@/components/commonTable.vue';
import queryHeader from '@/components/queryHeader.vue';
import lineRadius from '@/components/lineRadius.vue';
import rowsDynamicForm from '@/components/dynamicForm/rowsDynamicForm.vue';
import { userNameRule, phoneRule } from '@/utils/utils.js';
const router = useRouter();
const route = useRoute();
const _this: any = getCurrentInstance();
const API: any = _this.proxy.$API;
const message: any = _this.proxy.$Message;
const addBatchRef = ref();
const editBatchRef = ref();

// 抽屉
const dialogTitle = ref('教师详情');
const drawer = ref(false);
const store = useStore();
const starSel = computed(() => store.state.starRating);
const subjectSel = computed(() => store.state.subject);
// 表单数据
const formData = ref({});
const formItems = ref([
  {
    label: '教练姓名',
    prop: 'teacherName',
    type: 'autocomplete',
    attrs: {
      clearable: true,
      placeholder: '请输入',
      'fetch-suggestions': (query, cb) => {
        if (query) {
          const params = {
            teacherName: query
          };
          API.teacher.likeKeyWord(params).then(res => {
            let arr = res.map(el => {
              return {
                label: el,
                value: el
              };
            });
            cb(arr);
          });
        } else {
          cb([]);
        }
      }
    },
    options: []
  },
  {
    label: '工号',
    prop: 'staffCode',
    type: 'input'
  },
  {
    label: '联系方式',
    prop: 'contacts',
    type: 'autocomplete',
    attrs: {
      clearable: true,
      placeholder: '请输入',
      'fetch-suggestions': (query, cb) => {
        if (query) {
          const params = {
            contacts: query
          };
          API.teacher.likeKeyWord(params).then(res => {
            let arr = res.map(el => {
              return {
                label: el,
                value: el
              };
            });
            cb(arr);
          });
        } else {
          cb([]);
        }
      }
    },
    options: []
  },
  {
    label: '星级评定',
    prop: 'starRating',
    type: 'select',
    valueKey: 'code',
    labelKey: 'msg',
    attrs: {
      multiple: true,
      'collapse-tags': true,
      'max-collapse-tags': 1
    },
    options: starSel.value
  },
  {
    label: '学科',
    prop: 'subject',
    type: 'select',
    valueKey: 'code',
    labelKey: 'msg',
    attrs: {
      multiple: true,
      'collapse-tags': true,
      'max-collapse-tags': 1
    },
    options: subjectSel.value
  }
]);

watchEffect(() => {
  formItems.value[3].options = starSel.value;
  formItems.value[4].options = subjectSel.value;
});
const formAttrs = ref({
  'label-width': '80px'
});
const paramsPage = ref({ pageSize: 20 });
const changeModel = (model, value, key) => {
  paramsPage.value = model;
};
const showSs = ref(false);
const isShowSs = () => {
  API.teacher
    .studySituation({ teacherCode: ruleForm.value.staffCode })
    .then(res => {
      console.log(res);
      showSs.value = res.length;
    });
};
const exportData = () => {
  const params = { ...paramsPage.value, pageNum: 1, pageSize: -1 };
  API.teacher
    .exportTeacherInfo(params)
    .then(res => {
      console.log(res);
    })
    .catch(error => {
      downloadFileWithUrl(error);
    });
};

const downloadFileWithUrl = (blob, fileName = '教师记录.xlsx') => {
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

//批量新增
const addBatchFn = () => {
  addBatchRef.value.openDialog();
};
//批量修改
const editBatchFn = () => {
  editBatchRef.value.openDialog();
};

const rowsDynamicFormRef = ref();
// 新增教师
const addTeacher = () => {
  drawer.value = true;
  dialogTitle.value = '新增教师';
};
//重置表单
const resetForm = tag => {
  if (tag) rowsDynamicFormRef?.value.invokeFormFn('resetFields');
  tableRef.value.refreshTable(tag);
};
const tableRef = ref();
// 查询
const searchForm = () => {
  tableRef.value.refreshTable();
};
const btnArr = JSON.parse(localStorage.getItem('bjAdminBtns'));
const tableHeader = reactive([
  {
    label: '教师姓名',
    prop: 'teacherName',
    'show-overflow-tooltip': true
  },
  {
    label: '工号',
    prop: 'staffCode',
    'show-overflow-tooltip': true
  },
  {
    label: '联系方式',
    prop: 'contacts',
    'show-overflow-tooltip': true
  },
  {
    label: '学科',
    prop: 'subjectStr',
    'show-overflow-tooltip': true
  },
  {
    label: '星级评定',
    prop: 'starRatingStr',
    'show-overflow-tooltip': true
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
          commonDetail(row, '教师详情');
        }
      },
      {
        label: '编辑',
        link: true,
        hidden: !btnArr.includes(route.path + '/edit'),
        type: 'primary',
        click: (row, rowIndex, btnIndex) => {
          commonDetail(row, '编辑教师');
        }
      }
    ]
  }
]);

const commonDetail = (row, title) => {
  drawer.value = true;
  dialogTitle.value = title;
  ruleForm.value.staffCode = row.staffCode;
  isShowSs();
  API.teacher.queryByTeacherCode({ teacherCode: row.staffCode }).then(res => {
    console.log(res);
    nextTick(() => {
      ruleForm.value = res;
    });
  });
};
const tableData = ref([]);
const getTableData = param => {
  return API.teacher.pageTeacherInfo(param).then(res => res);
};
const paginationConfig = reactive({});

// 根据工号/姓名/联系方式查询
const querySearch = (param = {}, key) => {
  const params = {
    ...param,
    pageNum: 1,
    pageSize: -1
  };
  API.teacher.pageTeacherInfo(params).then(res => {
    let arr = res.records.map(el => {
      return {
        label: el[key],
        value: el[key]
      };
    });
    console.log(arr);
    return arr;
  });
};

const handleClose = () => {
  drawer.value = false;
  activeName.value = '1';
  ruleForm.value = {};
  ruleFormRef.value.resetFields();
};

const activeName = ref('1');

const ruleFormRef = ref();
const ruleForm = ref({ teacherName: '', gender: '' });

const rules = ref({
  teacherName: [
    { required: true, message: '请输入教师姓名', trigger: 'blur' },
    {
      validator: userNameRule,
      trigger: 'blur'
    }
  ],
  gender: [
    {
      required: true,
      message: '请选择性别',
      trigger: 'change'
    }
  ],
  contacts: [
    { required: true, message: '请输入联系方式', trigger: 'blur' },
    {
      validator: phoneRule,
      trigger: 'blur'
    }
  ],
  starRating: [
    {
      required: true,
      message: '请选择星级评定',
      trigger: 'change'
    }
  ],
  subject: [
    {
      required: true,
      message: '请选择学科',
      trigger: 'change'
    }
  ],
  summary: [{ required: true, message: '请输入教师简介', trigger: 'blur' }]
});

// 获取下拉
const getSel = key => {
  return store.state[key].map(el => {
    return {
      label: el.msg,
      value: el.code
    };
  });
};

//提交
const submitTeacher = () => {
  ruleFormRef.value.validate(valid => {
    if (valid) {
      ElMessageBox.confirm('确认提交当前操作内容？', '提交确认', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        closeOnClickModal: false
      }).then(async () => {
        const params = {
          ...ruleForm.value
        };
        let res = null;
        if (dialogTitle.value == '新增教师') {
          res = await API.teacher.teacherInfoadd(params);
        } else {
          res = await API.teacher.teacherInfoedit(params);
        }
        if (res) {
          resetForm(dialogTitle.value == '新增教师' ? true : false);
          handleClose();
          ElMessage({
            message: '提交成功',
            type: 'success'
          });
        }
      });
    }
  });
};
</script>

<style lang="scss" scoped>
.teacher-manage {
  .queryModule {
    border-radius: 0 0 4px 4px;
  }
  .listModule {
    padding: 20px;
    background: #ffffff;
    .btnsContainer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 15px;
    }
  }
  .flex-align {
    display: flex;
    align-items: center;
  }
  :deep(.el-drawer) {
    width: 720px !important;
    .drawer-title {
      justify-content: space-between;
      .title-text {
        font-size: 16px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        color: #333333;
      }
      .el-button {
        margin-right: 32rpx;
      }
    }
    .teacher-info {
      padding: 20px 20px 10px;
      background: #f8fafd;
      border-radius: 8px;
      .info-title {
        padding-bottom: 10px;
        font-size: 14px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        color: #333333;
        border-bottom: 1px solid #ebeef5;
      }
    }
    .teacher-detail {
      margin-top: 20px;
      background: #f8fafd;
      border-radius: 8px;
      padding: 10px 20px 20px;
      .components-box {
        margin-top: 5px;
      }
    }
    .detail-form {
      .el-form-item__label:before {
        content: '';
        margin-right: 0;
      }
    }
    .detail-form-text {
      .el-form-item {
        margin-bottom: 0;
      }
    }
    .el-form-item__label {
      color: #999999 !important;
    }
    .el-form-item__content {
      color: #333333 !important;
    }
  }
}
</style>
