/*
 * @Description:
 * @version:
 * @Author: 周子尧
 * @Date: 2020-11-02 17:45:36
 * @LastEditors: imali
 * @LastEditTime: 2022-03-29 17:14:29
 */
import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'strategy/v1/common/user/login',
    method: 'post',
    data,
  })
}

export function authLogin(data) {
  return request({
    url: 'strategy/v1/common/bip/login',
    method: 'post',
    data,
  })
}

export function getInfo(token) {
  return request({
    url: 'strategy/v1/vue-admin-template/user/info',
    method: 'get',
    params: { token },
  })
}

export function logout() {
  return request({
    url: 'strategy/v1/vue-admin-template/user/logout',
    method: 'post',
  })
}
