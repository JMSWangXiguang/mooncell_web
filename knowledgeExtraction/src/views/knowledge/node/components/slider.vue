<template>
  <div class="slider-box">
    <ul>
      <li
        v-for="item in topicList"
        :key="item.id"
        :class="{ active: curTopic.id === item.id }"
        @click="handleClick(item)"
      >
        {{ item.title }}
      </li>
    </ul>
  </div>
</template>

<script>
import { getTopicList } from "@/api/knowledge/node";
export default {
  name: "SliderBox",
  components: {},
  props: {
    isUpdate: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      curTopic: {},
      topicList: [],
      params: {
        page: 1,
        size: 20,
      },
    };
  },
  computed: {},
  watch: {
    isUpdate: {
      handler(newVal) {
        if (newVal) {
          this.getTopicList(this.params);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.getTopicList(this.params, "");
  },
  mounted() {},
  methods: {
    // 节点主体列表
    async getTopicList(params, val) {
      const res = await getTopicList(params);
      this.topicList = res.result.categories;
      if (val == "") {
        this.handleClick(this.topicList[0]);
      }
    },
    handleClick(item) {
      this.curTopic = item;
      this.$bus.emit("sendByBus", item);
      this.$bus.emit("expandData", []);
      this.$emit("node-click", item);
    },
  },
};
</script>
