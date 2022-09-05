<template>
  <div
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(225, 225, 225, 0.8)"
  >
    <el-row :gutter="20" style="height: 30px; margin-bottom: 10px">
      <el-col :span="7">
        <el-input v-model="filterText" class="search-ipt" placeholder="输入关键字进行过滤" />
      </el-col>
      <el-col :span="6" class="text-right float-right">
        <el-button type="primary" @click="newBuilt">新增</el-button>
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="saveAllData">保存</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="7">
        <div class="tree-box h-400px scrollbar-thin">
          <el-tree
            v-if="treeList.length"
            ref="tree"
            highlight-current
            :data="treeList"
            :props="defaultProps"
            :filter-node-method="filterNode"
            :expand-on-click-node="false"
            :default-expanded-keys="expandData"
            node-key="vid"
            @node-click="selectNode"
            @node-expand="expandNode"
            @node-collapse="handleNodeCollapse"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>{{ node.label }}</span>
              <!-- <span>{{data.vid}}</span> -->
              <span>
                <el-button
                  v-show="node.childNodes.length == 0 || data.vid.indexOf('cate') < 0"
                  type="text"
                  size="mini"
                  @click="() => append(data)"
                >
                  添加
                </el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="slider-box h-400px scrollbar-thin">
          <ul>
            <li
              v-for="(item, index) in objProperty.vertexes"
              :key="item.vid"
              :class="{ active: curTopic.vid === item.vid }"
              @click="handleClick(item)"
            >
              <span class="flex-1">{{ item.title }}</span>
              <i class="el-icon-delete remove-btn" @click="remove(index)" />
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="right-box scrollbar-thin">
          <div v-for="(item, index) in list" :key="index" class="propertie-item">
            <el-select v-model="item.cid" placeholder="请选择" class="key-ipt">
              <el-option
                v-for="item in metaList"
                :key="item.cid"
                :label="item.title"
                :value="item.cid"
              />
            </el-select>
            <el-input v-model="item.value" class="val-ipt" placeholder="请输入value" />
            <i
              v-if="list.length > 1"
              class="el-icon-remove-outline remove-btn"
              @click="removePropertie(index)"
            />
          </div>
          <div class="add-btn">
            <i class="el-icon-circle-plus-outline" @click="addPropertie" />
          </div>
        </div>
        <div class="right-box mt-10px">
          <el-cascader
            class="w-full custom-cascader"
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
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="新增"
      :visible.sync="openDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      destroy-on-close
      width="50%"
    >
      <el-form ref="dataForm" :model="form" label-position="right" label-width="auto">
        <div class="flex-box">
          <el-form-item
            label="名称"
            prop="title"
            :rules="{
              required: true,
              message: '请输入标题',
              trigger: 'change',
            }"
          >
            <el-input v-model="form.title" />
          </el-form-item>
          <el-form-item
            label="分类"
            prop="cate"
            :rules="{
              required: true,
              message: '请输入分类',
              trigger: 'change',
            }"
          >
            <el-input v-model="form.cate" />
          </el-form-item>
        </div>
        <div class="flex-box">
          <el-form-item
            label="主题"
            prop="type"
            :rules="{
              required: true,
              message: '请选择主题',
              trigger: 'change',
            }"
          >
            <el-select v-model="form.type" filterable style="width: 100%" placeholder="请选择">
              <el-option
                v-for="item in topicList"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="ID" prop="vid">
            <el-input v-model="form.vid" />
          </el-form-item>
        </div>
        <div class="flex-box">
          <el-form-item label="tag">
            <el-input v-model="form.tag" />
          </el-form-item>
          <el-form-item />
        </div>
        <el-form-item label="属性" prop="properties" class="max-h-140px scrollbar-thin">
          <div v-for="(item, index) in form.properties" :key="index" class="propertie-item">
            <el-input
              v-model="item.key"
              class="key-ipt"
              placeholder="请输入key"
              :disabled="!newBuilt"
            />
            <el-input
              v-model="item.value"
              class="val-ipt"
              placeholder="请输入value"
              :disabled="!newBuilt"
            />
            <i
              v-if="form.properties.length > 1"
              class="el-icon-remove-outline remove-btn"
              @click="removeTreePropertie(index)"
            />
          </div>

          <div class="add-btn">
            <i class="el-icon-circle-plus-outline" @click="addTreePropertie" />
          </div>
        </el-form-item>
        <el-form-item label="文献" prop="refer">
          <el-cascader
            class="w-full custom-cascader"
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="openDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveData()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { createTreeList } from '@/api/knowledge/node'
import {
  getEdgeList,
  getMetaList,
  getPropertyList,
  referenceTree,
  updateProperty,
} from '@/api/knowledge/disease'
import { v4 as uuidv4 } from 'uuid'
export default {
  name: 'TreeBox',
  props: {
    // sendParams:Object,
    sendParams: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      treeList: [],
      defaultProps: {
        label: 'title',
        children: 'child',
      },
      filterText: '',
      curTopic: {},
      metaList: [], // 下拉框列表
      referList: [],
      list: [
        // {
        //   cid: "",
        //   title: "",
        //   value: "",
        // },
      ],
      objProperty: {},
      params: {},
      form: {
        title: '',
        tag: '',
        vid: '',
        cate: '',
        type: '',
        properties: [
          {
            key: '',
            value: '',
          },
        ],
      },
      topicList: [], // 主题列表
      openDialog: false,
      cate: '',
      loading: true,
      expandData: [],
    }
  },
  watch: {
    sendParams: {
      handler(newVal) {
        if (!newVal) return true
        this.list = [
          // {
          //   cid: "",
          //   title: "",
          //   value: "",
          // },
        ]
        this.params = newVal
        this.getEdgeList(newVal)
        this.getMetaList(newVal)
        this.getPropertyList(newVal)
      },
      deep: true,
      immediate: true,
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    },
  },
  mounted() {
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
    // 树数据
    async getEdgeList(paramsObj) {
      const obj = {
        search: '',
        pkey: paramsObj.pkey,
      }
      const res = await getEdgeList(obj)
      this.treeList = res.result.schema
      this.topicList = res.result.relations
      this.loading = false
      // this.form.type = this.topicList[0].id
      if (paramsObj.vid) {
        this.$nextTick(() => {
          if (this.treeList.length > 0) {
            this.$refs.tree.setCurrentKey(paramsObj.vid)
          }
        })
      }
    },
    // 属性下拉框
    getMetaList(paramsObj) {
      const obj = {
        pkey: paramsObj.pkey,
      }
      getMetaList(obj).then((res) => {
        this.metaList = res.result
      })
    },
    // 与其他属性关联列表
    getPropertyList(paramsObj) {
      // const obj = {
      //   vid: paramsObj.vid,
      //   pkey: paramsObj.pkey
      // }
      getPropertyList(paramsObj).then((res) => {
        this.objProperty = res.result
        if (paramsObj.value.length > 0) {
          this.handleClick(paramsObj.value[0])
        }
      })
    },
    // 过滤树节点
    filterNode(value, data) {
      if (!value) return true
      return data.title.indexOf(value) !== -1
    },
    // 点击树节点
    selectNode(val, node) {
      const parents = this.getParent(node)
      this.cate = parents.reverse().join(' ')
    },
    // 树展开
    expandNode(data) {
      // 保存当前展开的节点
      let flag = false
      this.expandData.some((item) => {
        if (item === data.vid) {
          // 判断当前节点是否存在， 存在不做处理
          flag = true
          return true
        }
      })
      if (!flag) {
        // 不存在则存到数组里
        this.expandData.push(data.vid)
      }
    },
    // 树收缩
    handleNodeCollapse(data) {
      this.expandData.some((item, i) => {
        if (item === data.vid) {
          // 删除重复节点
          this.expandData.length = i
        }
      })
    },
    getParent(node, parents = []) {
      parents.push(node.label)
      if (node.parent && node.parent.level !== 0) {
        this.getParent(node.parent, parents)
      }
      return parents
    },
    // 往右边添加树节点
    append(val) {
      val.meta = []
      const isHasId = this.objProperty.vertexes.find((item) => item.vid === val.vid)
      if (!isHasId) {
        this.objProperty.vertexes.push(val)
        this.$message.success('添加成功')
      } else {
        this.$message.error('不能重复添加')
      }
    },
    // 移除症状
    remove(index) {
      this.objProperty.vertexes.splice(index, 1)
      this.$message.success('移除成功')
    },
    // 选中症状
    handleClick(item) {
      this.list = [
        // {
        //   cid: "",
        //   title: "",
        //   value: "",
        // },
      ]
      this.curTopic = item
      const arr = this.objProperty.vertexes.filter((i) => i.vid === item.vid)
      if (arr.length > 0) {
        this.list = Object.assign(arr[0].meta)
      }
    },
    // 移除属性
    removePropertie(index) {
      if (this.list.length <= 1) return
      this.list.splice(index, 1)
    },
    // 增加属性
    addPropertie() {
      this.list.push({
        cid: '',
        title: '',
        value: '',
      })
    },
    // 新建树节点
    newBuilt() {
      this.openDialog = true
      this.form = {
        title: '',
        tag: '',
        vid: '',
        cate: '',
        type: '',
        properties: [
          {
            key: '',
            value: '',
          },
        ],
      }
      this.form.cate = this.cate
      this.form.type = this.topicList[0].id
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    removeTreePropertie(index) {
      if (this.form.properties.length <= 1) return
      this.form.properties.splice(index, 1)
    },
    addTreePropertie() {
      this.form.properties.push({
        key: '',
        value: '',
      })
    },
    // 新增保存
    saveData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (!this.form.vid) {
            this.form.vid = this.form.type + '_' + uuidv4()
          }
          this.params.vid = this.form.vid
          createTreeList(this.form).then(async (res) => {
            if (res.status === 200) {
              await this.getEdgeList(this.params)
              // this.expandData.push(this.form.vid);
              const val = {
                meta: [],
                title: this.form.title,
                topic: this.form.topic,
                type: this.form.type,
                vid: this.form.vid,
              }
              this.objProperty.vertexes.push(val)
              this.openDialog = false
              this.$message.success('保存成功')
            }
          })
        }
      })
    },
    // 保存
    saveAllData() {
      updateProperty(this.objProperty).then(() => {
        this.closeDialog()
      })
    },
    // 关闭弹窗
    closeDialog() {
      this.params.dialogVisible = false
      this.$emit('closeDialog', this.params)
      this.list = []
      this.filterText = ''
    },
  },
}
</script>
<style lang="scss" scoped>
.right-box {
  width: 100%;
  height: 195px;
  overflow-y: auto;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  user-select: none;
  padding: 5px 10px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
:deep {
  .custom-cascader {
    .el-input {
      max-height: 170px;
    }
    .el-cascader__tags {
      margin-top: 3px;
      max-height: 170px;
      overflow-y: auto;
    }
  }
}
</style>
