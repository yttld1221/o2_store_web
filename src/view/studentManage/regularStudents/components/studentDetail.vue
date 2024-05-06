<template>
  <el-drawer
    v-model="drawerVisible"
    direction="rtl"
    :size="wSize"
    class="drawerDetailContainer"
    :append-to-body="true"
  >
    <template #header="{ titleId, titleClass }">
      <h4 :id="titleId" :class="[titleClass, 'title']">
        <span
          :class="[
            'titleLabel',
            studentStatusColor(studentForm?.studentStatus)
          ]"
          >{{ studentForm?.studentStatusStr }} ｜ 入学时间：{{
            studentForm.enrolment
          }}</span
        >
      </h4>
    </template>
    <template #default>
      <div class="bodyContainer">
        <el-form
          :model="studentForm"
          ref="studentFormRef"
          label-width="85px"
          label-position="left"
        >
          <div class="moduleList">
            <h4 class="title">基础信息</h4>
            <div class="formContainer">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="学生姓名" prop="">
                    <div class="itemText">{{ studentForm.studentName }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="性别" prop="">
                    <div class="itemText">{{ studentForm.genderStr }}</div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="学号" prop="">
                    <div class="itemText">{{ studentForm.studentCode }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="身份证号" prop="">
                    <div class="itemText">
                      {{ studentForm.certificateNumber }}
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="家长姓名" prop="">
                    <div class="itemText">{{ studentForm.parentName }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系电话" prop="">
                    <div class="itemText">{{ studentForm.contacts }}</div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="成绩背景" prop="">
                    <div class="itemText">
                      {{ studentForm.academicBackground }}
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="moduleListLine"></div>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="培养类型" prop="">
                    <ul class="trainContainer">
                      <li
                        class="trainItem"
                        v-for="(item, index) in studentForm.trainingPlanList"
                      >
                        <div class="trainImg">
                          <img :src="getTrainingPlanImg(item)" alt="" />
                        </div>
                        <div class="trainLabel">
                          {{ getTrainingPlanDesc(item) }}
                        </div>
                      </li>
                    </ul>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="就读信息" prop="">
                    <el-table
                      :data="studentForm.studyRecordList"
                      class="readInfoTable"
                    >
                      <el-table-column label="时间" prop="schoolYear" />
                      <el-table-column label="就读信息" prop="detail" />
                    </el-table>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="studentForm.studentStatus === 2">
                <el-col :span="12">
                  <el-form-item label="录取学校" prop="">
                    <div class="itemText">
                      {{ studentForm.admissionSchool }}
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="录取渠道" prop="">
                    <div class="itemText">
                      {{ studentForm.admissionChannelStr }}
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="studentForm.studentStatus === 3">
                <el-col :span="24">
                  <el-form-item label="流生原因" prop="">
                    <div class="itemText">
                      {{ studentForm.wastageReasons }}
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="studentForm.studentStatus === 4">
                <el-col :span="24">
                  <el-form-item label="备注" prop="">
                    <div class="remark-box">
                      <p
                        v-permission="{ action: $route.path + '/remarkEdit' }"
                        class="remark-btn"
                        @click="changeRemark"
                      >
                        {{ remarkStatus ? '保存' : '编辑' }}
                      </p>
                      <div
                        v-if="!remarkStatus"
                        class="itemText"
                        v-html="studentForm.endTeachRemark"
                        style="
                          width: 100%;
                          word-break: break-all;
                          white-space: pre-wrap;
                        "
                      ></div>
                      <el-input
                        v-else
                        type="textarea"
                        :rows="4"
                        v-model="newRemark"
                        maxlength="300"
                        clearable
                        :show-word-limit="true"
                        placeholder="请输入"
                      />
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="moduleList toTop">
            <h4 class="title">带教教练</h4>
            <div class="formContainer">
              <el-form :model="studentForm.teacherInfoMap" label-width="85px">
                <el-row
                  v-for="(item, index) in studentForm.teacherInfoMap"
                  :key="index"
                >
                  <el-col :span="12">
                    <el-form-item label="竞赛学科" prop="">
                      <div class="itemText">{{ item.subjectStr }}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="教练" prop="">
                      <div class="itemText">{{ item.teacherName }}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
          <div
            class="moduleList toTop"
            v-if="studentForm.studentsAwardRecordList.length > 0"
          >
            <h4 class="title">获奖情况</h4>
            <div class="formContainer">
              <template
                v-for="(item, index) in studentForm.studentsAwardRecordList"
                :key="index"
              >
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="获得奖项" prop="">
                      <div class="itemText">{{ item.awardName }}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="获奖时间" prop="">
                      <div class="itemText">{{ item.awardTime }}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="奖项级别" prop="">
                      <div class="itemText">{{ item.awardLevelStr }}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="带教教练" prop="">
                      <div class="itemText">
                        {{ getTeacherName(item.teacherInfoList) }}
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <div class="moduleListLine"></div>
              </template>
            </div>
          </div>
          <div
            class="moduleList toTop"
            v-if="studentForm.anticipateRecordList.length > 0"
          >
            <h4 class="title">竞赛预测</h4>
            <div class="formContainer">
              <template
                v-for="(item, index) in studentForm.anticipateRecordList"
                :key="index"
              >
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="竞赛名称" prop="">
                      <div class="itemText">{{ item.missionsName }}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <template v-for="(el, elIndex) in item.anticipateRecords">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="成绩预测" prop="">
                        <div class="itemText">{{ el.awardLevelStr }}</div>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="预测教练" prop="">
                        <div class="itemText">
                          {{ el.teacherInfo.teacherName }}({{
                            el.teacherInfo.staffCode
                          }})
                        </div>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <div class="moduleListLine"></div>
                </template>
              </template>
            </div>
          </div>
        </el-form>
      </div>
    </template>
  </el-drawer>
</template>
<script lang="ts" setup name="addStudent">
import {
  onMounted,
  getCurrentInstance,
  ref,
  reactive,
  watchEffect,
  computed
} from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ElMessageBox } from 'element-plus';
import { deepClone } from '@/utils/utils';
import train1 from '@/assets/img/train-1.png';
import train2 from '@/assets/img/train-2.png';
import train3 from '@/assets/img/train-3.png';
import train4 from '@/assets/img/train-4.png';
import train5 from '@/assets/img/train-5.png';
import train6 from '@/assets/img/train-6.png';
const router = useRouter();
const store = useStore();
const _this: any = getCurrentInstance();
const API: any = _this.proxy.$API;
const message: any = _this.proxy.$Message;
const drawerVisible = ref(false);
const studentFormRef = ref(null);
const trainingPlanOptions = computed(() => store.state.trainingPlan);
const subjectOptions = computed(() => store.state.subject);
const windowSizeData = computed(() => store.state.windowSize);
const wSize = ref('45%');
const remarkStatus = ref(false);
const newRemark = ref('');
// 修改备注
const changeRemark = () => {
  if (!remarkStatus.value) {
    remarkStatus.value = true;
    newRemark.value = studentForm.value.endTeachRemark;
  } else {
    const params = {
      endTeachRemark: newRemark.value,
      studentId: studentForm.value.studentId
    };
    API.student.updateEndTeachRemark(params).then(res => {
      studentForm.value.endTeachRemark = newRemark.value;
      remarkStatus.value = false;
    });
  }
};

// 获取学生详情
const listData = ref({});
const queryStudentDetail = () => {
  const params = {
    studentCode: listData.value?.studentCode
  };
  API.student.queryStudentInfo(params).then(res => {
    if (res) {
      studentForm.value = deepClone(res);
      studentForm.value.teacherInfoMap = [];
      if (res?.teacherInfoMap && Object.keys(res?.teacherInfoMap).length > 0) {
        for (let key in res?.teacherInfoMap) {
          let subjectTxt = subjectOptions.value.find(
            item => item.code == key
          )?.msg;
          let teacherNameArrar = [];
          if (res?.teacherInfoMap[key] && res?.teacherInfoMap[key].length > 0) {
            res?.teacherInfoMap[key].forEach(te => {
              let nameList = te.teacherName + '(' + te.staffCode + ')';
              teacherNameArrar.push(nameList);
            });
          }
          studentForm.value.teacherInfoMap.push({
            subjectStr: subjectTxt,
            teacherName: teacherNameArrar.join('、')
          });
        }
      }
    }
  });
};
const studentStatusColor = code => {
  if (code === 1) {
    return 'reading';
  } else if (code === 2) {
    return 'graduate';
  } else if (code === 3 || code === 4) {
    return 'loss';
  }
};
const openDrawer = row => {
  if (row) {
    listData.value = row;
    queryStudentDetail();
  }
  drawerVisible.value = true;
  remarkStatus.value = false;
};

const closeDrawer = () => {
  drawerVisible.value = false;
};

const studentForm = ref({
  studentStatus: '', //学生状态
  studentStatusStr: '', //学生状态 name
  enrolment: '', //入学时间
  studentName: '', //学生姓名
  genderStr: '', //性别
  studentCode: '', //学号
  certificateNumber: '', //身份证号
  parentName: '', //家长姓名
  contacts: '', //联系方式
  academicBackground: '', //成绩背景
  trainingPlanList: [], //培养类型
  studyRecordList: [], //就读信息
  admissionSchool: '', //录取学校
  admissionChannelStr: '', //录取渠道
  wastageReasons: '', //流生原因
  teacherInfoMap: [
    //带教教练
    { subjectStr: '', teacherName: '', staffCode: '' }
  ],
  studentsAwardRecordList: [
    //获奖情况
    {
      awardName: '', //奖项名称
      awardLevelStr: '', //奖项级别
      awardTime: '', //获奖时间
      teacherInfoList: [], //指导教练
      teacherName: '' // 教练名称
    }
  ],
  anticipateRecordList: [
    //竞赛预测
    {
      missionsName: '', //竞赛名称
      anticipateRecords: [
        //成绩记录
        {
          awardLevelStr: '', //奖项名称
          teacherInfo: {
            teacherName: '', //预测教练
            staffCode: '' // 工号
          }
        }
      ]
    }
  ]
});

//
const getTrainingPlanImg = code => {
  let imgArr = [train1, train2, train3, train4, train5, train6];
  if (code) {
    return imgArr[code - 1];
  }
};
// 获取培养类型文字
const getTrainingPlanDesc = code => {
  let text = '';
  if (code) {
    text = trainingPlanOptions.value.find(item => item.code == code)?.msg;
  }
  return text;
};

//获取带教教练名称
const getTeacherName = list => {
  let textArr = [];
  if (list && list.length > 0) {
    list.forEach(item => {
      if (item.teacherName) {
        textArr.push(item.teacherName + '(' + item.staffCode + ')');
      }
    });
  }
  return textArr.join('、');
};

watchEffect(() => {
  if (windowSizeData.value && windowSizeData.value.width > 2000) {
    wSize.value = '35%';
  } else {
    wSize.value = '45%';
  }
});

defineExpose({
  openDrawer,
  closeDrawer
});
</script>

<style lang="scss" scoped>
.drawerDetailContainer {
  .bodyContainer {
    .moduleList {
      padding: 15px 20px;
      width: 100%;
      background: #f8fafd;
      border-radius: 8px 8px 8px 8px;
      opacity: 1;
      .title {
        width: 100%;
        border-bottom: 1px solid #ebeef5;
        font-size: 14px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        color: #333333;
        padding-bottom: 10px;
      }
      .formContainer {
        padding-top: 15px;
        .deleteContainer {
          height: 32px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }
        :deep(.el-row) {
          .el-form-item {
            margin-bottom: 10px;
            .trainContainer {
              display: flex;
              .trainItem {
                margin-right: 15px;
                .trainImg {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  img {
                    width: 48px;
                    height: 48px;
                  }
                }
                .trainLabel {
                  font-size: 14px;
                  font-family: PingFang SC, PingFang SC;
                  font-weight: 400;
                  color: #3d3d3d;
                  padding-top: 5px;
                  line-height: 25px;
                  text-align: center;
                }
              }
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
          .readInfoTable {
            th.el-table__cell {
              .cell {
                font-size: 14px;
                font-family: PingFang SC, PingFang SC;
                font-weight: 600;
                color: #333333;
                line-height: 20px;
              }
            }
            td.el-table__cell {
              .cell {
                font-size: 14px;
                font-family: PingFang SC, PingFang SC;
                font-weight: 400;
                color: #333333;
                line-height: 20px;
              }
            }
          }
        }
        .moduleListLine {
          width: 100%;
          height: 1px;
          background-color: #ebeef5;
          margin-bottom: 15px;
        }
      }
    }
    .toTop {
      margin-top: 20px;
    }
  }
  .remark-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    .remark-btn {
      cursor: pointer;
      color: #409eff;
    }
  }
}
</style>
