/*
 * @Description:
 * @version:
 * @Author: 周子尧
 * @Date: 2020-11-02 17:45:36
 * @LastEditors: imali
 * @LastEditTime: 2022-03-29 14:38:53
 */
import { login, authLogin } from '@/api/user'
import { getToken, setToken, removeToken, getInfo, setInfo, removeInfo } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USERID: (state, userid) => {
    state.userid = userid
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then((response) => {
          const { token } = response.result
          commit('SET_TOKEN', token)
          let obj = response.result
          obj.groupid = response.result.groupid
          response.result = obj
          setInfo(response.result)
          setToken(token)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  async authLogin({ commit }, payload) {
    try {
      const res = await authLogin(payload)
      const { token, userid } = res.result
      commit('SET_USERID', userid)
      commit('SET_TOKEN', token)
      setInfo(res.result)
      setToken(token)
    } catch (error) {
      console.log(error)
    }
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      const { userid, name, groupid } = getInfo()
      commit('SET_NAME', name)
      commit('SET_ROLES', groupid)
      commit('SET_AVATAR', '')
      commit('SET_USERID', userid)
      resolve()
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      resetRouter()
      removeInfo()
      // commit('SET_ROLES',[])
      commit('RESET_STATE')
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
