/*
 * @Descripttion:
 * @version:
 * @Author: 周子尧
 * @Date: 2020-11-18 17:44:34
 * @LastEditors: 周子尧
 * @LastEditTime: 2020-11-23 16:11:41
 */
import { asyncRoutes, constantRoutes } from '@/router'
import { getSchema as getCategorys } from '@/api/category'
import { deepClone } from '@/utils'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */

 function hasPermission(roles, route) {
  // if (route.meta && (roles.includes(route.meta.key) || route.meta.key === undefined)) {
  //   // return roles.some(role => route.meta.key === role)
  //   return true
  // } else {
  //   return false
  // }
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return false
  }
}

export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}


const state = {
  routes: [],
  addRoutes: [],
  categorys: []
}

const mutations = {
  SET_CATEGORYS: (state, categorys) => {
    state.categorys = categorys
  },
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles,name) {
    // console.log('权限', roles)
    // roles = ['admin']
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        // console.log(asyncRoutes, roles)
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
