<template>
  <div class="tree-box">
    <!-- <el-input
      v-model="filterText"
      class="search-ipt"
      placeholder="输入关键字进行过滤"
    /> -->
    <el-input
      v-model="searchVal"
      class="search-ipt"
      prefix-icon="el-icon-search"
      placeholder="输入关键字进行过滤"
      @input="search"
      autofocus
      clearable
    />

    <el-tree
      v-if="treeList.length"
      ref="tree"
      highlight-current
      class="filter-tree"
      :data="treeList"
      :props="defaultProps"
      :default-expanded-keys="expandData"
      :filter-node-method="filterNode"
      node-key="vid"
      :expand-on-click-node="false"
      @node-click="selectNode"
      @node-expand="expandNode"
      @node-collapse="handleNodeCollapse"
    />
  </div>
</template>

<script>
import { getTreeList } from '@/api/knowledge/node'
export default {
  name: 'TreeBox',
  props: {
    sliderObj: {
      type: Object,
      required: true,
      default: () => ({
        id: '',
        vid: '',
        expandId: [],
      }),
    },
    isUpdate: {
      type: Boolean,
      default: false,
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
      searchVal: '',
      obj: {},
      expandData: [], //默认展开树节点
    }
  },
  watch: {
    // 监听主题变化传的topic
    obj: {
      handler(newVal) {
        this.getTreeList(newVal)
      },
      deep: true,
      immediate: true,
    },
    sliderObj: {
      handler(newVal) {
        this.expandData = newVal.expandId
        this.getTreeList(newVal)
      },
      deep: true,
      immediate: true,
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    isUpdate: {
      handler(newVal) {
        if (newVal) {
          this.getTreeList(this.obj)
        }
      },
      deep: true,
      immediate: true,
    },
    expandData(newVal) {
      this.$emit('node-expand', newVal)
    },
  },
  created() {},
  mounted() {
    this.$bus.on('sendByBus', (value) => {
      this.obj = value
    })
    this.$bus.on('expandData', (value) => {
      this.expandData = value
    })
  },
  methods: {
    search() {
      this.getTreeList(this.obj)
    },
    // 树数据
    async getTreeList(paramsObj) {
      if (!paramsObj.id) return
      const objparams = {
        topic: paramsObj.id,
        search: this.searchVal,
      }
      const res = await getTreeList(objparams)
      this.treeList = res.result.schema
      let obj = {}
      obj.id = ''
      obj.vid = ''
      // this.$emit("sendObj", obj);
      this.$emit('sendIsUpdate', false)
      this.$nextTick(() => {
        if (this.treeList.length > 0) {
          this.$refs.tree.setCurrentKey(paramsObj.vid)
        }
      })
    },
    // 过滤树节点
    filterNode(value, data) {
      if (!value) return true
      return data.title.indexOf(value) !== -1
    },
    // 选中的当前树节点信息
    selectNode(val, node) {
      const parents = this.getParent(node)
      this.$emit('node-select', val, parents.reverse().join(' '))
    },
    getParent(node, parents = []) {
      parents.push(node.label)
      if (node.parent && node.parent.level != 0) this.getParent(node.parent, parents)
      return parents
    },
    //树节点展开
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
    // 树节点关闭
    handleNodeCollapse(data) {
      this.expandData.some((item, i) => {
        if (item === data.vid) {
          // 删除重复节点
          // this.expandData.splice(i, 1);
          this.expandData.length = i
        }
      })
    },
  },
}
</script>
