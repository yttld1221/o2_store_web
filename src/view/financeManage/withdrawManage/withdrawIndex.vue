<template>
  <div class="post-manage">
    <div class="queryModule">
      <queryHeader title="提现">
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
            :disabled="!multipleSelection.length"
            type="primary"
            @click="changeHandle()"
            >批量审核</el-button
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
        @selection-change="handleSelectionChange"
        :row-key="getRowKeys"
      >
        <template v-slot:column|money="scope">
          {{ scope.row.money }}元
        </template>
        <template v-slot:column|status="scope">
          {{ selectText[scope.row.status] }}
        </template>
      </common-table>
    </div>
  </div>
</template>
<script lang="ts" setup name="withdrawIndex">
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
import commentDialog from "./components/commentDialog.vue";
import commonTable from "@/components/commonTable.vue";
import queryHeader from "@/components/queryHeader.vue";
import lineRadius from "@/components/lineRadius.vue";
import rowsDynamicForm from "@/components/dynamicForm/rowsDynamicForm.vue";
const router = useRouter();
const route = useRoute();
const _this: any = getCurrentInstance();
const API: any = _this.proxy.$API;
const message: any = _this.proxy.$Message;
const commentRef = ref();
const previewRef = ref();
const selectText = ref({ 1: "待审核" });

const dialogTitle = ref("");
const dialogVisible = ref(false);
const isChoose = ref("1");
const store = useStore();
// 表单数据
const formData = ref({ status: 0 });
const formItems = ref([
  {
    label: "订单状态",
    prop: "status",
    type: "select",
    valueKey: "value",
    labelKey: "label",
    options: [
      { label: "全部", value: 0 },
      { label: "待审核", value: 1 },
    ],
  },
  {
    label: "客户姓名",
    prop: "user_name",
    type: "input",
  },
  {
    label: "户名",
    prop: "name",
    type: "input",
  },
  {
    label: "账号",
    prop: "account",
    type: "input",
  },
  {
    label: "起止时间",
    prop: "created_at",
    type: "date-picker",
    attrs: {
      clearable: true,
      valueFormat: "YYYY-MM-DD",
      maxlength: "30",
      type: "daterange",
      "range-separator": "-",
      "start-placeholder": "开始时间",
      "end-placeholder": "结束时间",
    },
  },
]);

const formAttrs = ref({
  "label-width": "80px",
});
const paramsPage = ref({ status: 0 });
const changeModel = (model, value, key) => {
  paramsPage.value = model;
};

const rowsDynamicFormRef = ref();

const getRowKeys = (row) => {
  return row.id;
};
//重置表单
const resetForm = (tag) => {
  if (tag) rowsDynamicFormRef?.value.invokeFormFn("resetFields");
  tableRef.value.refreshTable(tag);
};
const tableRef = ref();
const multipleSelection = ref([]);
const handleSelectionChange = (val) => {
  console.log(val);
  multipleSelection.value = val;
};

// 批量审核
const changeHandle = () => {
  ElMessageBox.confirm("确定要操作吗？", `系统消息`, {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    closeOnClickModal: false,
  })
    .then(() => {
      const arr = multipleSelection.value.map((el) => el.id);
      let params = {
        ids: arr.join(","),
      };
      API.finance.batchWithdraw(params).then((res) => {
        multipleSelection.value = [];
        tableRef.value.clearChoose();
        ElMessage.success("操作成功");
        tableRef.value.refreshTable(false);
      });
    })
    .catch(() => {});
};

// 查询
const searchForm = () => {
  tableRef.value.refreshTable();
};
const tableHeader = reactive([
  {
    label: "",
    colType: "selection",
    fixed: "left",
    "reserve-selection": true,
  },
  {
    label: "ID",
    prop: "id",
  },
  {
    label: "提现金额",
    prop: "money",
    width: "200",
    colType: "column",
  },
  {
    label: "状态",
    prop: "status",
    colType: "column",
  },
  {
    label: "户名",
    prop: "name",
  },
  {
    label: "账号",
    prop: "account",
  },
  {
    label: "申请人姓名",
    prop: "user_name",
  },
  {
    label: "申请时间",
    prop: "created_at",
    width: "170",
  },
  {
    label: "审核人员姓名",
    prop: "check_name",
    width: "130",
  },
  {
    label: "审核时间",
    prop: "check_at",
    width: "170",
  },
]);

const getTableData = (param) => {
  if (param.created_at && param.created_at.length) {
    param.s_time = param.created_at[0];
    param.e_time = param.created_at[1];
  }
  return API.finance.getWithdrawList(param).then((res) => res);
};
const paginationConfig = reactive({});
</script>

<style lang="scss" scoped>
.post-manage {
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
}
</style>
