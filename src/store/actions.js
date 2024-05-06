import API from "@/api/apiList";
import store from "./index";

// 所有字典
let emus = [
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

// 所有字典
export const getDict = async ({ commit }) => {
  let result = emus.map((e) => store.state[e]).some((v) => v == undefined);
  if (!result) return;
  await API.dictionary
    .getAllDictionary().then((data) => {
        if (data && data.length > 0) {
            const newData = [];
            emus.forEach((e) => {
                let list = {
                    dictionaryKey: e,
                    data: []
                }
                data.forEach((v) => {
                    if(v.fieldName === e) {
                        list.data.push(v)
                    }
                })
                newData.push(list);
            })
            commit("setDict", newData);
        }
    });
};

// 学年字典
export const getYearsDict = async ({ commit }) => {
  let result = yearsEmus.map((e) => store.state[e]).some((v) => v == undefined);
  if (!result) return;
  await API.dictionary
      .getSchoolYears().then((data) => {
        if (data && data.length > 0) {
            const newData = [];
            yearsEmus.forEach((e) => {
                let list = {
                    dictionaryKey: e,
                    data: []
                }
                data.forEach((v) => {
                    if(v.fieldName === e) {
                        list.data.push(v)
                    }
                })
                newData.push(list);
            })
            commit("setSchoolYears", newData);
        }
      });
};
