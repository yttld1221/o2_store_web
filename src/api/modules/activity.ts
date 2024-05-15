import { AxiosPromise } from 'axios';
import http from '../axios';
import downloadHttp from '../download';

const activity = {
  //v2活动-分页获取活动列表数据
  getTaskList(data: any): AxiosPromise<any> {
    return http({
      url: '/task/getTaskList',
      method: 'GET',
      params: data
    });
  },
  // v2活动-设置热门
  setTaskHot(data: any): AxiosPromise<any> {
    return http({
      url: '/task/setTaskHot',
      method: 'POST',
      data
    });
  },
  // v2活动-上下架
  setTaskUpDown(data: any): AxiosPromise<any> {
    return http({
      url: '/task/setTaskUpDown',
      method: 'POST',
      data
    });
  },
  //v2分类-分页获取活动分类
  getCategoryList(data: any): AxiosPromise<any> {
    return http({
      url: '/sundry/getCategoryList',
      method: 'GET',
      params: data
    });
  },
  // v2商家-分页获取商家列表
  getShopList(data: any): AxiosPromise<any> {
    return http({
      url: '/sundry/getShopList',
      method: 'POST',
      data
    });
  },
  //2分类-获取活动分类树状图（启用状态）
  getCategoryTree(data: any): AxiosPromise<any> {
    return http({
      url: '/sundry/getCategoryTree',
      method: 'GET',
      params: data
    });
  },
};
export default activity;
