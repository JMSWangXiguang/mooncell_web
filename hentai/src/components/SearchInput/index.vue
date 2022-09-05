<template>
  <div v-clickoutside="handleClickOutside" class="select-tree">
    <el-input
      v-model="selectParam"
      class="select-param-input"
      placeholder="请选择机构"
      @click.native="handleInput"
      @input="filterInput"
      @mouseenter.native="paramInputHover"
      @mouseleave.native="paramInputOut"
    >
      <i slot="suffix" class="el-input__icon" :class="icon" @click="iconClick(icon)" />
    </el-input>
    <div v-show="treeShowFlag" style="position: absolute; z-index: 3333">
      <div class="triangle"><span /></div>
      <div class="drop-down-div">
        <el-tree
          ref="tree"
          highlight-current
          :data="data"
          empty-text="无匹配数据"
          accordion
          :node-key="title == 'chapter' ? 'chapter_id' : 'vid'"
          :props="defaultProps"
          :default-expanded-keys="defaultExpandedkeys"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          class="drop-down-tree"
          @node-click="nodeClick"
        />
      </div>
    </div>
  </div>
</template>
<script>
// clickoutside自定义指令，当鼠标点击指令绑定元素的外部时会触发该方法。
import Clickoutside from 'element-ui/src/utils/clickoutside'
export default {
  directives: { Clickoutside }, // 声明指令
  props: {
    data: {
      default: () => [],
      type: [Array, Object],
    },
    // value监听的是父组件的v-model
    value: {
      default: '',
      type: String,
    },
    sendId: {
      default: '',
      type: String,
    },
    title_id: {
      default: '',
      type: String,
    },
  },
  data() {
    return {
      treeShowFlag: false,
      defaultProps: {
        label: 'title',
        children: 'child',
      },
      selectParam: '',
      icon: 'el-icon-arrow-down',
      defaultExpandedkeys: [],
      title: '',
    }
  },
  watch: {
    treeShowFlag(val) {
      this.icon = val ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
    },
    value: {
      handler(newVal) {
        this.selectParam = newVal
      },
      deep: true,
      immediate: true,
    },
    title_id: {
      handler(newVal) {
        this.title = newVal
      },
      deep: true,
      immediate: true,
    },
    sendId: {
      handler(newVal) {
        if (newVal) {
          this.defaultExpandedkeys = [newVal] // 展开选中的节点
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(newVal) // 设置节点高亮
          })
        } else {
          this.defaultExpandedkeys = []
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey('') // 设置节点高亮
          })
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // 点击外部区域收起下拉框
    handleClickOutside() {
      this.treeShowFlag = false
    },
    // 点击输入框展开/收起下拉框
    handleInput() {
      this.treeShowFlag = !this.treeShowFlag
    },
    // 输入文字进行模糊查询
    filterInput: function (val) {
      this.treeShowFlag = true
      this.$refs.tree.filter(val)
    },
    // 鼠标悬浮，如果由内容的话就显示清除图标
    paramInputHover: function () {
      if (this.selectParam !== '') {
        this.icon = 'el-icon-circle-close'
      }
    },
    // 鼠标由悬浮离开，如果图标显示的是清除的话，就换成原来的图标
    paramInputOut: function () {
      if (this.icon === 'el-icon-circle-close') {
        this.icon = this.treeShowFlag ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
      }
    },
    // 点击清除图标时清除输入框的内容
    iconClick: function (icon) {
      if (icon === 'el-icon-circle-close') {
        this.treeShowFlag = false // 由于此事件会同时触发handleInput(),所以将treeShowFlag设为false，防止出现下拉列表
        this.selectParam = ''
        this.filterInput(this.selectParam) // 内容清除后显示所有数据
        this.$emit('change', {})
      }
    },
    // 节点过滤（模糊查询）
    filterNode(value, data) {
      if (!value) return true
      return data.title.indexOf(value) !== -1
    },
    // 树形节点点击事件
    nodeClick: function (val) {
      if (val.type != 'cate') {
        this.$emit('change', val)
        this.treeShowFlag = false
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.select-tree {
  width: 100%;
  display: inline-block;
  transition: 0.5s;
  .select-param-input {
    width: 100%;
    cursor: pointer;
  }
}
.drop-down-div {
  border-radius: 3px;
  max-height: 200px;
  min-width: 300px;
  padding: 10px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 1px 2px 8px 1px rgba(0, 0, 0, 0.2);
}
.drop-down-div .drop-down-tree {
  overflow: auto;
}
.triangle {
  width: 0;
  height: 0;
  border-width: 0 8px 7px;
  border-style: solid;
  border-color: transparent transparent rgb(220, 223, 230);
  margin-left: 60px;
  margin-top: 3px;
  position: relative;
}
.triangle span {
  display: block;
  width: 0;
  height: 0;
  border-width: 0 7px 6px;
  border-style: solid;
  border-color: transparent transparent rgb(255, 255, 255);
  position: absolute;
  top: 1px;
  left: -7px;
}
</style>
