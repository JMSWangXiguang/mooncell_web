<!--
 * @Author: your name
 * @Date: 2022-01-13 14:53:53
 * @LastEditTime: 2022-04-06 14:49:59
 * @LastEditors: 陈逸
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \knowledgeExtraction\src\views\operate\task\index.vue
-->
<template>
  <div style="height: 95%">
    <el-row style="height: 40px">
      <el-col :span="18" style="margin-bottom: 10px">
        <el-input
          v-model="listQuery.search"
          class="filter-item"
          placeholder="请输入任意关键字搜索"
          style="width: 180px; margin-right: 10px"
          prefix-icon="el-icon-search"
        />
        <el-button type="primary" icon="el-icon-search">查询</el-button>
      </el-col>
      <el-col :span="6" class="right-box" style="float: right"> </el-col>
    </el-row>
    <el-table
      :data="list"
      border
      highlight-current-row
      style="width: 100%; max-height: 93%; overflow-y: auto"
      :row-style="{height:'20px'}"
      :cell-style="{padding:'3px'}"
    >
      <el-table-column label="任务类型" prop="type"> </el-table-column>
      <el-table-column label="任务名称" prop="title"> </el-table-column>
      <el-table-column label="优先级" prop="priority"> </el-table-column>
      <el-table-column label="开始时间" prop="start_time"> </el-table-column>
      <!-- <el-table-column label="阶段进度" prop="progress"> </el-table-column>
      <el-table-column label="参与人" prop="people"> </el-table-column> -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="info(scope.row)"
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="gopendingList"
    />
  </div>
</template>
<script>
import { pendingList } from "@/api/literature/automaticEntry";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
export default {
  components: {
    Pagination,
  },
  data() {
    return {
      listQuery: {
        page: 1,
        size: 20,
        search: "",
      },
      total: 0,
      list: [],
    };
  },
  created() {
    this.search();
  },
  methods: {
    search() {
      this.listQuery.page = 1;
      this.gopendingList();
    },
    //获取待处理任务列表
    gopendingList() {
      pendingList(this.listQuery).then((res) => {
        this.list = res.result.tasks;
        this.total = res.result.total;
      });
    },
    //跳转
    info(item) {
      let bidObj = item.trail;
      this.$router.push({ path: "/myTask/info", query: bidObj });
    },
  },
};
</script>
