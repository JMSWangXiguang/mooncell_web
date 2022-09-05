/*
 * @Author: imali
 * @Date: 2021-12-28 13:30:08
 * @LastEditTime: 2022-04-24 10:11:20
 * @LastEditors: imali
 * @Description:
 */
import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon/index' // svg component

// register globally
Vue.component('svg-icon', SvgIcon)

// const req = require.context('./svg', false, /\.svg$/)
// const requireAll = (requireContext) => requireContext.keys().map(requireContext)
// requireAll(req)
