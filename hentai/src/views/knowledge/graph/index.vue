<!--
 * @Author: imali
 * @Date: 2022-05-01 12:59:52
 * @LastEditTime: 2022-06-21 10:08:15
 * @LastEditors: imali
 * @Description:
-->
<template>
  <div class="h-[calc(100vh-100px)]">
    <div class="absolute border-1px w-350px h-full p-20px bg-[rgb(255,255,255,0.9)]">
      <p-form v-model="model" :items="items">
        <template #search>
          <el-input
            v-model="model.search"
            placeholder="请输入关键字"
            class="w-[calc(100%-50px)]"
            @keyup.native.enter="fetchVisualList(model)"
          ></el-input>
          <el-button
            icon="el-icon-search"
            type="primary"
            class="ml-5px"
            @click="fetchVisualList(model)"
          ></el-button>
        </template>
        <template #limit>
          <el-option v-for="l in limits" :key="l" :label="l" :value="l"></el-option>
        </template>
      </p-form>
      <el-divider />
      <div class="h-[calc(100vh-320px)] scrollbar-thin">
        <div class="mb-10px">筛选语义类型</div>
        <div>
          <el-tag
            v-for="v in label.vertex"
            :key="v.label"
            :set-sel="$set(v, 'selected', includes(selVertexes, v.label))"
            :style="
              v.selected && {
                background: colors[v.label].fill,
                borderColor: colors[v.label].stroke,
                color: 'white',
              }
            "
            size="medium"
            @click="selectVertex(v.label)"
            :type="v.selected ? 'primary' : 'info'"
            class="mr-16px mb-8px cursor-pointer font-bold"
          >
            {{ v.label }}（{{ v.count }}）
          </el-tag>
        </div>
        <el-divider />
        <div class="mb-10px">筛选属性关系</div>
        <div>
          <el-tag
            v-for="e in label.edge"
            :key="e.label"
            :set-sel="$set(e, 'selected', includes(selEdges, e.label))"
            size="medium"
            :type="e.selected ? 'primary' : 'info'"
            :effect="e.selected ? 'dark' : 'light'"
            @click="selectEdge(e.label)"
            class="mr-16px mb-8px cursor-pointer font-bold"
          >
            {{ e.label }}（{{ e.count }}）
          </el-tag>
        </div>
      </div>
    </div>
    <div v-loading="loading">
      <el-empty
        v-if="isEmpty(graph)"
        :description="searched ? '暂无数据' : '暂未搜索'"
        class="ml-350px w-[calc(100vw-350px)] h-[calc(100vh-110px)]"
      ></el-empty>
      <graph-chart
        ref="graph"
        v-else-if="!loading && !isEmpty(graph)"
        :data="[nodes, edges]"
        :fetchVisualInfo="fetchVisualInfo"
        class="w-full h-[calc(100vh-110px)]"
      />
    </div>
  </div>
</template>
<script>
import GraphChart from './graph-chart.vue'
import { getVisualInfo, getVisualList } from '@/api/datagraph/visual'
import {
  map,
  reduce,
  truncate,
  findIndex,
  filter,
  includes,
  isEmpty,
  cloneDeep,
  uniq,
} from 'lodash'
import { HSL2RGB } from '@/utils/hsl2rgb'
export default {
  components: { GraphChart },
  data() {
    return {
      isEmpty,
      includes,
      searched: false,
      loading: false,
      items: [
        {
          prop: 'search',
        },
        {
          prop: 'route',
          label: '关联深度',
          content: {
            is: 'el-rate',
            iconClasses: ['el-icon-success', 'el-icon-success', 'el-icon-success'],
            voidIconClass: 'el-icon-circle-close',
          },
        },
        {
          prop: 'limit',
          label: '返回数量',
          content: {
            is: 'el-select',
            class: 'w-80px',
          },
        },
      ],
      model: {
        search: '',
        route: 1,
        limit: 100,
      },
      graph: {},
      originGraph: null,
      label: {},
      selVertexes: [],
      selEdges: [],
      limits: [10, 20, 30, 50, 100],
    }
  },
  computed: {
    colors() {
      const keyArr = map(this.label.vertex, ({ label }) => label)
      return reduce(
        keyArr,
        (r, key, i) => ({
          ...r,
          [key]: {
            fill: HSL2RGB((360 / keyArr.length) * i, 0.3, 0.65, true),
            stroke: HSL2RGB((360 / keyArr.length) * i, 0.2, 0.5, true),
            lineWidth: 2,
          },
        }),
        {}
      )
    },
    nodes() {
      const nodes = map(this.graph.vertex, (it) => {
        const itsColor = it.color
          ? {
              fill: it.color,
              stroke: it.color,
            }
          : {}
        return {
          ...it,
          id: `n-${it._id}`,
          label: truncate(it.name, { length: 5 }),
          oriLabel: truncate(it.name, { length: 5 }),
          kind: it.label,
          size: 60,
          oriSize: 60,
          style: {
            ...this.colors[it.label],
            ...itsColor,
          },
        }
      })
      return nodes
    },
    edges() {
      const edges = map(this.graph.edge, (it) => ({
        ...it,
        id: `e-${it._id}`,
        source: `n-${it.start}`,
        target: `n-${it.end}`,
        label: it.name,
        style: {
          lineWidth: 2,
          lineDash: [5, 1],
          cursor: 'pointer',
          stroke: '#999',
          startArrow: true,
        },
      }))
      return edges
    },
  },
  watch: {
    selVertexes(vertexes) {
      const ids = []
      const vertex = filter(cloneDeep(this.originGraph.vertex), (v) => {
        if (includes(vertexes, v.label)) {
          ids.push(v._id)
          return true
        }
      })
      const edge = filter(
        cloneDeep(this.originGraph.edge),
        (e) => includes(ids, e.start) && includes(ids, e.end)
      )
      this.graph = { vertex, edge }
    },
    selEdges(edges) {
      let ids = []
      const edge = filter(cloneDeep(this.originGraph.edge), (e) => {
        if (includes(edges, e.name)) {
          ids.push(e.start, e.end)
          return true
        }
      })
      ids = uniq(ids)
      const vertex = filter(cloneDeep(this.originGraph.vertex), (v) => includes(ids, v._id))
      this.graph = { vertex, edge }
    },
  },
  methods: {
    async fetchVisualList(params) {
      this.loading = true
      const { graph, label } = (await getVisualList(params)).result
      this.graph = graph
      this.originGraph = graph
      this.label = label
      this.selVertexes = map(this.label.vertex, 'label')
      this.selEdges = map(this.label.edge, 'label')
      this.loading = false
      this.searched = true
    },
    async fetchVisualInfo(params) {
      this.loading = true
      const { graph, label } = (await getVisualInfo(params)).result
      this.graph = graph
      this.originGraph = graph
      this.label = label
      this.selVertexes = map(this.label.vertex, 'label')
      this.selEdges = map(this.label.edge, 'label')
      this.loading = false
    },
    selectVertex(label) {
      const findI = findIndex(this.selVertexes, (it) => it === label)
      if (findI > -1) {
        this.$delete(this.selVertexes, findI)
      } else {
        this.selVertexes.push(label)
      }
    },
    selectEdge(label) {
      const findI = findIndex(this.selEdges, (it) => it === label)
      if (findI > -1) {
        this.$delete(this.selEdges, findI)
      } else {
        this.selEdges.push(label)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
:deep {
  .el-rate__icon {
    font-size: 30px;
  }
}
</style>
