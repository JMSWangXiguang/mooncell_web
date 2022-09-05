<!--
 * @Author: imali
 * @Date: 2022-04-25 15:10:32
 * @LastEditTime: 2022-06-21 10:08:04
 * @LastEditors: imali
 * @Description:
-->
<template>
  <div class="flex px-10px">
    <div class="w-1/3 min-w-300px p-10px">
      <el-radio-group v-model="type">
        <el-radio-button v-for="(v, k) in EType" :key="k" :label="k">
          <strong>{{ v }}</strong>
        </el-radio-button>
      </el-radio-group>
      <el-button v-if="topic" type="danger" class="float-right" @click="deleteChapter">
        删除
      </el-button>
      <el-tree
        v-loading="treeLoading"
        ref="tree"
        node-key="chapter_id"
        :data="topicList"
        :expand-on-click-node="false"
        :props="{ label: 'title', value: 'chapter_id', children: 'child' }"
        class="mt-10px border-1px h-[calc(100vh-170px)] scrollbar-thin"
        default-expand-all
        highlight-current
        @node-click="nodeClick"
      ></el-tree>
    </div>
    <div class="m-10px w-full">
      <div class="mb-10px">
        <el-button
          :type="flag === 'create' ? 'primary' : undefined"
          @click="createChapter"
          class="font-bold"
        >
          新建章节
        </el-button>
      </div>
      <el-card
        shadow="never"
        size="medium"
        class="h-[calc(100vh-170px)] scrollbar-thin"
      >
        <template #header>
          <div v-if="flag === 'create'">
            新建章节
            <el-button type="primary" class="float-right" @click="submitCreate">提 交</el-button>
          </div>
          <div v-else-if="flag === 'edit'">
            {{ topic.title }}
            <el-button type="primary" class="float-right" @click="submitUpdate">更 新</el-button>
          </div>
          <span v-else>ㅤ</span>
        </template>
        <p-form
          ref="form"
          v-loading="formLoading"
          v-model="model"
          :items="items"
          :disabled="!flag"
          label-width="auto"
          class="w-3/4 min-w-600px mt-1/24 mx-auto"
        >
          <template #topic>
            <el-option label="病案" value="mr"></el-option>
            <el-option label="住院" value="inhos"></el-option>
            <el-option label="门诊" value="outhos"></el-option>
            <el-option label="急诊" value="emergency"></el-option>
          </template>
          <template #amc>
            <el-option
              v-for="a in amcList"
              :key="a.amc_id"
              :label="a.name"
              :value="a.amc_id"
            ></el-option>
          </template>
        </p-form>
      </el-card>
    </div>
  </div>
</template>
<script>
import {
  chapterCreate,
  chapterDelete,
  chapterUpdate,
  getChapterInfo,
  getChapterList,
  getAmcList,
} from '@/api/rule/rule'
const EType = {
  inhos: '住院',
  outhos: '门诊',
  emergency: '急诊',
  mr: '病案',
}
export default {
  data() {
    return {
      EType,
      type: 'inhos',
      flag: null,
      topic: null,
      treeLoading: false,
      formLoading: false,
      topicList: [],
      amcList: [],
      model: {},
    }
  },
  computed: {
    items() {
      return [
        {
          label: '病历段落元素名称',
          prop: 'title',
          content: {
            is: 'el-input',
            placeholder: '请输入名称',
            disabled: this.model.seal,
          },
          rules: {
            required: true,
            message: '请输入名称',
            trigger: 'blur',
          },
        },
        {
          label: '病历系统类型',
          prop: 'topic',
          content: {
            is: 'el-select',
            placeholder: '请选择类型',
            disabled: this.model.seal,
          },
          rules: {
            required: true,
            message: '请选择类型',
            trigger: 'blur',
          },
        },
        {
          label: '上级章节',
          prop: 'parent_id',
          content: {
            is: 'el-cascader',
            placeholder: '请选择上级章节',
            options: this.topicList,
            disabled: this.model.seal,
            props: {
              label: 'title',
              value: 'chapter_id',
              children: 'child',
              checkStrictly: true,
            },
            class: 'w-full',
          },
        },
        {
          label: '数据接口字段',
          prop: 'chapter_id',
          content: {
            is: 'el-input',
            disabled: this.model.seal,
            placeholder: '请输入章节code',
          },
        },
        {
          label: '分类匹配表达式',
          prop: 'sign',
          content: {
            is: 'el-input',
            placeholder: '请输入分类匹配表达式',
          },
        },
        {
          label: '结构化方式',
          prop: 'amc',
          content: {
            is: 'el-select',
          },
        },
        {
          label: '描述',
          prop: 'desc',
          content: {
            is: 'el-input',
            rows: 4,
            type: 'textarea',
            placeholder: '请输入描述',
          },
        },
      ]
    },
  },
  watch: {
    type: {
      async handler(topic) {
        this.fetchChapterList(topic)
      },
      immediate: true,
    },
    async 'topic.chapter_id'(chapter_id) {
      if (!chapter_id) {
        return
      }
      this.formLoading = true
      const { result } = await getChapterInfo({ chapter_id })
      this.model = result
      this.formLoading = false
    },
  },
  mounted() {
    this.fetchAmcList()
  },
  methods: {
    async fetchAmcList() {
      const { result } = await getAmcList()
      this.amcList = result
    },
    async fetchChapterList(topic) {
      this.treeLoading = true
      const { result } = await getChapterList({ style: 'tree', topic })
      this.topicList = result.chapters
      this.treeLoading = false
    },
    nodeClick(data) {
      const { tree } = this.$refs
      if (data.chapter_id === this.topic?.chapter_id) {
        this.flag = null
        this.topic = null
        tree.setCurrentKey(null)
        this.model = null
      } else {
        this.flag = 'edit'
        this.topic = data
      }
    },
    createChapter() {
      this.topic = null
      this.$refs.tree.setCurrentKey(null)
      if (this.flag === 'create') {
        this.flag = ''
      } else {
        this.model = { topic: this.type }
        this.flag = 'create'
      }
    },
    async submitCreate() {
      const { status } = await chapterCreate(this.model)
      if (status == 200) {
        this.$message.success('创建成功')
        this.fetchChapterList(this.type)
      }
    },
    async submitUpdate() {
      const { status } = await chapterUpdate(this.model)
      if (status == 200) {
        this.$message.success('更新成功')
        this.fetchChapterList(this.type)
      }
    },
    async deleteChapter() {
      await this.$confirm('确定删除该信息吗?', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
      })
      const { chapter_id } = this.topic
      const { status } = await chapterDelete({ chapter_id, clean: true })
      if (status === 200) {
        this.$message.success('删除成功')
        this.fetchChapterList(this.type)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
:deep {
  .el-button--default {
    color: $--color-primary;
    border-color: #d4effa;
    background-color: #f1fafd;
  }
  .el-tree-node__content {
    height: 36px;
  }
  .el-form-item {
    margin-bottom: 6%;
  }
}
</style>
