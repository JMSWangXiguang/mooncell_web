<!--
 * @Author: imali
 * @Date: 2022-02-27 23:09:51
 * @LastEditTime: 2022-05-27 14:54:38
 * @LastEditors: 陈逸
 * @Description:
-->
<template>
  <div>
    <p-form
      ref="refer-form"
      inline
      v-model="model"
      :items="items"
      :rules="rules"
    >
      <template #refer>
        <el-radio-button :label="1">指派到人</el-radio-button>
        <el-radio-button :label="2">指派到组</el-radio-button>
      </template>
      <template #type>
        <el-option
          v-for="t in approveType"
          :key="t.id"
          :value="t.id"
          :label="t.name"
        ></el-option>
      </template>
    </p-form>
    <p-table
      v-loading="loading"
      ref="refer-table"
      height="calc(100vh - 500px)"
      highlight-current-row
      :row-class-name="({ row }) => (row.status === 2 ? 'text-[#f5222d]' : '')"
      :data="list"
      :columns="columns"
      :pagination="pagination"
      @current-change="(row) => (selectRow = row)"
    >
      <template #name-header>
        <el-input
          v-model="search"
          size="mini"
          placeholder="输入姓名搜索"
          @change="fetchUserList"
        ></el-input>
      </template>
      <template #tag="{ row }">
        <span>
          <el-tag v-if="row.is_common === '0'" type="warning">常用</el-tag>
        </span>
      </template>
    </p-table>
  </div>
</template>
<script>
import { getUserList, getExpertList } from "@/api/operate/group";
export default {
  data() {
    return {
      loading: false,
      search: "",
      total: 0,
      pager: {
        page: 1,
        size: 20,
      },
      model: {
        refer: 1,
        date: [],
      },
      list: [],
      selectRow: {},
      approveType: [
        { id: "0", name: "半数通过" },
        { id: "1", name: "全票通过" },
      ],
      pickerOptions:{
        disabledDate(v) {
          return v.getTime() < new Date().getTime() - 86400000;
        }
      },
    }
  },
  computed: {
    pagination() {
      return {
        total: this.model.refer === 1 ? this.total : 0,
        hideOnSinglePage: true,
        layout: "total, sizes, prev, pager, next, jumper",
        "page-sizes": [20, 50, 100, 200],
        "current-change": (page) => {
          this.pager.page = page;
          this.fetchUserList();
        },
        "size-change": (size) => {
          this.pager.size = size;
          this.fetchUserList();
        }
      }
    },
    items() {
      const items = [
        {
          prop: "refer",
          labelWidth: "0px",
          content: {
            is: "el-radio-group"
          }
        },
        {
          prop: "date",
          label: "审核日期",
          content: {
            is: "el-date-picker",
            type: "daterange",
            class: "w-260px",
            rangeSeparator: "至",
            startPlaceholder: "开始日期",
            endPlaceholder: "结束日期",
            valueFormat: "yyyy-MM-dd",
            pickerOptions: this.pickerOptions
          }
        }
      ]
      return this.model.refer === 1
        ? items
        : [
            ...items,
            {
              prop: "type",
              label: "审批策略",
              content: {
                is: "el-select",
                placeholder: "请选择审批策略"
              }
            }
          ]
    },
    rules() {
      const rules = {
        date: [{ required: true, message: "请选择审核日期" }]
      }
      return this.model.refer === 1
        ? rules
        : {
            ...rules,
            type: [{ required: true, message: "请选择审批策略" }]
          }
    },
    columns() {
      return this.model.refer === 1
        ? [
            {
              prop: "name",
              header: true
            },
            {
              label: "性别",
              prop: "sex",
              width: 50
            },
            {
              label: "科室",
              prop: "department_name"
            },
            {
              label: "身份",
              prop: "identify"
            },
            {
              label: "机构",
              prop: "organization_name"
            },
            {
              label: "职称",
              prop: "job_title"
            },
            {
              label: "学位",
              prop: "education"
            }
          ]
        : [
            { 
              label: "分组名称",
              prop: "title"
            },
            {
              label: "分组标签",
              prop: "tag"
            },
            {
              label: "组长",
              prop: "owner.name"
            }
          ]
    }
  },
  watch: {
    "model.refer": {
      handler(r) {
        this.loading = true
        this.$refs["refer-table"]?.$refs["p-table"].doLayout()
        if (r === 1) {
          this.fetchUserList()
        }
        if (r === 2) {
          this.fetchGroupList()
        }
      },
      immediate: true
    }
  },
  methods: {
    async fetchUserList() {
      const { result } = await getUserList({
        nickname: this.search,
        status: 1,
        ...this.pager
      });
      this.list = result.accounts;
      this.total = result.total;
      this.selectRow = {};
      this.$refs["refer-form"]?.$refs["p-form"].clearValidate();
      this.loading = false;
    },
    async fetchGroupList() {
      const { result } = await getExpertList();
      this.list = result;
      this.selectRow = {};
      this.$refs["refer-form"]?.$refs["p-form"].clearValidate();
      this.loading = false;
    }
  }
};
</script>
