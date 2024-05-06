<template>
  <el-drawer
    v-model="drawerVisible"
    title="编辑学生"
    direction="rtl"
    :size="wSize"
    class="drawerContainer"
    :append-to-body="true"
    @close="closeDrawer"
  >
    <template #header="{ titleId, titleClass }">
      <h4 :id="titleId" :class="[titleClass, 'title']">编辑学生</h4>
      <el-button type="primary" class="submitBtn" @click="submitStudent"
        >提交</el-button
      >
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
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="学生姓名" prop="studentName">
                    <div class="itemText">{{ studentForm.studentName }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="性别" prop="genderStr">
                    <div class="itemText">{{ studentForm.genderStr }}</div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="学号" prop="studentCode">
                    <div class="itemText">{{ studentForm.studentCode }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="身份证号" prop="certificateNumber">
                    <div class="itemText">
                      {{ studentForm.certificateNumber }}
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item
                    label="家长姓名"
                    prop="parentName"
                    :rules="[
                      {
                        required: true,
                        message: '请输入家长姓名',
                        trigger: 'blur'
                      },
                      {
                        validator: validateChineseOrEnglish,
                        trigger: 'blur',
                        message: '请输入中文或者英文'
                      }
                    ]"
                  >
                    <el-input
                      v-model="studentForm.parentName"
                      maxlength="30"
                      clearable
                      placeholder="请输入"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="联系方式"
                    prop="contacts"
                    :rules="[
                      {
                        required: true,
                        message: '请输入联系方式',
                        trigger: 'blur'
                      },
                      {
                        validator: phoneRule,
                        trigger: 'blur',
                        message: '请输入正确的手机号'
                      }
                    ]"
                  >
                    <el-input
                      v-model="studentForm.contacts"
                      maxlength="11"
                      clearable
                      placeholder="请输入"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="成绩背景" prop="academicBackground">
                    <div class="itemText">
                      {{ studentForm.academicBackground }}
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="moduleListLine"></div>
              <el-row>
                <el-col :span="24">
                  <el-form-item
                    label="培养类型"
                    prop="trainingPlanList"
                    :rules="[
                      {
                        required: true,
                        message: '请选择培养类型',
                        trigger: 'change'
                      }
                    ]"
                  >
                    <el-select
                      v-model="studentForm.trainingPlanList"
                      placeholder="请选择"
                      multiple
                      clearable
                    >
                      <el-option
                        v-for="item in trainingPlanOptions"
                        :key="item.code"
                        :label="item.msg"
                        :value="item.code"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="入学时间" prop="enrolment">
                    <div class="itemText">{{ studentForm.enrolment }}</div>
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
                      <el-table-column
                        label="时间"
                        prop="schoolYear"
                        align="center"
                      >
                        <template #default="{ row }">
                          <div v-if="row.studyRecordId">
                            {{ row.schoolYear }}
                          </div>
                          <el-select
                            v-else
                            v-model="row.schoolYear"
                            placeholder="请选择"
                            clearable
                          >
                            <el-option
                              v-for="item in currentSchoolYearsOptions"
                              :key="item.code"
                              :label="item.msg"
                              :value="item.msg"
                            />
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="就读信息"
                        prop="detail"
                        align="center"
                      >
                        <template #default="{ row }">
                          <div v-if="row.studyRecordId">{{ row.detail }}</div>
                          <el-input
                            v-else
                            v-model="row.detail"
                            maxlength="50"
                            show-word-limit
                            clearable
                            placeholder="请输入就读信息"
                          />
                        </template>
                      </el-table-column>
                      <el-table-column width="50px" align="center">
                        <template #default="{ row, $index }">
                          <svg-icon
                            v-if="!row.studyRecordId"
                            icon-class="delete"
                            @click="deleteTudyRecord($index)"
                          ></svg-icon>
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-button
                      type="primary"
                      class="studyRecordBtn"
                      v-if="studentForm.studentType == 0 && studyRecordFlag"
                      @click="addStudyRecord"
                      >添加记录</el-button
                    >
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item
                    label="学生状态"
                    prop="studentStatus"
                    :rules="[
                      {
                        required: true,
                        message: '请选择学生状态',
                        trigger: 'change'
                      }
                    ]"
                  >
                    <el-select
                      v-model="studentForm.studentStatus"
                      clearable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in studentStatusOptions"
                        :key="item.code"
                        :label="item.msg"
                        :value="item.code"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="studentForm.studentStatus === 2">
                  <el-form-item
                    label="录取学校"
                    prop="admissionSchool"
                    :rules="[
                      {
                        required: true,
                        message: '请输入录取学校',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input
                      v-model="studentForm.admissionSchool"
                      maxlength="30"
                      clearable
                      placeholder="请输入"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="studentForm.studentStatus === 2">
                  <el-form-item
                    label="录取渠道"
                    prop="admissionChannel"
                    :rules="[
                      {
                        required: true,
                        message: '请选择录取渠道',
                        trigger: 'change'
                      }
                    ]"
                  >
                    <el-select
                      v-model="studentForm.admissionChannel"
                      clearable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in admissionChannelOptions"
                        :key="item.code"
                        :label="item.msg"
                        :value="item.code"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" v-if="studentForm.studentStatus === 3">
                  <el-form-item
                    label="流生原因"
                    prop="wastageReasons"
                    :rules="[
                      {
                        required: true,
                        message: '请输入流生原因',
                        trigger: 'change'
                      }
                    ]"
                  >
                    <el-input
                      type="textarea"
                      :rows="2"
                      v-model="studentForm.wastageReasons"
                      maxlength="50"
                      clearable
                      :show-word-limit="true"
                      placeholder="请输入"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="studentForm.studentStatus === 4">
                <el-col :span="24">
                  <el-form-item
                    label="备注"
                    prop="endTeachRemark"
                    :rules="[
                      {
                        required: false,
                        message: '请输入备注',
                        trigger: 'change'
                      }
                    ]"
                  >
                    <el-input
                      type="textarea"
                      :rows="4"
                      v-model="studentForm.endTeachRemark"
                      maxlength="300"
                      clearable
                      :show-word-limit="true"
                      placeholder="请输入"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="moduleList toTop">
            <h4 class="title">带教教练</h4>
            <div class="formContainer">
              <el-row
                v-for="(item, index) in studentForm.teacherInfoList"
                :key="index"
                :gutter="20"
              >
                <el-col :span="11">
                  <el-form-item
                    label="竞赛学科"
                    :prop="'teacherInfoList.' + index + '.subject'"
                    :rules="[
                      {
                        required: true,
                        message: '请选择竞赛学科',
                        trigger: 'change'
                      }
                    ]"
                  >
                    <el-select
                      v-model="item.subject"
                      @change="changeSubject($event, index)"
                      clearable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in subjectOptions"
                        :key="item.code"
                        :label="item.msg"
                        :value="item.code"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item
                    label="教练"
                    :prop="'teacherInfoList.' + index + '.teacherId'"
                    :rules="[
                      { required: true, message: '请输入教练', trigger: 'blur' }
                    ]"
                  >
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
                      :remote-method="
                        queryString => {
                          querySearchAsync(
                            queryString,
                            item.subject,
                            index,
                            true
                          );
                        }
                      "
                      @change="handleTeacherSelect($event, index)"
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
                <el-col
                  :span="2"
                  @click="deleteInstructor(index)"
                  class="deleteContainer"
                >
                  <svg-icon icon-class="delete"></svg-icon>
                </el-col>
              </el-row>
              <el-row v-if="studentForm.teacherInfoList.length < 3">
                <el-col :span="24" class="btns">
                  <el-button type="primary" @click="addInstructor"
                    >添加记录</el-button
                  >
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="moduleList toTop">
            <h4 class="title">获奖情况</h4>
            <div class="formContainer">
              <template
                v-for="(item, index) in studentForm.studentsAwardRecordList"
                :key="index"
              >
                <el-row :gutter="20">
                  <el-col :span="11">
                    <el-form-item
                      label="获得奖项"
                      :prop="'studentsAwardRecordList.' + index + '.awardName'"
                      :rules="[
                        {
                          required: true,
                          message: '请输入获得奖项',
                          trigger: 'blur'
                        }
                      ]"
                    >
                      <el-input
                        v-model="item.awardName"
                        maxlength="30"
                        clearable
                        placeholder="请输入"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item
                      label="奖项级别"
                      :prop="'studentsAwardRecordList.' + index + '.awardLevel'"
                    >
                      <el-select
                        v-model="item.awardLevel"
                        clearable
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in awardLevelOptions"
                          :key="item.code"
                          :label="item.msg"
                          :value="item.code"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col
                    :span="2"
                    @click="deleteAwards(index)"
                    class="deleteContainer"
                  >
                    <svg-icon icon-class="delete"></svg-icon>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="11">
                    <el-form-item
                      label="获奖时间"
                      :prop="'studentsAwardRecordList.' + index + '.awardTime'"
                      :rules="[
                        {
                          required: true,
                          message: '请选择获奖时间',
                          trigger: 'change'
                        }
                      ]"
                    >
                      <el-date-picker
                        v-model="item.awardTime"
                        type="date"
                        placeholder="请选择时间"
                        size="default"
                        value-format="YYYY-MM-DD"
                        format="YYYY-MM-DD"
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item
                      label="带教教练"
                      :prop="'studentsAwardRecordList.' + index + '.teacherId'"
                    >
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
                        :remote-method="
                          queryString => {
                            queryCoachSearchAsync(queryString, index);
                          }
                        "
                        @change="handleCoachSelect($event, index)"
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
                  <el-col :span="2"></el-col>
                </el-row>
                <div class="moduleListLine"></div>
              </template>
              <el-row v-if="studentForm.studentsAwardRecordList.length < 30">
                <el-col :span="24" class="btns">
                  <el-button type="primary" @click="addAwards"
                    >添加记录</el-button
                  >
                </el-col>
              </el-row>
            </div>
          </div>
        </el-form>
      </div>
    </template>
  </el-drawer>
</template>
<script lang="ts" setup name="editStudent">
import {
  onMounted,
  getCurrentInstance,
  ref,
  reactive,
  watchEffect,
  computed
} from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  phoneRule,
  validateChineseOrEnglish,
  validateIdCard
} from '@/utils/validate';
const router = useRouter();
const _this: any = getCurrentInstance();
const API: any = _this.proxy.$API;
const message: any = _this.proxy.$Message;
const drawerVisible = ref(false);
const studentFormRef = ref(null);
import { useStore } from 'vuex';
import { deepClone } from '@/utils/utils';
const store = useStore();
const trainingPlanOptions = computed(() => store.state.trainingPlan);
const studentStatusOptions = computed(() => store.state.studentStatus);
const subjectOptions = computed(() => store.state.subject);
const awardLevelOptions = computed(() => store.state.awardLevel);
const admissionChannelOptions = computed(() => store.state.admissionChannel);
const currentSchoolYearsOptions = computed(
  () => store.state.currentSchoolYears
);
const windowSizeData = computed(() => store.state.windowSize);
const wSize = ref('45%');

const listData = ref({});
const openDrawer = row => {
  if (row) {
    listData.value = row;
    queryStudentDetail();
    queryCoachSearchAsync('', '');
  }
  studyRecordFlag.value = true;
  drawerVisible.value = true;
};

const closeDrawer = () => {
  studentFormRef.value.resetFields();
  drawerVisible.value = false;
};

const studentForm = ref({
  studentName: '', //学生姓名
  genderStr: '', //性别
  studentCode: '', //学号
  certificateNumber: '', //身份证号
  parentName: '', //家长姓名
  contacts: '', //联系方式
  academicBackground: '', //成绩背景
  trainingPlanList: [], //培养类型
  studentType: '', //学生类型
  studyRecordList: [], //就读信息
  studentStatus: '', //学生状态
  admissionSchool: '', //录取学校
  admissionChannel: '', //录取渠道
  wastageReasons: '', //流生原因
  endTeachRemark: '',
  enrolment: '', //入学时间
  teacherInfoMap: {}, // 带教教练
  teacherInfoList: [
    //带教教练 交互字段
    {
      subject: '',
      teacherName: '',
      teacherId: [],
      teacherOptions: []
    }
  ],
  studentsAwardRecordList: [
    //获奖情况
    {
      studentsAwardId: '', // 编辑奖项的id
      awardName: '', //奖项名称
      awardLevel: '', //奖项级别
      awardTime: '', //获奖时间
      teacherInfoList: [], //指导教练
      teacherId: [], // 教练名称
      teacherOptions: [] // 教练下拉选项数据
    }
  ]
});

// eslint-disable-next-line no-undef
const emit = defineEmits(['refresh-page']);

// 添加就读信息
const studyRecordFlag = ref(true);
const addStudyRecord = () => {
  studentForm.value.studyRecordList.push({ schoolYear: '', detail: '' });
  studyRecordFlag.value = false;
};
// 删除记录
const deleteTudyRecord = index => {
  studentForm.value.studyRecordList.splice(index, 1);
  studyRecordFlag.value = true;
};

//添加带教教练记录
const addInstructor = () => {
  studentForm.value.teacherInfoList.push({
    subject: '',
    teacherName: '',
    teacherId: [],
    teacherOptions: []
  });
};
//删除带教教练记录
const deleteInstructor = index => {
  studentForm.value.teacherInfoList.splice(index, 1);
};

//竞赛学科切换 清除教练
const subjectNew = ref([]);
const changeSubject = (val, index) => {
  studentForm.value.teacherInfoList[index].teacherId = [];
  studentForm.value.teacherInfoList[index].teacherOptions = [];
  if (
    studentForm.value.teacherInfoList &&
    studentForm.value.teacherInfoList.length > 1
  ) {
    subjectNew.value = studentForm.value.teacherInfoList.slice(0, index);
    let elIndex = subjectNew.value.findIndex(
      el => el.subject !== '' && el.subject === val
    );
    if (elIndex !== -1) {
      ElMessage({
        message: '科目不支持重复选择',
        type: 'error'
      });
      studentForm.value.teacherInfoList[index].subject = '';
    }
  }
};

// 教练模糊查询

// 教练模糊查询接口方法
const remoteQuery = (query, subject, index) => {
  const params = {
    keyWord: query,
    subject: [],
    pageNum: 1,
    pageSize: -1,
    isEnable: 1
  };
  if (subject && subject !== '') {
    params.subject.push(subject);
  } else {
    params.subject = [];
  }
  API.teacher.pageTeacherInfo(params).then(res => {
    if (res.records && res.records.length > 0) {
      let results = res.records.map(el => {
        return {
          label: el.teacherName + '(' + el.staffCode + ')',
          value: el.teacherId
        };
      });
      studentForm.value.teacherInfoList[index].teacherOptions = results;
    } else {
      studentForm.value.teacherInfoList[index].teacherOptions = [];
    }
  });
};

// 教练模糊查询
const querySearchAsync = (query, subject, index, autoFlag) => {
  if (subject === '') {
    ElMessage({
      message: '请选择竞赛科目',
      type: 'error'
    });
    return;
  }
  if (autoFlag) {
    if (query) {
      remoteQuery(query, subject, index);
    }
  } else {
    remoteQuery(query, subject, index);
  }
};
const handleTeacherSelect = (val, index) => {
  //console.log(studentForm.value.teacherInfoList[index].teacherId, "teacherId");
};
//添加获奖情况
const addAwards = () => {
  studentForm.value.studentsAwardRecordList.push({
    studentsAwardId: '', // 编辑奖项的id
    awardName: '', //奖项名称
    awardLevel: '', //奖项级别
    awardTime: '', //获奖时间
    teacherInfoList: [], //指导教练
    teacherId: [], // 教练名称
    teacherOptions: [] // 教练下拉选项数据
  });
};
//删除删除获奖
const deleteAwards = index => {
  studentForm.value.studentsAwardRecordList.splice(index, 1);
};
const handleCoachSelect = (val, index) => {
  let list = [];
  if (val && val.length > 0) {
    if (val.length > 3) {
      ElMessage({
        message: '最多选择3个带教教练',
        type: 'error'
      });
      return;
    }
    val.forEach(el => {
      list.push({ teacherId: el });
    });
  }
  studentForm.value.studentsAwardRecordList[index].teacherInfoList = list;
};

const coachOptions = ref([]);
const queryCoachSearchAsync = (query, index) => {
  const params = {
    keyWord: query,
    subject: [],
    pageNum: 1,
    pageSize: -1,
    isEnable: 1
  };
  API.teacher.pageTeacherInfo(params).then(res => {
    if (res.records && res.records.length > 0) {
      let results = res.records.map(el => {
        return {
          label: el.teacherName + '(' + el.staffCode + ')',
          value: el.teacherId
        };
      });
      if (index !== '') {
        studentForm.value.studentsAwardRecordList[index].teacherOptions =
          results;
      } else {
        coachOptions.value = results;
      }
    } else {
      if (index !== '') {
        studentForm.value.studentsAwardRecordList[index].teacherOptions = [];
      } else {
        coachOptions.value = [];
      }
    }
  });
};

// 编辑提交
const submitStudent = () => {
  const params = {
    studentId: listData.value?.studentId, //学生id
    studentCode: listData.value?.studentCode, //学生学号
    parentName: studentForm.value.parentName, //家长姓名
    contacts: studentForm.value.contacts, //联系方式
    trainingPlanList: studentForm.value.trainingPlanList, //培养类型
    studyRecordList: studentForm.value.studyRecordList, //就读信息
    studentStatus: studentForm.value.studentStatus, //学生状态
    admissionSchool: studentForm.value.admissionSchool, //录取学校
    admissionChannel: studentForm.value.admissionChannel, //录取渠道
    wastageReasons: studentForm.value.wastageReasons, //流生原因
    teacherInfoMap: {}, //带教教练
    studentsAwardRecordList: [], //获奖情况
    endTeachRemark: studentForm.value.endTeachRemark
  };
  // 就读信息必填校验
  if (
    studentForm.value.studyRecordList &&
    studentForm.value.studyRecordList.length > 0
  ) {
    const requiredSchoolYear = [];
    const requiredDetail = [];
    studentForm.value.studyRecordList.forEach(el => {
      if (
        el.schoolYear === '' ||
        el.schoolYear === null ||
        el.schoolYear === undefined
      ) {
        requiredSchoolYear.push(false);
      } else {
        requiredSchoolYear.push(true);
      }
      if (el.detail === '' || el.detail === null || el.detail === undefined) {
        requiredDetail.push(false);
      } else {
        requiredDetail.push(true);
      }
    });
    if (requiredSchoolYear.indexOf(false) !== -1) {
      ElMessage({
        message: '请选择就读时间',
        type: 'error'
      });
      return;
    }
    if (requiredDetail.indexOf(false) !== -1) {
      ElMessage({
        message: '请填写就读信息',
        type: 'error'
      });
      return;
    }
  }

  // 带教教练提交数据结构调整
  if (
    studentForm.value.teacherInfoList &&
    studentForm.value.teacherInfoList.length > 0
  ) {
    studentForm.value.teacherInfoList.forEach(el => {
      let subject = el.subject;
      params.teacherInfoMap[subject] = [];
      if (el.teacherId && el.teacherId.length > 0) {
        el.teacherId.forEach(val => {
          params.teacherInfoMap[subject].push({
            teacherId: val
          });
        });
      }
    });
  }
  // 获奖情况提交数据结构调整
  if (
    studentForm.value.studentsAwardRecordList &&
    studentForm.value.studentsAwardRecordList.length > 0
  ) {
    studentForm.value.studentsAwardRecordList.forEach(el => {
      let listData = {
        studentsAwardId: el.studentsAwardId,
        awardName: el.awardName,
        awardLevel: el.awardLevel,
        awardTime: el.awardTime,
        teacherInfoList: el.teacherInfoList
      };
      params.studentsAwardRecordList.push(listData);
    });
  }

  studentFormRef.value.validate(valid => {
    if (valid) {
      ElMessageBox.confirm('确认提交当前操作内容？', '提交确认', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        closeOnClickModal: false
      })
        .then(() => {
          API.student.editStudentInfo(params).then(res => {
            if (res) {
              emit('refresh-page', 'edit');
              ElMessage({
                message: '编辑成功',
                type: 'success'
              });
              closeDrawer();
              studyRecordFlag.value = true;
            }
          });
        })
        .catch(() => {});
    }
  });
};

// 获取学生详情
const queryStudentDetail = () => {
  const params = {
    studentCode: listData.value?.studentCode
  };
  API.student.queryStudentInfo(params).then(res => {
    if (res) {
      studentForm.value = deepClone(res);
      studentForm.value.teacherInfoList = [];
      let index = -1;
      if (res?.teacherInfoMap && Object.keys(res?.teacherInfoMap).length > 0) {
        for (let key in res?.teacherInfoMap) {
          let teacherCodeArrar = [];
          if (res?.teacherInfoMap[key] && res?.teacherInfoMap[key].length > 0) {
            res?.teacherInfoMap[key].forEach(te => {
              teacherCodeArrar.push(te.teacherId);
            });
          }
          // 带教教练数据回显
          let list = {
            subject: parseInt(key, 10),
            teacherId: teacherCodeArrar,
            teacherOptions: []
          };
          studentForm.value.teacherInfoList.push(list);
          index++;
          querySearchAsync('', list.subject, index, false);
        }
      }

      studentForm.value.studentsAwardRecordList = [];
      if (
        res?.studentsAwardRecordList &&
        res?.studentsAwardRecordList.length > 0
      ) {
        res?.studentsAwardRecordList.forEach(item => {
          item.teacherId = [];
          item.teacherOptions = coachOptions.value;
          if (item.teacherInfoList && item.teacherInfoList.length > 0) {
            item.teacherInfoList.forEach(el => {
              item.teacherId.push(el.teacherId);
            });
          }
          studentForm.value.studentsAwardRecordList.push(item);
        });
      }
    }
  });
};

watchEffect(() => {
  if (windowSizeData.value && windowSizeData.value.width > 2000) {
    wSize.value = '35%';
  } else {
    wSize.value = '45%';
  }
});

onMounted(() => {});
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
        padding-top: 20px;
        .deleteContainer {
          height: 32px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }
        :deep(.el-row) {
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
          .studyRecordBtn {
            margin-top: 15px;
          }
        }
        .moduleListLine {
          width: 100%;
          height: 1px;
          background-color: #ebeef5;
          margin-bottom: 18px;
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
