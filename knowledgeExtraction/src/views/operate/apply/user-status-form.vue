<!--
 * @Author: imali
 * @Date: 2022-02-22 17:31:42
 * @LastEditTime: 2022-04-11 13:23:55
 * @LastEditors: 陈逸
 * @Description:
-->
<template>
  <p-descriptions-form
    ref="form"
    v-model="value"
    :descriptions="{ column: 1 }"
    :items="items"
    v-bind="$attrs"
  >
    <template #userid>
      <user-search
        ref="userSearch"
        v-model="value.userid"
        @change="handleSelectUser"
      />
    </template>
    <template #status>
      <el-option label="启用" :value="1"></el-option>
      <el-option label="停用" :value="2"></el-option>
    </template>
    <template #remark>
      <el-option
        v-for="r in reasons"
        :key="r.id"
        :value="r.title"
        :label="r.title"
      />
    </template>
  </p-descriptions-form>
</template>
<script>
import PDescriptionsForm from "@/components/PDescriptionsForm.vue";
import UserSearch from "./user-search.vue";
export default {
  components: { PDescriptionsForm, UserSearch },
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  computed: {
    items() {
      return [
        {
          prop: "userid",
          label: "用户",
        },
        {
          prop: "status",
          label: "申请状态",
          content: {
            is: "el-select",
            disabled: true,
            placeholder: "请选择申请状态",
          },
        },
        {
          prop: "remark",
          label: "申请理由",
          content: {
            is: "el-select",
            clearable: true,
            placeholder: "请选择申请理由",
          },
        },
      ];
    },
    reasons() {
      return this.$store.getters["dict/reasonList"];
    },
  },
  methods: {
    handleSelectUser() {
      this.value.status =
        this.$refs.userSearch.options.find(
          (o) => o.userid === this.value.userid
        ).status === 1
          ? 2
          : 1;
    },
  },
};
</script>
