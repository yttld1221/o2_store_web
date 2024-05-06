<template>
  <el-drawer
    v-model="drawerVisible"
    direction="rtl"
    :size="wSize"
    class="drawerContainer"
    :append-to-body="true"
    @close="closeDrawer"
  >
    <template #header="{ titleId, titleClass }">
      <h4 :id="titleId" :class="[titleClass, 'title']">
        <span>查看详情</span>
      </h4>
      <el-button
        type="primary"
        class="endBtn"
        v-if="taskType === 'end' && taskDetailForm.missionsStatus === 1"
        @click="endTask"
        >结束</el-button
      >
      <el-button
        type="primary"
        class="submitBtn"
        v-else-if="
          taskType === 'coachEdit' &&
          taskDetailForm.missionsTeacher[0]?.anticipateRecords.length === 0
        "
        @click="missionsSubmit"
        >提交</el-button
      >
    </template>
    <template #default>
      <div class="bodyContainer">
        <el-form
          :model="taskDetailForm"
          ref="taskDetailRef"
          label-width="80px"
          label-position="left"
        >
          <div class="moduleList">
            <div class="moduleHeader">
              <h4 class="title">任务信息</h4>
            </div>
            <div class="formContainer">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="任务名称" prop="">
                    <div class="itemText">
                      {{ taskDetailForm.missionsName }}
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="竞赛科目" prop="">
                    <div class="itemText">
                      {{ taskDetailForm.competitionSubjectStr }}
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="创建时间" prop="">
                    <div class="itemText">{{ taskDetailForm.createTime }}</div>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
          <div
            class="moduleList toTop"
            v-if="taskType === 'detail' || taskType === 'end'"
          >
            <div class="moduleHeader">
              <h4 class="title">成绩预测</h4>
              <div class="exportContainer">
                <span class="exportText"
                  >完成进度：{{ taskDetailForm.advance }}</span
                >
                <el-button
                  type="primary"
                  class="exportBtn"
                  @click="missionsExport"
                  >导出</el-button
                >
              </div>
            </div>
            <div class="formContainer">
              <div
                v-for="(item, index) in taskDetailForm.missionsTeacher"
                :class="[
                  'achievementItem',
                  'hasList',
                  activeName !== '' ? 'activeCollapse' : '',
                  index > 0 ? 'toTop' : ''
                ]"
              >
                <el-collapse
                  accordion
                  @change="collapseChange($event, index)"
                  v-if="
                    item.anticipateRecords && item.anticipateRecords.length > 0
                  "
                >
                  <el-collapse-item :name="index">
                    <template #title>
                      <div class="achievementHeader">
                        <div class="title">
                          <span class="focus">{{
                            item.teacherInfo.teacherName
                          }}</span
                          >（{{ item.teacherInfo.staffCode }}）
                        </div>
                        <div class="title active">{{ item.collapseTile }}</div>
                      </div>
                    </template>
                    <template #default>
                      <div class="achievementContent">
                        <el-table
                          :data="item.anticipateRecords"
                          class="readInfoTable"
                        >
                          <el-table-column label="" prop="studentName">
                            <template #default="{ row, $index }">
                              <div class="columnContainer">
                                <svg-icon icon-class="task-hjr"></svg-icon>
                                <span>
                                  {{ row.studentName }}({{
                                    row.studentCode
                                  }})</span
                                >
                              </div>
                            </template>
                          </el-table-column>
                          <el-table-column label="" prop="awardLevelStr">
                            <template #default="{ row, $index }">
                              <div class="columnContainer">
                                <svg-icon icon-class="task-jx"></svg-icon>
                                <span> {{ row.awardLevelStr }} </span>
                              </div>
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>
                    </template>
                  </el-collapse-item>
                </el-collapse>
                <div class="achievementHeader" v-else>
                  <div class="title">
                    <span class="focus">{{ item.teacherInfo.teacherName }}</span
                    >（{{ item.teacherInfo.staffCode }}）
                  </div>
                  <div class="title toLeft">未提交</div>
                </div>
              </div>
            </div>
          </div>
          <div class="moduleList toTop" v-else-if="taskType === 'coachView'">
            <div class="moduleHeader">
              <h4 class="title">成绩预测</h4>
            </div>
            <div class="formContainer">
              <el-table
                :data="taskDetailForm.missionsTeacher[0]?.anticipateRecords"
                class="readInfoTable"
              >
                <el-table-column label="" prop="studentName">
                  <template #default="{ row, $index }">
                    <div class="columnContainer">
                      <svg-icon icon-class="task-hjr"></svg-icon>
                      <span> {{ row.studentName }}({{ row.studentCode }})</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="" prop="awardLevelStr">
                  <template #default="{ row, $index }">
                    <div class="columnContainer">
                      <svg-icon icon-class="task-jx"></svg-icon>
                      <span> {{ row.awardLevelStr }} </span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="moduleList toTop" v-else-if="taskType === 'coachEdit'">
            <div class="moduleHeader">
              <h4 class="title">成绩预测</h4>
              <div class="exportContainer">
                <span class="exportText"
                  >提示：请填写本次竞赛您所带学生的成绩预测</span
                >
              </div>
            </div>
            <div class="formContainer">
              <div class="tipsContainer">
                <div class="tips">示例：张三 — 202201130000 — 省队</div>
                <el-button
                  type="primary"
                  class="importBtn"
                  @click="importGrades"
                  >导入</el-button
                >
              </div>
              <el-form
                :model="anticipateForm"
                ref="anticipateFormRef"
                label-width="80px"
                label-position="left"
              >
                <el-row
                  v-for="(item, index) in anticipateForm.anticipateRecords"
                  :key="index"
                  :gutter="10"
                >
                  <el-col :span="7">
                    <el-form-item
                      label="学生姓名"
                      class="toBottom"
                      :prop="'anticipateRecords.' + index + '.studentName'"
                      :rules="[
                        {
                          required: true,
                          message: '请输入学生姓名',
                          trigger: 'blur'
                        }
                      ]"
                    >
                      <el-autocomplete
                        v-model="item.studentName"
                        value-key="label"
                        label="value"
                        clearable
                        placeholder="请输入学生姓名"
                        :trigger-on-focus="false"
                        :fetch-suggestions="querySearchAsync"
                        @select="handleStudentSelect($event, index)"
                        @change="studentChange($event, index)"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item
                      label="学号"
                      class="toBottom toCenter"
                      :prop="'anticipateRecords.' + index + '.studentCode'"
                      :rules="[
                        {
                          required: true,
                          message: '请输入学号',
                          trigger: 'blur'
                        }
                      ]"
                    >
                      <el-input
                        v-model="item.studentCode"
                        placeholder="自动带入"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item
                      label="预测奖项"
                      class="toBottom"
                      :prop="'anticipateRecords.' + index + '.awardLevel'"
                      :rules="[
                        {
                          required: true,
                          message: '请选择预测奖项',
                          trigger: 'change'
                        }
                      ]"
                    >
                      <el-select
                        v-model="item.awardLevel"
                        placeholder="请选择预测奖项"
                        clearable
                      >
                        <el-option
                          v-for="item in anticipateLevelOptions"
                          :key="item.code"
                          :label="item.msg"
                          :value="item.code"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col
                    :span="3"
                    @click="deleteAchievement(index)"
                    class="deleteContainer"
                  >
                    <svg-icon icon-class="delete"></svg-icon>
                  </el-col>
                </el-row>
                <el-row v-if="anticipateForm.anticipateRecords.length < 50">
                  <el-col :span="24" class="btns">
                    <el-button type="primary" @click="addAchievement"
                      >添加记录</el-button
                    >
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
        </el-form>
        <!--  批量导入成绩-->
        <batchImport
          ref="batchImportRef"
          @uploadFile="uploadFiles"
          :isComplete="completeFlag"
        ></batchImport>
      </div>
    </template>
  </el-drawer>
</template>
<script lang="ts" setup name="taskDetail">
import {
  onMounted,
  getCurrentInstance,
  ref,
  reactive,
  computed,
  watchEffect
} from 'vue';
import { useRouter } from 'vue-router';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import batchImport from './batchImport.vue';
import { useStore } from 'vuex';
import { downloadFileWithLink } from '@/utils/utils';
const router = useRouter();
const _this: any = getCurrentInstance();
const API: any = _this.proxy.$API;
const message: any = _this.proxy.$Message;
const drawerVisible = ref(false);
const taskDetailRef = ref(null);
const taskType = ref('');
const batchImportRef = ref<any>(null);
const anticipateFormRef = ref<any>(null);
const store = useStore();
const anticipateLevelOptions = computed(() => store.state.anticipateLevel);
const windowSizeData = computed(() => store.state.windowSize);
const wSize = ref('55%');
const completeFlag = ref(false);
const loginUser = JSON.parse(localStorage.getItem('bjAdminUser'));

// eslint-disable-next-line no-undef
const emit = defineEmits(['refresh-page']);
const rowData = ref({
  missionsId: '' // 任务id
});
//竞赛预测详情
const taskDetailForm = ref({
  missionsStatus: '', // 任务状态
  missionsName: '', // 任务名称
  competitionSubjectStr: '', // 竞赛科目
  createTime: '', // 创建时间
  advance: '', // 完成进度
  missionsTeacher: [
    // 教师预测记录
    {
      teacherInfo: {
        //教师信息
        teacherName: '', //教师姓名
        staffCode: '' // 工号
      },
      anticipateRecords: [] //预测记录
    }
  ]
});

const openDrawer = (row, type) => {
  if (row) {
    rowData.value = row;
    queryMissionsDetail();
  }
  drawerVisible.value = true;
  taskType.value = type;
  if (taskType.value == 'coachEdit') {
    getStudentList();
  }
};

const getStudentList = () => {
  API.student
    .teachingReadingStudents({
      teacherCode: loginUser.staffCode,
      missionsId: rowData.value?.missionsId
    })
    .then(res => {
      console.log(res);
      if (res) {
        anticipateForm.anticipateRecords = res.map(el => {
          return {
            missionsId: '',
            studentName: el.studentName, // 学生姓名
            studentCode: el.studentCode, // 学号
            awardLevel: '' // 预测奖项
          };
        });
      }
    });
};

// 获取竞赛预测详情
const queryMissionsDetail = () => {
  const params = {
    missionsId: rowData.value?.missionsId
  };
  API.student.queryByMissionsId(params).then(res => {
    if (res) {
      taskDetailForm.value = res;
      if (
        taskDetailForm.value.missionsTeacher &&
        taskDetailForm.value.missionsTeacher.length > 0
      ) {
        taskDetailForm.value.missionsTeacher.forEach((item, index) => {
          item.collapseTile = '查看详情';
        });
      }
    }
  });
};

const closeDrawer = () => {
  if (taskType.value === 'coachEdit') {
    anticipateFormRef?.value.resetFields();
    anticipateForm.anticipateRecords = [];
  }
  drawerVisible.value = false;
};

const activeName = ref('');
const collapseChange = (name, index) => {
  activeName.value = name;
  if (name !== '') {
    taskDetailForm.value.missionsTeacher[index].collapseTile = '收起详情';
  } else {
    taskDetailForm.value.missionsTeacher[index].collapseTile = '查看详情';
  }
};

// 编辑预测记录
const anticipateForm: Object = reactive({
  anticipateRecords: [
    // {
    //   missionsId: "",
    //   studentName: "", // 学生姓名
    //   studentCode: "", // 学号
    //   awardLevel: "", // 预测奖项
    // }
  ]
});

//删除奖项
const deleteAchievement = index => {
  anticipateForm.anticipateRecords.splice(index, 1);
};
//添加奖项
const addAchievement = () => {
  anticipateForm.anticipateRecords.push({
    missionsId: '',
    studentName: '', // 学生姓名
    studentCode: '', // 学号
    awardLevel: '' // 预测奖项
  });
};

// 学生模糊查询
const querySearchAsync = (query, cb) => {
  if (query) {
    const params = {
      studentName: query,
      studentStatus: [1],
      pageNum: 1,
      pageSize: -1
    };
    API.student.pageStudentInfo(params).then(res => {
      if (res.records && res.records.length > 0) {
        let results = res.records.map(el => {
          return {
            label: el.studentName + '(' + el.studentCode + ')',
            value: el.studentCode
          };
        });
        cb(results);
      } else {
        cb([]);
      }
    });
  }
};
// 学生模糊查询选择
const handleStudentSelect = (item: Record<string, any>, index) => {
  anticipateForm.anticipateRecords[index].studentCode = item.value;
  if (item.label && item.label.includes('(')) {
    let name = item.label.split('(')[0];
    anticipateForm.anticipateRecords[index].studentName = name;
  }
};
// 切换学生
const studentChange = (val, index) => {
  if (val === '') {
    anticipateForm.anticipateRecords[index].studentCode = '';
  }
};
// 提交成绩预测
const missionsSubmit = () => {
  anticipateFormRef.value.validate(valid => {
    if (valid) {
      ElMessageBox.confirm('确认提交当前操作内容？', '提交确认', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        closeOnClickModal: false
      })
        .then(() => {
          anticipateForm.anticipateRecords.forEach((item: any) => {
            item.missionsId = rowData.value?.missionsId;
          });
          API.student
            .addAnticipateRecord(anticipateForm.anticipateRecords)
            .then(res => {
              if (res) {
                ElMessage({
                  message: '提交成功',
                  type: 'success'
                });
                anticipateFormRef.value.resetFields();
                emit('refresh-page', 'add');
                closeDrawer();
              }
            });
        })
        .catch(() => {});
    }
  });
};

// 结束任务
const endTask = () => {
  ElMessageBox.confirm('确认结束当前预测任务？', '结束确认', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    closeOnClickModal: false
  })
    .then(() => {
      const param = {
        missionsId: rowData.value?.missionsId
      };
      API.student.closeMissions(param).then(res => {
        if (res) {
          ElMessage({
            message: '操作成功',
            type: 'success'
          });
          emit('refresh-page', 'add');
          closeDrawer();
        }
      });
    })
    .catch(() => {});
};

// 批量导入成绩
const importGrades = () => {
  batchImportRef.value.openDialog();
};

//批量导入成绩回显
const uploadFiles = files => {
  if (files && files.importData && files.importData.length > 0) {
    let remainingItem = parseInt(
      50 - anticipateForm.anticipateRecords.length,
      10
    );
    if (remainingItem === 0) {
      completeFlag.value = false;
      ElMessage({
        message: '剩余可导入条数0条',
        type: 'warning'
      });
    } else if (remainingItem > 0) {
      if (files.importData.length <= remainingItem) {
        anticipateForm.anticipateRecords =
          anticipateForm.anticipateRecords.concat(files.importData);
        completeFlag.value = true;
      } else {
        completeFlag.value = false;
        ElMessage({
          message: `剩余可导入条数${remainingItem}条`,
          type: 'warning'
        });
      }
    }
  }
};

// 获取导出的文件名
const getFileName = url => {
  if (!url) return;
  return url.substring(url.lastIndexOf('/') + 1);
};

// 导出竞赛预测
const missionsExport = () => {
  const loading = ElLoading.service({
    target: '.publishDialog',
    lock: true,
    text: '导出中'
  });
  const param = {
    missionsId: rowData.value?.missionsId
  };
  API.student
    .exportMissionsInfo(param)
    .then(res => {
      if (res) {
        const filename = getFileName(res);
        downloadFileWithLink(res, filename);
        ElMessage({
          message: '导出成功',
          type: 'success'
        });
        closeDrawer();
      }
      loading.close();
    })
    .catch(e => {
      loading.close();
    });
};

watchEffect(() => {
  if (windowSizeData.value && windowSizeData.value.width > 2000) {
    wSize.value = '35%';
  } else {
    wSize.value = '55%';
  }
});

defineExpose({
  openDrawer,
  closeDrawer
});
</script>

<style lang="scss" scoped>
.drawerContainer {
  .bodyContainer {
    .moduleList {
      padding: 15px 20px;
      width: 100%;
      background: #f8fafd;
      border-radius: 8px 8px 8px 8px;
      opacity: 1;
      .moduleHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #ebeef5;
        padding-bottom: 10px;
        .title {
          font-size: 14px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 600;
          color: #333333;
          line-height: 24px;
        }
        .exportContainer {
          display: flex;
          align-items: center;
          .exportText {
            font-size: 14px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            color: #999999;
            line-height: 16px;
          }
          .exportBtn {
            width: 65px;
            height: 24px;
            background: #1966ff;
            border-radius: 4px 4px 4px 4px;
            opacity: 1;
            font-size: 14px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            color: #ffffff;
            line-height: 16px;
            margin-left: 10px;
          }
        }
      }
      .formContainer {
        padding-top: 15px;
        .achievementItem {
          background: #ffffff;
          opacity: 1;
          padding: 20px;
          border-radius: 4px 4px 4px 4px;
          :deep(.el-collapse) {
            border-top: none;
            border-bottom: none;
            .el-collapse-item {
              .el-collapse-item__header {
                height: auto;
                border-bottom: none;
                .el-collapse-item__arrow {
                  color: #1966ff;
                }
              }
              .el-collapse-item__wrap {
                border-bottom: none;
                .el-collapse-item__content {
                  padding-bottom: 0;
                  .achievementContent {
                    margin-top: 15px;
                    .el-table__inner-wrapper::before {
                      background-color: transparent;
                    }
                    .el-table th.el-table__cell.is-leaf,
                    .el-table td.el-table__cell {
                      border-bottom: none;
                      border-top: 1px solid #ebeef5;
                    }
                    .el-table__row:first-child {
                      .el-table__cell {
                        border-top: none;
                      }
                    }
                  }
                }
              }
            }
          }
          .achievementHeader {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .title {
              font-size: 14px;
              font-family: PingFang SC, PingFang SC;
              font-weight: 400;
              color: #999999;
              line-height: 16px;
            }
            .toLeft {
              margin-right: 20px;
            }
            .active {
              color: #1966ff;
              margin-right: 3px;
            }
            .focus {
              font-size: 14px;
              font-family: PingFang SC, PingFang SC;
              font-weight: 600;
              color: #333333;
              line-height: 16px;
            }
          }
        }
        .activeCollapse {
          position: relative;
          :deep(.el-collapse) {
            .el-collapse-item {
              .el-collapse-item__header::before {
                content: '';
                position: absolute;
                background-color: #ebeef5;
                z-index: 3;
                width: 100%;
                height: 1px;
                left: 0;
                top: 51px;
              }
            }
          }
        }
        .hasList {
          padding-bottom: 15px;
        }
        .toTop {
          margin-top: 10px;
        }
        .tipsContainer {
          display: flex;
          justify-content: space-between;
          padding: 15px 0;
          .tips {
            font-size: 14px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            color: #999999;
            line-height: 16px;
          }
          .importBtn {
            width: 65px;
            height: 24px;
            background: #1966ff;
            border-radius: 4px 4px 4px 4px;
            opacity: 1;
            font-size: 14px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            color: #ffffff;
            line-height: 16px;
          }
        }
        .deleteContainer {
          height: 32px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          .svg-icon {
            width: 20px;
            height: 20px;
          }
        }
        :deep(.el-row) {
          .el-form-item {
            margin-bottom: 10px;
          }
          .toBottom {
            margin-bottom: 18px;
          }
          .toCenter {
            .el-form-item__label {
              justify-content: center;
            }
          }
          .el-form-item__label {
            font-size: 14px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            color: #999999;
          }
          .itemText {
            font-size: 14px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            color: #333333;
          }
        }
        :deep(.readInfoTable) {
          .el-table__header-wrapper {
            display: none;
          }
          td.el-table__cell {
            .cell {
              font-size: 14px;
              font-family: PingFang SC, PingFang SC;
              font-weight: 400;
              color: #333333;
              line-height: 20px;
              .columnContainer {
                display: flex;
                align-items: center;
                .svg-icon {
                  margin-right: 5px;
                }
              }
            }
          }
        }
      }
    }
    .toTop {
      margin-top: 20px;
    }
  }
}
</style>
