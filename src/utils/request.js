import axios from "axios";
import { Notification, MessageBox } from "element-ui";
import router from "@/router";
// 创建axios实例
const service = axios.create({
  // 标记 子目录
  baseURL: "/api" // api 的 base_url
});

// request拦截器
service.interceptors.request.use(
  config => {
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// response 拦截器
service.interceptors.response.use(
  response => {
    const code = response.status;
    if (code < 200 || code > 300) {
      Notification.error({
        title: response.message
      });
      return Promise.reject("error");
    } else {
      return response.data;
    }
  },
  error => {
    let code = 0;
    try {
      code = error.response.data.status;
    } catch (e) {
      if (error.toString().indexOf("Error: timeout") !== -1) {
        Notification.error({
          title: "网络请求超时",
          duration: 5000
        });
        return Promise.reject(error);
      }
    }
    if (code) {
      if (code === 401) {
        MessageBox.confirm(
          "登录状态已过期，您可以继续留在该页面，或者重新登录",
          "系统提示",
          {
            confirmButtonText: "重新登录",
            cancelButtonText: "取消",
            type: "warning"
          }
        ).then(() => {
          location.reload(); // 为了重新实例化vue-router对象 避免bug
        });
      } else if (code === 403) {
        router.push({ path: "/401" });
      } else {
        const errorMsg = error.response.data.message;
        if (errorMsg !== undefined) {
          Notification.error({
            title: errorMsg,
            duration: 5000
          });
        }
      }
    } else {
      Notification.error({
        title: "接口请求失败",
        duration: 5000
      });
    }
    return Promise.reject(error);
  }
);
export default service;
