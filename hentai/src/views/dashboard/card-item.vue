<!--
 * @Author: imali
 * @Date: 2022-04-23 16:36:50
 * @LastEditTime: 2022-04-26 19:02:23
 * @LastEditors: imali
 * @Description:
-->
<template>
  <el-card
    shadow="hover"
    class="m-10px cursor-pointer border-none h-120px hover:all:(underline underline-offset-2) hover:svg:animate-bounce"
    @click.native="$router.push({ name })"
  >
    <div class="inline-block w-1/6 max-w-40px align-top">
      <svg-icon :icon-class="icon" class-name="w-6 h-6" />
    </div>
    <div class="inline-block w-5/6">
      <div class="text-base font-semibold">{{ title }}</div>
      <div v-if="desc" class="mt-10px text-xs text-dark-50 no-underline">{{ desc }}</div>
    </div>
  </el-card>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: () => '',
    },
    desc: {
      type: String,
      default: () => '',
    },
    icon: {
      type: String,
      default: () => '',
    },
    name: {
      type: String,
      default: () => '',
    },
  },
}
</script>
