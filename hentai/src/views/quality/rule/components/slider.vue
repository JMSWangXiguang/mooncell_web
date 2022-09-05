<template>
  <div>
    <el-tabs type="border-card" v-model="params.type">
      <el-tab-pane name="depart">
        <template #label>
          <strong>科室</strong>
        </template>
        <el-tag
          v-for="item in topicList"
          :key="item.group_id"
          class="mr-15px mt-10px px-20px py-10px h-auto cursor-pointer text-base"
          :style="{
            color: item.group_id === curTopic ? 'white' : '#333',
            background: item.group_id === curTopic ? undefined : 'white',
            fontWeight: item.group_id === curTopic ? 'bolder' : 'normal',
          }"
          size="medium"
          hit
          :effect="item.group_id === curTopic ? 'dark' : 'light'"
          @click="handleClick(item.group_id)"
        >
          {{ item.title }}
        </el-tag>
      </el-tab-pane>
      <el-tab-pane name="law">
        <template #label>
          <strong>规范</strong>
        </template>
        <el-tag
          v-for="item in topicList"
          :key="item.group_id"
          class="mr-15px mt-10px px-20px py-10px h-auto cursor-pointer text-base"
          :style="{ color: item.group_id === curTopic ? 'white' : '#333' }"
          size="medium"
          hit
          :effect="item.group_id === curTopic ? 'dark' : 'light'"
          @click="handleClick(item.group_id)"
        >
          {{ item.title }}
        </el-tag>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getRgroupList } from '@/api/rule/rule'
export default {
  name: 'SliderBox',
  components: {},
  props: {
    ids: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      curTopic: {},
      topicList: [],
      params: {
        page: 1,
        type: 'depart',
      },
      title: '',
      dialogVisible: false,
      temp: {
        title: '',
        desc: '',
        type: '',
        status: 'access',
        scope: {
          depart: [],
        },
        duration: {
          start: '',
          end: '',
        },
      },
      departList: [],
    }
  },
  watch: {
    'params.type': {
      handler(type) {
        this.getRgroupList({ type, ...this.params })
      },
      immediate: true,
    },
  },
  methods: {
    // 节点主体列表
    async getRgroupList(params) {
      const res = await getRgroupList(params)
      this.topicList = res.result.groups
      if (this.topicList.length > 0) {
        this.handleClick(this.topicList[0].group_id)
      }
    },
    //切换类型
    changeRadio() {
      this.getRgroupList(this.params)
    },
    //选中当前这条信息
    handleClick(id) {
      this.curTopic = id
      this.$set(this.ids, 'group_id', id)
    },
  },
}
</script>
<style lang="scss" scoped>
:deep {
  .el-tabs__content {
    padding: 15px 20px 20px 20px;
  }
}
.edit-box {
  position: absolute;
  right: 15px;
  top: -2px;
}
.edit-btn {
  color: white;
  font-size: 12px;
}
.checked {
  color: #82848a;
  font-weight: bold;
  font-size: 15px;
}
</style>
