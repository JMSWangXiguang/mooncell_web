/*
 * @Author: imali
 * @Date: 2022-05-05 13:50:55
 * @LastEditTime: 2022-05-07 11:09:56
 * @LastEditors: imali
 * @Description:
 */
import request from '@/utils/request'

export function getKnowledgeList(data) {
  return request({
    url: 'strategy/v1/datagraph/knowledge/list',
    method: 'post',
    data,
  })
}

export function toggleVersion(data) {
  return request({
    url: 'strategy/v1/datagraph/knowledge/toggle',
    method: 'post',
    data,
  })
}

export function syncData(data) {
  return request({
    url: 'strategy/v1/datagraph/knowledge/syncdata',
    method: 'post',
    data,
  })
}

export function exportData(data) {
  return request({
    url: 'strategy/v1/datagraph/knowledge/export',
    method: 'post',
    data,
  })
}

export function sliceImport(data) {
  return request({
    url: 'strategy/v1/datagraph/knowledge/import',
    method: 'post',
    data,
  })
}

export function finishImport(data) {
  return request({
    url: 'strategy/v1/datagraph/knowledge/importfinish',
    method: 'post',
    data,
  })
}
