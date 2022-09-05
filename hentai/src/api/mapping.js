/*
 * @Author: imali
 * @Date: 2022-07-21 13:14:54
 * @LastEditTime: 2022-08-24 18:01:44
 * @LastEditors: imali
 * @Description:
 */
import request from '@/utils/request'

// 返回系统中不知道如何映射的词汇列表
export function unprocessList(data) {
  return request({
    url: 'strategy/v1/mapping/unprocess/list',
    method: 'post',
    data,
  })
}

// 返回系统中已经处理后的映射的词汇列表
export function processedList(data) {
  return request({
    url: 'strategy/v1/mapping/processed/list',
    method: 'post',
    data,
  })
}

// 返回系统中已经标为忽略的词汇列表
export function ignoreList(data) {
  return request({
    url: 'strategy/v1/mapping/ignore/list',
    method: 'post',
    data,
  })
}

// 获取已经处理后的单个词汇映射详情
export function getProcessed(data) {
  return request({
    url: 'strategy/v1/mapping/processed/get',
    method: 'post',
    data,
  })
}

// 从未处理词表中或用户添加词汇中创建映射关系
export function createPending(data) {
  return request({
    url: 'strategy/v1/mapping/pending/create',
    method: 'post',
    data,
  })
}

// 更新已经处理过的映射关系
export function updatePending(data) {
  return request({
    url: 'strategy/v1/mapping/pending/update',
    method: 'post',
    data,
  })
}

// 从未处理词表中将映射关系标为忽略
export function createIgnore(data) {
  return request({
    url: 'strategy/v1/mapping/ignore/create',
    method: 'post',
    data,
  })
}

// 获取映射关系分类列表
export function getPolicyList(data) {
  return request({
    url: 'strategy/v1/mapping/policy/list',
    method: 'post',
    data,
  })
}

// 验证词汇是否存在
export function checkWord(data) {
  return request({
    url: 'strategy/v1/mapping/unprocess/check',
    method: 'post',
    data,
  })
}

// 还原已忽略的映射词汇
export function reduceIgnore(data) {
  return request({
    url: 'strategy/v1/mapping/processed/reduction',
    method: 'post',
    data,
  })
}
