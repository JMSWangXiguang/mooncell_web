/*
 * @Description: 
 * @version: 
 * @Author: 陈逸
 * @Date: 2022-04-12 11:09:41
 * @LastEditors: 陈逸
 * @LastEditTime: 2022-04-19 14:30:44
 */

import request from '@/utils/request'

// export function login(data) {
//   return request({
//     url: 'strategy/v1/common/user/login',
//     method: 'post',
//     data
//   })
// }

export function login(data) {
  return request({
    url: 'roc/v1/auth/user/login',
    method: 'post',
    data
  })
}

export function first(data) {
  return request({
    url: 'roc/v1/auth/user/first',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: 'strategy/v1/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: 'strategy/v1/vue-admin-template/user/logout',
    method: 'post'
  })
}
