<!--
 * @Author: imali
 * @Date: 2022-07-19 11:27:58
 * @LastEditTime: 2022-08-24 18:31:47
 * @LastEditors: imali
 * @Description:
-->
<template>
  <div class="flex h-full">
    <div class="basis-320px">
      <div class="m-10px p-10px h-[calc(100%-20px)] bg-white">
        <el-radio-group v-model="wordFlag">
          <el-radio-button v-for="(v, k) in wordFlags" :label="k" :key="k">
            {{ v }}
          </el-radio-button>
        </el-radio-group>
        <div class="flex mt-10px">
          <div class="mr-10px">
            <el-select class="w-full" v-model="searchModel.topic" filterable>
              <el-option label="所有" value="all"></el-option>
              <el-option
                v-for="s in speechList"
                :key="s.speech_id"
                :value="s.speech_id"
                :label="s.name"
              />
            </el-select>
            <el-input
              class="mt-5px"
              prefix-icon="el-icon-search"
              v-model="searchModel.search"
            ></el-input>
          </div>
          <el-button type="primary" class="px-10px text-sm" @click="setWordList">搜 索</el-button>
        </div>
        <div class="mt-10px h-[calc(100%-160px)] scrollbar-thin border-1px rounded-4px">
          <ul v-infinite-scroll="loadMoreWords" infinite-scroll-disabled="moreDisabled">
            <li
              v-for="w in wordList"
              :key="w.id"
              :class="`cursor-pointer px-10px leading-36px ${
                wordId === w.id ? 'active-color' : 'hover:bg-background-color-base'
              }`"
              @click="wordId = w.id"
            >
              {{ w.topic }} - {{ w.word }}
              <label v-if="w.count">（{{ w.count }}）</label>
            </li>
          </ul>
          <div class="py-10px text-center text-sm text-color-text-secondary">
            <span v-if="wordLoading">加载中...</span>
            <span v-if="noMore">没有更多了~</span>
          </div>
        </div>
        <div class="flex justify-between mt-8px">
          <el-checkbox-group v-model="langModel">
            <el-checkbox-button label="chn">中文</el-checkbox-button>
            <el-checkbox-button label="eng">英文</el-checkbox-button>
            <el-checkbox-button label="symbol">标点</el-checkbox-button>
          </el-checkbox-group>
          <el-button v-if="wordFlag !== 'processed'" type="success" class="h-32px" @click="addWord">
            创建词汇
          </el-button>
        </div>
      </div>
    </div>
    <div class="flex-auto">
      <div class="m-10px p-20px h-[calc(100%-20px)] bg-white">
        <div class="flex text-xl justify-between">
          <span>
            <b>{{ wordFlags[wordFlag] }}</b>
            <span v-if="showWord" class="ml-8">{{ showWord }}</span>
            <span v-if="mappings.length">（{{ mappings.length }}）</span>
          </span>
          <div v-if="wordFlag !== 'ignore'">
            <el-button type="primary" @click="doSave" :disabled="!mappings.length">保存</el-button>
            <el-button v-if="wordId" type="danger" @click="doIgnore">忽略</el-button>
          </div>
          <el-button v-else-if="wordId" type="primary" @click="doReduce">还原</el-button>
        </div>
        <div class="flex mt-10px h-[calc(100%-40px)]">
          <div v-loading="mapLoading" class="flex-1 border-1px scrollbar-thin">
            <el-empty v-if="!mapLoading && !mappings.length" class="h-full" />
            <el-form
              v-else
              v-for="(m, i) in mappings"
              :key="i"
              :disabled="wordFlag === 'ignore'"
              class="flex justify-between border m-10px px-20px bg-white"
              label-width="auto"
            >
              <div class="mt-20px">
                <el-form-item label="术语主题">
                  <el-input v-model="m.topic_title" readonly></el-input>
                </el-form-item>
                <el-form-item label="术语名称">
                  <el-input v-model="m.vertex_title" readonly></el-input>
                </el-form-item>
                <el-form-item label="映射类型">
                  <el-select v-model="m.policy_id">
                    <el-option
                      v-for="p in policyList"
                      :key="p.policy_id"
                      :label="p.title"
                      :value="p.policy_id"
                    />
                  </el-select>
                </el-form-item>
              </div>
              <el-button
                v-if="wordFlag !== 'ignore'"
                type="danger"
                size="medium"
                icon="el-icon-close"
                class="self-center p-6px"
                circle
                @click="$delete(mappings, i)"
              ></el-button>
            </el-form>
          </div>
          <div class="basis-100px text-center self-center">
            <i class="el-icon-arrow-left text-6xl text-color-text-placeholder"></i>
          </div>
          <div class="flex flex-1 border-1px">
            <div class="flex-1">
              <el-input
                placeholder="输入关键字进行过滤"
                v-model="filterText"
                class="children:border-none"
              ></el-input>
              <el-tree
                ref="tree"
                v-loading="treeLoading"
                :data="treeList"
                :props="{ label: 'title', children: 'child' }"
                :filter-node-method="filterNode"
                node-key="vid"
                class="scrollbar-thin h-[calc(100%-32px)] bg-[#f4f4f5]"
              >
                <template #default="{ node, data }">
                  <div class="w-full">
                    <el-button
                      v-if="node.data.type === 'node'"
                      type="primary"
                      icon="el-icon-back"
                      class="absolute left-4px mt-6px p-0 w-5 h-5"
                      :disabled="wordFlag === 'ignore'"
                      circle
                      @click.stop="pushMappings(data)"
                    ></el-button>
                    <span>{{ node.label }}</span>
                  </div>
                </template>
              </el-tree>
            </div>
            <ul class="basis-150px h-full scrollbar-thin border-l">
              <li
                v-for="t in topicList"
                :key="t.id"
                :class="`cursor-pointer px-10px leading-36px ${
                  topicId === t.id ? 'active-color' : 'hover:bg-background-color-base'
                }`"
                @click="topicId = t.id"
              >
                {{ t.title }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as MappingApi from '@/api/mapping'
import { getTopicList } from '@/api/knowledge/classification'
import { getTreeList } from '@/api/knowledge/node'
import { getSpeechByType } from '@/api/speech'
import AddWord from './add-word.vue'
import { v4 as uuidv4 } from 'uuid'
export default {
  data() {
    return {
      searchModel: {
        topic: 'all',
        search: '',
        chn: true,
        eng: true,
        symbol: true,
        page: 1,
        size: 30,
      },
      langModel: ['chn', 'eng', 'symbol'],
      wordTotal: 0,
      wordLoading: false,
      treeLoading: false,
      mapLoading: false,
      wordFlag: 'unprocess',
      wordFlags: {
        unprocess: '未映射词汇',
        processed: '已映射词汇',
        ignore: '已忽略词汇',
      },
      filterText: '',
      policyList: [],
      wordId: '',
      wordList: [],
      topicList: [],
      topicId: '',
      treeList: [],
      speechList: [],
      mappings: [],
      newWordModel: {},
    }
  },
  computed: {
    showWord() {
      const i = this.wordList.findIndex((w) => w.id === this.wordId)
      if (this.newWordModel?.word) {
        return this.newWordModel.word
      } else if (i > -1) {
        return this.wordList[i].word
      } else {
        return ''
      }
    },
    noMore() {
      return this.wordList.length >= this.wordTotal
    },
    moreDisabled() {
      return this.wordLoading || this.noMore
    },
    topicIndex() {
      return this.topicList.findIndex((t) => t.id === this.topicId)
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    async wordFlag(flag) {
      this.searchModel = {
        ...this.searchModel,
        topic: 'all',
        search: '',
        page: 1,
      }
      this.mappings = []
      this.wordId = ''
      this.newWordModel = {}
      this.wordList = []
      this.wordTotal = 0
      this.wordList = await this.getWordList(flag)
    },
    async topicId(topic) {
      this.treeLoading = true
      this.treeList = (await getTreeList({ topic })).result.schema
      this.treeLoading = false
    },
    async wordId(word_id) {
      if (word_id && this.wordFlag === 'processed') {
        this.newWordModel = {}
        this.mapLoading = true
        this.mappings = (await MappingApi.getProcessed({ word_id })).result.mappings
        this.mapLoading = false
      } else {
        const findModel = this.wordList.find((w) => w.unprocess_id === word_id)
        this.newWordModel = {
          ...findModel,
          topic_title: findModel.topic,
        }
        this.mappings = []
      }
    },
    langModel(lang) {
      this.searchModel = {
        ...this.searchModel,
        chn: lang.includes('chn'),
        eng: lang.includes('eng'),
        symbol: lang.includes('symbol'),
      }
    },
  },
  async mounted() {
    this.getPolicy()
    this.setWordList()
    this.topicList = (await getTopicList({})).result.categories
    this.speechList = (await getSpeechByType({ category_id: null })).result.speech_schema
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.title.indexOf(value) !== -1
    },
    async getPolicy() {
      this.policyList = (await MappingApi.getPolicyList()).result.policies
    },
    async getWordList(flag) {
      const { pending, total } = (
        await MappingApi[`${this.wordFlag || flag}List`](this.searchModel)
      ).result
      this.wordTotal = total
      return pending.map((p) => ({
        ...p,
        id: p.unprocess_id || p.id,
      }))
    },
    async setWordList() {
      this.wordList = []
      this.wordTotal = 0
      this.wordList = await this.getWordList()
    },
    async loadMoreWords() {
      this.wordLoading = true
      this.searchModel.page++
      this.wordList.push(...(await this.getWordList()))
      this.wordLoading = false
    },
    pushMappings(data) {
      if (!this.showWord) {
        return this.$message.error('请先选择或创建词汇')
      }
      this.mappings.push({
        topic_title: this.topicList[this.topicIndex].title,
        topic_id: this.topicId,
        vertex_title: data.title,
        vertex_id: data.vid,
      })
    },
    addWord() {
      this.wordId = ''
      this.newWordModel = {}
      this.$msgbox({
        title: '创建词汇',
        message: this.$createElement(AddWord, {
          key: uuidv4(),
          props: { speechList: this.speechList, policyList: this.policyList },
        }),
        showCancelButton: true,
        beforeClose: this.beforeAddWordClose,
      }).catch(() => {})
    },
    beforeAddWordClose(action, instance, done) {
      const cInstance = instance.$children.find((it) => it.wordModel)
      if (action === 'confirm') {
        const { $refs, wordModel } = cInstance
        $refs.form.validate(async (valid) => {
          if (!valid) {
            return
          }
          const { exist } = (await MappingApi.checkWord(wordModel)).result
          if (exist) {
            return this.$message.error('该词汇已存在')
          }
          if (this.wordFlag === 'ignore') {
            const { status } = (await MappingApi.createIgnore(wordModel)).result
            if (status === 200) {
              this.$message.success('创建成功')
              this.setWordList()
            }
          } else {
            this.$message.success('词汇未录入，可以进行映射')
            this.newWordModel = wordModel
          }
          done()
        })
      } else {
        done()
      }
    },
    async doSave() {
      const { wordId, showWord, topicId, topicList, mappings, newWordModel } = this
      let status = 0
      switch (this.wordFlag) {
        case 'unprocess':
          status = (await MappingApi.createPending({ ...newWordModel, mappings })).status
          break
        case 'processed':
          status = (
            await MappingApi.updatePending({
              process_id: wordId,
              word: showWord,
              topic_id: topicId,
              topic_title: topicList.find((t) => t.id === topicId)?.title,
              mappings,
            })
          ).status
          break
      }
      if (status === 200) {
        if (this.wordFlag === 'unprocess') {
          this.mappings = []
        }
        this.$message.success('保存成功')
        this.newWordModel = {}
        this.setWordList()
      }
    },
    async doIgnore() {
      const { status } = await MappingApi.createIgnore({
        word: this.showWord,
        unprocess_id: this.wordId,
      })
      if (status === 200) {
        this.$message.success('忽略成功')
        const i = this.wordList.findIndex((w) => w.id === this.wordId)
        if (i > -1) {
          this.wordList.splice(i, 1)
        }
        this.wordId = ''
        this.mappings = []
      }
    },
    async doReduce() {
      const { status } = await MappingApi.reduceIgnore({ word_id: this.wordId })
      if (status === 200) {
        this.$message.success('还原成功')
        const i = this.wordList.findIndex((w) => w.id === this.wordId)
        if (i > -1) {
          this.wordList.splice(i, 1)
        }
        this.wordId = ''
      }
    },
  },
}
</script>
<style lang="scss" scoped>
$--color-primary-light: rgba($--color-primary, 0.8);
.active-color {
  background: $--color-primary-light;
  color: white;
}
:deep {
  .el-tree-node__content {
    height: 30px;
    line-height: 32px;
    margin-left: 20px;
  }
}
</style>
