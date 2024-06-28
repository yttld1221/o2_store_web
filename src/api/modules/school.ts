import { AxiosPromise } from 'axios';
import http from '../axios';

const teacher = {
  //v2菜单-分页获取首页跳转菜单
  getSchoolList(data: any): AxiosPromise<any> {
    return http({
      url: '/sundry/getSchoolList',
      method: 'GET',
      params: data
    });
  },
  // v2学校-新增或修改学校
  saveSchool(data: any): AxiosPromise<any> {
    return http({
      url: '/sundry/saveSchool',
      method: 'POST',
      data
    });
  },
};
export default teacher;
