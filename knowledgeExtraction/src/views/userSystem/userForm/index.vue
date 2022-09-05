<!--
 * @Author: imali
 * @Date: 2022-02-20 19:25:16
 * @LastEditTime: 2022-05-17 13:34:12
 * @LastEditors: 陈逸
 * @Description:
-->
<template>
  <p-descriptions-form
    ref="form"
    v-model="value"
    :items="items"
    :rules="rules"
    :descriptions="{ column: 2 }"
    v-bind="$attrs"
    :disabled="disabled"
  >
    <template #sex_id>
      <el-option v-for="s in sexes" :key="s.id" :label="s.title" :value="s.id">
      </el-option>
    </template>
    <template #identity_id>
      <el-option
        v-for="it in identifies"
        :key="it.id"
        :value="it.id"
        :label="it.title"
      />
    </template>
    <template #organization_id>
      <el-option
        v-for="og in organizations"
        :key="og.oid"
        :value="og.oid"
        :label="og.name"
      />
    </template>
    <template #department_id>
      <el-option
        v-for="d in departments"
        :key="d.id"
        :value="d.id"
        :label="d.title"
      />
    </template>
    <template #job_title_id>
      <el-option
        v-for="job in jobtitles"
        :key="job.id"
        :value="job.id"
        :label="job.title"
      />
    </template>
    <template #education_id>
      <el-option
        v-for="pos in educations"
        :key="pos.id"
        :value="pos.id"
        :label="pos.title"
      />
    </template>
    <template #last_remark>
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
import dayjs from "dayjs";
const checkPhone = (rule, value, callback) => {
    let reg = /^1[345789]\d{9}$/
    if (!reg.test(value)) {
        callback(new Error('请输入正确的账号'))
    } else {
        callback()
    }
}
export default {
  components: { PDescriptionsForm },
  props: {
    value: {
      type: Object,
      default: () => {},
    },
    disabled: {
      type: Boolean,
      default: () => false,
    },
    apply: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    const items = [
      {
        prop: "name",
        label: "姓名",
        icon: "el-icon-postcard",
        content: {
          is: "el-input",
          clearable: true,
          placeholder: "请输入姓名",
        },
      },
      {
        prop: "sex_id",
        label: "性别",
        icon: "el-icon-male",
        content: {
          is: "el-select",
          clearable: true,
          placeholder: "请选择性别",
        },
      },
      // {
      //   prop: "birthday",
      //   label: "出生日期",
      //   icon: "el-icon-date",
      //   content: {
      //     is: "el-date-picker",
      //     type: "date",
      //     valueFormat: "yyyy-MM-dd",
      //     placeholder: "请选择日期",
      //     class: "w-full",
      //     pickerOptions: {
      //       disabledDate(d) {
      //         return dayjs().isBefore(dayjs(d), "day");
      //       },
      //     },
      //   },
      // },
      {
        prop: "account",
        label: "账号",
        icon: "el-icon-user",
        content: {
          is: "el-input",
          clearable: true,
          placeholder: "请输入账号(手机号)",
        },
      },
      {
        prop: "identity_id",
        label: "身份",
        icon: "el-icon-user",
        content: {
          is: "el-select",
          clearable: true,
          placeholder: "请选择身份",
        },
      },
      {
        prop: "email",
        label: "邮箱",
        icon: "el-icon-postcard",
        content: {
          is: "el-input",
          clearable: true,
          placeholder: "请输入邮箱",
        },
      },
      {
        prop: "organization_id",
        label: "所属机构",
        icon: "el-icon-office-building",
        content: {
          is: "el-select",
          clearable: true,
          placeholder: "请选择机构",
        },
      },
      {
        prop: "department_id",
        label: "科室",
        icon: "el-icon-house",
        content: {
          is: "el-select",
          clearable: true,
          placeholder: "请选择科室",
        },
      },
      {
        prop: "job_title_id",
        label: "职称",
        icon: "el-icon-suitcase",
        content: {
          is: "el-select",
          clearable: true,
          placeholder: "请选择职称",
        },
      },
      {
        prop: "education_id",
        label: "学位",
        icon: "el-icon-first-aid-kit",
        content: {
          is: "el-select",
          clearable: true,
          placeholder: "请选择学位",
        },
      },
      // {
      //   prop: "register_time",
      //   label: "注册时间",
      //   icon: "el-icon-date",
      //   content: {
      //     is: "el-date-picker",
      //     disabled: true,
      //     type: "date",
      //     valueFormat: "yyyy-MM-dd",
      //     class: "w-full",
      //   },
      // },
      {
        prop: "remark",
        label: "用户备注",
        icon: "el-icon-collection-tag",
        content: {
          is: "el-input",
          clearable: true,
          placeholder: "请输入备注",
        },
      },
    ];
    if (this.apply) {
      items.push({
        prop: "last_remark",
        label: "申请理由",
        icon: "el-icon-edit-outline",
        content: {
          is: "el-select",
          clearable: true,
          placeholder: "请选择申请理由",
        },
      });
    }
    return {
      items,
      rules: {
        userid: [{ required: true, message: "请输入用户ID", trigger: "blur" }],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        account: [
          { required: true, message: "请输入账号(手机号)", trigger: "blur" },
          { type: 'number', validator: checkPhone, message: '请输入正确的账号(手机号)', trigger: ['blur', 'change'] }
        ],
        organization_id: [
          { required: true, message: "请选择机构", trigger: "blur" },
        ],
        identity_id: [
          { required: true, message: "请选择身份", trigger: "blur" },
        ],
        education_id: [
          { required: true, message: "请选择学位", trigger: "blur" },
        ],
        sex_id: [{ required: true, message: "请选择性别", trigger: "blur" }],
        job_title_id: [
          { required: true, message: "请选择职称", trigger: "blur" },
        ],
        department_id: [
          { required: true, message: "请选择科室", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    sexes() {
      return this.$store.getters["dict/sexList"];
    },
    identifies() {
      return this.$store.getters["dict/identifyList"];
    },
    jobtitles() {
      return this.$store.getters["dict/jobtitleList"];
    },
    educations() {
      return this.$store.getters["dict/educationList"];
    },
    organizations() {
      return this.$store.getters["dict/organList"];
    },
    departments() {
      return this.$store.getters["dict/departmentList"];
    },
    reasons() {
      return this.$store.getters["dict/reasonList"];
    },
  }
};
</script>
<style lang="scss" scoped>
.el-descriptions {
  .el-form-item {
    margin: 0;
    width: 100%;
  }
  ::v-deep .el-descriptions-item__label {
    line-height: 32px;
  }
  ::v-deep .el-form-item__content,
  ::v-deep .el-select,
  ::v-deep .el-cascader {
    width: 100%;
  }
  ::v-deep .el-input__inner,
  ::v-deep .el-textarea__inner {
    border: none;
    padding: 0;
    background: #fff;
  }
  ::v-deep .el-input__inner {
    width: calc(100% - 30px);
  }
  ::v-deep .el-date-editor .el-input__prefix {
    display: none;
  }
}
</style>
