<!--
 * @Author: imali
 * @Date: 2022-04-12 18:07:36
 * @LastEditTime: 2022-06-07 14:30:47
 * @LastEditors: imali
 * @Description:
-->
<template>
  <div :class="classObj" class="app-wrapper clear-both">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar />
    <div class="main-content">
      <div :class="{ 'fixed-header': fixedHeader }">
        <tag-bar />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import TagBar from './components/TagBar'
import Sidebar from './components/Sidebar'
import AppMain from './components/AppMain'

import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    TagBar,
    Sidebar,
    AppMain,
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile',
      }
    },
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
