<template>
  <el-drawer
      v-model="drawerVisible"
      title="新增学生"
      direction="rtl"
      :size="wSize"
      class="drawerContainer"
      :append-to-body="true"
      @close="closeDrawer"
  >
    <template #header="{ titleId, titleClass }">
      <h4 :id="titleId" :class="[titleClass, 'title']">
        新增学生
      </h4>
      <el-button type="primary" class="submitBtn" @click="submitStudent">提交</el-button>
    </template>
    <template #default>
      <div class="bodyContainer">
        <div class="moduleList">
          <h4 class="title">基础信息</h4>
          <div class="formContainer">
            <rowsDynamicForm
                ref="basicInfoRef"
                :formData="formData"
                :formItems="formItems"
                :formAttrs="formAttrs"
                :colsMax="2"
                :gutter="10"
                @change-value="changeModel"
            ></rowsDynamicForm>
          </div>
        </div>
        <div class="moduleList toTop">
          <h4 class="title">带教教练</h4>
          <div class="formContainer">
            <el-form :model="instructorData" ref="instructorFormRef" label-width="85px">
              <el-row v-for="(item, index) in instructorData.instructorForm" :key="index">
                <el-col :span="11">
                  <el-form-item label="竞赛学科" :prop="'instructorForm.'+ index + '.subject'" :rules="[{ required: true, message: '请选择竞赛学科', trigger: 'change' }]">
                    <el-select v-model="item.subject" @change="changeSubject($event, index)" placeholder="请选择" clearable>
                      <el-option v-for="(item) in subjectOptions" :key="item.code" :label="item.msg" :value="item.code" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="教练" :prop="'instructorForm.'+ index + '.teacherId'" :rules="[{ required: true, message: '请输入教练', trigger: 'blur' }]">
                    <el-select
                        v-model="item.teacherId"
                        multiple
                        filterable
                        remote
                        reserve-keyword
                        :collapse-tags="true"
                        :collapse-tags-tooltip="true"
                        :max-collapse-tags="1"
                        placeholder="请输入"
                        clearable
                        :remote-method="((queryString) => {querySearchAsync(queryString, item.subject, index)})"
                        @change="handleSelect($event, index)"
                    >
                      <el-option
                          v-for="item in item.teacherOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="2" @click="deleteInstructor(index)" class="deleteContainer">
                  <svg-icon icon-class="delete"></svg-icon>
                </el-col>
              </el-row>
              <el-row v-if="instructorData.instructorForm.length < 3">
                <el-col :span="24" class="btns">
                  <el-button type="primary" @click="addInstructor">添加记录</el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
      </div>
    </template>
  </el-drawer>
</template>
<script lang="ts" setup name="addStudent">
import {onMounted, getCurrentInstance, ref, reactive, watchEffect, computed} from 'vue';
import { useRouter } from 'vue-router';
import {phoneRule, validateChineseOrEnglish, validateIdCard} from "@/utils/validate";
import rowsDynamicForm from '@/components/dynamicForm/rowsDynamicForm.vue';
import {ElMessage, ElMessageBox} from 'element-plus';
const router = useRouter();
const _this: any = getCurrentInstance();
const API: any = _this.proxy.$API;
const message: any = _this.proxy.$Message;
const drawerVisible = ref(false)
const basicInfoRef = ref(null);
const instructorFormRef = ref(null);
import { useStore } from "vuex";
const store = useStore();
const genderOptions = computed(() => store.state.gender);
const trainingPlanOptions = computed(() => store.state.trainingPlan);
const gradeLevelOptions = computed(() => store.state.gradeLevel);
const subjectOptions = computed(() => store.state.subject);
const windowSizeData = computed(() => store.state.windowSize);
const wSize = ref("45%");

// eslint-disable-next-line no-undef
const emit = defineEmits([
  'refresh-page',
]);
const openDrawer = () => {
  drawerVisible.value = true;
}

const closeDrawer = () => {
  instructorFormRef.value.resetFields();
  basicInfoRef.value.invokeFormFn("resetFields");
  instructorData.instructorForm = [];
  drawerVisible.value = false;
}


const formData = ref({
  trainingPlanList: []
});
const formItems = ref([
  {
    label: '学生姓名',
    prop: 'studentName',
    type: 'input',
    rules: [
        { required: true, trigger: 'blur', message: '请输入姓名' },
        { validator: validateChineseOrEnglish, trigger: 'blur', message: '请输入中文或者英文' }
    ],
    attrs: {
      clearable: true,
      placeholder: '请输入姓名',
      maxlength: 30,
    },
  },
  {
    label: '性别',
    prop: 'gender',
    type: 'select',
    valueKey: 'code',
    labelKey: 'msg',
    rules: [{ required: true, trigger: 'change', message: '请选择性别' }],
    attrs: {
      clearable: true,
      placeholder: '请选择'
    },
    options: genderOptions.value
  },
  {
    label: '身份证号',
    prop: 'certificateNumber',
    type: 'input',
    rules: [
        { required: true, trigger: 'blur', message: '请输入身份证号' },
        { validator: validateIdCard, trigger: 'blur', message: '请输入正确的身份证号' }
    ],
    attrs: {
      clearable: true,
      placeholder: '请输入身份证号',
      maxlength: 18
    },
  },
  {
    label: '培养类型',
    prop: 'trainingPlanList',
    type: 'select',
    valueKey: 'code',
    labelKey: 'msg',
    rules: [{ required: true, trigger: 'change', message: '请选择培养类型' }],
    attrs: {
      clearable: true,
      placeholder: '请选择',
      multiple: true,
      "collapse-tags": true,
      "max-collapse-tags": 1
    },
    options: trainingPlanOptions.value
  },
  {
    label: '家长姓名',
    prop: 'parentName',
    type: 'input',
    rules: [
        { required: true, trigger: 'blur', message: '请输入家长姓名' },
        { validator: validateChineseOrEnglish, trigger: 'blur', message: '请输入中文或者英文' }
    ],
    attrs: {
      clearable: true,
      placeholder: '请输入家长姓名',
      maxlength: 30
    },
  },
  {
    label: '联系方式',
    prop: 'contacts',
    type: 'input',
    rules: [
        { required: true, trigger: 'blur', message: '请输入联系方式' },
        { validator: phoneRule, trigger: 'blur', message: '请输入正确的手机号' }
    ],
    attrs: {
      clearable: true,
      placeholder: '请输入联系方式',
      maxlength: 11
    },
  },
  {
    label: '原就读学校',
    prop: 'previousSchool',
    type: 'input',
    rules: [{ required: true, trigger: 'blur', message: '请输入原就读学校' }],
    attrs: {
      clearable: true,
      placeholder: '请输入原就读学校',
      maxlength: 30
    },
  },
  {
    label: '原就读年级',
    prop: 'previousGradeLevel',
    type: 'select',
    valueKey: 'code',
    labelKey: 'msg',
    rules: [{ required: true, trigger: 'change', message: '请选择原就读年级' }],
    options: gradeLevelOptions.value,
    attrs: {
      clearable: true,
      placeholder: '请选择',
    }
  },
  {
    label: '成绩背景',
    prop: 'academicBackground',
    type: 'input',
    rules: [{ required: true, trigger: 'blur', message: '请输入成绩背景' }],
    attrs: {
      clearable: true,
      placeholder: '请输入成绩背景',
      type: 'textarea',
      colsMax: 1, //单独占一行设置
      maxlength: 300,
      "show-word-limit": true
    },
  },
]);
const formAttrs = ref({
  'label-position': 'left',
  'label-width': '85px'
});

watchEffect(()=>{
  formItems.value[1].options = genderOptions.value;
  formItems.value[3].options = trainingPlanOptions.value;
  formItems.value[7].options = gradeLevelOptions.value;
  if(windowSizeData.value && windowSizeData.value.width > 2000) {
    wSize.value = "35%"
  } else {
    wSize.value = "45%"
  }
})

const instructorData =  reactive({
  instructorForm: [
    {
      subject: "",
      teacherName: "",
      teacherId: [],
      teacherOptions: []
    }
  ]
})

//添加记录
const addInstructor = () => {
  instructorData.instructorForm.push({
    subject: "",
    teacherName: "",
    teacherId: [],
    teacherOptions: []
  })
}
//删除记录
const deleteInstructor = (index) => {
  instructorData.instructorForm.splice(index, 1)
}

const changeModel = (model, value, key) => {
  formData.value = model
}

// 新增学生提交
const submitStudent = () => {
  const params = {
    ...formData.value,
    teacherInfoMap: {}
  }
  if(instructorData.instructorForm && instructorData.instructorForm.length > 0){
    instructorData.instructorForm.forEach((el)=>{
      let subject = el.subject;
      params.teacherInfoMap[subject] = []
      if(el.teacherId && el.teacherId.length > 0){
        el.teacherId.forEach((val)=>{
          params.teacherInfoMap[subject].push({
            teacherId: val
          })
        })
      }
    })
  }
  let basicInfoForm = basicInfoRef.value.invokeFormFn(
      "validate",
      (valid) => {
        return valid;
      }
  );
  let instructorValidForm = instructorFormRef.value.validate((valid) => {
    return valid;
  });

  Promise.all([basicInfoForm, instructorValidForm]).then(res => {
    if (res.indexOf(false) == -1) {
      ElMessageBox.confirm('确认提交当前操作内容？', '提交确认', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        closeOnClickModal: false
      }).then(() => {
        API.student.addStudentInfo(params).then(response => {
          if(response) {
            emit("refresh-page", "add");
            ElMessage({
              message: '新增成功',
              type: 'success'
            });
            closeDrawer();
          }
        })
      }).catch(() => {});
    }
  })
}


//竞赛学科切换 清除教练
const subjectNew = ref([]);
const changeSubject = (val, index) => {
  instructorData.instructorForm[index].teacherId = [];
  instructorData.instructorForm[index].teacherOptions = [];
  if(instructorData.instructorForm && instructorData.instructorForm.length > 1){
    subjectNew.value = instructorData.instructorForm.slice(0, index);
    let elIndex = subjectNew.value.findIndex(el => el.subject !== "" && el.subject === val)
    if(elIndex !== -1){
      ElMessage({
        message: '科目不支持重复选择',
        type: 'error',
      })
      instructorData.instructorForm[index].subject = "";
    }
  }
}
// 教练模糊查询

const querySearchAsync = (query, subject, index) => {
  if(subject === "") {
    ElMessage({
      message: '请选择竞赛科目',
      type: 'error',
    })
    return
  }
  if (query) {
    const params = {
      subject: [subject],
      keyWord: query,
      pageNum: 1,
      pageSize: -1,
      isEnable: 1
    };
    API.teacher.pageTeacherInfo(params).then(res => {
      if(res.records && res.records.length > 0) {
        let results = res.records.map(el => {
          return {
            label: el.teacherName+"("+el.staffCode+")",
            value: el.teacherId
          };
        });
        instructorData.instructorForm[index].teacherOptions = results;
      } else {
        instructorData.instructorForm[index].teacherOptions = [];
      }
    });
  }
}
const handleSelect = (item: Record<string, any>, index) => {
  //console.log(instructorData.instructorForm[index].teacherId, "teacherId")
}

onMounted(()=>{
})

defineExpose({
  openDrawer,
  closeDrawer
})
</script>

<style lang="scss" scoped>
.drawerContainer {
  .bodyContainer {
    .moduleList {
      padding: 15px 20px;
      width: 100%;
      background: #F8FAFD;
      border-radius: 8px 8px 8px 8px;
      opacity: 1;
      .title {
        width: 100%;
        border-bottom: 1px solid #EBEEF5;
        font-size: 14px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        color: #333333;
        padding-bottom: 10px;
      }
      .formContainer {
        padding-top: 20px;
        :deep(.col-bar-label) {
          font-size: 14px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          color: #999999;
        }
        .deleteContainer {
          height: 32px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }
        :deep(.el-form-item__label) {
          font-size: 14px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          color: #999999;
        }
      }
    }
    .toTop {
      margin-top: 20px;
    }
  }
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.is-selected::after {
  display: none;
}
</style>
