<template>
  <div class="personal-info">
    <queryHeader title="修改密码"> </queryHeader>
    <div class="content-box">
      <el-form
        :rules="rules"
        ref="formRef"
        :model="ruleForm"
        label-width="120px"
      >
        <el-form-item label="原密码" prop="pwd">
          <el-input
            show-password
            placeholder="请输入原密码"
            v-model.trim="ruleForm.pwd"
            type="password"
          />
        </el-form-item>
        <el-form-item label="新密码" prop="new_pwd1">
          <el-input
            show-password
            placeholder="请输入新密码"
            v-model.trim="ruleForm.new_pwd1"
            type="password"
          />
        </el-form-item>
        <el-form-item label="重复新密码" prop="new_pwd2">
          <el-input
            show-password
            placeholder="请再次输入新密码"
            v-model.trim="ruleForm.new_pwd2"
            type="password"
          />
        </el-form-item>
      </el-form>
      <div class="btn-box">
        <el-button @click="confirmSubmit" type="primary">提交</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, getCurrentInstance, ref, nextTick } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import queryHeader from "@/components/queryHeader.vue";
const router = useRouter();
const _this: any = getCurrentInstance();
const API: any = _this.proxy.$API;
const message: any = _this.proxy.$Message;
const formRef = ref(null);
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入新密码"));
  } else {
    if (ruleForm.value.new_pwd2) {
      if (!formRef.value) return;
      formRef.value.validateField("new_pwd2");
    }
    callback();
  }
};
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请再次输入新密码"));
  } else if (value !== ruleForm.value.new_pwd1) {
    callback(new Error("两次输入密码不相同"));
  } else {
    callback();
  }
};
const ruleForm = ref({
  pwd: "",
  new_pwd1: "",
  new_pwd2: "",
});
const rules = ref({
  pwd: [{ required: true, message: "请输入原密码", trigger: "blur" }],
  new_pwd1: [{ required: true, validator: validatePass, trigger: "blur" }],
  new_pwd2: [{ required: true, validator: validatePass2, trigger: "blur" }],
});

const confirmSubmit = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      let params = {
        ...ruleForm.value,
      };
      API.login.editPwd(params).then((res) => {
        console.log(res);
        API.login.logOut({}).then((res) => {
          localStorage.removeItem("token");
          ElMessage.success("操作成功");
          router.push("/login");
        });
      });
    } else {
      return false;
    }
  });
};
</script>
 
<style lang = "scss" scoped>
.personal-info {
  overflow: hidden;
  box-sizing: border-box;
  .content-box {
    padding: 20px;
    .btn-box {
      margin-top: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>