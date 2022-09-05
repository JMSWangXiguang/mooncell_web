<!--
 * @Author: imali
 * @Date: 2021-12-28 13:30:08
 * @LastEditTime: 2022-06-07 14:51:08
 * @LastEditors: imali
 * @Description:
-->
<template>
  <section class="app-main scrollbar-thin">
    <transition name="el-fade-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    },
  },
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  background: #f4f4f5;
  width: 100%;
  position: relative;
  height: calc(100vh - 100px);
  /* overflow: hidden; */
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
