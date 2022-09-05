<!--
 * @Description:
 * @version:
 * @Author: 唐红娟
 * @Date: 2021-08-05
 * @LastEditors: imali
 * @LastEditTime: 2022-08-24 16:44:18
-->
<template>
  <div class="common-container">
    <!-- <div class="filter-container" style="height:40px;">
      <el-button
        class="filter-item float-right"
        size="small"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >新增</el-button>
    </div> -->
    <el-row style="flex: 1">
      <el-col :span="4" class="h-[calc(100vh-140px)]">
        <div class="slider-box bg-white">
          <ul>
            <li
              v-for="item in categoryList"
              :key="item.id"
              :class="{ active: curTopic.id === item.id }"
              @click="handleClick(item)"
            >
              {{ item.title }}
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="20" class="h-full pl-20px scrollbar-thin">
        <div class="filter-container h-40px">
          <el-button
            class="filter-item float-right"
            size="small"
            type="primary"
            icon="el-icon-edit"
            @click="handleCreate"
            >新增</el-button
          >
        </div>
        <el-table
          v-loading="listLoading"
          :data="list"
          border
          highlight-current-row
          height="calc(100vh - 215px)"
        >
          <el-table-column label="序号" type="index" width="50">
            <template slot-scope="scope">
              <span v-text="getIndex(scope.$index)"></span>
            </template>
          </el-table-column>
          <el-table-column v-if="categoryType === 'eins'" key="1" label="词性" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="categoryType === 'zwei'" key="2" label="名称" width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column key="3" label="颜色" width="80">
            <template slot-scope="scope">
              <el-color-picker :value="scope.row.color" disabled size="medium" />
            </template>
          </el-table-column>
          <el-table-column v-if="categoryType === 'zwei'" key="4" label="起始主题">
            <template slot-scope="scope">
              <el-tag
                v-for="item in scope.row.from_cate"
                :key="item.title"
                type="success"
                style="margin-left: 5px"
                >{{ item.title }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column v-if="categoryType === 'zwei'" key="5" label="目标主题">
            <template slot-scope="scope">
              <el-tag
                v-for="item in scope.row.to_cate"
                :key="item.title"
                type="warning"
                style="margin-left: 5px"
                >{{ item.title }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column key="6" label="描述">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column key="7" label="更新时间" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.update_time }}</span>
            </template>
          </el-table-column> -->
          <el-table-column key="8" label="操作" width="150px">
            <template slot-scope="scope">
              <el-button-group>
                <el-button
                  type="primary"
                  style="margin-right: 10px"
                  size="mini"
                  @click="handleEdit(scope.row)"
                  >修改</el-button
                >
                <el-button size="mini" @click="Delete(scope.row)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="params.page"
          :limit.sync="params.size"
          @pagination="getData"
        />
      </el-col>
    </el-row>
    <el-dialog
      :title="`${dialogModel == 'create' ? '新增' : '修改'}`"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
    >
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="100px">
        <el-form-item
          v-show="categoryType === 'eins'"
          label="词性"
          prop="title"
          :rules="{
            required: true,
            message: '请输入词性',
            trigger: 'change',
          }"
        >
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item
          v-show="categoryType === 'zwei'"
          label="名称"
          prop="title"
          :rules="{
            required: true,
            message: '请输入名称',
            trigger: 'change',
          }"
        >
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item
          label="颜色"
          prop="color"
          :rules="{
            required: true,
            message: '请选择颜色',
            trigger: 'change',
          }"
        >
          <el-color-picker v-model="temp.color" size="medium" />
        </el-form-item>
        <el-form-item v-show="categoryType === 'zwei'" label="起始主题" prop="from_cate">
          <el-select
            v-model="temp.from_cate"
            style="width: 100%"
            value-key="id"
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="item in topicList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="categoryType === 'zwei'" label="目标主题" prop="to_cate">
          <el-select
            v-model="temp.to_cate"
            style="width: 100%"
            value-key="id"
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="item in topicList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="temp.remark" type="textarea" :rows="4" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getCategoryList,
  getList,
  create,
  update,
  getInfo,
  getTopicList,
  deleteTopicList,
} from '@/api/knowledge/classification'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import { v4 as uuidv4 } from 'uuid'
export default {
  name: 'Classification',
  components: {
    Pagination,
  },
  data() {
    return {
      categoryList: null,
      radio1: '',
      categoryType: '',
      type: '', // 主题
      list: null,
      total: 0,
      params: {
        type: '',
        page: 1,
        size: 10,
      },
      pageCount: 1,
      listLoading: false,
      temp: {
        id: '',
        title: '',
        color: '',
        remark: '',
        from_cate: [],
        to_cate: [],
      },
      topicList: [],
      dialogFormVisible: false,
      dialogModel: '', // create、edit
      curTopic: {},
    }
  },
  watch: {},
  created() {
    this.getCategoryList()
    this.getTopicList(this.params)
  },
  methods: {
    parseTime,
    // 分类总类名称
    getCategoryList() {
      getCategoryList().then((res) => {
        if (res) {
          this.categoryList = res.result.typies
          this.handleClick(this.categoryList[0])
          this.radio1 = this.categoryList[0].title
          this.categoryType = this.categoryList[0].ty
          this.type = this.categoryList[0].id
        }
      })
    },
    //点击主题
    handleClick(item) {
      this.curTopic = item
      this.categoryType = item.ty
      this.type = item.id
      this.getData()
    },
    // 节点主题列表
    getData() {
      this.listLoading = true
      this.params.type = this.type
      getList(this.params).then((res) => {
        this.list = res.result.categories
        this.total = res.result.total
        this.listLoading = false
      })
    },
    // 起始、目标主题列表
    getTopicList(params) {
      let obj = {}
      obj.type = params.type
      obj.page = params.page
      getTopicList(obj).then((res) => {
        this.topicList = res.result.categories
      })
    },
    //表格序号
    getIndex($index) {
      return (this.params.page - 1) * this.params.size + $index + 1
    },
    // 清空表格数据
    resetTemp() {
      this.temp = {
        id: '',
        old_id: '',
        type: '',
        title: '',
        color: '',
        remark: '',
        from_cate: [],
        to_cate: [],
      }
    },
    // 新增
    handleCreate() {
      this.resetTemp()
      this.dialogModel = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 编辑
    handleEdit(item) {
      const obj = {}
      obj.id = item.id
      obj.type = this.type
      getInfo(obj).then((res) => {
        this.temp = res.result
      })
      this.dialogModel = 'edit'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 保存
    saveData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 新增保存
          if (this.dialogModel === 'create') {
            this.temp.id = uuidv4()
            this.temp.type = this.type
            create(Object.assign(this.temp)).then(() => {
              this.$message.success('保存成功')
              this.dialogFormVisible = false
              this.getData()
            })
          } else {
            // 编辑保存
            this.temp.old_id = this.temp.id
            this.temp.type = this.type
            update(Object.assign(this.temp)).then(() => {
              this.$message.success('保存成功')
              this.dialogFormVisible = false
              this.getData()
            })
          }
        }
      })
    },
    // 删除
    Delete(row) {
      this.$confirm('确定删除该信息吗?', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const obj = {}
          obj.id = row.id
          obj.type = this.type
          deleteTopicList(obj).then(() => {
            this.$message.success('刪除成功')
            this.getData()
          })
        })
        .catch(() => {})
    },
  },
}
</script>
