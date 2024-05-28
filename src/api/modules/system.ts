import { AxiosPromise } from 'axios';
import http from '../axios';

const teacher = {
  // v2菜单-首页跳转菜单维护
  saveMenu(data: any): AxiosPromise<any> {
    return http({
      url: '/sundry/saveMenu',
      method: 'POST',
      data
    });
  },
  //v2菜单-分页获取首页跳转菜单
  getMenuList(data: any): AxiosPromise<any> {
    return http({
      url: '/sundry/getMenuList',
      method: 'GET',
      params: data
    });
  },

};
export default teacher;
