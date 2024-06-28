<template>
  <div class="activity-type">
    <div class="queryModule">
      <queryHeader title="学校">
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
      width="50%"
      class="dialogContainer"
    >
      <div class="dialog-box">
        <el-form
          :rules="rules"
          ref="formRef"
          :model="ruleForm"
          label-width="120px"
        >
          <el-form-item label="名称" prop="name">
            <el-input
              v-model.trim="ruleForm.name"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="学校地址" prop="addr">
            <el-input
              v-model.trim="ruleForm.addr"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="abc分类" prop="abc">
            <el-input
              v-model.trim="ruleForm.abc"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="学校所在地" prop="area_code">
            <el-cascader
              v-model="ruleForm.area_code"
              style="width: 100%"
              :options="areaSel"
              clearable
              :show-all-levels="false"
            />
          </el-form-item>
          <el-form-item label="启用状态" prop="status">
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
import { addressList } from "../activityManage/activityList/components/cityData.js";
import { validateBigEnglish } from "@/utils/validate";
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
  name: "",
  addr: "",
  abc: "",
  status: 1,
  area_code: "",
});
const rules = ref({
  name: [{ required: true, message: "请输入学校名称", trigger: "blur" }],
  addr: [{ required: true, message: "请输入学校地址", trigger: "blur" }],
  abc: [
    { required: true, message: "请输入abc分类", trigger: "blur" },
    {
      validator: validateBigEnglish,
      trigger: "blur",
    },
  ],
  status: [{ required: true, message: "请选择", trigger: "change" }],
  area_code: [
    { required: true, message: "请选择学校所在地", trigger: "change" },
  ],
});
// 表单数据
const formData = ref({ status: 1 });
const formItems = ref([
  {
    label: "名称",
    prop: "name",
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
const paramsPage = ref({ status: 1 });
const changeModel = (model, value, key) => {
  console.log(model, value, key);
  paramsPage.value = model;
};

const rowsDynamicFormRef = ref();

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
    label: "名称",
    prop: "name",
    width: "200",
  },
  {
    label: "学校地址",
    prop: "addr",
    width: "200",
  },
  {
    label: "abc分类",
    prop: "abc",
  },
  {
    label: "状态",
    prop: "status",
    colType: "column",
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
            let info = JSON.parse(JSON.stringify(row));
            ruleForm.value = {
              ...info,
            };
          });
        },
      },
    ],
  },
]);

const getTableData = (param) => {
  return API.school.getSchoolList(param).then((res) => res);
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
      let area_code =
        typeof ruleForm.value.area_code === "string"
          ? ruleForm.value.area_code
          : ruleForm.value.area_code[1];
      let params = {
        ...ruleForm.value,
        area_code,
      };
      API.school.saveSchool(params).then((res) => {
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

const addType = () => {
  dialogTitle.value = "新增";
  dialogVisible.value = true;
};

const areaSel = ref([]);

const getArea = () => {
  areaSel.value = [];
  addressList.forEach((el) => {
    areaSel.value.push({
      value: el.code,
      label: el.name,
      children: el.children.map((item) => {
        return {
          value: item.code + "00",
          label: item.name,
        };
      }),
    });
  });
};
onMounted(() => {
  getArea();
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
}
</style>
  