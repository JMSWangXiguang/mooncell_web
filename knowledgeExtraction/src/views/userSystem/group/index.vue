<!--
 * @Author: your name
 * @Date: 2022-01-13 14:53:53
 * @LastEditTime: 2022-05-09 15:06:06
 * @LastEditors: 陈逸
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \knowledgeExtraction\src\views\operate\task\index.vue
-->
<template>
  <div>
    <p-form
      inline
      v-model="groupform"
      :items="[
        {
          prop: 'title',
          content: {
            is: 'el-input',
            clearable: true,
            placeholder: '请输入用户组名称',
          },
        },
        {
          prop: 'is_common',
          content: {
            is: 'el-radio-group',
          },
        },
        {
          prop: 'remark',
          content: {
            is: 'el-input',
            clearable: true,
            placeholder: '请输入备注',
          },
        },
        {
          prop: 'add',
        },
      ]"
    >
      <template #is_common>
        <el-radio-button label="0" value="0">常用</el-radio-button>
        <el-radio-button label="1" value="1">普通</el-radio-button>
      </template>
      <template #add>
        <el-button type="primary" icon="el-icon-plus" @click="dosubmit">
          添加分组
        </el-button>
      </template>
    </p-form>
    <el-divider class="m-0"></el-divider>
    <el-row type="flex" :gutter="16" class="h-[calc(100vh-120px)]">
      <el-col :span="7" class="h-full">
        <el-input
          class="mt-4px"
          v-model="filtTreeText"
          placeholder="请输入关键字筛选"
        ></el-input>
        <el-tree
          ref="thistree"
          v-loading="treeLoading"
          lazy
          accordion
          show-checkbox
          check-strictly
          highlight-current
          node-key="id"
          :load="loadNode"
          :props="props"
          :data="trees"
          :default-expanded-keys="defaultKeys"
          :filter-node-method="filterNode"
          @node-click="handleSelectGroup"
          @node-collapse="selectedGroup = ''"
          @check-change="handleTreeSelectionChange"
          class="thistree h-[calc(100%-50px)] overflow-auto"
        >
          <template slot-scope="{ node, data }">
            <span class="custom-tree-node flex">
              <span
                >{{ node.data.title }}
                <el-tag v-if="node.data.ifleader">组长</el-tag>
                <el-tag v-if="node.data.ifmanager">副组长</el-tag>
                <el-tag v-if="node.data.is_common === '0'" type="warning"
                  >常用</el-tag
                >
              </span>
              <span v-if="node.level == 1">
                <!-- <el-button
                  type="text"
                  @click.stop="() => adduser(node, data)"
                >
                  添加成员
                </el-button> -->
                <!-- <el-button
                  type="text"
                  @click.stop="() => goinfogroup(node, data)"
                >
                  查看信息
                </el-button> -->
                <!-- <el-button
                  type="text"
                  @click.stop="() => goeditgroup(node, data)"
                >
                  编辑
                </el-button> -->
                <el-button
                  type="text"
                  @click.stop="() => goremovegroup(node, data)"
                >
                  删除
                </el-button>
              </span>
              <span v-else>
                <el-button
                  v-if="!node.data.ifleader"
                  type="text"
                  @click.stop="
                    () => {
                      jobifmanager = node.data.ifmanager;
                      nowRow = data;
                      dojob('leader');
                    }
                  "
                >
                  任命组长
                </el-button>
                <!-- <el-button
                    type="warning"
                    v-if="jobifmanager"
                    @click="dojob('people')"
                    size="medium"
                    class="jobbtn"
                    >撤销副组长</el-button
                  >
                  <el-button
                    type="success"
                    v-else
                    @click="dojob('manager')"
                    size="medium"
                    class="jobbtn"
                    >任命为副组长</el-button
                  >
                  <el-button
                    @click="popup3 = false"
                    size="medium"
                    class="jobbtn"
                    >取消任命</el-button
                  > -->
                <!-- <el-button
                  v-if="!node.data.ifleader && !node.data.ifmanager"
                  type="text"
                  @click.stop="() => goremoveuser(node, data)"
                >
                  删除成员
                </el-button> -->
              </span>
            </span>
          </template>
        </el-tree>
      </el-col>
      <el-col
        w="120px"
        h="full"
        flex="default col"
        border="l r"
        justify="center"
      >
        <el-button
          :disabled="!selectedGroup || !toAddUsers.length"
          type="primary"
          icon="el-icon-arrow-left"
          @click="handleAddUser"
          >加入</el-button
        >
        <div class="h-8px"></div>
        <el-button
          :disabled="!selectedGroup || !toRemoveUsers.length"
          type="primary"
          icon="el-icon-arrow-right"
          @click="handleRemoveUser"
        >
          移出
        </el-button>
      </el-col>
      <el-col :span="15">
        <p-table
          ref="thistable"
          v-loading="tableLoading"
          highlight-current-row
          height="calc(100vh - 200px)"
          :border="false"
          :data="allusers"
          :columns="[
            {
              type: 'selection',
              width: 55,
              selectable: judgeRowSelectable,
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
          ]"
          :pagination="{
            total,
            layout: 'total, sizes, prev, pager, next, jumper',
            'page-sizes': [20, 50, 100, 200],
            'current-change': (page) => getusers({ page }),
            'size-change': (size) => getusers({ size }),
          }"
          @selection-change="handleTableSelectionChange"
          @filter-change="handleFilterChange"
          class="cursor-pointer"
        >
        </p-table>
      </el-col>
    </el-row>
    <!-- 添加成员 -->
    <el-dialog :visible.sync="popup2" :close-on-click-modal="false">
      <template slot="title">
        <div
          style="
            font-size: 16px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
          "
        >
          添加成员
        </div>
      </template>
      <el-transfer
        v-model="addusers"
        :filterable="true"
        :titles="['全部列表', '添加列表']"
        :props="{
          key: 'userid',
          label: 'name',
        }"
        :data="addallusers"
      >
      </el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doadd">确 定</el-button>
        <el-button @click="popup2 = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getExpertList,
  getUserList,
  getGrouper,
  getGroupInfo,
  addGroup,
  updateGroup,
  delGroup,
  addGrouper,
  delGrouper,
  jobGrouper,
} from "@/api/operate/group";
export default {
  inject: ['reload'],
  data() {
    return {
      props: {
        isLeaf: "leaf",
      },
      tableLoading: false,
      tablePager: {
        page: 1,
        size: 20,
      },
      filtTreeText: "",
      allusers: [],
      total: 0,
      users: [],
      searchValue: "",
      trees: [],
      defaultKeys: [],
      nowRow: {},
      treeLoading: false,
      popup: false,
      poptype: 0,
      groupform: {
        // "team_id": "",
        title: "",
        // owner: {
        //   userid: "",
        //   name: "",
        // },
        is_common: "1",
        remark: "",
      },
      ifadd: false,
      infodata: {},
      popup2: false,
      popup3: false,
      nowid: "",
      jobifmanager: true,
      addallusers: [],
      addusers: [],
      currentGroupUsers: [],
      selectedGroup: "",
      toAddUsers: [],
      toRemoveUsers: [],
      listQuery: {}
    };
  },
  computed: {
    poptext() {
      if (this.poptype == 0) {
        return "新建分组";
      }
      if (this.poptype == 1) {
        return "编辑分组";
      }
      if (this.poptype == 2) {
        return "添加组员";
      }
      if (this.poptype == 3) {
        return "分组信息";
      }
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
  },
  mounted() {
    this.getlist();
    this.getusers();
  },
  watch: {
    filtTreeText(val) {
      this.$refs.thistree.filter(val);
    },
  },
  methods: {
    // 给一个多级数组对象设置一个随机数
    setRcode(data, child = 'child') {
      return (data || []).map(o => {
        return Object.assign({}, o, {
          rid: this.randomString(10),
          [`${child}`]: this.setRcode(o[child], child)
        })
      })
    },
    randomString(len) {
      len = len || 32
      var $chars =
        'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678' /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
      var maxPos = $chars.length
      var pwd = ''
      for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
      }
      return pwd
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    },
    handleFilterChange(filter) {
      const key = Object.keys(filter)[0];
      this.listQuery[`${key}_id`] = filter[key][0] || null;
      this.getusers();
    },
    getusers(pager) {
      this.tableLoading = true;
      this.tablePager = {
        ...this.tablePager,
        ...pager,
        status: 1,
      };
      getUserList({
        ...this.listQuery,
        ...this.tablePager,
      })
        .then((res) => {
          this.allusers = res.result.accounts;
          this.total = res.result.total;
          this.toAddUsers = [];
        })
        .finally(() => (this.tableLoading = false));
    },
    getlist() {
      this.treeLoading = true;
      getExpertList()
        .then((res) => {
          if (res.result.length) {
            this.trees = res.result.map((d) => ({
              ...d,
              id: d.team_id,
              disabled: true,
              children: [],
            }))
            // this.defaultKeys = [res.result[0].team_id];
            this.selectedGroup = res.result[0].team_id;
          }
        })
        .finally(() => (this.treeLoading = false));
    },

    // 获取下一层
    loadNode(row, resolve) {
      console.log(row.level);
      if (row.level == 1) {
        getGrouper({ team_id: row.data.team_id })
          .then((res) => {
            this.currentGroupUsers = res.result.map((d) => d.userid);
            return resolve(
              res.result.map((d) => ({
                ...d,
                p_id: row.data.team_id,
                id: d.userid,
                title: d.nickname,
                ifleader: d.job.title == "组长",
                ifmanager: d.job.title == "副组长",
                leaf: true,
              }))
            );
          })
          .catch((err) => {
            return resolve([]);
          });
      }
    },

    // 添加成员
    async adduser(node, d) {
      let ids,
        ds = [];
      this.nowid = d.team_id;
      await getGrouper({ team_id: d.team_id }).then((res) => {
        ids = res.result.map((d) => d.userid);
      });
      let that = this;
      this._.isNil(
        this._.map(this.allusers, function (v) {
          if (!that._.includes(ids, v.userid)) {
            ds.push({
              userid: v.userid,
              name: v.name,
            });
          }
        })
      );
      this.addusers = [];
      this.addallusers = ds;
      this.popup2 = true;
    },
    async doadd() {
      if (this.addusers.length < 1) {
        this.$message({
          type: "warning",
          message: "未选择",
        });
        return false;
      }
      let result = [];
      let that = this;
      await this.allusers.forEach(function (v) {
        if (that._.includes(that.addusers, v.userid)) {
          result.push({
            userid: v.userid,
            name: v.name,
          });
        }
      });
      addGrouper({
        team_id: this.nowid,
        member: result,
      })
        .then((res) => {
          this.$message({
            type: "success",
            message: "添加成功",
          });
          this.popup2 = false;
          this.getlist();
        })
        .catch((err) => {});
    },

    // 获取分组信息
    goinfogroup(node, d) {
      getGroupInfo({ team_id: d.team_id }).then((res) => {
        this.poptype = 3;
        this.infodata = res.result;
        this.popup = true;
      });
    },

    // 编辑分组
    goeditgroup(node, d) {
      this.groupform = d;
      this.poptype = 1;
      this.popup = true;
      getGrouper({ team_id: d.team_id })
        .then((res) => {
          this.users = res.result.map((d) => ({
            userid: d.userid,
            name: d.nickname,
          }));
        })
        .catch((err) => {});
      getGroupInfo({ team_id: d.team_id }).then((res) => {
        let d = res.result;
        this.groupform = d;
      });
    },

    // 删除分组
    goremovegroup(node, d) {
      this.$confirm("删除之后无法恢复，是否确认删除", "确认删除信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "删除",
        cancelButtonText: "放弃删除",
      })
        .then(() => {
          this.treeLoading = true;
          delGroup({ team_id: d.team_id })
            .then((res) => {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.treeLoading = false;
              this.getlist();
            })
            .catch((err) => {
              this.treeLoading = false;
            });
        })
        .catch((action) => {});
    },
    goremoveuser(node, d) {
      this.$confirm("删除之后无法恢复，是否确认删除", "确认删除信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "删除",
        cancelButtonText: "放弃删除",
      })
        .then(() => {
          this.treeLoading = true;
          delGrouper({
            team_id: d.p_id,
            member: [
              {
                userid: d.id,
                name: d.title,
              },
            ],
          })
            .then((res) => {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.treeLoading = false;
              this.getlist();
            })
            .catch((err) => {
              this.treeLoading = false;
            });
        })
        .catch((action) => {});
    },

    // 任命组长
    gojobuser(node, d, state) {
      this.jobifmanager = state;
      this.nowRow = d;
      this.popup3 = true;
    },
    dojob(name) {
      jobGrouper({
        team_id: this.nowRow.p_id,
        userid: this.nowRow.id,
        job_id: name,
        user_name: this.nowRow.title,
        team_name: this.trees.find((t) => t.team_id === this.nowRow.p_id)
          ?.title,
      })
        .then((res) => {
          const nodeDatas = this.$refs.thistree
            .getNode(this.nowRow.p_id)
            .childNodes.map(({ data }) => {
              // console.log(data.id,this.nowRow.id);
              if (data.id === this.nowRow.id) {
                return {
                  ...data,
                  ifleader: true,
                  job: {
                    id: "leader",
                    title: "组长"
                  }
                };
              } else {
                return {
                  ...data,
                  ifleader: false,
                  job: {
                    id: "people",
                    title: "组员"
                  }
                };
              }
            });
          // console.log(this.nowRow.p_id,nodeDatas);
          this.$refs.thistree.updateKeyChildren(this.nowRow.p_id, nodeDatas);
          this.$message({
            type: "success",
            message: "任命成功",
          });
          this.reload()
        })
        .catch((err) => {});
    },

    // 提交
    dosubmit() {
      if (!this.groupform.title.trim()) {
        return this.$message.error("请输入用户组名称");
      }
      this.treeLoading = true;
      if (this.poptype == 0) {
        let d = this._.clone(this.groupform);
        // d.owner.name = this._.find(this.users, function (o) {
        //   return o.userid == d.owner.userid;
        // }).name;
        addGroup(d)
          .then((res) => {
            this.treeLoading = false;
            this.popup = false;
            this.$message({ type: "success", message: "新增成功" });
            this.getlist();
          })
          .catch((err) => {
            this.treeLoading = false;
          });
      } else if (this.poptype == 1) {
        let d = this._.clone(this.groupform);
        d.owner.name = this._.find(this.users, function (o) {
          return o.userid == d.owner.userid;
        }).name;
        updateGroup(d)
          .then((res) => {
            this.treeLoading = false;
            this.popup = false;
            this.$message({ type: "success", message: "编辑成功" });
            this.getlist();
          })
          .catch((err) => {
            this.treeLoading = false;
          });
      }
    },

    //下拉框搜索
    filtervalue(values, searchValue) {
      let newListData = []; // 用于存放搜索出来数据的新数组
      if (searchValue) {
        values.filter((item) => {
          if (item.name.indexOf(searchValue) !== -1) {
            newListData.push(item);
          }
        });
        return newListData;
      } else {
        return values;
      }
    },
    judgeRowSelectable(row) {
      return !this.currentGroupUsers.includes(row.userid);
    },
    handleTableSelectionChange(selection) {
      this.toAddUsers = selection;
    },
    handleTreeSelectionChange() {
      this.toRemoveUsers = this.$refs.thistree.getCheckedKeys();
    },
    handleSelectGroup(row) {
      if (!row.leaf) {
        this.nowRow = row;
        this.selectedGroup = row.team_id;
        this.$refs.thistree.setCheckedKeys([]);
        this.currentGroupUsers = this.$refs.thistree
          .getNode(row.team_id)
          .childNodes.map(({ data }) => data.id);
      }
    },
    async handleAddUser() {
      try {
        const res = await addGrouper({
          team_id: this.selectedGroup,
          member: this.toAddUsers,
        });
        if (res.status === 200) {
          this.toAddUsers.forEach((user) => {
            this.$refs.thistree.append(
              {
                p_id: this.selectedGroup,
                id: user.userid,
                title: user.name,
                ifleader: false,
                ifmanager: false,
                leaf: true,
              },
              this.selectedGroup
            );
            this.currentGroupUsers.push(user.userid);
          });
          this.$refs.thistable.$refs["p-table"].clearSelection();
          this.toAddUsers = [];
        } else {
          this.$message.error(`加入失败，${res.msg}`);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async handleRemoveUser() {
      try {
        const res = await delGrouper({
          team_id: this.selectedGroup,
          member: this.toRemoveUsers,
        });
        if (res.status === 200) {
          this.toRemoveUsers.forEach((id) => {
            const node = this.$refs.thistree.getNode(id);
            this.$refs.thistree.remove(node);
            const findIndex = this.currentGroupUsers.findIndex((u) => u === id);
            if (findIndex > -1) {
              this.currentGroupUsers.splice(findIndex, 1);
            }
          });
          this.$refs.thistree.setCheckedKeys([]);
          this.toRemoveUsers = [];
        } else {
          this.$message.error(`移出失败，${res.msg}`);
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style>
.formlistthis .el-input__inner {
  width: 300px;
}
.thistree .flex {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
}
.thistree .el-tree-node__content {
  height: 40px;
}
</style>

<style scoped>
.jobbtn {
  width: 100%;
  margin: 5px 0;
}
</style>
