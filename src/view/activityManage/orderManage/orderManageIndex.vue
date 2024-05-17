<template>
  <div class="post-manage">
    <div class="queryModule">
      <queryHeader title="订单管理">
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
          <el-button :disabled="!multipleSelection.length" type="primary"
            >批量结算</el-button
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
        <template v-slot:column|status="scope">
          {{ selectText[scope.row.status] }}
        </template>
        <template v-slot:column|settlement_status="scope">
          {{ scope.row.settlement_status == 1 ? "已结算" : "未结算" }}
        </template>
        <template v-slot:column|pay_time="scope">{{
          showVal(scope.row.pay_time)
        }}</template>
        <template v-slot:column|check_at="scope">{{
          showVal(scope.row.check_at)
        }}</template>
        <template v-slot:column|settlement_at="scope">{{
          showVal(scope.row.settlement_at)
        }}</template>
        <template v-slot:column|check_name="scope">{{
          showVal(scope.row.check_name)
        }}</template>
        <template v-slot:column|settlement_name="scope">{{
          showVal(scope.row.settlement_name)
        }}</template>
        <template v-slot:column|fixbtn="scope">
          <el-button type="primary" link @click="editForm(scope.row.id, '查看')"
            >查看</el-button
          >
          <el-button
            type="primary"
            v-if="
              [2, 5].includes(scope.row.status) && scope.row.is_delivery == 1
            "
            link
            @click="editForm(scope.row.id, '编辑')"
            >发货</el-button
          >
        </template>
      </common-table>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="handleClose"
      v-model="dialogVisible"
      title="查看详情"
      width="500px"
      class="dialogContainer"
    >
      <div class="dialog-box flex-align">
        <el-form
          :rules="rules"
          ref="formRef"
          :model="ruleForm"
          label-width="130px"
        >
          <el-form-item label="ID">
            {{ ruleForm.id }}
          </el-form-item>
          <el-form-item label="订单状态">{{
            ruleForm.status ? selectText[ruleForm.status] : "-"
          }}</el-form-item>
          <el-form-item label="结算状态">{{
            ruleForm.settlement_status == 1 ? "已结算" : "未结算"
          }}</el-form-item>
          <el-form-item label="支付时间">{{
            showVal(ruleForm.pay_time)
          }}</el-form-item>
          <el-form-item label="订单总金额">{{
            showVal(ruleForm.total_fee)
          }}</el-form-item>
          <el-form-item label="核销时间">{{
            showVal(ruleForm.check_at)
          }}</el-form-item>
          <el-form-item label="实际支付金额">{{
            showVal(ruleForm.actual_fee)
          }}</el-form-item>
          <el-form-item label="抵扣金额">{{
            showVal(ruleForm.deduction_fee)
          }}</el-form-item>
          <el-form-item label="购买数量">{{
            showVal(ruleForm.num)
          }}</el-form-item>
          <el-form-item label="下单时间">{{
            showVal(ruleForm.created_at)
          }}</el-form-item>
          <el-form-item label="客户姓名">{{
            showVal(ruleForm.user_name)
          }}</el-form-item>
          <el-form-item label="产品名称">{{
            showVal(ruleForm.title)
          }}</el-form-item>
          <el-form-item label="商户名称">{{
            showVal(ruleForm.merchant)
          }}</el-form-item>
          <el-form-item label="核销人员姓名">{{
            showVal(ruleForm.check_name)
          }}</el-form-item>
          <el-form-item label="结算人员姓名">{{
            showVal(ruleForm.settlement_name)
          }}</el-form-item>
        </el-form>
      </div>
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
const ruleForm = ref({});
const selectText = ref({
  1: "待支付",
  2: "待发货",
  3: "待评价",
  4: "已取消",
  5: "待收货",
  6: "已完成",
});

const dialogVisible = ref(false);
const store = useStore();
// 表单数据
const formData = ref({ status: 0, settlement_status: 0 });
const formItems = ref([
  {
    label: "订单状态",
    prop: "status",
    type: "select",
    valueKey: "value",
    labelKey: "label",
    options: [
      { label: "全部", value: 0 },
      { label: "已支付", value: 2 },
      { label: "已核销", value: 3 },
    ],
  },
  {
    label: "结算状态",
    prop: "settlement_status",
    type: "select",
    valueKey: "value",
    labelKey: "label",
    options: [
      { label: "全部", value: 0 },
      { label: "已结算", value: 1 },
      { label: "未结算", value: 2 },
    ],
  },
  {
    label: "客户姓名",
    prop: "user_name",
    type: "input",
  },
  {
    label: "产品名称",
    prop: "product_name",
    type: "input",
  },
  {
    label: "商户名称",
    prop: "merchant",
    type: "input",
  },
  {
    label: "开始时间",
    prop: "s_time",
    type: "date-picker",
    attrs: {
      clearable: true,
      valueFormat: "YYYY-MM-DD HH:mm:ss",
      type: "datetime",
      placeholder: "请选择日期及时间",
    },
  },
  {
    label: "截止时间",
    prop: "e_time",
    type: "date-picker",
    attrs: {
      clearable: true,
      valueFormat: "YYYY-MM-DD HH:mm:ss",
      type: "datetime",
      placeholder: "请选择日期及时间",
    },
  },
]);

const formAttrs = ref({
  "label-width": "80px",
});
const paramsPage = ref({ pageSize: 20 });
const changeModel = (model, value, key) => {
  paramsPage.value = model;
};

const showVal = (val) => {
  return val ? val : "-";
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
    label: "产品名称",
    prop: "title",
    width: "200",
  },
  {
    label: "订单总金额",
    prop: "total_fee",
    width: "120",
  },
  {
    label: "实际支付金额",
    prop: "actual_fee",
    width: "120",
  },
  {
    label: "抵扣金额",
    prop: "deduction_fee",
  },
  {
    label: "购买数量",
    prop: "num",
  },
  {
    label: "订单状态",
    prop: "status",
    colType: "column",
  },
  {
    label: "结算状态",
    prop: "settlement_status",
    colType: "column",
  },
  {
    label: "下单时间",
    prop: "created_at",
    width: "170",
  },
  {
    label: "支付时间",
    prop: "pay_time",
    width: "170",
    colType: "column",
  },
  {
    label: "核销时间",
    prop: "check_at",
    width: "170",
    colType: "column",
  },
  {
    label: "结算时间",
    prop: "settlement_at",
    width: "170",
    colType: "column",
  },
  {
    label: "商户名称",
    prop: "merchant",
  },
  {
    label: "客户姓名",
    prop: "user_name",
  },
  {
    label: "核销人员姓名",
    prop: "check_name",
    colType: "column",
    width: "170",
  },
  {
    label: "结算人员姓名",
    prop: "settlement_name",
    colType: "column",
    width: "170",
  },
  {
    label: "操作",
    colType: "column",
    width: "120",
    prop: "fixbtn",
    fixed: "right",
  },
]);

const getTableData = (param) => {
  return API.activity.getOrderList(param).then((res) => res);
};
const paginationConfig = reactive({});

const handleClose = () => {
  dialogVisible.value = false;
};
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
  :deep(.el-dialog__body) {
    height: 60vh;
    overflow-y: auto;
  }
  .dialog-box {
    width: 100%;
  }
}
</style>
