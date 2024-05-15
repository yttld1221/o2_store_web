<template>
  <div class="wechat-user">
    <div class="queryModule">
      <queryHeader title="小程序用户管理">
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
          <el-button type="primary" @click="exportFile()">导出 Excel</el-button>
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
      >
        <template v-slot:column|level="scope">
          {{
            scope.row.level == 1
              ? "普通会员"
              : scope.row.level == 2
              ? "vip会员"
              : "游客"
          }}
        </template>
        <template v-slot:column|allow_publish="scope">
          {{ selectText[scope.row.allow_publish] }}
        </template>
        <template v-slot:column|pid="scope">
          {{ scope.row.pid ? "是" : "否" }}
        </template>
        <template v-slot:column|is_buy_vip="scope">
          {{ selectText[scope.row.is_buy_vip] }}
        </template>
      </common-table>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="handleClose"
      v-model="dialogVisible"
      title="积分抵扣登记"
      width="400px"
      class="dialogContainer"
    >
      <div class="dialog-box"></div>
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
<script lang="ts" setup name="wechatUserIndex">
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
const commentRef = ref();
const previewRef = ref();
const selectText = ref({ 1: "是", 2: "否" });

const dialogTitle = ref("");
const dialogVisible = ref(false);
const isChoose = ref("1");
const store = useStore();
// 表单数据
const formData = ref({});
const formItems = ref([
  {
    label: "用户姓名",
    prop: "name",
    type: "input",
  },
  {
    label: "用户手机",
    prop: "phone",
    type: "input",
  },
  {
    label: "微信昵称",
    prop: "name",
    type: "input",
  },
  {
    label: "会员类型",
    prop: "level",
    type: "select",
    valueKey: "value",
    labelKey: "label",
    options: [
      { label: "全部", value: 0 },
      { label: "普通会员", value: 1 },
      { label: "vip会员", value: 2 },
      { label: "游客", value: 3 },
    ],
  },
  {
    label: "审核处理状态",
    prop: "verify_status",
    type: "select",
    valueKey: "value",
    labelKey: "label",
    options: [
      { label: "全部", value: 0 },
      { label: "待审核", value: 1 },
      { label: "审核通过", value: 2 },
      { label: "不通过", value: 3 },
      { label: "无需处理", value: 4 },
    ],
  },
  {
    label: "性别",
    prop: "type",
    type: "select",
    valueKey: "value",
    labelKey: "label",
    options: [
      { label: "全部", value: "" },
      { label: "男", value: "男" },
      { label: "女", value: "女" },
    ],
  },
  {
    label: "所在学校",
    prop: "school_id",
    type: "select",
    valueKey: "value",
    labelKey: "label",
    options: [],
    attrs: {
      filterable: true,
      clearable: true,
    },
  },
  {
    label: "是否分享",
    prop: "is_intro",
    type: "select",
    valueKey: "value",
    labelKey: "label",
    options: [
      { label: "是", value: 1 },
      { label: "否", value: 2 },
    ],
    attrs: {
      clearable: true,
    },
  },
  {
    label: "首次登入系统",
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
    label: "注册起止时间",
    prop: "logon_time",
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
    label: "vip购买时间",
    prop: "buy_vip_at",
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
    label: "毕业起止时间",
    prop: "grad_date",
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
  "label-width": "90px",
});
const paramsPage = ref({ pageSize: 20 });
const changeModel = (model, value, key) => {
  paramsPage.value = model;
};

const rowsDynamicFormRef = ref();
//重置表单
const resetForm = (tag) => {
  if (tag) rowsDynamicFormRef?.value.invokeFormFn("resetFields");
  tableRef.value.refreshTable(tag);
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
    label: "姓名",
    prop: "name",
  },
  {
    label: "手机",
    prop: "phone",
    width: "120",
  },
  {
    label: "微信昵称",
    prop: "nick_name",
  },
  {
    label: "会员类型",
    prop: "level",
    colType: "column",
  },
  {
    label: "性别",
    prop: "sex",
  },
  {
    label: "出生年月",
    prop: "birthday",
  },
  {
    label: "所在学校",
    prop: "school_name",
  },
  {
    label: "专业",
    prop: "specialty",
  },
  {
    label: "账户余额",
    prop: "money",
  },
  {
    label: "允许发布朋友圈",
    prop: "allow_publish",
    colType: "column",
    width: "130",
  },
  {
    label: "通过分享注册",
    prop: "pid",
    colType: "column",
    width: "120",
  },
  {
    label: "注册用户时间",
    prop: "logon_time",
    width: "170",
  },
  {
    label: "购买vip",
    prop: "is_buy_vip",
    colType: "column",
  },
  {
    label: "购买vip时间",
    prop: "buy_vip_at",
    width: "170",
  },
  {
    label: "vip到期时间",
    prop: "vip_expire_at",
    width: "170",
  },
  {
    label: "毕业时间",
    prop: "grad_date",
    width: "140",
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
    label: "操作",
    colType: "btns",
    width: "170",
    fixed: "right",
    btns: [
      {
        label: "积分抵扣",
        type: "primary",
        link: true,
        click: (row, rowIndex, btnIndex) => {},
      },
      {
        label: "开启发布",
        link: true,
        type: "primary",
        click: (row, rowIndex, btnIndex) => {},
      },
    ],
  },
]);

const exportParam = ref({});
const getTableData = (param) => {
  let arr = ["grad_date", "logon_time", "created_at", "buy_vip_at"];
  arr.forEach((el) => {
    if (param[el]) {
      param[el] = param[el].join(",");
    }
  });
  exportParam.value = param;
  return API.wechat.getUserList(param).then((res) => res);
};

const exportFile = () => {
  API.wechat.getUserListXlsx(exportParam.value).then((res) => {
    console.log(res);
    window.open("https://api2.allinnb.com" + res.data.uri, "_blank");
  });
};

const paginationConfig = reactive({});

const handleClose = () => {
  dialogVisible.value = false;
};
const confirmSubmit = async () => {};

const getSchoolSel = () => {
  API.wechat.getAllSchool({ status: 1 }).then((res) => {
    console.log(res);
    formItems.value[6].options = res.data.map((el) => {
      return {
        label: el.name,
        value: el.id,
      };
    });
  });
};
onMounted(() => {
  getSchoolSel();
});
</script>

<style lang="scss" scoped>
.wechat-user {
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
  :deep(.el-date-editor--daterange) {
    .el-range-input {
      font-size: 12px;
    }
  }
}
</style>
