import axios, { AxiosInstance } from "axios";
import baseURL from "./url";
import Router from '../router'
import { ElMessage } from "element-plus";


// 创建实例
const http: AxiosInstance = axios.create({
  baseURL: '',
  timeout: 60000,
});
// http.defaults.withCredentials = true //是否携带密钥信息
// 请求拦截 -->在请求发送之前做一些事情
http.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = window.localStorage.getItem('bjAdminToken') || ''
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// 响应拦截 -->在返回结果之前做一些事情
http.interceptors.response.use(
  (response) => {
    const data: any = response.data;
    // 其他
    if (data.status === 200) {
      return data.data;
    } else if ([403,401].includes(data.code)) { //登录过期，多端登录
      Router.push({ name: "login" });
      localStorage.removeItem('bjAdminToken')
      return Promise.reject(response.data);
    }else {
      ElMessage({
        message: data.message,
        type: "error",
        duration: 2000
      })
      return Promise.reject(response.data);
    } 
  },
  (error) => {
    const data: any = error.response.data
    if (data.code === 403) { //登录过期
      Router.push({ name: "login" });
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);
export default http;