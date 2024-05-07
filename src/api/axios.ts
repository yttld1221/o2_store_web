import axios, { AxiosInstance } from 'axios';
import baseURL from './url';
import Router from '../router';
import { ElMessage } from 'element-plus';

const { DEV, MODE, PROD, VUE_APP_BASE_API } = import.meta.env;
let baseURLS = '';
if ((MODE === 'sit' || MODE === 'development') && DEV) {
  baseURLS = baseURL;
} else if (MODE === 'production' && PROD) {
  baseURLS = VUE_APP_BASE_API;
} else {
  baseURLS = baseURL;
}

let tag = true;
// 创建实例
const http: AxiosInstance = axios.create({
  baseURL: baseURLS,
  timeout: 360000
});
// 设置post请求头
// http.defaults.headers.post['Content-Type'] =
//   'application/x-www-form-urlencoded';
// http.defaults.withCredentials = true //是否携带密钥信息
// 请求拦截 -->在请求发送之前做一些事情
http.interceptors.request.use(
  config => {
    config.headers['token'] =
      window.localStorage.getItem('token') || '';
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
// 响应拦截 -->在返回结果之前做一些事情
http.interceptors.response.use(
  response => {
    const data: any = response.data;
    console.log(data)

    // 其他
    let code = data.code;
    if (code == 0) {
      return data;
    } else if (code == 410) {
      //登录过期 多端登录
      Router.push('/login');
      localStorage.removeItem('token')
      ElMessage({
        message: data.msg,
        type: 'error',
        duration: 2000
      });
      return Promise.reject(response.data);
    } else {
      if (data.msg) {
        ElMessage({
          message: data.msg,
          type: 'error',
          duration: 2000
        });
      }
      return Promise.reject(response.data);
    }
  },
  error => {
    const data: any = error.response;
    return Promise.reject(error);
  }
);

export default http;
