/*
 * @Author: imali
 * @Date: 2022-05-10 10:03:09
 * @LastEditTime: 2022-05-16 17:06:03
 * @LastEditors: imali
 * @Description:
 */
import request from '@/utils/request'

export function getVisualList(data) {
  return request({
    url: 'strategy/v1/datagraph/visual/list',
    method: 'post',
    data,
  })
}

export function getVisualInfo(data) {
  return request({
    url: 'strategy/v1/datagraph/visual/info',
    method: 'post',
    data,
  })
}
