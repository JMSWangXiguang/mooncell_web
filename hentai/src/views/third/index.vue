<template>
  <div id="app">
    <!-- <div style="height: 30px">
      <div
      @click="fresh"
        style="
          color: #67c23a;
          position: absolute;
          top: 10px;
          right: 10px;
          cursor: pointer;
        "
      >
        自动刷新<i class="el-icon-refresh"></i>
      </div>
    </div> -->
    <el-row :gutter="40">
      <el-col :span="4">
        <div class="slider-box">
          <ul>
            <li
              v-for="item in sliderList"
              :key="item.doc_id"
              :class="{ active: curTopic.doc_id === item.doc_id }"
              @click="handleClick(item)"
            >
              {{ item.doc_title }}
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="20">
        <el-table
          :data="tableData"
          border
          style="width: 100%; height: 100%; overflow: auto"
          :header-cell-style="{ background: '#f2f2f2' }"
        >
          <el-table-column label="章节名称" prop="chapter_name" />
          <el-table-column label="错误提示" prop="message" />
          <el-table-column label="状态" prop="status" width="100px">
            <template slot-scope="scope">
              <div v-show="scope.row.status === '0'" class="circle info" />
              <div v-show="scope.row.status === '1'" class="circle correct" />
              <div v-show="scope.row.status === '2'" class="circle error" />
              <div v-show="scope.row.status === '3'" class="circle abandon" />
            </template>
          </el-table-column>
          <el-table-column label="描述" prop="remark">
            <template slot-scope="{ row }">
              <template v-if="row.edit">
                <el-input
                  v-model="row.remark"
                  class="edit-input"
                  size="small"
                  style="width: 60%; margin-right: 10px"
                />
                <el-button
                  type="text"
                  size="large"
                  icon="el-icon-check"
                  circle
                  @click="confirmEdit(row)"
                />
                <el-button
                  type="text"
                  icon="el-icon-close"
                  color="color-danger"
                  circle
                  @click="cancelEdit(row)"
                />
              </template>
              <span v-else>{{ row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button size="mini" type="text" @click="saveData(row, '1')">确认正确</el-button>
              <el-button size="mini" type="text" color="color-danger" @click="saveData(row, '2')">
                确认有误
              </el-button>
              <el-button size="mini" type="text" color="color-info" @click="saveData(row, '3')">
                废弃
              </el-button>
              <el-button type="text" size="small" @click="row.edit = !row.edit"> 备注 </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- <el-dialog title="编辑" :visible.sync="dialogVisible" width="40%">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="章节名称" prop="chapter_name">
          <el-input v-model="temp.chapter_name" />
        </el-form-item>
        <el-form-item label="错误提示信息" prop="message">
          <el-input v-model="temp.message" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="temp.status"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="temp.remark" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveData()">保 存</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>
<script>
import { getList, getDoc, update } from '@/api/third'
export default {
  data() {
    return {
      curTopic: {
        doc_id: '',
      },
      sliderList: [],
      tableData: [],
      dialogVisible: false,
      temp: {
        error_id: '',
        chapter_name: '',
        message: '',
        status: '0',
        remark: '',
      },
      obj: {},
      obj1: {},
      options: [
        {
          value: '0',
          label: '未确认',
        },
        {
          value: '1',
          label: '确认正确',
        },
        {
          value: '2',
          label: '确认有误',
        },
        {
          value: '3',
          label: '完全错误',
        },
      ],
    }
  },
  mounted() {
    this.obj = this.$route.query
    // this.obj = {
    //   chid: "00001",
    //   doc_id: ["001", "002", "12321543457"],
    // };
    // this.getList(this.obj);
    this.getDoc(this.obj)
  },
  created() {
    // this.dataRefreh();
  },
  destroyed() {
    // 在页面销毁后，清除计时器
    this.clear()
  },
  methods: {
    // 自动刷新
    dataRefreh() {
      if (this.intervalId != null) {
        return
      }
      // 计时器为空，操作
      this.intervalId = setInterval(() => {
        this.getDoc(this.obj)
      }, 3000)
    },
    // 停止定时器
    clear() {
      clearInterval(this.intervalId) // 清除计时器
      this.intervalId = null // 设置为null
    },
    // 点击自动刷新，刷新
    fresh() {
      this.getDoc(this.obj)
    },
    getList(params) {
      getList(params).then((res) => {
        const items = res.result
        this.tableData = items.map((v) => {
          this.$set(v, 'edit', false)
          // v.remark = v.remark
          return v
        })
      })
    },
    cancelEdit(row) {
      // row.remark = row.remark
      row.edit = false
    },
    confirmEdit(row) {
      row.edit = false
      // row.remark = row.remark
      update(row).then(() => {
        this.$message.success('保存成功')
        this.getList(this.obj)
      })
    },
    getDoc(params) {
      getDoc(params).then((res) => {
        this.sliderList = res.result.docs
        if (this.sliderList.length > 0) {
          this.handleClick(this.sliderList[0])
        }
      })
    },
    // 点击左边菜单切换
    handleClick(item) {
      this.curTopic = item
      this.obj.doc_id = item.doc_id
      this.getList(this.obj)
    },
    // 保存
    saveData(row, status) {
      if (status === '3') {
        this.$confirm('确定废弃该信息吗?', '提示', {
          confirmButtonText: '确定废弃',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            row.status = status
            update(row).then(() => {
              this.$message.success('保存成功')
              this.getList(this.obj)
            })
          })
          .catch(() => {})
      } else {
        row.status = status
        update(row).then(() => {
          this.$message.success('保存成功')
          this.getList(this.obj)
        })
      }
    },
  },
}
</script>
<style lang="scss" scoped>
#app {
  padding: 20px;
}
.el-row {
  height: 100%;
}
.el-col {
  height: 100%;
}
.circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
}
.info {
  background-color: $--color-info;
}
.correct {
  background-color: $--color-success;
}
.error {
  background-color: $--color-danger;
}
.abandon {
  background-color: rgb(144 147 153);
}
/* .slider-box ul li.active {
  background: #ecf5ff;
} */
</style>
