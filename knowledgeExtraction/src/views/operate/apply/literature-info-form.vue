<!--
 * @Author: imali
 * @Date: 2022-02-22 17:30:08
 * @LastEditTime: 2022-05-24 11:09:09
 * @LastEditors: 陈逸
 * @Description:
-->
<template>
  <p-descriptions-form
    ref="form"
    v-model="value"
    v-loading="uploadLoading"
    element-loading-text="正在上传中..."
    :descriptions="{ column: 2 }"
    :items="items"
    :rules="rules"
    v-bind="$attrs"
  >
    <template #btype_id v-if="bTypeList && bTypeList.length">
      <el-select v-model="value.btype_id" placeholder="请选择文献类型">
        <el-option
          v-for="item in bTypeList"
          :key="item.id"
          :label="item.title"
          :value="item.id">
          <div style="float: left">{{ item.title }}</div>
          <div style="float: right; padding-left:10px;color: #8492a6; font-size: 13px">{{ item.desc }}</div>
        </el-option>
      </el-select>
      <!-- <el-option
        v-for="btype in bTypeList"
        :key="btype.id"
        :label="btype.title"
        :value="btype.id"
      >
      </el-option> -->
    </template>
    <template #publish_house v-if="sourceList && sourceList.length">
      <el-select v-model="value.publish_house" placeholder="请选择文献来源">
        <el-option
          v-for="item in sourceList"
          :key="item.id"
          :label="item.title"
          :value="item.id">
          <div style="float: left">{{ item.title }}</div>
        </el-option>
      </el-select>
    </template>
    <template #is_ocr>
      <el-radio :label="1" :disabled="isOrc === 1">启用</el-radio>
      <el-radio :label="2" :disabled="isOrc === 1">不启用</el-radio>
    </template>
    <template #is_real>
      <el-radio :label="1" :disabled="isReal === 1">启用</el-radio>
      <el-radio :label="2" :disabled="isReal === 1">不启用</el-radio>
    </template>
    <template #status>
      <el-radio v-for="item in statusList" :key="item.id" :label="item.id">
        {{ item.value }}
      </el-radio>
    </template>
    <template #file>
      <i class="el-icon-plus"></i>
    </template>
    <template #remark>
      <el-option
        v-for="r in reasons"
        :key="r.id"
        :value="r.title"
        :label="r.title"
      />
    </template>
  </p-descriptions-form>
</template>
<script>
import PDescriptionsForm from "@/components/PDescriptionsForm.vue";
import {
  fileDownload,
  sliceFinish,
  sliceUpload,
} from "@/api/literature/automaticEntry";
import { has, compact, isEmpty } from "lodash";
import dayjs from "dayjs";

const PDFPNG =
  "data:image/png;base64,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";

export default {
  components: { PDescriptionsForm },
  props: {
    value: {
      type: Object,
      required: true,
    },
    applyId: {
      type: Number,
      default: () => 0,
    },
    isApply: {
      type: Boolean,
      default: () => true,
    },
    hasFile: {
      type: Boolean,
      default: () => true,
    },
    hasStatus: {
      type: Boolean,
      default: () => false,
    },
    disableOCR: {
      type: Boolean,
      default: () => false,
    },
    disableREAL: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      fileList: [],
      uploadLoading: false,
      statusList: [
        { id: "access", value: "启用" },
        { id: "ban", value: "停用" },
        { id: "abandon", value: "废弃" },
        { id: "devel", value: "开发中" },
      ],
      rules: {
        title: [
          { required: true, message: "请输入文献名称", trigger: "change" },
        ],
        btype_id: [
          { required: true, message: "请选择文献类型", trigger: "change" },
        ],
        cata_id: [
          { required: true, message: "请选择学科分类", trigger: "change" },
        ],
        publish_house: [
          { required: true, message: "请选择文献来源", trigger: "change" },
        ],
        edition: [{ required: true, message: "请输入版次", trigger: "change" }],
        author: [{ required: true, message: "请输入作者", trigger: "change" }],
        // editor: [{ required: true, message: "请输入主编", trigger: "change" }],
        // language: [
        //   { required: true, message: "请输入语言", trigger: "change" },
        // ],
        page: [
          { required: true, message: "请输入页数", trigger: "change" },
          {
            trigger: "change",
            validator(_rule, value, callback) {
              if (Number(value) < 1 || !Number.isInteger(Number(value))) {
                callback(new Error("请正确输入页数"));
              } else {
                callback();
              }
            },
          },
        ],
        volume: [
          { required: true, message: "请输入出版卷号", trigger: "change" },
        ],
        no: [{ required: true, message: "请输入出版期号", trigger: "change" }],
        sn: [{ required: true, message: "请输入标准编号", trigger: "change" }],
        publish_time: [
          { required: true, message: "请输入出版时间", trigger: "change" },
        ],
        is_ocr: [
          { required: true, message: "请选择是否启用OCR", trigger: "change" },
        ],
        is_real: [
          { required: true, message: "请选择是否启用真实页码", trigger: "change" },
        ],
      },
      isOrc: null,
      isReal: null
    };
  },
  created() {
    console.log('this.bTypeList',this.bTypeList)
  },
  computed: {
    items() {
      return compact([
        {
          prop: "title",
          label: "文献名称",
          content: {
            is: "el-input",
            clearable: true,
            placeholder: "请输入文献名称",
          },
        },
        {
          prop: "btype_id",
          label: "文献类型"
        },
        {
          prop: "cata_id",
          label: "学科分类",
          content: {
            is: "el-cascader",
            clearable: true,
            options: this.cateList,
            placeholder: "请选择学科分类",
            props: {
              value: "id",
              label: "title",
              checkStrictly: true,
              emitPath: false,
            },
          },
        },
        {
          prop: "publish_time",
          label: "出版时间",
          content: {
            is: "el-date-picker",
            clearable: true,
            placeholder: "请选择出版时间",
            type: "month",
            format: "yyyy年MM月",
            valueFormat: "yyyy-MM",
            pickerOptions: {
              disabledDate(d) {
                return dayjs().isBefore(dayjs(d), "day");
              },
            },
          },
        },
        {
          prop: "publish_house",
          label: "文献来源",
        },
        {
          prop: "edition",
          label: "版次",
          content: {
            is: "el-input",
            clearable: true,
            placeholder: "请输入版次",
          },
        },
        {
          prop: "author",
          label: "作者",
          content: {
            is: "el-input",
            clearable: true,
            placeholder: "请输入作者",
          },
        },
        // {
        //   prop: "editor",
        //   label: "主编",
        //   content: {
        //     is: "el-input",
        //     clearable: true,
        //     placeholder: "请输入主编",
        //   },
        // },
        // {
        //   prop: "language",
        //   label: "语言",
        //   content: {
        //     is: "el-input",
        //     clearable: true,
        //     placeholder: "请输入语言",
        //   },
        // },
        {
          prop: "page",
          label: "页数",
          content: {
            is: "el-input",
            clearable: true,
            placeholder: "请输入页数",
          },
        },
        {
          prop: "volume",
          label: "出版卷号",
          content: {
            is: "el-input",
            clearable: true,
            placeholder: "请输入出版卷号",
          },
        },
        {
          prop: "no",
          label: "出版期号",
          content: {
            is: "el-input",
            clearable: true,
            placeholder: "请输入出版期号",
          },
        },
        {
          prop: "sn",
          label: "标准编号",
          content: {
            is: "el-input",
            clearable: true,
            placeholder: "请输入标准编号",
          },
        },
        {
          prop: "is_ocr",
          label: "启用OCR",
          content: {
            is: "el-radio-group",
            placeholder: "请选择是否启用OCR",
            disabled: this.disableOCR,
          },
        },
        {
          prop: "is_real",
          label: "启用真实页码",
          content: {
            is: "el-radio-group",
            placeholder: "请选择是否启用真实页码",
            disabled: this.disableREAL,
          },
        },
        this.hasFile
          ? {
              prop: "file",
              label: "文件上传",
              content: {
                is: "el-upload",
                class: `${
                  this.uploadLoading || (this.fileList && this.fileList.length)
                    ? "to-hidden"
                    : ""
                }`,
                action: "",
                drag: true,
                limit: 1,
                listType: "picture-card",
                accept: "application/pdf",
                httpRequest: this.uploadFile,
                fileList: this.fileList,
                onPreview: has(this.$attrs, "disabled")
                  ? this.handlePreview
                  : undefined,
                onRemove: () => (this.fileList = []),
              },
              descriptions: { span: 2 },
            }
          : undefined,
        this.hasStatus
          ? {
              prop: "status",
              label: "状态",
              content: {
                is: "el-radio-group",
                clearable: true,
              },
              descriptions: { span: 2 },
            }
          : undefined,
        this.isApply
          ? {
              prop: "remark",
              label: "申请理由",
              content: {
                is: "el-select",
                clearable: true,
                placeholder: "请选择申请理由",
              }
            }
          : undefined,
      ]);
    },
    bTypeList() {
      return this.$store.getters["dict/bTypeList"];
    },
    cateList() {
      return this.$store.getters["dict/cateList"];
    },
    reasons() {
      return this.$store.getters["dict/reasonList"];
    },
    sourceList() {
      return this.$store.getters["dict/sourceList"];
    },
  },
  watch: {
    "value.file"(newFile) {
      if (
        newFile?.filename &&
        newFile?.file_path_tmp &&
        isEmpty(this.fileList)
      ) {
        const { filename, file_path_tmp } = newFile;
        this.fileList.push({
          name: filename,
          path: file_path_tmp,
          url: PDFPNG,
        });
      }
    },
    value: {
      immediate: true,
      handler(newValue, oldvalue) {
        this.isOrc = newValue.is_ocr
        this.isReal = newValue.is_real
      }
    }
  },
  methods: {
    async uploadFile(params) {
      const { file, onError } = params;
      const bytesPerPiece = 2 * 1024 * 1024;
      const slice_size = Math.ceil(file.size / bytesPerPiece);
      this.uploadLoading = true;
      try {
        let bid = "";
        for (let i = 0; i < slice_size; i++) {
          const start = i * bytesPerPiece;
          let end = (i + 1) * bytesPerPiece;
          if (end > file.size) {
            end = file.size;
          }
          const chunk = file.slice(start, end);

          const formData = new FormData();
          formData.append("slice_id", i);
          formData.append("file", chunk);
          formData.append("bid", bid);

          const r = await sliceUpload(formData);
          if (r.status !== 200) {
            throw new Error(`上传失败，${r.message}`);
          }
          if (i === 0) {
            bid = r.result.bid;
          }
        }
        const res = await sliceFinish({
          slice_size,
          bid,
          file_name: file.name,
        });
        if (res.result) {
          const { filename, file_path_tmp } = res.result;
          this.$message.success("上传成功");
          this.fileList.push({
            name: filename,
            url: PDFPNG,
            path: file_path_tmp,
          });
          this.value.file.filename = filename;
          this.value.file.file_path_tmp = file_path_tmp;
          this.uploadLoading = false;
        } else {
          this.$message.error(`上传失败，${res.message}`);
          this.uploadLoading = false;
        }
      } catch (error) {
        console.error(error);
        this.uploadLoading = false;
        onError(error);
      }
    },
    async handlePreview() {
      if (this.applyId) {
        try {
          const { result, msg } = await fileDownload({
            apply_id: this.applyId,
          });
          if (result) {
            window.open(result.download_url);
          } else {
            this.$message.error(msg);
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-upload-dragger {
  width: 100%;
  height: 100%;
}
::v-deep .el-upload--picture-card,
::v-deep .el-upload-list--picture-card .el-upload-list__item {
  width: 100px;
  height: 100px;
  margin: 0;
}
::v-deep .el-upload--picture-card {
  line-height: 100px;
}
::v-deep .el-upload-list__item {
  &.is-success img {
    margin-top: 10%;
    margin-left: 10%;
    width: 80%;
    height: 80%;
  }
  &.is-ready img {
    display: none;
  }
}
::v-deep .to-hidden {
  line-height: 0;
}
::v-deep .to-hidden div.el-upload.el-upload--picture-card {
  display: none;
}
</style>
