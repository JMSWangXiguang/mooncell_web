<!--
 * @Descripttion:
 * @version:
 * @Author: 唐红娟
 * @Date: 2021-08-05
 * @LastEditors: imali
 * @LastEditTime: 2022-04-15 10:32:20
-->
<template>
  <div class="app-container">
    <div class="mb-10px">
      <el-input
        clearable
        v-model="listQuery.account"
        class="filter-item"
        placeholder="请输入账号"
        style="width: 180px; margin-right: 10px"
        prefix-icon="el-icon-search"
        @clear="search"
      />
      <el-input
        clearable
        v-model="listQuery.nickname"
        class="filter-item"
        placeholder="请输入姓名"
        style="width: 180px; margin-right: 10px"
        prefix-icon="el-icon-search"
        @clear="search"
      />
      <el-button type="primary" icon="el-icon-search" @click="search"
        >查询</el-button
      >
      <div class="float-right">
        <el-button
          v-if="auths.includes(OAuth.创建用户)"
          type="primary"
          @click="handleCreate"
          >创建用户</el-button
        >
      </div>
    </div>
    <p-table
      v-loading="loading"
      :row-class-name="({ row }) => (row.status === 2 ? 'text-[#f5222d]' : '')"
      :data="list"
      height="calc(100vh - 170px)"
      :columns="[
        {
          label: '账号',
          prop: 'account',
        },
        {
          label: '姓名',
          prop: 'name',
        },
        {
          label: '性别',
          prop: 'sex',
          width: 50,
        },
        {
          label: '身份',
          prop: 'identify',
          columnKey: 'identity',
          width: 100,
          filters: identifies.map(({ id, title }) => ({
            text: title,
            value: id,
          })),
          filterPlacement: 'bottom',
          filterMultiple: false,
        },
        {
          label: '科室',
          prop: 'department_name',
          columnKey: 'department',
          filters: departments.map(({ id, title }) => ({
            text: title,
            value: id,
          })),
          filterPlacement: 'bottom',
          filterMultiple: false,
        },
        {
          label: '机构',
          prop: 'organization_name',
          columnKey: 'organ',
          filters: organizations.map(({ oid, name }) => ({
            text: name,
            value: oid,
          })),
          filterPlacement: 'bottom',
          filterMultiple: false,
        },
        {
          label: '职称',
          prop: 'job_title',
          columnKey: 'jobtitle',
          filters: jobtitles.map(({ id, title }) => ({
            text: title,
            value: id,
          })),
          filterPlacement: 'bottom',
          filterMultiple: false,
        },
        {
          label: '学位',
          prop: 'education_name',
          columnKey: 'education_name',
          filters: educations.map(({ id, title }) => ({
            text: title,
            value: id,
          })),
          filterPlacement: 'bottom',
          filterMultiple: false,
        },
        {
          label: '最新登录时间',
          prop: 'last_active_time',
          width: 170,
        },
        {
          label: '操作',
          prop: 'action',
        },
      ]"
      :pagination="{
        total,
        class: 'text-center',
        layout: 'total, sizes, prev, pager, next, jumper',
        'page-sizes': [20, 50, 100, 200],
        'current-change': (page) => userList({ page }),
        'size-change': (size) => userList({ size }),
      }"
      border
      highlight-current-row
      class="w-full cursor-pointer"
      @row-click="handleEdit"
      @filter-change="handleFilterChange"
    >
      <template #action="{ row }">
        <el-button-group>
          <el-button
            v-if="auths.includes(OAuth.查看用户权限)"
            type="text"
            style="margin-right: 10px"
            @click="jurisdiction(row)"
            >权限</el-button
          >
          <el-button
            v-if="auths.includes(OAuth.查看用户轨迹)"
            type="text"
            @click.stop="trajectory(row)"
            >轨迹</el-button
          >
        </el-button-group>
      </template>
    </p-table>
    <el-dialog
      :title="`${dialogModel == 'create' ? '新建' : '人员信息变动'}`"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="
        $refs.dataForm.$refs.form.$refs['p-descriptions-form'].clearValidate()
      "
    >
      <user-form ref="dataForm" v-model="temp" v-loading="formLoading" />
      <div slot="footer" class="dialog-footer">
        <span class="mr-20px text-xs text-gray-400">新用户默认密码为1～8</span>
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="saveData(false)"> 保存 </el-button>
        <el-button v-if="dialogModel === 'edit'" @click="updatePassword()"
          >重置密码</el-button
        >
        <el-button
          v-if="dialogModel === 'edit' && temp.status === 2"
          type="success"
          @click="saveData(1)"
          >启用</el-button
        >
        <el-button
          v-if="dialogModel === 'edit' && temp.status === 1"
          type="danger"
          @click="saveData(2)"
          >停用</el-button
        >
      </div>
    </el-dialog>
    <el-dialog title="轨迹" :visible.sync="istrajectory" width="80%">
      <div style="margin-bottom: 10px">
        <el-date-picker
          v-model="params.start_time"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择开始日期时间"
        />
        <el-date-picker
          v-model="params.end_time"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="margin: 0 10px"
          placeholder="选择结束日期时间"
        />
        <el-select
          v-model="params.type_id"
          placeholder="请选择"
          style="margin-right: 10px"
        >
          <el-option
            v-for="item in typeList"
            :key="item.type_id"
            :label="item.type_name"
            :value="item.type_id"
          />
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="traceSearch"
          >查询</el-button
        >
      </div>
      <el-row :gutter="20" class="h-[calc(100vh-400px)] overflow-hidden">
        <el-col :span="8" h="full">
          <div class="slider-box">
            <ul v-if="traceList && traceList.length">
              <li
                v-for="(item, index) in traceList"
                :key="index"
                style="position: relative"
                :class="{
                  active:
                    curTopic.type_id + curTopic.session ===
                    item.type_id + item.session,
                }"
                @click="handleClick(item)"
              >
                {{ item.action_time }}
                <span style="position: absolute; right: 50px; top: 0">{{
                  item.type_name
                }}</span>
                <span style="position: absolute; right: 10px; top: 0"
                  >({{ item.count }})</span
                >
              </li>
            </ul>
            <el-empty v-else h="full">
              <template #image><div></div></template>
            </el-empty>
          </div>
        </el-col>
        <el-col :span="16">
          <el-table
            :data="trajectoryList"
            border
            highlight-current-row
            height="calc(100vh - 400px)"
            :row-style="{height:'20px'}"
            :cell-style="{padding:'3px'}"
          >
            <el-table-column label="事件" prop="title" />
            <el-table-column label="处理数据" prop="data" />
            <el-table-column label="发生时间" prop="action_time" />
            <!-- <el-table-column label="操作">
              <template slot-scope="scoped">
                <el-button-group>
                  <el-button
                    type="text"
                    style="margin-right: 10px"
                    @click="review(scoped.row)"
                    >查看</el-button
                  >
                </el-button-group>
              </template>
            </el-table-column> -->
          </el-table>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="istrajectory = false">取 消</el-button>
        <el-button type="primary" @click="istrajectory = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  userList,
  getUser,
  createUser,
  updateUser,
  resetPassword,
  getTraceList,
  getRightTrace,
  traceType,
} from "@/api/userPermissions/user";
import { parseTime } from "@/utils";
import { OAuth } from "@/utils/auth";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import { find } from "lodash";
import UserForm from "../userForm/index.vue";

export default {
  name: "Literature",
  components: {
    Pagination,
    UserForm,
  },
  setup() {
    return {
      OAuth,
    };
  },
  data() {
    return {
      list: [],
      total: 0,
      loading: false,
      formLoading: false,
      listQuery: {
        page: 1,
        size: 20,
        account: "",
        nickname: "",
      },
      params: {
        userid: "",
        type_id: "",
        type_name: "",
        start_time: "",
        end_time: "",
        page: 1,
        size: 1000000,
      },
      temp: {},
      temp1: {
        userid: "",
        password: "",
      },
      dialogFormVisible: false,
      dialogModel: "", // create、edit
      istrajectory: false,
      traceList: [],
      typeList: [],
      curTopic: {
        type_id: "",
      },
      trajectoryList: [],
    };
  },
  computed: {
    sexes() {
      return this.$store.getters["dict/sexList"];
    },
    identifies() {
      return this.$store.getters["dict/identifyList"];
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
    auths() {
      return this.$store.getters.auths;
    },
  },
  async created() {
    this.search();
    this.traceType();
  },
  methods: {
    parseTime,
    // 查询搜索
    search() {
      this.listQuery.page = 1;
      this.userList();
    },
    handleFilterChange(filter) {
      const key = Object.keys(filter)[0];
      this.listQuery[`${key}_id`] = filter[key][0] || null;
      this.userList();
    },
    // 用户列表
    userList(pager) {
      if (pager) {
        const { page, size } = pager;
        this.listQuery.page = page || this.listQuery.page;
        this.listQuery.size = size || this.listQuery.size;
      }
      this.loading = true;
      userList(this.listQuery)
        .then((res) => {
          this.list = res.result.accounts;
          this.total = res.result.total;
        })
        .finally(() => (this.loading = false));
    },
    restFrom() {
      this.temp = {};
    },
    // 新增用户
    handleCreate() {
      this.restFrom();
      this.dialogModel = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs.dataForm.$refs.form.$refs[
          "p-descriptions-form"
        ].clearValidate();
      });
    },
    // 修改
    handleEdit(item) {
      this.temp1.password = "12345678";
      this.temp1.userid = item.userid;
      this.formLoading = true;
      getUser({ userid: item.userid })
        .then((res) => {
          const r = res.result;
          this.temp = {
            ...r,
            organization_id: r.organization.id,
            identity_id: r.identity.id,
            sex_id: r.sex.id,
            job_title_id: r.job_title.id,
            department_id: r.department,
          };
        })
        .finally(() => (this.formLoading = false));
      this.dialogModel = "edit";
      this.dialogFormVisible = true;
    },
    // 修改保存
    saveData(enableOrDisable) {
      const {
        sex_id,
        job_title_id,
        identity_id,
        education_id,
        organization_id,
        department_id,
      } = this.temp;
      this.$refs.dataForm.$refs.form.$refs["p-descriptions-form"].validate(
        (valid) => {
          if (valid) {
            const params = {
              ...this.temp,
              sex_id,
              jobtitle_id: job_title_id,
              jobtitle_name: find(this.jobtitles, (l) => l.id === job_title_id)
                ?.title,
              identity_id,
              identity_name: find(this.identifies, (l) => l.id === identity_id)
                ?.title,
              education_id,
              education_name: find(this.educations, (l) => l.id === education_id)
                ?.title,
              organization_id: organization_id,
              organization_name: find(
                this.organizations,
                (l) => l.oid === organization_id
              )?.name,
              department_id: department_id,
              department_name: find(
                this.departments,
                (l) => l.id === department_id
              )?.title,
            };
            if (enableOrDisable) {
              params.status = enableOrDisable;
              updateUser(params)
                .then((res) => {
                  this.$message.success(
                    enableOrDisable === 1 ? "启用成功" : "停用成功"
                  );
                })
                .finally(() => this.search());
            } else {
              if (this.dialogModel === "create") {
                createUser(params)
                  .then((res) => {
                    this.$message.success("保存成功");
                  })
                  .finally(() => this.search());
              } else {
                updateUser(params)
                  .then((res) => {
                    this.$message.success("保存成功");
                  })
                  .finally(() => this.search());
              }
            }
            this.dialogFormVisible = false;
          }
        }
      );
    },
    // 跳转到权限
    jurisdiction(item) {
      const obj = {};
      obj.userid = item.userid;
      this.$router.push({
        path: "/userSystem/userAuthority",
        query: obj,
      });
    },
    // 查看轨迹
    trajectory(item) {
      this.trajectoryList = [];
      this.traceList = [];
      this.istrajectory = true;
      this.userid = item.userid;
      this.traceSearch();
    },
    // 轨迹搜索
    traceSearch() {
      this.params.userid = this.userid;
      this.getTraceList(this.params);
    },
    // 用户轨迹列表
    getTraceList(params) {
      getTraceList(params).then((res) => {
        this.traceList = res.result.trace;
        if (this.traceList.length > 0) {
          this.handleClick(this.traceList[0]);
        } else {
          this.trajectoryList = [];
        }
      });
    },
    // 用户轨迹右侧列表
    getRightTrace(params) {
      const obj = {
        userid: this.userid,
        type_id: params.type_id,
        session: params.session,
        page: 1,
        size: 1000000,
      };
      getRightTrace(obj).then((res) => {
        this.trajectoryList = res.result.actions;
      });
    },
    // 轨迹类型
    traceType() {
      traceType().then((res) => {
        this.typeList = res.result.typies;
      });
    },
    // 轨迹查看跳转判断
    review(row) {
      if (row.trail.method === "vision") {
        this.$route.push({
          path: "/myTask/info",
          query: row.trail,
        });
      }
    },
    handleClick(item) {
      this.curTopic = item;
      this.getRightTrace(item);
    },
    // 打开修改密码弹窗
    updatePassword() {
      resetPassword(this.temp1).then((res) => {
        this.$message.success("重置密码成功");
      });
    },
  },
};
</script>
