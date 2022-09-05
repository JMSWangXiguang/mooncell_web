/*
 * @Author:sty
 * @Date: 2022-01-24 16:32:14
 * @LastEditTime: 2022-03-02 20:05:47
 * @LastEditors: imali
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \knowledgeExtraction\src\api\operate\group.js
 */

import request from "@/utils/request";

// 获取成员列表
export function getExpertList(params) {
  return request({
    url: "roc/v1/auth/team/list",
    method: "post",
    data: params,
  });
}

// 获取全体成员列表
export function getUserList(params) {
  return request({
    url: "roc/v1/auth/user/list",
    method: "post",
    data: params,
  });
}

// add用户组
export function addGroup(params) {
  return request({
    url: "roc/v1/auth/team/create",
    method: "post",
    data: params,
  });
}

// 更新用户组
export function updateGroup(params) {
  return request({
    url: "roc/v1/auth/team/update",
    method: "post",
    data: params,
  });
}

// del用户组
export function delGroup(params) {
  return request({
    url: "roc/v1/auth/team/delete",
    method: "post",
    data: params,
  });
}

// 获取组内成员
export function getGrouper(params) {
  return request({
    url: "roc/v1/auth/team/member",
    method: "post",
    data: params,
  });
}

// 获取组的情况
export function getGroupInfo(params) {
  return request({
    url: "roc/v1/auth/team/get",
    method: "post",
    data: params,
  });
}

// add组员
export function addGrouper(params) {
  return request({
    url: "roc/v1/auth/team/add",
    method: "post",
    data: params,
  });
}

// 删除组员
export function delGrouper(params) {
  return request({
    url: "roc/v1/auth/team/remove",
    method: "post",
    data: params,
  });
}

// 任命组长
export function jobGrouper(params) {
  return request({
    url: "roc/v1/auth/team/job",
    method: "post",
    data: params,
  });
}

// 保存分组编辑
export function addMember(data) {
  return request({
    url: "roc/v1/auth/team/add_member",
    method: "post",
    data,
  });
}

// 获取组长所有分组
export function getTeams() {
  return request({
    url: "roc/v1/auth/team/teams",
    method: "get"
  })
}
