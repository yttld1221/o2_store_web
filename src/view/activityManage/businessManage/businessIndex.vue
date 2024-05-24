<template>
  <div class="activity-type">
    <div class="queryModule">
      <queryHeader title="商家管理">
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
      <common-table
        ref="tableRef"
        :tableHeader="tableHeader"
        :loading="true"
        :queryParams="paramsPage"
        :ajaxGetData="getTableData"
        :paginationConfig="paginationConfig"
      >
        <template v-slot:column|addr="scope">
          {{ scope.row.area_code ? getAddr(scope.row.area_code) : "-" }}
        </template>
        <template v-slot:column|phone="scope">
          {{ showVal(scope.row.phone) }}
        </template>
        <template v-slot:column|person="scope">
          {{ showVal(scope.row.person) }}
        </template>
        <template v-slot:column|remark="scope">
          {{ showVal(scope.row.remark) }}
        </template>
        <template v-slot:column|status="scope">
          {{
            scope.row.status == 1
              ? "启用"
              : scope.row.status == 3
              ? "待审核"
              : "禁用"
          }}
        </template>
        <template v-slot:column|apply_id_card1="scope">
          <el-image
            v-if="scope.row.status == 1"
            preview-teleported
            style="width: 75px; height: 35px"
            :src="scope.row.apply_id_card1"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :preview-src-list="[scope.row.apply_id_card1]"
            :initial-index="0"
            fit="cover"
          />
          <span v-else>-</span>
        </template>
        <template v-slot:column|apply_id_card2="scope">
          <el-image
            v-if="scope.row.status == 1"
            preview-teleported
            style="width: 75px; height: 35px"
            :src="scope.row.apply_id_card2"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :preview-src-list="[scope.row.apply_id_card2]"
            :initial-index="0"
            fit="cover"
          />
          <span v-else>-</span>
        </template>
        <template v-slot:column|business_license="scope">
          <el-image
            v-if="scope.row.status == 1"
            preview-teleported
            style="width: 75px; height: 35px"
            :src="scope.row.business_license"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :preview-src-list="[scope.row.business_license]"
            :initial-index="0"
            fit="cover"
          />
          <span v-else>-</span>
        </template>
      </common-table>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="handleClose"
      v-model="dialogVisible"
      :title="dialogTitle"
      width="35%"
      class="dialogContainer"
    >
      <div class="dialog-box">
        <el-form
          :rules="rules"
          ref="formRef"
          :model="ruleForm"
          label-width="120px"
        >
          <el-form-item label="商户名称" prop="merchant">
            {{ ruleForm.merchant }}
          </el-form-item>
          <el-form-item label="开放区域" prop="addr">
            {{ getAddr(ruleForm.area_code) }}
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            {{ ruleForm.phone }}
          </el-form-item>
          <el-form-item label="联系人" prop="person">
            {{ ruleForm.person }}
          </el-form-item>
          <el-form-item label="身份证头像面" prop="apply_id_card1">
            <el-image
              preview-teleported
              style="width: 120px; height: 80px"
              :src="ruleForm.apply_id_card1"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[ruleForm.apply_id_card1]"
              :initial-index="0"
              fit="cover"
            />
          </el-form-item>
          <el-form-item label="身份证国徽面" prop="apply_id_card2">
            <el-image
              preview-teleported
              style="width: 120px; height: 80px"
              :src="ruleForm.apply_id_card2"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[ruleForm.apply_id_card2]"
              :initial-index="0"
              fit="cover"
            />
          </el-form-item>
          <el-form-item label="营业执照" prop="business_license">
            <el-image
              preview-teleported
              style="width: 120px; height: 80px"
              :src="ruleForm.business_license"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[ruleForm.business_license]"
              :initial-index="0"
              fit="cover"
            />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            {{ ruleForm.remark }}
          </el-form-item>
          <el-form-item label="审核结果" prop="status">
            <el-radio-group v-model="ruleForm.status">
              <el-radio :value="1">同意</el-radio>
              <el-radio :value="2">拒绝</el-radio>
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
          <el-button type="primary" @click="confirmSubmit()" class="confirmBtn"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup name="postIndex">
import { addressList } from "../activityList/components/cityData.js";
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
  merchant: "",
  addr: "",
  person: "",
  phone: "",
  remark: "",
  status: 1,
});
const rules = ref({
  check_remark: [
    { required: true, message: "请输入审核意见", trigger: "blur" },
  ],
  status: [{ required: true, message: "请选择", trigger: "change" }],
});
// 表单数据
const formData = ref({ status: 1 });
const formItems = ref([
  {
    label: "商户名称",
    prop: "merchant",
    type: "input",
  },
  {
    label: "联系电话",
    prop: "phone",
    type: "input",
  },
  {
    label: "联系人",
    prop: "person",
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
      { label: "待审核", value: 3 },
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

const showVal = (val) => {
  return val ? val : "-";
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
    label: "商户名称",
    prop: "merchant",
    width: "200",
  },
  {
    label: "开放区域",
    prop: "addr",
    width: "130",
    colType: "column",
  },
  {
    label: "联系电话",
    prop: "phone",
    colType: "column",
    width: "150",
  },
  {
    label: "联系人",
    prop: "person",
    colType: "column",
  },
  {
    label: "状态",
    prop: "status",
    colType: "column",
  },
  {
    label: "身份证头像面",
    prop: "apply_id_card1",
    colType: "column",
    width: "150",
  },
  {
    label: "身份证国徽面",
    prop: "apply_id_card2",
    colType: "column",
    width: "150",
  },
  {
    label: "营业执照",
    prop: "business_license",
    colType: "column",
    width: "150",
  },
  {
    label: "备注信息",
    prop: "remark",
    width: "200",
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
  // {
  //   label: "创建人",
  //   prop: "create_name",
  // },
  // {
  //   label: "修改人",
  //   prop: "update_name",
  // },
  {
    label: "操作",
    colType: "btns",
    width: "100",
    fixed: "right",
    btns: [
      {
        label: "审核",
        type: "primary",
        link: true,
        click: (row, rowIndex, btnIndex) => {
          dialogTitle.value = "审核";
          dialogVisible.value = true;
          API.activity.getShopInfo({ id: row.id }).then((res) => {
            nextTick(() => {
              ruleForm.value = JSON.parse(
                JSON.stringify({ ...res.data, status: 1, check_remark: "" })
              );
            });
          });
        },
      },
    ],
  },
]);

const getTableData = (param) => {
  return API.activity.getShopList(param).then((res) => res);
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
      API.activity.checkShop(params).then((res) => {
        console.log(res);
        resetForm(false);
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

const getAddr = (code) => {
  let text = "";
  areaSel.value.forEach((el) => {
    el.children.forEach((item) => {
      if (item.value == code) {
        text = el.label + item.label;
      }
    });
  });
  return text;
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
