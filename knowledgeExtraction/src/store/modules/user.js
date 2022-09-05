/*
 * @Descripttion:
 * @version:
 * @Author: 周子尧
 * @Date: 2020-11-02 17:45:36
 * @LastEditors: 陈逸
 * @LastEditTime: 2022-04-19 14:46:23
 */
import { login, logout } from "@/api/user";
import {
  getToken,
  setToken,
  removeToken,
  getInfo,
  setInfo,
  removeInfo,
} from "@/utils/auth";
import { resetRouter } from "@/router";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: "",
    avatar: "",
    auths: [],
    userid: ""
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_USERID: (state, userid) => {
    state.userid = userid;
  },
  SET_AUTHS: (state, auths) => {
    state.auths = auths;
  },
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then((response) => {
          const { token } = response.result;
          commit("SET_TOKEN", token);
          setInfo(response.result);
          setToken(token);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      const { userid, name, groupid, arid } = getInfo();
      commit("SET_NAME", name);
      commit("SET_ROLES", groupid);
      commit("SET_AUTHS", arid.auids);
      commit(
        "SET_AVATAR",
        "data:image/png;base64,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"
      );
      commit("SET_USERID", userid);
      resolve();
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken(); // must remove  token  first
      resetRouter();
      removeInfo();
      // commit('SET_ROLES',[])
      commit("RESET_STATE");
      resolve();
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
