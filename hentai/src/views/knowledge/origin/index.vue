<!--
 * @Author: imali
 * @Date: 2022-04-26 15:26:48
 * @LastEditTime: 2022-08-24 17:26:18
 * @LastEditors: imali
 * @Description:
-->
<template>
  <div class="flex px-10px">
    <div class="w-1/3 min-w-300px p-10px">
      <div>
        <el-input placeholder="输入关键字进行过滤" v-model="filterText" class="w-220px"></el-input>
      </div>
      <el-tree
        v-loading="treeLoading"
        ref="tree"
        node-key="sid"
        :data="sourceList"
        :props="{ label: 'title', value: 'sid' }"
        :filter-node-method="filterNode"
        class="mt-10px border-1px h-[calc(100vh-170px)] scrollbar-thin"
        highlight-current
        @node-click="nodeClick"
      ></el-tree>
    </div>
    <div class="m-10px w-full">
      <div class="mb-10px">
        <el-button :type="source && !source.sid ? 'success' : undefined" @click="createSource">
          新建文献
        </el-button>
        <el-button type="danger" class="float-right" @click="deleteGroup">删除</el-button>
      </div>
      <el-card shadow="never" size="medium" class="h-[calc(100vh-170px)]">
        <template #header>
          <span v-if="!source">ㅤ</span>
          <div v-else-if="!source.sid">
            新建文献
            <el-button type="primary" class="float-right" @click="submitCreate">提 交</el-button>
          </div>
          <div v-else>
            {{ source.title }}
            <el-button type="primary" class="float-right" @click="submitUpdate">更 新</el-button>
          </div>
        </template>
        <p-form
          ref="form"
          v-loading="formLoading"
          v-model="model"
          :items="items"
          :disabled="!source"
          label-width="auto"
          class="w-3/4 min-w-600px mt-1/24 mx-auto"
        ></p-form>
      </el-card>
    </div>
  </div>
</template>
<script>
import {
  getSource,
  getSourceInfo,
  createSource,
  updateSource,
  deleteSource,
} from '@/api/knowledge/literature'
export default {
  data() {
    return {
      treeLoading: false,
      formLoading: false,
      filterText: '',
      sourceList: [],
      source: null,
      model: {},
      items: [
        {
          prop: 'title',
          label: '名称',
          content: {
            is: 'el-input',
            placeholder: '请输入名称',
          },
          rules: {
            required: true,
            message: '请输入名称',
            trigger: 'blur',
          },
        },
        {
          prop: 'domain',
          label: '分类',
          content: {
            is: 'el-input',
            placeholder: '请输入分类',
          },
          rules: {
            required: true,
            message: '请输入分类',
            trigger: 'blur',
          },
        },
        {
          prop: 'version',
          label: '版本',
          content: {
            is: 'el-input',
            placeholder: '请输入版本',
          },
          rules: {
            required: true,
            message: '请输入版本',
            trigger: 'blur',
          },
        },
        {
          prop: 'issue_date',
          label: '发行日期',
          content: {
            is: 'el-input',
            placeholder: '请输入发行日期',
          },
          rules: {
            required: true,
            message: '请输入发行日期',
            trigger: 'blur',
          },
        },
        {
          label: '备注',
          prop: 'remark',
          content: {
            is: 'el-input',
            rows: 4,
            type: 'textarea',
            placeholder: '请输入描述',
          },
        },
      ],
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    async 'source.sid'(source_id) {
      if (!source_id) {
        return
      }
      this.formLoading = true
      const { result } = await getSourceInfo({ source_id })
      this.model = result
      this.formLoading = false
    },
  },
  mounted() {
    this.getSourceList()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.title.indexOf(value) !== -1
    },
    async getSourceList() {
      this.treeLoading = true
      const { result } = await getSource({})
      this.sourceList = result.sources
      this.treeLoading = false
    },
    createSource() {
      this.model = {}
      this.$refs.tree.setCurrentKey(null)
      if (this.source && !this.source.sid) {
        this.source = null
      } else {
        this.source = {}
      }
    },
    nodeClick(data) {
      const { tree } = this.$refs
      if (data.sid === this.source?.sid) {
        this.source = null
        tree.setCurrentKey(null)
        this.model = {}
      } else {
        this.source = data
      }
    },
    async submitCreate() {
      const { status } = await createSource(this.model)
      if (status == 200) {
        this.$message.success('创建成功')
        this.getSourceList()
      }
    },
    async submitUpdate() {
      const { status } = await updateSource({ ...this.model, source_id: this.source.sid })
      if (status == 200) {
        this.$message.success('更新成功')
        this.getSourceList()
      }
    },
    async deleteGroup() {
      await this.$confirm('确定删除该信息吗?', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
      })
      const { status } = await deleteSource({ source_id: this.source.sid })
      if (status === 200) {
        this.$message.success('删除成功')
        this.getSourceList()
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
