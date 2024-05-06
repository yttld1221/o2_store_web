<template>
  <div class="role-manage">
    <div class="role-add-btn" v-permission="{ action: $route.path + '/add' }">
      <el-button type="primary" @click="addRole()">新增角色</el-button>
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
      <el-table-column prop="roleName" label="角色名称" align="center" />
      <el-table-column
        prop="roleDesc"
        label="说明"
        align="center"
        show-overflow-tooltip
      >
        <template #default="scope">
          <span
            v-html="scope.row.roleDesc"
            style="white-space: pre-wrap"
          ></span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template #default="scope">
          <el-button
            @click="changeRole(scope.row, '查看详情')"
            size="small"
            type="text"
            >查看</el-button
          >
          <el-button
            v-permission="{ action: $route.path + '/auth' }"
            v-if="!['admin'].includes(scope.row.roleCode)"
            size="small"
            @click="changeRole(scope.row, '编辑角色')"
            type="text"
            >功能权限</el-button
          >
          <template v-if="!['admin', 'teacher'].includes(scope.row.roleCode)">
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
    <el-drawer v-model="drawer" direction="rtl" :before-close="handleClose">
      <template #header>
        <div class="drawer-title flex-align">
          <div class="title-text">{{ dialogTitle }}</div>
          <el-button
            v-if="dialogTitle != '查看详情'"
            type="primary"
            @click="submitRole()"
            >提交</el-button
          >
        </div>
      </template>
      <el-form
        :disabled="dialogTitle == '查看详情'"
        :class="{ 'detail-form': dialogTitle == '查看详情' }"
        label-position="left"
        label-width="85px"
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <span v-if="dialogTitle == '查看详情'">{{ ruleForm.roleName }}</span>
          <el-input
            v-else
            show-word-limit
            maxlength="10"
            v-model.trim="ruleForm.roleName"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色说明" prop="roleDesc">
          <span
            v-if="dialogTitle == '查看详情'"
            v-html="ruleForm.roleDesc"
            style="white-space: pre-wrap"
          ></span>
          <el-input
            v-else
            :rows="4"
            maxlength="300"
            show-word-limit
            placeholder="请输入角色说明"
            type="textarea"
            v-model="ruleForm.roleDesc"
          ></el-input>
        </el-form-item>
        <div class="flex-align tree-box">
          <el-form-item
            label-width="0"
            class="form-power-box"
            prop="menuButtonsIds"
          >
            <div class="power-box" style="margin-right: 10px">
              <div class="function-power power-tree">
                <p>菜单权限：</p>
                <tree-choose
                  :treeChoose="ruleForm.menuButtonsIds"
                  @chooseTree="res => getMenuTree(res, 'menuButtonsIds')"
                  :data="menuData"
                  :defaultProps="defaultProps"
                ></tree-choose>
              </div></div
          ></el-form-item>
          <el-form-item
            class="form-power-box dataType-box"
            label-width="0"
            prop="dataType"
          >
            <div class="power-box" style="margin-left: 10px">
              <div class="function-power power-tree">
                <p>数据权限：</p>
                <el-radio-group v-model="ruleForm.dataType">
                  <el-radio :label="1">全部数据</el-radio>
                  <el-radio :label="2">账号相关数据</el-radio>
                </el-radio-group>
              </div>
            </div></el-form-item
          >
        </div>
      </el-form>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup name="roleManage">
import { onMounted, getCurrentInstance, ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import treeChoose from '@/components/treeChoose.vue';
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
const defaultProps = ref({
  children: 'childNode',
  label: 'label'
});
const menuData = ref([]);
// 选择功能权限树
const getMenuTree = (res, key) => {
  //console.log(res.list);
  ruleForm.value[key] = res.list;
};
const initTree = () => {
  API.system.sysRolequeryByIdFunction({}).then(res => {
    console.log(res);
    menuData.value = res.menuButtonsTree;
  });
};
const ruleForm = ref({
  roleName: '',
  roleDesc: '',
  menuButtonsIds: [],
  dataType: ''
});
const rules = ref({
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  roleDesc: [{ required: true, message: '请输入角色说明', trigger: 'blur' }],
  menuButtonsIds: [
    {
      required: true,
      message: '请选择菜单权限',
      trigger: 'change',
      type: 'array'
    }
  ],
  dataType: [
    {
      required: true,
      message: '请选择数据权限',
      trigger: 'change'
    }
  ]
});
// 提交角色
const submitRole = () => {
  ruleFormRef.value.validate(valid => {
    if (valid) {
      ElMessageBox.confirm('确认提交当前操作内容？', '提交确认', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        closeOnClickModal: false
      })
        .then(async () => {
          const params = {
            ...ruleForm.value,
            menuButtonsTree: []
          };
          let res = null;
          if (dialogTitle.value == '新增角色') {
            res = await API.system.sysRoleadd(params);
          } else {
            res = await API.system.sysRoleedit(params);
          }
          if (res) {
            resetList(dialogTitle.value == '新增角色' ? true : false);
            handleClose();
            ElMessage({
              message: '提交成功',
              type: 'success'
            });
          }
        })
        .catch(() => {});
    }
  });
};

// 关闭抽屉
const handleClose = () => {
  drawer.value = false;
  ruleForm.value = { menuButtonsIds: [] };
  ruleFormRef.value.resetFields();
};
// 新增角色
const addRole = () => {
  initTree();
  dialogTitle.value = '新增角色';
  drawer.value = true;
};
// 启用/禁用
const changeStatus = (row, label, enableStatus) => {
  ElMessageBox.confirm(`是否${label}当前角色？`, label, {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    closeOnClickModal: false
  })
    .then(async () => {
      const params = {
        roleId: row.id,
        enableStatus
      };
      API.system.rolechangeEnable(params).then(res => {
        ElMessage.success('操作成功');
        getList();
      });
    })
    .catch(() => {});
};
// 查看/编辑角色
const changeRole = (row, title) => {
  initTree();
  API.system.sysRolequeryByIdFunction({ roleId: row.id }).then(res => {
    //console.log(res);
    dialogTitle.value = title;
    drawer.value = true;
    nextTick(() => {
      ruleForm.value = {
        ...res,
        menuButtonsIds: res.menuButtonsIds ? res.menuButtonsIds : []
      };
    });
  });
};

const getList = () => {
  const params = {
    ...pageInfo.value
  };
  API.system.sysRoleQueryByPage(params).then(res => {
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
  getList();
});
</script>

<style lang="scss" scoped>
.role-manage {
  padding: 20px;
  .role-add-btn {
    display: flex;
    margin-bottom: 16px;
  }
  :deep(.el-drawer) {
    width: 696px !important;
    .drawer-title {
      justify-content: space-between;
      .title-text {
        font-size: 21rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        color: #333333;
      }
      .el-button {
        margin-right: 32rpx;
      }
    }
  }
  .tree-box {
    align-items: flex-start !important;
    position: relative;
    :deep(.el-form-item) {
      margin-bottom: 0;
    }
    .form-power-box {
      padding-bottom: 24px;
      width: 50%;
    }
    .dataType-box {
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      .power-box {
        height: 100%;
      }
    }
    .power-box {
      display: flex;
      position: relative;
      width: 100%;
      .power-over {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 100;
      }
      & > div {
        width: 50%;
        & > p {
          margin-bottom: 10px;
        }
      }
      :deep(.power-tree) {
        width: 100%;
        padding: 16px 24px 24px;
        border-radius: 8px;
        border: 1px solid rgba(0, 0, 0, 0.15);
        .el-radio-group {
          flex-direction: column;
          align-items: flex-start;
        }
        .el-radio__inner {
          border-radius: 2px !important;
        }
        .el-radio__input.is-checked .el-radio__inner::after {
          content: '';
          width: 8px;
          height: 3px;
          border: 1px solid white;
          border-top: transparent;
          border-right: transparent;
          text-align: center;
          display: block;
          position: absolute;
          top: 3px;
          left: 2px;
          transform: rotate(-45deg);
          border-radius: 0px;
          background: none;
        }
        .el-radio__input.is-disabled.is-checked .el-radio__inner::after {
          border-color: #a8abb2 !important;
        }
      }
    }
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
