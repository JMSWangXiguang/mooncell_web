/*
 * @Descripttion:
 * @version:
 * @Author: 周子尧
 * @Date: 2020-11-02 17:45:36
 * @LastEditors: imali
 * @LastEditTime: 2022-03-14 10:31:18
 */
import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";

// create an axios instance
const service = axios.create({
  baseURL: "/", // process.env.VUE_APP_BASE_API, // 'http://192.168.8.122:5010/strategy/v1/', // process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 50000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    config.headers["Content-Type"] = "application/json";
    if (store.getters.token) {
      config.headers["Authorization"] = getToken();
    }
    return config;
  },
  (error) => {
    // do something with request error
    console.error(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.status !== 200) {
      Message({
        message: res.msg || "Error",
        type: "error",
        duration: 5 * 1000,
      });
      if (
        res.status === 50008 ||
        res.status === 50012 ||
        res.status === 50014
      ) {
        MessageBox.confirm("当前登录状态已失效，请重新登录", "登出提醒", {
          confirmButtonText: "重新登录",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          store.dispatch("user/resetToken").then(() => {
            location.reload();
          });
        });
      }
      return Promise.reject(new Error(res.msg || "Error"));
    } else {
      return res;
    }
  },
  (error) => {
    console.log("err" + error); // for debug
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
