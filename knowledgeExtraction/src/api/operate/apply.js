/*
 * @Author: sty
 * @Date: 2022-01-18 14:32:11
 * @LastEditTime: 2022-03-29 17:43:01
 * @LastEditors: 陈逸
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \knowledgeExtraction\src\api\operate\apply.js
 */

import request from "@/utils/request";

// 获取列表
export function getList(params) {
  return request({
    url: "roc/v1/autoreader/bibliography/list",
    method: "post",
    data: params,
  });
}

// 创建申请 文献
export function createApplyBiblio(params) {
  return request({
    url: "roc/v1/reader/bibliography/createapply",
    method: "post",
    data: params,
  });
}

// 申请创建角色
export function createUser(params) {
  return request({
    url: "roc/v1/auth/user/register",
    method: "post",
    data: params,
  });
}

// 申请停用启用用户
export function switchUser(params) {
  return request({
    url: "roc/v1/flow/apply/create",
    method: "post",
    data: params,
  });
}

// 获取我的申请的列表
export function getMyApplyList(params) {
  return request({
    url: "roc/v1/flow/apply/list",
    method: "post",
    data: params,
  });
}

export function getApplyInfo(data) {
  return request({
    url: "roc/v1/flow/apply/get",
    method: "post",
    data,
  });
}

// 获取审批的申请的列表
export function getApproveList(params) {
  return request({
    // url: 'roc/v1/apply/apply/apply_list',
    url: "roc/v1/flow/approve/list",
    method: "post",
    data: params,
  });
}

export function getManageApplyList(data) {
  return request({
    url: "roc/v1/flow/apply/manager_list",
    method: "post",
    data,
  });
}

// 获取审批的申请的详情
export function getApproveInfo(params) {
  return request({
    // url: 'roc/v1/apply/apply/apply_list',
    url: "roc/v1/flow/approve/get",
    method: "post",
    data: params,
  });
}
// 提交审批的申请的审批
export function getApplySubmit(params) {
  return request({
    // url: 'roc/v1/apply/apply/apply_list',
    url: "roc/v1/flow/approve/submit",
    method: "post",
    data: params,
  });
}
// 审批任务指派
export function createVote(data) {
  return request({
    url: "roc/v1/flow/vote/create",
    method: "post",
    data,
  });
}

// 获取成员列表
export function getExpertList(params) {
  return request({
    url: "roc/v1/auth/team/list",
    method: "post",
    data: params,
  });
}

// 一些码表
export function getbTypes(params) {
  return request({
    url: "roc/v1/common/btype/list",
    method: "post",
    data: params,
  });
}

export function getCateList(data) {
  return request({
    url: "roc/v1/common/catecode/list",
    method: "post",
    data,
  });
}

// 获取码表数据
export function getCommonCode(p, params) {
  return request({
    url: "roc/v1/common/" + p + "/list",
    method: "post",
    data: params,
  });
}
export function addCommonCode(p, params) {
  return request({
    url: "roc/v1/common/" + p + "/create",
    method: "post",
    data: params,
  });
}
export function editCommonCode(p, params) {
  return request({
    url: "roc/v1/common/" + p + "/update",
    method: "post",
    data: params,
  });
}
export function delCommonCode(p, params) {
  return request({
    url: "roc/v1/common/" + p + "/delete",
    method: "post",
    data: params,
  });
}

// 详细的码表
export function sexList(params) {
  return request({
    url: "roc/v1/common/sex/list",
    method: "post",
    data: params,
  });
}
export function jobtitleList(params) {
  return request({
    url: "roc/v1/common/jobtitle/list",
    method: "post",
    data: params,
  });
}
export function positionList(params) {
  return request({
    url: "roc/v1/common/position/list",
    method: "post",
    data: params,
  });
}
export function organList(params) {
  return request({
    url: "roc/v1/common/organ/list",
    method: "post",
    data: params,
  });
}
export function departmentList(params) {
  return request({
    url: "roc/v1/common/level/list",
    method: "post",
    data: params,
  });
}
export function identifyList(params) {
  return request({
    url: "roc/v1/common/identify/list",
    method: "post",
    data: params,
  });
}
export function creatApply(data) {
  return request({
    url: "roc/v1/flow/apply/create",
    method: "post",
    data,
  });
}

export function revokeApply(data) {
  return request({
    url: "roc/v1/flow/apply/revoke",
    method: "post",
    data,
  });
}
