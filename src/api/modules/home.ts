import { AxiosPromise } from 'axios';
import http from '../axios';

const teacher = {
  // pageMessage
  pageMessage(data: any): AxiosPromise<any> {
    return http({
      url: '/messageCentre/pageMessage',
      method: 'POST',
      data
    });
  },
  // 未读消息数量
  unreadNum(data: any): AxiosPromise<any> {
    return http({
      url: '/messageCentre/unreadNum',
      method: 'GET',
      params: data
    });
  },
  // 消息已读
  readMessage(data: any): AxiosPromise<any> {
    return http({
      url: '/messageCentre/readMessage/'+data.messageId,
      method: 'GET'
    });
  },
  // 已读所有消息
  readAllMessage(data: any): AxiosPromise<any> {
    return http({
      url: '/messageCentre/readAllMessage',
      method: 'GET',
      params: data
    });
  },
  // 首页统计数据
  statisticalData(data: any): AxiosPromise<any> {
    return http({
      url: '/home/statisticalData',
      method: 'GET',
      params: data
    });
  },
};
export default teacher;
