/*
 * @Descripttion:
 * @version:
 * @Author: 唐红娟
 * @Date: 2021-08-26
 * @LastEditors: 唐红娟
 * @LastEditTime: 2021-08-26
 */

import request from '@/utils/request'

// 获取词性管理列表
export function getSpeechList(params) {
  return request({
    url: 'strategy/v1/simple/speech/list',
    method: 'post',
    data: params
  })
}

// 获取待处理词汇列表
export function getList(params) {
  return request({
    url: 'strategy/v1/synonym/pending/list',
    method: 'post',
    data: params
  })
}

// 获取待处理的词汇详情
export function getInfo(params) {
  return request({
    url: 'strategy/v1/synonym/pending/get',
    method: 'post',
    data: params
  })
}

// 获取相似词汇列表
export function getHopeList(params) {
  return request({
    url: 'strategy/v1/synonym/hope/list',
    method: 'post',
    data: params
  })
}

// 待处理的词汇详情
export function getHopeInfo(params) {
  return request({
    url: 'strategy/v1/synonym/hope/get',
    method: 'post',
    data: params
  })
}

// 绑定同义词
export function synonymBind(params) {
  return request({
    url: 'strategy/v1/synonym/pending/bind',
    method: 'post',
    data: params
  })
}

// 创建词组
export function synonymBuild(params) {
  return request({
    url: 'strategy/v1/synonym/pending/build',
    method: 'post',
    data: params
  })
}

// 废弃词汇
export function synonymAbandon(params) {
  return request({
    url: 'strategy/v1/synonym/pending/abandon',
    method: 'post',
    data: params
  })
}

