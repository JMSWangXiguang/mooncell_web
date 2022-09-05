/*
 * @Author: imali
 * @Date: 2022-04-07 11:32:16
 * @LastEditTime: 2022-04-11 17:51:28
 * @LastEditors: imali
 * @Description:
 */
import request from '@/utils/request'

// 获取分类种类列表
export function getTest(data) {
  return request({
    url: 'strategy/v1/simple/experiment/test',
    method: 'post',
    data,
  })
}

// 保存标注结果
export function saveTest(data) {
  return request({
    url: 'strategy/v1/simple/experiment/submit',
    method: 'post',
    data,
  })
}
