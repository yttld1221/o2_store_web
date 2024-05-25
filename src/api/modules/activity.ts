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
  // v2分类-保存编辑活动分类
  saveCategory(data: any): AxiosPromise<any> {
    return http({
      url: '/sundry/saveCategory',
      method: 'POST',
      data
    });
  },
  // 文件上传-表单方式提交后台上传oss
  postFileOss(data: any): AxiosPromise<any> {
    return http({
      url: '/sundry/postFileOss',
      method: 'POST',
      data
    });
  },
  // v2活动-新增或编辑活动
  saveTask(data: any): AxiosPromise<any> {
    return http({
      url: '/task/saveTask',
      method: 'POST',
      data
    });
  },
  // v2活动-根据活动id获取活动详情
  getTaskInfo(data: any): AxiosPromise<any> {
    return http({
      url: '/task/getTaskInfo',
      method: 'POST',
      data
    });
  },
  // v2订单-分页获取订单列表
  getOrderList(data: any): AxiosPromise<any> {
    return http({
      url: '/order/getOrderList',
      method: 'POST',
      data
    });
  },
  // v2商家-新增或编辑商家
  saveShop(data: any): AxiosPromise<any> {
    return http({
      url: '/sundry/saveShop',
      method: 'POST',
      data
    });
  },
  // v2发货-订单发货
  delivery(data: any): AxiosPromise<any> {
    return http({
      url: '/order/delivery',
      method: 'POST',
      data
    });
  },
  // v2发货-取消订单发货
  cancelDelivery(data: any): AxiosPromise<any> {
    return http({
      url: '/order/cancelDelivery',
      method: 'POST',
      data
    });
  },
  // v2退款-获取退款申请详情
  getRefundInfo(data: any): AxiosPromise<any> {
    return http({
      url: '/order/getRefundInfo',
      method: 'POST',
      data
    });
  },
  // v2退款-退款审核
  refundCheck(data: any): AxiosPromise<any> {
    return http({
      url: '/order/refundCheck',
      method: 'POST',
      data
    });
  },
  // v2结算-批量结算订单
  batchSettlementOrder(data: any): AxiosPromise<any> {
    return http({
      url: '/order/batchSettlementOrder',
      method: 'POST',
      data
    });
  },
  // v2商家-商家入住审核
  checkShop(data: any): AxiosPromise<any> {
    return http({
      url: '/sundry/checkShop',
      method: 'POST',
      data
    });
  },
  // v2商家-根据商家id获取商家详情
  getShopInfo(data: any): AxiosPromise<any> {
    return http({
      url: '/sundry/getShopInfo',
      method: 'POST',
      data
    });
  },
  // v2活动-删除
  setTaskDel(data: any): AxiosPromise<any> {
    return http({
      url: '/task/setTaskDel',
      method: 'POST',
      data
    });
  },
  // v2活动-审核
  checkTask(data: any): AxiosPromise<any> {
    return http({
      url: '/task/checkTask',
      method: 'POST',
      data
    });
  },
  //v2活动-分页获取活动列表数据(总部待审核管理模块)
  getTaskListForCheck(data: any): AxiosPromise<any> {
    return http({
      url: '/task/getTaskListForCheck',
      method: 'GET',
      params: data
    });
  },
};
export default activity;
