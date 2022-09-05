<!--
 * @Description: 
 * @version: 
 * @Author: 陈逸
 * @Date: 2022-03-25 10:34:22
 * @LastEditors: 陈逸
 * @LastEditTime: 2022-04-06 13:33:40
-->
<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
export default {
  name: 'App',
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    }
  }
}
</script>
