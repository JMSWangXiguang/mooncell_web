<template>
  <div>
    <el-form inline>
      <el-form-item>
        <el-input
          v-model="listQuery.search"
          class="filter-item input_search"
          placeholder="请输入文献名称"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search">
          查询
        </el-button>
      </el-form-item>
    </el-form>
    <p-table
      v-loading="loading"
      :row-class-name="
        ({ row }) =>
          row.status === 'ban' || row.status === 'abandon'
            ? 'text-[#f5222d]'
            : ''
      "
      :data="list"
      :columns="[
        {
          label: '文献名称',
          prop: 'title',
        },
        {
          label: '创建时间',
          prop: 'create_time',
        },
        {
          label: '版次',
          prop: 'edition',
        },
        {
          label: '状态',
          prop: 'status',
        },
        {
          label: '流程状态',
          prop: 'progress_status',
        },
        {
          label: '开始时间',
          prop: 'begin_time',
          width: 110,
        },
        {
          label: '结束时间',
          prop: 'end_time',
          width: 110,
        },
        {
          label: '操作',
          prop: 'action',
        },
      ]"
      height="calc(100vh - 200px)"
      border
      highlight-current-row
      class="w-full overflow-y-auto"
    >
      <template #status="{ row }">
        <span v-show="row.status === 'access'">启用</span>
        <span v-show="row.status === 'ban'">停用</span>
        <span v-show="row.status === 'abandon'">废弃</span>
        <span v-show="row.status === 'devel'">开发中</span>
      </template>
      <template #action="{ row }">
        <el-button-group>
          <el-button
            v-if="row.task_status >= 0 && row.task_type === 1"
            type="text"
            class="mr-20px"
            @click="content(row)"
          >
            校验
          </el-button>
          <el-button
            v-if="row.task_status >= 0 && row.task_type === 2"
            type="text"
            @click="audit(row)"
          >
            审核
          </el-button>
        </el-button-group>
      </template>
    </p-table>
    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />
  </div>
</template>
<script>
import { getMyTaskList } from "@/api/literature/automaticEntry";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
export default {
  components: {
    Pagination,
  },
  data() {
    return {
      loading: false,
      listQuery: {
        page: 1,
        size: 20,
        search: "",
      },
      percentage: 20,
      customColor: "#409eff",
      list: [],
      total: 0,
      params: {
        type: "",
        page: 1,
        size: 20,
      },
      // organizationals: [
      //   { id: "1", name: "人卫教材" },
      //   { id: "2", name: "中华医学会诊疗指南" },
      //   { id: "3", name: "吴阶平泌尿外科科学" },
      // ],
      statuList: [
        { id: "access", value: "启用" },
        { id: "ban", value: "停用" },
        { id: "abandon", value: "废弃" },
        { id: "devel", value: "开发中" },
      ],
    };
  },
  created() {
    this.search();
  },
  methods: {
    // 查询搜索
    search() {
      this.listQuery.page = 1;
      this.getList();
    },
    //列表
    getList() {
      this.loading = true;
      getMyTaskList(this.listQuery)
        .then((res) => {
          this.list = res.result.bibliographies;
          this.total = res.result.total;
        })
        .finally(() => (this.loading = false));
    },
    //跳转到流程
    process(item) {
      let obj = {};
      obj.bid = item;
      this.$router.push({
        path: "/literatureTask/process",
        query: obj,
      });
    },
    //跳转到任务
    task(item) {
      let bidObj = {
        bid: item.bid,
      };
      this.$router.push({ path: "/literatureTask/content", query: bidObj });
    },
    //跳转到内容
    content(item) {
      let bidObj = {
        bid: item.bid,
        task_id: item.task_id,
        task_type: 1,
        range_from: item.range_from,
        range_to: item.range_to,
        editorType: 2,
      };
      this.$router.push({ path: "/myTask/info", query: bidObj });
    },
    audit(item) {
      let bidObj = {
        bid: item.bid,
        task_id: item.task_id,
        task_type: 2,
        range_from: item.range_from,
        range_to: item.range_to,
      };
      this.$router.push({ path: "/myTask/checkInfo", query: bidObj });
    },
  },
};
</script>
