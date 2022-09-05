<!--
 * @Author: imali
 * @Date: 2022-02-23 15:12:50
 * @LastEditTime: 2022-05-09 14:50:16
 * @LastEditors: 陈逸
 * @Description:
-->
<template>
  <el-row :gutter="8">
    <el-col
      ref="applyCol"
      :span="isCreateLitOrUser ? 14 : 24"
      v-loading="applyLoading"
    >
      <apply-dialog
        :view="value.event_id"
        :apply-id="value.apply_id"
        v-model="applyModel"
      />
    </el-col>
    <el-col :span="isCreateLitOrUser ? 10 : 24">
      <div
        flex="default col"
        :max="value.event_id === 'create_literature' ? 'h-585px' : ''"
        :mt="isCreateLitOrUser ? '0' : '8px'"
      >
        <el-card
          shadow="never"
          :style="
            isCreateLitOrUser
              ? showApprove
                ? `height:${compoHeight - 220}px`
                : `height:${compoHeight}px`
              : `height:${compoHeight - 370}px`
          "
          body-style="height:100%;overflow-y:auto"
        >
          <span v-if="value.event_id == 'disable_user' || value.event_id == 'enable_user'">
            <span v-if="applyBody.status === 1">申请启用</span>
            <span v-else>申请停用</span>
            {{applyBody.userid}}
          </span>
          <el-timeline m="1/12">
            <el-timeline-item
              v-for="(c, i) in chatModel"
              :key="uuidv4() + i"
              :type="
                c.type === 'approve'
                  ? 'warning'
                  : c.userid === myUserid
                  ? 'primary'
                  : undefined
              "
              size="large"
              icon="el-icon-s-comment"
              hide-timestamp
            >
              {{ c.remark }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
        <el-card v-if="showApprove" shadow="never" mt="8px">
          <p-form
            ref="form"
            labelWidth="auto"
            label-suffix="："
            v-model="approveModel"
            :rules="approveRules"
            :items="approveItems"
          >
            <template #status>
              <el-radio :label="4">通过</el-radio>
              <el-radio :label="2">驳回</el-radio>
              <el-radio :label="3">拒绝</el-radio>
            </template>
            <template #action>
              <el-button type="primary" @click="handleSubmit">提交</el-button>
            </template>
          </p-form>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import { getApplyInfo, getApplySubmit } from "@/api/operate/apply";
import applyDialog from "../../operate/apply/apply-dialog.vue";
import { compact } from "lodash";
import { v4 as uuidv4 } from "uuid";
export default {
  components: { applyDialog },
  props: {
    value: {
      type: Object,
      default: () => {},
    },
    showApprove: {
      type: Boolean,
      default: () => false,
    },
  },
  setup() {
    return {
      compact,
      uuidv4,
    };
  },
  data() {
    return {
      compoHeight: 0,
      applyLoading: false,
      applyModel: { userid: "" },
      approveModel: {
        remark: "",
        status: null,
      },
      approveItems: [
        {
          prop: "remark",
          label: "反馈",
          content: {
            is: "el-input",
            type: "textarea",
          },
        },
        {
          prop: "status",
          label: "审批",
          content: {
            is: "el-radio-group",
          },
        },
        {
          prop: "action",
          class: "submit-button",
        },
      ],
      approveRules: {
        remark: [
          {
            required: true,
            message: "请输入反馈内容",
            trigger: "change",
          },
        ],
        status: [
          {
            required: true,
            message: "请选择审批选项",
            trigger: "change",
          },
        ],
      },
      apply_body: ""
    };
  },
  computed: {
    myUserid() {
      return this.$store.getters.userid;
    },
    chatModel() {
      return JSON.parse(this.value.chat);
    },
    applyBody() {
      return JSON.parse(this.apply_body);
    },
    isCreateLitOrUser() {
      return (
        this.value.event_id === "create_literature" ||
        this.value.event_id === "create_user"
      );
    },
  },
  watch: {
    "value.apply_id": {
      async handler(apply_id) {
        this.applyLoading = true;
        try {
          const { result, msg } = await getApplyInfo({ apply_id });
          if (result) {
            this.apply_body = result.apply_body
            this.applyModel = {
              ...JSON.parse(result.apply_body)
              // remark: result.last_remark,
            };
          } else {
            this.$message.error(msg);
          }
          this.applyLoading = false;
        } catch (error) {
          console.error(error);
        }
      },
      immediate: true,
    },
  },
  created() {
    console.log(this.value);
  },
  updated() {
    this.compoHeight = this.$el.offsetHeight;
  },
  beforeDestroy() {
    this.compoHeight = 0;
  },
  methods: {
    handleSubmit() {
      const { apply_id, vote_id } = this.value;
      this.$refs.form.$refs["p-form"].validate(async (valid) => {
        if (valid) {
          try {
            const res = await getApplySubmit({
              ...this.approveModel,
              apply_id,
              vote_id,
            });
            if (res.status === 200) {
              this.$message.success("提交成功");
            } else {
              throw new Error(`提交失败，${res.msg}`);
            }
          } catch (error) {
            console.error(error);
          }
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .submit-button .el-form-item__content {
  text-align: right;
}
</style>
