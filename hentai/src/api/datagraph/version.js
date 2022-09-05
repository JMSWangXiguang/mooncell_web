/*
 * @Author: imali
 * @Date: 2022-05-04 14:24:20
 * @LastEditTime: 2022-05-13 10:25:26
 * @LastEditors: imali
 * @Description:
 */
import request from '@/utils/request'

export function getVersionList(data) {
  return request({
    url: 'strategy/v1/datagraph/version/list',
    method: 'post',
    data,
  })
}

export function getCurrentVersion(data) {
  return request({
    url: 'strategy/v1/datagraph/version/current',
    method: 'post',
    data,
  })
}

export function createVersion(data) {
  return request({
    url: 'strategy/v1/datagraph/version/create',
    method: 'post',
    data,
  })
}

export function updateVersion(data) {
  return request({
    url: 'strategy/v1/datagraph/version/update',
    method: 'post',
    data,
  })
}

export function deleteVersion(data) {
  return request({
    url: 'strategy/v1/datagraph/version/delete',
    method: 'post',
    data,
  })
}
