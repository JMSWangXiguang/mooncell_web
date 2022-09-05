<template>
  <div>
    <div
      v-if="showLayout"
      style="padding: 20px 60px; border-bottom: 1px solid #ddd"
    >
      注册用户
    </div>
    <div
      :style="
        showLayout ? 'width: 40%; margin: 40px auto' : 'margin: 0 8px 20px 8px'
      "
    >
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="right"
        label-width="100px"
        :rules="rules"
      >

        <el-form-item
          label="姓名"
          prop="name"
          :rules="{
            required: true,
            message: '请输入姓名',
            trigger: 'change',
          }"
        >
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="temp.sex">
            <template v-for="s in sexes">
              <el-radio :key="s.id" :label="s.id">{{ s.title }}</el-radio>
            </template>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label="账号"
          prop="account"
          :rules="{
            required: true,
            message: '请输入账号',
            trigger: 'change',
          }"
        >
          <el-input v-model="temp.account" />
        </el-form-item>


        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item label="所属机构" prop="organization">
          <el-select v-model="temp.organization">
            <template v-for="og in organizations">
              <el-option :key="og.oid" :value="og.oid" :label="og.name" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="身份" prop="education">
          <el-select v-model="temp.identify">
            <template v-for="pos in identifies">
              <el-option :key="pos.id" :value="pos.id" :label="pos.title" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="科室" prop="department">
          <el-select v-model="temp.department">
            <template v-for="depart in departments">
              <el-option
                :key="depart.id"
                :value="depart.id"
                :label="depart.title"
              />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="职称" prop="jobtitle">
          <el-select v-model="temp.jobtitle">
            <template v-for="job in jobtitles">
              <el-option :key="job.id" :value="job.id" :label="job.title" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="学位" prop="education">
          <el-select v-model="temp.education">
            <template v-for="pos in educations">
              <el-option :key="pos.id" :value="pos.id" :label="pos.title" />
            </template>
          </el-select>
        </el-form-item>
        <div :class="showLayout ? 'text-center' : 'text-right'">
          <el-button type="primary" @click="docreate">注册</el-button>
          <el-button
            style="margin-left: 20px"
            @click="$router.push({ path: '/login' })"
            >取消</el-button
          >
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import {
  sexList,
  jobtitleList,
  positionList,
  organList,
  departmentList,
  identifyList,
  createUser,
} from "@/api/operate/apply";
import { isEmpty } from "lodash";
export default {
  props: {
    showLayout: Boolean,
    default: () => true,
  },
  data() {
    return {
      temp: {
        // name: "",
        // organization: {
        //   id: "",
        //   name: "",
        // },
        // identity: {
        //   id: "",
        //   name: "",
        // },
        // userid: "",
        // email: "",
        // phone: "",
        // account: "",
        // position: {
        //   id: "",
        //   name: "",
        // },
        // auth: {},
        // sex: {
        //   id: "",
        //   name: "",
        // },
        // job_title: {
        //   id: "",
        //   name: "",
        // },
        name: "",
        account: "",
        email: "",
        organization: "",
        identify: "",
        education: "",
        sex: "",
        jobtitle: "",
        department: "",
      },
      rules: {
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        organization: [
           { required: true, message: '请输入组织', trigger: 'blur' },
        ],
        identify: [{ required: true, message: "请输入身份", trigger: "blur" }],
        education: [{ required: true, message: "请输入学位", trigger: "blur" }],
        sex: [{ required: true, message: "请输入性别", trigger: "blur" }],
        jobtitle: [{ required: true, message: "请输入职称", trigger: "blur" }],
        department: [
           { required: true, message: '请输入部门', trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    sexes() {
      return this.$store.getters["dict/sexList"];
    },
    jobtitles() {
      return this.$store.getters["dict/jobtitleList"];
    },
    educations() {
      return this.$store.getters["dict/educationList"];
    },
    organizations() {
      return this.$store.getters["dict/organList"];
    },
    departments() {
      return this.$store.getters["dict/departmentList"];
    },
    identifies() {
      return this.$store.getters["dict/identifyList"];
    },
  },
  methods: {
    docreate() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          let x = this._.clone(this.temp);
          let resp = {
            apply_body: {
              ...x,
              sex: {
                id: x.sex,
                name: this._.find(this.sexes, function (o) {
                  return o.id == x.sex;
                })?.title,
              },
              education: {
                id: x.education,
                name: this._.find(this.educations, function (o) {
                  return o.id == x.education;
                })?.title,
              },
              department: {
                id: x.department,
                name: this._.find(this.departments, function (o) {
                  return o.id == x.department;
                })?.title,
              },
              jobtitle: {
                id: x.jobtitle,
                name: this._.find(this.jobtitles, function (o) {
                  return o.id == x.jobtitle;
                })?.title,
              },
              organization: {
                id: x.organization,
                name: this._.find(this.organizations, function (o) {
                  return o.id == x.organization;
                })?.name,
              },
              identity: {
                id: x.identify,
                name: this._.find(this.identifies, function (o) {
                  return o.id == x.identify;
                })?.title,
              },
            },
          };
          // console.log(resp)
          // return false
          createUser(resp).then((res) => {
            this.$message.success("保存成功");
            this.$router.push("/login");
          });
        }
      });
    },
  },
};
</script>
