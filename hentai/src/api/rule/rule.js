/*
 * @Description:
 * @version:
 * @Author: 唐红娟
 * @Date: 2021-08-26
 * @LastEditors: imali
 * @LastEditTime: 2022-06-24 11:07:03
 */

import request from '@/utils/request'

// 获取科室列表
export function getDepartList(params) {
  return request({
    url: 'neet/v1/manage/depart/list',
    method: 'post',
    data: params,
  })
}

// 同步科室信息
export function syncDepart(params) {
  return request({
    url: 'neet/v1/manage/depart/refresh',
    method: 'post',
    data: params,
  })
}

// 获取规则组列表
export function getRgroupList(params) {
  return request({
    url: 'neet/v1/manage/rgroup/list',
    method: 'post',
    data: params,
  })
}

// 获取规则组详情
export function getRgroupInfo(params) {
  return request({
    url: 'neet/v1/manage/rgroup/get',
    method: 'post',
    data: params,
  })
}

// 创建规则组
export function rgroupCreate(params) {
  return request({
    url: 'neet/v1/manage/rgroup/create',
    method: 'post',
    data: params,
  })
}

// 更新规则组
export function rgroupUpdate(params) {
  return request({
    url: 'neet/v1/manage/rgroup/update',
    method: 'post',
    data: params,
  })
}

// 删除规则组
export function rgroupDelete(params) {
  return request({
    url: 'neet/v1/manage/rgroup/delete',
    method: 'post',
    data: params,
  })
}

// 获取章节列表
export function getChapterList(params) {
  return request({
    url: 'neet/v1/manage/chapter/list',
    method: 'post',
    data: params,
  })
}

// 获取章节详情
export function getChapterInfo(params) {
  return request({
    url: 'neet/v1/manage/chapter/get',
    method: 'post',
    data: params,
  })
}

// 病例结构化信息列表
export function getAmcList(params) {
  return request({
    url: 'neet/v1/manage/chapter/amc/list',
    method: 'post',
    data: params,
  })
}

// 创建章节组
export function chapterCreate(params) {
  return request({
    url: 'neet/v1/manage/chapter/create',
    method: 'post',
    data: params,
  })
}

// 更新章节组
export function chapterUpdate(params) {
  return request({
    url: 'neet/v1/manage/chapter/update',
    method: 'post',
    data: params,
  })
}

// 删除章节组
export function chapterDelete(params) {
  return request({
    url: 'neet/v1/manage/chapter/delete',
    method: 'post',
    data: params,
  })
}

// 获取章节列表
export function getRuleList(params) {
  return request({
    url: 'neet/v1/manage/rule/list',
    method: 'post',
    data: params,
  })
}

// 获取章节详情
export function getRuleInfo(params) {
  return request({
    url: 'neet/v1/manage/rule/get',
    method: 'post',
    data: params,
  })
}

// 创建章节组
export function ruleCreate(params) {
  return request({
    url: 'neet/v1/manage/rule/create',
    method: 'post',
    data: params,
  })
}

// 更新章节组
export function ruleUpdate(params) {
  return request({
    url: 'neet/v1/manage/rule/update',
    method: 'post',
    data: params,
  })
}

// 删除章节组
export function ruleDelete(params) {
  return request({
    url: 'neet/v1/manage/rule/delete',
    method: 'post',
    data: params,
  })
}

// 更新规则的状态
export function statusUpdate(params) {
  return request({
    url: 'neet/v1/manage/rule/update/status',
    method: 'post',
    data: params,
  })
}

// 绑定规则到组合(支持批量)
export function groupUpdate(params) {
  return request({
    url: 'neet/v1/manage/rule/update/group',
    method: 'post',
    data: params,
  })
}

// 校验函数类型
export function funcTypes(params) {
  return request({
    url: 'neet/v1/manage/func/typies',
    method: 'post',
    data: params,
  })
}

// 校验函数
export function funcList(params) {
  return request({
    url: 'neet/v1/manage/func/list',
    method: 'post',
    data: params,
  })
}

// 获取函数分类列表
export function condFuncList(params) {
  return request({
    url: 'neet/v1/manage/cond_func/list',
    method: 'post',
    data: params,
  })
}

// 获取函数参数值
export function condArgs(params) {
  return request({
    url: 'neet/v1/manage/cond_args/list',
    method: 'post',
    data: params,
  })
}

// 校验函数
export function ruleAllList(params) {
  return request({
    url: 'neet/v1/manage/rule/all/list',
    method: 'post',
    data: params,
  })
}

// 获取函数参数值
export function getArgList(data) {
  return request({
    url: 'neet/v1/manage/args/list',
    method: 'post',
    data,
  })
}
