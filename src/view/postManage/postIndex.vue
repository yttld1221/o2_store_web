<template>
  <div class="post-manage">
    <div class="queryModule">
      <queryHeader title="朋友圈管理">
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
            @click="changeHandle('hot')"
            >热门切换</el-button
          >
          <el-button
            :disabled="!multipleSelection.length"
            type="primary"
            @click="changeHandle('on')"
            >上下架切换</el-button
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
        <template v-slot:column|is_on="scope">
          {{ selectText[scope.row.is_on] }}
        </template>
        <template v-slot:column|avatar_url="scope">
          <el-image
            preview-teleported
            style="width: 75px; height: 35px"
            :src="scope.row.avatar_url"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :preview-src-list="[scope.row.avatar_url]"
            :initial-index="0"
            fit="cover"
          />
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
    <comment-dialog @changeList="changeList" ref="commentRef" />
    <preview-image ref="previewRef" />
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
import commentDialog from "./components/commentDialog.vue";
import previewImage from "./components/previewImage.vue";
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
    label: "主题",
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
    label: "是否上架",
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
    prop: "type",
    type: "select",
    valueKey: "value",
    labelKey: "label",
    options: [
      { label: "话题", value: "话题" },
      { label: "组队/搭子", value: "组队/搭子" },
      { label: "分享/安利", value: "分享/安利" },
      { label: "二手闲置", value: "二手闲置" },
      { label: "兼职", value: "兼职" },
      { label: "表白", value: "表白" },
      { label: "求助", value: "求助" },
      { label: "其他", value: "其他" },
    ],
    attrs: {
      clearable: true,
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
    label: "文字内容",
    prop: "title",
    width: "250",
  },
  {
    label: "热门",
    prop: "is_hot",
    colType: "column",
  },
  {
    label: "类型",
    prop: "type",
  },
  {
    label: "发布时间",
    prop: "created_at",
    width: "170",
  },
  {
    label: "点赞数",
    prop: "thumb_num",
  },
  {
    label: "评论数",
    prop: "comment_num",
  },
  {
    label: "发布人昵称",
    prop: "nick_name",
    width: "100",
  },
  {
    label: "发布人头像",
    prop: "avatar_url",
    colType: "column",
    width: "100",
  },
  {
    label: "上架",
    prop: "is_on",
    colType: "column",
  },
  {
    label: "操作",
    colType: "btns",
    width: "170",
    fixed: "right",
    btns: [
      {
        label: "评论管理",
        type: "primary",
        link: true,
        click: (row, rowIndex, btnIndex) => {
          commentRef.value.openDialog(row.id);
        },
      },
      {
        label: "查看图文",
        link: true,
        type: "primary",
        click: (row, rowIndex, btnIndex) => {
          previewRef.value.openDialog(row);
        },
      },
    ],
  },
]);

const getTableData = (param) => {
  return API.post.getMomentsList(param).then((res) => res);
};
const paginationConfig = reactive({});

const handleClose = () => {
  dialogVisible.value = false;
  isChoose.value = "1";
};
const confirmSubmit = async () => {
  const arr = multipleSelection.value.map((el) => el.id);
  let params = {
    moments_ids: arr.join(","),
  };
  let res = "";
  if (dialogTitle.value == "上架下架") {
    params["is_on"] = isChoose.value;
    res = await API.post.setMomentsUpDown(params);
  } else {
    params["is_hot"] = isChoose.value;
    res = await API.post.setMomentsHot(params);
  }
  console.log(res);
  if (res.code == 0) {
    handleClose();
    multipleSelection.value = [];
    tableRef.value.clearChoose();
    ElMessage.success("操作成功");
    tableRef.value.refreshTable(false);
  }
};

const changeList = () => {
  tableRef.value.refreshTable(false);
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

  .dialog-box {
    justify-content: center;
    span {
      margin-right: 16px;
    }
  }
}
</style>
