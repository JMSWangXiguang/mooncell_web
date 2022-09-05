/*
 * @Description: 文献维护
 * @version:
 * @Author: 唐红娟
 * @Date: 2021-08-05
 * @LastEditors: imali
 * @LastEditTime: 2022-04-26 16:37:05
 */
import request from '@/utils/request'

// 获取分类列表
export function getCategory(params) {
  return request({
    url: 'strategy/v1/datagraph/reference/category/list',
    method: 'post',
    data: params,
  })
}

// 获取来源列表
export function getSource(params) {
  return request({
    url: 'strategy/v1/datagraph/reference/source/list',
    method: 'post',
    data: params,
  })
}

// 获取来源信息
export function getSourceInfo(params) {
  return request({
    url: 'strategy/v1/datagraph/reference/source/get',
    method: 'post',
    data: params,
  })
}

// 创建来源信息
export function createSource(params) {
  return request({
    url: 'strategy/v1/datagraph/reference/source/create',
    method: 'post',
    data: params,
  })
}

// 创建来源信息
export function updateSource(params) {
  return request({
    url: 'strategy/v1/datagraph/reference/source/update',
    method: 'post',
    data: params,
  })
}

// 删除来源信息
export function deleteSource(params) {
  return request({
    url: 'strategy/v1/datagraph/reference/source/delete',
    method: 'post',
    data: params,
  })
}
// 获取列表
export function getList(params) {
  return request({
    url: 'strategy/v1/datagraph/reference/doc/list',
    method: 'post',
    data: params,
  })
}

// 新增
export function create(params) {
  return request({
    url: 'strategy/v1/datagraph/reference/doc/create',
    method: 'post',
    data: params,
  })
}

// 更新
export function update(params) {
  return request({
    url: 'strategy/v1/datagraph/reference/doc/update',
    method: 'post',
    data: params,
  })
}

// 详情
export function getInfo(params) {
  return request({
    url: 'strategy/v1/datagraph/reference/doc/get',
    method: 'post',
    data: params,
  })
}

// 删除
export function Delete(params) {
  return request({
    url: 'strategy/v1/datagraph/reference/doc/delete',
    method: 'post',
    data: params,
  })
}
