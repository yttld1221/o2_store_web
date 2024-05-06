<template>
  <el-select
    ref="select"
    :popper-class="popperClass"
    v-model="val"
    v-bind="attrs"
    v-on="events"
    v-scrolloutclose="{
      el: scrollEl, //scroll滚动区域
      handler: onCloseDropDown //触发事件
    }"
    @change="onChange"
    :title="labelVal"
    :loading="!!lastRequestSymbol"
  >
    <template v-for="(item, index) in optionList">
      <el-option
        v-bind="item"
        :key="index"
        :value="item[valueKey]"
        :label="item[labelKey]"
        v-if="item.hasOwnProperty('hidden') ? !isHidden(item) : true"
      >
      </el-option>
    </template>
  </el-select>
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
  inject
} from 'vue';
import Utils from './utils';
import { scrolloutclose } from '../directives/scrolloutclose';
import $event from './events';

export default defineComponent({
  name: 'DfSelect',
  directives: {
    [scrolloutclose.name]: scrolloutclose.option
  },
  props: {
    /**
     * 值
     */
    value: {},
    /**
     * 组件配置
     */
    config: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, context) {
    const { proxy } = getCurrentInstance();
    let uuid = ref(Utils.generateUUID());
    let CDynamicForm: any = inject('CDynamicForm');
    // 值
    let val = ref(props.value);
    let remoteOptionList = ref([]); // 远程选项列表
    let lastRequestSymbol = ref(null); // 最后一次请求唯一标识

    /**
     * 标签key
     */
    let labelKey = computed(() => {
      return props.config.labelKey || 'label';
    });
    /**
     * 值key
     */
    let valueKey = computed(() => {
      return props.config.valueKey || 'value';
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
      return ajax && typeof ajax === 'function';
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

    let popperClass = computed(() => {
      return 'dropdown-' + props.config.prop + '-' + uuid.value;
    });
    let scrollEl = computed(() => {
      return '.' + popperClass.value + ' .el-select-dropdown__wrap';
    });

    //展示下拉框本文tip
    let labelVal = computed(() => {
      let { model } = CDynamicForm;
      let { labelProp } = props.config;
      //无值不展示
      if (val.value !== false && !val.value) return '';
      if (labelProp) {
        return model[labelProp];
      }
      let res = optionList.value.find(
        item => item[valueKey.value] === val.value
      );
      if (res) {
        return res[labelKey.value];
      } else {
        return '';
      }
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
    const isEmptyValue = value => {
      if (value === undefined || value === null) return true;
      if (Array.isArray(value) && !value.length) return true;
      if (value === '') return true;
      return false;
    };

    const select = ref(null);
    //下拉框区域外滚动，将下拉框隐藏
    const onCloseDropDown = (e, el) => {
      let selectRef = select.value;
      //当前绑定的滚动区域是此下拉框，并且下拉框显示了，则将其隐藏
      if (scrollEl.value === el && selectRef && selectRef.visible)
        selectRef.blur();
    };

    const selectBlur = e => {
      if (props.config?.attrs?.record) {
        if (e.target?.value) {
          val.value = e.target.value;
        }
      }
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
        context.emit('ajax-start', symbol);
        lastRequestSymbol.value = symbol;
        let res = await ajax(CDynamicForm.model, val.value, props.config.prop);
        res = Array.isArray(res) ? res : [];
        // 防止后面的请求先返回导致数据不准确
        lastRequestSymbol.value === symbol && (remoteOptionList.value = res);
      } catch (e) {
        remoteOptionList.value = [];
        throw e;
      } finally {
        context.emit('ajax-end', symbol);
        lastRequestSymbol.value = null;
      }
    };

    /**
     * 初始化
     */
    const init = () => {
      // 校验是否有表单元素包裹
      if (!CDynamicForm) throw new Error('缺少CDynamicForm组件包裹');
      let { parentProp } = props.config;
      if (parentProp) {
        // 上级联动
        let unwatch = watch(
          () => CDynamicForm.model[`${parentProp}`],
          (newVal, oldVal) => {
            nextTick(() => {
              val.value = Array.isArray(val.value) ? [] : '';
            });
            ajaxOptionList();
          }
        );
        // 解绑
        $event.$on('hook:destroyed', () => {
          unwatch();
        });
        CDynamicForm.model[parentProp] && ajaxOptionList();
      } else {
        ajaxOptionList();
      }
    };

    // 监听下拉框变化 fix 仅针对用户手动触发ui组件改变选项时，触发label值改变
    const onChange = newVal => {
      let { labelProp } = props.config;
      // 不带labelProp，不做处理
      if (!labelProp) return;
      let res;
      //多选下拉
      if (Array.isArray(newVal)) {
        res = [];
        newVal.forEach(val => {
          let v = optionList.value.find(item => item[valueKey.value] === val);
          v && res.push(v[labelKey.value]);
        });
        context.emit('change-label', labelProp, res);
      } else {
        res = optionList.value.find(item => item[valueKey.value] === newVal);
        context.emit(
          'change-label',
          labelProp,
          res !== undefined ? res[labelKey.value] : ''
        );
      }
    };
    /**
     * 是否隐藏选项
     * @param {*} item 选项
     */
    const isHidden = item => {
      if (typeof item.hidden === 'function')
        return item.hidden.call(null, optionList.value);
      return item.hidden;
    };

    // 监听val变化，只对labelProp为空值的情况做清空处理及值变化向上传递
    watch(val, (newVal, oldVal) => {
      context.emit('change-value', val.value);
      if (newVal) {
        context.emit('change-label', props.config.prop, val.value);
      } else {
        props.config.labelProp &&
          context.emit('change-label', props.config.labelProp, val.value);
      }
    });

    /**
     * 更新值
     */
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
      selectBlur,
      isHidden,
      onCloseDropDown,
      uuid,
      popperClass,
      scrollEl,
      labelVal,
      init,
      ajaxOptionList,
      onChange,
      val,
      remoteOptionList,
      lastRequestSymbol,
      labelKey,
      valueKey,
      optionList,
      isAjax,
      attrs,
      events,
      isEmptyValue
    };
  }
});
</script>

<style lang="scss" scoped></style>
