<!--
 * @Description: 
 * @version: 
 * @Author: 陈逸
 * @Date: 2022-03-25 10:34:22
 * @LastEditors: 陈逸
 * @LastEditTime: 2022-04-08 15:33:35
-->
<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: "AppMain",
  computed: {
    key() {
      return this.$route.path;
    },
  },
};
</script>

<style scoped>
/* .app-main {
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: 10px;
} */
.app-main {
  min-height: calc(100vh - 70px);
  width: 100%;
  position: absolute;
  top: 60px;
  bottom: 0;
  padding: 10px;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
