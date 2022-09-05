<template>
  <div px="6px">
    <div class="mb-20px">
      <div class="mb-8px text-lg font-bold">
        {{ paramsObj.title }}
        <span class="ml-5px">{{ task_type | taskType }}</span>
      </div>
      <el-row type="flex">
        <el-col flex="1">
          <div v-if="!isSecond">
            <span mr="20px">
              总页数
              <span text="[#56d1a5]">{{ paramsObj.page }}</span> 页
            </span>
            <span>
              剩余未分配页数
              <span text="[#56d1a5]">{{ paramsObj.ungiven }}</span> 页
            </span>
            <span ml="20px">
              温馨提示: <span text="[#f5222d]">{{ paramsObj.tips }}</span>
            </span>
          </div>
        </el-col>
        <el-col basis="160px" v-if="addType === 1">
          <el-button
            type="primary"
            :disabled="
              (isSecond && !selectedRow) || has(selectedRow, 'parent_id')
            "
            icon="el-icon-circle-plus-outline"
            @click="handleCreate"
          >
            添加分页
          </el-button>
        </el-col>
        <el-col basis="240px">
          <el-radio-group v-model="addType">
            <el-radio-button
              :label="1"
              :disabled="addType === 2 && !isEmpty(list)"
            >
              按页添加
            </el-radio-button>
            <el-radio-button
              :label="2"
              :disabled="addType === 1 && !isEmpty(list)"
            >
              按章节添加
            </el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col basis="150px">
          <el-button type="primary" @click="saveAll()">保存</el-button>
          <el-button @click="$router.go(-1)">返回</el-button>
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="8">
      <el-col :span="addType === 1 ? 24 : 18">
        <p-table
          v-loading="tableLoading"
          :indent="4"
          :data="list"
          :row-class-name="
            ({ row }) => (isNil(row.children) ? '' : 'cursor-pointer')
          "
          :resizable="false"
          :columns="
            compact([
              {
                prop: 'range',
                label: '页码范围',
                width: 200,
              },
              {
                prop: 'chapter_name',
                label: '章节',
                showOverflowTooltip: true,
              },
              {
                prop: 'auditor',
                label: task_type === 1 ? '校验人' : '审核人',
              },
              isSecond
                ? undefined
                : {
                    prop: 'date',
                    label: '任务期限',
                    width: 430,
                  },
              {
                prop: 'rate',
                label: '当前进度',
                width: 100,
              },
              {
                prop: 'action',
                label: '操作',
                width: 60,
              },
            ])
          "
          row-key="task_id"
          border
          highlight-current-row
          w="full"
          height="calc(100vh - 200px)"
          @row-click="(row) => (selectedRow = row)"
        >
          <template #range="{ row }">
            <el-input-number
              :controls="false"
              class="w-60px"
              v-model="row.range.from"
              :disabled="!isNil(row.children) || !!row.rate || addType === 2"
              :min="row.min"
              :max="row.max"
            ></el-input-number>
            <span mx="4px">至</span>
            <el-input-number
              :controls="false"
              class="w-60px"
              v-model="row.range.to"
              :disabled="!isNil(row.children) || !!row.rate || addType === 2"
              :min="row.min"
              :max="row.max"
            ></el-input-number>
          </template>
          <template #auditor="{ row, index }">
            <el-button
              type="text"
              @click="handleReviewer(row, index)"
              :disabled="!!row.rate || (isSecond && !row.parent_id)"
            >
              <span v-if="isEmpty(row.auditor) && isEmpty(row.team_id)">
                {{ task_type === 1 ? "添加校验人" : "添加审核人" }}
              </span>
              <span v-else-if="row.user_type === 1">
                {{ map(row.auditor, (item) => item.name).join("，") }}
              </span>
              <span v-else-if="find(groupList, (g) => g.key === row.team_id)">
                {{
                  `${find(groupList, (g) => g.key === row.team_id).label}（组）`
                }}
              </span>
            </el-button>
          </template>
          <template #date="{ row }">
            <el-date-picker
              v-model="row.date"
              :disabled="!!row.rate"
              class="w-400px"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
            />
          </template>
          <template #rate="{ row }">
            <el-progress
              text-inside
              :stroke-width="16"
              :percentage="row.rate ? Number(row.rate.replace('%','')) : 0"
            ></el-progress>
          </template>
          <template #action="{ row, index }">
            <el-button
              :disabled="(isSecond && !row.parent_id) || !!row.rate"
              type="text"
              @click="del(row, index)"
            >
              删除
            </el-button>
          </template>
        </p-table>
      </el-col>
      <el-col :span="addType === 1 ? 0 : 6">
        <el-card shadow="never" class="h-[calc(100vh-200px)] overflow-auto">
          <el-tree
            ref="tree"
            default-expand-all
            node-key="cata_id"
            :data="showTree"
            :props="{ label: 'title', children: 'child' }"
            :expand-on-click-node="false"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span class="truncate w-[10vw]" :title="node.label">
                {{ node.label }}
              </span>
              <div>
                <span text="xs"> {{ data.page }}（{{ data.num }}） </span>
                <el-button
                  type="text"
                  icon="el-icon-circle-plus-outline"
                  class="text-base"
                  @click="handleAddFromCat(data)"
                  :disabled="data.disabled"
                ></el-button>
              </div>
            </span>
          </el-tree>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      destroy-on-close
      title="添加校验人"
      :visible.sync="dialogVisible"
      width="630px"
    >
      <select-dialog
        ref="checkerSelectDialog"
        :userList="userList"
        :groupList="groupList"
        :solidType="isSecond ? 1 : 0"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { userList as getUserList } from "@/api/userPermissions/user";
import {
  catalogueList,
  secondTask,
  taskAuditing,
  updateAuditing,
  updateSecondTask
} from "@/api/literature/automaticEntry";
import { getExpertList } from "@/api/operate/apply";
import {
  map,
  isNil,
  pull,
  findIndex,
  get,
  has,
  filter,
  compact,
  isEmpty,
  find,
} from "lodash";
import SelectDialog from "./select-dialog.vue";
import { submitAuditor } from "@/api/literature/literatureManagement";
import { getGrouper, getTeams } from "@/api/operate/group";

export default {
  components: { SelectDialog },
  setup() {
    return { isNil, get, has, compact, isEmpty, map, find };
  },
  data() {
    return {
      task_type: Number(this.$route.query.task_type),
      addType: 1,
      isSecond: false,
      teamids: null,
      tableLoading: false,
      selectedRow: null,
      auditors: [],
      list: [],
      treeList: [],
      userList: [],
      groupList: [],
      dialogVisible: false,
      auditorDialogVisible: false,
      curTopic: {},
      listQuery: {},
      obj: {},
      temp: {
        range: { from: null, to: null },
        auditor: [],
        rate: 0,
      },
      dialogFormVisible: false,
      dialogModel: "",
      bidObj: {},
      params: {
        page: 1,
        size: 1000000,
        search: "",
        status: 1,
      },
      index: null,
      child: null,
      paramsObj: {},
      pickerOptions:{
        disabledDate(v) {
          return v.getTime() < new Date().getTime() - 86400000;
        }
      },
      treeData: [],
      choseList: []
    };
  },
  filters: {
    taskType(val) {
      let str
      switch (val) {
        case 1:
          str = "校验任务分配"
          break;
        case 2:
          str = "审核任务分配"
          break;
        case 3:
          str = "标注任务分配"
          break;
        default:
          break;
      }
      return str
    }
  },
  watch: {
    list: {
      handler(newList) {
        const { page } = this.paramsObj;
        const toArr = (m, n) => {
          const arr = [];
          for (let i = m; i <= n; i++) {
            arr.push(i);
          }
          return arr;
        };
        const totalArr = toArr(1, page);
        newList.forEach((item) => {
          const { from, to } = item.range;
          if (from && to) {
            toArr(Number(from), Number(to)).forEach((it) => {
              const findI = findIndex(totalArr, (c) => c === it);
              if (findI > -1) {
                totalArr.splice(findI, 1);
              }
            });
          }
        });
        const tipsArr = [];
        let begin = totalArr[0];
        totalArr.forEach((item, i) => {
          if (i === totalArr.length - 1) {
            tipsArr.push(`${begin}-${item}`);
          } else if (i > 0 && item - totalArr[i - 1] > 1) {
            tipsArr.push(`${begin}-${totalArr[i - 1]}`);
            begin = item;
          }
        });
        this.paramsObj = {
          ...this.paramsObj,
          tips: `页码${tipsArr.join(",")}未分配`,
        };
      },
      deep: true,
    },
  },
  computed: {
    showChoseList() {
      return this.choseList.filter(o => o.show)
    },
    choseIds() {
      let ids = []
      this.choseList && this.choseList.forEach(item => {
        ids = [...ids, ...item.dna]
      })
      return ids
    },
    showTree() {
      const that = this
      const deal = (data) => {
        return data.map(o => {
          return {
            ...o,
            ...{
              disabled: that.choseIds.includes(o.cata_id),
              child: deal((o.child || []))
            }
          }
        })
      }
      return deal(this.treeData)
    }
  },
  async created() {
    this.bidObj = this.$route.query;
    try {
      this.tableLoading = true;
      if (!this.isSecond) {
        await this.getUserList(this.params);
      }
      await this.getGroupList(this.params);
      await this.catalogueList();
      const res = await getTeams();
      const { team_flag, teamids } = res.result;
      if (team_flag === 1) {
        this.secondTaskAudit({
          ...this.bidObj,
          team_ids: teamids,
          task_type: this.task_type,
        });
        this.teamids = teamids;
      } else {
        this.taskAuditing({ ...this.bidObj, task_type: this.task_type });
      }
    } catch (error) {
      console.error(error);
      this.tableLoading = false;
    }
  },
  methods: {
    //目录列表
    catalogueList() {
      catalogueList({ bid: this.bidObj.bid }).then((res) => {
        // this.treeList = res.result.catas;
        const data = res.result.catas;
        const deal =(data,pids) => {
          return data.map(o => {
            return {
              ...o,
              ...{
                dna: [...pids, o.cata_id],
                child: deal((o.child||[]), [...pids, o.cata_id])
              }
            }
          })
        }
        this.treeData = deal(data,[])
      });
    },
    //任务列表
    async taskAuditing(params) {
      const res = await taskAuditing(params);
      if (res.result) {
        this.list = res.result.task.map((t) => ({
          ...t,
          date: [t.begin_time, t.end_time],
        }));
        if (this.list.some((it) => it.chapter_name)) {
          this.addType = 2;
        }
        this.paramsObj = res.result;
        if (res.result.audit_type === 1) {
          this.auditors = res.result.auditer
            .map((a) => this.userList.find((u) => u.key === a)?.label)
            .join(",");
        } else if (res.result.audit_type === 2) {
          this.auditors = this.userList.find(
            (u) => u.key === res.result.auditer[0]
          )?.label;
        }
        this.tableLoading = false;

        const deal = (data, id) => {
          let item = {}
          data.forEach(i => {
            if(i.cata_id === id) {
              item = i
            }else {
              if(i.child && i.child.length > 0) {
                i.child.forEach(j => {
                  if(j.cata_id === id) {
                    item = j
                  }
                })
              }
            }
          })
          return item
        }
        this.$nextTick(() => {
          let ids = []
          this.list.forEach(item => {
            ids.push(item.cata_id)
          })
          ids.forEach(id => {
            let json = deal(this.treeData, id)
            Object.keys(json).length != 0 && this.choseList.push(json)
            if(json.child && json.child.length > 0) {
              json.child.forEach(c => {
                Object.keys(c).length != 0 && this.choseList.push(c)
              })
            }
          })
          console.log(this.choseList);
        })
      }
    },
    async secondTaskAudit(params) {
      const res = await secondTask(params);
      const r = res.result;
      if (r) {
        this.list = r.parent_tasks.map((pt) => ({
          ...pt,
          children: map(
            filter(r.task, (t) => t.task_id === pt.task_id),
            (ft, i) => ({
              ...ft,
              parent_id: ft.task_id,
              task_id: i,
            })
          ),
        }));
        if (this.list.some((it) => it.chapter_name)) {
          this.addType = 2;
        }
        this.paramsObj = r;
        this.isSecond = true;
        this.tableLoading = false;
      }
    },
    //用户列表
    async getUserList(params) {
      const res = await getUserList(params);
      const userList = res.result.accounts.map((a) => ({
        key: a.userid,
        label: a.name,
      }));
      this.userList = userList;
    },
    async getGroupList(params) {
      const res = await getExpertList(params);
      this.groupList = res.result.map((r) => ({
        key: r.team_id,
        label: r.title,
      }));
    },
    //添加校验/审核人
    async handleReviewer(item, index) {
      const findI = findIndex(
        this.list,
        (it) => it?.task_id === item?.parent_id
      );
      if (this.isSecond && findI > -1) {
        this.index = findI;
        this.child = item;
        const { team_id } = this.list[findI];
        const memberRes = await getGrouper({ team_id });
        if (memberRes) {
          this.userList = memberRes.result.map((r) => ({
            key: r.userid,
            label: `${r.nickname}${
              r?.job?.id === "leader" ? `（${r.job.title}）` : ""
            }`,
          }));
        }
      } else {
        this.index = index;
      }
      this.dialogVisible = true;
      this.$nextTick(() => {
        let list;
        if (item.user_type === 1) {
          list = item.auditor.map((a) => a.id);
        } else if (item.user_type === 2) {
          list = [item.team_id];
        } else {
          list = [];
        }
        this.$refs.checkerSelectDialog.selectList = list;
        this.$refs.checkerSelectDialog.originSelectList = list;
        this.$refs.checkerSelectDialog.originType = item.user_type || 1;
        this.$refs.checkerSelectDialog.userType = item.user_type || 1;
      });
    },
    handleAddAudit() {
      this.auditorDialogVisible = true;
      this.$nextTick(() => {
        const { auditer, audit_type } = this.paramsObj;
        this.$refs.auditorSelectDialog.selectList = auditer;
        this.$refs.auditorSelectDialog.originSelectList = auditer;
        this.$refs.auditorSelectDialog.originType = audit_type;
        this.$refs.auditorSelectDialog.userType = audit_type;
      });
    },
    handleClick(item) {
      this.curTopic = item;
      this.obj = item;
    },
    //保存添加的审核人
    save() {
      const { selectList, userType } = this.$refs.checkerSelectDialog;
      const findCI = findIndex(
        this.list[this.index].children,
        (it) => it === this.child
      );
      if (this.isSecond && findCI > -1) {
        if (userType === 1) {
          this.list[this.index].children[findCI].user_type = 1;
          this.list[this.index].children[findCI].team_id = null;
          this.list[this.index].children[findCI].auditor = map(
            selectList,
            (id) => ({
              id,
              name: this.userList.find((u) => u.key === id)?.label,
            })
          );
        } else if (userType === 2) {
          this.list[this.index].children[findCI].user_type = 2;
          this.list[this.index].children[findCI].auditor = [];
          this.list[this.index].children[findCI].team_id = selectList[0];
        }
      } else {
        if (userType === 1) {
          this.list[this.index].user_type = 1;
          this.list[this.index].team_id = null;
          this.list[this.index].auditor = map(selectList, (id) => ({
            id,
            name: this.userList.find((u) => u.key === id)?.label,
          }));
        } else if (userType === 2) {
          this.list[this.index].user_type = 2;
          this.list[this.index].auditor = [];
          this.list[this.index].team_id = selectList[0];
        }
      }
      this.dialogVisible = false;
    },
    async saveAuditor() {
      const { selectList, userType } = this.$refs.auditorSelectDialog;
      try {
        const { status } = await submitAuditor({
          bid: this.bidObj.bid,
          audit_type: userType,
          auditers: selectList,
        });
        if (status === 200) {
          if (userType === 1) {
            this.auditors = selectList
              .map((a) => this.userList.find((u) => u.key === a)?.label)
              .join(",");
          } else if (userType === 2) {
            this.auditors = this.userList.find(
              (u) => u.key === selectList[0]
            )?.label;
          }
          this.$message.success("添加成功");
        } else {
          throw new Error("添加失败");
        }
      } catch (error) {
        console.error(error);
      }
    },
    closeDialog() {
      this.$refs.checkerSelectDialog.selectList = [];
      this.dialogFormVisible = false;
    },
    // 初始化表单
    resetTemp() {
      this.temp = {
        range: { from: null, to: null },
        auditor: [],
        rate: 0,
      };
    },
    // 新增
    handleCreate() {
      if (this.isSecond) {
        const index = findIndex(this.list, (it) => it === this.selectedRow);
        if (index > -1) {
          this.list[index].children.push({
            parent_id: this.selectedRow.task_id,
            task_id: this.list[index].children.length,
            range: { from: null, to: null },
            rate: 0,
            min: this.list[index].range.from,
            max: this.list[index].range.to,
          });
          console.log(this.list);
        }
      } else {
        this.resetTemp();
        this.list.push(this.temp);
        console.log(this.list);
      }
    },
    //添加章节
    handleAddFromCat(row) {
      if (this.isSecond) {
        const index = findIndex(this.list, (it) => it === this.selectedRow);
        this.list[index].children.push({
          range: {
            from: row.page,
            to: row.end_page,
          },
          parent_id: this.selectedRow.task_id,
          chapter_name: row.title,
          task_id: this.list[index].children.length,
          rate: 0,
          min: this.list[index].range.from,
          max: this.list[index].range.to,
          cata_id: row.cata_id
        });
      } else {
        this.resetTemp();
        this.list.push({
          ...this.temp,
          range: {
            from: row.page,
            to: row.end_page,
          },
          chapter_name: row.title,
          cata_id: row.cata_id
        });
      }
      const that = this
      const deal =(data, show=false) => {
        if(data.child && data.child.length > 0) {
          let list = []
          data.child.forEach((o) => {
            list = [...list, ...deal(o)]
          })
          return [
            ...list,
            ...(that.choseList.findIndex(o => o.cata_id === data.cata_id) < 0 ? [{...data, show: show}] : [])
          ]
        } else {
          return that.choseList.findIndex(o => o.cata_id === data.cata_id) < 0 ? [{...data,show: show}] : []
        }
      }
      const list = deal(row, true)
      this.choseList = [...this.choseList, ...list]
      console.log(this.choseList);
    },
    // 修改
    handleEdit(item) {
      // getInfo({ bid: item.bid }).then((res) => {
      //   this.temp = res.result;
      // });
      this.temp = item;
      this.dialogModel = "edit";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    //删除
    del(row, index) {
      if (this.isSecond) {
        const findI = findIndex(
          this.list,
          (it) => it.task_id === row.parent_id
        );
        if (findI > -1) {
          pull(this.list[findI].children, row);
        }
      } else {
        this.list.splice(index, 1);
      }
      if(this.addType === 2) {
        const list = this.choseList.filter(o => o.cata_id === row.cata_id)
        if(list[0].child && list[0].child.length > 0) {
          this.choseList = [...this.choseList.filter(i => i.pid !== row.cata_id && i.cata_id !== row.cata_id)]
        }else {
          const i = this.choseList.findIndex(j => j.cata_id === row.cata_id)
          if(i >= 0) {
            this.choseList.splice(i, 1)
          }
        }
      }
    },
    async saveAll() {
      try {
        const testTask = (task) => {
          if (isEmpty(task.auditor) && !task.team_id) {
            throw new Error("请添加校验人");
          }
          if (!this.isSecond && isEmpty(task.date)) {
            throw new Error("请选择任务期限");
          }
        };
        if (this.isSecond) {
          const task = [];
          this.list.forEach((it) => {
            it.children.forEach((c) => {
              testTask(c);
              task.push({
                ...c,
                task_id: it.task_id,
              });
            });
          });
          const res = await updateSecondTask({ bid: this.bidObj.bid, task });
          if (res.status === 200) {
            this.$message.success("保存成功");
            this.secondTaskAudit({ ...this.bidObj, team_ids: this.teamids });
          }
        } else {
          const res = await updateAuditing({
            bid: this.bidObj.bid,
            task: this.list.map((it) => {
              testTask(it);
              return {
                ...it,
                begin_time: it.date[0],
                end_time: it.date[1],
              };
            }),
            task_type: this.task_type,
          });
          if (res.status === 200) {
            this.$message.success("保存成功");
            this.taskAuditing(this.bidObj);
          }
        }
      } catch (error) {
        this.$message.error(error.message);
        console.error(error);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-tree-node__content {
  height: 36px;
}
.custom-tree-node {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  padding-right: 8px;
}
::v-deep .el-card__body {
  height: 100%;
  overflow: scroll;
}
::v-deep .el-table {
  .is-disabled > .el-input__inner,
  .is-disabled > .el-range-input,
  button.is-disabled > span {
    color: #606266;
  }
}
</style>
