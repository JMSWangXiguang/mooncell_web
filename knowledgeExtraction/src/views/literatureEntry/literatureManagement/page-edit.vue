<!--
 * @Description: 
 * @version: 
 * @Author: 陈逸
 * @Date: 2022-04-01 14:03:49
 * @LastEditors: 陈逸
 * @LastEditTime: 2022-05-07 18:00:25
-->
<template>
  <div class="content">
    <div class="wrap">
      <div style="width: 180px; margin-right: 10px">
        <div style="height: 30px"></div>
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
        </div>
      </div>
      <div style="width: calc(100% - 180px); margin-right: 10px">
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
            <span class="real-page">真实页码<span>{{real_page}}</span></span>
            <el-button type="primary" @click="visible = true">修改页码</el-button>
          </div>
        </div>
        <div class="slider-box img_box overflow-x-auto h-[calc(100%-40px)]">
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
    </div>
    <el-dialog
      append-to-body
      destory-on-close
      width="400px"
      title="修改页码"
      :visible.sync="visible"
      @close="closeDialog"
    >
      <div style="display: flex;align-items: center;">
        <div style="width: 55px;">页码：</div>
        <el-input type="number" v-model.number="realNum" placeholder="请输入"></el-input>
      </div>
      <template #footer>
        <el-button type="primary" @click="confirm(0)">更新当前</el-button>
        <el-button type="primary" @click="confirm(1)">更新以后</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import {
  getPages,
  getPagesInfo,
  updatePages
} from "@/api/literature/automaticEntry";
export default {
  data() {
    return {
      imgUrl: "",
      deg: 0,
      scale: 1,
      curTopic: {},
      list: [],
      bid: "",
      page: "",
      num: null,
      currentPage: 1,
      real_page: null,
      visible: false,
      realNum: null
    };
  },
  created() {
    this.bid = this.$route.query.bid;
    this.getPages(this.$route.query);
  },
  methods: {
    //跳转滚动
    search() {
      this.$refs["img-" + this.num][0].scrollIntoView();
      this.review2(this.list[this.num - 1]);
    },
    //切换上一页下一页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.num = val;
      this.search();
      this.getPagesInfo(val);
    },
    //获取文献内容列表
    getPages(params) {
      getPages(params).then((res) => {
        this.list = res.result;
        if (this.list.length > 0) {
          this.review(this.list[0]);
        }
      });
    },
    //查看图片
    review(row) {
      this.curTopic = row;
      this.imgUrl = row.img_url;
      this.page = row.page;
      this.currentPage = this.page;
      this.getPagesInfo(this.page);
    },
    //查看图片
    review2(row) {
      this.curTopic = row;
      this.imgUrl = row.img_url;
      this.page = row.page;
      this.currentPage = this.page;
    },
    //查看每页内容
    getPagesInfo(paramas) {
      getPagesInfo({
        bid: this.bid,
        page: paramas,
      }).then((res) => {
        this.imgUrl = res.result.img_url
        this.real_page = res.result.real_page
        this.realNum = res.result.real_page
      });
    },
    closeDialog() {
      this.visible = false
    },
    confirm(val) {
      if(this.realNum === "" || this.realNum === null || this.realNum === undefined) {
        this.$message({
          message: '请输入页码',
          type: 'warning'
        });
        return
      }
      const params = {
        bid: this.bid,
        real_page: this.realNum,
        page: this.page,
        if_all: val
      }
      updatePages(params).then(res => {
        console.log(res);
        if(res.status === 200) {
          this.$message({
          message: '更新成功',
          type: 'success'
          });
          this.visible = false
          this.getPagesInfo(this.page)
        }
      })
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
    }
  },
};
</script>
<style lang="scss" scoped>
::v-deep .ProseMirror {
  outline: none;
}
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
.real-page {
    margin: 0 20px;
    font-weight: normal;
    color: #606266;
    font-size: 14px;
    span {
        margin-left: 5px;
    }
}
</style>
