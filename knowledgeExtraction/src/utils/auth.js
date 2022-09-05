/*
 * @Descripttion:
 * @version:
 * @Author: 周子尧
 * @Date: 2020-11-02 17:45:36
 * @LastEditors: imali
 * @LastEditTime: 2022-03-14 11:03:27
 */
import Cookies from "js-cookie";

const TokenKey = "token-hospital";
const InfoKey = "userInfo";

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export function getInfo() {
  return JSON.parse(Cookies.get(InfoKey));
}

export function setInfo(token) {
  return Cookies.set(InfoKey, JSON.stringify(token));
}

export function removeInfo() {
  return Cookies.remove(InfoKey);
}

export const OAuth = {
  查看用户列表: "US01",
  查看用户详情: "US02",
  创建用户: "US03",
  修改用户信息: "US04",
  重置用户密码: "US05",
  查看用户权限: "US06",
  修改用户权限: "US07",
  查看用户轨迹: "US08",
  回滚用户修改: "US09",
  删除用户: "US10",
  用户停用: "US11",
  用户启用: "US12",
};
