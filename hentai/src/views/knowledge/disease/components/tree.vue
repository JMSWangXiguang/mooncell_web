<template>
  <div class="tree-box h-[calc(100vh-180px)]">
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
      autofocus
      clearable
      @input="getTreeList"
    />
    <el-tree
      v-if="treeList.length"
      ref="tree"
      highlight-current
      node-key="vid"
      class="filter-tree"
      :data="treeList"
      :props="defaultProps"
      :default-expanded-keys="expandData"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      @node-click="selectNode"
      @node-expand="expandNode"
      @node-collapse="handleNodeCollapse"
    />
  </div>
</template>

<script>
import { getTreeList } from '@/api/knowledge/disease'
export default {
  name: 'TreeBox',
  props: {
    sendObj: {
      type: Object,
      default: () => ({
        refresh: false,
        vide: '',
        expandId: [],
      }),
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
      expandData: [],
    }
  },
  watch: {
    sendObj: {
      handler(val) {
        if (val.refresh) {
          this.getTreeList(val.vid)
          this.expandData = val.expandId
        }
      },
      deep: true,
      // immediate: true,
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    expandData(newVal) {
      this.$emit('node-expand', newVal)
    },
  },
  created() {
    this.getTreeList()
  },
  mounted() {},
  methods: {
    // 回去树数据
    async getTreeList(val) {
      const res = await getTreeList({ search: this.searchVal })
      this.treeList = res.result
      const obj = {}
      obj.refresh = false
      obj.vid = ''
      this.$emit('emitRefresh', obj)
      this.$nextTick(() => {
        if (this.treeList.length > 0) {
          this.$refs.tree.setCurrentKey(val)
        }
      })
    },
    // 树节点展开
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
          // 删除关闭节点
          this.expandData.length = i
          // this.expandData.splice(i, 1);
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
      // if(node.childNodes.length == 0){
      //   const parents = this.getParent(node)
      //   this.$emit('node-select', val, parents.reverse().join(' '))
      // }else{
      //   const parents = this.getParent(node)
      //   this.$emit('node-select', '', parents.reverse().join(' '))
      // }
    },
    getParent(node, parents = []) {
      parents.push(node.label)
      if (node.parent && node.parent.level !== 0) {
        this.getParent(node.parent, parents)
      }
      return parents
    },
  },
}
</script>
