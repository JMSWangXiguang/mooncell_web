<template>
  <div>
    <el-dialog
      v-if="dialogModel"
      :title="dialogModel"
      :visible.sync="openDialog"
      :close-on-click-modal="false"
      append-to-body
      width="50%"
    >
      <el-form
        ref="dataForm"
        :model="form"
        label-position="right"
        label-width="100px"
      >
        <div class="flex-box">
          <el-form-item
            label="标题"
            prop="title"
            :rules="{
              required: true,
              message: '请输入标题',
              trigger: 'change',
            }"
          >
            <el-input v-model="form.title" />
          </el-form-item>
          <el-form-item
            label="显示"
            prop="header"
            :rules="{
              required: true,
              message: '请输入显示',
              trigger: 'change',
            }"
          >
            <el-input v-model="form.header" />
          </el-form-item>
        </div>
        <div class="flex-box">
          <el-form-item
            label="分类"
            prop="category"
            :rules="{
              required: true,
              message: '请选择分类',
              trigger: 'change',
            }"
          >
            <el-select
              v-model="form.category"
              w="full"
              placeholder="请选择"
            >
              <el-option
                v-for="item in categorys"
                :key="item.cate_id"
                :label="item.title"
                :value="item.cate_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="来源" prop="source">
            <el-select
              w="full"
              v-model="form.source"
              value-key="id"
              placeholder="请选择"
              filterable
            >
              <el-option
                v-for="item in sources"
                :key="item.sid"
                :label="item.title"
                :value="item.sid"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="flex-box">
          <el-form-item label="key">
            <el-input v-model="form.key" />
          </el-form-item>
          <el-form-item label="格式" prop="format">
            <el-radio-group v-model="form.format">
              <el-radio label="txt">TXT</el-radio>
              <el-radio label="html">HTML</el-radio>
              <el-radio label="xml">XML</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <el-form-item
          label="文档简介"
          prop="content"
          :rules="{
            required: true,
            message: '请输入文本',
            trigger: 'change',
          }"
        >
          <el-input v-model="form.content" :rows="8" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="saveData()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getInfo,
  create,
  update,
  getCategory,
  getSource,
} from "@/api/knowledge/literature";
export default {
  name: "TreeBox",
  props: {
    // id:String,
    // title:String,
    // openDialog:Boolean
    id: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    openDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        title: "",
        header: "",
        key: "",
        category: "",
        source: "",
        format: "",
        content: "",
      },
      categorys: [], //分类
      sources: [], //来源
      Dialog: false,
      dialogModel: "",
    };
  },
  watch: {
    id: {
      handler(newVal) {
        if (newVal) {
          this.getInfo(this.id);
        }
      },
      deep: true,
      immediate: true,
    },
    title: {
      handler(newVal) {
        if (newVal == "create") {
          this.dialogModel = "新增";
        } else {
          this.dialogModel = "修改";
        }
      },
    },
  },
  created() {},
  mounted() {
    this.getSource();
    this.getCategory();
  },
  methods: {
    // 获取来源数据
    getSource() {
      let params = {
        page: 1,
        size: 10,
      };
      getSource(params).then((res) => {
        this.sources = res.result.sources;
      });
    },
    // 获取分类数据
    getCategory() {
      getCategory({ sid: "" }).then((res) => {
        this.categorys = res.result.categories;
      });
    },
    //获取数据
    getInfo(id) {
      getInfo({ docid: id }).then((res) => {
        this.form = res.result;
      });
    },
    restFrom() {
      this.form = {
        title: "",
        header: "",
        key: "",
        category: "",
        source: "",
        format: "",
        content: "",
      };
    },
    closeDialog() {
      this.$emit("close", false);
      this.$emit("childId", "");
      this.restFrom();
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    saveData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          if (this.dialogModel === "新增") {
            create(this.form).then((res) => {
              this.$message.success("保存成功");
              this.closeDialog();
            });
          } else {
            update(this.form).then((res) => {
              this.$message.success("保存成功");
              this.closeDialog();
            });
          }
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
