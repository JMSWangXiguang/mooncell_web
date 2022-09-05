<!--
 * @Author: imali
 * @Date: 2022-03-06 14:51:22
 * @LastEditTime: 2022-04-11 13:27:16
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
      <user-search ref="userSearch" v-model="value.userid" />
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
    },
  },
  data() {
    return {
      items: [
        {
          prop: "userid",
          label: "用户",
        },
        {
          prop: "content",
          label: "权限内容",
          content: {
            is: "el-input",
            type: "textarea",
            placeholder: "请输入权限内容",
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
      ],
    };
  },
  computed: {
    reasons() {
      return this.$store.getters["dict/reasonList"];
    },
  }
};
</script>
