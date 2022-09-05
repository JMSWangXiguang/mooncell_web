/*
 * @Description:
 * @version:
 * @Author: 唐红娟
 * @Date: 2021-08-25
 * @LastEditors: imali
 * @LastEditTime: 2022-03-29 17:14:15
 */

import request from '@/utils/request'
// 获取列表
export function getList(params) {
  return request({
    url: 'strategy/v1/simple/remark/list',
    method: 'post',
    data: params,
  })
}

// 更新
export function update(params) {
  return request({
    url: 'strategy/v1/simple/remark/status',
    method: 'post',
    data: params,
  })
}

// 删除
export function deleteData(params) {
  return request({
    url: 'strategy/v1/simple/remark/delete',
    method: 'post',
    data: params,
  })
}

// 获取详情
export function getWork(params) {
  return request({
    url: 'strategy/v1/simple/remark/get',
    method: 'post',
    data: params,
  })
}
