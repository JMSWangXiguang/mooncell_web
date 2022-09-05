<!--
 * @Author: imali
 * @Date: 2022-02-28 19:22:24
 * @LastEditTime: 2022-03-10 10:51:08
 * @LastEditors: imali
 * @Description:
-->
<template>
  <el-transfer
    ref="transfer"
    filterable
    v-model="selectList"
    :data="list"
    :titles="userType === 1 ? ['用户列表', '校验人'] : ['用户组列表', '校验人']"
    @left-check-change="handleLeftCheckChange"
  >
    <template v-if="!solidType" #left-footer>
      <el-button
        v-if="userType === 1"
        type="primary"
        icon="el-icon-right"
        @click="userType = 2"
      >
        切换到用户组列表
      </el-button>
      <el-button
        v-else
        type="primary"
        icon="el-icon-back"
        @click="userType = 1"
      >
        切换到用户列表
      </el-button>
    </template>
  </el-transfer>
</template>
<script>
import { difference } from "lodash";
export default {
  props: {
    userList: {
      type: Array,
      required: true,
    },
    groupList: {
      type: Array,
      required: true,
    },
    solidType: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      originType: 0,
      userType: 0, //  1: 用户; 2: 用户组;
      list: [],
      originSelectList: [],
      selectList: [],
    };
  },
  watch: {
    userType: {
      handler(newType) {
        if (this.originType === newType) {
          this.selectList = this.originSelectList;
        } else {
          this.selectList = [];
        }
        if (newType === 1) {
          this.list = this.userList;
        } else if (newType === 2) {
          this.list = this.groupList;
        }
      },
    },
    selectList(newSelect) {
      this.list = this.list.map((it) => {
        if (
          this.userType === 2 &&
          newSelect.length &&
          it.key !== newSelect[0]
        ) {
          return {
            ...it,
            disabled: true,
          };
        } else {
          return {
            ...it,
            disabled: false,
          };
        }
      });
    },
  },
  methods: {
    handleLeftCheckChange(newLeftSelect, toSelect) {
      if (this.userType === 2 && newLeftSelect.length > 1) {
        this.$message.warning("请勾选单个分组");
        this.$refs.transfer.$refs.leftPanel.checked = difference(
          this.$refs.transfer.leftChecked,
          toSelect
        );
      }
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-transfer-panel__header {
  .el-checkbox__input {
    display: none;
  }
}
::v-deep .el-transfer-panel__footer {
  height: 32px;
  .el-button {
    border-radius: 0;
    width: 100%;
  }
}
::v-deep .is-with-footer .el-transfer-panel__list {
  padding-bottom: 30px;
}
</style>
