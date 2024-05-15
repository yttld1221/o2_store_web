import { AxiosPromise } from 'axios';
import http from '../axios';
const wechat = {
  //学校-获取所有学校
  getAllSchool(data: any): AxiosPromise<any> {
    return http({
      url: '/sundry/getAllSchool',
      method: 'GET',
      params: data
    });
  },
  //用户-分页获取小程序用户
  getUserList(data: any): AxiosPromise<any> {
    return http({
      url: '/wx/getUserList',
      method: 'GET',
      params: data
    });
  },
  //用户-导出小程序用户
  getUserListXlsx(data: any): AxiosPromise<any> {
    return http({
      url: '/wx/getUserListXlsx',
      method: 'GET',
      params: data
    });
  },
};
export default wechat;
