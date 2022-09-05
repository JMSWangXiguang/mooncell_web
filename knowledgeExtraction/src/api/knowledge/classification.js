/*
 * @Descripttion: 分类维护
 * @version:
 * @Author: 唐红娟
 * @Date: 2021-08-05
 * @LastEditors: 唐红娟
 * @LastEditTime: 2021-08-05
 */
import request from '@/utils/request'

// 获取分类种类列表
export function getCategoryList(params) {
  return request({
    url: 'strategy/v1/datagraph/category/type/list',
    method: 'post',
    data: params
  })
}

// 节点分类
// 获取节点分类列表
export function getList(params) {
  return request({
    url: 'strategy/v1/datagraph/category/combine/list',
    method: 'post',
    data: params
  })
}

// 新增
export function create(params) {
  return request({
    url: 'strategy/v1/datagraph/category/combine/create',
    method: 'post',
    data: params
  })
}

// 更新
export function update(params) {
  return request({
    url: 'strategy/v1/datagraph/category/combine/update',
    method: 'post',
    data: params
  })
}

// 详情
export function getInfo(params) {
  return request({
    url: 'strategy/v1/datagraph/category/combine/get',
    method: 'post',
    data: params
  })
}

// 主题列表
export function getTopicList(params) {
  return request({
    url: 'strategy/v1/datagraph/vertex/topic/list',
    method: 'post',
    data: params
  })
}

// 删除
export function deleteTopicList(params) {
  return request({
    url: 'strategy/v1/datagraph/category/combine/delete',
    method: 'post',
    data: params
  })
}
