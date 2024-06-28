<template>
  <div class="activity-list">
    <div class="queryModule">
      <queryHeader title="活动管理">
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
          <el-button type="primary" @click="addActivity()">新增活动</el-button>
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
          <el-button type="primary" link @click="editForm(scope.row.id, '编辑')"
            >编辑</el-button
          >
          <el-button type="primary" link @click="editForm(scope.row.id, '查看')"
            >查看</el-button
          >
          <el-button
            @click="handleClick(scope.row, 'on', 1)"
            v-if="scope.row.is_on == 2"
            type="success"
            link
            >上架</el-button
          >
          <el-button
            @click="handleClick(scope.row, 'on', 2)"
            v-else
            type="danger"
            link
            >下架</el-button
          >
          <el-button
            @click="handleClick(scope.row, 'hot', 1)"
            v-if="scope.row.is_hot == 2"
            type="success"
            link
            >开启热门</el-button
          >
          <el-button
            @click="handleClick(scope.row, 'hot', 2)"
            v-else
            type="danger"
            link
            >关闭热门</el-button
          >

          <el-button
            @click="handleClick(scope.row, 'del', 1)"
            v-if="scope.row.is_on == 2"
            type="danger"
            link
            >删除</el-button
          >
        </template>
        <template v-slot:column|check_status="scope">
          {{ statusText[scope.row.check_status] }}
        </template>
      </common-table>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="handleClose"
      v-model="dialogVisible"
      :title="dialogTitle"
      width="400px"
      class="dialogContainer"
    >
      <div class="dialog-box flex-align">
        <span>是否{{ dialogTitle == "热门切换" ? "热门" : "上架" }}</span>
        <el-radio-group v-model="isChoose">
          <el-radio value="1" size="large">是</el-radio>
          <el-radio value="2" size="large">否</el-radio>
        </el-radio-group>
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
    <activityListDialog @resetTable="resetForm" ref="dialogDetail" />
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
import activityListDialog from "./components/activityListDialog.vue";
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
const paramsPage = ref({  });
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

// 热门or上下架
const changeHandle = (type) => {
  if (type == "on") {
    dialogTitle.value = "上架下架";
  } else {
    dialogTitle.value = "热门切换";
  }
  dialogVisible.value = true;
};

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
    width: "270",
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
  return API.activity.getTaskList(param).then((res) => res);
};
const paginationConfig = reactive({});

const handleClose = () => {
  dialogVisible.value = false;
  isChoose.value = "1";
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

const changeList = () => {
  tableRef.value.refreshTable(false);
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
