<template>
  <div class="activity-type">
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
          <el-button type="primary" @click="addType()">新增</el-button>
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
            <el-button type="primary" link @click="editType(scope.row)"
              >编辑</el-button
            >
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
      <div class="dialog-box">
        <el-form
          :rules="rules"
          ref="formRef"
          :model="ruleForm"
          label-width="95px"
        >
          <el-form-item prop="pid" label="父级分类">
            <el-select
              @change="changePid"
              clearable
              v-model="ruleForm.pid"
              placeholder="不填默认顶级分类"
            >
              <el-option
                v-for="(item, index) in typeSel"
                :key="index"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="名称" prop="title">
            <el-input
              v-model.trim="ruleForm.title"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="图片" prop="img_url" v-if="!ruleForm.pid">
            <el-upload
              class="avatar-uploader"
              action="/"
              :limit="1"
              :multiple="false"
              :http-request="uploadFile"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="ruleForm.img_url"
                :src="ruleForm.img_url"
                class="avatar"
              />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item label="是否隐藏" prop="is_hide">
            <el-radio-group v-model="ruleForm.is_hide">
              <el-radio :value="2">显示</el-radio>
              <el-radio :value="1">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input
              v-model.trim="ruleForm.sort"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="是否开启" prop="status">
            <el-select v-model="ruleForm.status" placeholder="请选择">
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="2" />
            </el-select>
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
  pid: "",
  title: "",
  img_url: "",
  is_hide: 2,
  sort: "",
  status: 1,
});
const rules = ref({
  title: [{ required: true, message: "请输入名称", trigger: "blur" }],
  img_url: [{ required: true, message: "请上传图片", trigger: "blur" }],
  is_hide: [{ required: true, message: "请选择", trigger: "change" }],
  status: [{ required: true, message: "请选择", trigger: "change" }],
  sort: [{ required: true, message: "请输入排序", trigger: "blur" }],
});
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
// 上传
const beforeAvatarUpload = (rawFile) => {
  console.log(rawFile);
  if (rawFile.type.indexOf("image/") < 0) {
    ElMessage.error("上传文件格式错误");
    return false;
  }
  return true;
};

const uploadFile = (file) => {
  let formDatas = new FormData();
  formDatas.append("file", file.file);
  API.activity.postFileOss(formDatas).then((res) => {
    console.log(res);
    ruleForm.value.img_url = res.data.value;
    formRef.value.clearValidate("img_url");
  });
};

const changePid = (val) => {
  if (val) {
    ruleForm.value.img_url = "";
  }
};

//重置表单
const resetForm = (tag) => {
  if (tag) rowsDynamicFormRef?.value.invokeFormFn("resetFields");
  getList();
};
const tableRef = ref();
const loading = ref(false);

// 查询
const searchForm = () => {
  getList();
};

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
        pid: ruleForm.value.pid ? ruleForm.value.pid : 0,
      };
      if (dialogTitle.value == "新增") {
        delete params.id;
      }
      API.activity.saveCategory(params).then((res) => {
        console.log(res);
        getList();
        handleClose();
        ElMessage.success("操作成功");
      });
    } else {
      return false;
    }
  });
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

const editType = (row) => {
  getSel();
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
  getSel();
  dialogTitle.value = "新增";
  dialogVisible.value = true;
};
const typeSel = ref([]);
const getSel = () => {
  let params = {
    status: 1,
    only_top: 1,
  };
  API.activity.getCategoryTree(params).then((res) => {
    console.log(res);
    typeSel.value = res.data;
  });
};

onMounted(() => {
  getList();
});
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
