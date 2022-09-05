<!--
 * @Description:
 * @version:
 * @Author: 周子尧
 * @Date: 2020-11-17 13:54:50
 * @LastEditors: imali
 * @LastEditTime: 2022-03-25 14:22:39
-->
<template>
  <div ref="settag" style="padding: 10px 20px">
    <div style="padding-bottom: 10px; text-align: right">
      <el-radio-group v-model="model" size="mini">
        <el-radio-button label="原始" />
        <el-radio-button label="词性" />
        <el-radio-button label="关系" />
      </el-radio-group>
    </div>
    <svg width="98%" :height="svgheight" xmlns="http://www.w3.org/2000/svg" version="1.1">
      <template v-if="model === '关系'">
        <path
          v-for="(line, index) in lines"
          :key="index"
          :d="line.path"
          :stroke="line.color"
          stroke-width="1"
          fill="none"
        />
      </template>
      <g
        v-if="model === '词性'"
        font-size="12"
        font="sans-serif"
        fill="#8590a6"
        stroke="none"
        text-anchor="middle"
      >
        <template v-for="(item, index) in corpus">
          <text
            v-if="item.point && item.speechname"
            :key="index"
            :x="item.point.xpoint"
            :fill="item.color"
            :y="item.point.top"
            dy="-15"
          >
            {{ item.speechname }}
          </text>
        </template>
      </g>
      <text v-if="point" :x="point.x" :y="point.y">A</text>
      <foreignObject width="100%" height="100%" x="0" :y="padding_top">
        <body xmlns="http://www.w3.org/1999/xhtml">
          <div class="content">
            <template v-for="(item, index) in corpus1">
              <span
                v-if="item.wtype"
                :ref="`span${item.id}`"
                :key="index"
                :class="`${item.id == choseid ? 'word chosespan' : 'word'}`"
                :style="`background:${item.color};color:${item.color ? '#ffffff' : 'black'}`"
                @click.prevent="clickspan(item, $event)"
                @contextmenu.prevent="rightClick(item, $event)"
                v-html="item.txt"
              />
              <span
                v-else
                :ref="`span${item.id}`"
                :key="index"
                :style="`background:${item.color};color:${item.color ? '#ffffff' : 'black'}`"
                :title="item.tabs.length"
                @mouseup="getSelection(item, $event)"
              >
                <template v-if="item.tabs && item.tabs.length > 0">
                  <tab v-for="(tab, i) in item.tabs" :key="i" :ref="`tab_${item.id}_${i}`">
                    {{ tab }}
                  </tab>
                </template>
                <template v-else>
                  {{ item.txt }}
                </template>
              </span>
            </template>
          </div>
        </body>
      </foreignObject>
    </svg>
    <div
      v-if="visible && model == '关系' && itemLinks.length > 0"
      :style="
        left > screenWidth / 2
          ? { right: screenWidth - left + 30 + 'px', top: top + 'px' }
          : { left: left + 'px', top: top + 'px' }
      "
      style="padding: 10px 20px; min-height: 100px; min-width: 150px; max-width: 260px"
      class="contextmenu"
      @click.stop=""
    >
      <el-row :gutter="20">
        <el-tag
          v-for="(item, index) in itemLinks"
          :key="index"
          style="margin: 10px"
          size="small"
          closable
          effect="plain"
          @close="rmlink(item)"
        >
          {{ item.txt }}
        </el-tag>
      </el-row>
    </div>

    <div
      v-if="visible && model == '词性'"
      :style="
        left > screenWidth / 2
          ? { right: screenWidth - left + 30 + 'px', top: top + 'px' }
          : { left: left + 'px', top: top + 'px' }
      "
      style="padding: 10px; width: 500px"
      class="contextmenu"
      @click.stop=""
    >
      <el-row :gutter="20">
        <el-radio-group v-model="selectedItem.wtype">
          <el-col v-for="(item, index) in speechs" :key="index" :span="6">
            <el-radio :label="item.key">{{ item.name }}</el-radio>
          </el-col>
        </el-radio-group>
      </el-row>
    </div>
  </div>
</template>
<script>
import { deepClone } from '@/utils/index'
export default {
  data() {
    return {
      padding_top: 30,
      model: '词性',
      visible: false,
      top: 0,
      left: 0,
      selectedItem: undefined,
      svgheight: 500, // 画布高度
      screenWidth: 0, // 窗口宽度
      choseid: undefined,
      point: undefined,
      // waitSplitSpan: undefined,
      links: [
        { from: 0, to: 5 },
        { from: 3, to: 6 },
        { from: 9, to: 25 },
        { from: 33, to: 38 },
        { from: 102, to: 111 },
        { from: 99, to: 139 },
      ],
      text: '缘患者4天前受凉后出现寒战,随后出现发热,体温不详,伴咳嗽,为阵发性连声咳,卧位时及夜间多见,伴咳痰,初为白色粘痰,后为黄色黏痰,量多,伴咽痛,无胸闷、气促,无胸痛,曾自行服用退热散,自诉体温可下降,遂至大良医院就诊,当时测量体温37.5℃,予赖氨匹林对症治疗后自觉体温有下降,返回家中后第二天再次出现发热,体温不详,无伴畏寒、寒战,再次大良医院就诊,予“氯雷他定、头孢克洛、裸花紫珠、两扑伪麻分散片”等对症治疗后,期间仍反复有发热,多为午后低热,无盗汗,伴咳嗽、咳痰加重,间有咳血丝痰,伴声嘶,今为求进一步治疗,遂至我院门诊就诊,门诊拟“肺部感染”收入我科,起病以来,患者无头晕、头痛,伴四肢乏力,无恶心、呕吐,无畏寒、发热,无盗汗、消瘦,无鼻衄、牙龈出血,无光过敏、口腔溃疡,精神、食欲、睡眠一般',
      corpus: [
        { id: 0, tabs: [], txt: '缘患者', wtype: 'O' },
        { id: 1, tabs: [], txt: '4天前', wtype: 'time' },
        { id: 2, tabs: [], txt: '受凉后', wtype: 'status' },
        { id: 3, tabs: [], txt: '出现', wtype: 'O' },
        { id: 4, tabs: [], txt: '寒战', wtype: 'symptom' },
        { id: 5, tabs: [], txt: ',随后出现', wtype: 'O' },
        { id: 6, tabs: [], txt: '发热', wtype: 'symptom' },
        { id: 7, tabs: [], txt: ',', wtype: 'O' },
        { id: 8, tabs: [], txt: '体温', wtype: 'sign' },
        { id: 9, tabs: [], txt: '不详', wtype: 'signdesc' },
        { id: 10, tabs: [], txt: ',', wtype: 'O' },
        { id: 11, tabs: [], txt: '伴', wtype: 'follow' },
        { id: 12, tabs: [], txt: '咳嗽', wtype: 'symptom' },
        { id: 13, tabs: [], txt: ',为', wtype: 'O' },
        { id: 14, tabs: [], txt: '阵发性', wtype: 'character' },
        { id: 15, tabs: [], txt: '连声咳', wtype: 'character' },
        { id: 16, tabs: [], txt: ',卧位时', wtype: 'O' },
        { id: 17, tabs: [], txt: '及', wtype: 'and' },
        { id: 18, tabs: [], txt: '夜间多见', wtype: 'time' },
        { id: 19, tabs: [], txt: ',', wtype: 'O' },
        { id: 20, tabs: [], txt: '伴', wtype: 'follow' },
        { id: 21, tabs: [], txt: '咳痰', wtype: 'symptom' },
        { id: 22, tabs: [], txt: ',初为', wtype: 'O' },
        { id: 23, tabs: [], txt: '白色粘痰', wtype: 'symptom' },
        { id: 24, tabs: [], txt: ',后为', wtype: 'O' },
        { id: 25, tabs: [], txt: '黄色黏痰', wtype: 'symptom' },
        { id: 26, tabs: [], txt: ',', wtype: 'O' },
        { id: 27, tabs: [], txt: '量多', wtype: 'character' },
        { id: 28, tabs: [], txt: ',', wtype: 'O' },
        { id: 29, tabs: [], txt: '伴', wtype: 'follow' },
        { id: 30, tabs: [], txt: '咽痛', wtype: 'symptom' },
        { id: 31, tabs: [], txt: ',', wtype: 'O' },
        { id: 32, tabs: [], txt: '无', wtype: 'negative' },
        { id: 33, tabs: [], txt: '胸闷', wtype: 'symptom' },
        { id: 34, tabs: [], txt: '、', wtype: 'O' },
        { id: 35, tabs: [], txt: '气促', wtype: 'symptom' },
        { id: 36, tabs: [], txt: ',', wtype: 'O' },
        { id: 37, tabs: [], txt: '无', wtype: 'negative' },
        { id: 38, tabs: [], txt: '胸痛', wtype: 'symptom' },
        { id: 39, tabs: [], txt: ',曾自行服用', wtype: 'O' },
        { id: 40, tabs: [], txt: '退热散', wtype: 'medicinal' },
        { id: 41, tabs: [], txt: ',自诉', wtype: 'O' },
        { id: 42, tabs: [], txt: '体温', wtype: 'sign' },
        { id: 43, tabs: [], txt: '可', wtype: 'signdesc' },
        { id: 44, tabs: [], txt: '下降', wtype: 'signdesc' },
        { id: 45, tabs: [], txt: ',遂至大良医院就诊,当时测量', wtype: 'O' },
        { id: 46, tabs: [], txt: '体温', wtype: 'sign' },
        { id: 47, tabs: [], txt: '37.5℃', wtype: 'calculate' },
        { id: 48, tabs: [], txt: ',', wtype: 'O' },
        { id: 49, tabs: [], txt: '予', wtype: 'O' },
        { id: 50, tabs: [], txt: '赖氨匹林', wtype: 'medicinal' },
        { id: 51, tabs: [], txt: '对', wtype: 'cure' },
        { id: 52, tabs: [], txt: '症治疗后自觉', wtype: 'O' },
        { id: 53, tabs: [], txt: '体温', wtype: 'symptom' },
        { id: 54, tabs: [], txt: '有', wtype: 'O' },
        { id: 55, tabs: [], txt: '下降', wtype: 'grow' },
        { id: 56, tabs: [], txt: ',返回家中后', wtype: 'O' },
        { id: 57, tabs: [], txt: '第二天', wtype: 'time' },
        { id: 58, tabs: [], txt: '再次', wtype: 'grow' },
        { id: 59, tabs: [], txt: '出现', wtype: 'O' },
        { id: 60, tabs: [], txt: '发热', wtype: 'symptom' },
        { id: 61, tabs: [], txt: ',', wtype: 'O' },
        { id: 62, tabs: [], txt: '体温', wtype: 'symptom' },
        { id: 63, tabs: [], txt: '不', wtype: 'description' },
        { id: 64, tabs: [], txt: '详,', wtype: 'O' },
        { id: 65, tabs: [], txt: '无', wtype: 'negative' },
        { id: 66, tabs: [], txt: '伴', wtype: 'follow' },
        { id: 67, tabs: [], txt: '畏寒', wtype: 'symptom' },
        { id: 68, tabs: [], txt: '、', wtype: 'O' },
        { id: 69, tabs: [], txt: '寒战', wtype: 'symptom' },
        { id: 70, tabs: [], txt: ',', wtype: 'O' },
        { id: 71, tabs: [], txt: '再次大良医院就诊', wtype: '' },
        { id: 72, tabs: [], txt: ',予“', wtype: '' },
        { id: 73, tabs: [], txt: '氯雷他定', wtype: '' },
        { id: 74, tabs: [], txt: '、', wtype: 'O' },
        { id: 75, tabs: [], txt: '头孢克洛', wtype: 'medicinal' },
        { id: 76, tabs: [], txt: '、', wtype: 'O' },
        { id: 77, tabs: [], txt: '裸花紫珠', wtype: 'medicinal' },
        { id: 78, tabs: [], txt: '、', wtype: 'O' },
        { id: 79, tabs: [], txt: '两扑伪麻分散片', wtype: 'medicinal' },
        { id: 80, tabs: [], txt: '”等对症治疗后,', wtype: 'O' },
        { id: 81, tabs: [], txt: '期间', wtype: 'time' },
        { id: 82, tabs: [], txt: '仍', wtype: 'O' },
        { id: 83, tabs: [], txt: '反复有', wtype: 'character' },
        { id: 84, tabs: [], txt: '发热', wtype: 'symptom' },
        { id: 85, tabs: [], txt: ',多为', wtype: 'O' },
        { id: 86, tabs: [], txt: '午后低热', wtype: 'symptom' },
        { id: 87, tabs: [], txt: ',', wtype: 'O' },
        { id: 88, tabs: [], txt: '无', wtype: 'follow' },
        { id: 89, tabs: [], txt: '盗汗', wtype: 'symptom' },
        { id: 90, tabs: [], txt: ',', wtype: 'O' },
        { id: 91, tabs: [], txt: '伴', wtype: 'follow' },
        { id: 92, tabs: [], txt: '咳嗽', wtype: 'symptom' },
        { id: 93, tabs: [], txt: '、', wtype: 'O' },
        { id: 94, tabs: [], txt: '咳痰加重', wtype: 'symptom' },
        { id: 95, tabs: [], txt: ',', wtype: 'O' },
        { id: 96, tabs: [], txt: '间有', wtype: 'frequency' },
        { id: 97, tabs: [], txt: '咳血丝痰', wtype: 'symptom' },
        { id: 98, tabs: [], txt: ',', wtype: 'O' },
        { id: 99, tabs: [], txt: '伴', wtype: 'follow' },
        { id: 100, tabs: [], txt: '声', wtype: 'symptom' },
        { id: 101, tabs: [], txt: '嘶,', wtype: 'O' },
        {
          id: 102,
          tabs: [],
          txt: '今为求进一步治疗,遂至我院门诊就诊,门诊拟“',
          wtype: 'O',
        },
        { id: 103, tabs: [], txt: '肺部感染', wtype: 'disease' },
        { id: 104, tabs: [], txt: '”收入我科,起病以来,患者', wtype: 'O' },
        { id: 105, tabs: [], txt: '无', wtype: 'negative' },
        { id: 106, tabs: [], txt: '头晕', wtype: 'symptom' },
        { id: 107, tabs: [], txt: '、', wtype: 'O' },
        { id: 108, tabs: [], txt: '头痛', wtype: 'symptom' },
        { id: 109, tabs: [], txt: ',', wtype: 'O' },
        { id: 110, tabs: [], txt: '伴', wtype: 'follow' },
        { id: 111, tabs: [], txt: '四肢乏力', wtype: 'body' },
        { id: 112, tabs: [], txt: ',', wtype: 'O' },
        { id: 113, tabs: [], txt: '无', wtype: 'negative' },
        { id: 114, tabs: [], txt: '恶心', wtype: 'symptom' },
        { id: 115, tabs: [], txt: '、', wtype: 'O' },
        { id: 116, tabs: [], txt: '呕吐', wtype: 'symptom' },
        { id: 117, tabs: [], txt: ',', wtype: 'O' },
        { id: 118, tabs: [], txt: '无', wtype: 'negative' },
        { id: 119, tabs: [], txt: '畏寒', wtype: 'symptom' },
        { id: 120, tabs: [], txt: '、', wtype: 'O' },
        { id: 121, tabs: [], txt: '发热', wtype: 'symptom' },
        { id: 122, tabs: [], txt: ',', wtype: 'O' },
        { id: 123, tabs: [], txt: '无', wtype: 'negative' },
        { id: 124, tabs: [], txt: '盗汗', wtype: 'symptom' },
        { id: 125, tabs: [], txt: '、', wtype: 'O' },
        { id: 126, tabs: [], txt: '消瘦', wtype: 'symptom' },
        { id: 127, tabs: [], txt: ',', wtype: 'O' },
        { id: 128, tabs: [], txt: '无', wtype: 'negative' },
        { id: 129, tabs: [], txt: '鼻衄', wtype: 'symptom' },
        { id: 130, tabs: [], txt: '、', wtype: 'O' },
        { id: 131, tabs: [], txt: '牙龈', wtype: 'body' },
        { id: 132, tabs: [], txt: '出血', wtype: 'symptom' },
        { id: 133, tabs: [], txt: ',', wtype: 'O' },
        { id: 134, tabs: [], txt: '无', wtype: 'negative' },
        { id: 135, tabs: [], txt: '光过敏', wtype: 'symptom' },
        { id: 136, tabs: [], txt: '、', wtype: 'O' },
        { id: 137, tabs: [], txt: '口腔溃疡', wtype: 'symptom' },
        { id: 138, tabs: [], txt: ',', wtype: 'O' },
        { id: 139, tabs: [], txt: '精神', wtype: 'ordinary' },
        { id: 140, tabs: [], txt: '、', wtype: 'O' },
        { id: 141, tabs: [], txt: '食欲', wtype: 'ordinary' },
        { id: 142, tabs: [], txt: '、', wtype: 'O' },
        { id: 143, tabs: [], txt: '睡眠', wtype: 'ordinary' },
        { id: 144, tabs: [], txt: '一般', wtype: 'description' },
      ],
      speechs: [
        { key: 'O', name: '无用', rubi: true, style: 0 },
        { key: 'follow', name: '伴随标志', rubi: true, style: 1 },
        { key: 'doubt', name: '怀疑词', rubi: true, style: 1 },
        { key: 'person', name: '亲属', rubi: false, style: 2 },
        { key: 'and', name: '连词', rubi: true, style: 2 },
        { key: 'character', name: '症状特性', rubi: true, style: 3 },
        { key: 'degree', name: '程度', rubi: true, style: 3 },
        { key: 'inmethod', name: '检验检查方式', rubi: false, style: 3 },
        { key: 'body', name: '部位', rubi: false, style: 4 },
        { key: 'sign', name: '体征', rubi: false, style: 4 },
        { key: 'signdesc', name: '体征描述', rubi: false, style: 4 },
        { key: 'description', name: '情况描述', rubi: false, style: 4 },
        { key: 'positive', name: '肯定标志', rubi: true, style: 4 },
        { key: 'insdesc', name: '检验描述', rubi: false, style: 4 },
        { key: 'direct', name: '方向', rubi: true, style: 5 },
        { key: 'status', name: '诱因', rubi: false, style: 5 },
        { key: 'disease', name: '诊断', rubi: false, style: 6 },
        { key: 'disperiod', name: '诊断分期', rubi: false, style: 6 },
        { key: 'time', name: '时间', rubi: false, style: 7 },
        { key: 'cure', name: '其他治疗', rubi: false, style: 7 },
        { key: 'image', name: '影像描述', rubi: false, style: 8 },
        { key: 'pathology', name: '病理描述', rubi: false, style: 8 },
        { key: 'medicinal', name: '药物', rubi: false, style: 9 },
        { key: 'calculate', name: '指标计量', rubi: false, style: 9 },
        { key: 'negative', name: '否定标志', rubi: true, style: 9 },
        { key: 'operation', name: '手术', rubi: false, style: 10 },
        { key: 'symptom', name: '症状', rubi: false, style: 11 },
        { key: 'frequency', name: '症状频率', rubi: false, style: 12 },
        { key: 'ordinary', name: '一般情况', rubi: false, style: 13 },
        { key: 'general', name: '通用情况', rubi: false, style: 13 },
        { key: 'grow', name: '症状发展', rubi: false, style: 14 },
        { key: 'inspection', name: '检验指标', rubi: false, style: 14 },
      ],
      colors: [
        'rgb(51, 204, 153)',
        'rgb(204, 0, 255)',
        'rgb(128, 128, 0)',
        'rgb(255, 0, 0)',
        'rgb(100, 149, 237)',
        'rgb(204, 204, 51)',
        'rgb(0, 204, 255)',
        'rgb(128, 0, 128)',
        'rgb(143, 188, 143)',
        'rgb(255, 153, 204)',
        'rgb(169, 169, 169)',
        'rgb(102, 51, 255)',
        'rgb(210, 105, 30)',
        'rgb(204, 204, 255)',
        'rgb(255, 140, 0)',
        'rgb(51, 204, 153)',
        'rgb(204, 0, 255)',
        'rgb(128, 128, 0)',
        'rgb(255, 0, 0)',
        'rgb(100, 149, 237)',
        'rgb(204, 204, 51)',
        'rgb(0, 204, 255)',
        'rgb(128, 0, 128)',
        'rgb(143, 188, 143)',
        'rgb(255, 153, 204)',
        'rgb(169, 169, 169)',
        'rgb(102, 51, 255)',
        'rgb(210, 105, 30)',
        'rgb(204, 204, 255)',
        'rgb(255, 140, 0)',
      ],
    }
  },
  computed: {
    // 构造展示词
    corpus1() {
      var that = this
      const screenWidth = that.screenWidth
      console.log(screenWidth)
      const sourcecorpus = that.corpus
      let corpus = []
      corpus = sourcecorpus.map((item) => {
        const speech = this.speechs.find((s) => s.key === item.wtype)
        return Object.assign(item, {
          speechname: speech ? speech.name : '',
          color: speech ? speech.color : '',
          rubi: speech ? speech.rubi : false,
        })
      })
      for (let i in sourcecorpus) {
        i = parseInt(i)
        const item = sourcecorpus[i]
        if (item.wtype) {
          const speech = this.speechs.find((s) => s.key === item.wtype)
          corpus.push(
            Object.assign(item, {
              speechname: speech?.name ?? '',
              color: speech?.color ?? '',
              rubi: speech?.rubi ?? false,
            })
          )
        } else {
          // 下一词为无状态则当前词合并到下一词且忽略当前词
          if (i + 1 < sourcecorpus.length && sourcecorpus[i + 1].wtype === '') {
            sourcecorpus[i + 1].txt = item.txt + sourcecorpus[i + 1].txt
            item.txt = ''
          } else {
            corpus.push(
              Object.assign(item, {
                speechname: '',
                color: '',
                rubi: false,
              })
            )
          }
        }
      }
      // corpus = corpus.filter((item)=>item.txt)
      // 页面渲染完成后才进行元素位置计算
      this.$nextTick(() => {
        corpus = corpus.map((item, index) => {
          const rect = this.$refs[`span${item.id}`][0] // .getBoundingClientRect()
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
      })
      console.log('最终词语', corpus)
      return corpus
    },
    // 构造连线
    lines() {
      const screenWidth = this.screenWidth
      console.log(screenWidth)
      const corpus = this.corpus
      this.$nextTick(() => {})
      return this.links
        .map((item, index) => {
          const from = corpus.find((i) => i.id === item.from)
          const to = corpus.find((i) => i.id === item.to)
          if (from && to) {
            return this.getLineByPoint(from.point, to.point, from.color || 'black')
          } else {
            return undefined
          }
        })
        .filter((item) => item !== undefined)
    },
    // 某一词全部关联关系
    itemLinks() {
      if (this.model === '关系') {
        if (this.selectedItem) {
          const id = this.selectedItem.id
          const linkids = this.links
            .filter((item) => item.from === id || item.to === id)
            .map((item) => {
              return item.from === id ? item.to : item.from
            })
          console.log(this.corpus1)
          const corpus1 = this.corpus1.filter((item) => linkids.indexOf(item.id) >= 0)
          if (corpus1.length === 0) {
            this.$message.warning('该词无关联词')
          }
          console.log('关系关联', corpus1)
          return corpus1
        } else {
          return []
        }
      }
      return []
    },
  },
  watch: {
    // 切换词性、关系
    model() {
      if (this.model !== '关系') {
        this.choseid = undefined
      }
    },
    // 选择词性
    selectedItem: {
      handler(newvalue, oldvalue) {
        if (oldvalue && newvalue) {
          const item = this.corpus.find((i) => i.id === newvalue.id)
          if (item) {
            item.wtype = newvalue.wtype
          }
          this.closeMenu()
        }
      },
      deep: true,
    },
    // 右击弹框显示、隐藏切换
    visible(value) {
      setTimeout(() => {
        if (value) {
          document.body.addEventListener('click', this.closeMenu)
        } else {
          document.body.removeEventListener('click', this.closeMenu)
        }
      }, 0)
    },
  },
  created() {
    const colors = this.colors
    this.speechs = this.speechs.map((item, index) => {
      item.color = colors[index % colors.length]
      return item
    })
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
      if (this.model === '关系') {
        // 展示全部关系
        this.openMenu(item, $event)
      } else if (this.model === '词性') {
        // 删除词性
        this.clearspan(item)
      }
    },
    // 单击词事件
    clickspan(item, $event) {
      if (this.model === '词性') {
        this.openMenu(item, $event)
      }
      if (this.model !== '关系') {
        this.choseid = undefined
        return
      }
      if (this.choseid) {
        if (this.choseid === item.id) {
          // 取消选取
          this.choseid = undefined
        } else {
          // 建立连接,如关系已存在则取消选中
          if (
            this.links.find(
              (i) =>
                (i.from === this.choseid || i.to === this.choseid) &&
                (i.from === item.id || i.to === item.id)
            )
          ) {
            this.choseid = undefined
          } else {
            this.links.push({ from: this.choseid, to: item.id })
            this.choseid = undefined
          }
        }
      } else {
        this.choseid = item.id
      }
    },
    // 双击事件:解除词性、解除关联
    clearspan(item) {
      this.links = this.links.filter((i) => i.from !== item.id && i.to !== item.id)
      this.corpus.find((i) => i.id === item.id).wtype = ''
      // this.$confirm('确定取消该分词?该操作会同时解绑词性及该次关联!', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     this.links = this.links.filter((i)=>i.from!=item.id&&i.to!=item.id)
      //     this.corpus.find((i)=> i.id==item.id).wtype=''
      //   }).catch(() => {
      //   })
      // console.log()
    },
    // 自定义弹出层操作
    openMenu(item, e) {
      console.log(e)
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 15 // 15: margin right
      console.log(maxLeft)
      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }
      this.top = e.offsetY
      // console.log(offsetLeft, offsetWidth)
      // console.log(this.top, this.left)
      this.selectedItem = deepClone(item)
      this.visible = true
    },
    // 关闭右击显示框
    closeMenu() {
      this.selectedItem = undefined
      this.visible = false
    },
    // 移除关联
    rmlink(record) {
      const id = this.selectedItem.id
      const linki = this.links.findIndex(
        (item) =>
          (item.from === record.id || item.to === record.id) && (item.from === id || item.to === id)
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
        // return {
        //   path: `M ${point1.xpoint},${point1.top + 25} l 0,${
        //     10 + margin_top
        //   } l ${point2.xpoint - point1.xpoint},0 l 0,-${10 + margin_top}`,
        //   color: color,
        // };
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
          const points = deepClone({ xpoint: point1.xpoint, top: point1.top + 35 })
          const pointe = deepClone({ xpoint: point2.xpoint, top: point2.top - 10 })
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
          const points = deepClone({ xpoint: point1.xpoint, top: point1.top - 10 })
          const pointe = deepClone({ xpoint: point2.xpoint, top: point2.top + 35 })
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
          const points = deepClone({ xpoint: point1.xpoint, top: point1.top + 35 })
          const pointe = deepClone({ xpoint: point2.xpoint, top: point2.top - 10 })
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
          const points = deepClone({ xpoint: point1.xpoint, top: point1.top - 10 })
          const pointe = deepClone({ xpoint: point2.xpoint, top: point2.top + 35 })
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
        } else {
          console.log('error')
          // return {
          //   path: `M ${point1.xpoint},${point1.top + 25} l 0,${
          //     point2.top - point1.top + margin_top + 10
          //   } l ${point2.xpoint - point1.xpoint},0 l 0,-${10 + margin_top}`,
          //   color: color
          // }
        }
      }
    },
    // 选中文字
    getSelection(item, $event) {
      const that = this
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
        // console.log('待划分词',item)
        let words = item.txt.split(text)
        // console.log(words)
        const list = []
        // 该选中词在该段落中只出现一次
        if (words.length === 2) {
          words = words.filter((i) => i)
          if (words.length === 0) {
            // 选中整段
            list.push({ word: item.txt, chose: true })
          } else if (words.length === 1) {
            if (item.txt.substring(0, text.length) === text) {
              // console.log('选中前半段')
              list.push({ word: text, chose: true })
              list.push({ word: words[0], chose: false })
            } else {
              // console.log('选中后半段')
              list.push({ word: words[0], chose: false })
              list.push({ word: text, chose: true })
            }
          } else if (words.length === 2) {
            // console.log('选中中间段')
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
          item.tabs = tabs.map((i, index) => {
            return `${i.text}`
          })
          console.log(item.tabs)
          console.log('多词处理')
          console.log('当前节点,根据鼠标位置匹配:', $event)
          list.push({ word: item.txt, chose: false })
          this.point = { x: $event.offsetX, y: $event.offsetY }
          that.$nextTick(() => {
            tabs.forEach((i, index) => {
              console.log(`tab_${item.id}_${index}`, that.$refs[`tab_${item.id}_${index}`])
            })
          })
        }
        console.log(this.corpus)
        // console.log(list)
        const newcorpus = []
        let maxid = this.corpus.reduce((item1, item2) => {
          return item2.id > item1.id ? item2 : item1
        }).id
        for (const corpu of this.corpus) {
          if (corpu.id === item.id) {
            for (const i of list) {
              if (i.chose) {
                newcorpus.push({ id: ++maxid, tabs: [], txt: i.word, wtype: 'O' })
              } else {
                newcorpus.push({ id: ++maxid, tabs: [], txt: i.word, wtype: '' })
              }
            }
          } else {
            newcorpus.push(corpu)
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
*::-webkit-scrollbar {
  width: 0px;
  opacity: 0;
  -webkit-overflow-scrolling: touch;
}
.content .word {
  position: relative;
  margin: 0 10px;
  padding: 5px;
  color: #ffffff;
  cursor: pointer;
}
.chosespan {
  box-shadow: red 10px 10px 30px 5px;
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
