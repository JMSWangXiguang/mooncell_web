/*
 * @Description:
 * @version:
 * @Author: 周子尧
 * @Date: 2020-11-02 17:45:36
 * @LastEditors: imali
 * @LastEditTime: 2022-03-25 14:06:50
 */
import Cookies from 'js-cookie'

const TokenKey = 'token-hospital'
const InfoKey = 'userInfo'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getInfo() {
  if (Cookies.get(InfoKey)) {
    return JSON.parse(Cookies.get(InfoKey))
  }
}

export function setInfo(token) {
  return Cookies.set(InfoKey, JSON.stringify(token))
}

export function removeInfo() {
  return Cookies.remove(InfoKey)
}
