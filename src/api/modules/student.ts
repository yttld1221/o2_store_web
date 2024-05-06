import { AxiosPromise } from 'axios';
import http from '../axios';
import downloadHttp from '../download';

const teacher = {
  // 分页查询测试学生消息
  pageRegister(data: any): AxiosPromise<any> {
    return http({
      url: '/talentScoutRegister/pageRegister',
      method: 'POST',
      data
    });
  },
  // 学生模糊查询
  likeKeyWord(data: any): AxiosPromise<any> {
    return http({
      url: '/talentScoutRegister/likeKeyWord',
      method: 'POST',
      data
    });
  },
  // 查询报名信息
  queryByRegisterId(data: any): AxiosPromise<any> {
    return http({
      url: '/talentScoutRegister/queryByRegisterId/' + data.registerId,
      method: 'GET'
    });
  },
  // 导出学生信息
  exportRegister(data: any): AxiosPromise<any> {
    return http({
      url: '/talentScoutRegister/exportRegister',
      method: 'POST',
      data,
      responseType: 'blob'
    });
  },
  // 查询学校详情
  getSchoolInfo(data: any): AxiosPromise<any> {
    return http({
      url: '/supSchoolInfo/queryById',
      method: 'GET',
      params: data
    });
  },
  // 指派教练
  assignment(data: any): AxiosPromise<any> {
    return http({
      url: '/talentScoutRegister/assignment',
      method: 'POST',
      data
    });
  },
  // 结果填报
  resultReporting(data: any): AxiosPromise<any> {
    return http({
      url: '/talentScoutRegister/resultReporting',
      method: 'POST',
      data
    });
  },
  // 正式学生分页查询
  pageStudentInfo(data: any): AxiosPromise<any> {
    return http({
      url: '/studentInfo/pageStudentInfo',
      method: 'POST',
      data
    });
  },
  // 正式学生姓名模糊查询
  searchStudentByword(data: any): AxiosPromise<any> {
    return http({
      url: '/studentInfo/likeKeyWord',
      method: 'POST',
      data
    });
  },
  // 正式学生新增
  addStudentInfo(data: any): AxiosPromise<any> {
    return http({
      url: '/studentInfo/add',
      method: 'POST',
      data
    });
  },
  // 正式学生编辑修改
  editStudentInfo(data: any): AxiosPromise<any> {
    return http({
      url: '/studentInfo/edit',
      method: 'POST',
      data
    });
  },
  // 正式学生查询学生详情
  queryStudentInfo(data: any): AxiosPromise<any> {
    return http({
      url: '/studentInfo/queryByStudentCode',
      method: 'GET',
      params: data
    });
  },
  // 正式学生导出
  exportStudentInfo(data: any): AxiosPromise<any> {
    return http({
      url: '/studentInfo/exportStudentInfo',
      method: 'POST',
      data,
      responseType: 'blob'
    });
  },
  // 正式学生模版下载 type:1-批量新增，2-修改基本信息，3-修改就读信息，4-修改学生状态，5-修改带教教练，6-修改获奖情况
  downloadTemplate(data: any): AxiosPromise<any> {
    return downloadHttp({
      url: '/studentInfo/downloadTemplate/' + data.type,
      method: 'GET'
    });
  },
  // 正式学生批量导入新增学生
  importBatchStudent(data: any): AxiosPromise<any> {
    return http({
      url: '/studentInfo/batchInsert',
      method: 'POST',
      data
    });
  },
  // 正式学生批量更新基础信息
  batchUpdateInfo(data: any): AxiosPromise<any> {
    return http({
      url: '/studentInfo/batchUpdateInfo',
      method: 'POST',
      data
    });
  },
  // 正式学生批量更新就读信息
  batchInsertStudyRecord(data: any): AxiosPromise<any> {
    return http({
      url: '/studentInfo/batchInsertStudyRecord',
      method: 'POST',
      data
    });
  },
  // 正式学生批量更新学生状态
  batchUpdateStatus(data: any): AxiosPromise<any> {
    return http({
      url: '/studentInfo/batchUpdateStatus',
      method: 'POST',
      data
    });
  },
  // 正式学生批量更新带教教练
  batchUpdateTeachRecord(data: any): AxiosPromise<any> {
    return http({
      url: '/studentInfo/batchUpdateTeachRecord',
      method: 'POST',
      data
    });
  },
  // 正式学生批量更新获奖情况
  batchInsertAwardRecord(data: any): AxiosPromise<any> {
    return http({
      url: '/studentInfo/batchInsertAwardRecord',
      method: 'POST',
      data
    });
  },

  // 竞赛预测分页查询
  pageMissions(data: any): AxiosPromise<any> {
    return http({
      url: '/missionsRecord/pageMissions',
      method: 'POST',
      data
    });
  },
  // 竞赛预测查询详情
  queryByMissionsId(data: any): AxiosPromise<any> {
    return http({
      url: '/missionsRecord/queryByMissionsId/' + data.missionsId,
      method: 'GET'
    });
  },
  // 竞赛预测新增
  addMissions(data: any): AxiosPromise<any> {
    return http({
      url: '/missionsRecord/add',
      method: 'POST',
      data
    });
  },
  //竞赛预测结束任务
  closeMissions(data: any): AxiosPromise<any> {
    return http({
      url: '/missionsRecord/closeMissions/' + data.missionsId,
      method: 'GET'
    });
  },
  // 新增成绩预测记录
  addAnticipateRecord(data: any): AxiosPromise<any> {
    return http({
      url: '/missionsRecord/addAnticipateRecord',
      method: 'POST',
      data
    });
  },
  // 导入成绩预测记录
  importAnticipateRecord(data: any): AxiosPromise<any> {
    return http({
      url: '/missionsRecord/importAnticipateRecord',
      method: 'POST',
      data
    });
  },
  // 导出竞赛预测
  exportMissionsInfo(data: any): AxiosPromise<any> {
    return http({
      url: '/missionsRecord/exportMissionsInfo/' + data.missionsId,
      method: 'GET'
    });
  },
  // 竞赛预测成绩预测模版导入下载
  scoreDownloadTemplate(data: any): AxiosPromise<any> {
    return downloadHttp({
      url: '/missionsRecord/downloadTemplate',
      method: 'GET'
    });
  },
  // 获取当前教师下学生
  teachingReadingStudents(data: any): AxiosPromise<any> {
    return http({
      url: '/studentInfo/teachingReadingStudents',
      method: 'GET',
      params: data
    });
  },
  // 变更时间
  changeAppointmentTime(data: any): AxiosPromise<any> {
    return http({
      url: '/talentScoutRegister/changeAppointmentTime',
      method: 'POST',
      data
    });
  },
  // 修改委托结束备注
  updateEndTeachRemark(data: any): AxiosPromise<any> {
    return http({
      url: '/studentInfo/updateEndTeachRemark',
      method: 'POST',
      data
    });
  }
};
export default teacher;
