<!--
 * @Author: sty
 * @Date: 2022-01-18 14:16:48
 * @LastEditTime: 2022-05-17 14:39:29
 * @LastEditors: 陈逸
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \knowledgeExtraction\src\views\operate\apply\index.vue
-->
<template>
  <div>
    <el-row type="flex">
      <el-col>
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
                <el-option
                  :key="v.id"
                  :value="v.id"
                  :label="v.name"
                ></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="审批状态">
            <el-select v-model="listQuery.status" w="120px">
              <template v-for="v in states">
                <el-option
                  :key="v.id"
                  :value="v.id"
                  :label="v.name"
                ></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search">
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col w="100px">
        <p-button-dialog
          ref="put-apply-dialog"
          destroy-on-close
          :button="{
            label: '提出申请',
            type: 'primary',
          }"
        >
          <apply-dialog ref="applyDialog" />
          <template #footer>
            <el-button type="primary" @click="submitApply">提交申请</el-button>
          </template>
        </p-button-dialog>
        <!-- <el-button type="primary" @click="handleCreateNew">文献申请</el-button> -->
      </el-col>
    </el-row>
    <el-table
      :data="list"
      border
      highlight-current-row
      height="calc(100vh - 200px)"
      ref="tableRef"
      :row-style="{height:'20px'}"
      :cell-style="{padding:'3px'}"
    >
      <el-table-column label="创建时间" sortable prop="create_time">
      </el-table-column>
      <el-table-column label="申请事件" prop="event_name" width="180px">
      </el-table-column>
      <el-table-column label="相关信息" prop="message"> </el-table-column>
      <el-table-column label="申请理由" prop="last_remark"> </el-table-column>
      <el-table-column label="审批人" prop="approve.name"> </el-table-column>
      <el-table-column label="审批状态" prop="status" width="120px">
      </el-table-column>
      <!-- <el-table-column label="阶段进度" prop="progress"> </el-table-column> -->
      <el-table-column label="操作" width="140px">
        <template #default="{ row }">
          <p-button-dialog
            destroy-on-close
            :button="{
              type: 'text',
              label: '查看详情',
            }"
            @open="info(row)"
            :custom-class="
              row.event_id === 'create_literature' ||
              row.event_id === 'create_user'
                ? 'min-w-1000px'
                : 'w-500px'
            "
            title="申请详情"
          >
            <approve-info v-if="viewModel&&(viewModel.apply_id===row.apply_id)" v-model="viewModel" />
          </p-button-dialog>
          <el-button type="text" style="margin-left:10px;" v-if="row.status === '待审批'" @click="editApply(row)">撤销</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />
  </div>
</template>
<script>
import {
  getMyApplyList,
  creatApply,
  createApplyBiblio,
  getApplyInfo,
  switchUser,
  revokeApply
} from "@/api/operate/apply";
import Pagination from "@/components/Pagination";
import ApproveInfo from "../approval/approve-info.vue";
import ApplyDialog from "./apply-dialog.vue";
import { find } from "lodash";
export default {
  components: {
    Pagination,
    ApproveInfo,
    ApplyDialog,
  },
  data() {
    return {
      applyForm: {
        remark: "",
        title: "",
        serial: "",
        author: "",
        editor: "",
        publish_time: "",
        page: "",
        language: "",
        reader_mode: "",
        edition: "",
        btype: "",
        publish_house: "",
        sn: "",
        volume: "",
        no: "",
      },
      dialogFormVisibleNew: false,
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
      list: [],
      viewType: "",
      viewModel: null,
    };
  },
  created() {
    // this.search();
  },
  mounted() {
    this.getList();
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
    bTypeList() {
      return this.$store.getters["dict/bTypeList"];
    },
    sexes() {
      return this.$store.getters["dict/sexList"];
    },
    jobtitles() {
      return this.$store.getters["dict/jobtitleList"];
    },
    educations() {
      return this.$store.getters["dict/educationList"];
    },
    organizations() {
      return this.$store.getters["dict/organList"];
    },
    departments() {
      return this.$store.getters["dict/departmentList"];
    },
  },
  methods: {
    handleCreateNew() {
      this.resetTempNew();
      this.dialogFormVisibleNew = true;
      // this.$nextTick(() => {
      //   this.$refs["dataForm"].clearValidate();
      // });
    },
    resetTempNew() {
      this.applyForm = {
        remark: "",
        title: "",
        serial: "",
        author: "",
        editor: "",
        publish_time: "",
        page: "",
        language: "",
        reader_mode: "",
        edition: "",
        btype: "",
        publish_house: "",
        sn: "",
        volume: "",
        no: "",
      };
    },
    search() {
      this.listQuery.page = 1;
      this.getList();
    },
    //获取待处理任务列表
    getList() {
      getMyApplyList(this.listQuery).then((res) => {
        // console.log(res)
        this.list = res.result.applies;
        this.total = res.result.total;
        this.$refs.tableRef.doLayout()
      });
    },
    //跳转
    async info({ apply_id }) {
      const { result } = await getApplyInfo({ apply_id });
      if (result) {
        if (
          result.event_id === "enable_user" ||
          result.event_id === "disable_user"
        ) {
          this.viewType = "user_status";
        } else {
          this.viewType = result.event_id;
        }
        try {
          this.viewModel = result;
        } catch (error) {
          console.error(error);
        }
      } else {
        this.$message.error(msg);
      }
    },
    async applyCreateUser() {
      const { active, createUserModel } = this.$refs.applyDialog;
      const {
        sex_id,
        identity_id,
        education_id,
        organization_id,
        department_id,
        job_title_id,
      } = createUserModel;
      const apply_body = {
        ...createUserModel,
        sex: {
          name: find(this.sexes, (l) => l.id === sex_id)?.title,
          id: sex_id,
        },
        jobtitle: {
          name: find(this.jobtitles, (l) => l.id === job_title_id)?.title,
          id: job_title_id,
        },
        identity: {
          id: identity_id,
          name: find(this.identifies, (l) => l.id === identity_id)?.title,
        },
        education: {
          id: education_id,
          name: find(this.educations, (l) => l.id === education_id)?.title,
        },
        organization: {
          id: organization_id,
          name: find(this.organizations, (l) => l.oid === organization_id)
            ?.name,
        },
        department: {
          id: department_id,
          name: find(this.departments, (l) => l.id === department_id),
        },
      };
      try {
        const { status, msg } = await creatApply({
          type: active,
          apply_body,
          apply_meta: {
            last_remark: createUserModel.apply,
          },
        });
        if (status === 200) {
          this.$message.success("提交成功");
          this.$refs["put-apply-dialog"].dialogVisible = false;
          this.search();
        } else {
          this.$message.error(`提交失败，${msg}`);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async applyCreateLiterature() {
      const { createLiteratureModel } = this.$refs.applyDialog;
      const { status, msg } = await createApplyBiblio({
        apply_body: createLiteratureModel,
        apply_meta: {
          last_remark: createLiteratureModel.remark,
        },
      });
      if (status === 200) {
        this.$message.success("提交成功");
        this.$refs["put-apply-dialog"].dialogVisible = false;
        this.search();
      } else {
        this.$message.error(`提交失败，${msg}`);
      }
    },
    async applyUpdateUserStatus() {
      const { userStatusModel } = this.$refs.applyDialog;
      const { status, msg } = await switchUser({
        apply_body: userStatusModel,
        apply_meta: {
          last_remark: userStatusModel.remark,
        },
        type: userStatusModel.status === 1 ? "enable_user" : "disable_user",
      });
      if (status === 200) {
        this.$message.success("提交成功");
        this.$refs["put-apply-dialog"].dialogVisible = false;
        this.search();
      } else {
        this.$message.error(`提交失败，${msg}`);
      }
    },
    async applyUpdateUserPermission() {
      const { userPermissionModel } = this.$refs.applyDialog;
      const { status, msg } = await switchUser({
        apply_body: userPermissionModel,
        apply_meta: {
          last_remark: userPermissionModel.remark,
        },
        type: "user_permission",
      });
      if (status === 200) {
        this.$message.success("提交成功");
        this.$refs["put-apply-dialog"].dialogVisible = false;
        this.search();
      } else {
        this.$message.error(`提交失败，${msg}`);
      }
    },
    async editApply(row) {
      const { status, msg }  =  await revokeApply({apply_id: row.apply_id})
      if (status === 200) {
        this.$message.success("撤销成功");
        this.search();
      } else {
        this.$message.error(`撤销失败，${msg}`);
      }
    },
    submitApply() {
      const { active, $refs } = this.$refs.applyDialog;
      switch (active) {
        case "create_user":
          $refs.createUserForm[0].$refs.form.$refs[
            "p-descriptions-form"
          ].validate((valid) => {
            if (valid) {
              this.applyCreateUser();
            }
          });
          break;
        case "user_status":
          $refs.userStatusForm[0].$refs.form.$refs[
            "p-descriptions-form"
          ].validate((valid) => {
            if (valid) {
              this.applyUpdateUserStatus();
            }
          });
          break;
        case "user_permission":
          $refs.userPermissionForm[0].$refs.form.$refs[
            "p-descriptions-form"
          ].validate((valid) => {
            if (valid) {
              this.applyUpdateUserPermission();
            }
          });
        case "create_literature":
          $refs.createLiteratureForm[0].$refs.form.$refs[
            "p-descriptions-form"
          ].validate((valid) => {
            if (valid) {
              this.applyCreateLiterature();
            }
          });
          break;
      }
    },
  },
};
</script>
