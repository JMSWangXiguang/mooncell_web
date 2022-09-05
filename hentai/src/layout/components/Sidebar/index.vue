<!--
 * @Author: imali
 * @Date: 2022-01-18 14:00:50
 * @LastEditTime: 2022-07-25 17:27:45
 * @LastEditors: imali
 * @Description:
-->
<template>
  <div :class="{ 'has-logo': showLogo }" class="flex justify-between">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-menu
      :default-active="activeMenu"
      :text-color="variables.menuText"
      :unique-opened="true"
      :active-text-color="variables.menuActiveText"
      mode="horizontal"
    >
      <sidebar-item
        v-for="route in permission_routes"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img v-if="avatar" :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" />
          <svg-icon
            v-else
            icon-class="user-avatar"
            class-name="w-40px h-40px transform translate-x-10px cursor-pointer"
          />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'permission_routes']),
    routes() {
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    },
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
  },
}
</script>

<style lang="scss" scoped>
:deep {
  .el-menu.el-menu--horizontal {
    border: none;
    height: 56px;
    padding: 15px 5px 0;
    display: flex;
    > div {
      margin: 0 2px;
      li {
        border-radius: 2px;
        &.is-active {
          background-color: $--color-primary !important;
          color: white;

          .el-menu-item,
          .el-submenu__title {
            color: white;
          }
          .el-submenu__title:hover {
            color: #303133;
          }
        }
      }
    }
    .el-menu-item,
    .el-submenu__title {
      height: 100%;
      line-height: 41px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.right-menu {
  // float: right;
  flex-basis: 70px;
  // line-height: 50px;
  margin-top: 5px;

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
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }

      .el-icon-caret-bottom {
        cursor: pointer;
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>
