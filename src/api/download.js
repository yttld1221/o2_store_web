import axios from "axios";
import { ElMessage } from "element-plus";
import baseURL from './url';
const { DEV, MODE, PROD, VITE_BASE_URL } = import.meta.env;


const downloadHttp = axios.create({
  baseURL: baseURL,
  responseType: "blob"
});
downloadHttp.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem("bjAdminToken") || "";
    config.headers.Authorization = token;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

downloadHttp.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    ElMessage({
      message: error.response.data.message,
      type: "error",
      duration: 1500
    });
    return Promise.reject(error);
  }
);
export default downloadHttp;
