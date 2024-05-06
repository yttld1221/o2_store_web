import { AxiosPromise } from 'axios';
import http from '../axios';
//字典接口
const teacher = {
  //获取所有字典
  getAllDictionary(data: any): AxiosPromise<any> {
    return http({
      url: '/common/dictionary',
      method: 'GET',
      params: data
    });
  },
  //获取学年字典
  getSchoolYears(data: any): AxiosPromise<any> {
    return http({
      url: '/common/currentSchoolYears',
      method: 'GET',
      params: data
    });
  }
};
export default teacher;
