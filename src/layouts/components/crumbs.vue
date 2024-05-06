<!-- 面包屑 -->
<template>
  <div class="crumbs">
    <div class="align-center" v-if="children.length">
      <template v-for="(item, index) in children" :key="item">
        <span class="align-center">
          <el-icon
            style="margin: 0 4px"
            v-if="index != 0 && index != children.length - 1"
            ><ArrowRightBold
          /></el-icon>
          <el-icon
            color="rgba(0,0,0,0.85)"
            style="margin: 0 4px"
            v-if="index != 0 && index === children.length - 1"
            ><ArrowRightBold
          /></el-icon>
          <span class="ove" v-if="index == 0 && children.length > 1">{{
            item.title
          }}</span>
          <span
            @click="toGo(item.title)"
            class="ove"
            v-if="index != children.length - 1 && index != 0"
            >{{ item.title }}</span
          >
          <span v-if="index === children.length - 1" class="ove bu">{{
            item.title
          }}</span>
        </span>
      </template>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { reactive, onMounted, toRefs, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// import { useStore } from "vuex";
export default {
  name: 'Crumbs',
  setup(props) {
    const data = reactive({
      store: useStore(),
      router: useRouter(),
      route: useRoute(),
      menuList: [],
      menu: [],
      routerList: [], //所有路由数组
      children: [], //子路由数组
      // 跳转路由 ind路由索引
      jumpRouter(path) {
        data.router.push({ path: path })
      }
    })
    // 处理路由列表
    function getRouterList(list) {
      list.forEach((item) => {
        if (item && item.meta && item.meta.title) {
          data.routerList.push({
            path: item.path,
            title: item.meta.title,
            redirect: item.redirect ? item.redirect : ''
          })
        }
        if (item.children && item.children.length > 0) {
          getRouterList(item.children)
        }
      })
    }
    // 处理面包屑需要的路由
    function getCrumbsList() {
      let thisRouterList = [] //当前路由数组
      thisRouterList = data.route.path.split('/')
      let arr = []
      // //console.log(thisRouterList);
      thisRouterList.forEach((item, index) => {
        let paths = thisRouterList.slice(0, index + 1).join('/') // 获取当前路由 以及 当前路由的父级路由
        data.routerList.forEach((val) => {
          if (paths === val.path) {
            arr.push(val)
          }
        })
      })
      data.children = arr
    }
    const allList = data.router.options.routes //全部路由
    function getCrumbs() {
      setTimeout(() => {
        if (data.store.state.menu.crumbs.length) {
          data.children = data.store.state.menu.crumbs.map((item) => {
            return {
              title: item
            }
          })
        } else {
          getCrumbsList()
        }
      }, 100)
      data.routerList = []
      getRouterList(allList)
    }
    onMounted(() => {
      getCrumbs()
      data.menu = JSON.parse(localStorage.getItem('bjAdminMenu'))
      getMenuList(data.menu)
    })
    // 处理路由列表
    function getMenuList(list) {
      if (!list || !list.length) return
      list.forEach((item) => {
        if (item && item.permissionPath) {
          data.menuList.push({
            path: item.permissionPath,
            title: item.permissionName
          })
        }
        if (item.childDTOList && item.childDTOList.length) {
          getMenuList(item.childDTOList)
        }
      })
    }

    // 监听当前路由变化
    watch(
      () => data.route.path,
      () => {
        getCrumbs()
      },
    )
    function toGo(title) {
      //console.log(title)
      //console.log(data.routerList)
      let obj = data.routerList.find((el) => el.title == title)
      let path = obj.redirect ? obj.redirect : obj.path
      let index = data.menuList.findIndex((item) => item.path == path)
      if (index > -1) {
        data.router.push({ path })
      } else {
        for (let i in data.menu) {
          if (data.menu[i].childDTOList && data.menu[i].childDTOList.length) {
            //console.log(data.menu[i].childDTOList)
            let arr = data.menu[i].childDTOList.filter(
              (el) => el.permissionPath == obj.path
            )
            // //console.log(arr);
            if (arr.length) {
              if (arr[0].childDTOList && arr[0].childDTOList.length) {
                data.router.push({
                  path: arr[0].childDTOList[0].permissionPath
                })
                break
              }
            } else {
              data.router.push({ path: obj.path })
              break
            }
          }
        }
      }
    }
    const refData = toRefs(data)
    return {
      toGo,
      ...refData
    }
  }
}
</script>

<style lang="scss">
.crumbs {
  height: 48px;
  font-size: 16px;
  line-height: 48px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.45);
  .ove {
    cursor: pointer;
  }
  .bu {
    color: rgba(0, 0, 0, 0.85);
  }
  .align-center {
    display: flex;
    align-items: center;
  }
}
</style>
