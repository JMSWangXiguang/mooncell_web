<!--
 * @Descripttion:
 * @version:
 * @Author: 唐红娟
 * @Date: 2021-08-05
 * @LastEditors: 陈逸
 * @LastEditTime: 2022-04-06 14:43:38
-->
<template>
  <div style="height: 95%">
    <el-row style="height: 40px">
      <el-col :span="18">
        <el-input
          v-model="listQuery.search"
          class="filter-item"
          placeholder="请输入任意关键字搜索"
          style="width: 180px; margin-right: 10px"
          prefix-icon="el-icon-search"
        />
        <el-select
          v-model="listQuery.category"
          class="filter-item"
          style="width: 180px; margin-right: 10px"
          clearable
          placeholder="语料分类"
        >
          <el-option
            v-for="item in categorys"
            :key="item.cate_id"
            :label="item.title"
            :value="item.cate_id"
          />
        </el-select>
        <el-button type="primary" icon="el-icon-search">查询</el-button>
      </el-col>
      <el-col :span="6" class="right-box" style="float: right">
        <div class="search-box">
          <div class="btn-box">
            <el-button type="primary" @click="handleCreate">新增</el-button>
            <el-button type="primary" @click="deleteData">作废</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      highlight-current-row
      style="width: 100%; height: 93%; overflow-y: auto"
      @selection-change="handleSelectionChange"
      :row-style="{height:'20px'}"
      :cell-style="{padding:'3px'}"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="标题" prop="title"> </el-table-column>
      <el-table-column label="分类" prop="category"> </el-table-column>
      <el-table-column label="来源" prop="source"> </el-table-column>
      <el-table-column label="版次" prop="name"> </el-table-column>
      <el-table-column label="文档简介" prop="content"> </el-table-column>
      <el-table-column label="更新时间" prop="update_time"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" @click="handleEdit(scope.row)"
              >修改</el-button
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
      :title="`${dialogModel == 'create' ? '新增' : '修改'}`"
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
            label="标题"
            prop="title"
            :rules="{
              required: true,
              message: '请输入标题',
              trigger: 'change',
            }"
          >
            <el-input v-model="temp.title" />
          </el-form-item>
          <el-form-item
            label="显示"
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
          <el-form-item
            label="分类"
            prop="category"
            :rules="{
              required: true,
              message: '请选择分类',
              trigger: 'change',
            }"
          >
            <el-select v-model="temp.category" placeholder="请选择" w="full">
              <el-option
                v-for="item in categorys"
                :key="item.cate_id"
                :label="item.title"
                :value="item.cate_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="来源" prop="source">
            <el-select
              v-model="temp.source"
              w="full"
              value-key="id"
              placeholder="请选择"
              filterable
            >
              <el-option
                v-for="item in sources"
                :key="item.sid"
                :label="item.title"
                :value="item.sid"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="flex-box">
          <el-form-item
            label="key"
            prop="key"
            :rules="{
              required: true,
              message: '请输入key',
              trigger: 'change',
            }"
          >
            <el-input v-model="temp.key" />
          </el-form-item>
          <el-form-item label="格式" prop="format">
            <el-radio-group v-model="temp.format">
              <el-radio label="txt">TXT</el-radio>
              <el-radio label="html">HTML</el-radio>
              <el-radio label="xml">XML</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <el-form-item
          label="文档简介"
          prop="content"
          :rules="{
            required: true,
            message: '请输入文本',
            trigger: 'change',
          }"
        >
          <el-input v-model="temp.content" type="textarea" :rows="8" />
        </el-form-item>
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
          title: "医学影像学",
          header: "",
          // key: "12",
          category: "医学",
          source: "人卫教材",
          format: "html",
          content:
            "是研究借助于某种介质（如X射线、电磁场、超声波等）与人体相互作用，把人体内部组织器官结构、密度以影像方式表现出来，供诊断医师根据影像提供的信息进行判断，从而对人体健康状况进行评价的一门科学",
          name: "第9版",
          update_time: "2021-10-23",
        },
        {
          title: "诊断学",
          header: "",
          // key: "12",
          category: "医学",
          source: "人卫教材",
          format: "html",
          content:
            "诊断学是运用医学基本理论、基本知识和基本技能对疾病进行诊断的一门学科",
          name: "第9版",
          update_time: "2021-10-23",
        },
        {
          title: "病理学",
          header: "",
          // key: "12",
          category: "医学",
          source: "人卫教材",
          format: "html",
          content:
            "病理学是研究人体疾病发生的原因、发生机制、发展规律以及疾病过程中机体的形态结构、功能代谢变化和病变转归的一门基础医学科学",
          name: "第9版",
          update_time: "2021-10-24",
        },
        {
          title: "传染病学分册",
          header: "",
          // key: "12",
          category: "医学",
          source: "中华医学会诊疗指南",
          format: "html",
          content:
            "传染病是中国常见病、多发病，可迅速传播、流行。解放前，霍乱、鼠疫、天花等烈性传染病流行猖獗。",
          name: "第1版",
          update_time: "2021-10-24",
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
      this.dialogModel = "create";
      this.dialogFormVisible = true;
    },
    // 修改
    handleEdit(item) {
      this.temp = item;
      this.dialogModel = "edit";
      this.dialogFormVisible = true;
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
        this.$message.error("请选择要作废的数据");
      } else {
        this.$confirm("确定作废数据吗?", "提示", {
          confirmButtonText: "确定作废",
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
