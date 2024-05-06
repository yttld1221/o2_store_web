<template>
  <div>
    <div class="queryModule">
      <queryHeader title="用户管理">
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
    <div class="user-manage">
      <div class="user-add-btn" v-permission="{ action: $route.path + '/add' }">
        <el-button type="primary" @click="addRole()">新增用户</el-button>
      </div>
      <el-table
        :header-cell-style="{
          backgroundColor: '#F6F7FA',
          'text-align': 'center'
        }"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="staffName" label="用户姓名" align="center" />
        <el-table-column prop="staffCode" label="用户工号" align="center" />
        <el-table-column prop="mobile" label="联系方式" align="center" />
        <el-table-column
          prop="roleName"
          label="配置角色"
          align="center"
          show-overflow-tooltip
        >
          <template #default="scope">
            {{ scope.row.role.roleName }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template #default="scope">
            <el-button
              @click="changeUser(scope.row, '查看详情')"
              size="small"
              type="text"
              >查看</el-button
            >
            <template v-if="!['admin'].includes(scope.row.staffCode)">
              <el-button
                v-if="!['teacher'].includes(scope.row.role?.roleCode)"
                v-permission="{ action: $route.path + '/edit' }"
                size="small"
                @click="changeUser(scope.row, '编辑用户')"
                type="text"
                >编辑</el-button
              >
              <el-button
                v-permission="{ action: $route.path + '/enable' }"
                v-if="!scope.row.isEnable"
                size="small"
                @click="changeStatus(scope.row, '启用', 1)"
                type="text"
                >启用</el-button
              >
              <el-button
                v-permission="{ action: $route.path + '/disable' }"
                v-else
                size="small"
                type="danger"
                @click="changeStatus(scope.row, '禁用', 0)"
                text
                >禁用</el-button
              >
            </template>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        layout="total, sizes, prev, pager, next, jumper"
        style="justify-content: center; margin-top: 12px"
        :page-size="pageInfo.pageSize"
        :current-page="pageInfo.pageNum"
        :total="total"
        background
        @current-change="handleCurrentChange"
      />
      <el-dialog
        :title="dialogTitle"
        v-model="drawer"
        width="30%"
        :before-close="handleClose"
      >
        <el-form
          :disabled="dialogTitle == '查看详情'"
          :class="{ 'detail-form': dialogTitle == '查看详情' }"
          :label-width="dialogTitle == '查看详情' ? '160px' : '110px'"
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
        >
          <el-form-item label="联系方式" prop="mobile">
            <span v-if="dialogTitle == '查看详情'">{{ ruleForm.mobile }}</span>
            <template v-else>
              <el-input
                @blur="jyMobile()"
                style="width: 220px"
                show-word-limit
                maxlength="11"
                v-model.trim="ruleForm.mobile"
                placeholder="请输入联系方式"
              ></el-input>
            </template>
          </el-form-item>
          <el-form-item
            label="工号"
            prop="staffCode"
            v-if="dialogTitle == '查看详情'"
          >
            <span>{{ ruleForm.staffCode }}</span>
          </el-form-item>
          <el-form-item label="姓名" prop="staffName">
            <span v-if="dialogTitle == '查看详情'">{{
              ruleForm.staffName
            }}</span>
            <el-input
              style="width: 220px"
              v-else
              show-word-limit
              maxlength="30"
              v-model.trim="ruleForm.staffName"
              placeholder="请输入姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户角色" prop="roleId">
            <span v-if="dialogTitle == '查看详情'">{{
              ruleForm.role?.roleName
            }}</span>
            <el-select
              v-else
              style="width: 220px"
              v-model="ruleForm.roleId"
              placeholder="请选择"
            >
              <el-option
                :key="index"
                v-for="(item, index) in jsSel"
                :label="item.label"
                :value="item.value"
                :disabled="item.disable"
              />
            </el-select>
          </el-form-item>
        </el-form>

        <template #footer v-if="dialogTitle != '查看详情'">
          <el-button @click="handleClose()">取消</el-button>
          <el-button type="primary" @click="submitUser()">确认</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script lang="ts" setup name="roleManage">
import { onMounted, getCurrentInstance, ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import queryHeader from '@/components/queryHeader.vue';
import lineRadius from '@/components/lineRadius.vue';
import { userNameRule, phoneRule } from '@/utils/utils.js';
const router = useRouter();
const _this: any = getCurrentInstance();
const API: any = _this.proxy.$API;
const message: any = _this.proxy.$Message;
const pageInfo = ref({
  pageNum: 1,
  pageSize: 10
});
const tableData = ref([]);
const total = ref(0);
const dialogTitle = ref('');
const drawer = ref(false);
const ruleFormRef = ref();
const ruleForm = ref({
  mobile: '',
  staffName: '',
  roleId: '',
  staffCode: '',
  staffType: 2
});
const rules = ref({
  mobile: [
    { required: true, message: '请输入联系方式', trigger: 'blur' },
    {
      validator: phoneRule,
      trigger: 'blur'
    }
  ],
  staffName: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    {
      validator: userNameRule,
      trigger: 'blur'
    }
  ],
  staffCode: [{ required: true, message: '请点击校验', trigger: 'blur' }],
  roleId: [
    {
      required: true,
      message: '请选择用户角色',
      trigger: 'change'
    }
  ]
});

// 表单数据
const formData = ref({});
const formItems = ref([
  {
    label: '用户姓名',
    prop: 'staffName',
    type: 'autocomplete',
    attrs: {
      clearable: true,
      placeholder: '请输入',
      'fetch-suggestions': (query, cb) => {
        if (query) {
          const params = {
            staffName: query
          };
          API.system.queryLikeStaffCodeByStaffName(params).then(res => {
            let arr = res.map(el => {
              return {
                label: el.staffName,
                value: el.staffName
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
    label: '联系方式',
    prop: 'mobile',
    type: 'input',
    attrs: {
      clearable: true,
      placeholder: '请输入'
    }
  }
]);

const formAttrs = ref({
  'label-width': '80px'
});
const paramsPage = ref({});
const changeModel = (model, value, key) => {
  paramsPage.value = model;
};
// 查询
const searchForm = () => {
  pageInfo.value.pageNum = 1;
  getList();
};

const rowsDynamicFormRef = ref();
//重置表单
const resetForm = tag => {
  if (tag) rowsDynamicFormRef?.value.invokeFormFn('resetFields');
  searchForm();
};

const jsSel = ref([]);
const getJsSel = () => {
  const params = {
    pageNum: 1,
    pageSize: -1
  };
  API.system.sysRoleQueryByPage(params).then(res => {
    console.log(res);
    jsSel.value = res.records.map(el => {
      return {
        label: el.roleName,
        value: el.id,
        disable: !el.isEnable
      };
    });
  });
};
// 提交角色
const submitUser = () => {
  ruleFormRef.value.validate(async valid => {
    if (valid) {
      const params = {
        ...ruleForm.value,
        role: { id: ruleForm.value.roleId }
      };
      let res = null;
      if (dialogTitle.value == '新增用户') {
        res = await API.system.staffInfoadd(params);
      } else {
        res = await API.system.staffInfoedit(params);
      }
      if (res) {
        resetList(dialogTitle.value == '新增用户' ? true : false);
        handleClose();
        ElMessage({
          message: dialogTitle.value + '成功',
          type: 'success'
        });
      }
    }
  });
};

// 校验联系方式
const jyMobile = () => {
  ruleFormRef.value.validateField('mobile', async valid => {
    if (valid) {
      API.system.checkInternal({ mobile: ruleForm.value.mobile }).then(res => {
        console.log(res);
        ruleForm.value = {
          ...ruleForm.value,
          staffCode: res.staffCode,
          staffName: res.staffName ? res.staffName : ruleForm.value.staffName,
          staffType: res.staffType
        };
      });
    }
  });
};

// 关闭抽屉
const handleClose = () => {
  drawer.value = false;
  ruleForm.value = {};
  ruleFormRef.value.resetFields();
};
// 新增用户
const addRole = () => {
  dialogTitle.value = '新增用户';
  drawer.value = true;
};
// 启用/禁用
const changeStatus = (row, label, enableStatus) => {
  ElMessageBox.confirm(`是否${label}当前用户？`, label, {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    closeOnClickModal: false
  })
    .then(async () => {
      const params = {
        staffCode: row.staffCode,
        enableStatus
      };
      API.system.userchangeEnable(params).then(res => {
        ElMessage.success('操作成功');
        getList();
      });
    })
    .catch(() => {});
};
// 查看/编辑用户
const changeUser = (row, title) => {
  API.system.staffInfoid({ staffCode: row.staffCode }).then(res => {
    console.log(res);
    dialogTitle.value = title;
    drawer.value = true;
    nextTick(() => {
      ruleForm.value = { ...res, roleId: res.role.id };
    });
  });
};

const getList = () => {
  const params = {
    ...paramsPage.value,
    ...pageInfo.value
  };
  API.system.staffInfoList(params).then(res => {
    //console.log(res);
    tableData.value = res.records;
    total.value = res.total;
  });
};
//分页
const handleCurrentChange = (val: number) => {
  pageInfo.value.pageNum = val;
  getList();
};

// 重置列表
const resetList = (tag = true) => {
  if (tag) pageInfo.value.pageNum = 1;
  getList();
};

const handleSizeChange = (val: number) => {
  pageInfo.value.pageSize = val;
  getList();
};

onMounted(() => {
  getJsSel();
  getList();
});
</script>

<style lang="scss" scoped>
.queryModule {
  border-radius: 0 0 4px 4px;
}
.user-manage {
  padding: 20px;
  .user-add-btn {
    display: flex;
    margin-bottom: 16px;
  }
  .flex-align {
    display: flex;
    align-items: center;
  }
  :deep(.detail-form) {
    .el-form-item__label:before {
      content: '' !important;
      margin-right: 0 !important;
    }
  }
  .el-button--text.el-button--small,
  .is-text.el-button--small {
    padding: 0;
  }
}
</style>
