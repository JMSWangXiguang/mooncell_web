/*
 * @Author: imali
 * @Date: 2022-03-29 17:13:49
 * @LastEditTime: 2022-04-11 10:14:34
 * @LastEditors: imali
 * @Description:
 */
import request from '@/utils/request'

// 获取模型列表
export function getModelList(data) {
  return request({
    url: 'strategy/v1/common/model/list',
    method: 'post',
    data,
  })
}

// 获取模型信息
export function getModelInfo(data) {
  return request({
    url: 'strategy/v1/common/model/info',
    method: 'post',
    data,
  })
}

// 获取样本数量
export function getModelSample(data) {
  return request({
    url: 'strategy/v1/common/model/sample',
    method: 'post',
    data,
  })
}

// 获取训练模型类型
export function getModelSchema(data) {
  return request({
    url: 'strategy/v1/common/mould/schema',
    method: 'post',
    data,
  })
}

// 获取模型默认参数
export function getModelArgument(data) {
  return request({
    url: 'strategy/v1/common/model/argument',
    method: 'post',
    data,
  })
}

// 创建模型
export function createModel(data) {
  return request({
    url: 'strategy/v1/common/model/create',
    method: 'post',
    data,
  })
}

// 更新模型
export function updateModel(data) {
  return request({
    url: 'strategy/v1/common/model/update',
    method: 'post',
    data,
  })
}

// 训练模型
export function trainModel(data) {
  return request({
    url: 'strategy/v1/common/model/train',
    method: 'post',
    data,
  })
}

// 取消训练
export function cancelTrain(data) {
  return request({
    url: 'strategy/v1/common/model/cancel',
    method: 'post',
    data,
  })
}
