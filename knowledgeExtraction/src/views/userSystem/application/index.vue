<!--
 * @Descripttion:
 * @version:
 * @Author: 唐红娟
 * @Date: 2021-08-05
 * @LastEditors: 陈逸
 * @LastEditTime: 2022-04-06 14:50:08
-->
<template>
  <div class="app-container">
    <el-row>
      <el-col :span="18">
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
    <el-table :data="list" border highlight-current-row w="full" :row-style="{height:'20px'}" :cell-style="{padding:'3px'}">
      <el-table-column label="姓名" prop="name"> </el-table-column>
      <el-table-column label="账号" prop="account"> </el-table-column>
      <el-table-column label="机构" prop="organizational"> </el-table-column>
      <!-- <el-table-column label="邮箱" prop="email"> </el-table-column>
      <el-table-column label="电话" prop="tell" width="100"> </el-table-column> -->
      <el-table-column label="账号状态" prop="state" width="120">
        <template slot-scope="scope">
          <span
            :style="{ color: scope.row.state == '审核中' ? 'red' : 'green' }"
            >{{ scope.row.state }}</span
          >
        </template>
      </el-table-column>
      <el-table-column label="用户身份" prop="identity"> </el-table-column>
      <el-table-column label="注册时间" prop="registration_time">
      </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button-group>
            <el-button type="text" style="margin-right: 20px">批准</el-button>
            <el-button type="text">拒绝</el-button>
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
      :title="`${dialogModel == 'create' ? '注册' : '修改'}`"
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
        <div class="flex-box">
          <el-form-item
            label="姓名"
            prop="name"
            :rules="{
              required: true,
              message: '请输入姓名',
              trigger: 'change',
            }"
          >
            <el-input v-model="temp.name" />
          </el-form-item>
          <el-form-item
            label="账号"
            prop="account"
            :rules="{
              required: true,
              message: '请输入账号',
              trigger: 'change',
            }"
          >
            <el-input v-model="temp.account" />
          </el-form-item>
        </div>
        <div class="flex-box">
          <el-form-item label="电话" prop="tell">
            <el-input v-model="temp.tell" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="temp.email" />
          </el-form-item>
        </div>
        <div class="flex-box">
          <el-form-item
            label="机构"
            prop="organizational"
            :rules="{
              required: true,
              message: '请选择机构',
              trigger: 'change',
            }"
          >
            <el-select
              v-model="temp.organizational"
              placeholder="请选择"
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
          <el-form-item label="机构秘钥" prop="key">
            <el-input v-model="temp.key" />
          </el-form-item>
        </div>
        <div class="flex-box">
          <el-form-item label="学位" prop="education">
            <el-input v-model="temp.education" />
          </el-form-item>
          <el-form-item>
            <!-- <el-input v-model="temp.key" /> -->
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="dialogFormVisible = false">
          确定
        </el-button>
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
          name: "赵焱德",
          account: "2291",
          organizational: "无锡第二人民医院",
          email: "12455566@qq.com",
          state: "审核中",
          identity: "消化科医生",
          tell: "1289433322",
          registration_time: "2021-10-22 10:21:23",
          time: "2021-10-22 10:21:23",
          day: "23",
        },
        {
          name: "王军",
          account: "2281",
          organizational: "无锡第二人民医院",
          email: "12455566@qq.com",
          state: "审核中",
          identity: "消化科医生",
          tell: "1289433322",
          registration_time: "2021-10-22 10:21:23",
          time: "2021-10-22 10:21:23",
          day: "23",
        },
        {
          name: "王宏图",
          account: "2281",
          organizational: "无锡第二人民医院",
          email: "12455566@qq.com",
          state: "审核中",
          identity: "消化科医生",
          tell: "1289433322",
          registration_time: "2021-10-22 10:21:23",
          time: "2021-10-22 10:21:23",
          day: "23",
        },
        {
          name: "唐磊",
          account: "2292",
          organizational: "无锡市第二人民医院",
          email: "12455566@qq.com",
          state: "审核中",
          identity: "泌尿科医生",
          tell: "1289433322",
          registration_time: "2021-10-22 10:21:23",
          time: "2021-10-22 10:21:23",
          day: "23",
        },
        {
          name: "李博玉",
          account: "2292",
          organizational: "无锡市第二人民医院",
          email: "12455566@qq.com",
          state: "审核中",
          identity: "儿科医生",
          tell: "1289433322",
          registration_time: "2021-10-22 10:21:23",
          time: "2021-10-22 10:21:23",
          day: "23",
        },
        {
          name: "沈彤",
          account: "2292",
          organizational: "无锡市第二人民医院",
          email: "12455566@qq.com",
          state: "审核中",
          identity: "儿科医生",
          tell: "1289433322",
          registration_time: "2021-10-22 10:21:23",
          time: "2021-10-22 10:21:23",
          day: "23",
        },
        {
          name: "姚子栋",
          account: "2292",
          organizational: "无锡市第二人民医院",
          email: "12455566@qq.com",
          state: "审核中",
          identity: "儿科医生",
          tell: "1289433322",
          registration_time: "2021-10-22 10:21:23",
          time: "2021-10-22 10:21:23",
          day: "23",
        },
        {
          name: "宋军民",
          account: "2292",
          organizational: "无锡市第二人民医院",
          email: "12455566@qq.com",
          state: "审核中",
          identity: "泌尿科医生",
          tell: "1289433322",
          registration_time: "2021-10-22 10:21:23",
          time: "2021-10-22 10:21:23",
          day: "23",
        },
      ],
      organizationals: [
        { id: "1", name: "国务院" },
        { id: "2", name: "政委" },
        { id: "3", name: "医院" },
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
        email: "",
        state: "",
        identity: "",
        registration_time: "",
        key: "",
        position: "",
      },
      dialogFormVisible: false,
      dialogModel: "", // create、edit
      checkList: [],
      sources: [],
      categorys: [], //分类数组
      spenTime: [],
    };
  },
  created() {},
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
    // 新增
    handleCreate() {
      this.resetTemp();
      this.dialogModel = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 修改
    handleEdit(item) {
      this.temp = item;
      this.dialogModel = "edit";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
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
          .then(() => {})
          .catch(() => {});
      }
    },
  },
};
</script>
