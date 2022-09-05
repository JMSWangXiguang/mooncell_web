/*
 * @Author: imali
 * @Date: 2022-04-06 14:02:12
 * @LastEditTime: 2022-04-06 19:02:25
 * @LastEditors: imali
 * @Description:
 */
import request from '@/utils/request'

// 获取模型列表
export function getUserList(data) {
  return request({
    url: 'strategy/v1/common/user/list',
    method: 'post',
    data,
  })
}

// 创建用户
export function createUser(data) {
  return request({
    url: 'strategy/v1/common/user/create',
    method: 'post',
    data,
  })
}
