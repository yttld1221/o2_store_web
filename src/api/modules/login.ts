import { AxiosPromise } from 'axios';
import http from '../axios';
//字典接口
const login = {
  //用户-获取管理人员（本人）详细信息
  getAdminInfo(data: any): AxiosPromise<any> {
    return http({
      url: '/admin/getAdminInfo',
      method: 'GET',
      params: data
    });
  },
  // 用户-用户登入
  login(data: any): AxiosPromise<any> {
    return http({
      url: '/admin/login',
      method: 'POST',
      data
    });
  },
   // 用户-用户登入
   logOut(data: any): AxiosPromise<any> {
    return http({
      url: '/admin/logOut',
      method: 'POST',
      data
    });
  },
};
export default login;
