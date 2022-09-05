/*
 * @Descripttion: 词性
 * @version:
 * @Author: 周子尧
 * @Date: 2020-11-18 09:12:52
 * @LastEditors: 周子尧
 * @LastEditTime: 2020-11-19 16:54:29
 */

import request from '@/utils/request'
// 获取词性列表
export function getList(params) {
  return request({
    url: 'strategy/v1/simple/speech/list',
    method: 'post',
    data: params
  })
}

// 新增词性
export function create(params) {
  return request({
    url: 'strategy/v1/simple/speech/create',
    method: 'post',
    data: params
  })
}

// 更新词性
export function update(params) {
  return request({
    url: 'strategy/v1/simple/speech/update',
    method: 'post',
    data: params
  })
}

// 根据类别获取词性
export function getSpeechByType(params) {
  return request({
    url: 'strategy/v1/simple/speech/schema',
    method: 'post',
    data: params
  })
}
