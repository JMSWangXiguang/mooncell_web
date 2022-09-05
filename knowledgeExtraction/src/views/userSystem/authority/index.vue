<!--
 * @Descripttion:
 * @version:
 * @Author: 唐红娟
 * @Date: 2021-08-05
 * @LastEditors: imali
 * @LastEditTime: 2022-03-24 14:42:08
-->
<template>
  <div class="common-container" style="padding: 10px">
    <el-row style="flex: 1; overflow: scroll">
      <el-col :span="8" h="full">
        <el-card
          class="box-card"
          h="full"
          body-style="height: calc(100vh - 150px)"
        >
          <div slot="header" class="clearfix">
            <span>角色</span>
            <el-button
              v-if="authStatus === 1"
              style="
                float: right;
                padding: 3px 0;
                font-size: 14px;
                color: #ff4949;
              "
              type="text"
              @click="handleDisable"
              >停用</el-button
            >
            <el-button
              v-else
              style="
                float: right;
                padding: 3px 0;
                font-size: 14px;
                color: #56d1a5;
              "
              type="text"
              @click="handleEnable"
              >启用</el-button
            >
            <el-button
              style="float: right; padding: 3px 0; font-size: 14px"
              type="text"
              @click="handleCreate"
              >新增</el-button
            >
          </div>
          <div class="slider-box border-none">
            <ul>
              <li
                v-for="item in roleList"
                :key="item.id"
                style="position: relative"
                :class="{ active: curTopic.arid === item.arid }"
                @click="handleClick(item)"
              >
                <span :class="item.status === 2 ? 'text-[#f5222d]' : ''">
                  {{ item.title }}
                </span>
                <i
                  class="el-icon-edit"
                  @click="handleEdit(item)"
                  style="
                    position: absolute;
                    right: 10px;
                    top: 10px;
                    color: #56d1a5;
                  "
                ></i>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col
        :span="16"
        style="height: 100%; padding-left: 20px; overflow-y: scroll"
      >
        <el-card class="boxCard" h="full" body-style="height: calc(100vh - 150px)">
          <div slot="header" class="clearfix">
            <span>权限</span>
            <el-button float="right" type="primary" @click="save">
              保存
            </el-button>
          </div>
          <div v-for="(auths, index) in authList" :key="index">
            <el-card
              class="box-card"
              style="overflow: auto; margin-bottom: 10px"
            >
              <div slot="header" class="clearfix">
                <span>{{ auths.content }}</span>
              </div>
              <!-- <el-checkbox-group
                style="padding-left: 20px"
                v-model="checkedCities"
              > -->
              <el-checkbox
                v-for="item in auths.xor"
                v-model="item.select"
                :disabled="authStatus === 2"
                :label="item.title"
                :key="item.auid"
                style="display: block; margin-bottom: 5px"
                >{{ item.title }}</el-checkbox
              >
              <!-- </el-checkbox-group> -->
            </el-card>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      :title="`${dialogModel == 'create' ? '新增' : '修改'}`"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="30%"
    >
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="right"
        label-width="100px"
      >
        <el-form-item
          label="角色名称"
          prop="title"
          :rules="{
            required: true,
            message: '请输入角色名称',
            trigger: 'change',
          }"
        >
          <el-input v-model="temp.title" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  roleList,
  createRole,
  updateRole,
  roleAuth,
  updateRoleAuth,
  enableRoleAuth,
  disableRoleAuth,
} from "@/api/userPermissions/role";
import { parseTime } from "@/utils";
import { cloneDeep } from "lodash";
import Pagination from "@/components/Pagination";
export default {
  name: "Classification",
  components: {
    Pagination,
  },
  data() {
    return {
      roleList: [],
      selectItem: {},
      temp: {
        title: "",
      },
      topicList: [],
      dialogFormVisible: false,
      dialogModel: "", // create、edit
      curTopic: {},
      authList: [],
      authStatus: 1,
      arid: "",
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    parseTime,
    //角色列表
    getRoleList() {
      roleList().then((res) => {
        this.roleList = res.result.roles;
        if (this.roleList.length > 0) {
          this.handleClick(this.roleList[0]);
          this.roleAuth(this.roleList[0].arid);
        }
      });
    },
    //角色新增、编辑 保存
    saveData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          if (this.dialogModel === "create") {
            createRole(this.temp).then((res) => {
              this.$message.success("保存成功");
              this.dialogFormVisible = false;
              this.getRoleList();
            });
          } else {
            updateRole(this.temp).then((res) => {
              this.selectItem.title = this.temp.title;
              this.$message.success("保存成功");
              this.dialogFormVisible = false;
              this.getRoleList();
            });
          }
        }
      });
    },
    save() {
      updateRoleAuth({ arid: this.arid, auths: this.authList }).then((res) => {
        this.$message.success("保存成功");
      });
    },
    //权限列表
    roleAuth(id) {
      roleAuth({ arid: id }).then((res) => {
        this.authList = res.result.auths;
        this.authStatus = res.result.status;
      });
    },
    async handleEnable() {
      const { arid } = this;
      try {
        await enableRoleAuth({ arid });
        this.authStatus = 1;
        this.getRoleList();
        this.$message.success("启用成功");
      } catch (error) {
        console.log(error.message);
      }
    },
    async handleDisable() {
      const { arid } = this;
      try {
        await disableRoleAuth({ arid });
        this.authStatus = 2;
        this.getRoleList();
        this.$message.success("停用成功");
      } catch (error) {
        console.log(error.message);
      }
    },
    //点击角色出现不同的角色
    handleClick(item) {
      this.arid = item.arid;
      this.curTopic = item;
      this.roleAuth(item.arid);
    },
    // 新增
    handleCreate() {
      this.temp.title = "";
      this.dialogModel = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 编辑
    handleEdit(item) {
      this.selectItem = item;
      this.temp = cloneDeep(item);
      this.dialogModel = "edit";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
  },
};
</script>
<style scoped>
::v-deep .boxCard .el-card__body {
  height: 100%;
  overflow: scroll;
}
</style>
