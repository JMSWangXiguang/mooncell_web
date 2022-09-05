<!--
 * @Descripttion:
 * @version:
 * @Author: 唐红娟
 * @Date: 2021-08-05
 * @LastEditors: 陈逸
 * @LastEditTime: 2022-04-06 14:42:51
-->
<template>
  <div class="app-container">
    <!-- <div class="filter-container"> -->
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
            <!-- <el-button type="primary">模板</el-button>
            <el-button type="primary">导入</el-button> -->
            <!-- <el-button type="primary" @click="handleCreate">新增</el-button>
            <el-button type="primary" @click="deleteData">删除</el-button> -->
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- </div> -->
    <el-table :data="list" border highlight-current-row w="full" :row-style="{height:'20px'}" :cell-style="{padding:'3px'}">
      <el-table-column label="知识库名称" prop="title">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布版本" prop="category">
        <template slot-scope="scope">
          <span>{{ scope.row.category }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用途">
        <template slot-scope="scope">
          <span>{{ scope.row.key }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" prop="category">
        <template slot-scope="scope">
          <span>{{ scope.row.category }}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用文献" prop="data">
        <template slot-scope="scope">
          <span>{{ scope.row.data }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="text" @click="handleEdit(scope.row)"
              >查看</el-button
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
      title="查看"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="80%"
    >
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="right"
        label-width="100px"
      >
        <div class="flex-box">
          <el-form-item
            label="知识库名称"
            prop="title"
            :rules="{
              required: true,
              message: '请输入知识库名称',
              trigger: 'change',
            }"
          >
            <el-input v-model="temp.title" />
          </el-form-item>
          <el-form-item
            label="发布版本"
            prop="header"
            :rules="{
              required: true,
              message: '请输入显示',
              trigger: 'change',
            }"
          >
            <el-input v-model="temp.header" />
          </el-form-item>
        </div>
        <div class="flex-box">
          <el-form-item label="上次修改时间 " prop="category">
            <el-input v-model="temp.category" />
          </el-form-item>
          <el-form-item label="用途" prop="key">
            <el-input v-model="temp.key" />
          </el-form-item>
        </div>
        <div class="flex-box">
          <el-form-item label="使用文献数量 " prop="data">
            <el-input v-model="temp.data" />
          </el-form-item>
          <el-form-item label="发布机构" prop="source">
            <el-input v-model="temp.source" />
          </el-form-item>
        </div>
      </el-form>
      <div class="dialog-footer" style="text-align: right; margin-bottom: 10px">
        <el-button @click="dialogFormVisible = false"> 保存信息 </el-button>
        <el-button type="primary" @click="dialogFormVisible = false">
          生成模板
        </el-button>
      </div>
      <div style="margin-bottom: 10px; position: relative">
        <div>
          <el-button style="margin-right: 10px">全选</el-button>
          <el-button>全不选</el-button>
        </div>
        <div style="position: absolute; right: 10px; top: 0">
          <el-input
            v-model="listQuery.search"
            class="filter-item"
            placeholder="请输入任意关键字搜索"
            style="width: 180px; margin-right: 10px"
            prefix-icon="el-icon-search"
          />
          <el-button icon="el-icon-search" @click="search">搜索</el-button>
        </div>
      </div>
      <el-table
        :data="list1"
        border
        highlight-current-row
        w="full"
        height="230px"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="文献名称" prop="name"> </el-table-column>
        <el-table-column label="从属" prop="account"> </el-table-column>
        <el-table-column label="版次" prop="organizational"> </el-table-column>
        <el-table-column
          label="创建时间"
          prop="registration_time"
        ></el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button-group>
              <el-button
                type="text"
                style="margin-right: 10px"
                @click="dialogFormVisible1 = true"
                >查看</el-button
              >
              <el-button type="text" style="margin-right: 10px">添加</el-button>
              <el-button type="text">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      title="查看"
      :visible.sync="dialogFormVisible1"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="5vh"
    >
      <el-form
        ref="dataForm"
        :model="temp1"
        label-position="right"
        label-width="100px"
      >
        <div class="flex-box">
          <el-form-item
            label="文献名称"
            prop="name"
            :rules="{
              required: true,
              message: '请输入文献名称',
              trigger: 'change',
            }"
          >
            <el-input v-model="temp1.name" />
          </el-form-item>
          <el-form-item
            label="从属"
            prop="account"
            :rules="{
              required: true,
              message: '请输入从属',
              trigger: 'change',
            }"
          >
            <el-select v-model="temp1.account" placeholder="请选择" w="full">
              <el-option
                v-for="item in organizationals"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="flex-box">
          <el-form-item label="发行时间" prop="organizational">
            <el-input v-model="temp1.registration_time" />
          </el-form-item>
          <el-form-item label="版次" prop="organizational">
            <el-input v-model="temp1.organizational" />
          </el-form-item>
        </div>
        <div class="flex-box">
          <el-form-item label="作者" prop="position">
            <el-input v-model="temp1.position" />
          </el-form-item>
          <el-form-item> </el-form-item>
        </div>
        <el-divider content-position="left"></el-divider>
        <div class="flex-box">
          <el-form-item label="状态" prop="state">
            <el-select
              v-model="temp1.state"
              class="filter-item"
              style="width: 180px; margin-right: 10px"
              clearable
              placeholder="请选择状态"
            >
              <el-option value="启用">启用</el-option>
              <el-option value="废弃">废弃</el-option>
              <el-option value="停止"> 停止</el-option>
              <el-option value="整理中">整理中</el-option>
            </el-select>
            <!-- <el-input v-model="temp.state" /> -->
          </el-form-item>
          <el-form-item label="创建时间" prop="registration_time">
            <span>{{ temp1.registration_time }}</span>
            <!-- <el-input v-model="temp.registration_time" disabled /> -->
          </el-form-item>
        </div>
        <div class="flex-box">
          <el-form-item label="创建用户" prop="position">
            <span>{{ temp1.position }}</span>
            <!-- <el-input v-model="temp.position" disabled /> -->
          </el-form-item>
          <el-form-item> </el-form-item>
        </div>
        <el-divider content-position="left"></el-divider>
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          multiple
          :limit="3"
        >
          <el-button type="primary">上传文件</el-button>
          <div slot="tip" class="el-upload__tip">
            <!-- 只能上传jpg/png文件，且不超过500kb -->
            <div>文件上传时间 2021-10-21 12:30:50</div>
            <div style="margin-top: 10px; margin-bottom: 10px">
              上传用户 张成译
            </div>
            <div>文件大小 12M</div>
          </div>
        </el-upload>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false"> 取消 </el-button>
        <el-button type="primary" @click="dialogFormVisible1 = false">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import {
//   getCategory,
//   getList,
//   getSource,
//   getInfo,
//   create,
//   update,
//   Delete,
// } from "@/api/knowledge/literature";
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
          title: "消化科内涵质控测试知识库",
          header: "v2021102501",
          key: "内涵质控",
          category: "2021-10-25",
          data: "5",
        },
        {
          title: "消化科内涵质控测试知识库",
          header: "v2021102505",
          key: "内涵质控",
          category: "2021-10-27",
          data: "7",
        },
        {
          title: "CDSS测试知识库",
          header: "v2021102505",
          key: "CDSS",
          category: "2021-10-25",
          data: "9",
        },
        {
          title: "消化科内涵质控测试知识库",
          header: "v2021102501",
          key: "内涵质控",
          category: "2021-10-25",
          data: "5",
        },
        {
          title: "内涵质控测试知识库",
          header: "v2021102001",
          key: "内涵质控",
          category: "2021-10-25",
          data: "10",
        },
      ],
      list1: [
        {
          name: "医学影像学",
          account: "人卫教材",
          organizational: "第9版",
          state: "启用",
          identity: "自动录入",
          registration_time: "2021-10-22",
        },
        {
          name: "诊断学",
          account: "人卫教材",
          organizational: "第9版",
          state: "启用",
          identity: "自动录入",
          registration_time: "2021-10-02",
        },
        {
          name: "病理学",
          account: "人卫教材",
          organizational: "第9版",
          state: "停止",
          identity: "自动录入",
          registration_time: "2021-10-22",
        },
        {
          name: "传染病学分册",
          account: "中华医学会诊疗指南",
          organizational: "第1版",
          state: "启用",
          identity: "自动录入",
          registration_time: "2021-10-22",
        },
        {
          name: "结核病分册",
          account: "中华医学会诊疗指南",
          organizational: "第1版",
          state: "废弃",
          identity: "人工录入",
          registration_time: "2021-10-22",
        },
        {
          name: "肾脏病学分册",
          account: "中华医学会诊疗指南",
          organizational: "第1版",
          state: "启用",
          identity: "人工录入",
          registration_time: "2021-10-22",
        },
        {
          name: "神经外科学分册",
          account: "中华医学会诊疗指南",
          organizational: "第1版",
          state: "启用",
          identity: "自动录入",
          registration_time: "2021-10-22",
        },
        {
          name: "皮肤病与性病分册",
          account: "中华医学会诊疗指南",
          organizational: "第1版",
          state: "整理中",
          identity: "自动录入",
          registration_time: "2021-10-14",
        },
        {
          name: "麻醉分册",
          account: "中华医学会诊疗指南",
          organizational: "第1版",
          state: "整理中",
          identity: "自动录入",
          registration_time: "2021-10-14",
        },
        {
          name: "口腔医学分册",
          account: "中华医学会诊疗指南",
          organizational: "第1版",
          state: "整理中",
          identity: "自动录入",
          registration_time: "2021-10-14",
        },
        {
          name: "吴阶平泌尿外科学（上卷）",
          account: "吴阶平泌尿外科学",
          organizational: "第1版",
          state: "停用",
          identity: "人工录入",
          registration_time: "2021-10-14",
        },
        {
          name: "吴阶平泌尿外科学（下卷）",
          account: "吴阶平泌尿外科学",
          organizational: "第1版",
          state: "停用",
          identity: "人工录入",
          registration_time: "2021-10-14",
        },
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
        title: "",
        header: "",
        key: "",
        category: "",
        source: "",
        format: "",
        content: "",
      },
      organizationals: [
        { id: "1", name: "人卫教材" },
        { id: "2", name: "中华医学会诊疗指南" },
        { id: "3", name: "吴阶平泌尿外科科学" },
      ],
      temp1: {
        name: "传染病学分册",
        account: "中华医学会诊疗指南",
        organizational: "第1版",
        email: "",
        state: "启用",
        identity: "",
        registration_time: "2021-10-23",
        key: "",
        position: "admin",
      },
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogModel: "", // create、edit
      checkList: [],
      sources: [],
      categorys: [], //分类数组
      spenTime: [],
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
    // 获取来源数据
    // getSource() {
    //   let params = {
    //     page: 1,
    //     size: 10,
    //   };
    //   getSource(params).then((res) => {
    //     this.sources = res.result.sources;
    //   });
    // },
    // 获取分类数据
    // getCategory() {
    //   getCategory({ sid: "" }).then((res) => {
    //     this.categorys = res.result.categories;
    //   });
    // },
    // 获取列表数据
    // getData() {
    //   this.listLoading = true;
    //   getList(this.listQuery).then((res) => {
    //     this.list = res.result.docs;
    //     this.total = res.result.total;
    //     this.listLoading = false;
    //   });
    // },
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
      // getInfo(item).then((res) => {
      //   this.temp = res.result;
      //   this.temp.source = res.result.source.title;
      // });
      this.temp = item;
      this.dialogModel = "edit";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 保存语料
    // saveData() {
    //   this.$refs["dataForm"].validate((valid) => {
    //     if (valid) {
    //       if (this.dialogModel === "create") {
    //         create(this.temp).then((res) => {
    //           this.$message.success("保存成功");
    //           this.dialogFormVisible = false;
    //           this.getData();
    //         });
    //       } else {
    //         update(this.temp).then((res) => {
    //           this.getSource();
    //           this.$message.success("保存成功");
    //           this.dialogFormVisible = false;
    //           this.getData();
    //         });
    //       }
    //     }
    //   });
    // },
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
    // // 来源字段模糊检索
    // querySearchSource(queryString, cb) {
    //   var sources = this.sources
    //   var results = (queryString
    //     ? sources.filter(item => item.title.indexOf(queryString) >= 0)
    //     : sources
    //   ).map(item => {
    //     return { value: item.title }
    //   })
    //   cb(results)
    // },
  },
};
</script>
