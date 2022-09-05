<!--
 * @Description:
 * @version:
 * @Author: 唐红娟
 * @Date: 2021-08-05
 * @LastEditors: imali
 * @LastEditTime: 2022-08-24 16:44:41
-->
<template>
  <div class="wrap">
    <el-row class="flex_box">
      <el-col :span="4" class="h-[calc(100vh-130px)]">
        <slider-box :is-update="isUpdate" @node-click="getVal" class="bg-white" />
      </el-col>
      <el-col :span="20" class="right-box h-[calc(100vh-130px)]">
        <div class="search-box">
          <div class="btn-box">
            <el-button type="primary" @click="newNodeTree">新建</el-button>
            <el-button :disabled="!isEdit" @click="DeleteTree">删除</el-button>
            <el-button type="primary" @click="saveNodeTree">保存</el-button>
          </div>
        </div>
        <el-row type="flex" class="h-[calc(100%-40px)]">
          <el-col :span="6">
            <tree
              @node-select="selectNode"
              @node-expand="expandNode"
              :sliderObj="sliderObj"
              @sendObj="sendObj"
              :is-update="isUpdate"
              @sendIsUpdate="sendIsUpdate"
            />
          </el-col>
          <el-col :span="18" class="pl-20px">
            <el-form ref="form" :model="form" label-width="auto" :disabled="!isEdit">
              <div class="flex-box">
                <el-form-item
                  label="名称"
                  prop="title"
                  :rules="{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur',
                  }"
                >
                  <el-input v-model="form.title" placeholder="请输入名称" />
                </el-form-item>
                <el-form-item label="分类" prop="cate">
                  <el-input v-model="form.cate" placeholder="请输入分类" />
                </el-form-item>
              </div>
              <div class="flex-box">
                <el-form-item label="tag" prop="tag">
                  <el-input v-model="form.tag" placeholder="请输入tag" />
                </el-form-item>
                <el-form-item label="ID" prop="vid">
                  <el-input v-model="form.vid" placeholder="请输入ID" />
                </el-form-item>
              </div>
              <div class="flex-box items-start">
                <el-form-item
                  label="属性"
                  prop="properties"
                  class="h-[calc(50vh-325px)] scrollbar-thin"
                >
                  <div v-for="(item, index) in form.properties" :key="index" class="propertie-item">
                    <el-input v-model="item.key" class="key-ipt" placeholder="请输入key" />
                    <el-input v-model="item.value" class="val-ipt" placeholder="请输入value" />
                    <i
                      v-if="form.properties.length > 1"
                      class="el-icon-remove-outline remove-btn"
                      @click="removePropertie(index)"
                    />
                  </div>

                  <div class="add-btn">
                    <i class="el-icon-circle-plus-outline" @click="addPropertie" />
                  </div>
                </el-form-item>

                <el-form-item label="文献" prop="refer">
                  <el-cascader
                    class="w-full custom-cascader"
                    v-model="form.refer"
                    :options="referList"
                    :show-all-levels="false"
                    :props="{
                      label: 'title',
                      value: 'docid',
                      children: 'child',
                      multiple: true,
                      emitPath: false,
                    }"
                    clearable
                  ></el-cascader>
                </el-form-item>
              </div>
              <el-form-item label="关联" prop="edges" class="form-table">
                <el-button
                  type="primary"
                  @click="handleCreate(tab === '1' ? 'master' : 'slave')"
                  class="float-right"
                >
                  新增
                </el-button>
                <el-tabs type="card" v-model="tab">
                  <el-tab-pane name="1" label="主">
                    <el-table
                      :data="filter(form.edges, ['relation', 'master'])"
                      border
                      height="calc(50vh - 20px)"
                    >
                      <!-- <el-table-column prop="relation" label="关系" width="80">
                        <template slot-scope="scope">
                          <span v-show="scope.row.relation == 'master'">主</span>
                          <span v-show="scope.row.relation == 'slave'">次</span>
                        </template>
                      </el-table-column> -->
                      <el-table-column prop="title" label="关系名称" width="120" />
                      <el-table-column prop="another.title" label="节点名称" width="120" />
                      <el-table-column prop="properties" label="属性关联">
                        <template slot-scope="scope">
                          <div v-for="(item, index) in scope.row.properties" :key="index">
                            {{ item.key }}:{{ item.value }}
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column fixed="right" label="操作" width="100">
                        <template slot-scope="scope">
                          <el-button type="text" size="small" @click="handleEdit(scope.row)">
                            编辑
                          </el-button>
                          <el-button type="text" size="small" @click="Delete(scope.row)">
                            删除
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-tab-pane>
                  <el-tab-pane name="2" label="从">
                    <el-table
                      :data="filter(form.edges, ['relation', 'slave'])"
                      border
                      height="calc(50vh - 20px)"
                    >
                      <!-- <el-table-column prop="relation" label="关系" width="80">
                        <template slot-scope="scope">
                          <span v-show="scope.row.relation == 'master'">主</span>
                          <span v-show="scope.row.relation == 'slave'">次</span>
                        </template>
                      </el-table-column> -->
                      <el-table-column prop="title" label="关系名称" width="120" />
                      <el-table-column prop="another.title" label="节点名称" width="120" />
                      <el-table-column prop="properties" label="属性关联">
                        <template slot-scope="scope">
                          <div v-for="(item, index) in scope.row.properties" :key="index">
                            {{ item.key }}:{{ item.value }}
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column fixed="right" label="操作" width="100">
                        <template slot-scope="scope">
                          <el-button type="text" size="small" @click="handleEdit(scope.row)">
                            编辑
                          </el-button>
                          <el-button type="text" size="small" @click="Delete(scope.row)">
                            删除
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-tab-pane>
                </el-tabs>
              </el-form-item>
            </el-form>
            <el-dialog
              v-if="dialogFormVisible"
              :title="`${dialogModel == 'create' ? '新增' : '修改'}`"
              :visible.sync="dialogFormVisible"
              :close-on-click-modal="false"
              :close-on-press-escape="false"
              destroy-on-close
              width="600px"
            >
              <el-form
                ref="dataForm"
                :model="temp"
                label-position="right"
                label-width="auto"
                style="height: 40vh"
              >
                <el-form-item
                  label="关系名称"
                  prop="title"
                  :rules="{
                    required: true,
                    message: '请输入关系名称',
                    trigger: 'change',
                  }"
                >
                  <el-input v-model="temp.title" />
                </el-form-item>
                <el-form-item label="节点名称">
                  <selecTree
                    v-model="temp.another.title"
                    :data="treeAllList"
                    :sendId="sendId"
                    class="query-select"
                    @change="deptChange"
                  />
                  <!-- <el-select
                    v-model="temp.another.title"
                    value-key="id"
                    filterable
                    clearable
                    :filter-method="typeFilter"
                    placeholder="请选择"
                    ref="selectUpResId"
                    @blur="changeList"
                  >
                    <el-option :value="treeAllList" style="height: auto">
                      <el-tree
                        ref="tree"
                        class="filter-tree"
                        empty-text="无匹配数据"
                        highlight-current
                        node-key="vid"
                        :data="treeAllList"
                        :props="defaultProps"
                        :default-expanded-keys="defaultExpandedkeys"
                        :filter-node-method="filterNode"
                        :expand-on-click-node="false"
                        @node-click="handleCheck"
                      />
                    </el-option>
                  </el-select> -->
                </el-form-item>
                <el-form-item label="属性" prop="properties" class="max-h-160px scrollbar-thin">
                  <div v-for="(item, index) in temp.properties" :key="index" class="propertie-item">
                    <el-input v-model="item.key" class="key-ipt" placeholder="请输入key" />
                    <el-input v-model="item.value" class="val-ipt" placeholder="请输入value" />
                    <i
                      v-if="temp.properties.length > 1"
                      class="el-icon-remove-outline remove-btn"
                      @click="removeTempPropertie(index)"
                    />
                  </div>

                  <div class="add-btn">
                    <i class="el-icon-circle-plus-outline" @click="addTempPropertie" />
                  </div>
                </el-form-item>
                <el-form-item label="文献" prop="refer">
                  <el-cascader
                    class="w-full custom-cascader"
                    v-model="temp.refer"
                    :options="referList"
                    :show-all-levels="false"
                    :props="{
                      label: 'title',
                      value: 'docid',
                      children: 'child',
                      multiple: true,
                      emitPath: false,
                    }"
                    clearable
                  ></el-cascader>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="closeDialog()">取消</el-button>
                <el-button type="primary" @click="saveData()">确定</el-button>
              </div>
            </el-dialog>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import sliderBox from './components/slider'
import tree from './components/tree'
import selecTree from '@/components/SearchInput'
import {
  getTreeInfo,
  getAllTree,
  createTreeList,
  updateTreeList,
  deleteTreeList,
} from '@/api/knowledge/node'
import { assign, filter } from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { referenceTree } from '@/api/knowledge/disease'
export default {
  name: 'Node',
  components: {
    sliderBox,
    tree,
    selecTree,
  },
  data() {
    return {
      filter,
      curTopic: {},
      tab: '1',
      params: {
        page: 1,
        size: 20,
      },
      defaultProps: {
        label: 'title',
        children: 'child',
      },
      form: {
        cate: '',
        title: '',
        // type: '',
        tag: null,
        edges: [],
        properties: [
          {
            key: '',
            value: '',
          },
        ],
      },
      dialogFormVisible: false,
      dialogModel: '', // create、edit
      temp: {
        eid: '',
        title: '',
        relation: '',
        another: {
          title: '',
          vid: '',
        },
        properties: [
          {
            key: '',
            value: '',
          },
        ],
      },
      referList: [],
      treeAllList: [],
      treeNodeValue: '',
      newBuilt: false,
      isEdit: false, // 判断是新增还是编辑
      isUpdate: false,
      type: '',
      selectTreeNode: {},
      sliderObj: {
        id: '',
        vid: '',
        expandId: [],
      }, //回传给子组件
      old_vid: '',
      cate: '',
      relation: '',
      expandId: [],
      defaultExpandedkeys: [],
      sendId: '',
    }
  },
  watch: {},
  created() {
    this.getAllTree()
    this.getReferTree()
  },
  methods: {
    async getReferTree() {
      const mergeObjChild = (child) => {
        child.forEach((c, i) => {
          if (c.type === 'node') {
            child[i] = {
              ...c,
              title: c.header,
              rid: c.docid,
              leaf: true,
            }
          } else {
            mergeObjChild(c.child)
          }
        })
      }
      const { schema } = (await referenceTree({ search: '', source: '' })).result
      mergeObjChild(schema)
      this.referList = schema
    },
    // 选择不同的树节点，不同的form
    async getTreeInfo(params) {
      const paramsObj = {
        vid: params.vid,
      }
      const res = await getTreeInfo(paramsObj)
      this.form = res.result
      this.new = true
      this.old_vid = res.result.vid
      // this.cate = this.form.cate
    },
    // 所有树节点数据
    async getAllTree() {
      const objparams = {
        search: '',
      }
      const res = await getAllTree(objparams)
      this.treeAllList = res.result.schema
    },
    getVal(val) {
      this.type = val.id
    },
    // 清空树的数据
    restFrom() {
      this.form = {
        cate: '',
        title: '',
        tag: null,
        edges: [],
        properties: [
          {
            key: '',
            value: '',
          },
        ],
      }
      this.form.type = this.type
    },
    // 新增树节点
    newNodeTree() {
      this.restFrom()
      this.form.cate = this.cate
      this.newBuilt = true
      this.isEdit = true
    },
    // 增加/编辑树节点数据 保存
    saveNodeTree() {
      // this.$refs["form"].validate((valid) => {
      //   if (valid) {
      if (this.newBuilt) {
        if (!this.form.vid) {
          this.form.vid = this.form.type + '_' + uuidv4()
        }
        createTreeList(this.form).then((res) => {
          if (res.status === 200) {
            this.sliderObj.id = this.form.type
            this.sliderObj.vid = this.form.vid
            let flag = false
            this.expandId.some((item) => {
              if (item === this.form.vid) {
                flag = true
                return true
              }
            })
            if (!flag) {
              // 不存在则存到数组里
              this.expandId.push(this.form.vid)
              this.sliderObj.expandId = this.expandId
            }
            this.$message.success('保存成功')
            this.isEdit = false
            this.getTreeInfo(this.form)
            this.selectTreeNode.vid = this.form.vid
            // this.restFrom()
          }
        })
      } else {
        this.form.old_vid = this.old_vid
        updateTreeList(this.form).then((res) => {
          if (res.status === 200) {
            this.isUpdate = true
            this.sliderObj.id = this.form.type
            this.sliderObj.vid = this.form.vid
            let flag = false
            this.expandId.some((item) => {
              if (item === this.form.vid) {
                flag = true
                return true
              }
            })
            if (!flag) {
              // 不存在则存到数组里
              this.expandId.push(this.form.vid)
              this.sliderObj.expandId = this.expandId
            }
            this.isEdit = false
            this.$message.success('保存成功')
            this.getTreeInfo(this.form)
          }
        })
      }
      //   }
      // });
    },
    //树组件传选中节点
    selectNode(item, category) {
      this.cate = category
      this.newBuilt = false
      this.isEdit = true
      this.selectTreeNode = item
      this.getTreeInfo(item)
    },
    //树组件传展开节点
    expandNode(val) {
      this.expandId = val
    },
    sendObj(val) {
      this.sliderObj = val
    },
    sendIsUpdate(val) {
      this.isUpdate = val
    },
    // 增加属性
    addPropertie() {
      this.form.properties.push({
        key: '',
        value: '',
      })
    },
    // 移除属性
    removePropertie(index) {
      if (this.form.properties.length <= 1) return
      this.form.properties.splice(index, 1)
    },
    // 增加属性
    addTempPropertie() {
      this.temp.properties.push({
        key: '',
        value: '',
      })
    },
    // 移除属性
    removeTempPropertie(index) {
      if (this.temp.properties.length <= 1) return
      this.temp.properties.splice(index, 1)
    },
    // 清空表格数据
    resetTemp() {
      this.temp = {
        eid: '',
        title: '',
        relation: '',
        another: {
          title: '',
          vid: '',
        },
        properties: [],
      }
    },
    deptChange(val) {
      this.temp.another.title = val.title
      this.temp.another.vid = val.vid
    },
    // select 搜索树
    // typeFilter(value) {
    //   this.$refs.tree.filter(value);
    // },
    // filterNode(value, data) {
    //   if (!value) return true;
    //   return data.title.indexOf(value) !== -1;
    // },
    // //节点名称得到焦点
    // changeList() {
    //   this.$refs.selectUpResId.query = "";
    //   this.getAllTree();
    // },
    // 点击树节点
    // handleCheck(val, val1) {
    //   if (val1.childNodes.length == 0) {
    //     this.temp.another.title = val.title;
    //     this.temp.another.vid = val.vid;
    //     this.$refs.selectUpResId.blur();
    //   }
    // },
    // 新增关系
    handleCreate(val) {
      this.getAllTree()
      this.sendId = '' //默认展开清空
      this.relation = val
      this.resetTemp()
      this.dialogModel = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 编辑
    handleEdit(item) {
      this.sendId = item.another.vid
      this.temp = assign(item)
      this.dialogModel = 'edit'
      this.dialogFormVisible = true
    },
    //删除关联
    Delete(row) {
      this.$confirm('确定删除该条关联信息吗?', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          let index = this.form.edges.findIndex((item) => {
            return item.eid == row.eid
          })
          this.form.edges.splice(index, 1)
          this.saveNodeTree()
        })
        .catch(() => {})
    },
    // 新增/编辑关联保存
    saveData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 新增保存
          if (this.dialogModel === 'create') {
            this.temp.eid = uuidv4()
            if (this.relation == 'master') {
              this.temp.relation = 'master'
            } else {
              this.temp.relation = 'slave'
            }
            this.dialogFormVisible = false
            this.form.edges.push(this.temp)
            this.saveNodeTree()
          } else {
            // 编辑保存
            this.dialogFormVisible = false
            this.saveNodeTree()
          }
        }
      })
    },
    //关闭关系弹窗
    closeDialog() {
      this.getTreeInfo(this.selectTreeNode)
      this.dialogFormVisible = false
    },
    // 删除树节点
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
                this.expandId.some((item, i) => {
                  if (item === obj.vid) {
                    // 删除重复节点
                    this.expandId.splice(i, 1)
                    this.sliderObj.expandId = this.expandId
                  }
                })
                this.isUpdate = true
                this.restFrom()
                this.$message.success('删除成功')
                this.newBuilt = false
                this.cate = ''
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
<style lang="scss" scoped>
:deep {
  .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    background: #fff;
  }
  .el-tabs__header.is-top {
    width: calc(100% - 60px);
  }
  .custom-cascader {
    .el-input {
      max-height: calc(40vh - 250px);
    }
    .el-cascader__tags {
      margin-top: 3px;
      max-height: calc(40vh - 250px);
      overflow-y: auto;
    }
  }
}
</style>
