/*
 * @Descripttion:
 * @version:
 * @Author: 周子尧
 * @Date: 2020-11-02 17:45:36
 * @LastEditors: imali
 * @LastEditTime: 2022-03-08 21:02:51
 */
const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.user.token,
  avatar: (state) => state.user.avatar,
  roles: (state) => state.user.roles,
  name: (state) => state.user.name,
  permission_routes: (state) => state.permission.routes,
  userid: (state) => state.user.userid,
  auths: (state) => state.user.auths,
  teams: (state) => state.user.teams,
};
export default getters;
