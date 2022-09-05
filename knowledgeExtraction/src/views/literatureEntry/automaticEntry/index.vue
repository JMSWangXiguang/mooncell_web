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
          label: '任务时限',
          prop: 'range_time',
        },
        {
          label: '操作',
          prop: 'action',
          width: 300
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
        <el-button
          v-if="row.task_status !== dict_task_status.提取中"
          type="text"
          @click="task(row)"
        >
          任务分配
        </el-button>
        <el-button
          v-if="row.task_status === dict_task_status.已完成"
          type="text"
          @click="finish(row)"
        >
          {{ row.task_type === 1 ? "校验完成" : "审核完成" }}
        </el-button>
        <el-button
          v-if="row.task_status === dict_task_status.已完成 && row.task_type !== 1"
          type="text"
          @click="reset(row)"
        >
          再次校验
        </el-button>
        <el-button
          v-if="row.task_status === dict_task_status.已完成 && row.task_type === 1"
          type="text"
          @click="recheck(row)"
        >
          再次校验
        </el-button>
        <el-button
          v-if="row.task_status === dict_task_status.已完成 && row.task_type !== 1"
          type="text"
          @click="reAudit(row)"
        >
          再次审核
        </el-button>
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
import { finishVision, getList, resetVision, reAuditVision, recheckVision } from "@/api/literature/automaticEntry";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
const dict_task_status = {
  提取中: -2,
  待分配: -1,
  未开始: 0,
  已完成: 1,
  已开始: 2,
};
export default {
  components: {
    Pagination,
  },
  setup() {
    return { dict_task_status };
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
      getList(this.listQuery)
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
      const { task_type } = item;
      let bidObj = {
        bid: item.bid,
      };
      this.$router.push({
        path: "/literatureTask/content",
        query: { ...bidObj, task_type },
      });
    },
    //跳转到内容
    content(item) {
      let bidObj = {
        bid: item.bid,
      };
      this.$router.push({ path: "/myTask/checkInfo", query: bidObj });
    },
    async finish(row) {
      try {
        const { status, msg } = await finishVision({
          bid: row.bid,
          task_type: row.task_type,
        });
        if (status === 200) {
          this.$message.success("操作成功");
          this.getList();
        } else {
          this.$message.success(`操作失败，${msg}`);
        }
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    },
    async reset(row) {
      try {
        const { status, msg } = await resetVision({
          bid: row.bid
        });
        if (status === 200) {
          this.$message.success("操作成功");
          this.getList();
        } else {
          this.$message.success(`操作失败，${msg}`);
        }
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    },
    async recheck(row) {
      try {
        const { status, msg } = await recheckVision({
          bid: row.bid
        });
        if (status === 200) {
          this.$message.success("操作成功");
          this.getList();
        } else {
          this.$message.success(`操作失败，${msg}`);
        }
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    },
    async reAudit(row) {
      try {
        const { status, msg } = await reAuditVision({
          bid: row.bid
        });
        if (status === 200) {
          this.$message.success("操作成功");
          this.getList();
        } else {
          this.$message.success(`操作失败，${msg}`);
        }
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
<style scoped>
.basic {
  width: 80%;
  height: 400px;
  padding: 20px;
  margin: 0 auto;
}
</style>
