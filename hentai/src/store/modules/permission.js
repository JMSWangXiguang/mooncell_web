/*
 * @Description:
 * @version:
 * @Author: 周子尧
 * @Date: 2020-11-18 17:44:34
 * @LastEditors: imali
 * @LastEditTime: 2022-04-09 23:47:58
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
  return true
  // if (route.meta && (roles.includes(route.meta.key) || route.meta.key === undefined)) {
  //   // return roles.some(role => route.meta.key === role)
  //   return true
  // } else {
  //   return false
  // }
}

export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach((route) => {
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
  categorys: [],
}

const mutations = {
  SET_CATEGORYS: (state, categorys) => {
    state.categorys = categorys
  },
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
}

const actions = {
  generateRoutes({ commit }, roles) {
    // eslint-disable-next-line compat/compat
    return new Promise((resolve) => {
      var accessedRoutes = deepClone(asyncRoutes) || []
      const settagsIndex = accessedRoutes.findIndex((item) => item.name === 'SetTags')
      const marktagsIndex = accessedRoutes[settagsIndex].children.findIndex(
        (item) => item.name === 'MarkTags'
      )
      accessedRoutes[settagsIndex].children[marktagsIndex].children = accessedRoutes[
        settagsIndex
      ].children[marktagsIndex].children.concat(state.categorys)
      // accessedRoutes[settagsIndex].children[marktagsIndex].children = state.categorys
      accessedRoutes = filterAsyncRoutes(accessedRoutes, roles)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  getCategorys({ commit }) {
    return getCategorys().then((res) => {
      const categorys = res.result.category_schema.map((item) => {
        return {
          path: item.category_id,
          component: () => import('@/views/marktags'),
          name: 'category' + item.category_id,
          hidden: true,
          meta: { title: `病例标注 - ${item.name}`, id: item.category_id },
        }
      })
      commit('SET_CATEGORYS', categorys)
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
