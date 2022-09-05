/*
 * @Author: imali
 * @Date: 2021-12-28 13:30:08
 * @LastEditTime: 2022-03-29 17:14:27
 * @LastEditors: imali
 * @Description:
 */
import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'neet/v1/quality/checkpoint/get',
    method: 'post',
    data: params,
  })
}

export function getDoc(params) {
  return request({
    url: 'neet/v1/quality/doc/get',
    method: 'post',
    data: params,
  })
}

export function getInfo(params) {
  return request({
    url: 'neet/v1/quality/one/get',
    method: 'post',
    data: params,
  })
}

export function update(params) {
  return request({
    url: 'neet/v1/quality/one/update',
    method: 'post',
    data: params,
  })
}

export function del(params) {
  return request({
    url: 'neet/v1/quality/one/delete',
    method: 'post',
    data: params,
  })
}
