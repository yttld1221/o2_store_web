<template>
  <div class="classroom">
    <div class="num-box">
      <div class="top-num-box num-width flex-align">
        <div class="num-item" v-for="(item, index) in topNum" :key="index">
          <span>{{ getNum(item.key) }}</span>
          {{ item.label }}
        </div>
      </div>
    </div>
    <div class="awards-detail-box">
      <div class="awards-detail-title">课时详情</div>
      <el-table
        max-height="300"
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{ background: '#fafafa', height: '48px' }"
      >
        <el-table-column show-overflow-tooltip prop="month" label="时间" />
        <el-table-column
          show-overflow-tooltip
          prop="lessonPeriod"
          label="课时总计"
        />
        <el-table-column
          show-overflow-tooltip
          prop="satisfaction"
          label="当月满意度评分"
        />
      </el-table>
    </div>
    <div class="awards-detail-box echarts-box">
      <div class="awards-detail-title">满意度评分走势</div>
      <div id="myChart" :style="{ width: '100%', height: '280px' }"></div>
    </div>
  </div>
</template>
<script lang="ts" setup name="classroom">
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
    }
  }
);
import * as echarts from 'echarts';
import { onMounted, getCurrentInstance, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';
const router = useRouter();
const _this: any = getCurrentInstance();
const API: any = _this.proxy.$API;
const message: any = _this.proxy.$Message;

const tableData = ref([]);
const topNum = ref([
  { label: '课时统计', key: 'lessonPeriod' },
  { label: '平均满意度评分', key: 'satisfaction' }
]);

const getNum = key => {
  if (!tableData.value.length) {
    return 0;
  } else {
    let sum = tableData.value
      .map(el => el[key])
      .reduce(
        (accumulator, currentValue) =>
          Number(accumulator) + Number(currentValue)
      );
    if (key == 'satisfaction') {
      let arr = tableData.value.filter(el => el[key] != 0);
      sum /= arr.length;
    }
    return sum.toFixed(2);
  }
};

const initEcharts = () => {
  let arr = [...tableData.value].reverse();
  let myChart = echarts.init(document.getElementById('myChart'));
  let xData = arr.map(el => el.month);
  let yData = arr.map(el => el.satisfaction);
  // 绘制图表
  myChart.setOption({
    xAxis: {
      data: xData
    },
    yAxis: {
      name: '满意度评分'
    },
    // 缩放平移组件
    dataZoom: [
      {
        type: 'inside', //slider有滑块，inside内置
        disabled: false, //是否停止组件功能
        xAxisIndex: 0, //x轴,可以用数组表示多个轴
        zoomLock: true, //是否锁定区域大小（true,只能平移不能缩放）
        preventDefaultMouseMove: false,
        filterMode: 'empty',
        startValue: tableData.value.length > 6 ? tableData.value.length - 6 : 0, //一行有几个（起始数组下标）数组长度-
        endValue: tableData.value.length > 6 ? tableData.value.length - 1 : 6, //一行有几个（结束数组下标）
        start: null,
        end: null
      }
    ],
    series: [
      {
        type: 'line',
        data: yData,
        symbol: 'none',
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              // 渐变颜色
              {
                offset: 0,
                color: 'rgba(25, 102, 255, 0.47)'
              },
              {
                offset: 1,
                color: 'rgba(216, 216, 216, 0)'
              }
            ],
            global: false
          }
        }
      }
    ]
  });
  window.onresize = function () {
    // 自适应大小
    myChart.resize();
  };
};
const getList = () => {
  API.teacher.studySituation({ teacherCode: props.teacherCode }).then(res => {
    console.log(res);
    tableData.value = res;
    initEcharts();
  });
};

onMounted(() => {
  if (props.teacherCode) {
    getList();
  }
});
</script>

<style lang="scss" scoped>
.classroom {
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
  .echarts-box {
    padding-bottom: 0;
    .awards-detail-title {
      margin-bottom: 0;
    }
  }
  .flex-align {
    display: flex;
    align-items: center;
  }
}
</style>
