<!--
 * @Author: sty
 * @Date: 2022-01-18 14:16:48
 * @LastEditTime: 2022-04-11 17:44:59
 * @LastEditors: 陈逸
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \knowledgeExtraction\src\views\operate\apply\index.vue
-->
<template>
  <div>
    <el-form inline>
      <el-form-item label="时间范围">
        <el-date-picker
          w="260px"
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item label="申请事件">
        <el-select w="120px" v-model="listQuery.event_id">
          <template v-for="v in events">
            <el-option :key="v.id" :value="v.id" :label="v.name"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="审批状态">
        <el-select v-model="listQuery.status" w="120px">
          <template v-for="v in states">
            <el-option :key="v.id" :value="v.id" :label="v.name"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search">
          查询
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="list"
      border
      highlight-current-row
      height="calc(100vh - 200px)"
      :row-style="{height:'20px'}"
      :cell-style="{padding:'3px'}"
    >
      <el-table-column
        label="提交时间"
        sortable
        prop="create_time"
        width="200px"
      >
      </el-table-column>
      <el-table-column label="提交人" prop="applicant.name"> </el-table-column>
      <el-table-column label="申请事件" prop="event_name[1]" width="180px">
      </el-table-column>
      <el-table-column label="相关信息" prop="message"> </el-table-column>
      <el-table-column label="申请原因" prop="last_remark"> </el-table-column>
      <el-table-column
        label="开始时间"
        prop="begin_time"
        width="110px"
      ></el-table-column>
      <el-table-column
        label="结束时间"
        prop="end_time"
        width="110px"
      ></el-table-column>
      <el-table-column label="审批状态" width="120px">
        <template slot-scope="scope">
          {{ statusTransfer(scope.row.status) }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="阶段进度" prop="progress"> </el-table-column>
      <el-table-column label="参与人" prop="people"> </el-table-column> -->
      <el-table-column label="操作" width="100px">
        <template #default="{ row }">
          <el-button type="text" @click="info(row)">查看详情</el-button>
          <!-- <el-button
            type="text"
            @click="group(row)"
            >指派</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />
    <!-- 一些弹窗 -->
    <el-dialog
      :visible.sync="popup1"
      :close-on-click-modal="false"
      :custom-class="
        activeRow.event_id === 'create_literature' ||
        activeRow.event_id === 'create_user'
          ? 'min-w-1000px'
          : 'w-500px'
      "
    >
      <template slot="title">
        <div style="font-size: 16px; padding-bottom: 10px">申请详情</div>
      </template>
      <approve-info
        v-if="activeRow.apply_id === approveModel.apply_id"
        v-model="approveModel"
        :showApprove="activeRow.status !== 4"
      />
    </el-dialog>

    <el-dialog
      :visible.sync="popup3"
      :close-on-click-modal="false"
      width="400px"
    >
      <template slot="title">
        <div
          style="
            font-size: 16px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
          "
        >
          指派任务
        </div>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doApprove">确 定</el-button>
        <el-button @click="popup3 = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getApproveList,
  getExpertList,
  getApproveInfo,
  createVote,
} from "@/api/operate/apply";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import ApproveInfo from "./approve-info.vue";
export default {
  components: {
    Pagination,
    ApproveInfo,
  },
  data() {
    return {
      listQuery: {
        start_time: "",
        end_time: "",
        event_id: "",
        status: "",
        page: 1,
        size: 20,
        search: "",
      },
      events: [
        { id: "", name: "全部" },
        { id: "create_user", name: "用户申请" },
        { id: "create_literature", name: "创建文献" },
        { id: "upload_file", name: "上传文件" },
      ],
      states: [
        { id: "", name: "全部" },
        { id: 1, name: "待审核" },
        { id: 2, name: "已驳回" },
        { id: 3, name: "拒绝" },
        { id: 4, name: "通过" },
        { id: 0, name: "废弃" },
      ],
      total: 0,
      list: [
        // {
        //   event: ['1', '创建文献'],
        //   message: '部署文档',
        //   remark: "{\'remark\':\'想申请一个\'}",
        //   create_time: '2022-01-09'
        // }
      ],
      popup1: false,
      popup3: false,
      activeRow: {},
      approveModel: {},
    };
  },
  computed: {
    date: {
      get() {
        return [this.listQuery.start_time, this.listQuery.end_time];
      },
      set(v) {
        this.listQuery.start_time = v ? v[0] : "";
        this.listQuery.end_time = v ? v[1] : "";
      },
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    search() {
      this.listQuery.page = 1;
      this.getList();
    },
    //获取待处理任务列表
    getList() {
      getApproveList(this.listQuery).then((res) => {
        this.list = res.result.apply_list;
        this.total = res.result.total;
      });
    },
    //跳转
    async info(item) {
      this.activeRow = item;
      const { result, msg } = await getApproveInfo({ apply_id: item.apply_id });
      if (result) {
        this.approveModel = result;
        this.popup1 = true;
      } else {
        this.$message.error(msg);
      }
    },
    showInfo() {},
    group(item) {
      this.activeRow = item;
      this.popup3 = true;
    },

    gogroup() {
      getExpertList().then((res) => {
        console.log("res: ", res);
      });
    },

    async doApprove() {
      const { referModel, userModel, groupModel } = this.$refs.approveRefer;
      const { apply_id } = this.activeRow;
      let params = {
        apply_id,
        voter_type: referModel,
      };
      if (referModel === 1) {
        params = {
          ...params,
          voter: userModel.userid,
          begin_time: userModel.date[0],
          end_time: userModel.date[1],
        };
      }
      if (referModel === 2) {
        params = {
          ...params,
          ...groupModel,
          voter: groupModel.teamid,
          begin_time: groupModel.date[0],
          end_time: groupModel.date[1],
        };
      }
      try {
        const { status, msg } = await createVote(params);
        if (status === 200) {
          this.$message.success("指派成功");
        } else {
          this.$message.error(`指派失败，${msg}`);
        }
      } catch (error) {
        console.error(error);
      }
    },
    // 审核状态转换
    statusTransfer(v) {
      // if(v == 'reject'){return '拒绝'}
      // if(v == 'wait'){return '待审批'}
      // if(v == 'approving'){return '审批中'}
      // if(v == 'access'){return '已通过'}
      // if(v == 'recall'){return 'any'}
      if (v == 1) {
        return "待审核";
      }
      if (v == 2) {
        return "已驳回";
      }
      if (v == 3) {
        return "拒绝";
      }
      if (v == 4) {
        return "通过";
      }
      if (v == 0) {
        return "废弃";
      }
    },
  },
};
</script>

<style scoped>
.toplist span {
  font-size: 14px;
  margin-left: 20px;
  color: #666;
}

.popbox {
  margin: -20px 20px;
}
.popbox .pb_processbox {
  margin: 20px 0 20px 60px;
  max-height: 300px;
  overflow-y: scroll;
  padding: 0 10px;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  color: #666;
}
.popbox .pb_processbox p {
  font-size: 14px;
  margin-bottom: 15px;
}
.popbox .pb_label {
  color: #666;
  width: 50px;
  margin-right: 10px;
  display: inline-block;
  text-align: right;
}
.popbox2 .pb_processbox {
  margin: 0 20px 20px;
  padding: 10px;
}
.pb_processbox .el-form-item--small.el-form-item {
  margin-bottom: 10px;
}
</style>
