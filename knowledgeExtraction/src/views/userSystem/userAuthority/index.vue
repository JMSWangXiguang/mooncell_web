<!--
 * @Descripttion:
 * @version:
 * @Author: 唐红娟
 * @Date: 2021-08-05
 * @LastEditors: imali
 * @LastEditTime: 2022-03-23 14:51:26
-->
<template>
  <div class="common-container" style="overflow: hidden; padding-top: 0">
    <el-row style="flex: 1" :gutter="8">
      <!-- <el-col :span="8" h="full">
        <el-card class="box-card" style="height: 600px">
          <div slot="header" class="clearfix">
            <span>用户列表</span>
          </div>
          <el-tree
            :data="data"
            show-checkbox
            node-key="id"
            :default-expanded-keys="[2, 3, 4]"
            :default-checked-keys="[20]"
          >
          </el-tree>
        </el-card>
      </el-col> -->
      <el-col
        :span="8"
        style="height: 100%; padding-left: 20px; overflow-y: scroll"
      >
        <el-card
          class="box-card"
          h="full"
          body-style="height: calc(100vh - 140px)"
        >
          <div slot="header" class="clearfix">
            <span>角色</span>
          </div>
          <div class="slider-box" style="border: 0">
            <el-checkbox-group
              v-model="checkedRoles"
              @change="handleCheckAllChange"
            >
              <el-checkbox
                style="display: block; margin-bottom: 10px"
                v-for="(item, index) in list"
                :label="item.arid"
                :key="index"
                >{{ item.title }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
        </el-card>
      </el-col>
      <el-col
        :span="16"
        style="height: 100%; padding-left: 20px; overflow-y: scroll"
      >
        <el-card
          class="box-card"
          h="full"
          body-style="height: calc(100vh - 140px)"
        >
          <div slot="header" class="clearfix">
            <span>权限</span>
            <div float="right">
              <el-button type="primary" @click="save">保存</el-button>
              <el-button
                @click="$router.push({ path: '/userSystem/management' })"
                >返回</el-button
              >
            </div>
          </div>
          <div
            v-for="(auths, index) in authList"
            :key="index"
          >
            <el-card
              class="box-card card_box"
              style="overflow: auto; margin-bottom: 10px"
              v-show="auths.judge"
            >
              <div slot="header" class="clearfix">
                <span style="color: #58c1ee">{{ auths.content }}</span>
              </div>
              <ul>
                <li
                  v-for="item in auths.xor"
                  :key="item.auid"
                  style="position: relative"
                  v-show="item.select"
                >
                  {{ item.title }}
                </li>
              </ul>
              <!-- <el-checkbox-group
                style="padding-left: 20px"
                v-model="checkedCities"
              > -->
              <!-- <el-checkbox
                v-for="item in auths.xor"
                v-model="item.select"
                :label="item.title"
                :key="item.auid"
                style="display: block; margin-bottom: 5px"
                >{{ item.title }}</el-checkbox
              > -->
              <!-- </el-checkbox-group> -->
            </el-card>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { userLode, updateUserRole } from "@/api/userPermissions/user";
import { roleAuth } from "@/api/userPermissions/role";
import Pagination from "@/components/Pagination";
export default {
  name: "Classification",
  components: {
    Pagination,
  },
  data() {
    return {
      authList: [],
      checkedRoles: [],
      list: [],
      userid: "",
    };
  },
  watch: {},
  created() {
    if (this.$route.query.userid) {
      this.userid = this.$route.query.userid;
      this.getUserRole(this.$route.query);
    }
    // this.checkedRoles = this.list
    //   .filter((item) => {
    //     return item.select;
    //   })
    //   .map((res) => {
    //     return res.arid;
    //   });
    // console.log(this.checkedRoles, 123);
  },
  methods: {
    //用户权限角色
    getUserRole(params) {
      userLode(params).then((res) => {
        this.list = res.result;
        this.checkedRoles = this.list
          .filter((item) => {
            return item.select;
          })
          .map((res) => {
            return res.arid;
          });
        this.getAuth(this.checkedRoles);
      });
    },
    //选中角色不同的权限列表
    handleCheckAllChange(val) {
      this.checkedRoles = val;
      this.getAuth(this.checkedRoles);
      // this.save(this.checkedRoles);
    },
    //获取权限列表
    getAuth(params) {
      roleAuth({ arids: params }).then((res) => {
        this.authList = res.result.auths;
      });
    },
    save() {
      updateUserRole({ userid: this.userid, arid: this.checkedRoles }).then(
        (res) => {
          this.$message.success("保存成功");
        }
      );
    },
  },
};
</script>
<style scoped>
::v-deep .el-card__body {
  height: 90%;
  overflow: scroll;
}
</style>
