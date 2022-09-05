/*
 * @Author: imali
 * @Date: 2021-12-28 13:30:08
 * @LastEditTime: 2022-03-29 17:14:24
 * @LastEditors: imali
 * @Description:
 */
import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'strategy/v1/vue-admin-template/table/list',
    method: 'get',
    params,
  })
}
