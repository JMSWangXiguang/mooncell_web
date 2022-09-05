<!--
 * @Author: imali
 * @Date: 2022-04-27 17:50:59
 * @LastEditTime: 2022-07-21 15:08:26
 * @LastEditors: imali
 * @Description:
-->
<template>
  <el-row type="flex" class="h-full">
    <el-col :span="12" class="h-full flex-auto scrollbar-thin">
      <template v-if="pane === 'id'">
        <div class="mb-10px">
          <el-input class="w-[calc(100%-70px)]" v-model="doc_id"></el-input>
          <el-button type="primary" class="ml-10px" @click="doRefresh">刷 新</el-button>
        </div>
        <p-table
          :columns="columns"
          :data="tableData"
          :show-header="false"
          height="calc(100% - 43px)"
        ></p-table>
      </template>
      <template v-else>
        <div v-if="isEmpty(items)" class="el-table__empty-block w-full h-full">
          <span class="el-table__empty-text text-xs">暂无数据</span>
        </div>
        <p-form v-else v-model="model" :items="items" class="mr-8px"></p-form>
      </template>
    </el-col>
    <el-col class="h-full flex flex-col basis-80px justify-center px-10px">
      <el-button type="primary" @click="qualityTest">质 控</el-button>
    </el-col>
    <el-divider direction="vertical" class="h-full m-0" />
    <el-col v-loading="urlLoading" class="h-full basis-300px mx-auto">
      <iframe v-if="url" :src="url" class="h-full border-1px border-l-0" />
    </el-col>
  </el-row>
</template>
<script>
import { curryTest, couvaTest, getBaseInfo } from '@/api/inference'
import { map, isEmpty } from 'lodash'
export default {
  props: {
    pane: {
      type: String,
      required: true,
    },
    env: {
      type: String,
      required: true,
    },
    chapter_id: {
      type: String,
      required: true,
    },
    rules: {
      type: Array,
      required: true,
    },
    children: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isEmpty,
      urlLoading: false,
      url: '',
      doc_id: '',
      tableData: [],
      chapters: [],
      model: {},
      columns: [{ prop: 'key' }, { prop: 'val' }],
    }
  },
  computed: {
    items() {
      return map(this.children, (it) => ({
        prop: it.chapter_id,
        label: it.title,
        content: {
          is: 'el-input',
          type: 'textarea',
          rows: 4,
          resize: 'none',
        },
      }))
    },
  },
  methods: {
    async doRefresh() {
      const { env, doc_id } = this
      const { result } = await getBaseInfo({
        doc_id,
        env,
      })
      this.tableData = result
    },
    async qualityTest() {
      const { rules, env, chapter_id, doc_id } = this
      this.url = ''
      this.urlLoading = true
      if (this.pane === 'id') {
        const { result } = await curryTest({
          rules,
          doc_id,
          chapter_id,
          env,
        })
        this.url = result.sidebar_redict_url
      } else {
        const { result } = await couvaTest({
          env,
          rules,
          chapter_id,
          content: map(this.children, (it) => ({
            chapter_id: it.chapter_id,
            chapter_name: it.title,
            body: this.model[it.chapter_id],
            justify: true,
          })),
        })
        this.url = result.sidebar_redict_url
        // ToDo: Debug iframe
        // this.url = this.url.replace('http://47.96.109.226:6017', 'http://localhost:3000')
      }
      this.urlLoading = false
    },
  },
}
</script>
