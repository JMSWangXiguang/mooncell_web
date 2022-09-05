<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <span class="inline-block leading-0 align-middle h-25px">{{ name }}</span>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <!-- <router-link to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <el-dropdown-item divided @click.native="pwdVisible = true">
            <div>修改密码</div>
            <el-dialog
              width="400px"
              append-to-body
              title="修改密码"
              :visible.sync="pwdVisible"
            >
              <p-form
                ref="form"
                v-model="pwdModel"
                label-width="auto"
                :items="items"
                :rules="rules"
              ></p-form>
              <span slot="footer">
                <el-button @click="pwdVisible = false">取 消</el-button>
                <el-button type="primary" @click="modifyPwd">确 定</el-button>
              </span>
            </el-dialog>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <div class="text-[#f5222d]">退出登陆</div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import { updatePassword } from "@/api/userPermissions/user";

export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  data() {
    return {
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
    ...mapGetters(["sidebar", "avatar", "name", "userid"]),
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=/dashboard`);
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
            } else {
              this.$message.error(`修改失败，${msg}`);
            }
            this.pwdVisible = false;
          } catch (error) {
            console.error(error);
          }
        }
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          border-radius: 10px;
          margin-top: 8px;
          width: 36px;
          height: 36px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -12px;
          top: 18px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
