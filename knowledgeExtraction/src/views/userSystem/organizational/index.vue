<!--
 * @Descripttion:
 * @version:
 * @Author: 唐红娟
 * @Date: 2021-08-05
 * @LastEditors: 陈逸
 * @LastEditTime: 2022-04-06 14:50:20
-->
<template>
  <div class="app-container">
    <el-row>
      <el-col :span="18" style="margin-bottom: 10px">
        <el-input
          v-model="listQuery.search"
          class="filter-item"
          placeholder="请输入任意关键字搜索"
          style="width: 180px; margin-right: 10px"
          prefix-icon="el-icon-search"
        />
        <el-button type="primary" icon="el-icon-search" @click="search"
          >查询</el-button
        >
      </el-col>
      <el-col :span="6" class="right-box" style="float: right">
        <div class="search-box">
          <div class="btn-box">
            <!-- <el-button type="primary" @click="handleCreate">注册</el-button> -->
            <!-- <el-button type="primary" @click="deleteData">删除</el-button> -->
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- </div> -->
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      highlight-current-row
      w="full"
      @selection-change="handleSelectionChange"
      :row-style="{height:'20px'}"
      :cell-style="{padding:'3px'}"
    >
      <el-table-column label="机构" prop="name"> </el-table-column>
      <el-table-column label="代码" prop="account"> </el-table-column>
      <el-table-column label="类型" prop="organizational"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="text" @click="handleEdit(scope.row)"
              >修改</el-button
            >
            <el-button
              type="text"
              style="margin-left: 10px"
              @click="examine(scope.row)"
              >密钥</el-button
            >
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
    />
    <el-dialog
      title="修改"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="right"
        label-width="100px"
      >
        <el-form-item
          label="机构"
          prop="name"
          :rules="{
            required: true,
            message: '请输入机构名称',
            trigger: 'change',
          }"
        >
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item
          label="机构代码"
          prop="account"
          :rules="{
            required: true,
            message: '请输入机构代码',
            trigger: 'change',
          }"
        >
          <el-input v-model="temp.account" />
        </el-form-item>
        <el-form-item label="所属地区" prop="tell">
          <el-input v-model="temp.tell" />
        </el-form-item>
        <el-form-item label="类型" prop="email">
          <el-select
            v-model="temp.organizational"
            placeholder="请选择类型"
            w="full"
          >
            <el-option
              v-for="item in organizationals"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="dialogFormVisible = false">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="秘钥"
      :visible.sync="show"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="right"
        label-width="100px"
      >
        <el-form-item
          label="秘钥"
          prop="key"
          :rules="{
            required: true,
            message: '请输入秘钥',
            trigger: 'change',
          }"
        >
          <el-input v-model="temp.key" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="show = false" style="float: left"
          >重新生成</el-button
        >
        <el-button @click="show = false"> 取消 </el-button>
        <el-button type="primary" @click="show = false"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
export default {
  name: "Literature",
  components: {
    Pagination,
  },
  data() {
    return {
      list: [
        {
          name: "无锡市人民医院",
          account: "CN0095",
          organizational: "公立医院",
          key: "3edffrrcdss",
        },
        {
          name: "江南大学附属医院",
          account: "CN0095",
          organizational: "公立医院",
        },
        {
          name: "无锡市第九中医院",
          account: "CN0095",
          organizational: "公立医院",
        },
        {
          name: "无锡市儿童医院",
          account: "CN0095",
          organizational: "公立医院",
        },
      ],
      organizationals: [
        { id: "1", name: "公立医院" },
        { id: "2", name: "私立医院" },
      ],
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        size: 20,
        search: "",
        sid: "",
        category: "",
      },
      temp: {
        name: "",
        account: "",
        organizational: "",
        key: "",
      },
      dialogFormVisible: false,
      dialogModel: "", // create、edit
      checkList: [],
      sources: [],
      categorys: [], //分类数组
      spenTime: [],
      show: false,
    };
  },
  created() {
    // this.getCategory();
    // this.getSource();
    // this.getData();
  },
  methods: {
    parseTime,
    // 查询搜索
    search() {
      this.listQuery.page = 1;
      // this.getData();
    },
    // 初始化表单
    resetTemp() {
      this.temp = {
        docid: "",
        title: "",
        header: "",
        key: "",
        category: "",
        source: "",
        format: "",
        content: "",
      };
    },
    // 修改
    handleEdit(item) {
      this.temp = item;
      //   this.dialogModel = "edit";
      this.dialogFormVisible = true;
      //   this.$nextTick(() => {
      //     this.$refs["dataForm"].clearValidate();
      //   });
    },
    examine() {
      this.show = true;
    },
    // 列表选择改变
    handleSelectionChange(val) {
      this.checkList = val.map((item) => {
        return item.docid;
      });
    },
    // 删除
    deleteData() {
      if (this.checkList.length === 0) {
        this.$message.error("请选择要删除的数据");
      } else {
        this.$confirm("确定删除数据吗?", "提示", {
          confirmButtonText: "确定删除",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            // Delete({
            //   docid: this.checkList,
            // }).then(() => {
            //   this.$message.success("删除成功");
            //   this.getData();
            // });
          })
          .catch(() => {});
      }
    },
  },
};
</script>
