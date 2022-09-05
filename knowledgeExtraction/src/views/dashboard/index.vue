
<template>
  <div class="dashboard">
    <el-row :gutter="20" style="height: 40%">
      <el-col :span="24" h="full">
        <el-card class="box-card" v-show="eventShow">
          <el-tabs v-model="activeName" class="tabs">
            <el-tab-pane label="代办事项" name="first">
              <div v-show="swiperSlides.length == 0" class="nodata">
                <div class="nodata_img"></div>
              </div>
              <Swiper
                :options="swiperOption"
                ref="mySwiper"
                v-show="swiperSlides.length > 0"
              >
                <swiper-slide
                  v-for="(item, index) in swiperSlides"
                  :key="index"
                  class="schedule mt-5"
                >
                  <div @click="openTaskPage(item)">
                    <div class="process_text">名称：{{ item.processName }}</div>
                    <div v-show="swiperSlides.length > 0" class="process_text">
                      时间：{{ item.createDate }}
                    </div>
                  </div>
                </swiper-slide>
              </Swiper>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
      <!-- <el-col :span="8" h="full">
        <el-card class="box-card" v-show="navigationShow">
          <el-tabs v-model="activeName" class="tabs">
            <el-tab-pane label="快捷导航" name="first">
              <div class="flex">
                <div v-for="(item, index) in list" :key="index">
                  <span
                    class="menuBox"
                    @click="$router.push({ path: item.path })"
                    >{{ item.name }}</span
                  >
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col> -->
    </el-row>
    <el-row :gutter="20" style="margin-top: 10px; height: 57%">
      <el-col :span="16" h="full">
        <el-card class="box-card" h="full" v-show="eventShow">
          <el-tabs v-model="activeName" class="tabs">
            <el-tab-pane label="待处理任务" name="first">
              <div v-show="swiperSlides.length == 0" class="nodata">
                <div class="nodata_img"></div>
              </div>
              <div class="task" v-for="(item, index) in taskList" :key="index">
                <div style="width: 45%">
                  <!-- <span class="name">名称：</span> -->
                  <span class="content">{{ item.title }}</span>
                </div>
                <div style="width: 45%">
                  <!-- <span class="name">开始时间：</span> -->
                  <span class="content">{{ item.create_time }}</span>
                </div>
                <div style="width: 10%">
                  <el-button-group>
                    <el-button
                      v-if="item.task_status >= 0 && item.task_type === 1"
                      type="text"
                      class="mr-20px"
                      @click="content(item)"
                    >
                      校验
                    </el-button>
                    <el-button
                      v-if="item.task_status >= 0 && item.task_type === 2"
                      type="text"
                      @click="audit(item)"
                    >
                      审核
                    </el-button>
                  </el-button-group>
                  <!-- <span
                    @click="info(item)"
                    style="color: rgb(64, 158, 255); cursor: pointer"
                    >详情</span
                  > -->
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
      <el-col :span="8" h="full">
        <el-card class="box-card" h="full" v-show="eventShow">
          <el-tabs v-model="activeName" class="tabs" h="full">
            <el-tab-pane label="轨迹" name="first">
              <div style="height: 70%; overflow: scroll">
                <div
                  class="task"
                  v-for="(item, index) in traceList"
                  :key="index"
                >
                  <div style="width: 69%">
                    <span class="title">{{ item.data }}</span>
                  </div>
                  <div style="width: 31%">
                    <span class="content">{{ item.action_time }}</span>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      width="400px"
      append-to-body
      title="修改密码"
      :visible.sync="pwdVisible"
      @close="closeDialog"
    >
      <p-form
        ref="form"
        v-model="pwdModel"
        label-width="auto"
        :items="items"
        :rules="rules"
      ></p-form>
      <span slot="footer">
        <!-- <el-button @click="pwdVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="modifyPwd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getMyTaskList } from "@/api/literature/automaticEntry";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import { pendingList } from "@/api/literature/automaticEntry";
import { homepageTrace } from "@/api/userPermissions/user";
import { updatePassword } from "@/api/userPermissions/user";
import { first } from "@/api/user";
export default {
  name: "dashboard",
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    let vm = this;
    return {
      eventShow: true, //是否显示代办事项
      scheduleShow: true, //是否显示日程安排
      navigationShow: true, //是否显示快捷导航
      activeName: "first",
      activeName1: "新闻",
      activeName2: "one",
      swiperOption: {
        loopedSlides: 3,
        loop: false,
        // slidesPerView: "auto",
        spaceBetween: 10,
        autoplay: false,
        slidesPerView: 3,
        on: {
          click: function () {
            const clickedIndex = this.clickedIndex;
            vm.handleClickSlide(clickedIndex);
            vm.clickedIndex = clickedIndex;
          },
        },
      },
      swiperSlides: [
        { processName: "流程", createDate: "2021 / 11 / 22" },
        { processName: "内容", createDate: "2021 / 11 / 22" },
        { processName: "任务", createDate: "2021 / 11 / 22" },
        { processName: "权限", createDate: "2021 / 11 / 22" },
        { processName: "轨迹", createDate: "2021 / 11 / 22" },
      ], //待办事项列表
      list: [
        { name: "文献管理", path: "/literatureEntry/literatureManagement" },
        { name: "自动录入", path: "/literatureEntry/automaticEntry" },
        { name: "人工录入", path: "/literatureEntry/manualEntry" },
        // { name: "待处理任务", path: "/literatureEntry/task" },
        { name: "用户管理", path: "/userSystem/management" },
        { name: "角色权限", path: "/userSystem/authority" },
      ], //快捷方式总的list
      taskList: [],
      listQuery: {
        page: 1,
        size: 1000000,
        search: "",
      },
      traceList: [],
      pwdVisible: false,
      pwdModel: {
        old_password: "",
        password: "",
        rp_password: "",
      },
      items: [
        {
          prop: "old_password",
          label: "旧密码",
          content: {
            is: "el-input",
            type: "password",
            clearable: true,
            showPassword: true,
          },
        },
        {
          prop: "password",
          label: "新密码",
          content: {
            is: "el-input",
            type: "password",
            clearable: true,
            showPassword: true,
          },
        },
        {
          prop: "rp_password",
          label: "重复新密码",
          content: {
            is: "el-input",
            type: "password",
            clearable: true,
            showPassword: true,
          },
        },
      ],
      rules: {
        old_password: [
          {
            required: true,
            message: "请输入旧密码",
            trigger: "change",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入新密码",
            trigger: "change",
          },
          {
            min: 6,
            message: "新密码不能小于6位",
            trigger: "change",
          },
        ],
        rp_password: [
          {
            required: true,
            message: "请再次输入新密码",
            trigger: "change",
          },
          {
            min: 6,
            message: "重复密码不能小于6位",
            trigger: "change",
          },
          {
            trigger: "blur",
            validator: (_r, value, callback) => {
              if (value !== this.pwdModel.password) {
                callback("两次输入密码不一致");
              } else {
                callback();
              }
            },
          },
        ],
      },
    };
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    },
    ...mapGetters(["sidebar", "avatar", "name", "userid"]),
  },
  created() {
    if(this.$route.query.pwd) {
      this.checkPwd()
    }
    this.pendingList(this.listQuery);
    this.homepageTrace(this.$store.getters.userid);
  },
  methods: {
    //待处理任务
    pendingList(params) {
      getMyTaskList(params).then((res) => {
        this.taskList = res.result.bibliographies;
      });
    },
    //用户轨迹列表
    homepageTrace(params) {
      homepageTrace({ page: 1, size: 100000, userid: params }).then((res) => {
        this.traceList = res.result.actions;
      });
    },
    handletabs() {},
    openTaskPage() {},
    //找到当前点击的代办事件的轮播的索引
    handleClickSlide(index) {
      return index;
    },
    info(item) {
      let params = {...item.trail}
      params.task_id = item.task_id
      this.$router.push({ path: "/myTask/info", query: params });
    },
    //跳转到内容
    content(item) {
      let bidObj = {
        bid: item.bid,
        task_id: item.task_id,
        task_type: 1,
        range_from: item.range_from,
        range_to: item.range_to,
      };
      this.$router.push({ path: "/myTask/info", query: bidObj });
    },
    audit(item) {
      let bidObj = {
        bid: item.bid,
        task_id: item.task_id,
        task_type: 2,
        range_from: item.range_from,
        range_to: item.range_to,
      };
      this.$router.push({ path: "/myTask/checkInfo", query: bidObj });
    },
    async modifyPwd() {
      this.$refs.form.$refs["p-form"].validate(async (valid) => {
        if (valid) {
          try {
            const { userid } = this;
            const { status, msg } = await updatePassword({
              ...this.pwdModel,
              userid,
            });
            if (status === 200) {
              this.$message.success("修改密码成功");
              this.pwdVisible = false;
              await this.$store.dispatch("user/logout");
              this.$router.push(`/login?redirect=/dashboard`);
            } else {
              this.$message.error(`修改失败，${msg}`);
            }
          } catch (error) {
            console.error(error);
          }
        }
      })
    },
    async checkPwd() {
      const { userid } = this;
      const res = await first({ userid })
      if(!res.result) {
        this.pwdVisible=true
      }
    },
    closeDialog() {
      this.pwdVisible = true
    }
  },
};
</script>
<style scoped>
.dashboard {
  height: 100%;
  overflow: hidden;
}
.process_name {
  line-height: 18px;
  margin-bottom: 10px;
}
.process_text {
  font-size: 16px;
  color: #e4e7ed;
  line-height: 25px;
}
.schedule {
  height: 160px !important;
  cursor: pointer;
}
.swiper-container {
  width: 100%;
  height: 100%;
}
.swiper-slide {
  padding: 20px 20px 10px;
  color: #fff;
  font-size: 18px;
  border-radius: 4px;
  min-height: 120px !important;
  width: calc(20% - 10px) !important;
}
.swiper-slide:nth-child(3n + 1) {
  background-image: linear-gradient(45deg, #fad961 0%, #f76b1c 100%);
}
.swiper-slide:nth-child(3n + 2) {
  background-image: linear-gradient(45deg, #b4ec51 0%, #429321 100%);
}
.swiper-slide:nth-child(3n) {
  background-image: linear-gradient(-135deg, #3023ae 0%, #53a0fd 100%);
}
.flex {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
}
.menuBox {
  display: inline-block;
  width: 100px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  border: 1px dashed #409eff;
  margin: 10px 15px;
  color: #409eff;
  cursor: pointer;
}
::v-deep .el-card {
  height: 100%;
}
::v-deep .el-card__body {
  height: 100%;
}
::v-deep .el-tabs__content {
  height: 80%;
}
::v-deep .el-tabs__content {
  height: 100%;
  overflow: auto;
}
.task {
  width: 100%;
  height: 30px;
  font-size: 13px;
  display: flex;
}
.name {
  font-weight: bold;
}
.title {
  color: #67c23a;
}
</style>
