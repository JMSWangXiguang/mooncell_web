<!--
 * @Author: imali
 * @Date: 2021-12-28 13:30:08
 * @LastEditTime: 2022-04-06 14:50:25
 * @LastEditors: 陈逸
 * @Description:
-->
<template>
  <div style="padding: 20px">
    <el-row>
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
      <el-col :span="6" class="right-box" style="float: right">
        <!-- <div class="search-box">
          <div class="btn-box">
            <el-button type="primary" @click="handleCreate">修改</el-button>
          </div>
        </div> -->
      </el-col>
    </el-row>
    <el-table :data="trajectoryList" border highlight-current-row :row-style="{height:'20px'}" :cell-style="{padding:'3px'}">
      <el-table-column label="姓名" prop="name" width="100"> </el-table-column>
      <el-table-column label="事项" prop="event"> </el-table-column>
      <el-table-column label="时间" prop="time"> </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button-group>
            <el-button type="text" style="margin-right: 10px">详情</el-button>
            <!-- <el-button type="text">恢复</el-button> -->
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      listQuery: {
        page: 1,
        size: 20,
        search: "",
        sid: "",
        category: "",
      },
      trajectoryList: [
        {
          name: "张三",
          event: "赋予了某某某用户管理权限功能",
          time: "2021-10-23",
        },
        {
          name: "张三",
          event: "审核了某某某注册用户",
          time: "2021-10-23",
        },
      ],
    };
  },
};
</script>
