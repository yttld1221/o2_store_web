<template>
  <div class="common-table">
    <slot name="table-header"></slot>
    <div class="hl-table">
      <el-table :data="tableData" v-bind="$attrs" ref="table">
        <template v-for="(col, index) in tableHeader" :key="index">
          <!-- btns操作栏 -->
          <el-table-column
            v-bind="col"
            v-if="col.colType == 'btns' && !col.hidden"
          >
            <template v-slot="scope">
              <el-button
                v-bind="btn"
                :key="btnIndex"
                v-for="(btn, btnIndex) in col.btns"
                v-show="isShowButton(scope.row, scope.$index, btn)"
                @click.stop="btn.click(scope.row, scope.$index, btnIndex)"
                >{{ btn.label }}</el-button
              >
            </template>
          </el-table-column>
          <!-- 选择栏 -->
          <el-table-column
            v-bind="col"
            v-else-if="col.colType == 'selection' && !col.hidden"
            type="selection"
            width="55"
          />
          <!-- 自定义栏 -->
          <el-table-column
            v-bind="col"
            v-else-if="col.colType == 'column' && !col.hidden"
          >
            <template #header="{ column, $index }">
              <slot
                :name="colHeaderSlotName(col)"
                :column="column"
                :$index="$index"
              >
                <span>{{ column.label }}</span>
              </slot>
            </template>
            <template v-slot="scope">
              <slot
                :name="colCellSlotName(col)"
                :column="scope.column"
                :row="scope.row"
                :$index="scope.$index"
              ></slot>
            </template>
          </el-table-column>
          <!-- 多级表头栏 -->
          <slot
            :name="col.slotName"
            v-else-if="col.colType == 'slot' && !col.hidden"
          ></slot>
          <!-- 通用栏 -->
          <el-table-column v-bind="col" v-else-if="!col.hidden">
            <template #header="{ column, $index }">
              <slot
                :name="colHeaderSlotName(col)"
                :column="column"
                :$index="$index"
              >
                <span>{{ column.label }}</span>
              </slot>
            </template>
          </el-table-column>
        </template>
        <!-- 插入至表格最后一行之后的内容 -->
        <template v-slot:append>
          <slot name="append"></slot>
        </template>
        <!-- 数据为空 -->
        <template v-slot:empty>
          <slot name="empty"></slot>
        </template>
      </el-table>
    </div>
    <slot name="table-footer"></slot>
    <pagination
      v-if="isShowPaging && tableData.length > 0"
      v-model:current-page="pageParams.page"
      v-model:page-size="pageParams.limit"
      :page-sizes="pageSizes"
      layout="total, prev, pager, next, sizes, jumper"
      :total="pageParams.count"
      :background="true"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @prev-click="handlePrevClick"
      @next-click="handleNextClick"
      class="table-pagination"
      v-bind="paginationConfig"
    >
      <template v-slot:pagination>
        <slot name="pagination"></slot>
      </template>
    </pagination>
  </div>
</template>
<script>
export default {
  name: "commonTable",
};
</script>
<script setup>
import { reactive, ref, onMounted, computed, watch } from "vue";
import pagination from "./pagination.vue";
import { ElLoading } from "element-plus";

// eslint-disable-next-line no-undef
const props = defineProps({
  //表格头部设置参数
  tableHeader: Array,
  //表格数据
  propsTableData: Array,
  //表格数据请求接口函数
  ajaxGetData: {
    type: Function,
    default: () => {
      return () => {};
    },
  },
  //查询条件参数（除分页参数）
  queryParams: {
    type: Object,
    default: () => {
      return {};
    },
  },
  // 自定义属性
  attrs: {
    type: Object,
    default: () => {
      return {};
    },
  },
  //数据查询是否展示loading
  loading: {
    type: Boolean,
    default: () => {
      return false;
    },
  },
  //分页组件属性设置
  paginationConfig: {
    type: Object,
    required: true,
    default: () => {
      return {};
    },
  },
  //是否展示分页
  isShowPaging: {
    type: Boolean,
    default: true,
  },
  //是否立即执行接口请求表格数据
  immediateLoad: {
    type: Boolean,
    default: () => {
      return true;
    },
  },
});
// eslint-disable-next-line no-undef
const emit = defineEmits([
  "size-change",
  "current-change",
  "prev-click",
  "next-click",
]);
const tableData = ref([]);
//表格
// 表头插槽命名
let colHeaderSlotName = computed(() => {
  return (col) => {
    //多级表头
    if (col.colType == "slot") {
      return `${col.slotName}`;
    } else {
      //自定义表头
      return `header|${col.slotName || col.prop}`;
    }
  };
});
// 单元格插槽命名
let colCellSlotName = computed(() => {
  return (col) => {
    return `column|${col.slotName || col.prop}`;
  };
});

/**
 * 重新渲染
 */
const isShowButton = (row, rowIndex, btn) => {
  let { hidden } = btn;
  if (typeof hidden === "function") return !hidden(row, rowIndex, btn);
  return !hidden;
};

//分页接口参数
let ajaxPageParams = computed(() => {
  // let param = this.pageParams;
  let { offset, limit, page } = pageParams;
  return { offset, limit, pagesize: limit, page: page };
});

//分页参数
let pageParams = reactive({
  count: 0,
  offset: 0,
  limit: 10,
  page: 1,
});
const pageSizes = reactive([10, 20, 50, 100]);
const handleSizeChange = (size) => {
  pageParams.limit = size;
  emit("size-change", size, pageParams);
  ajaxGetTableDataByPage();
};
const handleCurrentChange = (pages) => {
  let { page, limit } = pageParams;
  pageParams.offset = parseInt(limit, 10) * (parseInt(page, 10) - 1);
  emit("current-change", pages, pageParams);
  ajaxGetTableDataByPage();
};
const handlePrevClick = (pages) => {
  emit("prev-click", pages, pageParams);
};
const handleNextClick = (pages) => {
  emit("next-click", pages, pageParams);
};
/**
 * 调用table组件的方法
 * @param {any} args[] 参数
 */
const table = ref(null);
const invokeTableFn = (fnName, ...args) => {
  const tableRef = table.value;
  // 校验是否已渲染
  if (!tableRef) return;
  const fn = tableRef[fnName];
  if (typeof fn === "function") {
    return fn.apply(tableRef, args);
  }
};
const doLayout = () => {
  nextTick(() => {
    table.value && table.value.doLayout();
  });
};

let loadingIns = ref(null);
const ajaxGetTableDataByPage = async () => {
  //默认load实例不存在，创建/已存在，使用原有load对象
  if (!loadingIns.value) {
    //填充loading展示默认值，兼容处理
    let loadIns = {
      close() {},
    };
    //需要展示loading
    if (props.loading) {
      loadIns = ElLoading.service({
        target: table.value.$el,
      });
    }
    loadingIns.value = loadIns;
  }
  let ajaxParams = {};
  if (isInquire.value) {
    ajaxParams = {
      ...ajaxPageParams.value,
      ...props.queryParams,
    };
  } else {
    ajaxParams = {
      ...ajaxPageParams.value,
    };
  }

  //获取func入参
  let dataFun = props.ajaxGetData;
  //完成回调
  let callFun = (res) => {
    loadingIns.value.close(); //关闭loading
    loadingIns.value = null; //置空load示例
    if (!res) return;
    let data = res || {};
    tableData.value = Array.isArray(data.data) ? data.data : []; //表数据
    console.log(tableData.value);
    pageParams.count = data.count || 0; //数据长度
    if (tableData.value.length === 0) pageParams.page = 1; //无数据时，重定向第一页
  };
  //func判非空并执行
  let dataPromise = dataFun && dataFun(ajaxParams);
  //promise接收返回值
  if (dataPromise && typeof dataPromise.then == "function") {
    Promise.all([dataPromise])
      .then((res) => {
        callFun(res[0]);
      })
      .catch((e) => {
        console.error(e);
        callFun();
      });
  } else {
    callFun();
  }
};

//刷新表格数据
let isInquire = ref(false);
const refreshTable = (isResetPageNum = true) => {
  if (isResetPageNum) {
    pageParams.page = 1;
  }
  isInquire.value = true;
  ajaxGetTableDataByPage();
};

onMounted(() => {
  if (props.propsTableData) {
    tableData.value = props.propsTableData;
  }
  props.immediateLoad && ajaxGetTableDataByPage();
});

watch(
  () => props.propsTableData,
  (newVal) => {
    if (newVal) {
      tableData.value = props.propsTableData;
    }
  }
);

watch(
  () => props.queryParams,
  (newVal, oldValue) => {
    if (newVal) {
      if (newVal.hasOwnProperty("page")) {
        pageParams.page = newVal.page;
      }
      if (newVal.hasOwnProperty("pagesize")) {
        pageParams.limit = newVal.pagesize;
      }
    }
  },
  { deep: true }
);

const clearChoose = () => {
  table.value.clearSelection();
};

onActivated(() => {
  doLayout();
});
// eslint-disable-next-line no-undef
defineExpose({
  invokeTableFn,
  refreshTable,
  clearChoose,
});
</script>
<style lang="scss" scoped>
.common-table {
  :deep(.el-table) {
    th.el-table__cell.is-leaf {
      background-color: #fafafa;
      border-bottom-color: #ebeef5;
      padding: 12px 0;
      .cell {
        font-size: 14px;
        color: #666666;
      }
    }
    .el-table__body td.el-table__cell {
      padding: 12px 0;
    }
  }
}
.pagination {
  padding: 20px;
  display: flex;
  justify-content: center;
}
</style>
