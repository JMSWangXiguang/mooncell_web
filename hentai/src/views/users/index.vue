<!--
 * @Description:
 * @version:
 * @Author: 周子尧
 * @Date: 2020-11-17 15:33:53
 * @LastEditors: imali
 * @LastEditTime: 2022-04-06 19:29:27
-->
<template>
  <div class="users" v-loading="loading" h="[calc(100vh-100px)]">
    <p-button-dialog
      :button="{
        disabled: true,
        label: '添加用户',
        size: 'medium',
        type: 'primary',
        class: 'absolute left-1/48 z-2000 top-[calc(12vh-104px)]',
      }"
      width="650px"
      title="ㅤ"
      destroy-on-close
    >
    </p-button-dialog>
    <el-empty v-if="!loading && !userList.length" :image-size="200" h="full"></el-empty>
    <template v-else>
      <el-row class="p-1/96">
        <el-col v-for="user in userList" :key="user.userid" :span="4">
          <el-card w="11/12" ml="1/24" h="220px" min="w-180px" mt="[calc(25vh-200px)]">
            <p text="2xl">{{ user.name }}</p>
            <p text="xs" mt="20px">{{ user.account }}</p>
            <div mt="20px" h="90px" overflow="y-auto">
              <el-tag
                v-for="g in user.groups"
                :key="g.group_id"
                :color="g.style"
                effect="dark"
                border="none"
                mr="8px"
                mb="8px"
              >
                {{ g.group_name }}
              </el-tag>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-pagination
        background
        hide-on-single-page
        w="full"
        bottom="16px"
        position="fixed"
        text="center"
        layout="prev, pager, next"
        :total="total"
        :current-page.sync="pager.page"
        :page-size.sync="pager.size"
      >
      </el-pagination>
    </template>
  </div>
</template>
<script>
import { getUserList } from '@/api/manage/user'
export default {
  data() {
    return {
      pager: {
        page: 1,
        size: 18,
      },
      userList: [],
    }
  },
  watch: {
    pager: {
      async handler(newPager) {
        this.loading = true
        const { result } = await getUserList(newPager)
        this.userList = result.user_list
        this.total = result.total
        this.loading = false
      },
      deep: true,
      immediate: true,
    },
  },
}
</script>
