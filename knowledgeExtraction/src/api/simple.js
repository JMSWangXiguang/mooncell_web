/*
 * @Descripttion: 标注语料
 * @version:
 * @Author: 周子尧
 * @Date: 2020-11-19 15:40:20
 * @LastEditors: 周子尧
 * @LastEditTime: 2020-11-19 16:39:08
 */

import request from '@/utils/request'
// 获取标注语料
export function getWork(params) {
  return request({
    url: 'strategy/v1/simple/work/pop',
    method: 'post',
    data: params
  })
}

// 获取上一条标注语料
export function getFrontWork(params) {
  return request({
    url: 'strategy/v1/simple/work/front',
    method: 'post',
    data: params
  })
}

// 保存标注结果
export function submitWork(params) {
  return request({
    url: 'strategy/v1/simple/work/submit',
    method: 'post',
    data: params
  })
}

// 删除标注
export function deleteWork(params) {
  return request({
    url: 'strategy/v1/simple/work/rubbish',
    method: 'post',
    data: params
  })
}
