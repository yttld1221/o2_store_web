<template>
  <el-checkbox-group v-model="val" v-bind="attrs" @change="onChange">
    <template v-for="(item, index) in optionList">
      <el-checkbox-button
        v-if="config.radioButton"
        v-bind="item"
        v-on="events"
        :key="index"
        :label="item[valueKey]"
      >
        {{ item[labelKey] }}
      </el-checkbox-button>
      <el-checkbox
        v-bind="item"
        v-on="events"
        :label="item[valueKey]"
        v-else-if="item.hasOwnProperty('hidden') ? !isHidden(item) : true"
      >
        {{ item[labelKey] }}
      </el-checkbox>
    </template>
  </el-checkbox-group>
</template>

<script lang="ts">
import {
  getCurrentInstance,
  watch,
  ref,
  onMounted,
  nextTick,
  defineComponent,
  computed,
  inject,
} from "vue";
import $event from "./events";

export default defineComponent({
  name: "DfCheckbox",
  props: {
    /**
     * 值
     */
    value: {
      type: Array,
      default: () => [],
    },
    /**
     * 组件配置
     */
    config: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, context) {
    const { proxy } = getCurrentInstance();
    let val = ref(props.value);
    let remoteOptionList = ref([]); // 远程选项列表
    let lastRequestSymbol = ref(null); // 最后一次请求唯一标识
    let CDynamicForm: any = inject("CDynamicForm");

    /**
     * 标签key
     */
    let labelKey = computed(() => {
      return props.config.labelKey || "label";
    });
    /**
     * 值key
     */
    let valueKey = computed(() => {
      return props.config.valueKey || "value";
    });
    /**
     * 选项列表数据
     */
    let optionList = computed(() => {
      let { options } = props.config;
      let optionLists = isAjax.value ? remoteOptionList.value : options;
      return Array.isArray(optionLists) ? optionLists : [];
    });
    /**
     * 是否ajax请求数据
     */
    let isAjax = computed(() => {
      let { ajax } = props.config;
      return ajax && typeof ajax === "function";
    });
    /**
     * 属性配置
     */
    let attrs = computed(() => {
      return props.config.attrs || {};
    });
    let events = computed(() => {
      return props.config.events || {};
    });

    //功能函数
    /**
     * 是否是空值
     * 空值
     * - []
     * - ''
     * - null
     * - undefined
     * @param {*} value 值
     */
    const isEmptyValue = (value) => {
      if (value === undefined || value === null) return true;
      if (Array.isArray(value) && !value.length) return true;
      if (value === "") return true;
      return false;
    };

    /**
     * ajax请求选项数据
     */
    const ajaxOptionList = async () => {
      let { ajax, parentProp } = props.config;
      if (!isAjax.value) return;
      // fix：校验空数组、null、空字符串、undefined
      if (parentProp && isEmptyValue(CDynamicForm.model[parentProp]))
        return (remoteOptionList.value = []);
      let symbol = Symbol(props.config.prop);
      try {
        context.emit("ajax-start", symbol);
        lastRequestSymbol.value = symbol;
        let res = await ajax(CDynamicForm.model, val.value, props.config.prop);
        res = Array.isArray(res) ? res : [];
        // 防止后面的请求先返回导致数据不准确
        lastRequestSymbol.value === symbol && (remoteOptionList.value = res);
      } catch (e) {
        remoteOptionList.value = [];
        throw e;
      } finally {
        context.emit("ajax-end", symbol);
        lastRequestSymbol.value = null;
      }
    };

    /**
     * 初始化
     */
    const init = () => {
      // 校验是否有表单元素包裹
      if (!CDynamicForm) throw new Error("缺少CDynamicForm组件包裹");
      let { parentProp } = props.config;
      if (parentProp) {
        // 上级联动
        let unwatch = watch(
          () => CDynamicForm.model[`${parentProp}`],
          (newVal, oldVal) => {
            nextTick(() => {
              val.value = Array.isArray(val.value) ? [] : [];
            });
            ajaxOptionList();
          }
        );
        // 解绑
        $event.$on("hook:destroyed", () => {
          unwatch();
        });
        CDynamicForm.model[parentProp] && ajaxOptionList();
      } else {
        ajaxOptionList();
      }
    };

    // 监听下拉框变化 fix 仅针对用户手动触发ui组件改变选项时，触发label值改变
    const onChange = (newVal) => {
      let { labelProp } = props.config;
      // 不带labelProp，不做处理
      if (!labelProp) return;
      let res;
      //多选下拉
      if (Array.isArray(newVal)) {
        res = [];
        newVal.forEach((val) => {
          let v = optionList.value.find((item) => item[valueKey.value] === val);
          v && res.push(v[labelKey.value]);
        });
        context.emit("change-label", labelProp, res);
      } else {
        res = optionList.value.find((item) => item[valueKey.value] === newVal);
        context.emit(
          "change-label",
          labelProp,
          res !== undefined ? res[labelKey.value] : ""
        );
      }
    };

    /**
     * 是否隐藏选项
     * @param {*} item 选项
     */
    const isHidden = (item) => {
      if (typeof item.hidden === "function")
        return item.hidden.call(null, optionList.value);
      return item.hidden;
    };

    watch(val, (newVal, oldVal) => {
      context.emit("change-value", val.value);
      if (newVal) {
        context.emit("change-label", props.config.prop, val.value);
      } else {
        props.config.labelProp &&
        context.emit("change-label", props.config.labelProp, "");
      };
    });
    watch(
      () => props.value,
      () => {
        val.value = props.value;
      }
    );
    onMounted(() => {
      init();
    });
    return {
      val,
      remoteOptionList,
      lastRequestSymbol,
      labelKey,
      valueKey,
      optionList,
      isAjax,
      attrs,
      events,
      isEmptyValue,
      ajaxOptionList,
      onChange,
      init,
      isHidden,
    };
  },
});
</script>

<style lang="scss" scoped></style>
