<template>
  <div class="post-manage">
    <div class="queryModule">
      <queryHeader title="订单列表">
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
      <!-- <div class="btnsContainer">
        <div class="btns left">
          <el-button
            @click="Settlement()"
            :disabled="!multipleSelection.length"
            type="primary"
            >批量结算</el-button
          >
        </div>
      </div> -->
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
        <template v-slot:column|refund_id="scope">{{
          scope.row.refund_id > 0 ? "是" : "否"
        }}</template>
        <template v-slot:column|refund_check_status="scope">{{
          checkStatus[scope.row.refund_check_status]
        }}</template>
        <template v-slot:column|refund_at="scope">{{
          showVal(scope.row.refund_at)
        }}</template>
        <template v-slot:column|refund_check_at="scope">{{
          showVal(scope.row.refund_check_at)
        }}</template>
        <template v-slot:column|fixbtn="scope">
          <el-button
            type="primary"
            link
            @click="dataHandle(scope.row, '查看详情')"
            >查看</el-button
          >
          <el-button
            type="primary"
            v-if="
              [2].includes(scope.row.status) &&
              scope.row.is_delivery == 1 &&
              (!scope.row.refund_id ||
                (scope.row.refund_id > 0 && scope.row.refund_check_status == 3))
            "
            link
            @click="dataHandle(scope.row, '发货')"
            >发货</el-button
          >
          <el-button
            type="primary"
            v-else-if="
              [5].includes(scope.row.status) &&
              scope.row.is_delivery == 1 &&
              (!scope.row.refund_id ||
                (scope.row.refund_id > 0 && scope.row.refund_check_status == 3))
            "
            link
            @click="cancelFh(scope.row)"
            >取消发货</el-button
          >
          <!-- <el-button
            type="primary"
            v-else-if="
              scope.row.refund_id > 0 && scope.row.refund_check_status == 1
            "
            link
            @click="dataHandle(scope.row, '退款审核')"
            >退款审核</el-button
          > -->
        </template>
      </common-table>
    </div>
    <el-dialog
      :class="{ 'add-form': dialogTitle != '查看详情' }"
      :close-on-click-modal="false"
      :before-close="handleClose"
      v-model="dialogVisible"
      :title="dialogTitle"
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
          <template v-if="dialogTitle == '查看详情'">
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
             <el-form-item label="快递公司">{{
              ruleForm.deliver_company
                ? getKdName(ruleForm.deliver_company)
                : "-"
            }}</el-form-item>
            <el-form-item label="快递单号">{{
              showVal(ruleForm.deliver_no)
            }}</el-form-item>
            <el-form-item label="发货时间">{{
              showVal(ruleForm.deliver_at)
            }}</el-form-item>
          </template>
          <template v-else-if="dialogTitle == '发货'">
            <el-form-item label="快递公司名称" prop="deliver_company">
              <el-select
                v-model="ruleForm.deliver_company"
                placeholder="请选择"
              >
                <el-option
                  :label="item.name"
                  :value="item.name + '-' + item.code"
                  v-for="(item, index) in kdList"
                  :key="index"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="快递单号" prop="deliver_no">
              <el-form-item
                class="no-item"
                :prop="'deliver_no.' + index + '.noId'"
                v-for="(item, index) in ruleForm.deliver_no"
                :rules="rules.noId"
                :key="index"
              >
                <div style="width: 100%" class="flex-align">
                  <el-input
                    style="width: 100%"
                    placeholder="请输入"
                    v-model="item.noId"
                  ></el-input>
                  <el-icon
                    style="margin-left: 12px"
                    color="#F56C6C"
                    @click="removeKd(index)"
                    v-if="ruleForm.deliver_no.length > 1"
                    ><Remove
                  /></el-icon>
                </div>
              </el-form-item>
              <el-button type="primary" @click="addNo()"
                >添加快递单号</el-button
              >
            </el-form-item>
          </template>
          <template v-else-if="dialogTitle == '退款审核' && ruleForm.refund_id">
            <el-form-item label="退款申请时间">{{
              ruleForm.updated_at
            }}</el-form-item>
            <el-form-item label="退款申请金额"
              >￥{{ ruleForm.money }}</el-form-item
            >
            <el-form-item label="退款原因">
              <div class="refund-reason">
                <div>{{ showVal(ruleForm.remark) }}</div>
                <div class="file-list" v-if="ruleForm.refund_img_url.length">
                  <template v-for="(item, index) in ruleForm.refund_img_url">
                    <el-image
                      :key="index"
                      v-if="getType(item)"
                      preview-teleported
                      style="width: 80px; height: 80px"
                      :src="item"
                      :zoom-rate="1.2"
                      :max-scale="7"
                      :min-scale="0.2"
                      :preview-src-list="[item]"
                      :initial-index="0"
                      fit="cover"
                    />
                    <img
                      @click="perwVideo(item)"
                      style="width: 80px; height: 80px"
                      v-else
                      src="@/assets/img/icon-video.png"
                      alt=""
                    />
                  </template>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="审核结果" prop="status">
              <el-radio-group v-model="ruleForm.status">
                <el-radio :value="2">同意</el-radio>
                <el-radio :value="3">拒绝</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="审核意见" prop="check_remark">
              <el-input
                :autosize="{ minRows: 4 }"
                v-model="ruleForm.check_remark"
                style="width: 100%"
                type="textarea"
                placeholder="请输入"
              />
            </el-form-item>
          </template>
        </el-form>
      </div>
      <template #footer v-if="dialogTitle != '查看详情'">
        <span class="dialogFooter">
          <el-button @click="handleClose" class="cancelBtn">取消</el-button>
          <el-button type="primary" @click="confirmSubmit" class="confirmBtn"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
    <dialogVideo ref="dialogVideoRef" />
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
import dialogVideo from "@/components/dialogVideo.vue";
import lineRadius from "@/components/lineRadius.vue";
import { kdList } from "@/view/activityManage/orderManage/kuaidi.js";
import rowsDynamicForm from "@/components/dynamicForm/rowsDynamicForm.vue";
const router = useRouter();
const route = useRoute();
const _this: any = getCurrentInstance();
const API: any = _this.proxy.$API;
const message: any = _this.proxy.$Message;
const ruleForm = ref({
  order_id: "",
  deliver_company: "",
  deliver_no: [{ noId: "" }],
});
const rules = ref({
  deliver_no: [
    {
      type: "array",
      required: true,
      message: "请添加快递单号",
      trigger: "change",
    },
  ],
  status: [{ required: true, message: "请选择", trigger: "change" }],
  deliver_company: [{ required: true, message: "请选择", trigger: "change" }],
  noId: [{ required: true, message: "请输入快递单号", trigger: "blur" }],
});
const selectText = ref({
  1: "待支付",
  2: "待发货",
  3: "待评价",
  4: "已取消",
  5: "待收货",
  6: "已完成",
});
const checkStatus = ref({
  1: "待审核",
  2: "退款通过",
  3: "退款拒绝",
  0: "-",
});

const dialogVisible = ref(false);
const dialogTitle = ref("");
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
    label: "是否退款",
    prop: "is_refund",
    type: "select",
    valueKey: "value",
    labelKey: "label",
    options: [
      { label: "全部", value: 0 },
      { label: "是", value: 1 },
      { label: "否", value: 2 },
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

const getType = (url) => {
  let fileType = url.substring(url.lastIndexOf(".") + 1).toLowerCase();
  return ["jpg", "jpeg", "png"].includes(fileType);
};

const formAttrs = ref({
  "label-width": "80px",
});
const paramsPage = ref({  });
const changeModel = (model, value, key) => {
  paramsPage.value = model;
};

// 删除快递
const removeKd = (index) => {
  ruleForm.value.deliver_no.splice(index, 1);
};

const addNo = () => {
  ruleForm.value.deliver_no.push({ noId: "" });
};

const dataHandle = (row, title) => {
  dialogVisible.value = true;
  dialogTitle.value = title;
  if (title == "发货") {
    ruleForm.value.order_id = row.id;
  } else if (title == "退款审核") {
    getRefund(row.refund_id);
  } else {
    nextTick(() => {
      ruleForm.value = JSON.parse(JSON.stringify(row));
    });
  }
};

const getRefund = (refund_id) => {
  API.activity.getRefundInfo({ refund_id }).then((res) => {
    ruleForm.value = {
      refund_id,
      updated_at: res.data.updated_at,
      money: res.data.money,
      refund_img_url: res.data.refund_img_url
        ? res.data.refund_img_url.split(",")
        : [],
      remark: res.data.remark,
      status: 2,
      check_remark: "",
    };
  });
};

const getKdName = (name) => {
  if (name) {
    return name.split("-")[0];
  }
};

const showVal = (val) => {
  return val ? val : "-";
};
const dialogVideoRef = ref();
// 预览
const perwVideo = (url) => {
  console.log(111);
  dialogVideoRef.value.open(url);
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

const cancelFh = (row) => {
  ElMessageBox.confirm("确定要操作吗？", `系统消息`, {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    closeOnClickModal: false,
  })
    .then(() => {
      API.merchant.cancelDeliveryForChild({ order_id: row.id }).then((res) => {
        resetForm(false);
        handleClose();
        ElMessage.success("操作成功");
      });
    })
    .catch(() => {});
};

const Settlement = () => {
  let tag = multipleSelection.value.every((el) => el.status == 3);
  if (!tag) {
    ElMessage.error("存在不符合订单");
    return;
  }
  API.activity
    .batchSettlementOrder({
      ids: multipleSelection.value.map((el) => el.id).join(","),
    })
    .then((res) => {
      resetForm(false);
      multipleSelection.value = [];
      tableRef.value.clearChoose();
      ElMessage.success("操作成功");
    });
};

// 查询
const searchForm = () => {
  tableRef.value.refreshTable();
};
const tableHeader = reactive([
  // {
  //   label: "",
  //   colType: "selection",
  //   fixed: "left",
  //   "reserve-selection": true,
  // },
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
    label: "是否退款",
    prop: "refund_id",
    colType: "column",
  },
  {
    label: "退款审核状态",
    prop: "refund_check_status",
    colType: "column",
    width: "150",
  },
  {
    label: "退款申请时间",
    prop: "refund_at",
    colType: "column",
    width: "170",
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
    label: "退款审核时间",
    prop: "refund_check_at",
    colType: "column",
    width: "170",
  },
  {
    label: "操作",
    colType: "column",
    width: "150",
    prop: "fixbtn",
    fixed: "right",
  },
]);

const getTableData = (param) => {
  return API.merchant.getOrderListForChild(param).then((res) => res);
};
const paginationConfig = reactive({});
const formRef = ref();

const confirmSubmit = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      let res = "";
      let params = {
        ...ruleForm.value,
        deliver_no: "",
      };
      if (dialogTitle.value == "发货") {
        params.deliver_no = ruleForm.value.deliver_no
          .map((el) => el.noId)
          .join(",");
        res = await API.merchant.deliveryForChild(params);
      } else {
        res = await API.activity.refundCheck(params);
      }
      if (res.code == 0) {
        console.log(res);
        resetForm(false);
        handleClose();
        ElMessage.success("操作成功");
      }
    } else {
      return false;
    }
  });
};
const handleClose = () => {
  dialogVisible.value = false;
  nextTick(() => {
    formRef.value.resetFields();
    ruleForm.value.refund_id = "";
  });
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
  :deep(.add-form) {
    .el-dialog__body {
      height: auto;
    }
  }
  .dialog-box {
    width: 100%;
  }
  .el-form {
    width: 100%;
  }
  .no-item {
    width: 100%;
    margin-bottom: 18px;
  }
  .refund-reason {
    display: flex;
    flex-direction: column;
    .file-list {
      display: flex;
      .el-image,
      img {
        margin-right: 8px;
      }
    }
  }
}
</style>
