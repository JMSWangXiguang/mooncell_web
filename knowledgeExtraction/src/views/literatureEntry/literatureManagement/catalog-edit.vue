<!--
 * @Author: imali
 * @Date: 2022-03-10 04:46:32
 * @LastEditTime: 2022-04-29 13:22:11
 * @LastEditors: 陈逸
 * @Description:
-->
<template>
  <el-row :gutter="16">
    <el-col :span="8">
      <el-button type="primary" @click="visible = true">添加根目录</el-button>
      <el-button float="right" @click="$router.go(-1)">返回</el-button>
      <el-divider my="8px" />
      <el-tree
        ref="tree"
        check-on-click-node
        default-expand-all
        :data="catalogList"
        node-key="cata_id"
        :props="{
          label: 'title',
          children: 'child',
        }"
        class="overflow-y-auto h-[calc(100vh-150px)]"
      >
        <template #default="{ node, data }">
          <span class="flex w-full justify-between">
            <span>
              {{ node.label }}
              <span class="text-xs ml-20px">
                {{ data.page }}（{{ data.num }}）
              </span>
            </span>
            <el-button-group>
              <el-button
                mr="4px"
                type="text"
                @click.stop="
                  () => {
                    row = data;
                    visible = true;
                  }
                "
              >
                添加
              </el-button>
              <el-button
                mr="4px"
                type="text"
                @click.stop="() => fetchCatalogInfo(data)"
              >
                编辑
              </el-button>
              <el-button
                type="text"
                style="color: red"
                @click.stop="() => deleteCatalog(data)"
              >
                删除
              </el-button>
            </el-button-group>
          </span>
        </template>
      </el-tree>
    </el-col>
    <el-col :span="16">
      <el-card
        v-loading="pdfLoading"
        element-loading-text="文件加载中..."
        h="[calc(100vh-90px)]"
        body-style="height: 100%;position: relative;"
      >
        <template v-if="pdfSrc">
          <vue-pdf
            :src="pdfSrc"
            :page="page"
            @num-pages="(t) => (totalPages = t)"
            @progress="(p) => (pageLoading = p)"
          />
          <el-pagination
            class="text-center pagination"
            background
            hide-on-single-page
            layout="prev, slot, next"
            :page-size="1"
            :total="totalPages"
            @current-change="(p) => (page = p)"
          >
            <template #default> {{ page }} / {{ totalPages }} </template>
          </el-pagination>
        </template>
        <el-empty v-else h="full" description="暂无文件"></el-empty>
      </el-card>
    </el-col>
    <el-dialog
      append-to-body
      destory-on-close
      width="400px"
      :visible.sync="visible"
      :title="edit ? '编辑目录' : '添加目录'"
      class="dialog"
    >
      <catalog-form ref="catalog-form" v-model="model" />
      <template #footer>
        <el-button @click="visible = false"> 取 消 </el-button>
        <el-button type="primary" @click="addCatalog">确 定</el-button>
      </template>
    </el-dialog>
  </el-row>
</template>
<script>
import Vue from "vue";
import VuePdf from "vue-pdf";
import {
  catalogueCreate,
  catalogueUpdate,
  catalogueGet,
  catalogueDelete,
  catalogueList,
  getPDF,
} from "@/api/literature/automaticEntry";

const CatalogForm = Vue.component("catalog-form", {
  template: `
    <p-form
      ref="form"
      v-model="value"
      label-width="auto"
      :items="items"
      :rules="rules"
    />
  `,
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      items: [
        {
          prop: "title",
          label: "标题",
          content: {
            is: "el-input",
          },
        },
        {
          prop: "page",
          label: "页数",
          content: {
            is: "el-input-number",
            controls: false,
            min: 1,
            class: "w-1/2",
          },
        },
        {
          prop: "submit",
        },
      ],
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        page: [{ required: true, message: "请输入页数", trigger: "blur" }],
      },
    };
  },
});

export default {
  components: { VuePdf, CatalogForm },
  computed: {
    bid() {
      return this.$route.query?.bid;
    },
  },
  data() {
    return {
      visible: false,
      edit: false,
      model: {},
      row: null,
      catalogList: [],
      pdfLoading: false,
      pdfSrc: null,
      totalPages: 0,
      pageLoading: 0,
      page: 1,
    };
  },
  mounted() {
    this.fetchCatalogList();
    this.fetchFile();
  },
  methods: {
    async fetchCatalogList() {
      const { bid } = this;
      try {
        const { result } = await catalogueList({ bid });
        if (result.catas) {
          this.catalogList = result.catas;
        } else {
          this.catalogList = [];
        }
      } catch (error) {
        console.error(error);
      }
    },
    addCatalog() {
      const { bid, row } = this;
      let params = { bid, ...this.model };
      if (row) {
        params = {
          ...row,
          ...params,
        };
      }
      this.$refs["catalog-form"].$refs.form.$refs["p-form"].validate(
        async (valid) => {
          if (valid) {
            try {
              let res;
              if (this.edit) {
                res = await catalogueUpdate(params);
              } else {
                params.pid = params.cata_id
                res = await catalogueCreate(params);
              }
              if (res.status === 200) {
                this.$message.success(`${this.edit ? "编辑" : "添加"}成功`);
                this.model = {};
                this.row = null;
                this.visible = false;
                if (this.edit) {
                  this.edit = false;
                }
                this.fetchCatalogList();
              }
            } catch (error) {
              this.row = null;
              console.error(error);
            }
          }
        }
      );
    },
    async fetchCatalogInfo(item) {
      try {
        const { result } = await catalogueGet({ cata_id: item.cata_id });
        this.model = result;
        this.row = item;
        this.edit = true;
        this.visible = true;
      } catch (error) {
        console.error(error);
      }
    },
    //删除目录
    async deleteCatalog(item) {
      try {
        const { status } = await catalogueDelete({ cata_id: item.cata_id });
        if (status === 200) {
          this.$message.success("删除成功");
          this.fetchCatalogList();
        }
      } catch (error) {
        console.error(error);
      }
    },
    async fetchFile() {
      const { bid } = this;
      try {
        const { result } = await getPDF({ bid });
        if (result.file_path_tmp) {
          const loadingTask = VuePdf.createLoadingTask(result.file_path_tmp);
          this.pdfLoading = true;
          this.pdfSrc = loadingTask;
          const pdf = await loadingTask.promise;
          this.numPages = pdf.numPages;
          this.pdfLoading = false;
        }
      } catch (error) {
        this.pdfSrc = null;
        this.pdfLoading = false;
        console.error(error);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-tree-node__content {
  height: 36px;
  line-height: 36px;
}
::v-deep .el-card {
  overflow-y: scroll;
}
.pagination {
  position: fixed;
  width: calc(66.6666666667% - 100px);
  bottom: 30px;
}
::v-deep .el-dialog {
  margin-left: 15vw;
}
</style>
