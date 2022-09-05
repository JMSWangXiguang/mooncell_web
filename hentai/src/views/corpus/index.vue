<!--
 * @Description:
 * @version:
 * @Author: 周子尧
 * @Date: 2020-11-17 15:31:49
 * @LastEditors: imali
 * @LastEditTime: 2022-08-24 16:44:15
-->
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.search"
        size="small"
        class="filter-item"
        placeholder="文本关键字"
        style="width: 150px"
        prefix-icon="el-icon-search"
      />
      <el-date-picker
        v-model="spenTime"
        size="small"
        type="daterange"
        style="margin-right: 10px; width: 280px"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <el-select
        v-model="listQuery.category"
        size="small"
        class="filter-item"
        style="width: 180px"
        clearable
        placeholder="语料分类"
      >
        <el-option
          v-for="item in categorys"
          :key="item.category_id"
          :label="item.name"
          :value="item.category_id"
        />
      </el-select>
      <el-select
        v-model="listQuery.source"
        size="small"
        class="filter-item"
        style="width: 180px"
        clearable
        placeholder="来源"
      >
        <el-option v-for="item in sources" :key="item.name" :label="item.name" :value="item.name" />
      </el-select>
      <el-button type="primary" icon="el-icon-search" size="small" @click="search">查询</el-button>
      <el-button size="small" type="success" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <br />
      <el-button-group style="padding: 10px 0; float: right">
        <el-button type="primary" size="mini" @click="priority(1)">优先级+1</el-button>
        <el-button type="primary" size="mini" @click="priority(-1)">优先级-1</el-button>
        <el-button type="danger" size="mini" @click="deleteData()">删除</el-button>
      </el-button-group>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      highlight-current-row
      style="width: 100%"
      :default-sort="{ prop: 'corpus_id', order: 'descending' }"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="文本编号" prop="corpus_id" sortable="custom" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.corpus_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="来源" prop="source" sortable="custom" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.source }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文本类型" prop="category" sortable="custom" width="100">
        <template slot-scope="scope">
          <span v-if="categorys.find((item) => item.category_id == scope.row.category)">{{
            categorys.find((item) => item.category_id == scope.row.category).name
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="添加人" prop="creator" sortable="custom" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.creator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文本">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" prop="create_time" sortable="custom" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优先级" prop="priority" sortable="custom" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.priority }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" size="mini" @click="handleEdit(scope.row)">修改</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="getData"
    />
    <el-dialog
      :title="`${dialogModel == 'create' ? '新增语料' : '修改语料'}`"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
    >
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="100px">
        <el-form-item
          label="来源"
          prop="source"
          :rules="{
            required: true,
            message: '请输入来源',
            trigger: 'change',
          }"
        >
          <el-autocomplete
            v-model="temp.source"
            class="inline-input"
            :fetch-suggestions="querySearchSource"
            placeholder="请输入内容"
            @select="(item) => (temp.source = item.value)"
          />
        </el-form-item>

        <el-form-item
          label="分类"
          prop="category"
          :rules="{
            required: true,
            message: '优先级',
            trigger: 'change',
          }"
        >
          <el-select v-model="temp.category" placeholder="请选择">
            <el-option
              v-for="item in categorys"
              :key="item.category_id"
              :label="item.name"
              :value="item.category_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="优先级"
          prop="priority"
          :rules="{
            required: true,
            message: '请输入优先级(数字越大优先级越高)',
            trigger: 'change',
          }"
        >
          <el-input-number
            v-model.number="temp.priority"
            :min="1"
            :max="1000"
            controls-position="right"
            label="描述文字"
          />
        </el-form-item>
        <el-form-item
          label="文本"
          prop="content"
          :rules="{
            required: true,
            message: '请输入文本',
            trigger: 'change',
          }"
        >
          <el-input v-model="temp.content" type="textarea" :rows="5" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="saveData()"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getList, create, update, priority, deleteData, getInfo } from '@/api/corpus'
import { getSchema as getCategory, getSource } from '@/api/category'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'Corpus',
  components: {
    Pagination,
  },
  data() {
    return {
      list: null,
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        size: 10,
        search: '',
        begin_date: '',
        end_date: '',
        category: '',
        source: '',
        order: 'corpus_id',
        sort: 'desc',
      },
      temp: {
        corpus_id: '',
        source: '',
        category: '',
        priority: '',
        content: '',
      },
      dialogFormVisible: false,
      dialogModel: '', // create、edit
      checkList: [],
      sources: [],
      categorys: [],
      spenTime: [],
    }
  },
  watch: {
    spenTime() {
      this.listQuery.begin_date = this.spenTime
        ? this.parseTime(this.spenTime[0], '{y}-{m}-{d}')
        : ''
      this.listQuery.end_date = this.spenTime ? this.parseTime(this.spenTime[1], '{y}-{m}-{d}') : ''
    },
  },
  created() {
    this.getCategory()
    this.getSource()
    this.getData()
  },
  methods: {
    parseTime,
    // 查询搜索
    search() {
      this.listQuery.page = 1
      this.getData()
    },
    // 获取来源数据
    getSource() {
      getSource().then((res) => {
        this.sources = res.result.source_schema
      })
    },
    // 获取分类数据
    getCategory() {
      getCategory().then((res) => {
        this.categorys = res.result.category_schema
      })
    },
    // 获取列表数据
    getData() {
      this.listLoading = true
      getList(this.listQuery).then((res) => {
        this.list = res.result.corpus_list
        this.total = res.result.total
        this.listLoading = false
      })
    },
    // 初始化表单
    resetTemp() {
      this.temp = {
        corpus_id: '',
        source: '',
        category: '',
        priority: '',
        content: '',
      }
    },
    // 新增语料
    handleCreate() {
      this.resetTemp()
      this.dialogModel = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 修改语料
    handleEdit(item) {
      // this.temp = {
      //   corpus_id: item.corpus_id,
      //   source: item.source,
      //   category: item.category,
      //   priority: item.priority,
      //   content: item.content
      // }
      getInfo({ corpus_id: item.corpus_id }).then((res) => {
        this.temp = res.result
      })
      this.dialogModel = 'edit'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 保存语料
    saveData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dialogModel === 'create') {
            create(this.temp).then((res) => {
              console.log(res)
              this.getSource()
              this.$message.success('保存成功')
              this.dialogFormVisible = false
              this.getData()
            })
          } else {
            update(this.temp).then((res) => {
              console.log(res)
              this.getSource()
              this.$message.success('保存成功')
              this.dialogFormVisible = false
              this.getData()
            })
          }
        }
      })
    },
    // 列表选择改变
    handleSelectionChange(val) {
      this.checkList = val.map((item) => {
        return item.corpus_id
      })
    },
    // 更新优先级
    priority(alter) {
      if (this.checkList.length === 0) {
        this.$message.error('请选择要更新优先级的语料')
      } else {
        priority({
          alter: alter,
          corpus_list: this.checkList,
        }).then(() => {
          this.$message.success('更新成功')
          this.getData()
        })
      }
    },
    // 删除语料
    deleteData() {
      if (this.checkList.length === 0) {
        this.$message.error('请选择要删除的语料')
      } else {
        deleteData({
          corpus_list: this.checkList,
        }).then(() => {
          this.$message.success('删除成功')
          this.getData()
        })
      }
    },
    // 来源字段模糊检索
    querySearchSource(queryString, cb) {
      var sources = this.sources
      var results = (
        queryString ? sources.filter((item) => item.name.indexOf(queryString) >= 0) : sources
      ).map((item) => {
        return { value: item.name }
      })
      cb(results)
    },
    // 排序方式切换
    sortChange(e) {
      this.listQuery.order = e.prop
      this.listQuery.sort = e.order === 'descending' ? 'desc' : 'asc'
      this.getData()
    },
  },
}
</script>
