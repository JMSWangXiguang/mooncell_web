<!--
 * @Author: imali
 * @Date: 2022-02-21 20:03:59
 * @LastEditTime: 2022-05-09 14:41:44
 * @LastEditors: 陈逸
 * @Description:
-->
<template>
  <el-form
    ref="p-descriptions-form"
    inline
    :model="value"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <el-descriptions size="medium" border v-bind="$attrs.descriptions">
      <template v-for="item in formItems">
        <el-descriptions-item
          :key="item.columnAttrs['prop']"
          :label="item.label"
          v-bind="item.descriptions"
        >
          <template slot="label">
            <i v-if="item.icon" :class="item.icon"></i>
            {{ item.label }}
            <el-tooltip v-if="item.columnAttrs.tip" class="item" effect="dark" :content="item.columnAttrs.tip" placement="top-start">
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </template>
          <el-form-item
            :key="item.columnAttrs['prop']"
            v-bind="item.columnAttrs"
            v-on="item.columnEvents"
          >
            <component
              :is="item.content.is"
              v-if="item.content && item.content.is"
              v-model="value[item.columnAttrs['prop']]"
              v-bind="item.content.contentAttrs"
              v-on="item.content.contentEvents"
            >
              <slot :name="item.columnAttrs['prop']" />
            </component>
            <slot v-else :name="item.columnAttrs['prop']" />
          </el-form-item>
        </el-descriptions-item>
      </template>
    </el-descriptions>
  </el-form>
</template>
<script>
import { computed, defineComponent, reactive } from "@vue/composition-api";
import { omit, keys, isFunction, pickBy } from "lodash";

export default defineComponent({
  props: {
    items: {
      type: Array,
      required: true,
    },
    value: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  setup(props) {
    // 获取各栏属性
    const formItems = computed(() =>
      props.items.map((item) => {
        const { content, label, icon, descriptions, ...otherItem } = item;
        const columnEvents = pickBy(otherItem, isFunction);
        const columnAttrs = omit(otherItem, keys(columnEvents.value));
        item = {
          content,
          label,
          icon,
          descriptions,
          columnAttrs,
          columnEvents,
        };
        // 获取输入框属性
        if (item.content?.is) {
          const { is, ...otherContent } = content;
          const contentEvents = pickBy(otherContent, isFunction);
          const contentAttrs = omit(otherContent, keys(contentEvents.value));
          item.content = { is, contentEvents, contentAttrs };
        }
        return item;
      })
    );

    return {
      formItems,
    };
  },
});
</script>
<style lang="scss" scoped>
.el-descriptions {
  .el-form-item {
    margin: 0;
    width: 100%;
  }
  ::v-deep .el-descriptions-item__label {
    line-height: 32px;
  }
  ::v-deep .el-form-item__content,
  ::v-deep .el-select,
  ::v-deep .el-cascader,
  ::v-deep .el-autocomplete,
  ::v-deep .el-date-editor {
    width: 100%;
  }
  ::v-deep .el-input__inner,
  ::v-deep .el-textarea__inner {
    border: none;
    padding: 0;
    background: #fff;
  }
  ::v-deep .el-input__inner {
    width: calc(100% - 30px);
  }
  ::v-deep .el-date-editor .el-input__prefix {
    display: none;
  }
  ::v-deep .is-disabled > input,
  ::v-deep .is-disabled > .el-radio__label,
  ::v-deep .is-disabled > .el-textarea__inner {
    color: #606266;
  }
}
</style>
