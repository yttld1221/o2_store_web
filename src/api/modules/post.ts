import { AxiosPromise } from 'axios';
import http from '../axios';

const post = {
  // 校园墙-分页获取校园墙列表数据
  getMomentsList(data: any): AxiosPromise<any> {
    return http({
      url: '/moments/getMomentsList',
      method: 'GET',
      params: data
    });
  },
  // 校园墙内容上下架，支持批量
  setMomentsUpDown(data: any): AxiosPromise<any> {
    return http({
      url: '/moments/setMomentsUpDown',
      method: 'POST',
      data
    });
  },
  // 校园墙热门切换，支持批量
  setMomentsHot(data: any): AxiosPromise<any> {
    return http({
      url: '/moments/setMomentsHot',
      method: 'POST',
      data
    });
  },
  // 评论-根据校园墙id分页获取评论内容
  getCommentList(data: any): AxiosPromise<any> {
    return http({
      url: '/moments/getCommentList',
      method: 'POST',
      data
    });
  },
  // 评论-评论上下线
  setCommentUpDown(data: any): AxiosPromise<any> {
    return http({
      url: '/moments/setCommentUpDown',
      method: 'POST',
      data
    });
  },
};
export default post;
