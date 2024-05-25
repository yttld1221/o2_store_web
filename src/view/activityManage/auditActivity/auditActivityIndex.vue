<template>
  <div class="activity-list">
    <div class="queryModule">
      <queryHeader title="分部活动审核">
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
            @click="changeHandle('批量审核')"
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
        <template v-slot:column|is_hot="scope">
          {{ selectText[scope.row.is_hot] }}
        </template>
        <template v-slot:column|is_product="scope">
          {{ selectText[scope.row.is_product] }}
        </template>
        <template v-slot:column|is_auto_check="scope">
          {{ scope.row.is_auto_check == 1 ? "是" : "否" }}
        </template>
        <template v-slot:column|open_msg_service="scope">
          {{ scope.row.open_msg_service == 1 ? "是" : "否" }}
        </template>
        <template v-slot:column|is_on="scope">
          {{ selectText[scope.row.is_on] }}
        </template>
        <template v-slot:column|buy_level="scope">
          {{ levelText[scope.row.buy_level] }}
        </template>
        <template v-slot:column|img_url="scope">
          <el-image
            preview-teleported
            style="width: 75px; height: 35px"
            :src="getUrl(scope.row.img_url, 'a')"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :preview-src-list="getUrl(scope.row.img_url, 'all')"
            :initial-index="0"
            fit="cover"
          />
        </template>
        <template v-slot:column|fixbtn="scope">
          <el-button type="primary" link @click="editForm(scope.row.id, '查看')"
            >查看</el-button
          >
          <el-button
            v-if="scope.row.check_status == 3"
            type="primary"
            link
            @click="changeHandle('审核', scope.row.id)"
            >审核</el-button
          >
        </template>
        <template v-slot:column|check_status="scope">
          {{ statusText[scope.row.check_status] }}
        </template>
      </common-table>
    </div>
    <auditActivityDialog @resetTable="resetForm" ref="dialogDetail" />
    <el-dialog
      :close-on-click-modal="false"
      :before-close="handleClose"
      v-model="dialogVisible"
      :title="dialogTitle"
      width="450px"
      class="dialogContainer"
    >
      <div class="dialog-box">
        <el-form
          :rules="rules"
          ref="formRef"
          :model="ruleForm"
          label-width="100px"
          ><el-form-item label="审核结果" prop="check_status">
            <el-radio-group v-model="ruleForm.check_status">
              <el-radio :value="4">同意</el-radio>
              <el-radio :value="5">拒绝</el-radio>
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
<script lang="ts" setup name="activityListIndex">
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
import auditActivityDialog from "./components/auditActivityDialog.vue";
import rowsDynamicForm from "@/components/dynamicForm/rowsDynamicForm.vue";
const router = useRouter();
const route = useRoute();
const _this: any = getCurrentInstance();
const API: any = _this.proxy.$API;
const message: any = _this.proxy.$Message;
const commentRef = ref();
const previewRef = ref();
const selectText = ref({ 1: "是", 2: "否" });
const statusText = ref({
  1: "无需审核",
  2: "草稿",
  3: "待审核",
  4: "通过",
  5: "不通过",
});
const levelText = ref({
  1: "普通会员",
  2: "认证vip会员",
  0: "游客",
});
const ruleForm = ref({
  task_ids: "",
  check_status: 4,
  check_remark: "",
});
const rules = ref({
  check_remark: [
    { required: true, message: "请输入审核意见", trigger: "blur" },
  ],
  check_status: [{ required: true, message: "请选择", trigger: "change" }],
});
const dialogTitle = ref("");
const dialogVisible = ref(false);
const isChoose = ref("1");
const store = useStore();
// 表单数据
const formData = ref({});
const formItems = ref([
  {
    label: "活动标题",
    prop: "title",
    type: "input",
  },
  {
    label: "是否热门",
    prop: "is_hot",
    type: "select",
    valueKey: "value",
    labelKey: "label",
    options: [
      { label: "不限", value: 0 },
      { label: "是", value: 1 },
      { label: "否", value: 2 },
    ],
  },
  {
    label: "是否上线",
    prop: "is_on",
    type: "select",
    valueKey: "value",
    labelKey: "label",
    options: [
      { label: "不限", value: 0 },
      { label: "是", value: 1 },
      { label: "否", value: 2 },
    ],
  },
  {
    label: "类型",
    prop: "category_id",
    type: "select",
    valueKey: "value",
    labelKey: "label",
    options: [],
    isGroup: true,
    attrs: {
      clearable: true,
    },
  },
  {
    label: "是否商品",
    prop: "is_product",
    type: "select",
    valueKey: "value",
    labelKey: "label",
    options: [
      { label: "不限", value: 0 },
      { label: "是", value: 1 },
      { label: "否", value: 2 },
    ],
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
  {
    label: "商家",
    prop: "shop_id",
    type: "select",
    valueKey: "value",
    labelKey: "label",
    options: [],
    attrs: {
      clearable: true,
    },
  },
]);

const getUrl = (url, type) => {
  if (url) {
    if (type == "a") {
      return url.split(",")[0];
    } else {
      return url.split(",");
    }
  }
};

const formAttrs = ref({
  "label-width": "80px",
});
const paramsPage = ref({ pageSize: 20 });
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

const changeHandle = (type, id = "") => {
  dialogTitle.value = type;
  if (id) {
    ruleForm.value.task_ids = id + "";
  }
  dialogVisible.value = true;
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
    label: "活动主题",
    prop: "title",
    width: "250",
  },
  {
    label: "类型",
    prop: "category_title",
  },
  {
    label: "审核状态",
    prop: "check_status",
    colType: "column",
  },
  {
    label: "参与最低会员等级",
    prop: "buy_level",
    colType: "column",
    width: "150",
  },
  {
    label: "活动描述",
    prop: "description",
    width: "200",
  },
  {
    label: "封面配图",
    prop: "img_url",
    colType: "column",
    width: "100",
  },
  {
    label: "开始时间",
    prop: "begin_time",
    width: "170",
  },
  {
    label: "结束时间",
    prop: "end_time",
    width: "170",
  },
  {
    label: "热门",
    prop: "is_hot",
    colType: "column",
  },
  {
    label: "上线",
    prop: "is_on",
    colType: "column",
  },
  {
    label: "新建时间",
    prop: "created_at",
    width: "170",
  },
  {
    label: "更新时间",
    prop: "updated_at",
    width: "170",
  },
  {
    label: "是否商品",
    prop: "is_product",
    colType: "column",
  },
  {
    label: "自动核销",
    prop: "is_auto_check",
    colType: "column",
  },
  {
    label: "客服消息",
    prop: "open_msg_service",
    colType: "column",
  },
  {
    label: "商户",
    prop: "merchant",
  },
  {
    label: "进价",
    prop: "in_price",
  },
  {
    label: "原价",
    prop: "original_price",
  },
  {
    label: "零售价",
    prop: "sale_price",
  },
  {
    label: "父级提成金额",
    prop: "parent_ratio",
  },
  {
    label: "爷爷级提成金额",
    prop: "grandpa_ratio",
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
    colType: "column",
    prop: "fixbtn",
    width: "130",
    fixed: "right",
  },
]);

const getTableData = (param) => {
  let arr = ["created_at"];
  arr.forEach((el) => {
    if (param[el]) {
      param[el] = param[el].join(",");
    }
  });
  return API.activity.getTaskListForCheck(param).then((res) => res);
};
const paginationConfig = reactive({});
const formRef = ref();

const confirmSubmit = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      let params = {
        ...ruleForm.value,
      };
      if (dialogTitle.value == "批量审核") {
        params.task_ids = multipleSelection.value.map((el) => el.id).join(",");
      }
      await API.activity.checkTask(params).then((res) => {
        console.log(res);
        resetForm(false);
        multipleSelection.value = [];
        tableRef.value.clearChoose();
        handleClose();
        ElMessage.success("操作成功");
      });
    } else {
      return false;
    }
  });
};
const handleClose = () => {
  dialogVisible.value = false;
  nextTick(() => {
    formRef.value.resetFields();
  });
};
const handleClick = (row, key, val) => {
  ElMessageBox.confirm("确定要操作吗？", `系统消息`, {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    closeOnClickModal: false,
  })
    .then(async () => {
      let res = "";
      let param = {
        task_ids: row.id + "",
      };
      if (key == "on") {
        param["is_on"] = val;
        res = await API.activity.setTaskUpDown(param);
      } else if (key == "del") {
        res = await API.activity.setTaskDel(param);
      } else {
        param["is_hot"] = val;
        res = await API.activity.setTaskHot(param);
      }
      console.log(res);
      if (res.code == 0) {
        ElMessage.success("操作成功");
        tableRef.value.refreshTable(false);
      }
    })
    .catch(() => {});
};

const getSel = () => {
  API.activity.getCategoryTree({ status: 1 }).then((res) => {
    formItems.value[3].options = res.data.map((el) => {
      return {
        label: el.title,
        options: !el.children
          ? []
          : el.children.map((item) => {
              return {
                label: item.title,
                value: item.id,
              };
            }),
      };
    });
    console.log(formItems.value[3].options);
  });
  API.activity
    .getShopList({ status: 1, page: 1, pagesize: 1000 })
    .then((res) => {
      formItems.value[6].options = res.data.map((el) => {
        return {
          label: el.merchant,
          value: el.id,
        };
      });
    });
};
const dialogDetail = ref();

const editForm = (id, title) => {
  dialogDetail.value.handleOpen(title, id);
};

const addActivity = () => {
  // router.push({
  //   name: "activityListDetail",
  // });
  dialogDetail.value.handleOpen("新增");
};
onMounted(() => {
  getSel();
});
</script>

<style lang="scss" scoped>
.activity-list {
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
