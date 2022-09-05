/*
 * @Descripttion:
 * @version:
 * @Author: 周子尧
 * @Date: 2020-11-02 17:45:36
 * @LastEditors: imali
 * @LastEditTime: 2022-01-12 10:58:34
 */
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import permission from './modules/permission'
import dict from './modules/dict'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    permission,
    dict
  },
  getters
})

export default store
