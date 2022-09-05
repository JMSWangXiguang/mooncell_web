/*
 * @Description:
 * @version:
 * @Author: 周子尧
 * @Date: 2020-11-02 17:45:36
 * @LastEditors: imali
 * @LastEditTime: 2022-04-29 11:23:50
 */
import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000, // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'application/json'
    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  (error) => {
    // do something with request error
    console.log(error) // for debug
  }
)

// response interceptor
service.interceptors.response.use(
  (response) => {
    try {
      const res = response.data
      if (res.status !== 200) {
        Message({
          message: res.msg || 'Error',
          type: 'error',
          duration: 5 * 1000,
        })
        if (res.status === 401 || res.status === 402 || res.status === 403) {
          MessageBox.confirm('当前登录状态已失效，请重新登录', '登出提醒', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          })
        }
        throw new Error(new Error(res.msg || 'Error'))
      } else {
        return res
      }
    } catch (error) {
      console.log('err' + error) // for debug
    }
  },
  (error) => {
    console.error('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000,
    })
  }
)

export default service
