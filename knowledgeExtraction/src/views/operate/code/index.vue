<!--
 * @Author: your name
 * @Date: 2022-01-13 14:53:53
 * @LastEditTime: 2022-04-19 16:58:49
 * @LastEditors: 陈逸
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \knowledgeExtraction\src\views\operate\task\index.vue
-->
<template>
  <div v-loading="loading">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card h="[calc(100vh-90px)]">
          <el-tree
            :data="trees"
            highlight-current
            @node-click="handleNodeClick"
          ></el-tree>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card v-if="nowRow != {}">
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 20px;
            "
          >
            <div>
              当前：<span style="color: #0080ff">{{ nowRow.label }}</span>
            </div>
            <el-button @click="goadd" style="float: right" type="primary"
              ><i class="el-icon-plus"></i> 添加</el-button
            >
          </div>
          <el-tree
            v-if="nowRow.value === 'catecode'"
            default-expand-all
            node-key="id"
            :data="tableData"
            :props="{
              label: 'title',
            }"
            h="[calc(100vh-168px)]"
          >
            <template #default="{ node, data }">
              <div class="w-full text-sm flex justify-between mr-16px">
                <span class="leading-36px">{{ node.label }}</span>
                <span>
                  <el-button type="text" @click.stop="goedit(data)">
                    编辑
                  </el-button>
                  <el-button
                    type="text"
                    text="[#f5222d]"
                    @click.stop="godel(data)"
                  >
                    删除
                  </el-button>
                </span>
              </div>
            </template>
          </el-tree>
          <el-table
            v-else
            :data="tableData"
            border
            stripe
            w="full"
            height="calc(100vh - 168px)"
            :row-style="{height:'20px'}"
            :cell-style="{padding:'3px'}"
          >
            <el-table-column v-if="nowRow.value !== 'organization'" label="id" prop="id" width="100">
            </el-table-column>
            <el-table-column v-if="nowRow.value !== 'organization'" prop="title" label="名字"> </el-table-column>
            <template v-if="nowRow.value === 'btype'">
              <el-table-column prop="short_title" label="简"> </el-table-column>
              <el-table-column prop="single_word" label="单字">
              </el-table-column>
              <el-table-column prop="double_word" label="双字">
              </el-table-column>
              <el-table-column prop="desc" label="注释"> </el-table-column>
            </template>
            <template v-if="nowRow.value === 'organization'">
              <el-table-column prop="id" label="机构代码"></el-table-column>
              <el-table-column prop="title" label="机构名称"></el-table-column>
              <el-table-column prop="hospital_level" label="医院级别"></el-table-column>
              <el-table-column prop="hospital_type" label="医院性质"></el-table-column>
              <el-table-column prop="hospital_grade" label="医院等级"></el-table-column>
            </template>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="goedit(scope.row)" type="text">
                  编辑
                </el-button>
                <el-button
                  @click="godel(scope.row)"
                  type="text"
                  text="[#f5222d]"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      :visible.sync="popup"
      :close-on-click-modal="false"
      width="550px"
    >
      <template slot="title">
        <div
          style="
            font-size: 16px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
          "
        >
          新增
        </div>
      </template>
      <el-form ref="ruleForm" :model="addform" label-width="80px" :rules="rules">
        <el-form-item v-if="nowRow.value !== 'organization'" label="id" prop="id">
          <el-input v-model="addform.id" w="400px"></el-input>
        </el-form-item>
        <el-form-item v-if="nowRow.value !== 'organization'" label="名字" prop="title">
          <el-input v-model="addform.title" w="400px"></el-input>
        </el-form-item>
        <template v-if="nowRow.value === 'btype'">
          <el-form-item label="简" prop="short_title">
            <el-input v-model="addform.short_title" w="400px"></el-input>
          </el-form-item>
          <el-form-item label="单字" prop="single_word">
            <el-input v-model="addform.single_word" w="400px"></el-input>
          </el-form-item>
          <el-form-item label="双字" prop="double_word">
            <el-input v-model="addform.double_word" w="400px"></el-input>
          </el-form-item>
          <el-form-item label="注释" prop="desc">
            <el-input v-model="addform.desc" w="400px"></el-input>
          </el-form-item>
        </template>
        <template v-if="nowRow.value === 'organization'">
          <el-form-item label="机构代码" prop="id">
            <el-input v-model="addform.id" w="400px"></el-input>
          </el-form-item>
          <el-form-item label="机构名称" prop="title">
            <el-input v-model="addform.title" w="400px"></el-input>
          </el-form-item>
          <el-form-item label="医院级别" prop="hospital_level">
            <el-input v-model="addform.hospital_level" w="400px"></el-input>
          </el-form-item>
          <el-form-item label="医院等级" prop="hospital_grade">
            <el-input v-model="addform.hospital_grade" w="400px"></el-input>
          </el-form-item>
          <el-form-item label="医院性质" prop="hospital_type">
            <el-input v-model="addform.hospital_type" w="400px"></el-input>
          </el-form-item>
        </template>
        <template v-if="nowRow.value === 'catecode'">
          <el-form-item label="父级" prop="pid">
            <el-cascader
              v-model="addform.pid"
              clearable
              w="400px"
              :options="[
                ...tableData,
                {
                  id: '',
                  title: '无',
                },
              ]"
              :props="{
                emitPath: false,
                value: 'id',
                label: 'title',
                checkStrictly: true,
              }"
            />
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doadd('ruleForm')">确 定</el-button>
        <el-button @click="popup = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getCommonCode,
  editCommonCode,
  delCommonCode,
  addCommonCode,
} from "@/api/operate/apply";
export default {
  data() {
    return {
      trees: [
        {
          id: "1",
          label: "用户相关",
          children: [
            {
              id: "1-1",
              label: "身份",
              value: "identify",
            },
            {
              id: "1-2",
              label: "职称",
              value: "jobtitle",
            },
            {
              id: "1-3",
              label: "学位",
              value: "education",
            },
            {
              id: "1-4",
              label: "性别",
              value: "sex",
            },
            {
              id: "1-5",
              label: "部门",
              value: "department",
            },
            {
              id: "1-6",
              label: "申请理由",
              value: "reason",
            },
          ],
        },
        {
          id: "2",
          label: "机构相关",
          children: [
            {
              id: "2-1",
              label: "机构",
              value: "organization",
            },
            // {
            //   id: "2-2",
            //   label: "机构类型",
            //   value: "level",
            // },
          ],
        },
        {
          id: "3",
          label: "文献相关",
          children: [
            {
              id: "3-1",
              label: "文献类型",
              value: "btype",
            },
            {
              id: "3-2",
              label: "文献来源",
              value: "source",
            },
          ],
        },
        {
          id: "4",
          label: "学科相关",
          children: [
            {
              id: "4-1",
              label: "学科类型",
              value: "catecode",
            },
          ],
        },
      ],
      nowRow: {},
      loading: false,
      tableData: [],
      popup: false,
      addform: { id: "", title: "" },
      poptype: "add",
      old_id: "",
    };
  },
  computed: {
    rules() {
      if (this.nowRow.value === "btype") {
        return {
          title: [{ required: true, message: "请输入名字", trigger: "blur" }],
          short_title: [
            { required: true, message: "请输入简", trigger: "blur" },
          ],
          single_word: [
            { required: true, message: "请输入单字", trigger: "blur" },
          ],
          double_word: [
            { required: true, message: "请输入双字", trigger: "blur" },
          ],
        };
      } else if (this.nowRow.value === "catecode") {
        return {
          pid: [{ required: true, message: "请选择父级", trigger: "blur" }],
          title: [{ required: true, message: "请输入名字", trigger: "blur" }],
        };
      } else if (this.nowRow.value === "organization") {
        return {
          id: [{ required: true, message: "请输入机构代码", trigger: "blur" }],
          title: [{ required: true, message: "请输入机构名称", trigger: "blur" }],
        };
      }
      return {
        id: [{ required: true, message: "请输入id", trigger: "blur" }],
        title: [{ required: true, message: "请输入名字", trigger: "blur" }],
      };
    },
  },
  methods: {
    handleNodeClick(v) {
      if (v.value) {
        this.loading = true;
        this.nowRow = v;
        getCommonCode(v.value, "")
          .then((res) => {
            this.tableData = res.result;
            this.loading = false;
          })
          .catch((err) => {
            this.loading = false;
          });
      }
    },

    // 添加
    goadd() {
      if (this.nowRow != {}) {
        this.poptype = "add";
        (this.addform = { id: "", title: "" }), (this.popup = true);
      }
    },
    // 编辑
    goedit(v) {
      if (this.nowRow != {}) {
        this.poptype = "edit";
        this.addform = v;
        this.popup = true;
        this.old_id = v.id;
      }
    },
    doadd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.poptype == "add") {
            this.loading = true;
            addCommonCode(this.nowRow.value, this.addform)
              .then((res) => {
                this.$message({
                  type: "success",
                  message: "上传成功",
                });
                this.popup = false;
                this.loading = false;
                this.handleNodeClick(this.nowRow);
                // this.tableData = res
                // this.loading = false
              })
              .catch((err) => {
                this.loading = false;
              });
          } else {
            this.loading = true;
            editCommonCode(this.nowRow.value, {
              ...this.addform,
              old_id: this.old_id,
            })
              .then((res) => {
                this.$message({
                  type: "success",
                  message: "修改成功",
                });
                this.popup = false;
                this.loading = false;
                this.handleNodeClick(this.nowRow);
                // this.tableData = res
                // this.loading = false
              })
              .catch((err) => {
                this.loading = false;
              });
          }
        } else {
          console.log('error submit!!');
          return false
        }
      })
    },

    // 删除
    godel(v) {
      console.log(v);
      this.$confirm("删除之后无法恢复，是否确认删除", "确认删除信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "删除",
        cancelButtonText: "放弃删除",
      })
        .then(() => {
          this.loading = true;
          delCommonCode(this.nowRow.value, v)
            .then((res) => {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.loading = false;
              this.handleNodeClick(this.nowRow);
              // this.tableData = res
              // this.loading = false
            })
            .catch((err) => {
              this.loading = false;
            });
        })
        .catch((action) => {
          // this.$message({
          //   type: 'info',
          //   message: action === 'cancel'
          //     ? '放弃保存并离开页面'
          //     : '停留在当前页面'
          // })
        });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-tree {
  overflow-y: auto;
}
::v-deep .el-tree-node__content {
  height: 36px;
}
</style>
