/*
 * @Descripttion:
 * @version:
 * @Author: 周子尧
 * @Date: 2020-11-02 17:45:36
 * @LastEditors: 陈逸
 * @LastEditTime: 2022-04-19 17:12:10
 */
import Vue from "vue";
import CompositionApi from "@vue/composition-api";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import ElementUI from "element-ui";
import PlatfromUI from '@imal1/platform-components'
import "element-ui/lib/theme-chalk/index.css";
import "@imal1/platform-components/style.css";
import "./styles/element-variables.scss";
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import "@/styles/index.scss"; // global css

import App from "./App";
import store from "./store";
import router from "./router";

import "@/icons"; // icon
import "@/permission"; // permission control

Vue.use(CompositionApi);

import _ from "lodash";
Vue.prototype._ = _;

import VueBus from "vue-bus";
Vue.use(VueBus);

import VueAwesomeSwiper from "vue-awesome-swiper";
import "swiper/scss";
Vue.use(VueAwesomeSwiper);

import "windi.css";

//自定义拖动
Vue.directive("drag", function (el, binding) {
  let oDiv = el; //当前元素
  oDiv.onmousedown = function (e) {
    e.preventDefault();
    let bw = document.body.clientWidth;
    let bh = document.body.clientHeight;
    //鼠标按下，计算当前元素距离可视区的距离
    let disX = e.clientX - oDiv.offsetLeft;
    let disY = e.clientY - oDiv.offsetTop;
    // 计算两边坐标
    document.onmousemove = function (e) {
      let l = 0,
        t = 0;
      // 拖动边界
      if (e.clientX >= bw) {
        l = bw - disX;
      } else if (e.clientX <= 0) {
        {
          l = 0 - disX;
        }
      } else {
        l = e.clientX - disX;
      }
      if (e.clientY >= bh) {
        t = bh - disY;
      } else if (e.clientY <= 0) {
        t = 0 - disY;
      } else {
        t = e.clientY - disY;
      }
      //移动当前元素
      oDiv.style.left = l + "px";
      oDiv.style.top = t + "px";
    };
    // 鼠标停止移动时，事件移除
    document.onmouseup = function (e) {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };
});

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

import {
  sexList,
  identifyList,
  positionList,
  departmentList,
  organList,
  jobtitleList,
  educationList,
  reasonList,
  sourceList
} from "@/api/userPermissions/user";
import { getbTypes, getCateList } from "@/api/operate/apply";
// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI, { size: "medium" });
Vue.use(PlatfromUI);
Vue.config.productionTip = false;
new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
  async created() {
    await this.getSexList();
    await this.getJobtitleList();
    await this.getIdentifyList();
    await this.getOrganList();
    await this.getDepartmentList();
    await this.getBTypeList();
    await this.getCateList();
    await this.getEducationList();
    await this.getReasonList();
    await this.getSourceList();
  },
  methods: {
    async getSexList() {
      try {
        const res = await sexList();
        this.$store.dispatch("dict/setSexList", res.result);
      } catch (error) {
        console.error(error);
      }
    },
    async getIdentifyList() {
      try {
        const res = await identifyList();
        this.$store.dispatch("dict/setIdentifyList", res.result);
      } catch (error) {
        console.error(error);
      }
    },
    async getJobtitleList() {
      try {
        const res = await jobtitleList();
        this.$store.dispatch("dict/setJobtitleList", res.result);
      } catch (error) {
        console.error(error);
      }
    },
    async getPostionList() {
      try {
        const res = await positionList();
        this.$store.dispatch("dict/setPositionList", res.result);
      } catch (error) {
        console.error(error);
      }
    },
    async getOrganList() {
      try {
        const res = await organList();
        this.$store.dispatch("dict/setOrganList", res.result);
      } catch (error) {
        console.error(error);
      }
    },
    async getDepartmentList() {
      try {
        const res = await departmentList();
        this.$store.dispatch("dict/setDepartmentList", res.result);
      } catch (error) {
        console.error(error);
      }
    },
    async getBTypeList() {
      try {
        const res = await getbTypes();
        this.$store.dispatch("dict/setBTypeList", res.result);
      } catch (error) {
        console.error(error);
      }
    },
    async getCateList() {
      try {
        const res = await getCateList();
        this.$store.dispatch("dict/setCateList", res.result);
      } catch (error) {
        console.error(error);
      }
    },
    async getEducationList() {
      try {
        const res = await educationList();
        this.$store.dispatch("dict/setEducationList", res.result);
      } catch (error) {
        console.error(error);
      }
    },
    async getReasonList() {
      try {
        const res = await reasonList();
        this.$store.dispatch("dict/setReasonList", res.result);
      } catch (error) {
        console.error(error);
      }
    },
    async getSourceList() {
      try {
        const res = await sourceList();
        this.$store.dispatch("dict/setSourceList", res.result);
      } catch (error) {
        console.error(error);
      }
    },
  },
});
