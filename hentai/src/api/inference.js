/*
 * @Author: imali
 * @Date: 2022-04-27 15:07:27
 * @LastEditTime: 2022-04-27 18:17:49
 * @LastEditors: imali
 * @Description:
 */
import request from '@/utils/request'

// 需要提供需要病历文本
export function getBaseInfo(data) {
  return request({
    url: 'neet/v1/quality/inference/baseinfo',
    method: 'post',
    data,
  })
}

// 规则测试
export function curryTest(data) {
  return request({
    url: 'neet/v1/quality/inference/curry_test',
    method: 'post',
    data,
  })
}

// 根据章节列表
export function getChapterChild(data) {
  return request({
    url: 'neet/v1/manage/chapter/childs',
    method: 'post',
    data,
  })
}

// 需要提供需要病历文本
export function couvaTest(data) {
  return request({
    url: 'neet/v1/quality/inference/couva_test',
    method: 'post',
    data,
  })
}
