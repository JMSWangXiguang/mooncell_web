<template>
  <div>
    <el-row type="flex">
      <el-col flex="1">
        <el-form inline>
          <el-form-item>
            <el-input
              v-model="listQuery.search"
              class="filter-item input_search"
              placeholder="请输入文献名称"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="listQuery.author"
              class="filter-item input_search"
              placeholder="请输入作者"
            />
          </el-form-item>
          <el-form-item>
            <el-select v-model="listQuery.publish_house" placeholder="请选择文献来源" clearable>
              <el-option
                v-for="item in sourceList"
                :key="item.id"
                :label="item.title"
                :value="item.id">
                <div style="float: left">{{ item.title }}</div>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="listQuery.btype_id" placeholder="请选择文献类型" clearable>
              <el-option
                v-for="item in bTypeList"
                :key="item.id"
                :label="item.title"
                :value="item.id">
                <div style="float: left">{{ item.title }}</div>
                <div style="float: right; padding-left:10px;color: #8492a6; font-size: 13px">{{ item.desc }}</div>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search">
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col basis="100px">
        <el-button type="primary" @click="handleCreate">创建文献</el-button>
      </el-col>
    </el-row>
    <p-table
      v-loading="loading"
      :row-class-name="
        ({ row }) =>
          row.status === 'ban' || row.status === 'abandon'
            ? 'text-[#f5222d]'
            : ''
      "
      :data="list"
      :columns="[
        {
          label: '文献名称',
          prop: 'title',
        },
        {
          label: '作者',
          prop: 'author',
        },
        {
          label: '文献来源',
          prop: 'publish_house_name',
          columnKey: 'publish_house',
          filters: sourceList.map(({ id, title }) => ({
            text: title,
            value: id,
          })),
          filterPlacement: 'bottom',
          filterMultiple: false,
        },
        {
          label: '出版时间',
          prop: 'publish_time',
        },
        {
          label: '出版卷号',
          prop: 'volume',
        },
        {
          label: '标准编号',
          prop: 'sn',
        },
        {
          label: '文献类型',
          prop: 'btype_name',
          columnKey: 'btype_id',
          filters: bTypeList.map(({ id, title }) => ({
            text: title,
            value: id,
          })),
          filterPlacement: 'bottom',
          filterMultiple: false,
        },
        {
          label: '学科分类',
          prop: 'cata_name',
          columnKey: 'cata_id',
          filters: cateList.map(({ id, title }) => ({
            text: title,
            value: id,
          })),
          filterPlacement: 'bottom',
          filterMultiple: false,
        },
        {
          label: '状态',
          prop: 'status',
        },
        {
          label: '启用OCR',
          prop: 'is_ocr',
        },
        {
          label: '操作',
          prop: 'action',
          width: 250,
        },
      ]"
      height="calc(100vh - 200px)"
      border
      highlight-current-row
      class="w-full overflow-y-auto"
      @filter-change="handleFilterChange"
    >
      <template #status="{ row }">
        <span v-show="row.status === 'access'">启用</span>
        <span v-show="row.status === 'ban'">停用</span>
        <span v-show="row.status === 'abandon'">废弃</span>
        <span v-show="row.status === 'devel'">开发中</span>
      </template>
      <template #is_ocr="{ row }">
        <span v-show="row.is_ocr === 1">启用</span>
        <span v-show="row.is_ocr === 2">不启用</span>
      </template>
      <template #action="{ row }">
        <el-button type="text" @click="handleEdit(row)">文献信息编辑</el-button>
        <el-button type="text" @click="handleJumpCatalog(row)">目录编辑</el-button>
        <el-button type="text" @click="handlePage(row)" v-if="row.is_real === 1 && row.is_ocr === 1">页码编辑</el-button>
      </template>
    </p-table>
    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />
    <el-dialog
      destroy-on-close
      :title="`${dialogModel == 'create' ? '新建' : '编辑'}`"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="5vh"
    >
      <literature-info-form
        ref="dataForm"
        v-model="temp"
        :isApply="false"
        :hasStatus="dialogModel === 'edit'"
      />
      <!-- <div class="flex" v-show="dialogModel === 'edit'">
          <el-form-item label="创建时间" prop="create_time">
            <span>{{ temp.create_time }}</span>
          </el-form-item>
          <el-form-item label="创建用户">
            <span>{{ temp.creator_name }}</span>
          </el-form-item>
        </div> -->
      <div slot="footer" class="dialog-footer">
        <el-form
          inline
          v-show="dialogModel === 'edit'"
          float="left"
          label-suffix=":"
        >
          <el-form-item label="创建时间" prop="create_time">
            <span>{{ temp.create_time }}</span>
          </el-form-item>
          <el-form-item label="创建用户">
            <span>{{ temp.creator_name }}</span>
          </el-form-item>
        </el-form>
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="saveData"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getList,
  create,
  update,
  getInfo,
} from "@/api/literature/literatureManagement";
import { getbTypes } from "@/api/operate/apply";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import LiteratureInfoForm from "@/views/operate/apply/literature-info-form.vue";
export default {
  name: "Literature",
  components: {
    Pagination,
    LiteratureInfoForm,
  },
  data() {
    return {
      loading: false,
      list: [],
      auth: {},
      total: 0,
      listQuery: {
        page: 1,
        size: 20,
        search: "",
        author: "",
        publish_house: "",
      },
      temp: {
        title: "",
        serial: "",
        edition: "",
        editor: "",
        publish_time: "",
        is_ocr: 2,
        is_real: 2,
        create_time: "",
        update_time: "",
        status: "",
        bid: "",
        author: "",
        creator_name: "",
        auth: {},
        language: "",
        page: "",
        btype_id: "",
        file: {
          file_path_tmp: "",
          filename: "",
        },
      },
      dialogFormVisible: false,
      dialogModel: "", // create、edit
      auth: {},
      dialogForm: false,
      dialogFormVisibleNew: false,
    };
  },
  computed: {
    bTypeList() {
      return this.$store.getters["dict/bTypeList"];
    },
    cateList() {
      return this.$store.getters["dict/cateList"];
    },
    sourceList() {
      return this.$store.getters["dict/sourceList"];
    },
  },
  created() {
    this.search();
    this.getBTypeList();
  },
  methods: {
    // 查询搜索
    handleFilterChange(filter) {
      const key = Object.keys(filter)[0];
      this.listQuery[key] = filter[key][0] || null;
      this.getList();
    },
    search() {
      this.listQuery.page = 1;
      this.getList();
    },
    async getBTypeList() {
      try {
        const res = await getbTypes();
        if (res.result) {
          this.$store.dispatch("dict/setBTypeList", res.result);
        }
      } catch (error) {
        console.error(error);
      }
    },
    //文献列表
    getList() {
      this.loading = true;
      getList(this.listQuery)
        .then((res) => {
          this.list = res.result.bibliographies;
          this.auth = res.result.auth;
          this.total = res.result.total;
        })
        .finally(() => (this.loading = false));
    },
    // 初始化表单
    resetTemp() {
      this.temp = {
        title: "",
        serial: "",
        edition: "",
        publish_time: "",
        is_ocr: 2,
        is_real: 2,
        create_time: "",
        update_time: "",
        status: "",
        bid: "",
        author: "",
        creator_name: "",
        auth: {},
        btype_id: "",
        file: {
          file_path_tmp: "",
          filename: "",
        },
      };
    },
    // 新增
    handleCreate() {
      this.resetTemp();
      this.dialogModel = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs.dataForm.$refs.form.$refs[
          "p-descriptions-form"
        ].clearValidate();
      });
    },
    // 修改
    handleEdit(item) {
      getInfo({ bid: item.bid }).then((res) => {
        this.temp = res.result;
      });
      this.dialogModel = "edit";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs.dataForm.$refs.form.$refs[
          "p-descriptions-form"
        ].clearValidate();
      });
    },
    //保存
    saveData() {
      this.$refs.dataForm.$refs.form.$refs["p-descriptions-form"].validate(
        (valid) => {
          if (valid) {
            // 新增保存
            if (this.dialogModel === "create") {
              create(this.temp)
                .then((res) => {
                  this.$message.success("保存成功");
                  this.dialogFormVisible = false;
                })
                .finally(() => this.getList(this.listQuery));
            } else {
              // 编辑保存
              update(this.temp)
                .then((res) => {
                  this.$message.success("保存成功");
                  this.dialogFormVisible = false;
                })
                .finally(() => this.getList(this.listQuery));
            }
          }
        }
      );
    },
    handleJumpCatalog({ bid }) {
      this.$router.push({
        path: "/literatureEntry/catalogEdit",
        query: { bid },
      });
    },
    handlePage({ bid }) {
      this.$router.push({
        path: "/literatureEntry/pageEdit",
        query: { bid },
      });
    }
  },
};
</script>
<style lang="scss" scoped>
.input_search {
  width: 180px;
  margin-right: 10px;
}
.flex .el-form-item {
  flex: 1;
}
</style>
