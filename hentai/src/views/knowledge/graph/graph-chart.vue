<!--
 * @Author: imali
 * @Date: 2022-05-01 13:09:53
 * @LastEditTime: 2022-05-31 16:41:38
 * @LastEditors: imali
 * @Description:
-->
<template>
  <div class="chart" ref="chart"></div>
</template>
<script>
import { Graph, Tooltip, Menu } from '@antv/g6'
import { debounce, map } from 'lodash'

export default {
  data() {
    return {
      instance: null,
    }
  },
  watch: {
    '$attrs.data': {
      handler([nodes = [], edges = []]) {
        this.instance.changeData({ nodes, edges })
      },
    },
  },
  mounted() {
    this.instance = new Graph({
      container: this.$refs.chart,
      layout: {
        type: 'gForce',
        minMovement: 0.01,
        maxIteration: 5000,
        preventOverlap: true,
        damping: 1,
        gravity: 50,
        nodeSize: 100,
        nodeStrength: 5000,
        linkDistance: 100,
      },
      defaultNode: {
        style: {
          cursor: 'pointer',
        },
        labelCfg: {
          style: {
            cursor: 'pointer',
            fill: 'white',
          },
        },
      },
      modes: {
        default: [
          { type: 'drag-node', enableDebounce: true },
          {
            type: 'drag-canvas',
            enableOptimize: true,
          },
          { type: 'zoom-canvas', enableOptimize: true },
        ],
      },
      autoPaint: true,
      animate: true,
      plugins: [
        new Tooltip({
          className: 'g6-tooltip',
          fixToNode: true,
          getContent: (e) => e.item.getModel().name,
        }),
        new Menu({
          offsetX: -120,
          offsetY: 20,
          className: 'g6-component-contextmenu',
          getContent() {
            const ulEl = document.createElement('ul')
            const liEl = document.createElement('li')
            liEl.innerText = '查看节点详情'
            ulEl.appendChild(liEl)
            return ulEl
          },
          handleMenuClick: (_target, item) => {
            const { csb_id } = item._cfg.model
            this.$attrs.fetchVisualInfo({ csb_id })
          },
        }),
      ],
    })
    window.onresize = debounce(() => {
      const { instance } = this
      const container = this.$refs.chart
      if (!instance || instance.get('destroyed')) return
      if (!container || !container.scrollWidth || !container.scrollHeight) return
      instance.changeSize(container.scrollWidth, container.scrollHeight)
    }, 200)

    this.$nextTick(() => {
      const { instance } = this
      const [nodes, edges] = this.$attrs.data
      const refreshDragedNodePosition = (e) => {
        const model = e.item.get('model')
        model.fx = e.x
        model.fy = e.y
      }

      instance.data({ nodes, edges })
      instance.render()
      instance.zoom(1.3)

      instance.on('node:dragstart', function (e) {
        instance.layout()
        refreshDragedNodePosition(e)
      })
      instance.on('node:drag', function (e) {
        refreshDragedNodePosition(e)
      })
      instance.on('node:dragend', function (e) {
        e.item.get('model').fx = null
        e.item.get('model').fy = null
      })
      instance.on('node:click', function (e) {
        const node = e.item
        const states = node.getStates()
        let clicked = false
        const model = node.getModel()
        let size = 200
        let labelText = `类型: ${model.kind}\n名称: ${model.name}\n${map(
          model.tags,
          (v, k) => `${k}: ${v}\n`
        )}`
        let fontSize = 18
        let lineHeight = 24
        states.forEach(function (state) {
          if (state === 'click') {
            clicked = true
            size = model.oriSize
            labelText = model.oriLabel
            fontSize = 14
            lineHeight = 20
          }
        })
        instance.setItemState(node, 'click', !clicked)
        instance.updateItem(node, {
          size,
          label: labelText,
          labelCfg: { style: { lineHeight, fontSize } },
        })
      })
    })
  },
  beforeDestroy() {
    window.onresize = null
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
  },
}
</script>
<style lang="scss">
.g6-tooltip {
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
  background-color: rgba(48, 49, 51, 0.9);
  opacity: 0.9;
  padding: 4px 8px;
  box-shadow: rgb(81, 81, 81) 0px 0px 10px;
  word-wrap: break-word;
}
.g6-component-contextmenu {
  position: absolute;
  z-index: 2;
  list-style-type: none;
  background-color: rgba(48, 49, 51, 0.9);
  border-radius: 4px;
  color: hsla(0, 0%, 100%, 0.85);
  width: fit-content;
  transition: opacity 0.2s;
  text-align: center;
  padding: 0px 8px;
  box-shadow: rgb(81, 81, 81) 0px 0px 10px;
  border: 0px;
}
.g6-component-contextmenu ul {
  padding-left: 0px;
  margin: 0;
}
.g6-component-contextmenu li {
  cursor: pointer;
  list-style-type: none;
  list-style: none;
  margin-left: 0;
  line-height: 28px;
}
.g6-component-contextmenu li:hover {
  color: #aaaaaa;
}
</style>
