import { AxiosPromise } from 'axios';
import http from '../axios';

const teacher = {
  // v2提现-分页获取提现列表
  getWithdrawList(data: any): AxiosPromise<any> {
    return http({
      url: '/order/getWithdrawList',
      method: 'POST',
      data
    });
  },
  // v2提现-提现批量审核
  batchWithdraw(data: any): AxiosPromise<any> {
    return http({
      url: '/order/batchWithdraw',
      method: 'POST',
      data
    });
  },
};
export default teacher;
