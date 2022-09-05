<!--
 * @Author: imali
 * @Date: 2022-04-07 15:57:42
 * @LastEditTime: 2022-04-11 18:40:08
 * @LastEditors: imali
 * @Description:
-->
<template>
  <div ref="settag" element-loading-text="语料加载中" style="padding: 10px 20px">
    <svg width="98%" :height="svgheight" xmlns="http://www.w3.org/2000/svg" version="1.1">
      <template v-if="mode === '关系'">
        <path
          v-for="(line, index) in lines"
          :key="index"
          :d="line.path"
          :stroke="line.color"
          stroke-width="1"
          fill="none"
        />
        <g font-size="12" font="sans-serif" fill="#8590a6" stroke="none" text-anchor="middle">
          <template v-for="(item, index) in corpusItems">
            <template v-for="(flag, i) in item.flag">
              <text
                v-if="item.point"
                :key="`${index}_${i}`"
                :x="item.point.xpoint"
                :fill="
                  ['black', 'green', 'red'][['nof', 'zyf', 'bsf'].findIndex((tag) => tag == flag)]
                "
                :y="item.point.top"
                dy="-10"
                :dx="
                  item.flag.length == 1
                    ? 0
                    : item.flag.length == 2
                    ? i == 0
                      ? -8
                      : 8
                    : i == 1
                    ? 0
                    : i == 0
                    ? -15
                    : 15
                "
              >
                {{ ['否', '疑', '伴'][['nof', 'zyf', 'bsf'].findIndex((tag) => tag == flag)] }}
              </text>
            </template>
          </template>
        </g>
      </template>
      <g
        v-if="mode === '词性'"
        font-size="12"
        font="sans-serif"
        fill="#8590a6"
        stroke="none"
        text-anchor="middle"
      >
        <template v-for="(item, index) in corpusItems">
          <text
            v-if="item.point && item.speech"
            :key="index"
            :x="item.point.xpoint"
            :fill="item.color ? item.color : '#044E7B'"
            :y="item.point.top"
            dy="-15"
          >
            {{ item.speechname ? item.speechname : '其他' }}
          </text>
        </template>
      </g>
      <!-- <text v-if="point" :x="point.x" :y="point.y">A</text> -->
      <foreignObject width="100%" height="100%" x="0" :y="padding_top">
        <body xmlns="http://www.w3.org/1999/xhtml">
          <div class="content">
            <template v-for="(item, index) in corpusItems">
              <span
                v-if="item.speech"
                :ref="`span${item.key}`"
                :key="index"
                :class="`${item.key == chosenKey ? 'word chosespan' : 'word'}`"
                :style="
                  mode !== '原始'
                    ? `border: 1px ${item.color} solid;` +
                      (!item.rubi
                        ? `background:${
                            item.key == chosenKey ? item.color : item.color
                          };color:#ffffff`
                        : `background:#ffffff;color:${item.color}`)
                    : 'padding:5px;'
                "
                @click.prevent="clickspan(item, $event)"
                @contextmenu.prevent="rightClick(item, $event)"
                v-html="item.txt"
              />
              <span
                v-else
                :ref="`span${item.key}`"
                :key="index"
                style="color: black"
                @mouseup="getSelection(item, $event)"
              >
                {{ item.txt }}
              </span>
            </template>
          </div>
        </body>
      </foreignObject>
    </svg>
    <div
      v-if="visible && mode == '关系'"
      :style="
        left > screenWidth / 2
          ? { right: screenWidth - left + 30 + 'px', top: top + 'px' }
          : { left: left + 'px', top: top + 'px' }
      "
      style="
        padding: 10px 20px;
        min-height: 100px;
        min-width: 150px;
        max-width: 260px;
        background: rgb(244, 244, 245);
      "
      class="contextmenu"
      @click.stop=""
    >
      <el-row :gutter="20">
        <el-tag
          v-for="(item, index) in itemLinks"
          :key="index"
          style="margin: 5px"
          size="small"
          closable
          effect="plain"
          @close="rmlink(item)"
        >
          {{ item.txt }}
        </el-tag>
      </el-row>
      <el-checkbox-group v-model="selectedItem.flag">
        <template v-for="(flag, key) in flags">
          <el-checkbox :key="key" :label="key">{{ flag }}</el-checkbox>
        </template>
      </el-checkbox-group>
    </div>

    <div
      v-if="visible && mode == '词性'"
      :style="
        left > screenWidth / 2
          ? { right: screenWidth - left + 30 + 'px', top: top + 'px' }
          : { left: left + 'px', top: top + 'px' }
      "
      style="padding: 10px; width: 500px; background: rgb(244, 244, 245)"
      class="contextmenu"
      @click.stop=""
    >
      <el-row :gutter="20">
        <el-radio-group v-model="selectedItem.speech" style="line-height: 25px">
          <el-col v-for="(item, index) in speeches" :key="index" :span="6">
            <el-radio :label="item.speech_id">
              <span :style="`color:${item.style};font-weight:600`">{{ item.name }}</span>
            </el-radio>
          </el-col>
        </el-radio-group>
      </el-row>
    </div>
  </div>
</template>
<script>
import { v4 as uuidv4 } from 'uuid'
import { cloneDeep, assign, compact, map, each, find, filter, pick } from 'lodash'
import { getSpeechByType } from '@/api/speech'
export default {
  props: {
    mode: {
      type: String,
      default: () => '词性',
    },
    destiny: {
      type: Array,
      required: true,
    },
    category: {
      type: String,
      default: () => null,
    },
  },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      padding_top: 30,
      svgheight: 500, // 画布高度
      screenWidth: 0, // 窗口宽度
      chosenKey: null,
      selectedItem: null,
      corpus: [],
      speeches: [],
      links: [],
      flags: {
        nof: '否定',
        zyf: '质疑',
        bsf: '伴随',
      },
    }
  },
  computed: {
    lines() {
      const { corpusItems } = this
      return compact(
        map(this.links, (item) => {
          const from = find(corpusItems, (i) => i.key === item.from)
          const to = find(corpusItems, (i) => i.key === item.to)
          if (from && to) {
            return this.getLineByPoint(from.point, to.point, from.color || 'black')
          }
        })
      )
    },
    // 某一词全部关联关系
    itemLinks() {
      if (this.mode === '关系') {
        if (this.selectedItem) {
          const key = this.selectedItem.key
          const linkkeys = this.links
            .filter((item) => item.from === key || item.to === key)
            .map((item) => {
              return item.from === key ? item.to : item.from
            })
          const corpus = this.corpusItems.filter((item) => linkkeys.indexOf(item.key) >= 0)
          return corpus
        } else {
          return []
        }
      }
      return []
    },
    corpusItems() {
      var that = this
      const screenWidth = that.screenWidth
      console.log(screenWidth)
      const sourcecorpus = cloneDeep(this.corpus)
      let corpus = []
      for (let i in sourcecorpus) {
        i = parseInt(i)
        const item = sourcecorpus[i]
        if (item.speech) {
          const speech = this.speeches.find((s) => s.speech_id === item.speech)
          corpus.push(
            assign(cloneDeep(item), {
              speechname: speech?.name ?? '',
              color: speech?.style ?? '',
              rubi: speech?.rubi ?? false,
            })
          )
        } else {
          // 下一词为无状态则当前词合并到下一词且忽略当前词
          if (i + 1 < sourcecorpus.length && sourcecorpus[i + 1].speech === '') {
            sourcecorpus[i + 1].txt = item.txt + sourcecorpus[i + 1].txt
            item.txt = ''
          } else {
            corpus.push(
              assign(cloneDeep(item), {
                speechname: '',
                color: '',
                rubi: false,
              })
            )
          }
        }
      }
      corpus = corpus
        .filter((item) => item.txt)
        .map((item) => {
          if (!this.$refs[`span${item.key}`]) {
            return item
          }
          const rect = this.$refs[`span${item.key}`][0] // .getBoundingClientRect()
          rect.offsetTop && (that.svgheight = rect.offsetTop + 100)
          if (rect.offsetHeight < 100) {
            // 词不换行
            item.point = {
              top: rect.offsetTop + this.padding_top,
              left: rect.offsetLeft,
              width: rect.offsetWidth,
              height: rect.offsetHeight,
              xpoint: rect.offsetLeft + rect.offsetWidth / 2,
            }
          } else if (rect.offsetHeight > 100 && rect.offsetHeight < 200) {
            // 词换1行
            item.point = {
              top: rect.offsetTop + this.padding_top,
              left: rect.offsetLeft,
              width: rect.offsetWidth,
              height: rect.offsetHeight,
              xpoint: rect.offsetLeft + 10,
            }
          } else {
            // 词换n行
            item.point = {
              top: rect.offsetTop + this.padding_top,
              left: rect.offsetLeft,
              width: rect.offsetWidth,
              height: rect.offsetHeight,
              xpoint: rect.offsetLeft + 10,
            }
          }
          return item
        })
      return corpus
    },
    result() {
      const result = map(this.corpusItems, (item, index) =>
        assign(cloneDeep(item), { id: index, link: [] })
      )
      each(this.links, ({ to, from }) => {
        const findTo = find(result, ({ key }) => key === to)?.id ?? -1
        const findFrom = find(result, ({ key }) => key === from)
        if (findTo > -1 && findFrom) {
          findFrom.link.push(findTo)
        }
      })
      return map(result, (item) => pick(item, ['id', 'txt', 'speech', 'link', 'flag']))
    },
  },
  watch: {
    mode() {
      if (this.mode !== '关系') {
        this.chosenKey = null
      }
    },
    destiny: {
      handler(destiny) {
        const corpus = map(destiny, (item) =>
          assign(cloneDeep(item), {
            key: `key${item.id}`,
            link: item.link.map((l) => {
              return `key${l}`
            }),
          })
        )
        this.corpus = corpus
        const links = []
        corpus
          .filter((item) => item.link.length > 0)
          .map((item) => ({ from: item.key, tolinks: item.link }))
          .forEach((item) => {
            item.tolinks.forEach((l) => {
              if (links.findIndex((i) => i.to === item.from) < 0) {
                links.push({ from: item.from, to: l })
              }
            })
          })
        this.links = links
      },
      immediate: true,
      deep: true,
    },
    category: {
      async handler(category) {
        const { result } = await getSpeechByType({ category })
        this.speeches = result.speech_schema
      },
      immediate: true,
    },
    // 选择词性
    selectedItem: {
      handler(newvalue, oldvalue) {
        if (oldvalue && newvalue) {
          const item = this.corpus.find((i) => i.key === newvalue.key)
          if (item) {
            if (newvalue.speech !== item.speech) {
              // 词性改变
              item.speech = newvalue.speech
              this.closeMenu()
            } else if (newvalue.flag !== item.flag) {
              // flag改变
              item.flag = newvalue.flag
            }
          }
        }
      },
      deep: true,
    },
    // 右击弹框显示、隐藏切换
    async visible(value) {
      await (() => {
        if (value) {
          document.body.addEventListener('click', this.closeMenu)
        } else {
          document.body.removeEventListener('click', this.closeMenu)
        }
      })
    },
  },
  mounted() {
    const that = this
    // 监听宽度变化用于重新渲染
    that.screenWidth = that.$refs.settag.clientWidth
    window.onresize = () => {
      return (() => {
        that.screenWidth = that.$refs.settag.clientWidth
      })()
    }
  },
  methods: {
    // 右击事件
    rightClick(item, $event) {
      if (this.mode === '关系') {
        // 展示全部关系
        this.openMenu(item, $event)
      } else if (this.mode === '词性') {
        // 删除词性
        this.clearspan(item)
      }
    },
    // 单击词事件
    clickspan(item, $event) {
      if (this.mode === '词性') {
        this.openMenu(item, $event)
      }
      if (this.mode !== '关系') {
        this.chosenKey = null
        return
      }
      if (item.rubi) {
        return
      }
      if (this.chosenKey) {
        if (this.chosenKey === item.key) {
          // 取消选取
          this.chosenKey = null
        } else {
          // 建立连接,如关系已存在则取消选中
          if (
            this.links.find(
              (i) =>
                (i.from === this.chosenKey || i.to === this.chosenKey) &&
                (i.from === item.key || i.to === item.key)
            )
          ) {
            this.chosenKey = null
          } else {
            this.links.push({ from: this.chosenKey, to: item.key })
            this.chosenKey = null
          }
        }
      } else {
        this.chosenKey = item.key
      }
    },
    // 解除词性、解除关联
    clearspan(item) {
      this.links = filter(this.links, (i) => i.from !== item.key && i.to !== item.key)
      const i = this.corpus.findIndex((i) => i.key === item.key)
      this.corpus[i].speech = ''
    },
    // 自定义弹出层操作
    openMenu(item, e) {
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 15 // 15: margin right
      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }
      this.top = e.offsetY
      this.selectedItem = cloneDeep(item)
      this.visible = true
    },
    // 关闭右击显示框
    closeMenu() {
      this.selectedItem = null
      this.visible = false
    },
    // 移除关联
    rmlink(record) {
      const key = this.selectedItem.key
      const linki = this.links.findIndex(
        (item) =>
          (item.from === record.key || item.to === record.key) &&
          (item.from === key || item.to === key)
      )
      if (linki >= 0) {
        this.links.splice(linki, 1)
      }
    },
    // 计算两点连线路径
    getLineByPoint(point1, point2, color = '') {
      // 在同一行
      if (point1.top === point2.top) {
        if (point1.xpoint < point2.xpoint) {
          return {
            path: `M ${point1.xpoint},${point1.top + 25} l 0,${10} q ${
              (point2.xpoint - point1.xpoint) / 2
            },${((point2.xpoint - point1.xpoint) / this.screenWidth) * 90} ${
              point2.xpoint - point1.xpoint
            },0 l 0,-${10}`,
            color: color,
          }
        } else {
          return {
            path: `M ${point1.xpoint},${point1.top} l 0,${-10} q ${
              (point2.xpoint - point1.xpoint) / 2
            },${((point2.xpoint - point1.xpoint) / this.screenWidth) * 90} ${
              point2.xpoint - point1.xpoint
            },0 l 0,${10}`,
            color: color,
          }
        }
      } else {
        // 跨行
        if (Math.abs(point1.xpoint - point2.xpoint) < 100) {
          // 同一竖列
          return {
            path: `M ${point1.xpoint},${point1.top + 10}
              L ${point2.xpoint},${point2.top}`,
            color: color,
          }
        } else if (point1.xpoint <= point2.xpoint && point1.top <= point2.top) {
          // 起点在终点的左上方
          const points = cloneDeep({ xpoint: point1.xpoint, top: point1.top + 35 })
          const pointe = cloneDeep({ xpoint: point2.xpoint, top: point2.top - 10 })
          const pointy = points.top + (pointe.top - points.top) / 3
          const pointx = (function (x1, y1, x2, y2, y) {
            return (
              parseFloat(
                (y1 + y2) / 2.0 + (((x1 - x2) / parseFloat(y1 - y2)) * (x1 + x2)) / 2.0 - y
              ) / parseFloat((x1 - x2) / parseFloat(y1 - y2))
            )
          })(points.xpoint, points.top, pointe.xpoint, pointe.top, pointy)
          return {
            path: `M ${points.xpoint},${points.top - 25}
            L ${points.xpoint},${points.top}
            Q ${pointx},${pointy} ${pointe.xpoint},${pointe.top}
            L ${pointe.xpoint},${pointe.top + 10}`,
            color: color,
          }
        } else if (point1.xpoint <= point2.xpoint && point1.top > point2.top) {
          // 起点在终点的左下方
          const points = cloneDeep({ xpoint: point1.xpoint, top: point1.top - 10 })
          const pointe = cloneDeep({ xpoint: point2.xpoint, top: point2.top + 35 })
          const pointy = points.top + (pointe.top - points.top) / 3
          const pointx = (function (x1, y1, x2, y2, y) {
            return (
              parseFloat(
                (y1 + y2) / 2.0 + (((x1 - x2) / parseFloat(y1 - y2)) * (x1 + x2)) / 2.0 - y
              ) / parseFloat((x1 - x2) / parseFloat(y1 - y2))
            )
          })(points.xpoint, points.top, pointe.xpoint, pointe.top, pointy)
          return {
            path: `M ${points.xpoint},${points.top + 10}
            L ${points.xpoint},${points.top}
            Q ${pointx},${pointy} ${pointe.xpoint},${pointe.top}
            L ${pointe.xpoint},${pointe.top - 20}`,
            color: color,
          }
        } else if (point1.xpoint > point2.xpoint && point1.top <= point2.top) {
          // 起点在终点的右上方
          const points = cloneDeep({ xpoint: point1.xpoint, top: point1.top + 35 })
          const pointe = cloneDeep({ xpoint: point2.xpoint, top: point2.top - 10 })
          const pointy = points.top + (pointe.top - points.top) / 3
          const pointx = (function (x1, y1, x2, y2, y) {
            return (
              parseFloat(
                (y1 + y2) / 2.0 + (((x1 - x2) / parseFloat(y1 - y2)) * (x1 + x2)) / 2.0 - y
              ) / parseFloat((x1 - x2) / parseFloat(y1 - y2))
            )
          })(points.xpoint, points.top, pointe.xpoint, pointe.top, pointy)
          return {
            path: `M ${points.xpoint},${points.top - 25}
            L ${points.xpoint},${points.top}
            Q ${pointx},${pointy} ${pointe.xpoint},${pointe.top}
            L ${pointe.xpoint},${pointe.top + 10}`,
            color: color,
          }
        } else if (point1.xpoint > point2.xpoint && point1.top > point2.top) {
          // 起点在终点的左上方
          const points = cloneDeep({ xpoint: point1.xpoint, top: point1.top - 10 })
          const pointe = cloneDeep({ xpoint: point2.xpoint, top: point2.top + 35 })
          const pointy = points.top + (pointe.top - points.top) / 3
          const pointx = (function (x1, y1, x2, y2, y) {
            return (
              parseFloat(
                (y1 + y2) / 2.0 + (((x1 - x2) / parseFloat(y1 - y2)) * (x1 + x2)) / 2.0 - y
              ) / parseFloat((x1 - x2) / parseFloat(y1 - y2))
            )
          })(points.xpoint, points.top, pointe.xpoint, pointe.top, pointy)
          return {
            path: `M ${points.xpoint},${points.top + 10}
            L ${points.xpoint},${points.top}
            Q ${pointx},${pointy} ${pointe.xpoint},${pointe.top}
            L ${pointe.xpoint},${pointe.top - 20}`,
            color: color,
          }
        }
      }
    },
    // 选中文字进行分词
    getSelection(item, $event) {
      if (this.mode !== '词性') {
        return
      }
      // var selection = undefined;
      let text = ''
      if (window.getSelection) {
        text = window.getSelection().toString()
        // selection = window.getSelection();
      } else if (document.selection && document.selection.type !== 'Control') {
        text = document.selection.createRange().text
        // selection = document.selection.createRange();
      }
      if (text) {
        let words = item.txt.split(text)
        const list = []
        // 该选中词在该段落中只出现一次
        if (words.length === 2) {
          words = words.filter((i) => i)
          if (words.length === 0) {
            // 选中整段
            list.push({ word: item.txt, chose: true })
          } else if (words.length === 1) {
            if (item.txt.substring(0, text.length) === text) {
              list.push({ word: text, chose: true })
              list.push({ word: words[0], chose: false })
            } else {
              list.push({ word: words[0], chose: false })
              list.push({ word: text, chose: true })
            }
          } else if (words.length === 2) {
            list.push({ word: words[0], chose: false })
            list.push({ word: text, chose: true })
            list.push({ word: words[1], chose: false })
          }
        } else {
          const tabs = []
          if (words[0].length === 0) {
            // 第一个为空：开头匹配到选中词
            tabs.push({ text, target: false })
          }
          for (const i of words.filter((i) => i)) {
            tabs.push({ text: i, target: false })
            tabs.push({ text, target: false })
          }
          if (words[words.length - 1].length > 0) {
            // 最后一个不为空(即不是该字符结尾): 需去除多加的一个text
            tabs.pop()
          }
          // item.txt = tabs.map((i,index)=>{return `<tab ref="tab_${item.id}_${index}">${i.text}</tab>`}).join('')
          item.tabs = map(tabs, (i) => {
            return `${i.text}`
          })
          list.push({ word: item.txt, chose: false })
          this.point = { x: $event.offsetX, y: $event.offsetY }
        }
        const newcorpus = []
        for (const corpus of this.corpus) {
          if (corpus.key === item.key) {
            for (const i of list) {
              const key = uuidv4()
              if (i.chose) {
                newcorpus.push({ key: key, id: 0, txt: i.word, speech: 'O', link: [], flag: [] })
              } else {
                newcorpus.push({ key: key, id: 0, txt: i.word, speech: '', link: [], flag: [] })
              }
            }
          } else {
            newcorpus.push(corpus)
          }
        }
        this.corpus = newcorpus
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.content {
  line-height: 90px;
  padding: 0 10px;
}
.content .word {
  position: relative;
  margin: 0 10px;
  border-radius: 3px;
  padding: 4px;
  cursor: pointer;
}
// .content .wordplain {
//   position: relative;
//   margin: 0 10px;
//   border-radius: 3px;
//   padding: 5px;
//   color: #ffffff;
//   cursor: pointer;
// }
.chosespan {
  box-shadow: red 10px 10px 30px 2px;
}
.content .word:hover {
  background: grey;
  opacity: 0.8;
}
.contextmenu {
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;
    &:hover {
      background: #eee;
    }
  }
}
</style>
