<!--
 * @Author: imali
 * @Date: 2022-04-12 18:07:36
 * @LastEditTime: 2022-05-30 17:50:11
 * @LastEditors: imali
 * @Description:
-->
<template>
  <div class="h-full">
    <el-radio-group v-model="params.topic" @change="changeType">
      <el-radio-button v-for="(v, k) in ETopicType" :key="k" :label="k">
        <strong>{{ v }}</strong>
      </el-radio-button>
    </el-radio-group>
    <div class="tree-box mt-5px h-[calc(100vh-165px)]">
      <el-tree
        v-if="treeList.length"
        ref="tree"
        highlight-current
        class="filter-tree"
        :data="treeList"
        :props="defaultProps"
        default-expand-all
        :expand-on-click-node="false"
        @node-click="selectNode"
        node-key="chapter_id"
        :current-node-key="currentNodeKey"
      >
        <span class="custom-tree-node" slot-scope="{ node }">
          <span>{{ node.label }}</span>
        </span>
      </el-tree>
    </div>
  </div>
</template>
<script>
import { getChapterList } from '@/api/rule/rule'
import { ETopicType } from './enum'
export default {
  name: 'TreeBox',
  props: {
    ids: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      ETopicType,
      params: {
        style: 'tree',
        topic: 'inhos',
      },
      treeList: [],
      defaultProps: {
        label: 'title',
        children: 'child',
      },
      currentNodeKey: '',
      title: '',
      topicList: [],
    }
  },
  created() {
    this.getChapterList(this.params)
  },
  mounted() {},
  methods: {
    // 回去树数据
    async getChapterList(params) {
      const res = await getChapterList(params)
      this.treeList = res.result.chapters
    },
    changeType(v) {
      this.getChapterList(this.params)
      this.$set(this.ids, 'topic', v)
    },
    //获取章节列表
    getChapter(val) {
      getChapterList({ style: 'tree', topic: val }).then((res) => {
        this.$nextTick(() => {
          this.topicList = res.result.chapters
        })
      })
    },
    // 选中的当前树节点信息
    selectNode(val) {
      this.$set(this.ids, 'chapter_id', val.chapter_id)
    },
  },
}
</script>
<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
