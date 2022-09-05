<!--
 * @Description:
 * @version:
 * @Author: 周子尧
 * @Date: 2020-11-02 17:45:37
 * @LastEditors: imali
 * @LastEditTime: 2022-06-14 11:35:29
-->
<template>
  <div class="dashboard relative w-1280px mx-auto">
    <el-card class="m-25px p-20px">
      <el-row type="flex" :gutter="15">
        <el-col :span="18">
          <div class="px-10px text-2xl font-bold">
            <div class="inline-block w-30px align-text-top">
              <svg-icon icon-class="knowledge-knowledge" class-name="w-7 h-7" />
            </div>
            知识图谱
          </div>
          <el-row>
            <el-col v-for="it in knowledgeL" :key="it.title" :span="8">
              <card-item v-bind="it" :icon="`knowledge-${it.name}`" />
            </el-col>
          </el-row>
        </el-col>
        <el-divider direction="vertical" class="h-auto w-2px" />
        <el-col :span="6">
          <div class="px-10px text-2xl font-bold">
            <div class="inline-block w-30px align-text-top">
              <svg-icon icon-class="knowledge-literature" class-name="w-7 h-7" />
            </div>
            医学文献
          </div>
          <el-row :gutter="25">
            <el-col v-for="it in knowledgeR" :key="it.title">
              <card-item v-bind="it" :icon="`knowledge-${it.icon}`" />
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
    <el-row type="flex" :gutter="30" class="m-10px mt-30px">
      <el-col :span="12">
        <el-card class="p-20px">
          <div class="px-10px text-2xl font-bold">
            <div class="inline-block w-30px align-text-top">
              <svg-icon icon-class="structure-structure" class-name="w-7 h-7" />
            </div>
            病历结构化
          </div>
          <el-row>
            <el-col v-for="it in structure" :key="it.title" :span="12">
              <card-item v-bind="it" :icon="`structure-${it.name}`" />
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="p-20px">
          <div class="px-10px text-2xl font-bold">
            <div class="inline-block w-30px align-text-top">
              <svg-icon icon-class="quality-quality" class-name="w-7 h-7" />
            </div>
            病历质控
          </div>
          <el-row>
            <el-col v-for="it in quality" :key="it.title" :span="12">
              <card-item v-bind="it" :icon="`quality-${it.name}`" />
            </el-col>
          </el-row>
        </el-card>
        <el-card class="p-20px mt-30px">
          <div class="px-10px text-2xl font-bold">
            <div class="inline-block w-30px align-text-top">
              <svg-icon icon-class="thesaurus-thesaurus" class-name="w-7 h-7" />
            </div>
            同义词
          </div>
          <el-row>
            <el-col v-for="it in thesaurus" :key="it.title" :span="12">
              <card-item v-bind="it" :icon="`thesaurus-${it.name}`" />
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CardItem from './card-item.vue'
import { EKnowledge, EQuality, EStructure, EThesaurus } from './Enum'
import { take, takeRight, cloneDeep } from 'lodash'

export default {
  name: 'Dashboard',
  components: { CardItem },
  data() {
    return {
      knowledgeL: take(cloneDeep(EKnowledge), 5),
      knowledgeR: takeRight(cloneDeep(EKnowledge), 2),
      structure: EStructure,
      quality: EQuality,
      thesaurus: EThesaurus,
    }
  },
  computed: {
    ...mapGetters(['name']),
  },
  methods: {},
}
</script>
