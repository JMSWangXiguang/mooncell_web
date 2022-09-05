<!--
 * @Author: imali
 * @Date: 2022-01-18 11:47:23
 * @LastEditTime: 2022-05-23 16:53:53
 * @LastEditors: imali
 * @Description:
-->
<template>
  <div class="wrap">
    <el-row type="flex" class="h-[calc(100vh-125px)]" justify="space-around">
      <el-col :span="7">
        <tree :ids="ids" />
      </el-col>
      <el-col :span="16" class="flex flex-col">
        <slider-box :ids="ids" />
        <transfer :ids="ids" />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import tree from './components/tree'
import sliderBox from './components/slider'
import transfer from './components/transfer'
export default {
  components: {
    tree,
    sliderBox,
    transfer,
  },
  data() {
    return {
      ids: {
        topic: 'inhos',
        group_id: '',
        chapter_id: '',
      },
    }
  },
}
</script>
