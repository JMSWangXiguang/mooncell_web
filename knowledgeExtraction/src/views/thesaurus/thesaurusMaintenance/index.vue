<!--
 * @Descripttion:
 * @version:
 * @Author: 唐红娟
 * @Date: 2020-08-25 14:33:03
 * @LastEditors: 唐红娟
 * @LastEditTime: 2020-08-25 14:33:03
-->
<template>
  <div class="wrap">
    <el-row class="flex_box" :gutter="20">
      <el-col :span="5" h="full">
        <searchBox :sendparams="sendparams" @node-click="selectItem"></searchBox>
      </el-col>
      <el-col :span="19" style="height:100%;overflow:hidden;">
        <div style="text-align:right;height:37px">
          <!-- <el-button type="primary" class="mb-5" @click="newBuilt">新建词汇</el-button> -->
        </div>
        <div class="content-box">
          <div style="flex:2;margin-right:20px" class="middle-content">
            <el-form ref="form" :model="form" label-width="80px" class="form-box" style="hieght:40%">
              <el-form-item label="词汇" prop="word">
                <el-input
                  style="width:85%;"
                  v-model="form.word"
                  placeholder="请输入新词汇"
                />
              </el-form-item>
              <el-form-item label="分类" prop="topic">
                <el-select v-model="form.topic" placeholder="请选择" style="width:85%;" >
                  <el-option
                    v-for="item in topicList"
                    :key="item.speech_id"
                    :label="item.name"
                    :value="item.speech_id">
                  </el-option>
                </el-select>
              </el-form-item>
              <div style="position:absolute;top:20%;right:0">
                <el-button type="primary" class="mb-5" @click="processedUpdate">修改</el-button>
              </div>
            </el-form>
            <el-form ref="formHope" :model="formHope" label-width="90px" class="form-box" style="height:40%">
              <el-form-item label="标准术语" prop="mian">
                <el-input
                  style="width:85%;"
                  v-model="formHope.main"
                  placeholder="请输入新词汇"
                />
              </el-form-item>
              <el-form-item label="相关同义词">
                <el-input
                  style="width:85%;"
                  type="textarea"
                  :rows="4"
                  v-model="formHope.synonym1"
                  placeholder="请输入相关同义词"
                />
              </el-form-item>
              <div style="position:absolute;top:15%;right:0">
                <el-button type="primary" class="mb-5" @click="synonymUpdate">修改</el-button>
              </div>
            </el-form>
          </div>
          <div class="right-slider box-border">
            <el-divider content-position="left">相似词</el-divider>
            <similar style="padding:10px;height:93%;" @node-click="synonymParams" :value="value"></similar>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import searchBox from '../components/searchBox'
import similar from '../components/similar'
import { getSpeechList, getHopeInfo } from '@/api/thesaurus/minigNewWord'
import { getInfo, processedUpdate, synonymUpdate } from '@/api/thesaurus/thesaurusMaintenance'
export default {
  name:'MingNewWord',
  components:{
    searchBox,
    similar
  },
  data(){
    return{
      form:{
        word_id:'',
        word:'',
        topic:'',
        // topic_name:''
      },
      topicList:[],
      formHope:{
        main:'',
        synonym1:'',
        word_id:'',
        point_id:'',
        topic:'',
        synonym:[]
      },
      sendparams:{
        isUpdate:false,
        value:'2'
      },
      value:'1'
    }
  },
  created(){
    this.getSpeechList()
  },
  methods:{
    //子组件传值
    selectItem(val){
      if(val.id){
        this.getInfo(val)
      }
    },
    //下拉框数据
    getSpeechList(){
      getSpeechList().then(res=>{
        this.topicList = res.result.speech_list
      })
    },
    //获取词汇分类，标准词汇，同义词详情
    getInfo(obj){
      getInfo({word_id:obj.id}).then(res=>{
        this.form.word = res.result.word
        this.form.word_id = res.result.id
        this.form.topic = res.result.topic.id

        this.formHope.main = res.result.main
        this.formHope.word_id = res.result.id
        this.formHope.point_id = res.result.point_id
        this.formHope.topic = res.result.topic.id
        this.formHope.synonym1 = res.result.synonym.join(' ')
      })
    },
    synonymParams(val){
      getHopeInfo({word_id:val.id}).then(res=>{
        if(val.index == 1){
          this.formHope.point_id = res.result.point_id
          this.formHope.main = res.result.main
          this.formHope.synonym1 = res.result.synonym.join(' ')
        }else{
          if(this.formHope.synonym1.indexOf(res.result.word) == -1){
             this.formHope.synonym1 = this.formHope.synonym1.concat(' ',res.result.word)
          }else{
            this.$message('添加的相关同义词已存在')
          }
        }
      })
    },
    //修改保存词汇、分类
    processedUpdate(){
      processedUpdate(this.form).then(res=>{
        if(res.status == 200){
          this.sendparams.isUpdate = true
          this.$message('修改成功')
        }
      })
    },
    //修改保存标准术语，相关同义词
    synonymUpdate(){
      this.formHope.synonym = this.formHope.synonym1.split(' ')
      synonymUpdate(this.formHope).then(res=>{
        if(res.status == 200){
          this.sendparams.isUpdate = true
          this.$message('修改成功')
        }
      })
    },
  }
}
</script>
<style lang="scss" scoped>
  .wrap{
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0;
    top: 0;
    left: 0;
    padding: 10px 20px;
    overflow: hidden;
  }
  .content-box{
    height: 92%;
    border: 1px solid #dcdfe6;
    display: flex;
    padding: 15px;
  }
  .middle-content{
    flex: 2;
  }
  .right-slider{
    flex: 1;
    height: 100%;
  }
  .box-border{
    border: 1px solid #DCDFE6;
    border-top: none;
  }
  .text-box{
    height:100%;
    padding:10px;
    overflow-y: scroll;
    color:#606266;
  }
  .el-divider--horizontal{
    margin: 0;
  }
  .el-row {
    height: 100%;
  }
  .form-box{
    height: 30%;
    padding: 10px;
    overflow: hidden;
    position: relative;
  }
  .el-form-item__content{
    height: 100%;
  }
</style>
