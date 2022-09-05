<template>
  <div style="height: 100%">
    <div class="flex-box mb-10px">
      <el-select v-model="listQuery.topic" placeholder="请选择" style="flex: 3" class="mr-5px">
        <el-option
          v-for="item in topicList"
          :key="item.speech_id"
          :label="item.name"
          :value="item.speech_id"
        >
        </el-option>
      </el-select>
      <el-input
        v-model="listQuery.search"
        size="small"
        class="filter-item mr-5px"
        placeholder="文本关键字"
        clearable
        prefix-icon="el-icon-search"
        style="flex: 3"
      />
      <el-button type="primary" icon="el-icon-search" size="small" @click="search(sendparams)">
        查询
      </el-button>
    </div>
    <div class="slider-box h-[calc(100vh-200px)] bg-white">
      <ul>
        <li
          v-for="item in list"
          :key="item.id"
          :class="{ active: curTopic.id === item.id }"
          @click="handleClick(item)"
        >
          <span v-show="sendparams.value == '1'">{{ item.topic }} - </span>
          <span>{{ item.word }}</span>
        </li>
      </ul>
    </div>
    <div v-show="sendparams.value == '1'" mt="10px">
      <el-checkbox-group v-model="model">
        <el-checkbox-button label="chn">中文</el-checkbox-button>
        <el-checkbox-button label="eng">英文</el-checkbox-button>
        <el-checkbox-button label="symbol">符号</el-checkbox-button>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
import { getSpeechList, getList } from '@/api/thesaurus/minigNewWord'
import { getProcessedList } from '@/api/thesaurus/thesaurusMaintenance'
export default {
  name: 'SliderBox',
  components: {},
  props: {
    sendparams: {
      type: Object,
      default: () => ({
        isUpdate: false,
        value: '',
      }),
    },
    // value:{
    //   type:String,
    //   default:''
    // }
  },
  data() {
    return {
      curTopic: {},
      topicList: [],
      list: [],
      params: {
        topic: '',
        search: '',
        page: 1,
        // size: 10
      },
      listQuery: {
        topic: '',
        search: '',
        chn: false,
        eng: false,
        symbol: false,
        page: 1,
        // size: 10
      },
      model: ['chn', 'eng', 'symbol'],
    }
  },
  computed: {},
  watch: {
    sendparams: {
      handler(newVal) {
        this.search(newVal)
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.getSpeechList()
  },
  mounted() {},
  methods: {
    //下拉框数据
    getSpeechList() {
      getSpeechList().then((res) => {
        this.topicList = res.result.speech_list
      })
    },
    //查询
    search(val) {
      if (val.value == '1') {
        this.listQuery.chn = false
        this.listQuery.eng = false
        this.listQuery.symbol = false
        this.model.forEach((item) => {
          switch (item) {
            case 'chn':
              this.listQuery.chn = true
              break
            case 'eng':
              this.listQuery.eng = true
              break
            case 'symbol':
              this.listQuery.symbol = true
              break
            default:
              break
          }
        })
        this.getList(this.listQuery)
      } else {
        this.params.search = this.listQuery.search
        this.params.topic = this.listQuery.topic
        this.getProcessedList(this.params)
      }
    },
    // 挖掘新词汇列表
    async getList(params) {
      const res = await getList(params)
      if (res.result.pending.length > 0) {
        this.list = res.result.pending
        this.handleClick(this.list[0])
      } else {
        this.list = []
      }
      this.$emit('sendIsUpdate', false)
    },
    //词汇维护列表
    async getProcessedList(params) {
      const res = await getProcessedList(params)
      if (res.result.hopes.length > 0) {
        this.list = res.result.hopes
        this.handleClick(this.list[0])
      } else {
        this.list = []
      }
    },
    handleClick(item) {
      this.curTopic = item
      this.$bus.emit('sendByBus', item)
      this.$emit('node-click', item)
    },
  },
}
</script>
