/*
 * @Descripttion:
 * @version:
 * @Author: 周子尧
 * @Date: 2020-11-18 14:49:56
 * @LastEditors: 周子尧
 * @LastEditTime: 2020-11-18 16:16:20
 */

import request from '@/utils/request'
// 获取语料列表
export function getList(params) {
  return request({
    url: 'strategy/v1/simple/corpus/list',
    method: 'post',
    data: params
  })
}

// 新增语料
export function create(params) {
  return request({
    url: 'strategy/v1/simple/corpus/create',
    method: 'post',
    data: params
  })
}

// 更新语料
export function update(params) {
  return request({
    url: 'strategy/v1/simple/corpus/update',
    method: 'post',
    data: params
  })
}

// 删除语料
export function deleteData(params) {
  return request({
    url: 'strategy/v1/simple/corpus/delete',
    method: 'post',
    data: params
  })
}

// 更新语料优先级
export function priority(params) {
  return request({
    url: 'strategy/v1/simple/corpus/priority',
    method: 'post',
    data: params
  })
}

// 获取语料详情
export function getInfo(params) {
  return request({
    url: 'strategy/v1/simple/corpus/get',
    method: 'post',
    data: params
  })
}
