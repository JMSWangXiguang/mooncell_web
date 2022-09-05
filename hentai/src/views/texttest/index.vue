<!--
 * @Description:
 * @version:
 * @Author: 周子尧
 * @Date: 2020-11-17 15:32:42
 * @LastEditors: imali
 * @LastEditTime: 2022-08-24 16:43:55
-->
<template>
  <div class="texttest">
    <div class="flex justify-between p-20px">
      <el-radio-group v-model="type">
        <el-radio-button :label="1">展示</el-radio-button>
        <el-radio-button :label="2" :disabled="!tested">标注</el-radio-button>
      </el-radio-group>
      <div v-show="type === 1">
        <el-select v-model="testModel.model" mr="20px" placeholder="请选择模型">
          <el-option
            v-for="m in modelList"
            :key="m.model_id"
            :label="m.name"
            :value="m.model_id"
          ></el-option>
        </el-select>
        <el-button mr="10px" type="success" @click="testShow">SHOW</el-button>
        <el-button type="primary">添加语料</el-button>
      </div>
      <div v-show="type === 2">
        <el-radio-group v-model="destinyMode" size="mini" mr="10px">
          <el-radio-button label="原始" />
          <el-radio-button label="词性" />
          <el-radio-button label="关系" />
        </el-radio-group>
        <p-button-dialog
          ref="saveDialog"
          :button="{ label: '保存', type: 'primary' }"
          title="保存标注"
          width="400px"
          destroy-on-close
        >
          <p-form
            ref="saveForm"
            v-model="saveModel"
            :items="[
              {
                prop: 'category',
                label: '分类',
                content: { is: 'el-select', placeholder: '请选择分类', class: 'w-full' },
                rules: [{ required: true, message: '请选择分类' }],
              },
              {
                prop: 'source',
                label: '机构',
                content: { is: 'el-select', placeholder: '请选择机构', class: 'w-full' },
              },
            ]"
            label-width="auto"
          >
            <template #category>
              <el-option
                v-for="{ category_id, name } in categoryList"
                :key="category_id"
                :label="name"
                :value="category_id"
              ></el-option>
            </template>
            <template #source>
              <el-option label="默认" :value="null"></el-option>
              <el-option
                v-for="{ name } in sourceList"
                :key="name"
                :label="name"
                :value="name"
              ></el-option>
            </template>
          </p-form>
          <template #footer>
            <el-button @click="$refs.saveDialog.dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="saveDestiny">提交</el-button>
          </template>
        </p-button-dialog>
      </div>
    </div>
    <el-divider m="0" />
    <el-row v-if="type === 1" px="10px" py="20px">
      <el-col :span="12" px="10px">
        <el-input
          v-model="testModel.content"
          type="textarea"
          resize="none"
          placeholder="请输入文本"
          show-word-limit
        ></el-input>
      </el-col>
      <el-col :span="12" px="10px">
        <p-table
          :columns="[
            { prop: 'time', label: '时间', align: 'right', width: '150px' },
            { prop: 'ship', label: '关系' },
          ]"
          :data="linkWord"
          :span-method="spanMethod"
          height="calc(100vh - 215px)"
        >
          <template #ship="{ row }">
            <template v-if="row.ship && row.ship.length">
              <span
                v-for="(s, i) in row.ship"
                :key="i"
                :set-key="(k = keys(s)[0])"
                class="word-wrapper"
              >
                <label v-if="keys(EFlag).includes(k)"> {{ EFlag[k] }} </label>
                <label v-else>
                  {{ s[k] }}
                </label>
                <el-tag size="mini" type="danger">{{ k }}</el-tag>
              </span>
            </template>
            <span v-else></span>
          </template>
        </p-table>
      </el-col>
    </el-row>
    <mark-tags
      v-else
      ref="markTags"
      :mode="destinyMode"
      :destiny="destiny"
      class="h-[calc(100vh-175px)] overflow-auto"
    />
  </div>
</template>
<script>
import { getList as getCategoryList, getSource } from '@/api/category'
import { getModelList } from '@/api/manage/nermodel'
import { getTest, saveTest } from '@/api/experiment'
import { groupBy, flatMap, keys, map, find, isEmpty, without } from 'lodash'
import MarkTags from '@/components/MarkTags'

const EFlag = {
  否定: '否',
  质疑: '疑',
  伴随: '伴',
}

export default {
  components: { MarkTags },
  data() {
    return {
      keys,
      EFlag,
      type: 1,
      categoryList: [],
      sourceList: [],
      modelList: [],
      testModel: {
        content: '',
        model: '',
      },
      saveModel: {
        category: '',
        source: null,
      },
      linkWord: [],
      destiny: [],
      destinyMode: '词性',
    }
  },
  computed: {
    tested() {
      return !isEmpty(this.destiny)
    },
  },
  async mounted() {
    const maxPager = { page: 1, size: 9999 }
    const categoryRes = await getCategoryList(maxPager)
    this.categoryList = categoryRes.result.category_list || []
    const sourceRes = await getSource(maxPager)
    this.sourceList = sourceRes.result.source_schema || []
    const { result } = await getModelList({ page: 1, size: 99 })
    this.modelList = result.model_list
  },
  methods: {
    spanMethod({ row, columnIndex }) {
      if (columnIndex === 0) {
        return [row.rowIndex, 1]
      }
    },
    async testShow() {
      if (!this.testModel.content) {
        return this.$message.error('请输入文本')
      }
      if (!this.testModel.model) {
        return this.$message.error('请选择模型')
      }
      const { result } = await getTest(this.testModel)
      if (!isEmpty(result)) {
        this.testModel.content = result.content
        this.linkWord = flatMap(
          groupBy(
            map(result.link_word, (words) => {
              const findTime = find(words, (w) => w['时间'])
              return {
                ship: without(words, findTime),
                time: findTime ? findTime['时间'] : '',
              }
            }),
            'time'
          ),
          (item) =>
            map(item, (it, i) => ({
              ...it,
              rowIndex: it.time ? (i === 0 ? item.length : 0) : 1,
            }))
        )
        this.destiny = result.destiny
      }
    },
    saveDestiny() {
      this.$refs.saveForm.$refs['p-form'].validate(async (valid) => {
        if (valid) {
          const { status } = await saveTest({
            ...this.testModel,
            ...this.saveModel,
            destiny: this.$refs.markTags.result,
          })
          if (status === 200) {
            this.$message.success('保存成功')
          }
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
:deep(.el-textarea__inner) {
  height: calc(100vh - 215px);
}
:deep(.cell) {
  overflow: visible;
  .word-wrapper {
    position: relative;
    word-break: keep-all;
    margin-right: 30px;
    .el-tag {
      transform: scale(0.7);
      position: absolute;
      right: -24px;
      top: -14px;
    }
  }
}
</style>
