<!--
 * @Description:
 * @version:
 * @Author: 唐红娟
 * @Date: 2020-08-25 14:33:03
 * @LastEditors: imali
 * @LastEditTime: 2022-08-24 16:44:00
-->
<template>
  <div class="wrap">
    <el-row class="flex_box" :gutter="20">
      <el-col :span="6" style="height: 100%">
        <searchBox
          ref="searchBox"
          :sendparams="sendparams"
          @node-click="selectItem"
          @sendIsUpdate="sendIsUpdate"
        />
      </el-col>
      <el-col :span="18" style="height: 100%; overflow: hidden">
        <div>
          <p-button-dialog
            ref="newDialog"
            type="primary"
            :button="{ label: '新建词汇', type: 'primary' }"
            title="新建词汇"
            width="500px"
            destroy-on-close
          >
            <el-form :model="newForm" label-width="80px" class="form-box">
              <el-form-item label="新词汇">
                <el-input v-model="newForm.word" style="width: 90%" />
              </el-form-item>
              <el-form-item label="分类">
                <el-select v-model="newForm.topic" style="width: 90%">
                  <el-option
                    v-for="item in topicList"
                    :key="item.speech_id"
                    :label="item.name"
                    :value="item.speech_id"
                  />
                </el-select>
              </el-form-item>
            </el-form>
            <template #footer>
              <el-button @click="$refs.newDialog.dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="newBuilt">提交</el-button>
            </template>
          </p-button-dialog>
        </div>
        <div class="content-box mt-10px bg-white">
          <div style="flex: 2; margin-right: 20px" class="middle-content">
            <div class="box-border" style="height: 35%">
              <el-divider content-position="left">原始文本</el-divider>
              <div class="text-box">
                <span>{{ content1 }}</span>
                <span style="color: red">{{ content2 }}</span>
                <span>{{ content3 }}</span>
              </div>
            </div>
            <el-form ref="form" :model="form" label-width="80px" class="form-box">
              <el-form-item label="新词汇">
                <el-input v-model="form.word" style="width: 90%" disabled />
              </el-form-item>
              <el-form-item label="分类">
                <el-input v-model="form.topic_name" style="width: 90%" disabled />
              </el-form-item>
              <div class="text-center">
                <el-button type="primary" class="mb-5px" :disabled="show" @click="bind">
                  绑定
                </el-button>
                <el-button type="primary" class="mb-5px" @click="build">新词</el-button>
                <el-button type="primary" class="mb-5px" @click="abandon">废弃</el-button>
              </div>
            </el-form>
            <el-form ref="formHope" :model="formHope" label-width="90px" class="form-box">
              <el-form-item label="标准术语">
                <el-input v-model="formHope.main" style="width: 90%" disabled />
              </el-form-item>
              <el-form-item label="相关同义词">
                <el-input
                  v-model="formHope.synonym"
                  style="width: 90%"
                  type="textarea"
                  :rows="2"
                  disabled
                />
              </el-form-item>
            </el-form>
          </div>
          <div class="right-slider box-border">
            <el-divider content-position="left">相似词</el-divider>
            <similar
              style="padding: 10px; height: 93%"
              :value="value"
              @node-click="synonymParams"
            />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import searchBox from '../components/searchBox'
import similar from '../components/similar'
import {
  getInfo,
  getSpeechList,
  getHopeInfo,
  synonymBind,
  synonymBuild,
  synonymAbandon,
  synonymCreate,
} from '@/api/thesaurus/minigNewWord'
export default {
  name: 'MingNewWord',
  components: {
    searchBox,
    similar,
  },
  data() {
    return {
      form: {
        word: '',
        topic: '',
        word_id: '',
        topic_name: '',
        point_id: '',
      },
      newForm: {
        word: '',
        topic: '',
      },
      formHope: {
        main: '',
        synonym: '',
      },
      topicList: [],
      params: {
        page: 1,
        size: 20,
      },
      paramsInfo: {},
      content1: '',
      content2: '',
      content3: '',
      sendparams: {
        isUpdate: false,
        value: '1',
      },
      show: false,
      value: '0',
    }
  },
  created() {
    this.getSpeechList()
  },
  methods: {
    // 子组件传值
    selectItem(val) {
      if (val.id) {
        this.getInfo(val)
      }
    },
    // 获取详情
    getInfo(obj) {
      getInfo({ word_id: obj.id }).then((res) => {
        this.paramsInfo = res.result
        const { content, location } = this.paramsInfo.source
        if (content) {
          this.content1 = content.substring(0, location.start)
          this.content2 = content.substring(location.start, location.end)
          this.content3 = content.substring(location.end)
        }
        this.form.word = this.paramsInfo.word
        this.form.topic_name = this.paramsInfo.topic.title
        this.form.topic = this.paramsInfo.topic.id
        this.form.word_id = this.paramsInfo.id
      })
    },
    // 下拉框数据
    getSpeechList() {
      getSpeechList().then((res) => {
        this.topicList = res.result.speech_list
      })
    },
    // 相似词点击传值
    synonymParams(val) {
      if (val.id) {
        getHopeInfo({ word_id: val.id }).then((res) => {
          this.formHope.main = res.result.main
          this.formHope.synonym = res.result.synonym.join(' ')
          this.form.point_id = res.result.point_id
          this.show = false
        })
      } else {
        this.formHope = {
          main: '',
          synonym: '',
        }
        this.show = true
      }
    },
    // 接收子组件传过来的isUpdate的值
    sendIsUpdate(val) {
      this.sendparams.isUpdate = val.isUpdate
    },
    // 绑定
    bind() {
      synonymBind(this.form).then((res) => {
        if (res.status === 200) {
          this.sendparams.isUpdate = true
          this.$message.success('绑定成功')
        }
      })
    },
    // 新词
    build() {
      synonymBuild(this.form).then((res) => {
        if (res.status === 200) {
          this.sendparams.isUpdate = true
          this.$message.success('保存成功')
        }
      })
    },
    // 废弃
    abandon() {
      synonymAbandon({ word_id: this.form.word_id }).then((res) => {
        if (res.status === 200) {
          this.sendparams.isUpdate = true
          this.$message.success('废弃成功')
        }
      })
    },
    // 新建词汇
    async newBuilt() {
      const { word, topic } = this.newForm
      const { list, handleClick } = this.$refs.searchBox
      const { result } = await synonymCreate(this.newForm)
      const newItem = {
        word,
        id: result.id,
        topic: this.topicList.find((t) => t.speech_id === topic)?.name,
      }
      this.$refs.searchBox.list = [newItem, ...list]
      handleClick(newItem)
      this.$refs.newDialog.dialogVisible = false
    },
    // 移除同义词
    Delete() {},
  },
}
</script>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
  top: 0;
  left: 0;
  padding: 10px 20px;
  overflow: hidden;
}
.content-box {
  height: calc(100vh - 162px);
  border: 1px solid #dcdfe6;
  display: flex;
  padding: 15px;
}
.middle-content {
  flex: 2;
}
.right-slider {
  flex: 1;
  height: 100%;
}
.box-border {
  border: 1px solid #dcdfe6;
  border-top: none;
}
.text-box {
  height: 100%;
  padding: 10px;
  overflow-y: auto;
  color: #606266;
}
.el-divider--horizontal {
  margin: 0;
}
.el-row {
  height: 100%;
}
.form-box {
  height: 30%;
  padding: 10px;
  overflow: hidden;
}
</style>
