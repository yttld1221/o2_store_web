import { AxiosPromise } from 'axios';
import http from '../axios';

const merchant = {
  // v2活动-下架(分部模块)
  setTaskDownForChild(data: any): AxiosPromise<any> {
    return http({
      url: '/task/setTaskDownForChild',
      method: 'POST',
      data
    });
  },
  // v2活动-删除(分部模块)
  setTaskDelForChild(data: any): AxiosPromise<any> {
    return http({
      url: '/task/setTaskDelForChild',
      method: 'POST',
      data
    });
  },
  // v2商家-分页获取商家列表(分账号模块)
  getShopListForChild(data: any): AxiosPromise<any> {
    return http({
      url: '/sundry/getShopListForChild',
      method: 'POST',
      data
    });
  },
  // v2活动-根据活动id获取活动详情(分部活动管理模块)
  getTaskInfoForChild(data: any): AxiosPromise<any> {
    return http({
      url: '/task/getTaskInfoForChild',
      method: 'POST',
      data
    });
  },
  // v2活动-新增或编辑活动(分部活动管理模块)
  saveTaskForChild(data: any): AxiosPromise<any> {
    return http({
      url: '/task/saveTaskForChild',
      method: 'POST',
      data
    });
  },
  //v2活动-分页获取活动列表数据(分部活动管理模块)
  getTaskListForChild(data: any): AxiosPromise<any> {
    return http({
      url: '/task/getTaskListForChild',
      method: 'GET',
      params: data
    });
  },
  // 订单-分页获取订单列表(分部订单管理模块)
  getOrderListForChild(data: any): AxiosPromise<any> {
    return http({
      url: '/order/getOrderListForChild',
      method: 'POST',
      data
    });
  },
  // v2发货-取消订单发货(分部权限)
  cancelDeliveryForChild(data: any): AxiosPromise<any> {
    return http({
      url: '/order/cancelDeliveryForChild',
      method: 'POST',
      data
    });
  },
  // v2发货-订单发货(分部权限)
  deliveryForChild(data: any): AxiosPromise<any> {
    return http({
      url: '/order/deliveryForChild',
      method: 'POST',
      data
    });
  },
};
export default merchant;
