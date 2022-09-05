/*
 * @Author: imali
 * @Date: 2022-01-12 10:41:23
 * @LastEditTime: 2022-04-19 17:02:37
 * @LastEditors: 陈逸
 * @Description:
 */
const state = {
  sexList: [],
  identifyList: [],
  jobtitleList: [],
  positionList: [],
  organList: [],
  bTypeList: [],
  departmentList: [],
  cateList: [],
  educationList: [],
  reasonList: [],
  sourceList: [],
};

const mutations = {
  SET_SEXLIST(state, payload) {
    state.sexList = payload;
  },
  SET_IDENTIFYLIST(state, payload) {
    state.identifyList = payload;
  },
  SET_JOBTITLELIST(state, payload) {
    state.jobtitleList = payload;
  },
  SET_POSTIONLIST(state, payload) {
    state.positionList = payload;
  },
  SET_ORGANLIST(state, payload) {
    state.organList = payload;
  },
  SET_BTYPELIST(state, payload) {
    state.bTypeList = payload;
  },
  SET_DEPARTMENTLIST(state, payload) {
    state.departmentList = payload;
  },
  SET_CATELIST(state, payload) {
    state.cateList = payload;
  },
  SET_EDUCATIONLIST(state, payload) {
    state.educationList = payload;
  },
  SET_REASONLIST(state, payload) {
    state.reasonList = payload;
  },
  SET_SOURCELIST(state, payload) {
    state.sourceList = payload;
  },
};

const getters = {
  sexList(state) {
    return state.sexList;
  },
  identifyList(state) {
    return state.identifyList;
  },
  jobtitleList(state) {
    return state.jobtitleList;
  },
  positionList(state) {
    return state.positionList;
  },
  organList(state) {
    return state.organList;
  },
  bTypeList(state) {
    return state.bTypeList;
  },
  departmentList(state) {
    return state.departmentList;
  },
  cateList(state) {
    return state.cateList;
  },
  educationList(state) {
    return state.educationList;
  },
  reasonList(state) {
    return state.reasonList;
  },
  sourceList(state) {
    return state.sourceList;
  },
};

const actions = {
  setSexList({ commit }, payload) {
    commit("SET_SEXLIST", payload);
  },
  setIdentifyList({ commit }, payload) {
    commit("SET_IDENTIFYLIST", payload);
  },
  setJobtitleList({ commit }, payload) {
    commit("SET_JOBTITLELIST", payload);
  },
  setPositionList({ commit }, payload) {
    commit("SET_POSTIONLIST", payload);
  },
  setOrganList({ commit }, payload) {
    commit("SET_ORGANLIST", payload);
  },
  setBTypeList({ commit }, payload) {
    commit("SET_BTYPELIST", payload);
  },
  setDepartmentList({ commit }, payload) {
    commit("SET_DEPARTMENTLIST", payload);
  },
  setCateList({ commit }, payload) {
    commit("SET_CATELIST", payload);
  },
  setEducationList({ commit }, payload) {
    commit("SET_EDUCATIONLIST", payload);
  },
  setReasonList({ commit }, payload) {
    commit("SET_REASONLIST", payload);
  },
  setSourceList({ commit }, payload) {
    commit("SET_SOURCELIST", payload);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};
