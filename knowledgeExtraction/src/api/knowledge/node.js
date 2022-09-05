/*
 * @Descripttion: 分类维护
 * @version:
 * @Author: 唐红娟
 * @Date: 2021-08-07
 * @LastEditors: 唐红娟
 * @LastEditTime: 2021-08-07
 */
import request from '@/utils/request'

// 节点主体列表
export function getTopicList(params) {
  return request({
    url: 'strategy/v1/datagraph/vertex/topic/list',
    method: 'post',
    data: params
  })
}

// 节点树状列表
export function getTreeList(params) {
  return request({
    url: 'strategy/v1/datagraph/vertex/tree/list',
    method: 'post',
    data: params
  })
}

// 树节点详情
export function getTreeInfo(params) {
  return request({
    url: 'strategy/v1/datagraph/vertex/info/get',
    method: 'post',
    data: params
  })
}

// 获取所有主题节点树
export function getAllTree(params) {
  return request({
    url: 'strategy/v1/datagraph/vertex/all/list',
    method: 'post',
    data: params
  })
}

// 新建节点保存
export function createTreeList(params) {
  return request({
    url: 'strategy/v1/datagraph/vertex/info/create',
    method: 'post',
    data: params
  })
}

// 编辑节点保存
export function updateTreeList(params) {
  return request({
    url: 'strategy/v1/datagraph/vertex/info/update',
    method: 'post',
    data: params
  })
}

// 删除节点
export function deleteTreeList(params) {
  return request({
    url: 'strategy/v1/datagraph/vertex/info/delete',
    method: 'post',
    data: params
  })
}
