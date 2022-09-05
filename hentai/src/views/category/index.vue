<!--
 * @Description:
 * @version:
 * @Author: 周子尧
 * @Date: 2020-11-17 15:30:44
 * @LastEditors: imali
 * @LastEditTime: 2022-08-24 16:44:12
-->
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        size="small"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        新增
      </el-button>
    </div>
    <el-row :gutter="24">
      <el-col
        v-for="(item, index) in list"
        :key="index"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        :xl="6"
        style="padding-bottom: 2rem"
      >
        <el-card shadow="always">
          <div slot="header" class="clear-both">
            <span style="font-size: 18px; font-weight: 600">{{ item.name }}</span>
            <el-button
              type="primary"
              size="mini"
              round
              style="padding: 6px 8px; float: right"
              @click="handleEdit(item)"
              >修改</el-button
            >
          </div>
          <div style="text-align: center">
            <el-progress
              type="dashboard"
              :stroke-width="10"
              :percentage="
                parseFloat(
                  item.total_num <= 0 ? 0 : ((item.marked_num / item.total_num) * 100).toFixed(2)
                )
              "
              :color="colors"
            />
            <div>{{ item.marked_num }}/{{ item.total_num }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="getData"
    />
    <el-dialog
      :title="`${dialogModel == 'create' ? '新增分类' : '修改分类'}`"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
    >
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="100px">
        <el-form-item
          label="唯一键"
          prop="category_id"
          :rules="{
            required: true,
            message: '请输入唯一键',
            trigger: 'change',
          }"
        >
          <el-input v-model="temp.category_id" :disabled="dialogModel != 'create'" />
        </el-form-item>
        <el-form-item
          label="名称"
          prop="name"
          :rules="{
            required: true,
            message: '请输入名称',
            trigger: 'change',
          }"
        >
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="temp.desc" type="textarea" />
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
import Pagination from '@/components/Pagination'
import { getList, create, update } from '@/api/category'
export default {
  components: {
    Pagination,
  },
  data() {
    return {
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        size: 10,
      },
      temp: {
        category_id: '',
        name: '',
        desc: '',
      },
      colors: [
        { color: 'color-danger', percentage: 20 },
        { color: 'color-warning', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 },
      ],
      dialogFormVisible: false,
      dialogModel: '', // create、edit
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      getList(this.listQuery).then((res) => {
        this.total = res.result.total
        this.list = res.result.category_list
      })
    },
    resetTemp() {
      this.temp = {
        category_id: '',
        name: '',
        desc: '',
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogModel = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleEdit(item) {
      this.temp = {
        category_id: item.category_id,
        name: item.name,
        desc: item.desc,
      }
      this.dialogModel = 'edit'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    saveData() {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          if (this.dialogModel === 'create') {
            create(this.temp).then(async (res) => {
              console.log(res)
              this.$message.success('保存成功')
              this.dialogFormVisible = false
              this.getData()
              // await this.$store.dispatch('permission/getCategorys')
              // const accessRoutes = await this.$store.dispatch('permission/generateRoutes')
              // router.addRoutes(accessRoutes)
            })
          } else {
            update(this.temp).then(async (res) => {
              console.log(res)
              this.$message.success('保存成功')
              this.dialogFormVisible = false
              this.getData()
              // await this.$store.dispatch('permission/getCategorys')
              // const accessRoutes = await this.$store.dispatch('permission/generateRoutes')
              // router.addRoutes(accessRoutes)
            })
          }
        }
      })
    },
  },
}
</script>
