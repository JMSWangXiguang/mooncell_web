<!--
 * @Author: imali
 * @Date: 2022-04-19 16:23:19
 * @LastEditTime: 2022-08-24 16:42:43
 * @LastEditors: imali
 * @Description:
-->
<template>
  <div class="flex-1 mt-10px relative">
    <div class="mb-8px w-full absolute top-[calc(50%-88px)]">
      <p-button-dialog
        ref="create-dialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :button="{
          type: 'success',
          label: '新增',
          size: 'medium',
          class: 'list-item mx-auto px-17px',
        }"
        title="新增"
        width="1200px"
        destroy-on-close
      >
        <rule-info ref="rule-info" :ids="ids" type="新增" />
        <template #footer>
          <el-button @click="$refs['create-dialog'].dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="doAdd"> 确 定 </el-button>
        </template>
      </p-button-dialog>
      <!-- <el-button type="primary" class="float-right" @click="changeStatus">保 存</el-button> -->
    </div>
    <el-transfer
      ref="transfer"
      v-loading="loading"
      v-model="accessIds"
      :data="ruleList"
      :titles="['未启用', '启用中']"
      :button-texts="['停用', '启用']"
      :props="{ key: 'rule_id', label: 'title' }"
      class="h-[calc(100vh-270px)] flex"
      @change="changeStatus"
    >
      <template #default="{ option }">
        <span>
          {{ option.title }}
          <p-button-dialog
            :ref="`edit-dialog-${option.rule_id}`"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            title="编辑"
            width="1200px"
            destroy-on-close
          >
            <template #trigger>
              <i
                class="el-icon-s-tools float-right leading-30px"
                @click.stop="goEdit(option.rule_id)"
              ></i>
            </template>
            <rule-info :ref="`rule-info-${option.rule_id}`" :ids="ids" type="编辑" />
            <template #footer>
              <el-button type="danger" @click="doDel(option.rule_id)" class="float-left">
                删 除
              </el-button>
              <el-button @click="$refs[`edit-dialog-${option.rule_id}`].dialogVisible = false">
                取 消
              </el-button>
              <el-button type="primary" @click="doSave(option.rule_id)">确 定</el-button>
            </template>
          </p-button-dialog>
        </span>
      </template>
    </el-transfer>
  </div>
</template>
<script>
import { getRuleList, groupUpdate } from '@/api/rule/rule'
import { filter, map, includes } from 'lodash'
import ruleInfo from './rule-info.vue'
export default {
  components: { ruleInfo },
  props: {
    ids: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      ruleList: [],
      accessList: [],
    }
  },
  computed: {
    accessIds: {
      get() {
        return map(this.accessList, 'rule_id')
      },
      set(ids) {
        this.accessList = filter(this.ruleList, ({ rule_id }) => includes(ids, rule_id))
      },
    },
  },
  watch: {
    ids: {
      handler(newIds) {
        if (newIds.chapter_id) {
          this.getRuleList(newIds)
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    async getRuleList(params) {
      this.loading = true
      const { result } = await getRuleList({
        ...params,
        status: 'all',
      })
      this.ruleList = result.rules
      this.accessList = filter(result.rules, { status: 'access' })
      this.$refs.transfer.$refs.rightPanel.checked = this.accessIds
      this.loading = false
    },
    doAdd() {
      this.$refs['rule-info'].saveData(() => {
        this.getRuleList(this.ids)
        this.$refs['create-dialog'].dialogVisible = false
      })
    },
    doDel(id) {
      this.$refs[`rule-info-${id}`].handleDel(() => {
        this.getRuleList(this.ids)
        this.$refs[`edit-dialog-${id}`].dialogVisible = false
      })
    },
    doSave(id) {
      this.$refs[`rule-info-${id}`].saveData(() => {
        this.$refs[`edit-dialog-${id}`].dialogVisible = false
      })
    },
    //启用
    changeStatus() {
      // let obj = {};
      // obj.status = "access";
      // obj.rule_ids = this.changList;
      // statusUpdate(obj).then((res) => {
      //   if (res.status == 200) {
      //     this.$message.success("启用成功");
      //     this.getRuleList(this.params);
      //   }
      // });
      groupUpdate({
        ...this.ids,
        rule_ids: this.accessIds,
      })
        .then((res) => {
          if (res.status == 200) {
            this.$message.success('关联规则组成功')
          }
        })
        .finally(() => (this.$refs['create-dialog'].dialogVisible = false))
    },
    async goEdit(id) {
      await (this.$refs[`edit-dialog-${id}`].dialogVisible = true)
      this.$refs[`rule-info-${id}`].handleEdit(id)
    },
  },
}
</script>
<style lang="scss" scoped>
:deep {
  .el-transfer-panel {
    width: calc(50% - 62px);
    height: 100%;
    .el-transfer-panel__body {
      height: 100%;
    }
    .el-checkbox.el-transfer-panel__item {
      width: calc(100% - 30px);
    }
    .el-transfer-panel__list {
      height: calc(100% - 40px);
    }
  }
  .el-dialog__body {
    max-height: 60vh;
    overflow-y: auto;
  }
  .el-dialog__wrapper {
    cursor: default;
  }
  .el-transfer__buttons {
    align-self: center;
    display: flex;
    flex-direction: column;
    .el-button + .el-button {
      margin-left: 0;
    }
  }
}
</style>
