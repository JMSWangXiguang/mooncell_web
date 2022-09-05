<!--
 * @Description:
 * @version:
 * @Author: 唐红娟
 * @Date: 2021-08-05
 * @LastEditors: imali
 * @LastEditTime: 2022-08-24 16:44:22
-->
<template>
  <div
    style="width: 100%; height: 100%; position: absolute; bottom: 0; top: 0; left: 0; padding: 20px"
  >
    <el-row>
      <el-col :span="24" class="right-box">
        <div class="search-box">
          <div class="btn-box">
            <el-button type="primary" @click="handleNew">新建</el-button>
            <el-button @click="DeleteTree">删除</el-button>
            <el-button type="primary" @click="saveData">保存</el-button>
          </div>
        </div>
        <el-row style="flex: 1">
          <el-col style="height: 100%" :span="5">
            <tree
              @node-select="selectNode"
              @node-expand="expandNode"
              :sendObj="sendObj"
              @emitRefresh="emitRefresh"
            />
          </el-col>
          <el-col style="height: 100%; padding-left: 20px" :span="19">
            <el-form
              ref="form"
              :model="form"
              label-width="80px"
              class="form-box h-[calc(100vh-180px)] bg-white px-1/8 pt-40px pb-20px"
            >
              <el-form-item label="名称" prop="title" class="w-full">
                <el-input v-model="form.title" placeholder="请输入名称" />
              </el-form-item>
              <div v-for="(item, index) in form.properties" :key="index">
                <el-form-item :label="item.pkey" class="w-full" v-if="item.type == 'single-text'">
                  <el-input v-model="item.value" />
                </el-form-item>
                <el-form-item :label="item.pkey" class="w-full" v-if="item.type == 'multi-text'">
                  <el-input v-model="item.value" />
                  <!-- <el-select
                    v-model="item.value"
                    style="width:100%;"
                    multiple
                    filterable
                    allow-create
                    default-first-option>
                    <el-option
                      v-for="i in item.value"
                      :key="i"
                      :label="i"
                      :value="i">
                    </el-option>
                  </el-select> -->
                </el-form-item>
                <el-form-item
                  :label="item.pkey"
                  class="w-full"
                  v-show="item.type == 'edge' || item.type == 'reference'"
                >
                  <span>{{
                    item.value && Array.isArray(item.value)
                      ? item.value.map((item) => item.title || item).join('，')
                      : item.value
                  }}</span>
                  <el-button type="primary" class="float-right" @click="edit(item)">编辑</el-button>
                </el-form-item>
              </div>
            </el-form>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <!-- 编辑弹框 -->
    <el-dialog
      title="编辑"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      width="80%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :before-close="close"
      destroy-on-close
    >
      <transferDisease
        v-if="type == 'edge'"
        :closeShow="closeShow"
        :sendParams="sendParams"
        @closeDialog="closeDialog"
      ></transferDisease>
      <literatrueTranfer
        v-if="type == 'reference'"
        :sendParams="sendParams"
        @closeDialog="closeDialog"
      ></literatrueTranfer>
    </el-dialog>
    <!-- 新建疾病树节点 -->
    <el-dialog
      title="新增"
      :visible.sync="dialogOpen"
      width="40%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
    >
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="100px">
        <el-form-item
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
        <el-form-item label="分类" style="width: 100%">
          <el-input v-model="temp.category" />
          <!-- <el-select
            v-model="temp.category"
            style="width:100%;"
            multiple
            filterable
            allow-create
            default-first-option>
            <el-option
              v-for="i in temp.category"
              :key="i"
              :label="i"
              :value="i">
            </el-option>
          </el-select> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogOpen = false"> 取消 </el-button>
        <el-button type="primary" @click="saveTemp()"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import tree from './components/tree'
import transferDisease from './components/transfer'
import literatrueTranfer from './components/literatrueTranfer'
import { getInfo, createTree, updateTree } from '@/api/knowledge/disease'
import { deleteTreeList } from '@/api/knowledge/node'
export default {
  name: 'Node',
  components: {
    tree,
    transferDisease,
    literatrueTranfer,
  },
  data() {
    return {
      form: {
        title: '',
      },
      type: '', //判断类型，跳转不同的弹窗
      dialogVisible: false,
      sendParams: {}, //传给子组件
      vid: '',
      dialogOpen: false,
      temp: {
        title: '',
        category: '',
      },
      refresh: '',
      sendObj: {
        refresh: false,
        vid: '',
        expandId: [],
      },
      selectTreeNode: '',
      closeShow: false,
      expandId: [],
    }
  },
  methods: {
    selectNode(val, category) {
      this.temp.category = category
      this.selectTreeNode = val
      if (val) {
        this.getInfo(val)
      }
    },
    //树组件传展开节点
    expandNode(val) {
      this.expandId = val
    },
    //获取疾病详细信息
    getInfo(params) {
      let objParams = {
        vid: params.vid,
      }
      getInfo(objParams).then((res) => {
        this.form = res.result
        this.vid = this.form.vid
      })
    },
    //点击编辑
    edit(item) {
      this.closeShow = false
      this.sendParams = item
      this.sendParams.vid = this.vid
      this.type = item.type
      this.dialogVisible = true
    },
    //子组件传关闭弹窗
    closeDialog(val) {
      this.dialogVisible = val.dialogVisible
      this.getInfo(this.selectTreeNode)
    },
    close() {
      this.getInfo(this.selectTreeNode)
      this.dialogVisible = false
      this.closeShow = true
    },
    handleClose() {
      this.dialogVisible = false
    },
    //新建
    handleNew() {
      this.temp.title = ''
      this.dialogOpen = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    //新建保存
    saveTemp() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createTree(this.temp).then((res) => {
            if (res.status == 200) {
              this.dialogOpen = false
              this.sendObj.refresh = true
              this.sendObj.vid = ''
              this.sendObj.expandId = this.expandId
              this.$message.success('保存成功')
            }
          })
        }
      })
    },
    emitRefresh(val) {
      this.sendObj = val
    },
    //保存
    saveData() {
      if (this.form.vid) {
        let obj = {}
        obj.title = this.form.title
        obj.vid = this.form.vid
        obj.properties = this.form.properties.filter(
          (item) => item.type == 'single-text' || item.type == 'multi-text'
        )
        updateTree(obj).then((res) => {
          if (res.status == 200) {
            this.dialogOpen = false
            // this.refresh = obj.vid
            this.sendObj.refresh = true
            this.sendObj.vid = obj.vid
            this.sendObj.expandId = this.expandId
            this.$message.success('保存成功')
          }
        })
      } else {
        this.$message.error('请选择一个树节点')
      }
    },
    //删除树节点
    DeleteTree() {
      const obj = {}
      obj.vid = this.selectTreeNode.vid
      if (obj.vid) {
        this.$confirm('确定删除该树节点吗?', '提示', {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            deleteTreeList(obj).then((res) => {
              if (res.status === 200) {
                this.sendObj.refresh = true
                this.sendObj.expandId = this.expandId
                // this.restFrom();
                this.$message.success('删除成功')
                this.form = {}
              }
            })
          })
          .catch(() => {})
      } else {
        this.$message.error('请选择一个树节点')
      }
    },
  },
}
</script>
