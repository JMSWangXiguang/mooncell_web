import request from "@/utils/request";

//用户列表
export function userList(params) {
  return request({
    url: "roc/v1/auth/user/list",
    method: "post",
    data: params,
  });
}

//性别列表
export function sexList(data) {
  return request({
    url: "roc/v1/common/sex/list",
    method: "post",
    data,
  });
}
//身份列表
export function identifyList(data) {
  return request({
    url: "roc/v1/common/identify/list",
    method: "post",
    data,
  });
}
//职称列表
export function jobtitleList(data) {
  return request({
    url: "roc/v1/common/jobtitle/list",
    method: "post",
    data,
  });
}
//学历列表
export function educationList(data) {
  return request({
    url: "roc/v1/common/education/list",
    method: "post",
    data,
  });
}
//职务列表
export function positionList(data) {
  return request({
    url: "roc/v1/common/position/list",
    method: "post",
    data,
  });
}
//机构列表
export function organList(data) {
  return request({
    url: "roc/v1/common/organ/list",
    method: "post",
    data,
  });
}
//部门列表
export function departmentList(data) {
  return request({
    url: "roc/v1/common/department/list",
    method: "post",
    data,
  });
}

//获取用户信息
export function getUser(params) {
  return request({
    url: "roc/v1/auth/user/get",
    method: "post",
    data: params,
  });
}

//新建用户信息
export function createUser(params) {
  return request({
    url: "roc/v1/auth/user/create",
    method: "post",
    data: params,
  });
}

//更新用户信息
export function updateUser(params) {
  return request({
    url: "roc/v1/auth/user/update",
    method: "post",
    data: params,
  });
}

//修改密码
export function updatePassword(params) {
  return request({
    url: "roc/v1/auth/user/password",
    method: "post",
    data: params,
  });
}

//修改密码
export function resetPassword(params) {
  return request({
    url: "roc/v1/auth/user/reset",
    method: "post",
    data: params,
  });
}

//用户角色
export function userLode(params) {
  return request({
    url: "roc/v1/auth/user/load",
    method: "post",
    data: params,
  });
}

//更新用户角色
export function updateUserRole(params) {
  return request({
    url: "roc/v1/auth/role/update",
    method: "post",
    data: params,
  });
}

//轨迹
//用户轨迹列表
export function getTraceList(params) {
  return request({
    url: "roc/v1/auth/trace/list",
    method: "post",
    data: params,
  });
}

//用户轨迹右侧列表
export function getRightTrace(params) {
  return request({
    url: "roc/v1/auth/trace/get",
    method: "post",
    data: params,
  });
}

//用户轨迹类型
export function traceType(params) {
  return request({
    url: "roc/v1/auth/trace/typies",
    method: "post",
    data: params,
  });
}

//首页轨迹类型
export function homepageTrace(params) {
  return request({
    url: "roc/v1/auth/trace/homepage",
    method: "post",
    data: params,
  });
}

//申请原因列表
export function reasonList(params) {
  return request({
    url: "roc/v1/common/reason/list",
    method: "post",
    data: params,
  });
}
//文献来源列表
export function sourceList(params) {
  return request({
    url: "roc/v1/common/source/list",
    method: "post",
    data: params,
  });
}
