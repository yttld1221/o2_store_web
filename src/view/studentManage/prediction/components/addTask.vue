<template>
  <el-drawer
      v-model="drawerVisible"
      title="创建任务"
      direction="rtl"
      :size="wSize"
      class="drawerContainer"
      :append-to-body="true"
      @close="closeDrawer"
  >
    <template #header="{ titleId, titleClass }">
      <h4 :id="titleId" :class="[titleClass, 'title']">
        创建任务
      </h4>
      <el-button type="primary" class="submitBtn" @click="submitTask">提交</el-button>
    </template>
    <template #default>
      <div class="bodyContainer">
        <div class="moduleList">
          <h4 class="title">任务信息</h4>
          <div class="formContainer">
            <el-form
                ref="taskFormRef"
                :model="taskForm"
                label-width="85px"
                class="taskForm"
                label-position="left"
            >
              <el-row>
                <el-col :span="12">
                  <el-form-item label="任务名称" prop="missionsName" :rules="[{ required: true, trigger: 'blur', message: '请输入任务名称' }]">
                    <el-input type="text" v-model="taskForm.missionsName" maxlength="30" clearable placeholder="请输入任务名称"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="竞赛科目" prop="competitionSubject" :rules="[{ required: true, trigger: 'change', message: '请选择竞赛科目' }]">
                    <el-select
                        v-model="taskForm.competitionSubject"
                        placeholder="请选择竞赛科目"
                        clearable
                        @change="changeSubject"
                    >
                      <el-option v-for="(item, index) in subjectOptions" :label="item.msg" :value="item.code" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="预测教练" prop="missionsTeacher" :rules="[{ required: true, trigger: 'blur', message: '请选择预测教练' }]">
                    <el-select
                        v-model="taskForm.missionsTeacher"
                        :remote-method="remoteMethod"
                        :loading="teacherLoading"
                        multiple
                        filterable
                        remote
                        reserve-keyword
                        clearable
                        collapse-tags
                        placeholder="请选择预测教练"
                        popper-class="customHeader"
                        :max-collapse-tags="5"
                        style="width: 100%"
                        @change="changeTeacher"
                        :popper-append-to-body="false"
                        :collapse-tags-tooltip="true"
                        automatic-dropdown
                        class="customSelect"
                    >
                      <template #header v-if="teacherOptions.length > 0">
                        <el-checkbox
                            v-model="checkAll"
                            :indeterminate="indeterminate"
                            @change="handleCheckAll"
                        >
                          一键全选
                        </el-checkbox>
                      </template>
                      <el-checkbox-group v-model="taskForm.missionsTeacher">
                        <el-option
                            v-for="(item, index) in teacherOptions"
                            :key="item.teacherId"
                            :label="item.teacherName+'('+item.staffCode+')'"
                            :value="item.teacherId"
                        >
                          <el-checkbox
                              :label="item.teacherId"
                              style="pointer-events: none"
                          >
                            {{ item.teacherName }}({{ item.staffCode }})
                          </el-checkbox>
                        </el-option>
                      </el-checkbox-group>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
      </div>
    </template>
  </el-drawer>
</template>
<script lang="ts" setup name="addTask">
import {onMounted, getCurrentInstance, ref, reactive, computed, watchEffect} from 'vue';
import { useRouter } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import {useStore} from "vuex";
const router = useRouter();
const _this: any = getCurrentInstance();
const API: any = _this.proxy.$API;
const message: any = _this.proxy.$Message;
const drawerVisible = ref(false)
const taskFormRef = ref<any>(null);
const store = useStore();
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
  drawerVisible.value = false;
  taskFormRef.value.resetFields();
  checkAll.value = false;
}

const taskForm = reactive({
  missionsName: '', // 任务名称
  competitionSubject: "", // 竞赛科目
  missionsTeacher: [ // 预测教练
    // {
    //   teacherInfo: {
    //     teacherId: ""
    //   }
    // }
  ]
});

//竞赛科目切换
const changeSubject = (val) => {
  taskForm.missionsTeacher = [];
  teacherOptions.value = [];
  checkAll.value = false;
  remoteMethod("");
}

//查询预测教练
const teacherLoading = ref(false)
const teacherOptions = ref([]);
const checkAll = ref(false)
const indeterminate = ref(false)
const remoteMethod = (query: string) => {
  if(taskForm.competitionSubject === ""){
    ElMessage({
      message: '请选择竞赛科目',
      type: 'error',
    })
    return
  }
  const params = {
    subject: [taskForm.competitionSubject],
    keyWord: query,
    pageNum: 1,
    pageSize: -1,
    isEnable: 1
  }
  teacherLoading.value = true
  API.teacher.pageTeacherInfo(params).then(res => {
    if(res.records) {
      teacherOptions.value = res.records;
    }
    teacherLoading.value = false;
  });
}

watch(() => teacherOptions.value, (newValue, oldValue) => {
  if(taskForm.missionsTeacher && taskForm.missionsTeacher.length > 0) {
    if(newValue.length> 0) {
      if(taskForm.missionsTeacher.length <= newValue.length) {
        let missionsTeacherIndex = [];
        taskForm.missionsTeacher.forEach((el) => {
          let mIndex = newValue.findIndex(item => item.teacherId === el)
          missionsTeacherIndex.push(mIndex);
        })
        if(missionsTeacherIndex.indexOf(-1) == -1) {
          checkAll.value = true;
          indeterminate.value = false;
        } else {
          checkAll.value = false;
          let allNegativeOne = missionsTeacherIndex.every(ol => ol === -1);
          if(allNegativeOne){
            indeterminate.value = false;
          } else {
            indeterminate.value = true;
          }
        }
      } else if(taskForm.missionsTeacher.length > newValue.length) {
        let missionsTeacherIndex = [];
        newValue.forEach((el) => {
          let mIndex = taskForm.missionsTeacher.findIndex(item => item === el.teacherId)
          missionsTeacherIndex.push(mIndex);
        })
        if(missionsTeacherIndex.indexOf(-1) == -1) {
          checkAll.value = true;
          indeterminate.value = false;
        } else {
          checkAll.value = false;
          let allNegativeOne = missionsTeacherIndex.every(ol => ol === -1);
          if(allNegativeOne) {
            indeterminate.value = false;
          } else {
            indeterminate.value = true;
          }
        }
      }
    } else {
      checkAll.value = false;
      indeterminate.value = false;
    }
  } else if(taskForm.missionsTeacher.length === 0) {
    checkAll.value = false;
    indeterminate.value = false;
  }
}, {deep: true});


const handleCheckAll = (val) => {
  const data = teacherOptions.value.map(item => {
    return item.teacherId
  })
  taskForm.missionsTeacher = val ? data : [];
  indeterminate.value = false;
}
const changeTeacher = (val) => {
  if(teacherOptions.value && teacherOptions.value.length > 0) {
    if(val && val.length > 0) {
      let missionsTeacherIndex = [];
      teacherOptions.value.forEach((el) => {
        let mIndex = val.findIndex(item => item === el.teacherId);
        missionsTeacherIndex.push(mIndex);
      })
      if(missionsTeacherIndex.indexOf(-1) == -1) {
        checkAll.value = true;
        indeterminate.value = false;
      } else {
        checkAll.value = false;
        let allNegativeOne = missionsTeacherIndex.every(ol => ol === -1);
        if(allNegativeOne) {
          indeterminate.value = false;
        } else {
          indeterminate.value = true;
        }
      }
    } else {
      checkAll.value = false;
      indeterminate.value = false;
    }
  } else {
    checkAll.value = false;
    indeterminate.value = false;
  }
}

// 新增任务
const submitTask = () => {
  taskFormRef.value.validate((valid) => {
    if(valid) {
      ElMessageBox.confirm('确认提交当前操作内容？', '提交确认', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        closeOnClickModal: false
      }).then(() => {
        const param = {
          missionsName: taskForm.missionsName, // 任务名称
          competitionSubject: taskForm.competitionSubject, // 竞赛科目
          missionsTeacher: [ // 预测教练
            // {
            //   teacherInfo: {
            //     teacherId: ""
            //   }
            // }
          ]
        }
        if(taskForm.missionsTeacher.length > 0) {
          taskForm.missionsTeacher.forEach((item: any) => {
            param.missionsTeacher.push({teacherInfo: {teacherId: item}});
          })
        }
        API.student.addMissions(param).then(res => {
          if(res) {
            ElMessage({
              message: '任务创建成功',
              type: 'success',
            })
            emit("refresh-page", "add");
            closeDrawer();
          }
        })
      }).catch(() => {});
    }
  });
}

watchEffect(()=>{
  if(windowSizeData.value && windowSizeData.value.width > 2000) {
    wSize.value = "35%"
  } else {
    wSize.value = "45%"
  }
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
        :deep(.el-form) {
          .col-bar-label {
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
          .el-form-item__label {
            font-size: 14px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            color: #999999;
          }
          .itemClass {
            width: 50%;
          }
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
