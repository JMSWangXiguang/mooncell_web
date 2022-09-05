<!--
 * @Author: imali
 * @Date: 2022-05-04 14:44:25
 * @LastEditTime: 2022-06-14 19:57:35
 * @LastEditors: imali
 * @Description:
-->
<template>
  <p-table :data="versionList" :columns="columns" height="60vh">
    <template #version="{ row }">
      <span v-if="!row.edit">{{ row.version }}</span>
      <el-input v-else v-model="row.version"></el-input>
    </template>
    <template #status="{ row }">
      <span v-if="row.status === 0" class="text-color-primary text-sm font-extrabold">
        当前版本
      </span>
      <span v-if="row.status === 1" class="text-color-info text-sm font-extrabold">未使用</span>
      <span v-if="row.status === 2" class="text-color-warning text-sm font-extrabold">切换中</span>
      <span v-if="row.status === 3" class="text-color-danger text-sm font-extrabold">切换失败</span>
    </template>
    <template #sync="{ row }">
      <div>
        {{ row.sync_status === '0' ? '同步成功' : '' }}
        {{ row.sync_status === '2' ? '同步中' : '' }}
        {{ row.sync_status === '3' ? '同步失败' : '' }}
      </div>
      <div>{{ row.sync_time }}</div>
    </template>
    <template #remark="{ row }">
      <span v-if="!row.edit">{{ row.remark }}</span>
      <el-input v-else v-model="row.remark"></el-input>
    </template>
    <template #action="{ row, index }">
      <el-button v-if="row.status && !row.edit" type="text" @click="toggle(row)">切换</el-button>
      <template v-if="row.edit">
        <el-button type="text" @click="confirm(row)" class="text-[#56d1a5]">保存</el-button>
        <el-button
          type="text"
          @click="row.create ? $delete(versionList, index) : $set(row, 'edit', false)"
        >
          取消
        </el-button>
      </template>
      <el-button v-else type="text" @click="$set(row, 'edit', true)">修改</el-button>
      <el-button
        v-if="row.status && !row.edit"
        type="text"
        @click="del(row)"
        class="text-color-danger"
      >
        删除
      </el-button>
    </template>
  </p-table>
</template>
<script>
import {
  createVersion,
  deleteVersion,
  getVersionList,
  updateVersion,
} from '@/api/datagraph/version'
import { toggleVersion } from '@/api/datagraph/knowledge'
import { concat, findIndex, trim } from 'lodash'
export default {
  props: ['current'],
  data() {
    return {
      versionList: [],
      columns: [
        {
          prop: 'version',
          label: '版本',
        },
        {
          prop: 'status',
          label: '状态',
          width: 80,
        },
        {
          prop: 'update_time',
          label: '修改时间',
          width: 150,
        },
        {
          prop: 'sync',
          label: '同步状态',
          width: 150,
        },
        {
          prop: 'remark',
          label: '备注',
        },
        {
          prop: 'action',
          label: '操作',
          width: 160,
        },
      ],
      rules: {
        version: [{ required: true, message: '请输入版本', trigger: 'change' }],
      },
      selectRow: null,
    }
  },
  computed: {
    editIndex() {
      return findIndex(this.versionList, 'edit')
    },
  },
  mounted() {
    this.fetchVersionList()
  },
  methods: {
    async fetchVersionList() {
      this.versionList = (await getVersionList()).result
    },
    add() {
      this.versionList = concat(
        [
          {
            version: '',
            update_time: '',
            remark: '',
            edit: true,
            create: true,
          },
        ],
        this.versionList
      )
    },
    async confirm(row) {
      const { id, create } = row
      const { version, remark } = this.versionList[this.editIndex]
      if (!trim(version)) {
        return this.$message.error('请输入版本')
      }
      if (id && !create) {
        const { status } = await updateVersion({ version_id: id, version, remark })
        if (status === 200) {
          this.$message.success('更新成功')
          this.fetchVersionList()
        }
      } else {
        const { status } = await createVersion({ version, remark })
        if (status === 200) {
          this.$message.success('创建成功')
          this.fetchVersionList()
        }
      }
    },
    cancel() {
      const { create } = this.versionList[this.editIndex]
      if (create) {
        this.$delete(this.versionList, this.editIndex)
      } else {
        this.versionList[this.editIndex].edit = false
      }
    },
    async toggle(row) {
      const { status } = await toggleVersion({
        version_id: row.id,
        version: row.version,
      })
      if (status === 200) {
        this.$message.success('请求成功，请等待')
      }
    },
    async del(row) {
      const { id } = row
      const { status } = await deleteVersion({ version_id: id })
      if (status === 200) {
        this.$message.success('删除成功')
        const i = findIndex(this.versionList, row)
        this.$delete(this.versionList, i)
      }
    },
  },
}
</script>
