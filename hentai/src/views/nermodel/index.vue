<!--
 * @Description:
 * @version:
 * @Author: 周子尧
 * @Date: 2020-11-17 15:34:11
 * @LastEditors: imali
 * @LastEditTime: 2022-06-15 09:26:31
-->
<template>
  <div class="nermodel" v-loading="loading" h="[calc(100vh-100px)]">
    <p-button-dialog
      :button="{ label: '创建模型', type: 'primary', class: 'mx-24px my-12px' }"
      width="650px"
      title="ㅤ"
      destroy-on-close
    >
      <model-info
        :category-list="category_list"
        :source-list="source_list"
        :dept-list="dept_list"
        :model-schema="model_schema"
        :user-list="user_list"
      />
    </p-button-dialog>
    <el-empty v-if="!loading && !modelList.length" :image-size="200" h="full"></el-empty>
    <template v-else>
      <el-row class="mx-12px" :gutter="24">
        <el-col
          v-for="model in modelList"
          :key="model.model_id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          :xl="6"
          class="mb-24px"
        >
          <p-button-dialog :visible.sync="model.visible" width="650px" title="ㅤ" destroy-on-close>
            <template #trigger>
              <el-card cursor="pointer" @click.native="goModelInfo(model)">
                <template #header>
                  <label text="lg">{{ model.name }}</label>
                </template>
                <p
                  :mb="`${model.status === EStatus['训练中'] ? '5px' : '12px'}`"
                  h="60px"
                  overflow="y-auto"
                  break="words"
                >
                  {{ model.desc }}
                </p>
                <template v-if="model.status === EStatus['训练中']">
                  <p indent="lg">
                    状态
                    <label ml="20px" :class="`text-${model.status}`">
                      {{ EStatus[model.status] }}
                    </label>
                  </p>
                  <p indent="lg">
                    耗时<label ml="20px">{{ model.consuming }}</label>
                  </p>
                  <p indent="lg">
                    进度
                    <el-progress
                      :percentage="model.rate * 100"
                      :show-text="false"
                      :stroke-width="10"
                      ml="16px"
                      w="1/2"
                      inline="block"
                    ></el-progress>
                  </p>
                </template>
                <template v-else>
                  <p indent="lg" mb="10px">
                    状态
                    <label ml="20px" :class="`text-${model.status}`">
                      {{ EStatus[model.status] }}
                    </label>
                  </p>
                  <p>
                    更新时间<label ml="20px">{{ model.update_time }}</label>
                  </p>
                </template>
              </el-card>
            </template>
            <model-info
              :ref="model.model_id"
              :category-list="category_list"
              :source-list="source_list"
              :dept-list="dept_list"
              :model-schema="model_schema"
              :user-list="user_list"
            />
          </p-button-dialog>
        </el-col>
      </el-row>
      <el-pagination
        background
        hide-on-single-page
        w="full"
        bottom="16px"
        position="fixed"
        text="center"
        layout="prev, pager, next"
        :total="total"
        :current-page.sync="pager.page"
        :page-size.sync="pager.size"
      >
      </el-pagination>
    </template>
  </div>
</template>
<script>
import ModelInfo from './model-info'
import { EStatus } from './enum'
import { getModelInfo, getModelList, getModelSchema } from '@/api/manage/nermodel'
import { getList as getCategoryList, getSource, getDepartment } from '@/api/category'
import { getUserList } from '@/api/manage/user'
import { map } from 'lodash'

export default {
  components: { ModelInfo },
  data() {
    return {
      EStatus,
      loading: false,
      pager: {
        page: 1,
        size: 12,
      },
      total: 0,
      modelList: [],
      category_list: [],
      source_list: [],
      dept_list: [],
      user_list: [],
      model_schema: [],
    }
  },
  watch: {
    pager: {
      async handler(newPager) {
        this.loading = true
        const { result } = await getModelList(newPager)
        this.modelList = result.model_list
        this.total = result.total
        this.loading = false
      },
      deep: true,
      immediate: true,
    },
  },
  async mounted() {
    const maxPager = { page: 1, size: 9999 }
    const categoryRes = await getCategoryList(maxPager)
    this.category_list = categoryRes.result.category_list || []
    const sourceRes = await getSource(maxPager)
    this.source_list = sourceRes.result.source_schema || []
    const deptRes = await getDepartment()
    this.dept_list = deptRes.result.departschema || []
    const schemaRes = await getModelSchema()
    this.model_schema = schemaRes.result || []
    const userRes = await getUserList(maxPager)
    this.user_list = userRes.result || []
  },
  methods: {
    async goModelInfo(model) {
      const { model_id } = model
      this.$set(model, 'visible', true)
      const { result } = await getModelInfo({ model_id })
      this.$refs[model_id][0].model_info = {
        ...result,
        model_config: map(result.model_config, (value, name) => ({
          name,
          value,
        })),
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.text-normal {
  color: $--color-primary;
}
.text-training {
  color: $--color-warning;
}
.text-ban {
  color: #8c1ac4;
}
.text-failed {
  color: $--color-danger;
}
.text-none {
  color: $--color-info;
}
:deep {
  .el-dialog__body {
    padding-top: 0;
  }
}
</style>
