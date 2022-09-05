<!--
 * @Description:
 * @version:
 * @Author: 唐红娟
 * @Date: 2021-08-25
 * @LastEditors: imali
 * @LastEditTime: 2022-04-24 16:25:16
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
        value-format="yyyy-MM-dd"
        format="yyyy-MM-dd"
      />
      <el-select
        v-model="listQuery.category"
        size="small"
        class="filter-item"
        style="width: 180px"
        clearable
        placeholder="分类"
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
      <div class="float-right">
        <el-button size="small" type="warning" @click="stopStatus">停用</el-button>
        <el-button size="small" type="danger" @click="deleteData">删除</el-button>
      </div>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      highlight-current-row
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="文本编号" prop="corpus_id" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.corpus_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="机构来源" prop="source" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.source }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="category" width="100">
        <template slot-scope="scope">
          <span v-if="categorys.find((item) => item.category_id == scope.row.category)">{{
            categorys.find((item) => item.category_id == scope.row.category).name
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标注人" prop="marker" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.marker }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <span v-show="scope.row.status == 'normal'" style="color: #409eff">正常</span>
          <span v-show="scope.row.status == 'ban'" style="color: red">停用</span>
        </template>
      </el-table-column>
      <el-table-column label="文本">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标注时间" prop="mark_time" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.mark_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" size="mini" @click="handleInfo(scope.row)">详情</el-button>
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
  </div>
</template>
<script>
import { getList, update, deleteData } from '@/api/remark'
import { getSchema as getCategory, getSource } from '@/api/category'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'Remark',
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
        order: 'time',
      },
      temp: {
        corpus_id: '',
        source: '',
        category: '',
        // priority: '',
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
      // this.listQuery.begin_date = this.spenTime ? this.parseTime(this.spenTime[0], '{y}-{m}-{d}') : ''
      // this.listQuery.end_date = this.spenTime ? this.parseTime(this.spenTime[1], '{y}-{m}-{d}') : ''
      this.listQuery.begin_date = this.spenTime ? this.spenTime[0] : ''
      this.listQuery.end_date = this.spenTime ? this.spenTime[1] : ''
    },
  },
  created() {
    this.getCategory()
    this.getSource()
    // this.getData()
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.path == '/settags/remarkInfo') {
        vm.listQuery = JSON.parse(localStorage.getItem('searchParams'))
        vm.spenTime[0] = vm.listQuery.begin_date
        vm.spenTime[1] = vm.listQuery.end_date
        vm.spenTime = [vm.listQuery.begin_date, vm.listQuery.end_date]
        vm.search(vm.listQuery)
      } else {
        vm.listQuery.page = 1
        vm.getData()
      }
    })
  },
  methods: {
    parseTime,
    // 查询搜索
    search(val) {
      if (val.page != 1) {
        this.listQuery.page = val.page
      } else {
        this.listQuery.page = 1
      }
      // this.listQuery.page = 1
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
        this.list = res.result.remark_list
        this.total = res.result.total
        this.listLoading = false
      })
    },
    // 列表选择改变
    handleSelectionChange(val) {
      this.checkList = val
    },
    // 删除
    deleteData() {
      if (this.checkList.length === 0) {
        this.$message.error('请选择要删除的信息')
      } else {
        deleteData({
          remark_list: this.checkList,
        }).then(() => {
          this.$message.success('删除成功')
          this.getData()
        })
      }
    },
    //停止
    stopStatus() {
      if (this.checkList.length === 0) {
        this.$message.error('请选择要停用的信息')
      } else {
        update({
          status: 'ban',
          remark_list: this.checkList,
        }).then(() => {
          this.$message.success('停用成功')
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
    // // 排序方式切换
    // sortChange(e) {
    //   this.listQuery.order = e.prop
    //   this.listQuery.sort = e.order === 'descending' ? 'desc' : 'asc'
    //   this.getData()
    // },
    //详情
    handleInfo(row) {
      localStorage.setItem('searchParams', JSON.stringify(this.listQuery))
      localStorage.setItem('rowData', JSON.stringify(row))
      this.$router.push({
        path: 'remarkInfo',
        // query:{
        //   id:JSON.stringify(row)
        // }
      })
    },
  },
}
</script>
