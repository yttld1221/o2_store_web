<template>
  <div class="home">
    <div class="home-left">
      <div class="top-left flex-align">
        <div
          :key="index"
          v-for="(item, index) in topLeft"
          class="top-left-item"
          :style="{ backgroundImage: 'url(' + item.background + ')' }"
        >
          <div class="content-box flex-align">
            <span class="label-text">{{ item.label }}</span>
            <span class="num" :style="{ color: item.color }">{{
              dataObj[item.key]
            }}</span>
          </div>
        </div>
      </div>
      <div class="bottom-left flex-align">
        <div
          :key="index"
          v-for="(item, index) in bottomleft"
          class="bottom-left-item"
          :style="{ backgroundImage: 'url(' + item.background + ')' }"
        >
          <div class="content-box">
            <span>{{ item.label }}</span>
            <span class="num" :style="{ color: item.color }">{{
              dataObj[item.key]
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="home-right">
      <div class="top-right">
        <p>常用功能</p>
        <div
          class="top-right-list flex-align"
          :style="{
            'justify-content':
              topright.length == 4 ? 'space-between' : 'flex-start'
          }"
        >
          <template v-for="(item, index) in topright">
            <div
              v-if="item.auth"
              :class="{ 'm-r-79': topright.length != 4 }"
              :key="index"
              class="top-right-list-item"
              @click="toPage(item.name)"
            >
              <img :src="item.img" alt="" />
              <span>{{ item.label }}</span>
            </div>
          </template>
        </div>
      </div>
      <div class="bottom-right">
        <div class="bottom-right-title">
          消息中心<span @click="openDrawer()">查看全部</span>
        </div>
        <div class="message-list">
          <div
            v-for="(item, index) in homeMessage"
            :key="index"
            class="message-list-item flex-align"
            @click="toList(item)"
          >
            <div class="message-list-item-left flex-align">
              <div
                class="dian"
                :style="{ background: !item.isRead ? '#f16e6e' : '#c7cfe5' }"
              ></div>
              <div class="message-text">
                {{ item.text }}
              </div>
            </div>
            <div class="message-list-item-right">{{ item.createTime }}</div>
          </div>
        </div>
      </div>
    </div>
    <el-drawer v-model="drawer" direction="rtl" :before-close="handleClose">
      <template #header>
        <div class="drawer-title flex-align">
          <div class="title-text">消息中心</div>
          <el-button type="primary" @click="isReadHandle()"
            >全部已读 ({{ messageNum }})</el-button
          >
        </div>
      </template>
      <div class="message-list message-box">
        <div
          v-for="(item, index) in drawMessage"
          :key="index"
          class="message-list-item flex-align"
          @click="toList(item)"
        >
          <div class="message-list-item-left flex-align">
            <div
              class="dian"
              :style="{
                visibility: item.isRead ? 'hidden' : '',
                background: !item.isRead ? '#f16e6e' : ''
              }"
            ></div>
            <div class="message-text">
              {{ item.text }}
            </div>
          </div>
          <div class="message-list-item-right">{{ item.createTime }}</div>
        </div>
      </div>
      <template #footer>
        <el-pagination
          :pager-count="2"
          @size-change="handleSizeChange"
          layout="total, sizes, prev, pager, next, jumper"
          :page-size="pageInfo.pageSize"
          :current-page="pageInfo.pageNum"
          :total="total"
          background
          @current-change="handleCurrentChange"
        />
      </template>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup name="home">
import { onMounted, getCurrentInstance, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessageBox } from 'element-plus';
import iconZdxs from '@/assets/img/icon-zdxs.png';
import iconJsrs from '@/assets/img/icon-jsrs.png';
import iconCsxs from '@/assets/img/icon-csxs.png';
import iconZsxs from '@/assets/img/icon-zsxs.png';
import iconJsyc from '@/assets/img/icon-jsyc.png';
import iconJsgl from '@/assets/img/icon-jsgl.png';
import iconXtjh from '@/assets/img/icon-xtjh.png';
import iconJss from '@/assets/img/icon-jss.png';
import iconQjs from '@/assets/img/icon-qjs.png';
import iconLhpy from '@/assets/img/icon-lhpy.png';
import iconWtpy from '@/assets/img/icon-wtpy.png';
import iconSkys from '@/assets/img/icon-skys.png';

const router = useRouter();
const route = useRoute();
const _this: any = getCurrentInstance();
const API: any = _this.proxy.$API;
const message: any = _this.proxy.$Message;

const drawer = ref(false);

const handleClose = () => {
  drawer.value = false;
  pageInfo.value = {
    pageSize: 20,
    pageNum: 1
  };
};
const openDrawer = () => {
  drawer.value = true;
  getMessageNum();
  getDrawMessage();
};

const isReadHandle = () => {
  if (!messageNum.value) return;
  API.home.readAllMessage({}).then(res => {
    console.log(res);
    getMessageNum();
    getDrawMessage();
    getHomeMessage();
  });
};

const total = ref(0);

const pageInfo = ref({
  pageSize: 20,
  pageNum: 1
});

const getDrawMessage = () => {
  let params = {
    ...pageInfo.value
  };
  getMessageList(params, 'drawMessage');
};

const toPage = name => {
  router.push({
    name
  });
};

const toList = async item => {
  if (!item.isRead) {
    await API.home.readMessage({ messageId: item.messageId });
  }
  let routerName = '';
  if (item.messageType == 5) {
    routerName = 'predictionList';
  } else {
    routerName = 'testStudentsList';
  }
  router.push({
    name: routerName,
    query: {
      ...item.paramJson
    }
  });
};

const handleSizeChange = val => {
  pageInfo.value.pageSize = val;
  getDrawMessage();
};

const handleCurrentChange = val => {
  pageInfo.value.pageNum = val;
  getDrawMessage();
};

const topLeft = ref([
  {
    background: iconZdxs,
    label: '在读学生',
    key: 'totalReadingStudent',
    color: '#6D1CFF'
  },
  {
    background: iconJsrs,
    label: '教师人数',
    key: 'totalTeacher',
    color: '#FFA62F'
  }
]);

const topright = ref([
  {
    img: iconCsxs,
    label: '测试学生',
    name: 'testStudentsList'
  },
  {
    img: iconZsxs,
    label: '正式学生',
    name: 'regularStudentsList'
  },
  {
    img: iconJsyc,
    label: '竞赛预测',
    name: 'predictionList'
  },
  {
    img: iconJsgl,
    label: '教师管理',
    name: 'teacherManageList'
  }
]);

const bottomleft = ref([
  {
    background: iconXtjh,
    label: '星探计划',
    key: 'totalStarScoutPlan',
    color: '#003EFF'
  },
  {
    background: iconJss,
    label: '竞赛生',
    key: 'totalProvincialCompetition',
    color: '#2F0CFF'
  },
  {
    background: iconQjs,
    label: '强基生',
    key: 'totalFundamentalTalent',
    color: '#00D78B'
  },
  {
    background: iconLhpy,
    label: '联合培养',
    key: 'totalJointCultivation',
    color: '#FF4391'
  },
  {
    background: iconWtpy,
    label: '委托培养',
    key: 'totalEntrustedCultivation',
    color: '#FDAA42'
  },
  {
    background: iconSkys,
    label: '数科优生',
    key: 'totalScienceAndMathTalent',
    color: '#04C9F5'
  }
]);

const homeMessage = ref([]);
const drawMessage = ref([]);

const getMessageList = (params, key) => {
  API.home.pageMessage(params).then(res => {
    console.log(res);
    if (key == 'homeMessage') {
      homeMessage.value = res.records;
    } else {
      drawMessage.value = res.records;
      total.value = res.total;
    }
  });
};

const messageNum = ref(0);

const getMessageNum = () => {
  API.home.unreadNum({}).then(res => {
    console.log(res);
    messageNum.value = res;
  });
};

const getHomeMessage = () => {
  let params = {
    pageNum: 1,
    pageSize: 10
  };
  getMessageList(params, 'homeMessage');
};

const changeTopRight = () => {
  let arr = [];
  let menu = JSON.parse(localStorage.getItem('bjAdminMenu'));
  if (menu && menu.length) {
    menu.forEach(el => {
      arr.push(el.label);
      if (el.childNode && el.childNode.length) {
        el.childNode.forEach(item => {
          arr.push(item.label);
        });
      }
    });
    console.log(arr);
    topright.value.forEach((el, index) => {
      el.auth = arr.includes(el.label);
    });
    topright.value = topright.value.filter(el => el.auth);
  }
};

const dataObj = ref({});

const getDetail = () => {
  API.home.statisticalData({}).then(res => {
    console.log(res);
    dataObj.value = res;
  });
};

onMounted(() => {
  getHomeMessage();
  getDetail();
  let arr = localStorage.getItem('bjAdminMenu');
  setTimeout(
    () => {
      changeTopRight();
    },
    arr ? 0 : 500
  );
});
</script>

<style lang="scss" scoped>
.home {
  background: #f4f7fa;
  min-height: 100%;
  display: flex;
  align-items: flex-start;

  .flex-align {
    display: flex;
    align-items: center;
  }
  .home-left {
    width: 787rpx;
    margin-right: 27rpx;
    .top-left {
      width: 100%;
      height: 373rpx;
      background: #ffffff;
      border-radius: 11rpx;
      margin-bottom: 27rpx;
      padding: 40rpx;
      justify-content: space-between;
      .top-left-item {
        width: 333rpx;
        height: 293rpx;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        position: relative;
        .content-box {
          position: absolute;
          bottom: 27rpx;
          left: 0;
          right: 0;
          margin: 0 auto;
          padding: 0 21rpx 0 25rpx;
          width: 280rpx;
          height: 107rpx;
          background: #ffffff;
          border-radius: 8rpx;
          font-size: 19rpx;
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          color: #3d3d3d;
          justify-content: space-between;
          .num {
            font-size: 44rpx;
            font-family: ddin;
            font-weight: 700;
          }
          .label-text {
            word-break: keep-all;
          }
        }
      }
    }
    .bottom-left {
      width: 100%;
      height: 560rpx;
      background: #ffffff;
      border-radius: 11rpx;
      padding: 40rpx 40rpx 8rpx;
      justify-content: space-between;
      flex-wrap: wrap;
      align-items: flex-start;
      .bottom-left-item {
        margin-bottom: 32rpx;
        width: 203rpx;
        height: 224rpx;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        position: relative;
        .content-box {
          width: 100%;
          display: flex;
          flex-direction: column;
          position: absolute;
          bottom: 20rpx;
          text-align: center;
          font-size: 19rpx;
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          color: #3d3d3d;
          .num {
            margin-top: 3rpx;
            font-size: 32rpx;
            font-family: ddin;
            font-weight: 700;
            color: #2f0cff;
          }
        }
      }
    }
  }
  .home-right {
    width: calc(100% - 814rpx);

    .top-right {
      width: 100%;
      height: 291rpx;
      background: #ffffff;
      border-radius: 11rpx;
      margin-bottom: 27rpx;
      padding: 40rpx;
      p {
        font-size: 21rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        color: #171c3f;
        margin-bottom: 27rpx;
      }
      .top-right-list {
        .m-r-79 {
          margin-right: 78px;
        }
        .top-right-list-item {
          display: flex;
          flex-direction: column;
          cursor: pointer;
          align-items: center;
          img {
            width: 117rpx;
            height: 117rpx;
            margin-bottom: 12rpx;
          }
          span {
            font-size: 19rpx;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            color: #3d3d3d;
          }
          &:last-child {
            margin-right: 0;
          }
          &:hover span {
            color: #4d88ff;
          }
        }
      }
    }
    .bottom-right {
      width: 100%;
      height: 643rpx;
      background: #ffffff;
      border-radius: 11rpx;
      padding: 40rpx;
      .bottom-right-title {
        cursor: pointer;
        font-size: 21rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        color: #171c3f;
        margin-bottom: 27rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        span {
          font-size: 19rpx;
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          color: #1966ff;
          &:hover {
            color: #4d88ff;
          }
        }
      }
      .message-list {
        height: calc(100% - 50rpx);
        overflow-y: auto;
        &::-webkit-scrollbar {
          width: 0;
        }
      }
    }
  }
  .message-list-item {
    justify-content: space-between;
    margin-bottom: 29rpx;
    cursor: pointer;

    &:last-child {
      margin-bottom: 0;
    }
    .dian {
      width: 11rpx;
      height: 11rpx;
      border-radius: 50%;
      margin-right: 13rpx;
    }
    .message-list-item-left {
      font-size: 19rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #171c3f;
    }
    .message-list-item-right {
      font-size: 19rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #6f7289;
    }
  }
  .message-box {
  }
  :deep(.el-drawer) {
    width: 850rpx !important;
    .drawer-title {
      justify-content: space-between;
      .title-text {
        font-size: 21rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        color: #333333;
      }
      .el-button {
        margin-right: 32rpx;
      }
    }
    .el-drawer__footer {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
