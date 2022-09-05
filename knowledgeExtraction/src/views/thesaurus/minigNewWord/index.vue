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
      <el-col :span="6" h="full">
        <searchBox @node-click="selectItem" :sendparams="sendparams" @sendIsUpdate="sendIsUpdate"></searchBox>
      </el-col>
      <el-col :span="18" style="height:100%;overflow:hidden;">
        <div style="text-align:right;height:30px;">
          <!-- <el-button type="primary" class="mb-5" @click="newBuilt">新建词汇</el-button> -->
        </div>
        <div class="content-box">
          <div style="flex:2;margin-right:20px" class="middle-content">
            <div class="box-border" style="height:35%;">
              <el-divider content-position="left">原始文本</el-divider>
              <div class="text-box">
                <span>{{content1}}</span>
                <span style="color:red">{{content2}}</span>
                <span>{{content3}}</span>
              </div>
            </div>
            <el-form ref="form" :model="form" label-width="80px" class="form-box">
              <el-form-item label="新词汇">
                <el-input
                  style="width:90%;"
                  v-model="form.word"
                  disabled
                />
              </el-form-item>
              <el-form-item label="分类">
                <el-select v-model="form.topic_name" style="width:90%;" disabled>
                  <el-option
                    v-for="item in topicList"
                    :key="item.speech_id"
                    :label="item.name"
                    :value="item.speech_id">
                  </el-option>
                </el-select>
              </el-form-item>
              <div class="text-center">
                <el-button type="primary" class="mb-5" @click="bind" :disabled="show">绑定</el-button>
                <el-button type="primary" class="mb-5" @click="build">新词</el-button>
                <el-button type="primary" class="mb-5" @click="abandon">废弃</el-button>
              </div>
            </el-form>
            <el-form ref="formHope" :model="formHope" label-width="90px" class="form-box">
              <el-form-item label="标准术语">
                <el-input
                  style="width:90%;"
                  v-model="formHope.main"
                  disabled
                />
              </el-form-item>
              <el-form-item label="相关同义词">
                <el-input
                  style="width:90%;"
                  type="textarea"
                  :rows="2"
                  v-model="formHope.synonym"
                  disabled
                />
              </el-form-item>
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
import { getInfo, getSpeechList, getHopeInfo, synonymBind, synonymBuild, synonymAbandon } from '@/api/thesaurus/minigNewWord'
export default {
  name:'MingNewWord',
  components:{
    searchBox,
    similar
  },
  data(){
    return{
      form:{
        word:'',
        topic:'',
        word_id:'',
        topic_name:'',
        point_id:''
      },
      formHope:{
        main:'',
        synonym:''
      },
      topicList:[],
      params: {
        page: 1,
        size: 20
      },
      paramsInfo:{},
      content1:'',
      content2:'',
      content3:'',
      sendparams:{
        isUpdate:false,
        value:'1'
      },
      show:false,
      value:'0'
    }
  },
  created(){
    // this.getSpeechList();
  },
  methods:{
    //子组件传值
    selectItem(val){
      if(val.id){
        this.getInfo(val)
      }
    },
    //获取详情
    getInfo(obj){
      getInfo({word_id:obj.id}).then(res=>{
        this.paramsInfo = res.result
        this.content1 = this.paramsInfo.source.content.substring(0,this.paramsInfo.source.location.start)
        this.content2 = this.paramsInfo.source.content.substring(this.paramsInfo.source.location.start,this.paramsInfo.source.location.end)
        this.content3 = this.paramsInfo.source.content.substring(this.paramsInfo.source.location.end)
        this.form.word= this.paramsInfo.word
        this.form.topic_name= this.paramsInfo.topic.title
        this.form.topic= this.paramsInfo.topic.id
        this.form.word_id= this.paramsInfo.id
      })
    },
    //下拉框数据
    getSpeechList(){
      getSpeechList().then(res=>{
        this.topicList = res.result.speech_list
      })
    },
    //相似词点击传值
    synonymParams(val){
      if(val.id){
        getHopeInfo({word_id:val.id}).then(res=>{
          this.formHope.main = res.result.main
          this.formHope.synonym = res.result.synonym.join(' ')
          this.form.point_id = res.result.point_id
          this.show = false
        })
      }else{
        this.formHope = {
          main:'',
          synonym:''
        }
        this.show = true
      }
    },
    //接收子组件传过来的isUpdate的值
    sendIsUpdate(val){
      this.sendparams.isUpdate = val.isUpdate
    },
    //绑定
    bind(){
      synonymBind(this.form).then(res=>{
        if(res.status == 200){
          this.sendparams.isUpdate = true
          this.$message.success('绑定成功')
        }
      })
    },
    //新词
    build(){
      synonymBuild(this.form).then(res=>{
        if(res.status == 200){
          this.sendparams.isUpdate = true
          this.$message.success('保存成功')
        }
      })
    },
    //废弃
    abandon(){
      synonymAbandon({word_id:this.form.word_id}).then(res=>{
        if(res.status == 200){
          this.sendparams.isUpdate = true
          this.$message.success('废弃成功')
        }
      })
    },
    //新建词汇
    newBuilt(){},
    //移除同义词
    Delete(){},
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
  }
</style>
