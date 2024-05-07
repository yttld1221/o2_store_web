<template>
  <div class="login">
    <div class="login-title">
      <img class="logo" src="@/assets/img/login-logo.png" alt="" />
      校园氧气仓库
    </div>
    <div class="login-desc">校园氧气仓库后台管理系统</div>
    <div class="form-box">
      <el-tabs v-model="activeName">
        <el-tab-pane label="账户密码登录" name="0"></el-tab-pane>
      </el-tabs>
      <el-form ref="formRef" :model="ruleForm" :rules="rules" label-width="0px">
        <el-form-item prop="phone" label="">
          <el-input
            clearable
            size="large"
            :maxlength="11"
            v-model.trim="ruleForm.phone"
            placeholder="请输入手机号"
          >
            <template #prefix>
              <img class="icon-size" src="@/assets/img/icon-phone.png" alt="" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="pwd" label="">
          <el-input
            size="large"
            type="password"
            show-password
            v-model.trim="ruleForm.pwd"
            placeholder="请输入密码"
          >
            <template #prefix>
              <img
                class="icon-size"
                src="@/assets/img/icon-password.png"
                alt=""
              />
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <el-checkbox v-model="autoLogin" label="记住密码" size="large" />
      <Debounce :time="1000" :immediate="true" events="Click">
        <el-button
          class="login-btn"
          size="large"
          type="primary"
          @click="goIndex"
          >登录</el-button
        >
      </Debounce>
    </div>
    <footer class="login-footer">2024 校园氧气仓库出品</footer>
  </div>
</template>
<script setup>
import { onMounted, getCurrentInstance, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
const _this = getCurrentInstance();
const API = _this.proxy.$API;
const router = useRouter();
const activeName = ref("0");
const formRef = ref();
const ruleForm = ref({ phone: "", pwd: "" });
const autoLogin = ref(false);
const rules = reactive({
  phone: [
    {
      required: true,
      message: "请输入手机号",
      trigger: "blur",
    },
  ],
  pwd: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
  ],
});
onMounted(() => {
  const rememberInfo = JSON.parse(localStorage.getItem("loginData"));
  if (rememberInfo?.autoLogin) {
    autoLogin.value = rememberInfo.autoLogin;
    ruleForm.value = { ...rememberInfo };
  }
});

// 登录
const goIndex = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      let params = {
        ...ruleForm.value,
      };
      API.login.login(params).then((res) => {
        console.log(res);
        localStorage.setItem("token", res.data.token);
        if (autoLogin.value) {
          params = { ...params, autoLogin: autoLogin.value };
          localStorage.setItem("loginData", JSON.stringify(params));
        }
        getUserInfo();
      });
    }
  });
};

// 获取用户信息
const getUserInfo = () => {
  API.login.getAdminInfo({}).then((res) => {
    console.log(res);
    localStorage.setItem("userInfo", JSON.stringify(res.data.admin));
    router.push("/home");
  });
};
</script>
<style lang='scss' scoped>
.login {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url("../../assets/img/login-bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  height: 100vh;
  padding: 56px 24px 24px;
  .login-title {
    width: 100%;
    position: relative;
    inset-block-start: 2px;
    font-weight: 600;
    font-size: 33px;
    display: flex;
    align-items: center;
    justify-content: center;
    .logo {
      width: 44px;
      height: 44px;
      margin-right: 16px;
    }
  }
  .login-desc {
    width: 100%;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    text-align: center;
    margin: 12px 0 40px;
  }
  .form-box {
    width: 328px;
    .icon-size {
      width: 14px;
      height: 14px;
    }
  }
  .login-footer {
    position: fixed;
    width: 100%;
    bottom: 24px;
    text-align: center;
  }
  .login-btn {
    width: 100%;
    border-radius: 10px;
    margin-top: 20px;
  }
  :deep(.el-tabs--top) {
    .el-tabs__nav-scroll {
      display: flex;
      justify-content: center;
    }
    .el-tabs__active-bar {
      height: 2.5px;
    }
    .el-tabs__nav-wrap::after {
      height: 1px;
    }
  }
  :deep(.el-form-item) {
    margin-bottom: 20px;
  }
  :deep(.el-input__wrapper) {
    border-radius: 10px;
  }
}
</style>
