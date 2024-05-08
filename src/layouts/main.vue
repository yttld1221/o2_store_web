<!-- 主体 -->
<template>
  <div class="framework">
    <!-- menu左侧菜单 -->
    <el-container>
      <div class="side-bar">
        <div class="logo-box">
          <img src="@/assets/img/login-logo.png" />
          校园氧气仓库
        </div>
        <div class="menu-box">
          <el-menu :default-active="active" :router="true">
            <template v-for="item in sideList">
              <el-sub-menu
                v-if="item.childNode && item.childNode.length"
                :key="item.path"
                :index="item.path"
              >
                <template #title>
                  <div v-if="item.icon" class="svgicons">
                    <svg-icon :icon-class="item.icon" />
                  </div>
                  <span class="icon-txt">{{ item.label }}</span>
                </template>
                <el-menu-item-group
                  v-for="val in item.childNode"
                  :key="val.path"
                >
                  <el-menu-item :index="val.path" class="icon-txt">{{
                    val.label
                  }}</el-menu-item>
                </el-menu-item-group>
              </el-sub-menu>
              <el-menu-item
                v-else
                :key="item.path"
                :index="item.path"
                @click="funGo(item.path)"
              >
                <template #title>
                  <div v-if="item.icon" class="svgicons">
                    <svg-icon :icon-class="item.icon" />
                  </div>
                  <span class="icon-txt">{{ item.label }}</span>
                </template>
              </el-menu-item>
            </template>
          </el-menu>
        </div>
      </div>

      <el-main>
        <div class="container-right">
          <el-header>
            <div class="page-header">
              <!-- 面包屑 -->
              <div class="head-left">
                <!-- <Crumbs></Crumbs> -->
              </div>
              <div class="header-right">
                <img
                  style="margin-right: 9px; width: 24px; height: 24px"
                  src="@/assets/img/icon-user.png"
                  alt=""
                />
                <span>{{ userInfo.name }}</span>
                <div @click="toExit" class="exit-box flex-align">
                  <img
                    style="margin-right: 6px; width: 16px; height: 16px"
                    src="@/assets/img/icon-exit.png"
                    alt=""
                  />
                  退出
                </div>
              </div>
            </div>
          </el-header>
          <div class="content-box" style="flex: 1">
            <!-- content页面内容 -->
            <div class="content">
              <div style="overflow-x: hidden" class="pagec">
                <router-view v-slot="{ Component }">
                  <transition name="fade-transform" mode="out-in">
                    <keep-alive :include="includeList">
                      <component :is="Component" />
                    </keep-alive>
                  </transition>
                </router-view>
              </div>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import svgIcon from "@/icons/component/svgIcon.vue";
import {
  computed,
  reactive,
  toRefs,
  ref,
  onMounted,
  getCurrentInstance,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessageBox } from "element-plus";
import { getIncludeList } from "@/utils/utils";
import "./Interface/main";
import Crumbs from "@/layouts/components/crumbs.vue";
export default {
  name: "Main",
  components: {
    Crumbs,
    svgIcon,
  },
  setup() {
    const _this = getCurrentInstance();
    const API = _this.proxy.$API;
    const data = reactive({
      router: useRouter(),
      route: useRoute(),
      menuList: [], //菜单列表
      includeList: getIncludeList(),
      userInfo: JSON.parse(localStorage.getItem("userInfo")) || {},
      pageTitle: "",
      active: "",
    });
    const key = computed(() => {
      return data.route.path + Math.random();
    });
    const sideList = computed(() => {
      let name = "/" + data.route.path.split("/")[1];
      let arr = data.route.path.split("/");
      if (arr[arr.length - 1].includes("Detail")) {
        arr.splice(arr.length - 1, 1);
      }
      if ([].includes(arr[arr.length - 1])) {
        arr.splice(arr.length - 1, 1);
        arr.push("list");
      }
      if (["classInfo"].includes(arr[arr.length - 1])) {
        arr.splice(arr.length - 1, 1);
        arr.push("index");
      }
      //console.log(arr);
      data.active = arr.join("/");
      //console.log(data.active);
      return data.menuList;
    });
    onMounted(() => {
      data.menuList = [
        {
          label: "欢迎",
          path: "/home",
          childNode: [],
          icon: "",
        },
        {
          label: "朋友圈管理",
          path: "/postManage/list",
          childNode: [],
          icon: "",
        },
        {
          label: "小程序用户管理",
          path: "/wechatUser/list",
          childNode: [],
          icon: "",
        },
      ];
    });
    function funGo(path) {
      data.router.push(path);
    }
    // 退出
    function toExit() {
      ElMessageBox.confirm("确认退出系统？", "退出", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        closeOnClickModal: false,
      })
        .then(() => {
          API.login.logOut({}).then((res) => {
            localStorage.removeItem("token");
            data.router.push("/login");
          });
        })
        .catch(() => {});
    }
    // 返回数据
    return {
      key,
      sideList,
      funGo,
      toExit,
      ...toRefs(data),
    };
  },
};
</script>

<style lang="scss" scoped>
.framework {
  height: 100vh;
  background: #f4f7fa;
  .el-header {
    background-color: #ffffff;
    color: #333;
    line-height: 60px;
    padding: 0;
  }
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
    padding: 0 20px;
    font-size: 14px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    color: #333333;
    .head-left {
      display: flex;
      align-items: center;
    }
    .header-right {
      display: flex;
      align-items: center;
    }
  }
  .el-aside {
    color: #ffffff;
    height: 100%;
  }
  .el-container {
    height: 100%;
    overflow: hidden;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 213px;
    min-height: 400px;
  }
}
.userinfo-text {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.85);
}
.user {
  display: flex;
  align-items: center;

  .btn-user {
    width: 25px;
    height: 25px;
    background: url("../assets/img/icon-user.png") 0 0 no-repeat;
    background-size: cover;
    cursor: pointer;
  }
  .btn-logout {
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    margin-left: 4px;
    cursor: pointer;
  }
}
.content-box {
  width: calc(100vw - 200px);
}
.content {
  width: 100%;
  overflow-y: auto;
  position: relative;
  padding: 20px;
  background-color: #f4f7fa;
  .homePage {
    height: calc(100vh - 60px);
  }
  .pagec {
    height: calc(100vh - 100px);
    background: #ffffff;
    border-radius: 4px;
    overflow-y: auto;
    width: 100%;
    position: relative;
  }
}
/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.4s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.el-main {
  padding: 0;
  display: flex;
}

.side-bar {
  height: 100%;
  background: #fff;
  width: 200px;
  box-sizing: border-box;
  .page-title {
    padding: 16px 40px;
    font-size: 16px;
    color: #000;
    font-weight: bold;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  }
  .logo-box {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 600;
    img {
      width: 28px;
      height: 28px;
      margin-right: 8px;
    }
  }
  .menu-box {
    padding: 20px 8px 0;
    height: calc(100% - 60px);
    overflow: auto;
    box-sizing: border-box;
  }
  &:deep(.menu-box > .el-menu) {
    overflow: hidden;
    & > li {
      margin-bottom: 10px;
    }
    border-right: none;
    .el-menu-item-group__title {
      padding: 0;
    }
    .el-menu-item {
      height: 42px;
      display: flex;
      align-items: center;
      border-radius: 6px;
      color: #4d5b80;
      padding-left: 40px !important;
    }
    .svgicons {
      position: absolute;
      margin-left: -27px;
    }
    .el-sub-menu {
      .el-sub-menu__icon-arrow {
        right: 10px;
      }
      .el-sub-menu__title {
        line-height: 42px;
        border-radius: 6px;
        height: 42px;
        display: flex;
        position: relative;
        align-items: center;
        padding-left: 40px !important;
        color: #4d5b80;
      }
      .el-menu-item {
        min-width: auto;
        margin-top: 8px;
        color: #4d5b80;
      }
    }
    .el-sub-menu.is-active {
      .el-sub-menu__title {
        font-size: 14px;
        font-family: PingFangSC-Semibold, PingFang SC;
        // font-weight: 600;
        // color: #386df7;
        // background: rgba(56, 109, 247, 0.12);
        border-radius: 6px;
      }
      .el-menu-item.is-active {
        background: #386df7;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
      }
    }
    & > .el-menu-item.is-active {
      background: rgba(56, 109, 247, 0.12);
      font-size: 14px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #386df7;
      border-radius: 6px;
    }
    & > .el-menu-item {
      line-height: 42px;
      position: relative;
      &:hover {
        border-radius: 6px;
        background: #e3ecff;
      }
    }
    & > .el-menu-item.is-active {
      &:hover {
        border-radius: 6px;
        background: rgba(56, 109, 247, 0.12);
        font-size: 14px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #386df7;
      }
    }
    .el-sub-menu {
      .el-menu-item {
        background: white;
      }
      .el-sub-menu__title,
      .el-menu-item {
        &:hover {
          border-radius: 6px;
          background: #e3ecff;
        }
      }
    }
    .el-sub-menu.is-active {
      .el-sub-menu__title {
        &:hover {
          font-size: 14px;
          font-family: PingFangSC-Semibold, PingFang SC;
          // font-weight: 600;
          // color: #386df7;
          border-radius: 6px;
          // background: rgba(56, 109, 247, 0.12);
          background: #e3ecff;
        }
      }
    }
    // 一级选中时效果
    & > .el-menu-item.is-active {
      background: #386df7;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      &:hover {
        background: #386df7;
        color: #ffffff;
        font-weight: 400;
      }
    }
  }
}
.container-right {
  display: flex;
  flex-direction: column;
}
@keyframes sidedown {
  0% {
    height: 0;
  }
  100% {
    height: 100%;
  }
}
.flex-align {
  display: flex;
  align-items: center;
}
.exit-box {
  cursor: pointer;
  margin-left: 20px;
}

.svg-icon {
  margin-top: -4px;
}
.icon-txt {
  margin-left: 8px;
}
</style>
