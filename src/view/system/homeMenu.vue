<template>
  <div class="activity-type">
    <div class="queryModule">
      <queryHeader title="首页菜单管理">
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
          <el-button @click="addType()" type="primary">新增</el-button>
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
        <template v-slot:column|status="scope">
          {{ scope.row.status == 1 ? "启用" : "禁用" }}
        </template>
        <template v-slot:column|img_url="scope">
          <el-image
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
        </template>
      </common-table>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="handleClose"
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      class="dialogContainer"
    >
      <div class="dialog-box">
        <el-form
          :rules="rules"
          ref="formRef"
          :model="ruleForm"
          label-width="120px"
        >
          <el-form-item label="名称" prop="title">
            <el-input
              v-model.trim="ruleForm.title"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="图标" prop="img_url">
            <el-upload
              class="avatar-uploader"
              action="/"
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
          <template v-if="!ruleForm.category_id">
            <el-form-item label="小程序appid" prop="appid">
              <el-input
                v-model.trim="ruleForm.appid"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="跳转路径" prop="path">
              <el-input
                v-model.trim="ruleForm.path"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </template>
          <el-form-item
            v-if="!ruleForm.appid"
            label="跳转活动类别"
            prop="category_id"
          >
            <el-select
              clearable
              v-model="ruleForm.category_id"
              placeholder="请选择"
            >
              <el-option-group
                v-for="group in optionList"
                :key="group.label"
                :label="group.label"
              >
                <el-option
                  v-for="item in group.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input
              v-model.trim="ruleForm.sort"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="启用状态" prop="status">
            <el-select v-model="ruleForm.status" placeholder="请选择">
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              :autosize="{ minRows: 4 }"
              v-model="ruleForm.remark"
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
  title: "",
  img_url: "",
  appid: "",
  path: "",
  status: 1,
  sort: "",
  remark: "",
  category_id: "",
});
const rules = ref({
  title: [{ required: true, message: "请输入名称", trigger: "blur" }],
  appid: [{ required: true, message: "请输入appid", trigger: "blur" }],
  img_url: [{ required: true, message: "请上传图片", trigger: "blur" }],
  category_id: [{ required: true, message: "请选择", trigger: "change" }],
  status: [{ required: true, message: "请选择", trigger: "change" }],
  sort: [{ required: true, message: "请输入排序", trigger: "blur" }],
});
// 表单数据
const formData = ref({ status: 1 });
const formItems = ref([
  {
    label: "名称",
    prop: "title",
    type: "input",
  },
  {
    label: "状态",
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
    label: "图片地址",
    prop: "img_url",
    colType: "column",
    width: "100",
  },
  {
    label: "名称",
    prop: "title",
    width: "100",
  },
  {
    label: "小程序appId",
    prop: "appid",
    width: "150",
  },
  {
    label: "跳转路径",
    prop: "path",
  },
  {
    label: "跳转活动类别",
    prop: "category_title",
    width: "130",
  },
  {
    label: "备注",
    prop: "remark",
  },
  {
    label: "排序",
    prop: "sort",
  },
  {
    label: "状态",
    prop: "status",
    colType: "column",
  },
  {
    label: "添加时间",
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
    label: "更新人",
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
  return API.system.getMenuList(param).then((res) => res);
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
      API.system.saveMenu(params).then((res) => {
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
  dialogTitle.value = "审核";
  dialogVisible.value = true;
  nextTick(() => {
    let rows = JSON.parse(
      JSON.stringify({ ...row, pid: row.pid == 0 ? "" : row.pid })
    );
    delete rows.children;
    ruleForm.value = rows;
  });
};
const optionList = ref([]);
const getSel = () => {
  API.activity.getCategoryTree({ status: 1 }).then((res) => {
    optionList.value = res.data.map((el) => {
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
  });
};

const addType = () => {
  dialogTitle.value = "新增";
  dialogVisible.value = true;
};

onMounted(() => {
  getSel();
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
  :deep(.el-dialog) {
    margin-top: 5vh;
    .el-dialog__body {
      height: 70vh;
      overflow-y: auto;
    }
  }
}
</style>
  