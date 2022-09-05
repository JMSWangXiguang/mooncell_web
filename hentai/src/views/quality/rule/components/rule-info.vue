<template>
  <el-form v-loading="loading" ref="dataForm" :model="model" label-width="auto">
    <el-row type="flex" :gutter="40">
      <el-col :span="8">
        <el-form-item
          label="规则名称"
          prop="title"
          label-width="80px"
          :rules="{
            required: true,
            message: '请输入名称',
            trigger: 'change',
          }"
        >
          <el-input v-model="model.title" />
        </el-form-item>
        <el-form-item label="提示内容" prop="tip" label-width="80px">
          <el-input v-model="model.tip" type="textarea" autosize />
          <div class="ml-4 text-xs text-color-text-secondary">
            <div class="my-5px"><i class="el-icon-info"></i> 提示语占位符</div>
            <div class="ml-4 space-x-2" v-for="p in placeholders" :key="p.holder">
              <span>{{ p.holder }}</span>
              <span>--></span>
              <span>{{ p.scene }}</span>
            </div>
          </div>
          <!-- <div
            class="mt-10px w-full table border-collapse font-normal text-xs text-color-text-regular"
          >
            <div class="table-row" v-for="p in placeholders" :key="p.holder">
              <div class="table-cell border p-5px">{{ p.holder }}</div>
              <div class="table-cell border p-5px">{{ p.scene }}</div>
            </div>
          </div> -->
        </el-form-item>
        <el-form-item label="作用章节" label-width="80px">
          <el-cascader
            ref="cascader"
            popper-class="rule-info-cascader"
            v-model="model.chapter"
            :options="chapterList"
            :props="{
              value: 'chapter_id',
              label: 'title',
              children: 'child',
              emitPath: false,
              checkStrictly: true,
            }"
            placeholder="请选择章节"
            class="w-full"
          />
        </el-form-item>
        <el-form-item
          label="状态"
          label-width="80px"
          :rules="{
            required: true,
            message: '请选择状态',
            trigger: 'change',
          }"
        >
          <el-radio-group v-model="model.status">
            <el-radio label="access">启用</el-radio>
            <el-radio label="ban">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="应用场景" prop="scene" label-width="80px">
          <el-select v-model="model.scene" multiple placeholder="请选择场景" style="width: 100%">
            <el-option label="编写中" value="writing">编写中</el-option>
            <el-option label="运行病历" value="processing">运行病历</el-option>
            <el-option label="在架病历" value="shelf">在架病历</el-option>
            <el-option label="归档" value="archive">归档</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规则简介" prop="desc" label-width="80px">
          <el-input v-model="model.desc" type="textarea" :rows="2" placeholder="请输入规则简介">
          </el-input>
        </el-form-item>
        <el-form-item label="相关规则组" v-show="type === '编辑'" label-width="80px">
          <div v-for="(item, index) in model.group" :key="index">
            <span>{{ item.title }}</span>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-divider content-position="left" m="0">质控函数</el-divider>
        <div class="px-10px pt-20px h-full border-1px border-t-transparent">
          <el-form-item label="类型" prop="function.type" label-width="40px">
            <el-select v-model="model.function.type" placeholder="请选择类型" style="width: 100%">
              <el-option
                v-for="item in funcType"
                :key="item.type_id"
                :label="item.title"
                :value="item.type_id"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="校验时机" prop="timing">
            <el-checkbox-group
              :value="compact(map(model.timing, (v, k) => v && k))"
              @input="
                model.timing = {
                  adhoc: includes($event, 'adhoc'),
                  offline: includes($event, 'offline'),
                }
              "
            >
              <el-checkbox label="adhoc">在线推理</el-checkbox>
              <el-checkbox label="offline">离线处理</el-checkbox>
            </el-checkbox-group>
          </el-form-item> -->
          <el-form-item label="函数" prop="function.func_id" label-width="40px">
            <el-select
              v-model="model.function.func_id"
              placeholder="请选择函数"
              style="width: 100%"
              @change="selectFuncId"
            >
              <el-option
                v-for="item in funcList"
                :key="item.func_id"
                :label="item.title"
                :value="item.func_id"
              ></el-option>
            </el-select>
            <div v-if="tip" class="whitespace-pre-wrap text-xs text-color-text-secondary">
              <i class="el-icon-info"></i>
              {{ tip }}
            </div>
          </el-form-item>
          <el-form-item label="参数" label-width="40px">
            <el-form-item v-for="it in model.function.args" :key="it.key" :label="it.title">
              <el-input v-if="it.type === 'simple'" v-model="it.value" />
              <el-select v-else v-model="it.value" :multiple="it.type === 'multiple'">
                <el-option
                  v-for="{ id, value } in argOptions[it.key]"
                  :key="id"
                  :label="value"
                  :value="id"
                />
              </el-select>
            </el-form-item>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="8">
        <el-divider content-position="left" m="0">过滤条件</el-divider>
        <div class="px-10px pt-20px h-full border-1px border-t-transparent">
          <div
            v-for="(cond, key) in model.conds"
            :key="key"
            class="px-10px pt-20px mb-5px border-1px"
          >
            <el-form-item label="函数" label-width="40px">
              <el-select v-model="cond.func_id" class="w-full">
                <el-option
                  v-for="it in condFuncList"
                  :key="it.func_id"
                  :label="it.title"
                  :value="it.func_id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="参数" label-width="40px">
              <el-form-item v-for="a in cond.args" :key="a.key" :label="a.title">
                <el-input v-if="a.type === 'simple'" v-model="a.value" />
                <el-select v-else v-model="a.value" :multiple="a.type === 'multiple'">
                  <el-option
                    v-for="{ id, value } in condArgOptions[key][cond.func_id]"
                    :key="`${key}${cond.func_id}${id}`"
                    :label="value"
                    :value="id"
                  />
                </el-select>
              </el-form-item>
            </el-form-item>
          </div>
          <el-button
            icon="el-icon-plus"
            type="primary"
            circle
            class="mb-5px float-right"
            @click="model.conds.push({ func_id: '' })"
          ></el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { map, isEmpty, find, filter } from 'lodash'
import {
  ruleDelete,
  ruleCreate,
  ruleUpdate,
  funcTypes,
  funcList,
  getChapterList,
  getRuleInfo,
  getArgList,
  condFuncList,
  condArgs,
} from '@/api/rule/rule'
export default {
  name: 'SliderBox',
  props: {
    ids: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      default: () => '新增',
    },
  },
  data() {
    return {
      isEmpty,
      loading: false,
      tableData: [],
      model: {
        chapter: '',
        desc: '',
        function: {
          func_id: '',
          type: '',
        },
        scene: [],
        status: 'access',
        timing: {},
        tip: '',
        title: '',
        topic: '',
        conds: [{ func_id: '' }],
      },
      funcType: [],
      funcList: [],
      condFuncList: [],
      chapterList: [],
      argOptions: {},
      condArgOptions: [],
    }
  },
  computed: {
    placeholders() {
      return (
        this.funcList.find((f) => f.func_id === this.model.function.func_id)?.placeholders || []
      )
    },
    tip() {
      return this.funcList.find((f) => f.func_id === this.model.function.func_id)?.remark
    },
  },
  watch: {
    'model.function.type'(newType) {
      this.getFunclist(newType)
      this.model.function.title = ''
    },
    'model.topic'(newTopic) {
      this.getChapter(newTopic)
    },
    'model.conds': {
      handler(conds) {
        if (conds) {
          conds.forEach((cond) => {
            const { func_id } = cond
            const findFunc = find(this.condFuncList, (it) => it?.func_id === func_id)
            if (func_id && findFunc) {
              cond.args = findFunc.default_args
            }
            if (func_id && !isEmpty(cond.args)) {
              cond.args.forEach(async (a) => {
                const { result } = await condArgs({ function_id: func_id, key: a.key })
                this.condArgOptions.push({ [func_id]: result })
              })
            }
          })
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.funcTypes()
    this.getCondFuncList()
    const { topic, chapter_id } = this.ids
    if (topic) {
      this.getChapter(topic)
    }
    if (chapter_id) {
      this.model.chapter = chapter_id
    }
  },
  methods: {
    //获取章节列表
    async getChapter(topic) {
      const { result } = await getChapterList({ style: 'tree', topic })
      this.chapterList = result.chapters
    },
    selectFuncId(function_id) {
      const findFunc = find(this.funcList, (it) => it.func_id === function_id)
      if (findFunc) {
        this.model.tip = findFunc.default_tips
        this.model.function.args = findFunc.default_args
        this.model.desc = findFunc.desc
        this.setArgsByFunc(findFunc.default_args, {
          function_id,
          chapter_id: this.model.chapter,
        })
      }
    },
    setArgsByFunc(args, params) {
      args.forEach(async (arg) => {
        if (arg.type !== 'simple') {
          const { result } = await getArgList({
            ...params,
            key: arg.key,
          })
          this.$set(this.argOptions, arg.key, result)
        }
      })
    },
    //校验函数列表
    async getFunclist(val) {
      this.funcList = (await funcList({ type: val })).result.functions
    },
    async getCondFuncList() {
      const { functions } = (await condFuncList({})).result
      this.condFuncList = functions
    },
    async lazyLoad(node, resolve) {
      const { level, value } = node
      if (level === 1) {
        const { chapters } = (await getChapterList({ style: 'tree', topic: value })).result
        resolve(
          map(chapters, (it) => ({
            ...it,
            child: map(it.child, (c) => ({
              ...c,
              leaf: true,
            })),
          }))
        )
      }
      resolve([])
    },
    //校验函数类型列表
    async funcTypes() {
      const res = await funcTypes({})
      this.funcType = res.result.typies
    },
    //新增、编辑
    async handleEdit(rule_id) {
      this.title_id = 'chapter'
      if (!rule_id) {
        return
      }
      this.loading = true
      const { result } = await getRuleInfo({ rule_id })
      // ToDo：处理老数据中的type空值
      result.function.args.forEach((a) => {
        a.type = a.type || 'simple'
      })

      await this.setArgsByFunc(result.function.args, {
        function_id: result.function.func_id,
        chapter_id: result.chapter,
      })
      await this.getChapter(result.topic)
      const { type } = result.function
      if (type) {
        await this.getFunclist(type)
      }
      this.model = result
      this.loading = false
    },
    //删除
    handleDel(callback) {
      this.$confirm('确定删除该信息吗?', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          ruleDelete({ rule_id: this.model.rule_id, clean: true }).then((res) => {
            if (res.status == 200) {
              this.$message.success('删除成功')
              callback()
            }
          })
        })
        .catch(() => {})
    },
    //新增、编辑保存
    saveData(callback) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const params = {
            ...this.model,
            conds: filter(this.model.conds, 'func_id'),
          }
          if (this.type == '新增') {
            ruleCreate(params).then((res) => {
              if (res.status == 200) {
                this.$message.success('创建成功')
              }
            })
          } else {
            ruleUpdate(params).then((res) => {
              if (res.status == 200) {
                this.$message.success('修改成功')
              }
            })
          }
          callback()
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
:deep {
  .el-form-item {
    margin-right: 5px;
  }
  .el-form-item__content .el-form-item__label {
    font-weight: normal;
  }
}
</style>
