import request from "@/utils/request";

// 获取列表
export function getList(params) {
  return request({
    url: "roc/v1/autoreader/bibliography/valid_list",
    method: "post",
    data: params,
  });
}
// 获取文献任务列表
export function getMyTaskList(params) {
  return request({
    url: "roc/v1/autoreader/bibliography/mytask_list",
    method: "post",
    data: params,
  });
}
//文献信息
// 详情
export function getBibliography(params) {
  return request({
    url: "roc/v1/reader/bibliography/get",
    method: "post",
    data: params,
  });
}

//创建
export function createBibliography(params) {
  return request({
    url: "roc/v1/reader/bibliography/create",
    method: "post",
    data: params,
  });
}

// 更新
export function updateBibliography(params) {
  return request({
    url: "roc/v1/reader/bibliography/update",
    method: "post",
    data: params,
  });
}
//上传数据
//获取上传文件信息
export function getDatafile(params) {
  return request({
    url: "roc/v1/autoreader/datafile/get",
    method: "post",
    data: params,
  });
}

//上传
export function upload(params) {
  return request({
    url: "roc/v1/autoreader/datafile/upload",
    method: "post",
    data: params,
  });
}

//分片上传
export function sliceUpload(data) {
  return request({
    url: "roc/v1/autoreader/datafile/sliceupload",
    method: "post",
    data,
  });
}

//分片上传完成
export function sliceFinish(data) {
  return request({
    url: "roc/v1/autoreader/datafile/slice_finish",
    method: "post",
    data,
  });
}

//下载上传文献
export function fileDownload(data) {
  return request({
    url: "roc/v1/autoreader/datafile/download",
    method: "post",
    data,
  });
}

//提取文字
//文字提取进度
export function getLoadword(params) {
  return request({
    url: "roc/v1/autoreader/loadword/get",
    method: "post",
    data: params,
  });
}
//文字提取方法
export function getLoadwordMethod(params) {
  return request({
    url: "roc/v1/autoreader/loadword/method",
    method: "post",
    data: params,
  });
}
//修改提取方法
export function updateLoadword(params) {
  return request({
    url: "roc/v1/autoreader/loadword/update",
    method: "post",
    data: params,
  });
}
//重新提取文字
export function retryLoadword(params) {
  return request({
    url: "roc/v1/autoreader/loadword/retry",
    method: "post",
    data: params,
  });
}

//审核内容
//获取审核状态信息
export function getAuditing(params) {
  return request({
    url: "roc/v1/autoreader/auditing/get",
    method: "post",
    data: params,
  });
}
//文献审核任务信息
export function taskAuditing(params) {
  return request({
    url: "roc/v1/autoreader/auditing/task",
    method: "post",
    data: params,
  });
}
//文献审核任务二次分配
export function secondTask(params) {
  return request({
    url: "roc/v1/autoreader/auditing/second_task",
    method: "post",
    data: params,
  });
}
//文献审核任务二次分配保存
export function updateSecondTask(data) {
  return request({
    url: "roc/v1/autoreader/auditing/second_update",
    method: "post",
    data,
  });
}
//修改审核任务分配
export function updateAuditing(params) {
  return request({
    url: "roc/v1/autoreader/auditing/update",
    method: "post",
    data: params,
  });
}
//获取文献内容列表
export function getVisionList(params) {
  return request({
    url: "roc/v1/autoreader/vision/list",
    method: "post",
    data: params,
  });
}
//获取每一页审核文字内容
export function getVisionInfo(params) {
  return request({
    url: "roc/v1/autoreader/vision/get",
    method: "post",
    data: params,
  });
}

//通过目录获取每一页审核文字内容
export function getCataInfo(params) {
  return request({
    url: "roc/v1/autoreader/vision/cata",
    method: "post",
    data: params,
  });
}

//修改每一页文献内容
export function updateVision(params) {
  return request({
    url: "roc/v1/autoreader/vision/words",
    method: "post",
    data: params,
  });
}

//文献校验通过
export function accessVision(params) {
  return request({
    url: "roc/v1/autoreader/vision/save",
    method: "post",
    data: params,
  });
}

//文献校验通过
export function revokeVision(params) {
  return request({
    url: "roc/v1/autoreader/vision/revoke",
    method: "post",
    data: params,
  });
}

//文献审核通过
export function auditVision(params) {
  return request({
    url: "roc/v1/autoreader/vision/audit",
    method: "post",
    data: params,
  });
}

//文献审核完成
export function finishVision(params) {
  return request({
    url: "roc/v1/autoreader/vision/finish",
    method: "post",
    data: params,
  });
}

//文献再次校验
export function resetVision(params) {
  return request({
    url: "roc/v1/autoreader/vision/reset",
    method: "post",
    data: params,
  });
}

//文献再次校验
export function recheckVision(params) {
  return request({
    url: "roc/v1/autoreader/vision/recheck",
    method: "post",
    data: params,
  });
}

//文献再次审核
export function reAuditVision(params) {
  return request({
    url: "roc/v1/autoreader/vision/reAudit",
    method: "post",
    data: params,
  });
}

// 获取文献文件
export function getPDF(data) {
  return request({
    url: "roc/v1/autoreader/catalogue/get_pdf",
    method: "post",
    data,
  });
}

//文献目录列表
export function catalogueList(params) {
  return request({
    url: "roc/v1/autoreader/catalogue/list",
    method: "post",
    data: params,
  });
}
//文献目录列表状态
export function catalogueStatus(params) {
  return request({
    url: "roc/v1/autoreader/catalogue/status",
    method: "post",
    data: params,
  });
}
//新增文献
export function catalogueCreate(params) {
  return request({
    url: "roc/v1/autoreader/catalogue/create",
    method: "post",
    data: params,
  });
}
//文献详情
export function catalogueGet(params) {
  return request({
    url: "/roc/v1/autoreader/catalogue/get",
    method: "post",
    data: params,
  });
}
//更新文献
export function catalogueUpdate(params) {
  return request({
    url: "roc/v1/autoreader/catalogue/update",
    method: "post",
    data: params,
  });
}
//删除文献
export function catalogueDelete(params) {
  return request({
    url: "roc/v1/autoreader/catalogue/delete",
    method: "post",
    data: params,
  });
}

//知识库状态
//文献状态信息
export function getStatus(params) {
  return request({
    url: "roc/v1/autoreader/status/get",
    method: "post",
    data: params,
  });
}
//修改文献启用状态
export function statusOnoff(params) {
  return request({
    url: "roc/v1/autoreader/status/onoff",
    method: "post",
    data: params,
  });
}

//修改文献开发状态
export function statusDevel(params) {
  return request({
    url: "roc/v1/autoreader/status/devel",
    method: "post",
    data: params,
  });
}

//待处理任务
export function pendingList(params) {
  return request({
    url: "roc/v1/task/pending/list",
    method: "post",
    data: params,
  });
}

//获取文献页码
export function getPages(params) {
  return request({
    url: "roc/v1/autoreader/bibliography/pages",
    method: "post",
    data: params,
  });
}

//获取文献页码详情
export function getPagesInfo(params) {
  return request({
    url: "roc/v1/autoreader/bibliography/single",
    method: "post",
    data: params,
  });
}

//文献页码更新当前
export function updatePages(params) {
  return request({
    url: "roc/v1/autoreader/bibliography/single/update",
    method: "post",
    data: params,
  });
}
