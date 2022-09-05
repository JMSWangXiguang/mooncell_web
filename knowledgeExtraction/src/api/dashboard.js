import request from '@/utils/request'

// 获取分类种类列表
export function upload(params) {
  return request({
    url: 'strategy/v1/neo4j/upload',
    method: 'post',
    data: params
  })
}