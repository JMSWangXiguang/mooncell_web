/*
 * @Description:
 * @version:
 * @Author: 周子尧
 * @Date: 2020-11-02 17:45:36
 * @LastEditors: imali
 * @LastEditTime: 2022-04-02 13:15:03
 */
const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.user.token,
  avatar: (state) => state.user.avatar,
  roles: (state) => state.user.roles,
  name: (state) => state.user.name,
  permission_routes: (state) => state.permission.routes,
  tagList: (state) => state.app.tagList,
}
export default getters
