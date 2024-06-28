<template>
  <el-form
    class="dynamic-form"
    ref="formRef"
    v-bind="formAttrs"
    :model="model"
    @submit.prevent
  >
    <slot name="form-before" />
    <template v-for="(row, rowIndex) in rowsFormItems" :key="'row|' + rowIndex">
      <el-row :gutter="gutter" class="form-row-bar">
        <el-col
          :span="colSpanMethod(item)"
          v-for="(item, colIndex) in row.children"
          :key="initCount + '|col|' + (item.prop ? item.prop : colIndex)"
        >
          <col-form-item
            v-bind="$props"
            :model="model"
            :item="item"
            @change-value="onChangeValue"
            @change-label="onChangeLabel"
            @ajax-start="onAjaxStart"
            @ajax-end="onAjaxEnd"
            v-show="!item.transparent"
          >
            <template v-slot:[item.slotName]>
              <slot v-bind:data="model" :name="item.slotName"></slot>
            </template>
          </col-form-item>
        </el-col>
      </el-row>
    </template>
    <slot name="form-after" />
  </el-form>
</template>

<script lang="ts">
export default {
  name: "dynamicForm",
};
</script>
<script lang="ts" setup>
import ColFormItem from "./ColFormItem.vue";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import en from "element-plus/dist/locale/en.mjs";
import "./style/index.scss";
import {
  computed,
  getCurrentInstance,
  onMounted,
  provide,
  reactive,
  ref,
  watch,
} from "vue";

interface Props {
  //表单数据
  formData: Object;
  //表单元素列表
  formItems: Object[];
  //表单属性
  formAttrs: Object;
  //列数
  colsMax: number;
  //栅栏间隔
  gutter?: Number;
  //国际化
  locale?: String;
}
// eslint-disable-next-line no-undef
const props = withDefaults(defineProps<Props>(), {
  formData: () => {
    return {};
  },
  formItems: () => {
    return [];
  },
  formAttrs: () => {
    return {};
  },
  colsMax: () => {
    return 3;
  },
  gutter: () => {
    return 0;
  },
  //国际化
  locale: () => {
    return "zhCn";
  },
});

const { proxy } = getCurrentInstance() as any;
// eslint-disable-next-line no-unused-vars
const self = proxy;
//父组件传递的事件
// eslint-disable-next-line no-undef
const emit = defineEmits(["change-model", "change-value"]);

//定义data数据
//变更时重新渲染表单组件
let initCount = ref(0);
// 数据模型
let model = ref({});
// ajax正在请求列表
let ajaxLoadList = ref([]);

//定义computed属性
//渲染成行列，每行包含多个表单项集合
let rowsFormItems = computed(() => {
  let result = [];
  let cols = props.colsMax;
  let rowObj = {
    count: 0,
    children: [],
  };
  result.push(rowObj);
  (props.formItems as any).forEach((item) => {
    if (item.hidden) return;
    let colspan = (item.colspan = item.colspan || 1);
    if (cols >= rowObj.count + colspan) {
      rowObj.count += colspan;
      rowObj.children.push(item);
    } else {
      rowObj = {
        count: colspan,
        children: [item],
      };
      result.push(rowObj);
    }
  });
  return result;
});
//计算列占比 24栅
let colSpanMethod = computed(() => {
  return (item) => {
    let { colspan } = item;
    //如果表单项单独设置了colsMax，使用 formItems 的 item.attrs.colsMax，否则使用全局props.colsMax
    let colsMax = item?.attrs?.colsMax ? item?.attrs?.colsMax : props.colsMax;
    return Math.floor((24 / colsMax) * colspan);
  };
});

//函数方法
/**
 * 手动更新表单组件，使校验功能及联动下拉功能正常使用
 */
const init = (): void => {
  initCount.value += 1;
};
/**
 * 初始化数据模型
 */
const changeFormData = (): void => {
  model.value = {
    ...props.formData,
  };
};

/**
 * 值改变
 * @param {*} value 值
 * @param {*} item 表单元素配置
 */
const onChangeValue = (value, item): void => {
  // 更新数据
  model.value[item.prop] = value;
  // 向上通知数据变更
  emit("change-value", model.value, value, item.prop);
};
/**
 * 展示值改变
 * @param {*} value 值
 * @param {*} key 对象key
 */
const onChangeLabel = (key, value): void => {
  // 更新数据
  model.value[key] = value;
  // 向上通知数据变更
  emit("change-model", model.value, value, key);
};
/**
 * ajax请求发起
 * @param {Symbol} symbol 请求唯一标识
 */
const onAjaxStart = (symbol): void => {
  ajaxLoadList.value.push(symbol);
};
/**
 * ajax请求结束
 * @param {Symbol} symbol 请求唯一标识
 */
const onAjaxEnd = (symbol) => {
  let index = ajaxLoadList.value.indexOf(symbol);
  rowsDynamicForm !== -1 && ajaxLoadList.value.splice(rowsDynamicForm, 1);
};

/**
 * 继承ElForm组件方法
 */
const formRef = ref(null);

/**
 * 设置model数据
 * @param {*} prop 字段名
 * @param {*} value 值
 */
// eslint-disable-next-line no-unused-vars
const setModelData = (prop, value) => {
  let res = (props.formItems as any).find((item) => item.prop === prop);
  res && onChangeValue(value, res);
};
/**
 * 调用form组件的方法
 * @param {string} fnName 方法名
 * @param {any} args[] 其他参数
 */
const invokeFormFn = (fnName, ...args) => {
  const form = formRef.value;
  // 校验是否已渲染
  if (!form) return;
  const fn = form[fnName];
  console.log(fn);
  if (typeof fn === "function") {
    return fn.apply(form, args);
  }
};

/**
 * 国际化
 */
const setLocale = computed(() => {
  if (props.locale == "zhCn") {
    return zhCn;
  } else if (props.locale == "en") {
    return en;
  }
  return zhCn;
});

watch(
  () => props.formData,
  () => {
    changeFormData();
  },
  { deep: true, immediate: true }
);

let dynamicFormObj = reactive({
  model: model.value,
  proxy,
});
provide("CDynamicForm", dynamicFormObj);
onMounted(() => {});

// eslint-disable-next-line no-undef
defineExpose({
  init,
  invokeFormFn,
  onChangeValue,
});
</script>

<style lang="scss" scoped>
</style>
