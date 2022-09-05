<!--
 * @Author: imali
 * @Date: 2022-02-22 17:10:46
 * @LastEditTime: 2022-05-09 14:44:59
 * @LastEditors: 陈逸
 * @Description:
-->
<template>
  <div :set-tab="(tab = tabs.find((t) => t.name === view))">
    <component
      v-if="view"
      :is="tab.is"
      :apply-id="applyId"
      v-model="value"
      v-bind="tab.attrs"
      disabled
    />
    <el-tabs v-else v-model="active" type="card">
      <el-tab-pane
        v-for="tab in tabs"
        :key="tab.name"
        :name="tab.name"
        :label="tab.label"
      >
        <component
          :ref="tab.ref"
          :is="tab.is"
          v-model="tab.model"
          v-bind="tab.attrs"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import LiteratureInfoForm from "./literature-info-form.vue";
import CreateUserForm from "../../userSystem/userForm/index.vue";
import UserStatusForm from "./user-status-form.vue";
import UserPermissionForm from "./user-permission-form.vue";
export default {
  components: {
    CreateUserForm,
    UserStatusForm,
    LiteratureInfoForm,
    UserPermissionForm,
  },
  props: {
    view: {
      type: String,
      default: () => "",
    },
    value: {
      type: Object,
      default: () => {},
    },
    applyId: {
      type: Number,
      default: () => 0,
    },
  },
  data() {
    const createUserModel = {
      userid: "",
      name: "",
      email: "",
      phone: "",
      account: "",
      apply: "",
      organization_id: "",
      identity_id: "",
      education_id: "",
      sex_id: "",
      job_title_id: "",
      department_id: "",
    };
    const userStatusModel = {
      userid: "",
      status: null,
      remark: "",
    };
    const createLiteratureModel = {
      remark: "",
      title: "",
      serial: "",
      author: "",
      editor: "",
      publish_time: "",
      page: "",
      language: "",
      reader_mode: "",
      edition: "",
      btype: "",
      publish_house: "",
      sn: "",
      volume: "",
      no: "",
      file: {
        filename: "",
        file_path_tmp: "",
      },
      is_ocr: 2,
      is_real: 2,
    };
    const userPermissionModel = {
      userid: "",
      content: "",
      remark: "",
    };
    return {
      active: "create_user",
      tabs: [
        {
          name: "create_user",
          label: "用户创建",
          ref: "createUserForm",
          model: createUserModel,
          attrs: { apply: true },
          is: "create-user-form",
        },
        {
          name: "user_status",
          label: "用户启用/停用",
          ref: "userStatusForm",
          model: userStatusModel,
          is: "user-status-form",
        },
        {
          name: "create_literature",
          label: "文献创建",
          ref: "createLiteratureForm",
          model: createLiteratureModel,
          is: "literature-info-form",
          attrs: { disableOCR: true, disableREAL: true },
        },
        {
          name: "user_permission",
          label: "用户权限",
          ref: "userPermissionForm",
          model: userPermissionModel,
          is: "user-permission-form",
        },
      ],
      userStatusModel,
      userPermissionModel,
      createUserModel,
      createLiteratureModel,
    };
  },
  watch: {
    active(newActive) {
      switch (newActive) {
        case "user_status":
        case "user_permission":
          this.$parent.$refs.dialog.style.width = "500px";
          break;
        default:
          this.$parent.$refs.dialog.style.width = "";
      }
    },
  },
  created() {
    console.log(this.value);
  },
};
</script>
<style lang="scss" scoped>
.el-tabs {
  margin-top: -10px;
  .el-tabs__nav-scroll {
    width: 80%;
  }
}
</style>
