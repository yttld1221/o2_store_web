<template>
  <div class="test-manage">
    <div class="queryModule">
      <queryHeader title="测试学生">
        <template #queryBtns>
          <el-button @click="resetForm(true)">重置</el-button>
          <el-button type="primary" @click="searchForm">查询</el-button>
        </template>
        <template #queryForm>
          <rowsDynamicForm
            ref="rowsDynamicFormRef"
            :formData="formData"
            :formItems="formItems"
            :formAttrs="formAttrs"
            :colsMax="4"
            @change-value="changeModel"
          ></rowsDynamicForm>
        </template>
      </queryHeader>
    </div>
    <line-radius />
    <div class="listModule">
      <div
        class="btnsContainer"
        v-permission="{ action: $route.path + '/export' }"
      >
        <div class="btns right">
          <el-button type="primary" @click="exportData">导出全部</el-button>
        </div>
      </div>
      <common-table
        ref="tableRef"
        :tableHeader="tableHeader"
        :propsTableData="tableData"
        :loading="true"
        :queryParams="paramsPage"
        :ajaxGetData="getTableData"
        :paginationConfig="paginationConfig"
      >
        <template v-slot:column|competitionSubject="scope">
          {{ subjectObj[scope.row.competitionSubject] }}
        </template>
        <template v-slot:column|teacherName="scope">
          {{
            scope.row.teacherInfo?.teacherName
              ? scope.row.teacherInfo?.teacherName
              : '-'
          }}
        </template>
        <template v-slot:column|status="scope">
          <span
            class="state-box"
            :style="{
              color: stateObj[scope.row.status].color,
              background: stateObj[scope.row.status].background
            }"
            >{{ stateObj[scope.row.status].text }}</span
          >
        </template>
        <template v-slot:column|btn="scope">
          <el-button type="text" @click="detailHandle(scope.row, 1)"
            >查看</el-button
          >
          <el-button
            v-if="[1, 2].includes(scope.row.status)"
            v-permission="{ action: $route.path + '/assign' }"
            type="text"
            @click="detailHandle(scope.row, 2)"
            >指派</el-button
          >
          <el-button
            v-if="[3].includes(scope.row.status)"
            v-permission="{ action: $route.path + '/resultReport' }"
            type="text"
            @click="detailHandle(scope.row, 3)"
            >结果填报</el-button
          >
        </template>
      </common-table>
    </div>
    <el-drawer v-model="drawer" direction="rtl" :before-close="handleClose">
      <template #header>
        <div class="drawer-title flex-align">
          <div
            v-if="ruleForm.status"
            class="title-text"
            :style="{
              color: stateObj[ruleForm.status].color,
              background: stateObj[ruleForm.status].background
            }"
          >
            {{ stateObj[ruleForm.status].text }}
          </div>
          <el-button
            v-if="[2, 3].includes(dialogTitle)"
            type="primary"
            @click="submitStudent()"
            >提交</el-button
          >
        </div>
      </template>
      <el-form
        label-position="left"
        label-width="85px"
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
      >
        <div class="test-info">
          <div class="info-title">报名信息</div>
          <div class="info-box">
            <div class="flex-align info-block">
              <el-form-item label-width="0">
                <el-form-item label-width="auto" label="姓名">{{
                  ruleForm?.studentName
                }}</el-form-item>
                <el-form-item label-width="auto" label="性别">{{
                  ruleForm.gender == 1 ? '男' : '女'
                }}</el-form-item>
              </el-form-item>
              <el-form-item label="身份证号">{{
                ruleForm?.certificateNumber
              }}</el-form-item>
            </div>
            <div class="flex-align info-block">
              <el-form-item label="原学校城市">{{
                ruleForm?.previousSchoolCity
              }}</el-form-item>
              <el-form-item label="竞赛学科">{{
                subjectObj[ruleForm?.competitionSubject]
              }}</el-form-item>
              <el-form-item label="原就读学校">{{
                ruleForm?.previousSchool
              }}</el-form-item>
              <el-form-item label="体验日期">{{
                ruleForm?.experienceDate
              }}</el-form-item>
              <el-form-item label="原就读年级">{{
                ruleForm?.previousGradeLevelStr
              }}</el-form-item>
              <el-form-item label="推荐人"
                >{{ ruleForm.referrerInfo?.staffName }}（{{
                  ruleForm.referrerInfo?.staffCode
                }}）</el-form-item
              >
            </div>
            <div class="flex-align info-block grade-background">
              <el-form-item label="成绩背景">{{
                ruleForm?.academicBackground
              }}</el-form-item>
            </div>
            <div class="flex-align info-block parent-info">
              <el-form-item label="家长姓名">{{
                ruleForm?.parentName
              }}</el-form-item>
              <el-form-item label="联系电话">{{
                ruleForm?.contacts
              }}</el-form-item>
            </div>
          </div>
        </div>
        <div
          :class="{
            'teacher-assign-detail': ![1, 2].includes(ruleForm.status)
          }"
          class="test-info teacher-assign"
          v-if="
            [3, 4, 5, 6].includes(ruleForm.status) ||
            (dialogTitle == 2 && [1, 2].includes(ruleForm.status))
          "
        >
          <div class="info-title">教练指派</div>
          <div class="info-box">
            <div class="flex-align teacher-assign-block">
              <el-form-item
                label="学科"
                class="subject-form"
                label-width="auto"
                >{{ subjectObj[ruleForm?.competitionSubject] }}</el-form-item
              >
              <el-form-item label="教练" label-width="auto" prop="teacherId">
                <el-select
                  v-if="[1, 2].includes(ruleForm.status)"
                  style="width: 170px"
                  v-model="ruleForm.teacherId"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入"
                  remote-show-suffix
                  :remote-method="remoteMethod"
                >
                  <el-option
                    v-for="item in jlsel"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <template v-else
                  >{{ ruleForm.teacherInfo?.teacherName }}（{{
                    ruleForm.teacherInfo?.staffCode
                  }}）</template
                >
              </el-form-item>
            </div>
            <div class="flex-align teacher-assign-block">
              <el-form-item
                label-width="auto"
                label="时间"
                prop="examinationDate"
              >
                <el-date-picker
                  :disabled-date="disabledDate"
                  v-if="[1, 2].includes(ruleForm.status)"
                  style="width: 170px"
                  v-model="ruleForm.examinationDate"
                  type="datetime"
                  placeholder="请选择"
                  value-format="YYYY-MM-DD HH:mm"
                  format="YYYY-MM-DD HH:mm"
                  date-format="YYYY-MM-DD"
                  time-format="HH:mm"
                />
                <template v-else
                  >{{ ruleForm?.examinationDate
                  }}<span
                    @click="changeTime"
                    class="change-text"
                    v-if="
                      [3].includes(ruleForm.status) &&
                      (userInfo.roleCode == 'admin' ||
                        ruleForm.assignor == userInfo.staffCode)
                    "
                    >变更</span
                  ></template
                >
              </el-form-item>
              <el-form-item label-width="auto" label="地点" prop="location">
                <el-input
                  v-if="[1, 2].includes(ruleForm.status)"
                  style="width: 170px"
                  maxlength="50"
                  show-word-limit
                  v-model="ruleForm.location"
                  placeholder="请输入"
                />
                <template v-else>{{ ruleForm?.location }}</template>
              </el-form-item>
            </div>
          </div>
        </div>
        <div
          :class="{ 'teacher-assign-detail': ruleForm.status != 3 }"
          class="test-info teacher-assign"
          v-if="
            [4, 5, 6].includes(ruleForm.status) ||
            (dialogTitle == 3 && [3].includes(ruleForm.status))
          "
        >
          <div class="info-title">结果填报</div>
          <div class="info-box">
            <div class="flex-align teacher-assign-block">
              <el-form-item
                style="width: 100%"
                label="成绩"
                label-width="auto"
                prop="evaluationScores"
              >
                <div class="flex-align" v-if="ruleForm.status == 3">
                  <el-input
                    style="width: 170px"
                    show-word-limit
                    maxlength="10"
                    v-model.trim="ruleForm.evaluationScores"
                    placeholder="请输入"
                  ></el-input>
                  <span class="tips"
                    >提示：格式举例 200/600，解读 得分/总分</span
                  >
                </div>
                <div v-else>
                  {{ ruleForm?.evaluationScores
                  }}<span style="margin-left: 0" class="tips"
                    >（提示：得分/总分）</span
                  >
                </div>
              </el-form-item>
            </div>
            <div class="flex-align teacher-assign-block">
              <el-form-item label-width="auto" label="结果" prop="result">
                <el-select
                  v-if="ruleForm.status == 3"
                  style="width: 170px"
                  v-model="ruleForm.result"
                  placeholder="请选择"
                >
                  <el-option
                    :key="index"
                    v-for="(item, index) in getSel('result')"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <template v-else>{{
                  ruleForm.result ? '可录' : '不录'
                }}</template>
              </el-form-item>
              <el-form-item
                v-if="ruleForm.result == 1"
                label-width="auto"
                label="评级"
                prop="grading"
              >
                <el-select
                  v-if="ruleForm.status == 3"
                  style="width: 170px"
                  v-model="ruleForm.grading"
                  placeholder="请选择"
                >
                  <el-option
                    :key="index"
                    v-for="(item, index) in getSel('grading')"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <template v-else>{{ ruleForm?.grading }}</template>
              </el-form-item>
            </div>
            <div class="flex-align teacher-assign-block">
              <el-form-item
                class="subject-form"
                style="width: 100%"
                label="备注"
                label-width="auto"
                prop="remark"
              >
                <el-input
                  type="textarea"
                  :rows="4"
                  v-if="ruleForm.status == 3"
                  show-word-limit
                  maxlength="300"
                  v-model="ruleForm.remark"
                  placeholder="请输入"
                ></el-input>
                <div
                  v-html="ruleForm?.remark"
                  style="
                    width: 100%;
                    word-break: break-all;
                    white-space: pre-wrap;
                  "
                  v-else
                ></div>
              </el-form-item>
            </div>
          </div>
        </div>
        <div
          v-if="ruleForm.historyList && ruleForm.historyList.length"
          class="test-info teacher-assign teacher-assign-detail"
        >
          <div
            :class="{ closeHistory: !showHistory }"
            class="info-title flex-align history-title"
          >
            历史记录
            <div
              class="flex-align show-box"
              @click="showHistory = !showHistory"
            >
              <span style="margin-right: 5px">{{
                showHistory ? '收起' : '展开'
              }}</span>
              <el-icon v-if="showHistory"><ArrowUp /></el-icon>
              <el-icon v-else><ArrowDown /></el-icon>
            </div>
          </div>
          <transition name="fade" mode="out-in">
            <div v-show="showHistory" class="info-box" id="historyBox">
              <div
                class="info-item"
                v-for="(item, index) in ruleForm.historyList"
                :key="index"
              >
                <div class="flex-align teacher-assign-block">
                  <el-form-item label-width="auto" label="学科">
                    {{ subjectObj[item.competitionSubject] }}
                  </el-form-item>
                  <el-form-item label-width="auto" label="教练">
                    {{ item.teacherInfo?.teacherName }}（{{
                      item.teacherInfo?.staffCode
                    }}）
                  </el-form-item>
                </div>
                <div class="flex-align teacher-assign-block">
                  <el-form-item label-width="auto" label="时间">
                    {{ item?.examinationDate }}
                  </el-form-item>
                  <el-form-item label-width="auto" label="地点">
                    {{ item?.location }}
                  </el-form-item>
                </div>
                <div class="flex-align teacher-assign-block">
                  <el-form-item
                    style="width: 100%"
                    label="成绩"
                    label-width="auto"
                  >
                    <div>
                      {{ item?.evaluationScores
                      }}<span style="margin-left: 0" class="tips"
                        >（提示：得分/总分）</span
                      >
                    </div>
                  </el-form-item>
                </div>
                <div class="flex-align teacher-assign-block">
                  <el-form-item label-width="auto" label="结果">
                    {{ item?.result ? '可录' : '不录' }}
                  </el-form-item>
                  <el-form-item
                    v-if="item.result == 1"
                    label-width="auto"
                    label="评级"
                  >
                    {{ item?.grading }}
                  </el-form-item>
                </div>
                <div class="flex-align teacher-assign-block">
                  <el-form-item
                    class="subject-form"
                    style="width: 100%"
                    label="备注"
                    label-width="auto"
                  >
                    <div
                      v-html="item?.remark"
                      style="
                        width: 100%;
                        word-break: break-all;
                        white-space: pre-wrap;
                      "
                    ></div>
                  </el-form-item>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </el-form>
    </el-drawer>
    <el-dialog
      v-model="dialogVisible"
      title="变更确认"
      width="25%"
      :before-close="dialogClose"
    >
      <div class="dialog-box">
        <p>确认修改【{{ ruleForm.studentName }}】的测试时间为</p>
        <el-date-picker
          :disabled-date="disabledDate"
          style="width: 180px"
          v-model="timeStr"
          type="datetime"
          placeholder="请选择"
          value-format="YYYY-MM-DD HH:mm"
          format="YYYY-MM-DD HH:mm"
          date-format="YYYY-MM-DD"
          time-format="HH:mm"
        />
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogOk"> 确认 </el-button></template
      >
    </el-dialog>
  </div>
</template>
<script lang="ts" setup name="teacherIndex">
import {
  onMounted,
  reactive,
  getCurrentInstance,
  ref,
  nextTick,
  computed,
  watchEffect
} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus';
import commonTable from '@/components/commonTable.vue';
import queryHeader from '@/components/queryHeader.vue';
import lineRadius from '@/components/lineRadius.vue';
import rowsDynamicForm from '@/components/dynamicForm/rowsDynamicForm.vue';
import { scoreRule } from '@/utils/utils.js';
const router = useRouter();
const route = useRoute();
const _this: any = getCurrentInstance();
const API: any = _this.proxy.$API;
const message: any = _this.proxy.$Message;
const showHistory = ref(false);
const dialogVisible = ref(false);
const store = useStore();
const subjectSel = computed(() => store.state.subject);
const statusSel = computed(() => store.state.registerStatus);
const userInfo = ref(JSON.parse(localStorage.getItem('bjAdminUser')));
// 抽屉
const dialogTitle = ref('');
const drawer = ref(false);
// 表单数据
const formData = ref({});
const formItems = ref([
  {
    label: '学生姓名',
    prop: 'studentName',
    type: 'autocomplete',
    attrs: {
      clearable: true,
      placeholder: '请输入',
      'fetch-suggestions': (query, cb) => {
        console.log(query);
        if (query) {
          const params = {
            studentName: query
          };
          API.student.likeKeyWord(params).then(res => {
            let arr = res.map(el => {
              return {
                label: el,
                value: el
              };
            });
            cb(arr);
          });
        } else {
          cb([]);
        }
      }
    },
    options: []
  },
  {
    label: '竞赛学科',
    prop: 'subjectList',
    type: 'select',
    valueKey: 'code',
    labelKey: 'msg',
    attrs: {
      multiple: true,
      'collapse-tags': true,
      'max-collapse-tags': 1
    },
    options: subjectSel.value
  },
  {
    label: '教练姓名',
    prop: 'teacherName',
    type: 'autocomplete',
    attrs: {
      clearable: true,
      placeholder: '请输入',
      'fetch-suggestions': (query, cb) => {
        if (query) {
          const params = {
            teacherName: query
          };
          API.teacher.likeKeyWord(params).then(res => {
            let arr = res.map(el => {
              return {
                label: el,
                value: el
              };
            });
            cb(arr);
          });
        } else {
          cb([]);
        }
      }
    },
    options: []
  },
  {
    label: '状态',
    prop: 'statusList',
    type: 'select',
    valueKey: 'code',
    labelKey: 'msg',
    attrs: {
      multiple: true,
      'collapse-tags': true,
      'max-collapse-tags': 1
    },
    options: statusSel.value
  }
]);

watchEffect(() => {
  formItems.value[1].options = subjectSel.value;
  formItems.value[3].options = statusSel.value;
});

const formAttrs = ref({
  'label-width': '80px'
});
const paramsPage = ref({});
const changeModel = (model, value, key) => {
  paramsPage.value = model;
};

const exportData = () => {
  const params = { ...paramsPage.value, pageNum: 1, pageSize: -1 };
  API.student
    .exportRegister(params)
    .then(res => {
      console.log(res);
    })
    .catch(error => {
      downloadFileWithUrl(error);
    });
};

const downloadFileWithUrl = (blob, fileName = '测试学生.xlsx') => {
  // 创建一个临时的 Blob URL
  const url = window.URL.createObjectURL(new Blob([blob]), {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  // 创建一个 <a> 标签用于触发下载
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName; // 设置下载的文件名
  document.body.appendChild(link);
  // 触发下载
  link.click();
  // 清理临时 URL
  URL.revokeObjectURL(url);
  // 移除 <a> 标签
  document.body.removeChild(link);
};

const rowsDynamicFormRef = ref();
//重置表单
const resetForm = tag => {
  if (tag) rowsDynamicFormRef?.value.invokeFormFn('resetFields');
  tableRef.value.refreshTable(tag);
};
const tableRef = ref();
// 查询
const searchForm = () => {
  tableRef.value.refreshTable();
};

const tableHeader = reactive([
  {
    label: '学生姓名',
    prop: 'studentName',
    'show-overflow-tooltip': true
  },
  {
    label: '竞赛学科',
    prop: 'competitionSubject',
    colType: 'column',
    'show-overflow-tooltip': true
  },
  {
    label: '教练姓名',
    prop: 'teacherName',
    colType: 'column',
    'show-overflow-tooltip': true
  },
  {
    label: '状态',
    prop: 'status',
    colType: 'column'
  },
  {
    label: '操作',
    prop: 'btn',
    colType: 'column'
  }
]);
const tableData = ref([]);
const subjectObj = ref({
  1: '数学',
  2: '信息',
  3: '物理',
  4: '化学',
  5: '生物'
});
const stateObj = ref({
  1: {
    text: '报名',
    color: '#2C65D6',
    background: '#EAF1FF'
  },
  3: {
    text: '待测',
    color: '#DB792A',
    background: '#FFEFDB'
  },
  6: {
    text: '入学',
    color: '#50A29D',
    background: '#DCF9F8'
  },
  4: {
    text: '可录',
    color: '#4EAF49',
    background: '#EAF9DC'
  },
  5: {
    text: '不录',
    color: '#D45547',
    background: '#FFEFEF'
  },
  2: {
    text: '再次报名',
    color: '#2C65D6',
    background: '#EAF1FF'
  }
});
const initTag = ref(true);
const getTableData = param => {
  if (route.query.studentName && initTag.value) {
    formData.value.studentName = route.query.studentName;
    param.studentName = route.query.studentName;
    initTag.value = false;
  }

  return API.student.pageRegister(param).then(res => res);
};
const paginationConfig = reactive({});

const handleClose = () => {
  drawer.value = false;
  showHistory.value = false;
  ruleForm.value = {};
  ruleFormRef.value.resetFields();
};

const detailHandle = (row, mode) => {
  drawer.value = true;
  dialogTitle.value = mode;
  API.student.queryByRegisterId({ registerId: row.registerId }).then(res => {
    console.log(res);
    nextTick(() => {
      ruleForm.value = res;
    });
  });
};
const ruleFormRef = ref();
const ruleForm = ref({
  teacherId: '',
  examinationDate: '',
  location: '',
  evaluationScores: '',
  result: '',
  grading: '',
  remark: ''
});

//禁用当前日期之前的日期
const disabledDate = time => {
  return time.getTime() < Date.now() - 8.64e7;
};

const rules = ref({
  teacherId: [{ required: true, message: '请输入', trigger: 'change' }],
  examinationDate: [
    {
      required: true,
      message: '请选择时间',
      trigger: 'change'
    }
  ],
  location: [{ required: true, message: '请输入地点', trigger: 'blur' }],
  evaluationScores: [
    { required: true, message: '请输入成绩', trigger: 'blur' },
    {
      validator: scoreRule,
      trigger: 'blur'
    }
  ],
  result: [
    {
      required: true,
      message: '请选择结果',
      trigger: 'change'
    }
  ],
  grading: [
    {
      required: true,
      message: '请选择评级',
      trigger: 'change'
    }
  ]
});

const jlsel = ref([]);
const remoteMethod = query => {
  if (query) {
    const params = {
      keyWord: query,
      pageNum: 1,
      pageSize: -1,
      isEnable: 1,
      subject: [ruleForm.value.competitionSubject]
    };
    API.teacher.pageTeacherInfo(params).then(res => {
      jlsel.value = res.records.map(el => {
        return {
          label: el.teacherName,
          value: el.teacherId
        };
      });
    });
  } else {
    jlsel.value = [];
  }
};

// 获取下拉
const getSel = key => {
  const selList = {
    result: store.state.result.map(el => {
      return {
        label: el.msg,
        value: el.code + ''
      };
    }),
    grading: [
      { label: 'A', value: 'A' },
      { label: 'B', value: 'B' },
      { label: 'C', value: 'C' }
    ]
  };
  return selList[key];
};

//提交
const submitStudent = () => {
  ruleFormRef.value.validate(async valid => {
    if (valid) {
      ElMessageBox.confirm('确认提交当前操作内容？', '提交确认', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        closeOnClickModal: false
      }).then(async () => {
        const params = {
          ...ruleForm.value
        };
        let res = null;
        if (dialogTitle.value == 2) {
          res = await API.student.assignment(params);
        } else {
          res = await API.student.resultReporting(params);
        }
        if (res) {
          resetForm(false);
          handleClose();
          ElMessage({
            message: '操作成功',
            type: 'success'
          });
        }
      });
    }
  });
};

const timeStr = ref('');

// 变更时间
const changeTime = () => {
  timeStr.value = ruleForm.value.examinationDate;
  dialogVisible.value = true;
};

const dialogClose = () => {
  dialogVisible.value = false;
};

const dialogOk = () => {
  if (!timeStr) {
    ElMessage({
      message: '请选择变更时间',
      type: 'error'
    });
    return;
  }
  const params = {
    registerId: ruleForm.value.registerId,
    examinationDate: timeStr.value
  };

  API.student.changeAppointmentTime(params).then(res => {
    ElMessage({
      message: '操作成功',
      type: 'success'
    });
    dialogClose();
    ruleForm.value.examinationDate = timeStr.value;
  });
};
</script>

<style lang="scss" scoped>
.test-manage {
  .queryModule {
    border-radius: 0 0 4px 4px;
  }
  .listModule {
    padding: 20px;
    background: #ffffff;
    .btnsContainer {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-bottom: 15px;
    }
  }
  .flex-align {
    display: flex;
    align-items: center;
  }
  :deep(.el-drawer) {
    width: 696px !important;
    .el-drawer__header {
      padding: 14px 20px 12px 0 !important;
    }
    .drawer-title {
      justify-content: space-between;
      .title-text {
        line-height: 16px;
        border-radius: 0px 17px 17px 0px;
        opacity: 1;
        font-size: 14px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        padding: 9px 29px;
      }
      .el-button {
        margin-right: 32rpx;
      }
    }
    .test-info {
      padding: 20px;
      background: #f8fafd;
      border-radius: 8px;
      .info-title {
        padding-bottom: 10px;
        font-size: 14px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        color: #333333;
        border-bottom: 1px solid #ebeef5;
      }
      .history-title {
        justify-content: space-between;
        .show-box {
          cursor: pointer;
          font-size: 14px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          color: #1966ff;
        }
      }
      .info-box {
        padding: 0 10px;
        .info-item {
          padding: 0 0 20px;
          border-bottom: 1px solid #ebeef5;
          margin-bottom: 20px;
        }
        .info-item:last-child {
          padding: 0;
          border-bottom: none;
          margin-bottom: 0;
        }
        .info-block {
          width: 100%;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #ebeef5;
          flex-wrap: wrap;
          & > .el-form-item {
            margin-bottom: 0;
            width: 50%;
            .el-form-item__label {
              color: #999999;
            }
            .el-form-item__content {
              .el-form-item {
                flex: 1;
              }
            }
          }
        }
        .subject-form {
          .el-form-item__label:before {
            content: ' ';
            margin-right: 10.38px;
          }
        }
        .grade-background {
          .el-form-item {
            width: 100%;
          }
        }
        .parent-info {
          border-bottom: none;
          padding-bottom: 0;
        }
      }
    }
    .teacher-assign {
      margin-top: 20px;
      padding-bottom: 12px;
      .el-form-item__label {
        color: #999999;
      }

      .info-box {
        padding-top: 20px;
      }
      .teacher-assign-block {
        & > .el-form-item {
          width: 50%;
        }
      }
    }

    .teacher-assign-detail {
      padding: 20px;
      .el-form-item {
        margin-bottom: 0;
      }
      .el-form-item__label:before {
        content: '' !important;
        margin-right: 0px !important;
      }
    }
    .test-detail {
      margin-top: 20px;
      background: #f8fafd;
      border-radius: 8px;
      padding: 10px 20px 20px;
      .components-box {
        margin-top: 5px;
      }
    }
    .detail-form {
      .el-form-item__label:before {
        content: '';
        margin-right: 0;
      }
    }
    .info-title,
    .el-form-item__content {
      color: #333333;
    }
  }
  :deep(.el-table) {
    .el-button {
      padding: 0;
    }
    .state-box {
      padding: 1px 11px;
      font-size: 14px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      border-radius: 4px;
    }
  }
  .tips {
    font-size: 14px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    color: #999999;
    margin-left: 16px;
  }
  /* fade类名表示渐入渐出的过渡效果 */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s; /* 设置过渡持续时间为0.3秒 */
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0; /* 默认情况下不显示元素 */
  }
  .closeHistory {
    padding-bottom: 0 !important;
    border-bottom: none !important;
  }
  .change-text {
    color: #409eff;
    margin-left: 10px;
    cursor: pointer;
  }
  .dialog-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    p {
      margin-bottom: 16px;
    }
  }
}
</style>
