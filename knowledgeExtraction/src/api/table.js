import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'strategy/v1/vue-admin-template/table/list',
    method: 'get',
    params
  })
}
