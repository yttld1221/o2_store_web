<template>
  <div class="achieve">
    <div class="num-box">
      <div class="top-num-box num-width flex-align">
        <div class="num-item" v-for="(item, index) in topNum" :key="index">
          <span>{{ numRes[item.key] }}</span>
          {{ item.label }}
        </div>
      </div>
      <div class="bottom-num-box num-width flex-align">
        <div class="num-item" v-for="(item, index) in bottomNum" :key="index">
          <span>{{ numRes[item.key] }} </span>
          {{ item.label }}
        </div>
      </div>
    </div>
    <div class="awards-detail-box" v-if="tableData.length">
      <div class="awards-detail-title">获奖详情</div>
      <el-table
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{ background: '#fafafa', height: '48px' }"
      >
        <el-table-column
          show-overflow-tooltip
          prop="studentName"
          label="学生姓名"
        />
        <el-table-column
          width="220"
          show-overflow-tooltip
          prop="awardName"
          label="获得奖项"
        />
        <el-table-column
          show-overflow-tooltip
          prop="awardLevelStr"
          label="奖项级别"
        />
        <el-table-column
          show-overflow-tooltip
          prop="awardTime"
          label="获奖时间"
        />
      </el-table>
      <el-pagination
        :pager-count="2"
        style="justify-content: center; margin-top: 10px"
        @size-change="handleSizeChange"
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="pageInfo.pageSize"
        :current-page="pageInfo.pageNum"
        :total="total"
        background
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script lang="ts" setup name="achieve">
import { onMounted, getCurrentInstance, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';
const props = defineProps({
  teacherCode: {
    type: [String, Number],
    default: ''
  }
});

// 监听当前路由变化
watch(
  () => props.teacherCode,
  () => {
    if (props.teacherCode) {
      getList();
      getNum();
    }
  }
);

const router = useRouter();
const _this: any = getCurrentInstance();
const API: any = _this.proxy.$API;
const message: any = _this.proxy.$Message;
const topNum = ref([
  { label: '带教学生数量', key: 'studentCount' },
  { label: '带教学生获奖', key: 'studentAwardCount' }
]);
const bottomNum = ref([
  { label: '获奖国际级', key: 'internationalCount' },
  { label: '获奖亚洲级', key: 'asianCount' },
  { label: '获奖国家级', key: 'countryCount' },
  { label: '获奖省级', key: 'provinceCount' }
]);
const tableData = ref([]);
const total = ref(0);
const pageInfo = ref({
  pageNum: 1,
  pageSize: 10
});

const getList = () => {
  const params = {
    ...pageInfo.value,
    staffCode: props.teacherCode
  };
  API.teacher.pageAward(params).then(res => {
    console.log(res);
    tableData.value = res.records;
    total.value = res.total;
  });
};

const numRes = ref({});

// 成就展示
const getNum = row => {
  API.teacher.achievements({ teacherCode: props.teacherCode }).then(res => {
    console.log(res);
    numRes.value = res;
  });
};
onMounted(() => {
  if (props.teacherCode) {
    getList();
    getNum();
  }
});

const handleSizeChange = val => {
  pageInfo.value.pageNum = 1;
  pageInfo.value.pageSize = val;
  getList();
};

const handleCurrentChange = val => {
  pageInfo.value.pageNum = val;
  getList();
};
</script>

<style lang="scss" scoped>
.achieve {
  .num-box {
    background: #ffffff;
    border-radius: 8px;
    padding: 0 20px;
    .num-width {
      padding: 20px 0;
      .num-item {
        display: flex;
        flex-direction: column;
        flex: 1;
        border-right: 1px solid #ebeef5;
        justify-content: center;
        align-items: center;
        color: #333333;
        span {
          font-size: 32px;
          font-family: D-DIN, D-DIN;
          font-weight: 700;
          color: #1966ff;
        }
        &:last-child {
          border-right: none;
        }
      }
    }
    .bottom-num-box {
      border-top: 1px solid #ebeef5;
    }
  }
  .awards-detail-box {
    margin-top: 20px;
    border-radius: 8px;
    background: #ffffff;
    padding: 20px;
    .awards-detail-title {
      font-size: 14px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      color: #333333;
      margin-bottom: 10px;
    }
  }
  .flex-align {
    display: flex;
    align-items: center;
  }
}
</style>
