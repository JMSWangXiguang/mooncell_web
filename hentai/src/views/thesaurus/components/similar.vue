<template>
  <div>
    <div class="flex-box mb-5px">
      <el-input
        v-model="listQuery.search"
        size="small"
        class="filter-item mr-5px"
        placeholder="文本关键字"
        clearable
        prefix-icon="el-icon-search"
        style="flex: 3"
      />
      <el-button type="primary" icon="el-icon-search" size="small" @click="search">查询</el-button>
    </div>
    <div class="slider-box">
      <ul>
        <li
          v-show="value == '0'"
          v-for="item in hopeList"
          :key="item.id"
          :class="{ active: curTopic.id === item.id }"
          style="display: flex"
          @click="handleClick(item)"
        >
          <span style="flex: 1">{{ item.word }}</span>
          <span style="flex: 1">{{ item.sim }}</span>
        </li>
        <li
          v-show="value == '1'"
          v-for="item in hopeList"
          :key="item.point_id"
          :class="{ active: curTopic.id === item.id }"
          style="display: flex"
        >
          <span style="flex: 2">{{ item.word }}</span>
          <span style="flex: 2">{{ item.sim }}</span>
          <span style="flex: 1.5; text-align: center" class="color-icon">
            <i class="el-icon-edit" style="margin-right: 20px" @click="edit(item, 1)"></i>
            <i class="el-icon-circle-plus-outline" @click="edit(item, 2)"></i>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getHopeList } from '@/api/thesaurus/minigNewWord'
export default {
  name: 'SliderBox',
  components: {},
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      curTopic: {},
      hopeList: [],
      listQuery: {
        topic: '',
        word: '',
        search: '',
        page: 1,
        size: 10,
      },
      obj: {},
    }
  },
  computed: {},
  watch: {
    value: {
      handler() {},
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.$bus.on('sendByBus', (value) => {
      this.obj = value
      this.search()
    })
  },
  mounted() {},
  methods: {
    //查询
    search() {
      this.listQuery.word = this.obj.word
      this.listQuery.size = 100000000
      this.getHopeList(this.listQuery)
    },
    // 节点主体列表
    async getHopeList(params) {
      const res = await getHopeList(params)
      if (res.result.hopes.length > 0) {
        this.hopeList = res.result.hopes
        // if(this.value == '0'){
        //   this.handleClick(this.hopeList[0])
        // }
      } else {
        this.hopeList = []
        // if(this.value == '0'){
        //   this.handleClick({})
        // }
      }
    },
    //选中
    handleClick(item) {
      this.curTopic = item
      this.$emit('node-click', item)
    },
    //修改
    edit(item, index) {
      this.curTopic = item
      item.index = index
      this.$emit('node-click', item)
    },
  },
}
</script>
<style lang="scss" scoped>
.color-icon {
  color: $--color-success;
}
</style>
