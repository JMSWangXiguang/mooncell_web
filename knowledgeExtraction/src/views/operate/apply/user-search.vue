<!--
 * @Author: imali
 * @Date: 2022-03-06 14:20:56
 * @LastEditTime: 2022-03-06 16:54:55
 * @LastEditors: imali
 * @Description:
-->
<template>
  <el-select
    ref="search"
    :value="value"
    :remote-method="remote"
    :loading="loading"
    v-bind="$attrs"
    v-on="$listeners"
    placeholder="请输入姓名搜索"
    clearable
    filterable
    remote
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
    </el-option>
  </el-select>
</template>
<script>
import { userList } from "@/api/userPermissions/user";
export default {
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      options: [],
    };
  },
  methods: {
    async remote(query) {
      if (query !== "") {
        try {
          this.loading = true;
          const { result, msg } = await userList({
            nickname: query,
            page: 1,
            size: 99999,
          });
          if (result) {
            this.options = result.accounts.map((a) => ({
              ...a,
              value: a.userid,
              label: `${a.name}${a.position ? `(${a.position})` : ""}`,
            }));
          } else {
            this.$message.error(msg);
          }
          this.loading = false;
        } catch (error) {
          console.error(error);
          this.loading = false;
        }
      } else {
        this.options = [];
      }
    },
  },
};
</script>
