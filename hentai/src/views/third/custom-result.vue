<!--
 * @Author: imali
 * @Date: 2022-07-20 16:26:25
 * @LastEditTime: 2022-07-20 16:49:54
 * @LastEditors: imali
 * @Description:
-->
<template>
  <div>
    <template v-if="status === 'finished'">
      <el-empty>
        <template #description>
          <div class="text-center text-color-success">未检测出错误</div>
        </template>
      </el-empty>
    </template>
    <div v-if="status === 'running'" class="text-center text-color-warning">校验中…</div>
    <div v-if="status === 'wait'" class="text-center text-color-info">校验等待中…</div>
    <template v-if="status === 'error'">
      <el-empty>
        <template #description>
          <div class="text-center text-color-danger">校验服务出错</div>
        </template>
      </el-empty>
    </template>
  </div>
</template>
<script>
export default {
  props: {
    status: {
      type: String,
      default: () => '',
    },
  },
}
</script>
<style lang="scss" scoped>
:deep {
  .el-empty {
    padding: 10px 0;
    .el-empty__image {
      width: 100px;
    }
    .el-empty__description {
      margin-top: 10px;
    }
  }
}
</style>
