/*
 * @Description:
 * @version:
 * @Author: 唐红娟
 * @Date: 2021-08-26
 * @LastEditors: imali
 * @LastEditTime: 2022-03-29 17:14:03
 */

import request from '@/utils/request'

// 获取词汇列表
export function getProcessedList(params) {
  return request({
    url: 'strategy/v1/synonym/processed/list',
    method: 'post',
    data: params,
  })
}

// 获取待处理的词汇详情
export function getInfo(params) {
  return request({
    url: 'strategy/v1/synonym/processed/get',
    method: 'post',
    data: params,
  })
}

// 修改词汇文本与分类
export function processedUpdate(params) {
  return request({
    url: 'strategy/v1/synonym/processed/update',
    method: 'post',
    data: params,
  })
}

// 更新
export function synonymUpdate(params) {
  return request({
    url: 'strategy/v1/synonym/processed/uping',
    method: 'post',
    data: params,
  })
}
