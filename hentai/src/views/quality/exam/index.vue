<!--
 * @Author: imali
 * @Date: 2022-04-26 11:21:22
 * @LastEditTime: 2022-06-21 09:43:13
 * @LastEditors: imali
 * @Description:
-->
<template>
  <div class="flex px-10px">
    <div class="w-1/3 min-w-300px p-10px">
      <el-radio-group v-model="departType">
        <el-radio-button v-for="(v, k) in EDepartType" :key="k" :label="k">
          <strong>{{ v }}</strong>
        </el-radio-button>
      </el-radio-group>
      <el-tree
        v-loading="groupLoading"
        ref="tree"
        node-key="chapter_id"
        :data="groupList"
        :expand-on-click-node="false"
        :props="{ label: 'title', value: 'group_id' }"
        class="mt-10px border-1px h-[calc(50vh-110px)] scrollbar-thin"
        highlight-current
        @node-click="({ group_id }) => (ids.group_id = group_id)"
      ></el-tree>
      <el-radio-group v-model="chapterType" class="mt-10px">
        <el-radio-button v-for="(v, k) in EChapterType" :key="k" :label="k">
          <strong>{{ v }}</strong>
        </el-radio-button>
      </el-radio-group>
      <el-tree
        v-loading="chapterLoading"
        ref="tree"
        node-key="chapter_id"
        :data="chapterList"
        :expand-on-click-node="false"
        :props="{ label: 'title', value: 'chapter_id' }"
        class="mt-10px border-1px h-[calc(50vh-110px)] scrollbar-thin"
        highlight-current
        @node-click="({ chapter_id }) => (ids.chapter_id = chapter_id)"
      ></el-tree>
    </div>
    <el-col class="m-10px w-full">
      <div class="flex flex-col h-[calc(100vh-126px)]">
        <div class="mb-10px p-20px bg-white border-1px">
          <div class="mb-10px">质控规则</div>
          <el-tag
            v-for="r in ruleList"
            :key="r.rule_id"
            :effect="rules.includes(r.rule_id) ? 'dark' : 'plain'"
            size="medium"
            class="mr-5px mb-5px cursor-pointer text-sm px-20px h-48px leading-46px"
            @click="joinRules(r.rule_id)"
          >
            {{ r.title }}
          </el-tag>
        </div>
        <el-tabs v-model="tabType" type="border-card" class="shadow-none flex-1 overflow-hidden">
          <el-tab-pane v-for="(v, k) in ETabType" :key="k" :label="v" :name="k">
            <test-tab
              :pane="k"
              :env="chapterType"
              :chapter_id="ids.chapter_id"
              :rules="rules"
              :children="chapterChildren"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-col>
  </div>
</template>
<script>
import { getRgroupList, getChapterList, getRuleList } from '@/api/rule/rule'
import { getChapterChild } from '@/api/inference'
import TestTab from './test-tab'
import { findIndex, map } from 'lodash'
const EDepartType = {
  depart: '科室',
  law: '规范',
}
const EChapterType = {
  inhos: '住院',
  outhos: '门诊',
}
const ETabType = {
  content: '填写病历',
  id: '病历ID',
}
export default {
  components: { TestTab },
  data() {
    return {
      ETabType,
      EDepartType,
      EChapterType,
      departType: 'depart',
      chapterType: 'inhos',
      tabType: 'content',
      groupList: [],
      chapterList: [],
      chapterChildren: [],
      ruleList: [],
      rules: [],
      groupLoading: false,
      chapterLoading: false,
      ids: {
        chapter_id: '',
        group_id: '',
      },
    }
  },
  watch: {
    departType: {
      async handler(group) {
        this.fetchGroupList(group)
      },
      immediate: true,
    },
    chapterType: {
      async handler(topic) {
        this.fetchChapterList(topic)
      },
      immediate: true,
    },
    ids: {
      async handler({ group_id, chapter_id }) {
        const cChildRes = await getChapterChild({ chapter_id })
        this.chapterChildren = cChildRes.result
        if (!chapter_id) {
          return
        }
        const ruleRes = await getRuleList({
          group_id,
          chapter_id,
          size: 99999,
          status: 'access',
        })
        this.ruleList = ruleRes.result.rules
        this.rules = map(ruleRes.result.rules, 'rule_id')
      },
      deep: true,
    },
  },
  methods: {
    async fetchGroupList(type) {
      this.groupLoading = true
      const { result } = await getRgroupList({ type })
      this.groupList = result.groups
      this.groupLoading = false
    },
    async fetchChapterList(topic) {
      this.chapterLoading = true
      const { result } = await getChapterList({ topic })
      this.chapterList = result.chapters
      this.chapterLoading = false
    },
    joinRules(id) {
      const findI = findIndex(this.rules, (r) => r === id)
      if (findI > -1) {
        this.$delete(this.rules, findI)
      } else {
        this.rules.push(id)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
:deep {
  .el-tabs__content {
    height: calc(100% - 40px);
  }
  .el-tabs__content > div {
    height: 100%;
  }
  .el-tree-node__content {
    height: 36px;
  }
  .el-form-item {
    margin-bottom: 8%;
  }
}
</style>
