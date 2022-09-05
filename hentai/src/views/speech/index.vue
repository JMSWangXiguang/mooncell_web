<!--
 * @Description:
 * @version:
 * @Author: 周子尧
 * @Date: 2020-11-17 15:31:19
 * @LastEditors: imali
 * @LastEditTime: 2022-08-24 16:44:47
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
    <el-table v-loading="listLoading" :data="list" border highlight-current-row style="width: 100%">
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column label="词性" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="颜色" width="80">
        <template slot-scope="scope">
          <el-color-picker :value="scope.row.style" disabled size="medium" />
        </template>
      </el-table-column>
      <el-table-column label="是否屏蔽" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.rubi ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="可用类别">
        <template slot-scope="scope">
          <template v-for="(item, index) in scope.row.usable">
            <el-tag
              v-if="allUsable.find((usable) => usable.category_id == item)"
              :key="index"
              style="margin: 5px"
            >
              {{ allUsable.find((usable) => usable.category_id == item).name }}
            </el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="描述">
        <template slot-scope="scope">
          <span>{{ scope.row.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.update_time }}</span>
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
    <el-dialog
      :title="`${dialogModel == 'create' ? '新增词性' : '修改词性'}`"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
    >
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="100px">
        <el-form-item
          label="唯一键"
          prop="speech_id"
          :rules="{
            required: true,
            message: '请输入唯一键',
            trigger: 'change',
          }"
        >
          <el-input v-model="temp.speech_id" :disabled="dialogModel != 'create'" />
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
        <el-form-item label="是否屏蔽" prop="rubi">
          <el-switch v-model="temp.rubi" active-text="屏蔽" inactive-text="不屏蔽" />
        </el-form-item>
        <el-form-item
          label="颜色"
          prop="style"
          :rules="{
            required: true,
            message: '请选择颜色',
            trigger: 'change',
          }"
        >
          <el-color-picker v-model="temp.style" size="medium" />
        </el-form-item>
        <el-form-item label="可用类别" prop="usable">
          <el-checkbox v-model="checkAll">全选</el-checkbox>
          <el-checkbox-group v-model="temp.usable" :disabled="checkAll">
            <el-checkbox
              v-for="(usable, index) in usables"
              :key="index"
              :label="usable.category_id"
              >{{ usable.name }}</el-checkbox
            >
          </el-checkbox-group>
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
import { getList, create, update } from '@/api/speech'
import { getSchema as getCategory } from '@/api/category'
import { parseTime } from '@/utils'
export default {
  name: 'Speech',
  data() {
    return {
      list: null,
      listLoading: false,
      temp: {
        speech_id: '',
        name: '',
        style: '',
        rubi: false,
        desc: '',
        usable: [],
      },
      allUsable: [],
      usables: [],
      dialogFormVisible: false,
      dialogModel: '', // create、edit
      checkAll: false,
    }
  },
  watch: {
    checkAll() {
      if (this.checkAll) {
        this.temp.usable = []
      }
    },
  },
  created() {
    this.getCategory()
    this.getData()
  },
  methods: {
    parseTime,
    getCategory() {
      getCategory().then((res) => {
        this.usables = res.result.category_schema
        this.allUsable = [{ category_id: 'all', name: '全部' }].concat(res.result.category_schema)
      })
    },
    getData() {
      this.listLoading = true
      getList().then((res) => {
        this.list = res.result.speech_list
        this.listLoading = false
      })
    },
    resetTemp() {
      this.checkAll = false
      this.temp = {
        speech_id: '',
        name: '',
        style: '',
        rubi: undefined,
        desc: '',
        usable: [],
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
        speech_id: item.speech_id,
        name: item.name,
        style: item.style,
        rubi: item.rubi,
        desc: item.desc,
        usable: item.usable,
      }
      this.checkAll = !!this.temp.usable.find((item) => item === 'all')
      this.dialogModel = 'edit'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    saveData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dialogModel === 'create') {
            create(
              Object.assign(this.temp, { usable: this.checkAll ? ['all'] : this.temp.usable })
            ).then((res) => {
              console.log(res)
              this.$message.success('保存成功')
              this.dialogFormVisible = false
              this.getData()
            })
          } else {
            update(
              Object.assign(this.temp, { usable: this.checkAll ? ['all'] : this.temp.usable })
            ).then((res) => {
              console.log(res)
              this.$message.success('保存成功')
              this.dialogFormVisible = false
              this.resetTemp()
              this.getData()
            })
          }
        }
      })
    },
  },
}
</script>
