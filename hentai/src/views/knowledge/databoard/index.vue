<!--
 * @Author: imali
 * @Date: 2022-05-02 14:36:58
 * @LastEditTime: 2022-05-31 17:34:44
 * @LastEditors: imali
 * @Description:
-->
<template>
  <div class="w-1280px h-full mx-auto">
    <el-row type="flex" class="h-full">
      <el-col :span="18" class="p-5px">
        <el-row type="flex">
          <el-col v-for="(d, key) in EData" :key="key" :span="8" class="p-5px">
            <el-card
              shadow="hover"
              body-style="height:100%"
              @click.native="flag = key"
              class="h-180px cursor-pointer children:py-30px hover:svg:animate-pulse"
            >
              <el-row class="h-full">
                <el-col :span="6" class="relative text-center space-y-20px">
                  <svg-icon
                    :icon-class="`databoard-${d.icon}`"
                    class-name="absolute w-11/12 h-30 -mt-7 ml-1/24"
                  />
                  <div class="pt-15 text-2xl font-extrabold">{{ d.name }}</div>
                </el-col>
                <el-col :span="15" :offset="2">
                  <div class="flex justify-between">
                    <div class="mt-3 space-y-35px">
                      <div class="text-4xl">
                        {{ increasing[`${key}_num`] }}
                      </div>
                      <div class="font-medium">数量</div>
                    </div>
                    <div class="mt-3 space-y-35px">
                      <div class="text-4xl">{{ increasing[`${key}_cata_num`] }}</div>
                      <div class="font-medium">种类</div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
        <div ref="chart" class="el-card is-never-shadow w-[calc(100%-10px)] h-800px m-5px"></div>
      </el-col>
      <el-col :span="6" class="p-10px">
        <div class="h-180px">
          <el-row :gutter="2">
            <el-col :span="12">
              <p-button-dialog
                ref="modify-version-dialog"
                width="1000px"
                title="修改版本"
                destroy-on-close
              >
                <template #trigger>
                  <el-card
                    shadow="hover"
                    border="none"
                    rounded="none"
                    children="p-0"
                    hover="all:(underline underline-offset-2) svg:animate-bounce"
                    @click.native="$refs['modify-version-dialog'].dialogVisible = true"
                  >
                    <el-button
                      type="text"
                      size="medium"
                      class="w-full h-89px leading-70px"
                      text="lg color-text-primary"
                    >
                      <svg-icon icon-class="databoard-version" class-name="inline-block w-8 h-8" />
                      <span class="align-super ml-8px">修改版本</span>
                    </el-button>
                  </el-card>
                </template>
                <el-button
                  type="primary"
                  class="float-right mb-8px"
                  @click="$refs['version-dialog'].add()"
                >
                  添加版本
                </el-button>
                <version-dialog ref="version-dialog" :current="versionObj.version" />
              </p-button-dialog>
            </el-col>
            <el-col :span="12">
              <el-card
                shadow="hover"
                border="none"
                rounded="none"
                children="p-0"
                hover="all:(underline underline-offset-2) svg:animate-bounce"
              >
                <el-upload action="#" :show-file-list="false" :http-request="beforeUpload">
                  <el-button
                    type="text"
                    size="medium"
                    class="w-full h-89px leading-70px"
                    text="lg color-text-primary"
                  >
                    <svg-icon icon-class="databoard-import" class-name="inline-block w-8 h-8" />
                    <span class="align-super ml-8px">导入知识</span>
                  </el-button>
                </el-upload>
              </el-card>
            </el-col>
            <el-col :span="12" class="mt-2px">
              <el-card
                shadow="hover"
                border="none"
                rounded="none"
                children="p-0"
                hover="all:(underline underline-offset-2) svg:animate-bounce"
              >
                <el-button
                  type="text"
                  size="medium"
                  class="w-full h-89px leading-70px"
                  text="lg color-text-primary"
                  @click="doSync"
                >
                  <svg-icon icon-class="databoard-sync" class-name="inline-block w-8 h-8" />
                  <span class="align-super ml-8px">同步数据</span>
                </el-button>
              </el-card>
            </el-col>
            <el-col :span="12" class="mt-2px">
              <el-card
                shadow="hover"
                border="none"
                rounded="none"
                children="p-0"
                hover="all:(underline underline-offset-2) svg:animate-bounce"
              >
                <el-button
                  type="text"
                  size="medium"
                  class="w-full h-89px leading-70px"
                  text="lg color-text-primary"
                  @click="doExport"
                >
                  <svg-icon icon-class="databoard-export" class-name="inline-block w-8 h-8" />
                  <span class="align-super ml-8px">导出知识</span>
                </el-button>
              </el-card>
            </el-col>
          </el-row>
        </div>
        <el-card shadow="never" class="mt-10px" body-style="padding:5px">
          <card-item
            v-for="it in EKnowledge"
            :key="it.title"
            v-bind="it"
            :icon="`knowledge-${it.icon || it.name}`"
            class="children:(px-10px pt-20px)"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import * as echarts from 'echarts/core'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { PieChart } from 'echarts/charts'
import VersionDialog from './version-dialog.vue'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import CardItem from '../../dashboard/card-item.vue'
import { EKnowledge } from '../../dashboard/Enum'
import { getCurrentVersion } from '@/api/datagraph/version'
import {
  exportData,
  getKnowledgeList,
  sliceImport,
  finishImport,
  syncData,
} from '@/api/datagraph/knowledge'
import { each, delay, map, cloneDeep } from 'lodash'

echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer, LabelLayout])

const EData = {
  entity: {
    name: '实体',
    icon: 'entity',
  },
  relation: {
    name: '关系',
    icon: 'relation',
  },
  literature: {
    name: '文献',
    icon: 'literature',
  },
}

export default {
  components: { CardItem, VersionDialog },
  data() {
    const cloneEnum = cloneDeep(EKnowledge)
    cloneEnum.shift()
    return {
      flag: '',
      timer: 15,
      EKnowledge: cloneEnum,
      EData,
      chartEl: null,
      chartData: [],
      chartIndex: -1,
      versionObj: {},
      knowledges: null,
      increasing: {
        entity_num: 0,
        entity_cata_num: 0,
        relation_num: 0,
        relation_cata_num: 0,
        literature_num: 0,
        literature_cata_num: 0,
      },
      notification: null,
    }
  },
  async mounted() {
    this.chartEl = echarts.init(this.$refs.chart, null, {
      locale: 'zh',
    })
    this.chartEl.setOption({
      tooltip: {
        trigger: 'item',
        className: 'z-99',
        formatter: `<strong>{b}</strong><br/>{c} ({d}%)`,
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 40,
        top: 20,
        bottom: 20,
        textStyle: {
          fontSize: 14,
        },
      },
      series: [
        {
          type: 'pie',
          radius: ['60%', '70%'],
          center: ['45%', '50%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          labelLine: {
            minTurnAngle: 135,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 22,
              fontWeight: 'bold',
            },
          },
          data: [],
        },
      ],
    })
    this.versionObj = (await getCurrentVersion()).result
    this.fetchKnowledges()
    this.chartAction()
  },
  watch: {
    chartData(data) {
      this.chartEl.setOption({
        series: [{ data }],
      })
    },
    flag(flag) {
      this.chartData = map(this.knowledges[`${flag}s`], (it) => ({
        value: it.num,
        name: it.title,
      }))
    },
    notification(notif) {
      console.log(notif)
    },
  },
  methods: {
    chartAction() {
      delay(() => {
        const dataLen = this.chartData.length
        // 取消之前高亮的图形
        this.chartEl.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: this.chartIndex,
        })
        this.chartIndex = (this.chartIndex + 1) % dataLen
        // 高亮当前图形
        this.chartEl.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: this.chartIndex,
        })
        // 显示 tooltip
        this.chartEl.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: this.chartIndex,
        })
        this.chartAction()
      }, 1000)
    },
    doIncrease(key, last) {
      const increment = (last - (last % 5)) / 5
      if (!increment) {
        return (this.increasing[key] = last)
      }
      if (this.increasing[key] + increment < last) {
        this.increasing[key] += increment
        delay(() => this.doIncrease(key, last), 100)
      } else {
        this.increasing[key] = last
      }
    },
    async fetchKnowledges() {
      this.knowledges = (await getKnowledgeList()).result
      each(this.increasing, (_v, k) => {
        this.doIncrease(k, this.knowledges[k])
      })
      this.flag = 'entity'
    },
    async doSync() {
      const { status } = await syncData()
      if (status === 200) {
        this.$message.success('同步成功')
      }
    },
    async doExport() {
      const { version_id } = this.versionObj
      const { down_url } = (await exportData({ version_id })).result
      window.open(down_url)
    },
    beforeUpload({ file }) {
      const bytesPerPiece = 20 * 1024 * 1024
      const filesize = file.size
      const filename = file.name

      //计算文件切片总数
      const totalPieces = Math.ceil(filesize / bytesPerPiece)
      const fileChunks = []
      for (let i = 0; i < totalPieces; i++) {
        const start = i * bytesPerPiece
        let end = (i + 1) * bytesPerPiece

        if (end > filesize) {
          end = filesize
        }

        const chunk = file.slice(start, end)
        const fd = new FormData()
        fd.append('slice_id', i)
        fd.append('file', chunk)
        fileChunks.push(fd)
      }
      this.doUpload(filename, fileChunks, 0)
    },
    async doUpload(filename, datas, index = 0) {
      if (!datas[index]) {
        this.finishUpload(datas.length, filename)
        return
      }
      if (!this.notification) {
        this.notification = this.$notify({
          title: '正在上传中',
          message: `0/${datas.lenth}`,
          position: 'bottom-right',
          duration: 0,
          showClose: false,
        })
      } else {
        this.notification.message = `${index}/${datas.lenth}`
      }
      console.log(datas[index])
      const { status } = await sliceImport(datas[index])
      if (status === 200) {
        this.doUpload(filename, datas, index + 1)
      }
    },
    async finishUpload(sliceSize, fileName) {
      const { status } = await finishImport({
        slice_size: sliceSize,
        file_name: fileName,
      })
      if (status === 200) {
        this.$message.success('文件上传成功')
      }
    },
  },
}
</script>
<style lang="scss" scoped>
:deep {
  .el-upload {
    width: 100%;
  }
}
</style>
