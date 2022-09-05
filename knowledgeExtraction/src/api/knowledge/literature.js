/*
 * @Descripttion: 文献维护
 * @version:
 * @Author: 唐红娟
 * @Date: 2021-08-05
 * @LastEditors: 唐红娟
 * @LastEditTime: 2021-08-05
 */
import request from '@/utils/request'

// 获取分类列表
export function getCategory(params) {
  return request({
    url: 'strategy/v1/datagraph/reference/category/list',
    method: 'post',
    data: params
  })
}

// 获取来源列表
export function getSource(params) {
  return request({
    url: 'strategy/v1/datagraph/reference/source/list',
    method: 'post',
    data: params
  })
}

// 获取列表
export function getList(params) {
  return request({
    url: 'strategy/v1/datagraph/reference/doc/list',
    method: 'post',
    data: params
  })
}

// 新增
export function create(params) {
  return request({
    url: 'strategy/v1/datagraph/reference/doc/create',
    method: 'post',
    data: params
  })
}

// 更新
export function update(params) {
  return request({
    url: 'strategy/v1/datagraph/reference/doc/update',
    method: 'post',
    data: params
  })
}

// 详情
export function getInfo(params) {
  return request({
    url: 'strategy/v1/datagraph/reference/doc/get',
    method: 'post',
    data: params
  })
}

// 删除
export function Delete(params) {
  return request({
    url: 'strategy/v1/datagraph/reference/doc/delete',
    method: 'post',
    data: params
  })
}
