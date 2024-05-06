// 所有字典
const enums = [
  "admissionChannel", // 招生渠道
  "awardLevel", // 奖项等级
  "gender", // 性别
  "gradeLevel", // 年级
  "isEnable", // 是否启用
  "registerStatus", // 报名状态
  "result", // 录用结果
  "scores", // 成绩,
  "staffType", // 教职工类型
  "starRating", // 星级评定
  "studentStatus", // 学生状态
  "subject", // 科目
  "trainingPlan", // 培养类型
  "anticipateLevel", // 奖项

];

// 当前学年字典
let yearsEmus = [
  "currentSchoolYears", // 当前学年
]

export default {
  // 所有字典、学年字典
  setDict(state, data) {
    if(data && data.length > 0){
      data.forEach((v) => {
        const target = enums.find((e) => e === v.dictionaryKey);
        state[target] = v.data;
      });
    }
  },
  // 学年字典
  setSchoolYears(state, data) {
    if(data && data.length > 0) {
      data.forEach((v) => {
        const target = yearsEmus.find((e) => e === v.dictionaryKey);
        state[target] = v.data;
      });
    }
  },
  //窗口大小
  setWindowSize(state, data) {
    state.windowSize = data;
  }
};

