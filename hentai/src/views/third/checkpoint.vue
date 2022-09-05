<template>
  <div class="w-full h-full">
    <div class="correct text" style="padding: 8px; background: #f8f8f8">质控提醒</div>
    <div style="position: absolute; top: 6px; right: 8px">
      <el-button
        type="text"
        icon="el-icon-refresh"
        circle
        plain
        style="font-size: 20px; padding: 0"
        @click="fresh"
      ></el-button>
    </div>
    <el-collapse
      v-loading="loading"
      v-model="obj.doc_title"
      accordion
      class="h-[calc(100%-40px)] scrollbar-thin"
    >
      <custom-result v-if="!sliderList.length || obj.status !== 'finished'" :status="obj.status" />
      <template v-else v-for="item in sliderList">
        <el-collapse-item :name="item.doc_title" :key="item.doc_id">
          <template #title>
            <div class="title bg correct">
              {{ item.doc_title }}
              <label v-if="tableData.length" class="text-color-danger">
                共{{ tableData.length }}项
              </label>
            </div>
          </template>
          <div class="list-none">
            <transition-group name="el-zoom-in-top">
              <div v-for="(it, i) in tableData" :key="i" class="list-item">
                <el-divider class="m-0" />
                <div :class="`mt-8px subTitle bg ${it.status}`">
                  <label class="text-sm text-color-text-primary">{{ it.chapter_name }}</label>
                  <label :class="`ml-8px text ${it.status}`" v-if="it.message">
                    {{ it.message }}
                  </label>
                </div>
                <div v-html="it.remark" class="px-16px break-words"></div>
                <div class="m-8px text-right">
                  <el-tooltip v-if="it.suggest" content="来源" placement="top-end">
                    <el-button
                      v-if="it.refer"
                      :type="it.flag === 'refer' ? 'success' : 'info'"
                      class="p-0 leading-0 text-xl"
                      @click="
                        it.flag === 'refer' ? $set(it, 'flag', null) : $set(it, 'flag', 'refer')
                      "
                    >
                      <svg-icon icon-class="refer" />
                    </el-button>
                  </el-tooltip>
                  <el-tooltip v-if="it.suggest" content="参考" placement="top-start">
                    <el-button
                      v-if="it.suggest"
                      :type="it.flag === 'suggestion' ? 'success' : 'info'"
                      class="p-0 leading-0 text-xl"
                      @click="
                        it.flag === 'suggestion'
                          ? $set(it, 'flag', null)
                          : $set(it, 'flag', 'suggestion')
                      "
                    >
                      <svg-icon icon-class="suggestion" class-name="p-2px" />
                    </el-button>
                  </el-tooltip>
                  <!-- <el-button
                  :type="it.flag === 'feedback' ? 'success' : 'info'"
                  class="p-0 leading-0 text-xl"
                  @click="
                    it.flag === 'feedback' ? $set(it, 'flag', null) : $set(it, 'flag', 'feedback')
                  "
                >
                  <svg-icon icon-class="feedback" />
                </el-button> -->
                </div>
                <transition-group name="el-fade-in">
                  <div v-if="it.flag === 'refer'" key="desc" class="flex commit-box">
                    <div class="w-25px px-3px flex items-center bg-color-info">
                      <span class="text-lg text-white">来源</span>
                    </div>
                    <div v-html="it.refer" class="py-10px ml-10px break-words"></div>
                  </div>
                  <div v-if="it.flag === 'suggestion'" key="desc" class="flex commit-box">
                    <div class="w-25px p-3px flex items-center bg-color-info">
                      <span class="text-lg text-white">参考</span>
                    </div>
                    <div v-html="it.suggest" class="py-10px ml-10px break-words"></div>
                  </div>
                  <template v-if="it.flag === 'feedback'">
                    <el-row class="commit-box" type="flex" justify="between">
                      <el-col>
                        <el-radio-group v-model="it.commit">
                          <el-radio label="1" class="correct text"> 确认 </el-radio>
                          <el-radio label="2" class="error text"> 驳回 </el-radio>
                          <el-radio label="3" class="abandon text"> 废弃 </el-radio>
                        </el-radio-group>
                      </el-col>
                      <el-col style="flex: 0">
                        <el-button type="primary" plain @click="saveData(it, it.commit)">
                          提交
                        </el-button>
                      </el-col>
                    </el-row>
                    <el-row v-if="it.commit === '2'" class="commit-box pt-0">
                      <el-col :span="24">
                        <el-input
                          type="textarea"
                          v-model="it.remark"
                          :disabled="it.status === '2'"
                        ></el-input>
                      </el-col>
                    </el-row>
                  </template>
                  <div v-if="!!it.flag" key="back" class="text-center leading-0">
                    <el-button
                      type="success"
                      icon="el-icon-caret-top"
                      class="py-0 rounded-none px-20px leading-0 children:leading-6px"
                      @click="$set(it, 'flag', null)"
                    ></el-button>
                  </div>
                </transition-group>
              </div>
            </transition-group>
          </div>
        </el-collapse-item>
      </template>
    </el-collapse>
  </div>
</template>
<script>
import { getList, getDoc, update } from '@/api/third'
import { delay } from 'lodash'
import CustomResult from './custom-result.vue'
export default {
  components: { CustomResult },
  data() {
    return {
      loading: false,
      curTopic: {
        doc_id: '',
      },
      sliderList: [],
      tableData: [],
      dialogVisible: false,
      obj: {},
      options: [
        {
          value: '0',
          label: '未确认',
        },
        {
          value: '1',
          label: '确认正确',
        },
        {
          value: '2',
          label: '确认有误',
        },
        {
          value: '3',
          label: '完全错误',
        },
      ],
    }
  },
  mounted() {
    this.obj = this.$route.query
    this.getDoc(this.obj)
  },
  methods: {
    // 表格列表
    async getList(params) {
      const { result } = await getList(params)
      this.tableData = result.map((item) => {
        const findD = this.tableData.find((d) => d.guid === item.guid)
        return {
          ...findD,
          ...item,
        }
      })
    },
    // 左侧列表
    async getDoc(params) {
      this.loading = true
      const { result } = await getDoc(params)
      const { docs, status } = result
      this.sliderList = docs
      this.obj.status = status
      if (this.sliderList.length > 0) {
        this.obj.doc_id = this.sliderList[0].doc_id
        this.obj.doc_title = this.sliderList[0].doc_title
        await this.getList(this.obj)
      }
      this.loading = false
      if (status !== 'finished' && status !== 'error') {
        delay(() => {
          this.getDoc(this.obj)
        }, 3000)
      }
    },
    // 点击自动刷新，刷新
    fresh() {
      this.getDoc(this.obj)
    },
    // 下拉框切换
    changeVal(val) {
      this.obj.doc_id = val
      this.getList(this.obj)
    },
    // 点击左边菜单切换
    handleClick(item) {
      this.curTopic = item
      this.obj.doc_id = item.doc_id
      this.getList(this.obj)
    },
    // 保存
    saveData(row, status) {
      if (status === '3') {
        this.$confirm('确定废弃该信息吗?', '提示', {
          confirmButtonText: '确定废弃',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            row.status = status
            update(row).then(() => {
              this.$message.success('保存成功')
              this.getList(this.obj)
            })
          })
          .catch(() => {})
      } else {
        row.status = status
        update(row).then(() => {
          this.$message.success('保存成功')
          this.getList(this.obj)
        })
      }
    },
  },
}
</script>
<style lang="scss" scoped>
#app {
  padding: 20px;
}
.el-row {
  height: 100%;
}
.el-col {
  height: 100%;
}
.circle {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
}
.correct.text {
  color: $--color-success;
}
.correct.bg::before,
.finished.bg::before {
  background: $--color-success;
}
.error.text {
  color: $--color-danger;
}
.error.bg::before,
.error.bg::before {
  background: $--color-danger;
}
.wait.text {
  color: $--color-warning;
}
.wait.bg::before,
.wait.bg::before {
  background: $--color-warning;
}
.running.bg::before {
  background: $--color-primary;
}
.abandon.text {
  color: $--color-info;
}
.abandon.bg::before,
.abandon.bg::before {
  background: $--color-info;
}
.title {
  color: #000;
  font-weight: 900;
  font-size: 15px;
  padding-left: 16px;
  position: relative;
  > label {
    font-size: 10px;
    color: #bfbfbf;
  }
  &::before {
    display: block;
    content: '';
    position: absolute;
    height: 13px;
    width: 3px;
    margin-left: -8px;
    top: calc(50% - 7px);
    border-radius: 30%;
  }
}
.subTitle {
  font-size: 14px;
  position: relative;
  padding-left: 26px;
  > label {
    font-size: 12px;
    color: $--color-info;
  }
  &::before {
    display: block;
    content: '';
    background: #000;
    position: absolute;
    height: 8px;
    width: 4px;
    margin-left: -8px;
    top: calc(50% - 4px);
    border-radius: 60%;
  }
}
.commit-box {
  background: $--background-color-base;
  padding-right: 10px;
  .el-button {
    padding: 3px 6px 4px 6px;
    font-size: 15px;
  }
  :deep(.el-textarea__inner) {
    padding: 5px 10px;
  }
}
:deep {
  .el-collapse-item__header {
    height: 42px;
    line-height: 42px;
  }
  .el-collapse-item__content {
    padding-bottom: 0;
  }
  .el-tabs__content {
    padding: 0;
  }
  b {
    font-weight: 900;
  }
}
</style>
