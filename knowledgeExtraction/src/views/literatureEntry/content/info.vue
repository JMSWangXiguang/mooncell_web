<!--
 * @Description: 
 * @version: 
 * @Author: 陈逸
 * @Date: 2022-04-01 14:03:49
 * @LastEditors: 陈逸
 * @LastEditTime: 2022-05-27 13:15:11
-->
<template>
  <div class="content">
    <div class="wrap">
      <div style="width: 100px; margin-right: 10px">
        <div style="height: 30px">
          <!-- <el-button @click="drawer = true" type="primary">
            打开目录
          </el-button> -->
        </div>
        <div class="img_scroll">
          <div
            w="full"
            v-for="(item, index) in list"
            :ref="'img-' + (index + 1)"
            :key="index"
          >
            <img
              class="thumbnail"
              :src="item.img_small_url"
              @click="review(item)"
              :class="item.status"
              id="left"
            />
            <div
              class="pagination_size"
              :class="{
                activeColor: curTopic.page === item.page,
              }"
            >
              第{{ item.page }}页
            </div>
          </div>
          <el-drawer
            title="文件目录"
            :visible.sync="drawer"
            :direction="direction"
          >
            <!-- <el-button
              type="primary"
              style="margin-bottom: 10px"
              @click="newEdit"
              >新建</el-button
            > -->
            <el-tree
              ref="tree"
              highlight-current
              node-key="cata_id"
              :data="treeList"
              :props="defaultProps"
              :expand-on-click-node="false"
              :default-expanded-keys="expandData"
              @node-click="handleCheck"
            >
              <span
                class="custom-tree-node"
                slot-scope="{ node, data }"
                style="display: inline-block; width: 100%"
              >
                <span class="directory_name">{{ node.label }}</span>
                <span style="font-size: 12px"
                  >{{ data.page }}（{{ data.num }}）</span
                >
                <span class="directory_btn">
                  <el-button type="text" @click.stop="() => edit(data)">
                    编辑
                  </el-button>
                  <el-button
                    type="text"
                    style="color: red"
                    @click.stop="() => Delete(data)"
                  >
                    删除
                  </el-button>
                </span>
              </span>
            </el-tree>
          </el-drawer>
        </div>
      </div>
      <div style="width: calc(50% - 100px); margin-right: 10px">
        <div class="pagination">
          <el-pagination
            style="width: 40%"
            :page-size="1"
            :total="list.length"
            :current-page="currentPage"
            @current-change="handleCurrentChange"
            layout="prev, next, jumper"
          >
          </el-pagination>
          <div class="operation_btn">
            <el-button
              icon="el-icon-zoom-in"
              @click="magnify"
              circle
            ></el-button>
            <el-button
              icon="el-icon-zoom-out"
              @click="shrink"
              circle
            ></el-button>
            <el-button
              icon="el-icon-refresh"
              @click="rotate"
              circle
            ></el-button>
          </div>
        </div>
        <div class="slider-box img_box overflow-x-auto h-[calc(100%-50px)]">
          <div
            class="defaultImage"
            :style="{
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }"
          >
            <img
              :src="imgUrl"
              alt=""
              class="img"
              :style="{ transform: 'rotateZ(' + deg + 'deg)' }"
              v-drag
            />
          </div>
        </div>
      </div>
      <div style="width: 50%">
        <div class="words_form">
          <span class="">审核用户名：</span>
          <span>{{ temp1.auditor_name }}</span>
          <span class="ml-20px">状态：</span>
          <span class="mr-20px" v-show="temp1.status === 'unprocess'">
            未处理
          </span>
          <span class="mr-20px" v-show="temp1.status === 'access'">已处理</span>
          <span class="mr-20px" v-show="temp1.status === 'processing'">
            未处理
          </span>
          <span class="ml-20px">
            <el-button
              icon="el-icon-zoom-in"
              @click="plusSizeNum"
              circle
            ></el-button>
            <el-button
              icon="el-icon-zoom-out"
              @click="minusSizeNum"
              circle
            ></el-button>
          </span>
          <span class="float-right">
            <el-button
              v-if="temp1.task_status === 1"
              type="danger"
              @click="doRevoke"
            >
              撤销校验
            </el-button>
            <el-button
              v-else-if="every(list, (it) => it.status === 'access')"
              type="success"
              @click="doAccess"
            >
              校验通过
            </el-button>
            <el-button type="primary" @click="save">保存</el-button>
            <el-button @click="$router.go(-1)">返回</el-button>
          </span>
        </div>
        <div
          style="
            width: 100%;
            overflow-x: auto;
            overflow-y: hidden;
            white-space: nowrap;
            margin-bottom: 4px;
          "
        >
          <el-tag
            v-for="(a, i) in temp1.auditor"
            :key="i"
            :color="colorList[i]"
            style="padding-bottom: 4px; margin-right: 4px; color: white"
            >{{ a.nickname }}</el-tag
          >
        </div>
        <div v-if="showEditor" :class="['slider-box text_format', {'windows' : windows}, {'mac': mac}]" :style="`font-size: ${sizeNum}px;height: calc(100% - ${
          temp1.auditor && temp1.auditor.length ? 80 : 50}px)`">
          <editor v-model="temp1.audit_words" :color="userColor" />
        </div>
      </div>
    </div>
    <el-dialog
      :title="`${dialogModel == 'create' ? '新建' : '编辑'}`"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="5vh"
    >
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="right"
        label-width="100px"
        style="width: 80%; min-height: 200px"
      >
        <el-form-item
          label="目录名称"
          prop="title"
          :rules="{
            required: true,
            message: '请输入目录名称',
            trigger: 'change',
          }"
        >
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="上级目录">
          <selecTree
            v-model="temp.pid_title"
            :data="treeList"
            :sendId="sendId"
            class="query-select"
            @change="deptChange"
          />
        </el-form-item>
        <el-form-item
          label="页数"
          prop="title"
          :rules="{
            required: true,
            message: '请输入页数',
            trigger: 'change',
          }"
        >
          <el-input v-model="temp.page" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="saveData"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Editor from "./editor.vue";
import {
  getVisionList,
  getVisionInfo,
  getCataInfo,
  updateVision,
  catalogueList,
  catalogueCreate,
  catalogueGet,
  catalogueUpdate,
  catalogueDelete,
  accessVision,
  revokeVision,
} from "@/api/literature/automaticEntry";
import selecTree from "@/components/SearchInput";
import { every } from "lodash";
const colorList = [
  "#FF6B3B",
  "#FFC100",
  "#9FB40F",
  "#76523B",
  "#0E8E89",
  "#E19348",
  "#F383A2",
  "#247FEA",
  "#2BCB95",
  "#B1ABF4",
  "#1D42C2",
  "#1D9ED1",
  "#D64BC0",
  "#255634",
  "#8C8C47",
  "#8CDAE5",
  "#8E283B",
  "#791DC9",
];
export default {
  components: {
    selecTree,
    Editor,
  },
  setup() {
    return {
      colorList,
      every,
    };
  },
  data() {
    return {
      task_type: Number(this.$route.query.task_type),
      imgUrl: "",
      deg: 0,
      scale: 1,
      curTopic: {},
      list: [],
      bid: "",
      temp1: {
        auditor: [],
        words: "",
        audit_words: "",
        status: "",
        auditor_name: "",
      },
      page: "",
      bidobj: {},
      num: null,
      treeList: [],
      defaultProps: {
        label: "title",
        children: "child",
      },
      expandData: [],
      dialogModel: "",
      dialogFormVisible: false,
      temp: {
        bid: "",
        title: "",
        pid: "", //上级目录
        page: "",
        pid_title: "",
      },
      sendId: "",
      currentPage: 1,
      drawer: false,
      direction: "ltr",
      sizeNum: "13",
      showEditor: false,
      windows: false,
      mac: false ,
      pageNum: null
    };
  },
  computed: {
    userColor() {
      const findI = this.temp1.auditor.findIndex(
        (a) => a.userid === this.$store.getters.userid
      );
      if (findI > -1) {
        return colorList[findI];
      }
      return colorList[this.temp1.auditor.length];
    },
  },
  watch: {
    currentPage: {
      immediate: true,
      handler() {
        this.showEditor = false
        this.$nextTick(() => {
          this.showEditor = true
        })
      }
    }
  },
  created() {
    this.bid = this.$route.query.bid;
    this.bidobj = this.$route.query;
    this.getVisionList(this.$route.query);
    this.catalogueList();
    this.init();
  },
  mounted() {
    this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
  },
  methods: {
    init() {
      if (navigator.userAgent.indexOf('Mac OS') !== -1) {
        this.mac = true;
      } else {
        this.windows = true;
      }
    },
    async doAccess() {
      try {
        const { status, msg } = await accessVision(this.bidobj);
        if (status === 200) {
          this.getVisionList(this.bidobj).then((res) => {
            this.list = res.result.version;
            this.review(this.list[this.pageNum - 1]);
          });
          this.$message.success("提交成功");
        } else {
          this.$message.error(`提交失败，${msg}`);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async doRevoke() {
      try {
        const { status, msg } = await revokeVision(this.bidobj);
        if (status === 200) {
          this.getVisionList(this.bidobj).then((res) => {
            this.list = res.result.version;
            this.review(this.list[this.pageNum - 1]);
          });
          this.$message.success("撤销成功");
        } else {
          this.$message.error(`撤销失败，${msg}`);
        }
      } catch (error) {
        console.error(error);
      }
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    //跳转滚动
    search() {
      console.log(this.$refs["img-" + this.num]);
      this.$refs["img-" + this.num][0].scrollIntoView();
      this.review(this.list[this.pageNum - 1]);
    },
    //目录列表
    catalogueList() {
      catalogueList({ bid: this.bid }).then((res) => {
        this.treeList = res.result.catas;
      });
    },
    //新建目录
    newEdit() {
      this.temp = {
        bid: "",
        title: "",
        pid: "", //上级目录
        page: "",
        pid_title: "",
      };
      this.sendId = ""; //默认展开清空
      this.dialogModel = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    //编辑目录
    edit(item) {
      this.sendId = item.cata_id;
      catalogueGet({ cata_id: item.cata_id }).then((res) => {
        this.temp = res.result;
      });
      this.dialogModel = "edit";
      this.dialogFormVisible = true;
    },
    //删除目录
    Delete(item) {
      catalogueDelete({ cata_id: item.cata_id }).then((res) => {
        this.$message.success("删除成功");
        this.catalogueList();
      });
    },
    //新建、编辑目录
    saveData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          // 新增保存
          if (this.dialogModel === "create") {
            this.temp.bid = this.bid;
            catalogueCreate(this.temp).then((res) => {
              this.$message.success("新增目录成功");
            });
          } else {
            // 编辑保存
            this.temp.bid = this.bid;
            catalogueUpdate(this.temp).then((res) => {
              this.$message.success("修改目录成功");
            });
          }
          this.catalogueList();
          this.dialogFormVisible = false;
          this.expandData.push(this.temp.pid);
        }
      });
    },
    //树下拉框选择值
    deptChange(val) {
      this.temp.pid_title = val.title;
      this.temp.pid = val.cata_id;
    },
    //切换上一页下一页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.num = val;
      this.search();
      this.getVisionInfo(val);
    },
    // 点击目录树节点
    handleCheck(val) {
      getCataInfo({ bid: this.bid, page: val.page }).then((res) => {
        this.temp1 = res.result;
        this.imgUrl = res.result.img_url;
        this.currentPage = res.result.page;
        this.num = res.result.page;
        this.search();
      });
    },
    //获取文献内容列表
    getVisionList(params) {
      getVisionList(params).then((res) => {
        this.list = res.result.version;
        if (this.list.length > 0) {
          const findI = this.list.findIndex((it) => it.status !== "access");
          if (findI > -1) {
            this.review(this.list[findI]);
          } else {
            this.review(this.list[this.list.length - 1]);
          }
        }
      });
    },
    //查看图片
    review(row) {
      console.log(row,"=============");
      this.curTopic = row;
      this.imgUrl = row.img_url;
      this.page = row.page;
      this.pageNum = row.num
      this.currentPage = this.page;
      this.getVisionInfo(this.page);
    },
    //查看每页内容
    getVisionInfo(paramas) {
      getVisionInfo({
        bid: this.bid,
        task_id: this.bidobj.task_id,
        page: paramas,
      }).then((res) => {
        this.temp1 = res.result;
        this.imgUrl = res.result.img_url;
      });
    },
    //编辑保存
    save() {
      const { userid } = this.$store.getters;
      const { audit_words, auditor } = this.temp1;
      const rootDom = document.createElement("body");
      rootDom.innerHTML = audit_words;
      const allMarks = rootDom.querySelectorAll("mark");
      allMarks.forEach((mark) => {
        const dataColor = mark.dataset.color;
        const findCI = colorList.findIndex((c) => c === dataColor);
        if (findCI > -1) {
          if (findCI < auditor.length) {
            mark.setAttribute("data-id", auditor[findCI].userid);
          } else {
            mark.setAttribute("data-id", userid);
          }
        }
      });
      const reg1 = /(<\/?mark.*?>)/gi
      // const reg2 = /<s[^>]*>(.|\n)*<\/s>/gi;
      var inner = rootDom.innerHTML
      const pNode = document.getElementsByClassName("ProseMirror")[0].childNodes[0]
      const sList = pNode.getElementsByTagName("s")
      for (let index = 0; index < sList.length; index++) {
        let s = sList[index]
        let ss = `<s>${s.innerHTML}</s>`
        inner = inner.replace(ss, '')
      }
      const clearWords = inner.replace(reg1, '')
      updateVision({
        ...this.bidobj,
        page: this.currentPage,
        words: rootDom.innerHTML,
        clearWords: clearWords
      }).then((res) => {
        this.$message.success("编辑保存成功");
        getVisionList(this.bidobj).then((res) => {
          this.list = res.result.version;
          console.log(this.list,"-----------------------");
          this.review(this.list[this.pageNum - 1]);
        });
      });
      console.log(this.list,"-----------------------");
    },
    // 放大
    magnify() {
      if (this.scale >= 3) {
        this.scale = 3;
        return;
      }
      this.scale += 0.15;
    },
    // 缩小
    shrink() {
      if (this.scale <= 0.1) {
        this.scale = 0.1;
        return;
      }
      this.scale -= 0.15;
    },
    // 旋转
    rotate() {
      this.deg += 90;
      if (this.deg >= 360) {
        this.deg = 0;
      }
    },
    plusSizeNum() {
      if(this.sizeNum < 24) {
        this.sizeNum++
      }
    },
    minusSizeNum() {
      if(this.sizeNum > 1) {
        this.sizeNum--
      }
    }
  },
};
</script>
<style lang="scss" scoped>
::v-deep .ProseMirror {
  outline: none;
}
/* ::v-deep .el-form-item--small.el-form-item {
  margin-bottom: 1px;
}
::v-deep .el-input--small .el-input__inner {
  height: 25px;
  line-height: 25px;
} */
::v-deep .el-button--small.is-circle {
  padding: 4px;
}
.content {
  padding-left: 8px;
  padding-right: 8px;
  height: 100%;
  overflow: hidden;
}
.wrap {
  display: flex;
  width: 100%;
  height: 100%;
}
.slider-box {
  position: relative;
}
.windows {
  font-family: fangsong;
  letter-spacing: 0 !important;
  font-weight: 600;
}
.mac {
  font-family: monospace;
  letter-spacing: 0 !important;
  font-weight: 500;
}
.defaultImage img {
  width: 100% !important;
  position: static !important;
}
::v-deep .el-textarea {
  width: 100%;
  height: 100%;
}
::v-deep .el-textarea__inner {
  width: 100%;
  height: 100%;
  padding: 0;
  border: 1px solid transparent;
}
.el-button--small {
  padding: 5px 10px;
}
.unprocess {
  border: 5px solid #82848a;
}
.access {
  border: 5px solid #67c23a;
}
.processing {
  border: 5px solid #ff4949;
}
.activeColor {
  color: #409eff;
}
.pagination {
  height: 30px;
  margin-bottom: 5px;
  position: relative;
}
.operation_btn {
  position: absolute;
  right: 0;
  top: 0;
}
.img_scroll {
  height: calc(100vh - 120px);
  border: 1px solid #dcdfe6;
  padding: 5px;
  margin-top: 10px;
  overflow: auto;
}
.img_box {
  height: calc(100vh - 120px);
  padding: 5px;
  margin-top: 10px;
  margin-bottom: 10px;
  overflow: hidden;
}
.img {
  position: absolute;
  border: 1px solid #c0c4cc;
}
.thumbnail {
  max-width: 100%;
  max-height: 100%;
}
.pagination_size {
  text-align: center;
  margin-bottom: 5px;
  font-size: 13px;
}
.directory_name {
  display: inline-block;
  width: 70%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.directory_btn {
  margin-left: 10px;
  display: inline-block;
  width: 25%;
  text-align: center;
}
.words_form {
  height: 30px;
  margin-bottom: 5px;
  font-size: 15px;
  flex: none;
}
.words {
  font-size: 14px;
  font-weight: bold;
}
.text_format {
  height: calc(100vh - 120px);
  padding: 5px;
  text-indent: 2em;
  letter-spacing: 2px;
  font-size: 12px;
  overflow-x: scroll;
}
::v-deep .ck-content {
  word-break: break-word;
}
::v-deep .color0 {
  background: #ffc100;
}
::v-deep .color1 {
  background: #247fea;
}
::v-deep .color2 {
  background: #9fb40f;
}
::v-deep .color3 {
  background: #76523b;
}
::v-deep .color4 {
  background: #0e8e89;
}
::v-deep .color5 {
  background: #e19348;
}
::v-deep .color6 {
  background: #f383a2;
}
::v-deep .color7 {
  background: #ff6b3b;
}
::v-deep .color8 {
  background: #2bcb95;
}
::v-deep .color9 {
  background: #b1abf4;
}
::v-deep .color10 {
  background: #1d42c2;
}
::v-deep .color11 {
  background: #1d9ed1;
}
::v-deep .color12 {
  background: #d64bc0;
}
::v-deep .color13 {
  background: #255634;
}
::v-deep .color14 {
  background: #8c8c47;
}
::v-deep .color15 {
  background: #8cdae5;
}
::v-deep .color16 {
  background: #8e283b;
}
::v-deep .color17 {
  background: #791dc9;
}
::v-deep .el-textarea__inner {
  overflow-x: scroll;
  white-space: nowrap;
  font-family: SimHei;
}
::v-deep .el-drawer__open .el-drawer.ltr {
  width: 40%;
  overflow: scroll;
}
</style>
