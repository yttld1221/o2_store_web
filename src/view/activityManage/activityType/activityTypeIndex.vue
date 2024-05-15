<template>
  <div class="post-manage">
    <div class="queryModule">
      <queryHeader title="活动分类管理">
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
          <el-button type="primary">新增</el-button>
        </div>
      </div>
      <el-table :data="tableData" row-key="id" v-loading="loading">
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="title" label="名称" />
        <el-table-column label="图片">
          <template #default="scope">
            <el-image
              v-if="scope.row.img_url"
              preview-teleported
              style="width: 75px; height: 35px"
              :src="scope.row.img_url"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[scope.row.img_url]"
              :initial-index="0"
              fit="cover"
            />
            <span v-else>-</span>
          </template></el-table-column
        >
        <el-table-column prop="sort" label="排序" />
        <el-table-column label="是否隐藏">
          <template #default="scope">
            {{ scope.row.is_hide == 1 ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column label="是否开启">
          <template #default="scope">
            {{ scope.row.status == 1 ? "启用" : "禁用" }}
          </template></el-table-column
        >
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button type="primary" link>编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
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
// 表单数据
const formData = ref({ status: 1, only_top: 0 });
const formItems = ref([
  {
    label: "启用状态",
    prop: "status",
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
    label: "是否顶级分类",
    prop: "only_top",
    type: "select",
    valueKey: "value",
    labelKey: "label",
    options: [
      { label: "全部", value: 0 },
      { label: "是", value: 1 },
    ],
  },
]);

const formAttrs = ref({
  "label-width": "90px",
});
const paramsPage = ref({ status: 1, only_top: 0 });
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
  getList();
};
const tableRef = ref();
const loading = ref(false);

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
  getList();
};

const handleClose = () => {
  dialogVisible.value = false;
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
const getList = () => {
  let params = {
    status: paramsPage.value.status,
    only_top: paramsPage.value.only_top,
  };
  API.activity.getCategoryTree(params).then((res) => {
    console.log(res);
    tableData.value = res.data;
  });
};

onMounted(() => {
  getList();
});
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
