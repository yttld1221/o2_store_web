<!-- 头部 -->
<template>
  <div class="header">
    <div class="title"></div>
    <div>
      <el-popover placement="bottom-start" :width="60" trigger="click">
        <template #reference>
          <div class="userInfo">
            <div class="img">
              <img src="../../assets/login/login.png" alt="userImg" />
            </div>
            <div class="userName">{{ userName }}</div>
            <i class="el-icon-arrow-down"></i>
          </div>
        </template>
        <div class="t-c">
          <el-button type="text" @click="openUpPwd">修改密码</el-button>
        </div>
        <div class="t-c">
          <el-button type="text" @click="signOut">退出登录</el-button>
        </div>
      </el-popover>
    </div>
  </div>
  <!-- 修改密码 -->
  <el-dialog
    :close-on-click-modal="false"
    title="修改密码"
    v-model="upPwd"
    width="30%"
    :before-close="closeUpPwd"
  >
    <el-form label-width="100px" size="small">
      <el-form-item label="原密码：" class="is-required">
        <el-input
          v-model.trim="formData.oldPwd"
          placeholder="请输入原密码"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码：" class="is-required">
        <el-input
          v-model.trim="formData.pwd"
          placeholder="请输入新密码"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码：" class="is-required">
        <el-input
          v-model.trim="formData.confirmPwd"
          placeholder="请输入确认密码"
          show-password
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" @click="closeUpPwd">取 消</el-button>
        <el-button type="primary" size="small" @click="okUpPwd"
          >确 定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { ref, toRefs, reactive, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { HEADER_DATA_TYPE } from '../Interface/header'
import { ANY_OBJ } from '../../common/interface'
export default {
  name: 'Header',
  setup() {
    const _this: any = getCurrentInstance() //获取当前实例
    const API: any = _this.proxy.$API
    const message: any = _this.proxy.$Message //获取提示方法

    const name: any = JSON.parse(localStorage.getItem('bjAdminUser')).staffName
    const userName = ref(name)
    const router: any = useRouter()
    const data: HEADER_DATA_TYPE = reactive({
      upPwd: false, // 修改密码弹框
      //表单数据
      formData: {
        oldPwd: '', //原密码
        pwd: '', //新密码
        confirmPwd: '' //确认密码
      }
    })
    // 退出登录
    function signOut() {
      localStorage.clear()
      router.push({ path: '/login' })
    }

    // 打开修改密码
    function openUpPwd() {
      data.upPwd = true
    }
    // 关闭修改密码
    function closeUpPwd() {
      data.upPwd = false
    }
    // 确定修改密码
    function okUpPwd() {
      if (!data.formData.oldPwd) {
        message('请输入原密码~', 'warning', 2000)
        return false
      }
      if (!data.formData.pwd) {
        message('请输入新密码~', 'warning', 2000)
        return false
      }
      if (!data.formData.confirmPwd) {
        message('请输入确认密码~', 'warning', 2000)
        return false
      }
      if (data.formData.confirmPwd != data.formData.pwd) {
        message('确认密码不正确~', 'warning', 2000)
        return false
      }
      API.admin.upPwd({ ...data.formData }).then((res: ANY_OBJ) => {
        message('操作成功~', 'success', 2000)
        data.upPwd = false
        signOut()
      })
    }
    const refData = toRefs(data)
    return {
      userName,
      ...refData,
      signOut,
      openUpPwd,
      closeUpPwd,
      okUpPwd
    }
  }
}
</script>

<style lang="scss">
.header {
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  box-shadow: 0px 1px 4px 0px #e0dfdf;
  position: relative;
  z-index: 1;

  .title {
    padding-left: 40px;
    font-size: 18px;
    font-weight: 600;
    color: #333;
    letter-spacing: 4px;
  }
  .userInfo {
    display: flex;
    align-items: center;
    padding-right: 40px;
    cursor: pointer;
    .img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .userName {
      min-width: 40px;
      padding: 0 12px;
      font-size: 14px;
    }
  }
}
.t-c {
  text-align: center;
}
</style>
