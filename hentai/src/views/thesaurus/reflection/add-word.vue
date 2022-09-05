<!--
 * @Author: imali
 * @Date: 2022-07-22 16:01:52
 * @LastEditTime: 2022-08-24 18:18:25
 * @LastEditors: imali
 * @Description:
-->
<template>
  <el-form ref="form" :model="wordModel" :rules="rules" label-width="80px">
    <el-form-item label="词汇名称" prop="word">
      <el-input v-model="wordModel.word"></el-input>
    </el-form-item>
    <el-form-item label="词汇分类" prop="topic_id">
      <el-select v-model="wordModel.topic_id" class="w-full" filterable>
        <el-option
          v-for="s in speechList"
          :key="s.speech_id"
          :value="s.speech_id"
          :label="s.name"
        />
      </el-select>
    </el-form-item>
    <!-- <el-form-item label="映射类型" prop="policy_id">
      <el-select v-model="wordModel.policy_id" class="w-full" filterable>
        <el-option
          v-for="s in policyList"
          :key="s.policy_id"
          :value="s.policy_id"
          :label="s.title"
        />
      </el-select>
    </el-form-item> -->
  </el-form>
</template>
<script>
export default {
  props: {
    speechList: {
      type: Array,
      required: true,
    },
    policyList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      rules: {
        word: [
          {
            required: true,
            message: '请输入词汇名称',
          },
        ],
        topic_id: [
          {
            required: true,
            message: '请选择词汇分类',
          },
        ],
      },
      wordModel: {},
    }
  },
  watch: {
    'wordModel.topic_id'(id) {
      const t = this.speechList.find((t) => t.speech_id === id)
      if (t) {
        this.wordModel.topic_title = t.name
      }
    },
  },
}
</script>
