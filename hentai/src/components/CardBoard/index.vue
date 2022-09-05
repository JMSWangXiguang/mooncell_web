<!--
 * @Author: imali
 * @Date: 2022-04-01 18:25:15
 * @LastEditTime: 2022-04-01 18:43:23
 * @LastEditors: imali
 * @Description:
-->
<template>
  <div class="card-board" h="[calc(100vh-100px)]">
    <el-empty v-if="!loading && !modelList.length" :image-size="200" h="full"></el-empty>
    <template v-else>
      <el-header v-if="header">
        <slot name="header"></slot>
      </el-header>
      <el-container></el-container>
      <el-footer v-if="footer">
        <el-pagination
          v-if="pagination"
          background
          hide-on-single-page
          layout="prev, pager, next"
          w="full"
        ></el-pagination>
        <slot name="footer"></slot>
      </el-footer>
    </template>
  </div>
</template>
<script>
export default {
  props: {
    row: {
      type: Number,
      required: true,
    },
    col: {
      type: Number,
      required: true,
    },
    data: {
      type: Array,
      default: () => [],
    },
    header: {
      type: Boolean,
      default: () => true,
    },
    footer: {
      type: Boolean,
      default: () => true,
    },
    pagination: {
      type: Boolean,
      default: () => true,
    },
  },
}
</script>
