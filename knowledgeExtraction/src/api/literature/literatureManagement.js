/*
 * @Author: imali
 * @Date: 2021-12-28 13:30:08
 * @LastEditTime: 2022-03-01 00:54:58
 * @LastEditors: imali
 * @Description:
 */
import request from "@/utils/request";

// 获取列表
export function getList(params) {
  return request({
    url: "roc/v1/reader/bibliography/list",
    method: "post",
    data: params,
  });
}

// 新增
export function create(params) {
  return request({
    url: "roc/v1/reader/bibliography/create",
    method: "post",
    data: params,
  });
}

// 更新
export function update(params) {
  return request({
    url: "roc/v1/reader/bibliography/update",
    method: "post",
    data: params,
  });
}

// 详情
export function getInfo(params) {
  return request({
    url: "roc/v1/reader/bibliography/get",
    method: "post",
    data: params,
  });
}

// 更新状态
export function updateStatus(params) {
  return request({
    url: "roc/v1/reader/bibliography/onoff",
    method: "post",
    data: params,
  });
}

//文献类型列表
export function bTypeList(data) {
  return request({
    url: "roc/v1/reader/bibliography/btype_list",
    method: "post",
    data,
  });
}

// 提交审核人
export function submitAuditor(data) {
  return request({
    url: "roc/v1/reader/bibliography/auditer",
    method: "post",
    data,
  });
}
