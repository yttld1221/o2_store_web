<template>
  <div class="col-bar" :style="{ flex: item.attrs && item.attrs.flex }">
    <span
      class="col-bar-label"
      :class="{ required: isRequired(item) }"
      :style="{
        width: formAttrs['label-width'],
        'text-align': formAttrs['label-position'],
      }"
      v-if="item.label"
      >{{ item.label }}</span
    >
    <!-- 含有子项，递归渲染 -->
    <template v-if="item.children">
      <col-form-item
        v-bind="$props"
        :item="child"
        :key="item.prop ? item.prop : index"
        v-for="(child, index) in item.children"
        @ajax-start="onAjaxStart"
        @ajax-end="onAjaxEnd"
        @change-value="onChangeValue"
        @change-label="onChangeLabel"
      ></col-form-item>
    </template>
    <template v-else-if="item.type == 'custom'">
      <slot :name="item.slotName"></slot>
    </template>
    <template v-else-if="!item.hidden">
      <el-form-item
        class="form-item"
        :prop="item.prop"
        :rules="item.rules"
        v-if="item.type"
        v-show="!item.transparent"
      >
        <slot
          :name="'custom|' + item.prop"
          v-bind:data="model"
          v-if="item.type == 'custom'"
        ></slot>
        <component
          :value="model[item.prop]"
          class="form-item-component"
          :is="CurrentCompoent[`df-${item.type}`]"
          :config="item"
          @ajax-start="onAjaxStart"
          @ajax-end="onAjaxEnd"
          @change-value="(val) => onChangeValue(val, item)"
          @change-label="onChangeLabel"
          v-else
        ></component>
      </el-form-item>
    </template>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ColFormItem",
});
</script>
<script lang="ts" setup>
import DfModules from "./components/df-modules";
import { getCurrentInstance, shallowReactive } from "vue";

interface Props {
  /**
   * 表单项
   */
  item: Object;
  model: Object;
  /**
   * 表单属性
   */
  formAttrs: Object;
}
// eslint-disable-next-line no-undef
const props = withDefaults(defineProps<Props>(), {
  /**
   * 表单项
   */
  item: () => {
    return {};
  },
  model: () => {
    return {};
  },
  /**
   * 表单属性
   */
  formAttrs: () => {
    return {};
  },
});

const { proxy } = getCurrentInstance() as any;
// eslint-disable-next-line no-unused-vars
const self = proxy;

//动态组件
let CurrentCompoent = shallowReactive({ ...DfModules });

//父组件传递的事件
// eslint-disable-next-line no-undef
const emit = defineEmits([
  "change-label",
  "change-value",
  "ajax-start",
  "ajax-end",
]);

//判断当前label是否需要显示必填标志
const isRequired = (item) => {
  // if (item.required) return true;
  let formAttrsRules = (props.formAttrs as any).rules || {}; //整个表单校验规则
  let itemRules = item.rules; //单项校验规则
  // let dealRules = itemRules || formAttrsRules; //使用优先级
  // if (dealRules && dealRules[item.prop]) {
  //   let dealRuleItem = dealRules[item.prop];
  //   let requiredFlag = false;
  //   //数组类型
  //   if (Array.isArray(dealRuleItem)) {
  //     for (let rule of dealRuleItem) {
  //       //判断其中有一条使用必填
  //       if (rule.required) {
  //         requiredFlag = true;
  //         break;
  //       }
  //     }
  //   } else {
  //     requiredFlag = dealRuleItem.required;
  //   }
  //   return requiredFlag;
  // } else {
  //   return false;
  // }
  // 合并校验规则
  const rules = [];
  [itemRules, formAttrsRules[item.prop]].forEach((item) => {
    if (!item) return;
    Array.isArray(item) ? rules.push(...item) : rules.push(item);
  });
  // 检查是否有必填校验规则
  return rules.some((rule) => rule && rule.required);
};
/**
 * 值改变
 * @param {*} value 值
 * @param {Object} item 具体菜单项
 */
const onChangeValue = (value, item) => {
  // 向上通知数据变更
  emit("change-value", value, item);
};
/**
 * 展示值改变
 * @param {*} value 值
 * @param {String} key 对象key
 */
const onChangeLabel = (key, value) => {
  // 向上通知数据变更
  emit("change-label", key, value);
};
/**
 * ajax请求发起
 * @param {Symbol} symbol 请求唯一标识
 */
const onAjaxStart = (symbol) => {
  emit("ajax-start", symbol);
};
/**
 * ajax请求结束
 * @param {Symbol} symbol 请求唯一标识
 */
const onAjaxEnd = (symbol) => {
  emit("ajax-end", symbol);
};
</script>
<style lang="scss" scoped></style>
