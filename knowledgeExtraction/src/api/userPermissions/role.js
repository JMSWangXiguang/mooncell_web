
import request from '@/utils/request'

//角色列表
export function roleList(params) {
  return request({
    url: 'roc/v1/auth/role/list',
    method: 'post',
    data:params
  })
}

//创建角色信息
export function createRole(params) {
    return request({
      url: 'roc/v1/auth/role/create',
      method: 'post',
      data: params
    })
}

//更新角色名称
export function updateRole(params) {
    return request({
      url: 'roc/v1/auth/role/rename',
      method: 'post',
      data: params
    })
}

//角色通用权限信息
export function roleAuth(params) {
    return request({
      url: 'roc/v1/auth/power/list',
      method: 'post',
      data: params
    })
}

//更新角色通用权限信息
export function updateRoleAuth(params) {
    return request({
      url: 'roc/v1/auth/power/update',
      method: 'post',
      data: params
    })
}

//启用
export function enableRoleAuth(params) {
  return request({
    url: 'roc/v1/auth/power/enable',
    method: 'post',
    data: params
  })
}

//停用
export function disableRoleAuth(params) {
  return request({
    url: 'roc/v1/auth/power/disable',
    method: 'post',
    data: params
  })
}
