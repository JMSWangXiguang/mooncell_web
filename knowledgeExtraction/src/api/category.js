/*
 * @Descripttion: 语料分类
 * @version:
 * @Author: 周子尧
 * @Date: 2020-11-17 14:09:22
 * @LastEditors: 周子尧
 * @LastEditTime: 2020-11-19 11:22:43
 */

import request from '@/utils/request'
// 请求语料分类元数据
export function getSchema(params) {
  return request({
    url: 'strategy/v1/simple/category/schema',
    method: 'post',
    data: params
  })
}

// 分类管理列表
export function getList(params) {
  return request({
    url: 'strategy/v1/simple/category/list',
    method: 'post',
    data: params
  })
}

// 分类管理列表
export function create(params) {
  return request({
    url: 'strategy/v1/simple/category/create',
    method: 'post',
    data: params
  })
}

// 更新预料分类
export function update(params) {
  return request({
    url: 'strategy/v1/simple/category/update',
    method: 'post',
    data: params
  })
}

// 获取机构列表
export function getSource(params) {
  return request({
    url: 'strategy/v1/simple/source/schema',
    method: 'post',
    data: params
  })
}
