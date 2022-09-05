/*
 * @Description: 疾病维护
 * @version:
 * @Author: 唐红娟
 * @Date: 2021-08-07
 * @LastEditors: 唐红娟
 * @LastEditTime: 2021-08-07
 */
import request from '@/utils/request'

// 树状列表
export function getTreeList(params) {
  return request({
    url: 'strategy/v1/datagraph/disease/tree/list',
    method: 'post',
    data: params
  })
}

// 获取疾病详细信息
export function getInfo(params) {
  return request({
    url: 'strategy/v1/datagraph/disease/info/get',
    method: 'post',
    data: params
  })
}

//属性树列表
export function getEdgeList(params) {
  return request({
    url: 'strategy/v1/datagraph/disease/edge/list',
    method: 'post',
    data: params
  })
}

//相关附加属性字段列表
export function getMetaList(params) {
  return request({
    url: 'strategy/v1/datagraph/disease/meta/list',
    method: 'post',
    data: params
  })
}

//获取疾病与其他属性关联信息
export function getPropertyList(params) {
  return request({
    url: 'strategy/v1/datagraph/disease/property/get',
    method: 'post',
    data: params
  })
}

//更新保存疾病与其他属性关联信息
export function updateProperty(params) {
  return request({
    url: 'strategy/v1/datagraph/disease/property/update',
    method: 'post',
    data: params
  })
}

//文献树列表
export function referenceTree(params) {
  return request({
    url: 'strategy/v1/datagraph/reference/tree/list',
    method: 'post',
    data: params
  })
}

//文献关联信息获取
export function getReference(params) {
  return request({
    url: 'strategy/v1/datagraph/disease/reference/get',
    method: 'post',
    data: params
  })
}

//文献关联信息保存
export function updateReference(params) {
  return request({
    url: 'strategy/v1/datagraph/disease/reference/update',
    method: 'post',
    data: params
  })
}

//新建疾病保存
export function createTree(params) {
  return request({
    url: 'strategy/v1/datagraph/disease/info/create',
    method: 'post',
    data: params
  })
}

//修改疾病单文本框和双文本框保存
export function updateTree(params) {
  return request({
    url: 'strategy/v1/datagraph/disease/textbox/update',
    method: 'post',
    data: params
  })
}
