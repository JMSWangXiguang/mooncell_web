<template>
  <div h="full">
    <el-steps :active="active" simple finish-status="success">
      <!-- <el-step title="创建文献" @click.native="PreActive(0)"></el-step> -->
      <el-step title="上传数据" @click.native="PreActive(0)"></el-step>
      <el-step title="提取文字" @click.native="PreActive(1)"></el-step>
      <!-- <el-step title="提取知识" @click.native="PreActive(3)"></el-step> -->
      <el-step title="审核内容" @click.native="PreActive(2)"></el-step>
      <el-step title="知识库启用" @click.native="PreActive(3)"></el-step>
    </el-steps>
    <div class="basic" v-if="active == '-1'">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>创建文献</span>
        </div>
        <el-form
          ref="dataForm"
          :model="temp"
          label-position="right"
          label-width="120px"
        >
          <el-form-item style="width: 80%" label="文献名称" prop="title">
            <el-input v-model="temp.title" />
          </el-form-item>
          <el-form-item style="width: 80%" label="从属" prop="serial">
            <el-input v-model="temp.serial" />
            <!-- <el-select
              v-model="temp.serial"
              placeholder="请选择"
              w="full"
            >
              <el-option
                v-for="item in organizationals"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select> -->
          </el-form-item>
          <el-form-item label="发行时间" prop="publish_time" style="width: 80%">
            <!-- <el-date-picker
              w="full"
              v-model="temp.publish_time"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker> -->
            <el-input v-model="temp.publish_time" />
          </el-form-item>
          <el-form-item label="版次" style="width: 80%" prop="edition">
            <el-input v-model="temp.edition" />
          </el-form-item>
          <el-form-item label="作者" style="width: 80%" prop="author">
            <el-input v-model="temp.author" />
          </el-form-item>
          <el-form-item label="主编" style="width: 80%" prop="editor">
            <el-input v-model="temp.editor" />
          </el-form-item>
          <el-form-item label="语言" style="width: 80%" prop="language">
            <el-input v-model="temp.language" />
          </el-form-item>
          <el-form-item label="页数" style="width: 80%" prop="page">
            <el-input v-model="temp.page" />
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <div class="basic" v-if="active == '0'">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>上传数据</span>
        </div>
        <el-upload
          class="upload-demo"
          ref="upload"
          :action="action"
          :file-list="fileList"
          :limit="1"
          :on-change="handleChange"
          :auto-upload="false"
          :data="uploadData"
          accept=".pdf"
        >
          <el-button slot="trigger" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px" @click="goapply" type="warning"
            >提交审批</el-button
          >
          <el-button
            style="margin-left: 10px"
            type="success"
            @click="submitUpload"
            :disabled="!temp1.auth.upload"
            >上传</el-button
          >
          <div slot="tip" class="el-upload__tip">
            <div>
              <span>上传时间：</span>
              {{ temp1.upload_time }}
            </div>
            <div style="margin-top: 10px; margin-bottom: 10px">
              <span>上传用户:</span>
              {{ temp1.uploader.name }}
            </div>
            <div style="margin-bottom: 10px">
              <span>文件名称:</span> {{ temp1.file_name }}
            </div>
            <div><span>文件大小:</span> {{ temp1.file_size }}</div>
          </div>
        </el-upload>
        <!-- <div style="margin: 10px 0" v-show="fullscreenLoading"> -->
        <!-- <span style="color: red"> 文件上传中,请耐心等待</span> -->
        <el-progress
          style="margin: 10px 0"
          v-if="fullscreenLoading"
          :percentage="num"
        ></el-progress>
        <!-- </div> -->
      </el-card>
    </div>
    <div class="basic" v-if="active == '1'">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>提取文字</span>
        </div>
        <el-form
          ref="dataForm"
          :model="temp2"
          label-position="right"
          label-width="120px"
        >
          <el-form-item style="width: 80%" label="提取状态">
            <span>{{ temp2.status }}</span>
          </el-form-item>
          <el-form-item style="width: 80%" label="提取进度">
            <el-progress
              :percentage="temp2.rate"
              :stroke-width="10"
            ></el-progress>
          </el-form-item>
          <el-form-item style="width: 80%" label="文档格式">
            <span>{{ temp2.doc_style }}</span>
          </el-form-item>
          <el-form-item style="width: 80%" label="提取方法">
            <el-select v-model="temp2.method_id" placeholder="请选择">
              <el-option
                v-for="item in methodList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="reExtract"
              :disabled="!temp2.auth.retry"
              >重新提取</el-button
            >
          </el-form-item>
          <!-- <el-form-item label="页数" style="width: 80%">
            <span>1043</span>
          </el-form-item> -->
          <!-- <el-form-item label="进度" style="width: 80%">
            <el-progress
              :percentage="percentage"
              :color="customColor"
            ></el-progress>
          </el-form-item> -->
        </el-form>
      </el-card>
    </div>
    <!-- <div class="basic" v-if="active == '3'">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>提取知识</span>
        </div>
        <el-form
          ref="dataForm"
          :model="temp"
          label-position="right"
          label-width="120px"
        >
          <el-form-item style="width: 80%" label="提取状态" prop="name">
            <span>进行中</span>
          </el-form-item>
          <el-form-item style="width: 80%" label="模型" prop="account">
            <span>诊疗指南知识提取模型（默认）</span>
          </el-form-item>
          <el-form-item label="页数" style="width: 80%" prop="organizational">
            <span>1043</span>
          </el-form-item>
          <el-form-item label="进度" style="width: 80%" prop="organizational">
            <el-progress
              :percentage="percentage"
              :color="customColor"
            ></el-progress>
          </el-form-item>
          <el-form-item
            label="已提取实体量"
            style="width: 80%"
            prop="organizational"
          >
          </el-form-item>
          <div style="text-align: center">
            <el-button type="primary" style="margin-right: 10px"
              >开始</el-button
            >
            <el-button>暂停</el-button>
          </div>
        </el-form>
      </el-card>
    </div> -->
    <div class="basic" v-if="active == '2'">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>审核进度</span>
        </div>
        <el-form
          ref="dataForm"
          :model="temp3"
          label-position="right"
          label-width="120px"
        >
          <div style="display: flex">
            <el-form-item style="width: 80%" label="总页数" prop="name">
              <span>{{ temp3.page }}</span>
            </el-form-item>
            <el-form-item style="width: 80%" label="已确认" prop="account">
              <span>{{ temp3.accept }}</span>
            </el-form-item>
            <el-form-item
              label="完成进度"
              style="width: 80%"
              prop="organizational"
            >
              <span>{{ temp3.rate }}</span>
            </el-form-item>
          </div>
          <div style="margin-bottom: 10px">
            <el-button
              style="margin-right: 10px"
              @click="task"
              :disabled="!temp3.auth.assgin"
              >审核任务分配</el-button
            >
            <el-button @click="content()" :disabled="!temp3.auth.vision"
              >审核内容</el-button
            >
          </div>
          <el-table :data="list" border highlight-current-row w="full" :row-style="{height:'20px'}" :cell-style="{padding:'3px'}">
            <el-table-column label="页码范围" prop="range">
              <template slot-scope="scope">
                <span>{{ scope.row.range.from }}</span>
                <span> - </span>
                <span>{{ scope.row.range.to }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="审核人" prop="auditor.name">
            </el-table-column> -->
            <el-table-column label="进度" prop="rate"> </el-table-column>
            <el-table-column label="开始时间" prop="begin_time">
            </el-table-column>
            <el-table-column label="最后处理时间" prop="update_time">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="content(scope.row)"
                  >审核内容</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-card>
    </div>
    <div class="basic" v-if="active == '3'">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>知识库启用</span>
        </div>
        <el-form
          ref="dataForm"
          :model="temp4"
          label-position="right"
          label-width="120px"
        >
          <el-form-item style="width: 80%" label="文献名称">
            <span>{{ temp4.title }}</span>
          </el-form-item>
          <el-form-item style="width: 80%" label="当前状态">
            <span style="color: #82848a" v-show="temp4.devel_status === 'start'"
              >开始</span
            >
            <span style="color: #ff4949" v-show="temp4.devel_status === 'stop'"
              >暂停</span
            >
            <span
              style="color: #67c23a"
              v-show="temp4.devel_status === 'finish'"
              >完成</span
            >
          </el-form-item>
          <el-form-item label="开发状态">
            <el-button
              style="margin-right: 10px"
              type="primary"
              :disabled="temp4.devel_status === 'start'"
              @click="updateDevelStatus('start')"
              >开始</el-button
            >
            <el-button
              style="margin-right: 10px"
              type="danger"
              :disabled="temp4.devel_status === 'stop'"
              @click="updateDevelStatus('stop')"
              >暂停</el-button
            >
            <el-button
              type="success"
              :disabled="temp4.devel_status === 'finish'"
              @click="updateDevelStatus('finish')"
              >完成</el-button
            >
          </el-form-item>
          <!-- <el-form-item label="启用状态">
            <el-button
              type="primary"
              style="margin-right: 10px"
              :disabled="temp4.status === 'access'"
              @click="updateStatus('access')"
              >启用</el-button
            >
            <el-button
              type="info"
              :disabled="temp4.status === 'ban'"
              @click="updateStatus('ban')"
              >停用</el-button
            >
            <el-button
              type="danger"
              :disabled="temp4.status === 'abandon'"
              @click="updateStatus('abandon')"
              >废弃</el-button
            >
            <el-button
              type="success"
              :disabled="temp4.status === 'devel'"
              @click="updateStatus('devel')"
              >开发中</el-button
            >
          </el-form-item> -->
          <!-- <div style="margin-bottom: 10px">
            <el-button style="margin-right: 10px" type="primary"
              >开始</el-button
            >
            <el-button style="margin-right: 10px" type="danger">暂停</el-button>
            <el-button type="success">完成</el-button>
          </div> -->
          <!-- <el-form-item
            label="是否启用"
            style="width: 80%"
            prop="organizational"
          >
            <span style="color: red">未启用</span>
          </el-form-item> -->
          <!-- <div>
            <el-button type="primary" style="margin-right: 10px"
              >启用</el-button
            >
            <el-button type="info">停用</el-button>
            <el-button type="danger">废弃</el-button>
            <el-button type="success">开发中</el-button>
          </div> -->
        </el-form>
      </el-card>
    </div>
    <div style="margin-top: 20px; text-align: center">
      <el-button
        type="primary"
        v-if="
          active == '1' ||
          active == '2' ||
          active == '3' ||
          active == '4' ||
          active == '5'
        "
        @click="pre"
        style="margin-right: 10px"
        >上一步</el-button
      >
      <el-button
        type="primary"
        style="margin-right: 10px"
        @click="saveDate"
        v-if="active == '2' || active == '0'"
        >保存</el-button
      >
      <el-button
        type="primary"
        v-if="active == '1' || active == '2' || active == '3' || active == '0'"
        @click="next"
        >下一步</el-button
      >
    </div>
  </div>
</template>
<script>
import {
  getBibliography,
  createBibliography,
  updateBibliography,
  getDatafile,
  upload,
  getLoadword,
  getLoadwordMethod,
  updateLoadword,
  retryLoadword,
  getAuditing,
  getStatus,
  statusOnoff,
  statusDevel,
} from "@/api/literature/automaticEntry";
import request from "@/utils/request";
export default {
  data() {
    return {
      active: 0,
      action: "",
      fileList: [],
      uploadData: {},
      temp: {
        title: "",
        serial: "",
        edition: "",
        publish_time: "",
        bid: "",
        author: "",
        editor: "",
        language: "",
        page: null,
        auth: {},
      },
      temp1: {
        upload_time: "",
        uploader: {},
        file_name: "",
        file_size: "",
        auth: {},
      },
      temp2: {
        bid: "",
        doc_style: "",
        method_name: "",
        method_id: "",
        status: "",
        auth: {},
      },
      temp3: {
        rate: "",
        page: "",
        accept: "",
        auth: {},
      },
      temp4: {
        title: "",
        devel_status: "",
        status: "",
      },
      // percentage: 20,
      customColor: "#409eff",
      list: [],
      dialogFormVisible: false,
      bidObj: {},
      methodList: [],
      fullscreenLoading: false,
      num: 0,
      totalNum: null,
    };
  },
  created() {
    this.bidObj = this.$route.query;
    this.getLoadwordMethod();
    this.getBibliography(this.bidObj);
  },
  methods: {
    //点击步骤条
    PreActive(val) {
      this.active = val;
      switch (this.active) {
        case 1:
          this.getDatafile(this.bidObj);
          break;
        case 2:
          this.getLoadword(this.bidObj);
          break;
        case 3:
          this.getAuditing(this.bidObj);
          break;
        case 4:
          this.getStatus(this.bidObj);
          break;
      }
    },
    //下一步
    next() {
      this.active++;
      switch (this.active) {
        case 1:
          this.getDatafile(this.bidObj);
          break;
        case 2:
          this.getLoadword(this.bidObj);
          break;
        case 3:
          this.getAuditing(this.bidObj);
          break;
        case 4:
          this.getStatus(this.bidObj);
          break;
      }
      if (this.active > 4) this.active = 0;
    },
    //上一步
    pre() {
      --this.active;
      if (this.active < 0) this.active = 0;
    },
    //创建文献
    getBibliography(params) {
      getBibliography(params).then((res) => {
        this.temp = res.result;
      });
    },
    //上传文件信息
    getDatafile(params) {
      getDatafile(params).then((res) => {
        this.temp1 = res.result;
      });
    },
    //文件上传方法
    submitUpload() {
      if (this.fileList.length > 0) {
        this.fullscreenLoading = true;

        let bytesPerPiece = 20 * 1024 * 1024;
        let blob = this.fileList[0].raw;
        let filesize = blob.size;
        let filename = blob.name;

        //计算文件切片总数
        let totalPieces = Math.ceil(filesize / bytesPerPiece);
        this.totalNum = 100 / (totalPieces + 1);
        let fileChunks = new Array(totalPieces).fill(1).map((item, index) => {
          let start = index * bytesPerPiece;
          let end = (index + 1) * bytesPerPiece;

          if (end > filesize) {
            end = filesize;
          }

          let chunk = blob.slice(start, end);
          let fd = new FormData();
          fd.append("slice_id", index);
          fd.append("bid", this.bidObj.bid);
          fd.append("file", chunk);
          return fd;
        });
        this.upDataFile(filename, fileChunks, 0);
      } else {
        this.$message.error("请先选择需要上传的文件");
      }
    },
    handleChange(files, fileList) {
      this.fileList = fileList;
    },
    // 上传文件
    upDataFile(filename, datas, index = 0) {
      this.num = parseInt((index + 1) * this.totalNum - 1);
      if (!datas[index]) {
        this.slicefinish(datas.length, filename);
        return;
      }
      request({
        url: "roc/v1/autoreader/datafile/sliceupload",
        method: "post",
        data: datas[index],
      })
        .then((res) => {
          if (res.status === 200) {
            this.upDataFile(filename, datas, index + 1);
          }
        })
        .catch((error) => {});
    },
    //分片上传完调合成上传接口
    slicefinish(sliceSize, fileName) {
      const params = {
        slice_size: sliceSize,
        bid: this.bidObj.bid,
        file_name: fileName,
      };
      request({
        url: "roc/v1/autoreader/datafile/slicefinish",
        method: "post",
        data: params,
      })
        .then((res) => {
          if (res.status === 200) {
            this.$message.success("文件上传成功");
            this.getDatafile(this.bidObj);
            this.fullscreenLoading = false;
            this.fileList = [];
          }
        })
        .catch((error) => {
          this.$message.error("文件上传失败");
          this.fullscreenLoading = false;
        });
    },
    //获取文字提取进度
    getLoadword(params) {
      getLoadword(params).then((res) => {
        this.temp2 = res.result;
      });
    },
    //提取方法列表
    getLoadwordMethod() {
      getLoadwordMethod().then((res) => {
        this.methodList = res.result.method;
      });
    },
    //重新提取
    reExtract() {
      retryLoadword({ bid: this.bidObj.bid }).then((res) => {
        this.$message.success("重新提取成功");
      });
    },
    //获取文献审核状态信息
    getAuditing(params) {
      getAuditing(params).then((res) => {
        this.temp3 = res.result;
        this.list = res.result.task;
      });
    },
    //获取文献审核状态信息
    getStatus(params) {
      getStatus(params).then((res) => {
        this.temp4 = res.result;
      });
    },
    //跳转到任务页
    task() {
      this.$router.push({
        path: "/literatureEntry/content",
        query: this.bidObj,
      });
    },
    //跳转到内容
    content(row) {
      let obj = {};
      if (row) {
        obj = {
          from: row.range.from,
          to: row.range.to,
          bid: this.bidObj.bid,
        };
      } else {
        obj = {
          from: "0",
          to: this.temp3.page,
          bid: this.bidObj.bid,
        };
      }
      this.$router.push({ path: "/myTask/info", query: obj });
    },
    //更新开发状态
    updateDevelStatus(val) {
      statusDevel({ bid: this.bidObj.bid, devel: val }).then((res) => {
        this.$message.success("更新开发状态成功");
        this.getStatus(this.bidObj);
      });
    },
    //更新启用状态
    updateStatus(val) {
      statusOnoff({ bid: this.bidObj.bid, status: val }).then((res) => {
        this.$message.success("更新启用状态成功");
        this.getStatus(this.bidObj);
      });
    },
    //保存
    saveDate() {
      switch (this.active) {
        case 0: //更新创建文献保存
          this.$refs["dataForm"].validate((valid) => {
            if (valid) {
              updateBibliography(this.temp).then((res) => {
                this.$message.success("保存成功");
              });
            }
          });
          break;
        case 2:
          this.temp2.bid = this.bidObj.bid;
          updateLoadword(this.temp2).then((res) => {
            this.$message.success("保存成功");
          });
          break;
      }
    },

    // 提交审批
    goapply() {},
  },
};
</script>
<style scoped>
.basic {
  width: 80%;
  height: 80%;
  overflow: auto;
  padding: 20px;
  margin: 0 auto;
}
::v-deep .el-progress {
  line-height: 2;
}
</style>
