/*
 * @Author: imali
 * @Date: 2022-03-01 11:04:57
 * @LastEditTime: 2022-03-01 11:06:03
 * @LastEditors: imali
 * @Description:
 */
import request from "@/utils/request";

// 获取列表
export function getList(params) {
  return request({
    url: "roc/v1/autoreader/bibliography/audit_list",
    method: "post",
    data: params,
  });
}
