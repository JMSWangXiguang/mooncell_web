/*
 * @Author: imali
 * @Date: 2021-12-28 13:30:08
 * @LastEditTime: 2022-06-06 15:42:34
 * @LastEditors: imali
 * @Description:
 */
import Vue from 'vue'
import VueBus from 'vue-bus'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/zh-CN'
import 'element-ui/lib/theme-chalk/index.css'

import PlatfromUI from '@imal1/platform-components'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import 'virtual:windi.css'
import 'virtual:svg-icons-register'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI, { locale, size: 'small' })
Vue.use(PlatfromUI)
Vue.use(VueBus)
Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App),
})
