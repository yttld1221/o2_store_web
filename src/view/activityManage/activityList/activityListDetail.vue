<template>
  <div class="activity-detail">
    <queryHeader :title="title"
      ><template #queryBtns>
        <el-button @click="goback()">返回</el-button>
        <el-button type="primary" @click="confirmSubmit">保存</el-button>
      </template></queryHeader
    >
    <div class="form-box">
      <el-form
        :rules="rules"
        ref="formRef"
        :model="ruleForm"
        label-width="120px"
      >
        <div class="form-item-box flex-align">
          <el-form-item label="活动主题" prop="title">
            <el-input
              v-model.trim="ruleForm.title"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="活动描述" prop="description">
            <el-input
              v-model.trim="ruleForm.description"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </div>
        <div class="form-item-box flex-align">
          <el-form-item label="上架" prop="is_on">
            <el-select v-model="ruleForm.is_on" placeholder="请选择">
              <el-option label="是" :value="1" />
              <el-option label="否" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="类型" prop="category_id">
            <el-select v-model="ruleForm.category_id" placeholder="请选择">
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
        </div>
        <div class="form-item-box flex-align">
          <el-form-item label="客服消息" prop="open_msg_service">
            <el-select v-model="ruleForm.open_msg_service" placeholder="请选择">
              <el-option label="开启" :value="1" />
              <el-option label="关闭" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="最低会员等级" prop="buy_level">
            <el-select v-model="ruleForm.buy_level" placeholder="请选择">
              <el-option label="游客" :value="0" />
              <el-option label="普通会员" :value="1" />
              <el-option label="认证vip会员" :value="2" />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="封面配图" prop="img_url">
          <uoloadFile
            :limit="10"
            :list="ruleForm.img_url"
            @uploadChange="(el) => uploadChange(el, 'img_url')"
          />
        </el-form-item>
        <div class="form-item-box flex-align">
          <el-form-item label="是否商品" prop="is_product">
            <el-radio-group v-model="ruleForm.is_product">
              <el-radio :value="1">是</el-radio>
              <el-radio :value="2">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="ruleForm.is_product == 1"
            label="自动核销"
            prop="is_auto_check"
          >
            <el-radio-group v-model="ruleForm.is_auto_check">
              <el-radio :value="1">是</el-radio>
              <el-radio :value="2">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="form-item-box flex-align">
          <el-form-item label="商家" prop="shop_id">
            <el-select v-model="ruleForm.shop_id" placeholder="请选择">
              <el-option
                :key="index"
                v-for="(item, index) in sjSel"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :style="{ visibility: ruleForm.is_product == 1 ? '' : 'hidden' }"
            label="进价"
            prop="in_price"
          >
            <el-input-number
              style="width: 100%"
              controls-position="right"
              :min="0"
              v-model="ruleForm.in_price"
              :precision="2"
            />
          </el-form-item>
        </div>
        <template v-if="ruleForm.is_product == 1">
          <div class="form-item-box flex-align">
            <el-form-item label="原价" prop="original_price">
              <el-input-number
                style="width: 100%"
                controls-position="right"
                :min="0"
                v-model="ruleForm.original_price"
                :precision="2"
              />
            </el-form-item>
            <el-form-item label="销售价" prop="sale_price">
              <el-input-number
                style="width: 100%"
                controls-position="right"
                :min="0"
                v-model="ruleForm.sale_price"
                :precision="2"
              />
            </el-form-item>
          </div>
          <div class="form-item-box flex-align">
            <el-form-item label="父级提成金额" prop="parent_ratio">
              <el-input-number
                style="width: 100%"
                controls-position="right"
                :min="0"
                v-model="ruleForm.parent_ratio"
                :precision="2"
              />
            </el-form-item>
            <el-form-item label="爷级提成金额" prop="grandpa_ratio">
              <el-input-number
                style="width: 100%"
                controls-position="right"
                :min="0"
                v-model="ruleForm.grandpa_ratio"
                :precision="2"
              />
            </el-form-item>
          </div>
        </template>
        <div class="form-item-box flex-align">
          <el-form-item label="开始时间" prop="begin_time">
            <el-date-picker
              style="width: 100%"
              v-model="ruleForm.begin_time"
              type="datetime"
              placeholder="请选择日期及时间"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="结束时间" prop="end_time"
            ><el-date-picker
              style="width: 100%"
              v-model="ruleForm.end_time"
              type="datetime"
              placeholder="请选择日期及时间"
              value-format="YYYY-MM-DD HH:mm:ss"
          /></el-form-item>
        </div>
        <div class="form-item-box flex-align">
          <el-form-item label="热门" prop="is_hot">
            <el-select v-model="ruleForm.is_hot" placeholder="请选择">
              <el-option label="是" :value="1" />
              <el-option label="否" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="活动举办地" prop="addr">
            <el-input
              v-model.trim="ruleForm.addr"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item label="活动详情" prop="content_html">
          <uoloadFile
            :limit="1000"
            :list="ruleForm.content_html"
            @uploadChange="(el) => uploadChange(el, 'content_html')"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts" setup name="activityListDetail">
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
import queryHeader from "@/components/queryHeader.vue";
import uoloadFile from "@/components/uoloadFile.vue";
const router = useRouter();
const route = useRoute();
const _this: any = getCurrentInstance();
const API: any = _this.proxy.$API;
const message: any = _this.proxy.$Message;
const title = ref("新增");
const goback = () => {
  router.go(-1);
};
const ruleForm = ref({
  begin_time: "",
  end_time: "",
  description: "",
  is_on: 1,
  original_price: "",
  in_price: "",
  sale_price: "",
  parent_ratio: "",
  grandpa_ratio: "",
  is_hot: "",
  content_html: "",
  is_product: "",
  category_id: "",
  open_msg_service: 1,
  addr: "",
  shop_id: "",
  setting_id: 0,
  pid: "",
  title: "",
  img_url: "",
  buy_level: 2,
});
const rules = ref({
  title: [{ required: true, message: "请输入名称", trigger: "blur" }],
  description: [{ required: true, message: "请输入活动描述", trigger: "blur" }],
  img_url: [{ required: true, message: "请上传图片", trigger: "blur" }],
  content_html: [{ required: true, message: "请上传图片", trigger: "blur" }],
  is_on: [{ required: true, message: "请选择", trigger: "change" }],
  is_product: [{ required: true, message: "请选择", trigger: "change" }],
  is_auto_check: [{ required: true, message: "请选择", trigger: "change" }],
  category_id: [{ required: true, message: "请选择类型", trigger: "change" }],
  buy_level: [
    { required: true, message: "请选择参与的最低会员等级", trigger: "change" },
  ],
  original_price: [{ required: true, message: "请输入原价", trigger: "blur" }],
  in_price: [{ required: true, message: "请输入进价", trigger: "blur" }],
  sale_price: [{ required: true, message: "请输入销售价", trigger: "blur" }],
  parent_ratio: [
    { required: true, message: "请输入父级提成金额", trigger: "blur" },
  ],
  grandpa_ratio: [
    { required: true, message: "请输入爷级提成金额", trigger: "blur" },
  ],
  begin_time: [
    { required: true, message: "请选择开始时间", trigger: "change" },
  ],
  end_time: [{ required: true, message: "请选择结束时间", trigger: "change" }],
});

const formRef = ref();
const optionList = ref([]);
const sjSel = ref([]);

const confirmSubmit = async () => {
  console.log(ruleForm.value);
  formRef.value.validate(async (valid) => {
    if (valid) {
      let params = {
        ...ruleForm.value,
      };
      if (!route.query.id) {
        delete params.id;
      }
      API.activity.saveTask(params).then((res) => {
        console.log(res);
        goback();
        ElMessage.success("操作成功");
      });
    } else {
      return false;
    }
  });
};

const uploadChange = (arr, key) => {
  ruleForm.value[key] = arr;
};

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
  API.activity
    .getShopList({ status: 1, page: 1, pagesize: 1000 })
    .then((res) => {
      sjSel.value = res.data.map((el) => {
        return {
          label: el.merchant,
          value: el.id,
        };
      });
    });
};

onMounted(() => {
  getSel();
});
</script>

<style lang="scss" scoped>
.activity-detail {
  .form-box {
    padding: 15px 20px;
  }
  .form-item-box {
    .el-form-item {
      flex: 1;
    }
  }
  .flex-align {
    display: flex;
    align-items: center;
  }
}
</style>
