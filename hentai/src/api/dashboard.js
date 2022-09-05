/*
 * @Author: imali
 * @Date: 2021-12-28 13:30:08
 * @LastEditTime: 2022-03-29 17:14:12
 * @LastEditors: imali
 * @Description:
 */
import request from '@/utils/request'

// 获取分类种类列表
export function upload(params) {
  return request({
    url: 'strategy/v1/neo4j/upload',
    method: 'post',
    data: params,
  })
}
