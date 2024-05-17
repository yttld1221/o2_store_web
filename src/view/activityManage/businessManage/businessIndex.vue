<template>
  <div class="activity-type">
    <div class="queryModule">
      <queryHeader title="商家管理">
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
          <el-button type="primary" @click="addType()">新增</el-button>
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
        <template v-slot:column|addr="scope">
          {{ showVal(scope.row.addr) }}
        </template>
        <template v-slot:column|phone="scope">
          {{ showVal(scope.row.phone) }}
        </template>
        <template v-slot:column|person="scope">
          {{ showVal(scope.row.person) }}
        </template>
        <template v-slot:column|remark="scope">
          {{ showVal(scope.row.remark) }}
        </template>
        <template v-slot:column|status="scope">
          {{ scope.row.status == 1 ? "启用" : "禁用" }}
        </template>
      </common-table>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="handleClose"
      v-model="dialogVisible"
      :title="dialogTitle"
      width="35%"
      class="dialogContainer"
    >
      <div class="dialog-box">
        <el-form
          :rules="rules"
          ref="formRef"
          :model="ruleForm"
          label-width="95px"
        >
          <el-form-item label="商户名称" prop="merchant">
            <el-input
              v-model.trim="ruleForm.merchant"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="addr">
            <el-input
              v-model.trim="ruleForm.addr"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input
              v-model.trim="ruleForm.phone"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系人" prop="person">
            <el-input
              v-model.trim="ruleForm.person"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="是否开启" prop="status">
            <el-select v-model="ruleForm.status" placeholder="请选择">
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="ruleForm.remark"
              :autosize="{ minRows: 4 }"
              type="textarea"
              placeholder="请输入"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialogFooter">
          <el-button @click="handleClose" class="cancelBtn">取消</el-button>
          <el-button type="primary" @click="confirmSubmit" class="confirmBtn"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup name="postIndex">
import {
  onMounted,
  reactive,
  getCurrentInstance,
  ref,
  nextTick,
  computed,
  watchEffect,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { useStore } from "vuex";
import commonTable from "@/components/commonTable.vue";
import queryHeader from "@/components/queryHeader.vue";
import lineRadius from "@/components/lineRadius.vue";
import rowsDynamicForm from "@/components/dynamicForm/rowsDynamicForm.vue";
const router = useRouter();
const route = useRoute();
const _this: any = getCurrentInstance();
const API: any = _this.proxy.$API;
const message: any = _this.proxy.$Message;
const tableData = ref([]);
const selectText = ref({ 1: "是", 2: "否" });
const pageSizes = reactive([10, 20, 50, 100]);
const dialogTitle = ref("");
const dialogVisible = ref(false);
const store = useStore();
const formRef = ref(null);
const ruleForm = ref({
  id: 0,
  merchant: "",
  addr: "",
  person: "",
  phone: "",
  remark: "",
  status: 1,
});
const rules = ref({
  merchant: [{ required: true, message: "请输入商户名称", trigger: "blur" }],
  status: [{ required: true, message: "请选择", trigger: "change" }],
});
// 表单数据
const formData = ref({ status: 1 });
const formItems = ref([
  {
    label: "商户名称",
    prop: "merchant",
    type: "input",
  },
  {
    label: "地址",
    prop: "addr",
    type: "input",
  },
  {
    label: "联系电话",
    prop: "phone",
    type: "input",
  },
  {
    label: "联系人",
    prop: "person",
    type: "input",
  },
  {
    label: "启用状态",
    prop: "status",
    type: "select",
    valueKey: "value",
    labelKey: "label",
    options: [
      { label: "全部", value: 0 },
      { label: "启用", value: 1 },
      { label: "禁用", value: 2 },
    ],
  },
]);

const formAttrs = ref({
  "label-width": "90px",
});
const paramsPage = ref({ pageSize: 20 });
const changeModel = (model, value, key) => {
  paramsPage.value = model;
};

const rowsDynamicFormRef = ref();

const showVal = (val) => {
  return val ? val : "-";
};

const tableRef = ref();

// 查询
const searchForm = () => {
  tableRef.value.refreshTable();
};
const tableHeader = reactive([
  {
    label: "ID",
    prop: "id",
  },
  {
    label: "商户名称",
    prop: "merchant",
    width: "200",
  },
  {
    label: "地址",
    prop: "addr",
    width: "200",
    colType: "column",
  },
  {
    label: "联系电话",
    prop: "phone",
    colType: "column",
  },
  {
    label: "联系人",
    prop: "person",
    colType: "column",
  },
  {
    label: "启用状态",
    prop: "status",
    colType: "column",
  },
  {
    label: "备注信息",
    prop: "remark",
    width: "200",
    colType: "column",
  },
  {
    label: "创建时间",
    prop: "created_at",
    width: "170",
  },
  {
    label: "更新时间",
    prop: "updated_at",
    width: "170",
  },
  {
    label: "创建人",
    prop: "create_name",
  },
  {
    label: "修改人",
    prop: "update_name",
  },
  {
    label: "操作",
    colType: "btns",
    width: "100",
    fixed: "right",
    btns: [
      {
        label: "编辑",
        type: "primary",
        link: true,
        click: (row, rowIndex, btnIndex) => {
          dialogTitle.value = "编辑";
          dialogVisible.value = true;
          nextTick(() => {
            ruleForm.value = JSON.parse(JSON.stringify(row));
          });
        },
      },
    ],
  },
]);

const getTableData = (param) => {
  return API.activity.getShopList(param).then((res) => res);
};
const paginationConfig = reactive({});

const handleClose = () => {
  dialogVisible.value = false;
  nextTick(() => {
    formRef.value.resetFields();
  });
};
const confirmSubmit = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      let params = {
        ...ruleForm.value,
      };
      API.activity.saveShop(params).then((res) => {
        console.log(res);
        resetForm(dialogTitle.value == "新增" ? true : false);
        handleClose();
        ElMessage.success("操作成功");
      });
    } else {
      return false;
    }
  });
};

//重置表单
const resetForm = (tag) => {
  if (tag) rowsDynamicFormRef?.value.invokeFormFn("resetFields");
  tableRef.value.refreshTable(tag);
};

const editType = (row) => {
  dialogTitle.value = "编辑";
  dialogVisible.value = true;
  nextTick(() => {
    let rows = JSON.parse(
      JSON.stringify({ ...row, pid: row.pid == 0 ? "" : row.pid })
    );
    delete rows.children;
    ruleForm.value = rows;
  });
};

const addType = () => {
  dialogTitle.value = "新增";
  dialogVisible.value = true;
};

onMounted(() => {});
</script>

<style lang="scss" scoped>
.activity-type {
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

  .dialog-box {
    justify-content: center;
    span {
      margin-right: 16px;
    }
  }
  :deep(.avatar-uploader) {
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }

    .el-upload:hover {
      border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 120px;
      height: 120px;
      text-align: center;
    }
    img {
      width: 120px;
      height: 120px;
    }
  }
}
</style>
