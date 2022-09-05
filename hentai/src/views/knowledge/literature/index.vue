<!--
 * @Description:
 * @version:
 * @Author: 唐红娟
 * @Date: 2021-08-05
 * @LastEditors: imali
 * @LastEditTime: 2022-06-21 10:08:22
-->
<template>
  <div class="app-container flex h-[calc(100vh-100px)]">
    <div class="slider-box w-1/5 min-w-300px mx-10px bg-white">
      <ul>
        <li
          v-for="s in sources"
          :key="s.sid"
          :class="{ active: listQuery.source === s.sid }"
          @click="listQuery.source = s.sid"
        >
          {{ s.title }}
        </li>
      </ul>
    </div>
    <div class="w-1/5 min-w-320px mx-10px">
      <div class="flex justify-between mb-8px">
        <div>
          <el-input
            v-model="listQuery.search"
            size="small w-120px mr-10px"
            class="filter-item"
            placeholder="文本关键字"
            prefix-icon="el-icon-search"
          />
          <el-button type="primary" icon="el-icon-search" size="small" @click="getData">
            查询
          </el-button>
        </div>
        <el-button v-if="!isSelecting" @click="isSelecting = true">删除内容</el-button>
        <el-button v-else-if="checkList.length" type="danger" @click="deleteData">删除</el-button>
        <el-button v-else @click="isSelecting = false">取消</el-button>
      </div>
      <el-tree
        ref="dataTree"
        :data="list"
        node-key="docid"
        :props="{ label: 'title', children: 'child' }"
        @check="handleSelectionChange"
        @node-click="handleEdit"
        class="h-[calc(100%-40px)] border-1px scrollbar-thin"
        default-expand-all
        highlight-current
        :show-checkbox="isSelecting"
      ></el-tree>
    </div>
    <div class="flex-1 mx-10px">
      <div class="mb-8px">
        <el-button :type="doc && !doc.docid ? 'success' : undefined" @click="handleAdd">
          新建内容
        </el-button>
        <el-button type="primary" @click="saveData" class="float-right">保存</el-button>
      </div>
      <div class="border-1px bg-white h-[calc(100%-40px)] scrollbar-thin">
        <p-form
          ref="dataForm"
          v-model="model"
          :items="items"
          :disabled="!doc"
          label-width="auto"
          class="mt-1/12 w-3/4 ml-1/8"
        >
          <template #category>
            <el-autocomplete
              v-model="model.category"
              class="w-full"
              value-key="title"
              :fetch-suggestions="fetchSuggestions"
              select-when-unmatched
              highlight-first-item
            >
            </el-autocomplete>
          </template>
          <template #source>
            <el-option
              v-for="item in sources"
              :key="item.sid"
              :label="item.title"
              :value="item.sid"
            />
          </template>
          <template #format>
            <el-radio label="txt">TXT</el-radio>
            <el-radio label="html">HTML</el-radio>
            <el-radio label="xml">XML</el-radio>
          </template>
        </p-form>
      </div>
    </div>
  </div>
</template>
<script>
import { getCategory, getSource, getInfo, create, update, Delete } from '@/api/knowledge/literature'
import { referenceTree } from '@/api/knowledge/disease'
import { compact, isEmpty, cloneDeep, filter } from 'lodash'
import { parseTime } from '@/utils'
export default {
  name: 'Literature',
  data() {
    return {
      list: [],
      listLoading: false,
      listQuery: {
        search: '',
        source: '',
      },
      isSelecting: false,
      doc: null,
      model: {
        title: '',
        header: '',
        key: '',
        category: '',
        source: '',
        format: '',
        content: '',
      },
      checkList: [],
      sources: [],
      categorys: [], //分类数组
      spenTime: [],
    }
  },
  computed: {
    items() {
      return compact([
        {
          prop: 'title',
          label: '标题',
          rules: {
            required: true,
            message: '请输入标题',
            trigger: 'blur',
          },
          content: {
            is: 'el-input',
          },
        },
        {
          prop: 'header',
          label: '显示',
          rules: {
            required: true,
            message: '请输入显示',
            trigger: 'blur',
          },
          content: {
            is: 'el-input',
          },
        },
        {
          prop: 'category',
          label: '分类',
          rules: {
            required: true,
            message: '请输入分类',
            trigger: 'blur',
          },
        },
        {
          prop: 'source',
          label: '来源',
          content: {
            is: 'el-select',
            valueKey: 'id',
            filterable: true,
            class: 'w-full',
          },
        },
        isEmpty(this.doc)
          ? undefined
          : {
              prop: 'key',
              label: 'key',
              content: {
                is: 'el-input',
                disabled: true,
              },
            },
        {
          prop: 'page',
          label: '页码',
          content: {
            is: 'el-input-number',
            min: 0,
          },
        },
        {
          prop: 'format',
          label: '格式',
          content: {
            is: 'el-radio-group',
          },
        },
        {
          prop: 'content',
          label: '文档简介',
          rules: {
            required: true,
            message: '请输入文本',
            trigger: 'blur',
          },
          content: {
            is: 'el-input',
            type: 'textarea',
            rows: 8,
          },
        },
      ])
    },
  },
  watch: {
    'listQuery.source'() {
      this.getData()
    },
  },
  created() {
    this.getCategory()
    this.getSource()
  },
  methods: {
    parseTime,
    // 获取来源数据
    getSource() {
      let params = {
        page: 1,
        size: 10000000000000,
      }
      getSource(params).then((res) => {
        this.sources = res.result.sources
        this.listQuery.source = res.result.sources[0].sid
      })
    },
    // 获取分类数据
    getCategory() {
      getCategory({ sid: '' }).then((res) => {
        this.categorys = res.result.categories
      })
    },
    // 获取列表数据
    getData() {
      this.listLoading = true
      referenceTree(this.listQuery).then((res) => {
        this.list = res.result.schema
        this.listLoading = false
      })
    },
    handleAdd() {
      this.model = {}
      this.$refs.dataTree.setCurrentKey(null)
      if (!this.doc || this.doc?.docid) {
        this.doc = {}
      } else {
        this.doc = null
      }
    },
    // 修改
    handleEdit(item) {
      if (!item.docid || item.docid === this.doc?.docid) {
        this.doc = null
        this.model = {}
        this.$refs.dataTree.setCurrentKey(null)
        return
      }
      this.doc = item
      getInfo(item).then((res) => {
        this.model = res.result
        this.model.source = res.result.source.sid
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].$refs['p-form'].clearValidate()
      })
    },
    // 保存语料
    saveData() {
      this.$refs['dataForm'].$refs['p-form'].validate((valid) => {
        if (valid) {
          if (!this.doc?.docid) {
            create(this.model).then(() => {
              this.$message.success('添加成功')
              this.getData()
              this.model = {}
            })
          } else {
            if (!this.$refs['dataTree'].getCurrentKey()) {
              return this.$message.error('请先选择内容')
            }
            update(this.model).then(() => {
              this.getSource()
              this.$message.success('保存成功')
              this.getData()
            })
          }
        }
      })
    },
    // 列表选择改变
    handleSelectionChange(_a, { checkedKeys }) {
      this.checkList = compact(checkedKeys)
    },
    // 删除
    deleteData() {
      if (this.checkList.length === 0) {
        this.$message.error('请选择要删除的数据')
      } else {
        this.$confirm('确定删除数据吗?', '提示', {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            Delete({
              docid: this.checkList,
            }).then(() => {
              this.$message.success('删除成功')
              this.getData()
            })
          })
          .catch(() => {})
      }
    },
    fetchSuggestions(query, callback) {
      const result = query
        ? filter(cloneDeep(this.categorys), (c) => c.title.includes(query))
        : this.categorys
      callback(result)
    },
    // // 来源字段模糊检索
    // querySearchSource(queryString, cb) {
    //   var sources = this.sources
    //   var results = (queryString
    //     ? sources.filter(item => item.title.indexOf(queryString) >= 0)
    //     : sources
    //   ).map(item => {
    //     return { value: item.title }
    //   })
    //   cb(results)
    // },
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
  .el-pagination {
    margin-top: 10px;
  }
  .el-tree-node__content {
    height: 36px;
    line-height: 36px;
  }
}
</style>
