<!--
 * @Author: imali
 * @Date: 2022-04-24 14:47:50
 * @LastEditTime: 2022-06-24 11:11:10
 * @LastEditors: imali
 * @Description:
-->
<template>
  <div class="flex px-10px">
    <div class="w-1/3 min-w-300px p-10px">
      <el-radio-group v-model="type">
        <el-radio-button label="depart">{{ EType.depart }}</el-radio-button>
        <el-radio-button label="law">{{ EType.law }}</el-radio-button>
      </el-radio-group>
      <el-button v-if="group" type="danger" class="float-right" @click="deleteGroup">
        删除
      </el-button>
      <el-tree
        v-loading="treeLoading"
        ref="tree"
        node-key="group_id"
        :data="groupList"
        :props="{ label: 'title', value: 'group_id' }"
        class="mt-10px border-1px h-[calc(100vh-170px)] scrollbar-thin"
        highlight-current
        @node-click="nodeClick"
      ></el-tree>
    </div>
    <div class="m-10px w-full">
      <div class="mb-10px">
        <el-button
          :type="flag === 'create' && type === 'depart' ? 'primary' : undefined"
          @click="createDepart"
          class="font-bold"
        >
          新建科室
        </el-button>
        <el-button
          :type="flag === 'create' && type === 'law' ? 'primary' : undefined"
          @click="createLaw"
          class="font-bold"
        >
          新建规范
        </el-button>
        <el-button type="success" class="font-bold" @click="doSync">同步科室信息</el-button>
      </div>
      <el-card
        shadow="never"
        size="medium"
        class="h-[calc(100vh-170px)] scrollbar-thin"
      >
        <template #header>
          <div v-if="flag === 'create'">
            新建{{ EType[type] }}
            <el-button type="primary" class="float-right" @click="submitCreate">提 交</el-button>
          </div>
          <div v-else-if="flag === 'edit'">
            {{ group.title }}
            <el-button type="primary" class="float-right" @click="submitUpdate">更 新</el-button>
          </div>
          <span v-else>ㅤ</span>
        </template>
        <p-form
          ref="form"
          v-loading="formLoading"
          v-model="model"
          :items="items"
          :disabled="!flag"
          label-width="auto"
          class="w-3/4 min-w-600px mt-1/24 mx-auto"
        >
          <template #type>
            <el-option label="规范" value="law">规范</el-option>
            <el-option label="科室" value="depart">科室</el-option>
          </template>
          <template #[`scope.depart`]>
            <el-option
              v-for="item in departList"
              :key="item.depart_id"
              :label="item.title"
              :value="item.depart_id"
            >
            </el-option>
          </template>
        </p-form>
      </el-card>
    </div>
  </div>
</template>
<script>
import {
  getRgroupList,
  getRgroupInfo,
  getDepartList,
  rgroupCreate,
  rgroupUpdate,
  rgroupDelete,
  syncDepart,
} from '@/api/rule/rule'
import { compact } from 'lodash'

const EType = {
  depart: '科室',
  law: '规范',
}

const model = {
  duration: {
    start: '',
    end: '',
  },
  scope: {
    depart: [],
  },
}

export default {
  data() {
    return {
      EType,
      treeLoading: false,
      formLoading: false,
      flag: '',
      type: 'depart',
      group: null,
      groupList: [],
      departList: [],
      model,
    }
  },
  computed: {
    items() {
      return compact([
        {
          label: '规则组名称',
          prop: 'title',
          content: {
            is: 'el-input',
            placeholder: '请输入名称',
          },
          rules: {
            required: true,
            message: '请输入名称',
            trigger: 'blur',
          },
          class: 'inline-block w-2/5',
        },
        {
          label: '规则组类型',
          prop: 'type',
          content: {
            is: 'el-select',
            class: 'w-full',
          },
          rules: {
            required: true,
            message: '请输入类型',
            trigger: 'blur',
          },
          class: 'inline-block w-2/5 ml-1/5',
        },
        {
          label: '开始日期',
          prop: 'duration.start',
          content: {
            is: 'el-date-picker',
            class: 'w-full',
          },
          class: 'inline-block w-2/5',
        },
        {
          label: '结束日期',
          prop: 'duration.end',
          content: {
            is: 'el-date-picker',
            class: 'w-full',
          },
          class: 'inline-block w-2/5 ml-1/5',
        },
        {
          label: '状态',
          prop: 'status',
          content: {
            is: 'el-switch',
            activeText: '启用',
            inactiveText: '停用',
            activeValue: 'access',
            inactiveValue: 'ban',
            activeColor: '#56d1a5',
          },
          rules: {
            required: true,
            message: '请选择状态',
            trigger: 'blur',
          },
          class: 'inline-block w-2/5',
        },
        this.type === 'depart' && {
          label: '科室',
          prop: 'scope.depart',
          content: {
            is: 'el-select',
            class: 'w-full',
            multiple: true,
            filterable: true,
          },
          class: 'inline-block w-2/5 ml-1/5',
        },
        {
          label: '描述',
          prop: 'desc',
          content: {
            is: 'el-input',
            type: 'textarea',
            rows: 8,
          },
        },
      ])
    },
  },
  watch: {
    type: {
      async handler(type) {
        this.fetchGroupList(type)
      },
      immediate: true,
    },
    async 'group.group_id'(group_id) {
      if (!group_id) {
        return
      }
      this.formLoading = true
      const { result } = await getRgroupInfo({ group_id })
      this.model = {
        ...result,
        duration: {
          start: '2022-11-21',
          end: '2022-11-21',
        },
      }
      this.formLoading = false
    },
  },
  async mounted() {
    const res = await getDepartList({ clinical: true })
    this.departList = res.result.departs
  },
  methods: {
    async fetchGroupList(type) {
      this.treeLoading = true
      const { result } = await getRgroupList({ type })
      this.groupList = result.groups
      this.treeLoading = false
    },
    createDepart() {
      this.group = null
      this.$refs.tree.setCurrentKey(null)
      this.model = model
      if (this.flag === 'create') {
        if (this.type === 'depart') {
          this.flag = ''
        } else {
          this.type = 'depart'
        }
      } else {
        this.flag = 'create'
        this.type = 'depart'
      }
    },
    createLaw() {
      this.group = null
      this.$refs.tree.setCurrentKey(null)
      this.model = model
      if (this.flag === 'create') {
        if (this.type === 'law') {
          this.flag = ''
        } else {
          this.type = 'law'
        }
      } else {
        this.flag = 'create'
        this.type = 'law'
      }
    },
    nodeClick(data) {
      const { tree } = this.$refs
      if (data.group_id === this.group?.group_id) {
        this.flag = null
        this.group = null
        tree.setCurrentKey(null)
        this.model = model
      } else {
        this.flag = 'edit'
        this.group = data
      }
    },
    submitCreate() {
      this.$refs.form.$refs['p-form'].validate(async (valid) => {
        if (valid) {
          const { status } = await rgroupCreate(this.model)
          if (status == 200) {
            this.$message.success('创建成功')
          }
          this.fetchGroupList(this.type)
        }
      })
    },
    submitUpdate() {
      this.$refs.form.$refs['p-form'].validate(async (valid) => {
        if (valid) {
          const { status } = await rgroupUpdate(this.model)
          if (status == 200) {
            this.$message.success('更新成功')
          }
          this.fetchGroupList(this.type)
        }
      })
    },
    async deleteGroup() {
      await this.$confirm('确定删除该信息吗?', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
      })
      const { group_id } = this.group
      const { status } = await rgroupDelete({ group_id, clean: true })
      if (status === 200) {
        this.$message.success('删除成功')
        this.fetchGroupList(this.type)
      }
    },
    async doSync() {
      const { status } = await syncDepart()
      if (status === 200) {
        this.$message.success('同步成功')
      }
    },
  },
}
</script>
<style lang="scss" scoped>
:deep {
  .el-button--default {
    color: $--color-primary;
    border-color: #d4effa;
    background-color: #f1fafd;
  }
  .el-tree-node__content {
    height: 36px;
  }
  .el-form-item {
    margin-bottom: 8%;
  }
}
</style>
