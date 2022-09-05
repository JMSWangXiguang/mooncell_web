<!--
 * @Author: imali
 * @Date: 2022-03-29 13:49:28
 * @LastEditTime: 2022-08-17 15:51:35
 * @LastEditors: imali
 * @Description:
-->
<template>
  <div
    v-if="tagList && tagList.length"
    ref="tagBar"
    class="tagbar flex border-t-[#f4f4f5] border-t-1px px-12px overflow-x-auto"
    @dragstart="onDragStart"
    @dragenter="onDragEnter"
    @dragover.prevent
    @drop="onDrop"
    @dragend="removeTempTag"
  >
    <el-tag
      v-for="tag in tagList"
      :key="tag.path"
      class="cursor-pointer mx-5px mt-8px mb-4px font-semibold italic"
      :type="tag.path !== $route.path ? 'info' : 'primary'"
      :closable="tag.path !== $route.path"
      :disable-transitions="true"
      @click="tag.path !== $route.path && $router.push(tag.path)"
      @close="delTag(tag)"
      draggable
      hit
    >
      {{ tag.title }}
    </el-tag>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { flatMapDeep, find, without, findIndex } from 'lodash'
export default {
  data() {
    return { dragTag: null, anchors: [], dropIndex: -1 }
  },
  computed: {
    ...mapGetters(['permission_routes', 'tagList']),
    flattenRoutes() {
      return flatMapDeep(this.permission_routes, (r) => {
        if (r.children) {
          return [r, r.children]
        } else {
          return [r]
        }
      })
    },
  },
  watch: {
    $route: {
      handler(newRoute) {
        const thisTag = { path: newRoute.path, title: newRoute.meta.title }
        const findRoute = find(this.flattenRoutes, ['name', newRoute.name])
        const findTag = find(this.tagList, thisTag)
        if (((findRoute && !findRoute.hidden) || newRoute.name.includes('category')) && !findTag) {
          this.tagList.push(thisTag)
        }
      },
      deep: true,
      immediate: true,
    },
    dropIndex(i) {
      if (i > -1) {
        this.removeTempTag()

        // 插入临时tag
        const tempTag = this.dragTag.cloneNode(true)
        tempTag.className += ' temp opacity-30'
        this.$refs.tagBar.insertBefore(tempTag, this.$refs.tagBar.childNodes[i])
      }
    },
  },
  methods: {
    delTag(tag) {
      const newList = without(this.tagList, tag)
      this.$store.dispatch('app/setTagList', newList)
    },
    onDragStart(e) {
      e.dataTransfer.dropEffect = 'move'
      this.$refs.tagBar?.childNodes.forEach((node) => {
        this.anchors.push(
          node.getBoundingClientRect().left +
            12 -
            this.$refs.tagBar?.firstChild.getBoundingClientRect().left +
            node.clientWidth / 2
        ) //计算tag中点
      })
      this.dragTag = e.target
    },
    onDragEnter(e) {
      this.dropIndex = findIndex(this.anchors, (a) => a > e.clientX)
      e.preventDefault() // 触发drop事件需prevent dragenter和dragover
    },
    onDrop() {
      this.removeTempTag()
      this.$refs.tagBar.removeChild(this.dragTag)
      this.$refs.tagBar.insertBefore(this.dragTag, this.$refs.tagBar.childNodes[this.dropIndex])
    },
    removeTempTag() {
      const lastTemp = this.$refs.tagBar.querySelector('.temp')
      if (lastTemp) {
        this.$refs.tagBar.removeChild(lastTemp)
      }
    },
  },
}
</script>
<style scoped>
*::-webkit-scrollbar {
  height: 4px;
  opacity: 0;
  -webkit-overflow-scrolling: touch;
}
</style>
