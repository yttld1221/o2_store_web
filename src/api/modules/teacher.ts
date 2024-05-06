import { AxiosPromise } from 'axios';
import http from '../axios';

const teacher = {
  // 新增
  teacherInfoadd(data: any): AxiosPromise<any> {
    return http({
      url: '/teacherInfo/add',
      method: 'POST',
      data
    });
  },
  // 编辑
  teacherInfoedit(data: any): AxiosPromise<any> {
    return http({
      url: '/teacherInfo/edit',
      method: 'POST',
      data
    });
  },
  // 分页查询教师
  pageTeacherInfo(data: any): AxiosPromise<any> {
    return http({
      url: '/teacherInfo/pageTeacherInfo',
      method: 'POST',
      data
    });
  },
  // 查询教师详情
  queryByTeacherCode(data: any): AxiosPromise<any> {
    return http({
      url: '/teacherInfo/queryByTeacherCode',
      method: 'GET',
      params: data
    });
  },
  // 教师信息-成就展示
  achievements(data: any): AxiosPromise<any> {
    return http({
      url: '/teacherInfo/achievements',
      method: 'GET',
      params: data
    });
  },
  // 教师信息-双师课堂
  studySituation(data: any): AxiosPromise<any> {
    return http({
      url: '/teacherInfo/studySituation/' + data.teacherCode,
      method: 'GET'
    });
  },
  // 教师信息-成就展示-获奖详情
  pageAward(data: any): AxiosPromise<any> {
    return http({
      url: '/teacherInfo/pageAward',
      method: 'POST',
      data
    });
  },
  // 导出教师信息
  exportTeacherInfo(data: any): AxiosPromise<any> {
    return http({
      url: '/teacherInfo/exportTeacherInfo',
      method: 'POST',
      data,
      responseType: 'blob'
    });
  },
  // 批量导入新增
  batchInsert(data: any): AxiosPromise<any> {
    return http({
      url: '/teacherInfo/batchInsert',
      method: 'POST',
      data
    });
  },
  // 批量导入更新
  batchUpdate(data: any): AxiosPromise<any> {
    return http({
      url: '/teacherInfo/batchUpdate',
      method: 'POST',
      data
    });
  },
  // 导出模板
  downloadTemplate(data: any): AxiosPromise<any> {
    return http({
      url: '/teacherInfo/downloadTemplate',
      method: 'GET',
      params: data,
      responseType: 'blob'
    });
  },
  // 模糊查询
  likeKeyWord(data: any): AxiosPromise<any> {
    return http({
      url: '/teacherInfo/likeKeyWord',
      method: 'POST',
      data
    });
  },
};
export default teacher;
