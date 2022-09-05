<template>
  <div>
    <el-row :gutter="20" style="height: 30px; margin-bottom: 10px">
      <el-col :span="8">
        <el-input
          v-model="filterText"
          class="search-ipt"
          placeholder="输入关键字进行过滤"
        />
      </el-col>
      <el-col :span="8" class="text-right float-right">
        <el-button type="primary" @click="handleCreate">新建</el-button>
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="saveDate">保存</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="tree-box">
          <el-tree
            v-if="treeList.length"
            ref="tree"
            highlight-current
            class="filter-tree"
            node-key="docid"
            :data="treeList"
            :props="defaultProps"
            default-expand-all
            :filter-node-method="filterNode"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span>
                <el-button
                  v-show="node.childNodes.length == 0"
                  type="text"
                  @click="() => append(data)"
                >
                  添加
                </el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="slider-box">
          <ul>
            <li
              v-for="(item, index) in dataList"
              :key="item.id"
              :class="{ active: curTopic.docid === item.docid }"
              @click="handleClick(item)"
            >
              <span class="flex-1">{{ item.header }}</span>
              <span class="flex-2" @click="handleEdit(item)">{{
                item.title
              }}</span>
              <i class="el-icon-delete remove-btn" @click="remove(index)" />
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
    <literatrueDialog
      :id="id"
      :title="title"
      :openDialog="openDialog"
      @close="close"
      @childId="childId"
    ></literatrueDialog>
  </div>
</template>

<script>
import {
  referenceTree,
  getReference,
  updateReference,
} from "@/api/knowledge/disease";
import literatrueDialog from "./literatrueDialog";
export default {
  name: "TreeBox",
  components: {
    literatrueDialog,
  },
  props: {
    // sendParams:Object,
    sendParams: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      treeList: [],
      defaultProps: {
        label: "title",
        children: "child",
      },
      filterText: "",
      curTopic: {},
      dataList: [],
      objProperty: {},
      openDialog: false,
      title: "",
      params: {},
      id: "",
    };
  },
  watch: {
    sendParams: {
      handler(newVal) {
        if (!newVal) return true;
        this.params = newVal;
        this.referenceTree(newVal);
        this.getReference(newVal);
      },
      deep: true,
      immediate: true,
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {},
  methods: {
    // 树数据
    async referenceTree(paramsObj) {
      let obj = {
        search: "",
        source: "",
      };
      const res = await referenceTree(obj);
      this.treeList = res.result.schema;
    },
    //与其他属性关联列表
    getReference(paramsObj) {
      let obj = {
        vid: paramsObj.vid,
        pkey: paramsObj.pkey,
      };
      getReference(paramsObj).then((res) => {
        this.objProperty = res.result;
        this.dataList = Object.assign(this.objProperty.references);
      });
    },
    // 过滤树节点
    filterNode(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    },
    // 选中的当前树节点信息
    // selectNode(val) {
    //   const isHasId = this.dataList.some(item => item.docid === val.docid)
    //   if(!isHasId){
    //     this.dataList.push(val)
    //     this.$message.success('添加成功')
    //   }else{
    //     this.$message.error('不能重复添加')
    //   }
    // },
    append(val) {
      const isHasId = this.dataList.some((item) => item.docid === val.docid);
      if (!isHasId) {
        this.dataList.push(val);
        this.$message.success("添加成功");
      } else {
        this.$message.error("不能重复添加");
      }
    },
    //移除症状
    remove(index) {
      // if (this.dataList.length <= 1) return
      this.dataList.splice(index, 1);
      this.$message.success("移除成功");
    },
    //选中症状
    handleClick(item) {
      this.curTopic = item;
    },
    //新建文献
    handleCreate() {
      this.openDialog = true;
      this.title = "create";
    },
    //编辑文献
    handleEdit(item) {
      this.openDialog = true;
      this.title = "edit";
      this.id = item.docid;
    },
    close(val) {
      this.openDialog = val;
      this.referenceTree();
      // this.getReference(this.params);
    },
    childId(val) {
      this.id = val;
    },
    //保存
    saveDate() {
      updateReference(this.objProperty).then((res) => {
        if (res.status == 200) {
          this.closeDialog();
          this.$message.success("保存成功");
        }
      });
    },
    //关闭弹窗
    closeDialog() {
      this.params.dialogVisible = false;
      this.filterText = "";
      this.$emit("closeDialog", this.params);
    },
  },
};
</script>
<style lang="scss" scoped>
.tree-box {
  height: 400px;
}
.right-box {
  width: 100%;
  height: 400px;
  overflow-y: scroll;
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
</style>
