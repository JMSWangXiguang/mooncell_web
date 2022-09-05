<!--
 * @Author: imali
 * @Date: 2022-03-30 13:33:53
 * @LastEditTime: 2022-07-25 17:49:16
 * @LastEditors: imali
 * @Description:
-->
<template>
  <el-form ref="form" :model="model_info" :rules="rules">
    <el-form-item prop="model_name" class="absolute top-20px" :inline-message="true">
      <el-input
        v-model="model_info.model_name"
        placeholder="请输入模型名称"
        size="medium"
        class="w-220px"
        clearable
      ></el-input>
    </el-form-item>
    <el-row :gutter="8" mt="10px">
      <el-col :span="12">
        <el-card shadow="never" header="样本条件">
          <p-form
            ref="sample-form"
            label-width="auto"
            :items="sample_items"
            :rules="sample_rules"
            v-model="model_info.sample_config"
            inline-message
            hide-required-asterisk
          >
            <template #category>
              <!-- <el-option label="全部" value="0"></el-option> -->
              <el-option
                v-for="{ category_id, name } in categoryList"
                :key="category_id"
                :label="name"
                :value="category_id"
              ></el-option>
            </template>
            <template #source>
              <!-- <el-option label="全部" value="0"></el-option> -->
              <el-option
                v-for="{ name } in sourceList"
                :key="name"
                :label="name"
                :value="name"
              ></el-option>
            </template>
            <template #dept>
              <el-option
                v-for="{ name } in deptList"
                :key="name"
                :label="name"
                :value="name"
              ></el-option>
            </template>
            <template #marker>
              <!-- <el-option label="全部" value="0"></el-option> -->
              <el-option
                v-for="{ userid, nickname } in userList"
                :key="userid"
                :label="nickname"
                :value="userid"
              ></el-option>
            </template>
          </p-form>
        </el-card>
        <div p="20px">
          <template v-if="model_info.status !== EStatus['训练中']">
            <p mb="15px">
              最后更新<label ml="20px">{{ $attrs.last_time || '' }}</label>
            </p>
            <p mb="15px" ml="1em">
              更新人<label ml="20px">{{ $attrs.update_user_name || '' }}</label>
            </p>
          </template>
          <p>
            样本数量<label ml="20px">{{ sample_num }}</label>
          </p>
          <template v-if="model_info.status === EStatus['训练中']">
            <p mt="3px">
              训练开始<label ml="20px">{{ $attrs.update_time || '' }}</label>
            </p>
            <p mt="3px" ml="2em">
              耗时<label ml="20px">{{ $attrs.consuming || '' }}</label>
            </p>
            <p mt="3px" ml="2em">
              进度
              <el-progress
                :percentage="rate * 100"
                :show-text="false"
                :stroke-width="10"
                ml="16px"
                w="1/2"
                inline="block"
              ></el-progress>
            </p>
            <el-button type="danger" mt="15px" @click="doCancel">取消训练</el-button>
          </template>
          <el-button v-else type="success" mt="15px" @click="doTrain">训练</el-button>
        </div>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never" body-style="padding:0">
          <template #header>
            训练参数
            <el-select class="w-120px ml-20px" value="" @change="selectMould">
              <!-- <el-option label="全部" value="0"></el-option> -->
              <el-option
                v-for="{ mould_id, name } in modelSchema"
                :key="mould_id"
                :label="name"
                :value="mould_id"
              ></el-option>
            </el-select>
            <el-button
              icon="el-icon-circle-plus-outline"
              type="text"
              text="xl [#409eff]"
              float="right"
              mt="5px"
              p="0"
              @click="model_info.model_config.push({ name: '', value: '' })"
            ></el-button>
          </template>
          <p-table
            :columns="model_columns"
            :data.sync="model_info.model_config"
            :show-header="false"
            height="352px"
          >
            <template #name="{ row }">
              <el-input v-model="row.name"></el-input>
            </template>
            <template #value="{ row }">
              <el-input v-model="row.value"></el-input>
            </template>
            <template #action="{ index }">
              <el-button
                icon="el-icon-remove-outline"
                type="text"
                text="base color-danger"
                @click="model_info.model_config.splice(index, 1)"
              ></el-button>
            </template>
          </p-table>
        </el-card>
        <div px="20px" py="15px">
          <p>
            是否使用
            <el-select v-model="model_info.status" ml="20px" w="120px">
              <el-option
                v-for="(label, key) in OStatus"
                :key="key"
                :label="label"
                :value="key"
                :disabled="key !== EStatus['正常'] && key !== EStatus['停用']"
              ></el-option>
            </el-select>
          </p>
          <el-input
            v-model="model_info.desc"
            :rows="2"
            type="textarea"
            mt="15px"
            resize="none"
          ></el-input>
          <div mt="15px">
            <el-button>取消</el-button>
            <el-button type="primary" @click="doSave">保存</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import {
  cancelTrain,
  createModel,
  getModelArgument,
  getModelSample,
  trainModel,
  updateModel,
} from '@/api/manage/nermodel'
import { map, reduce } from 'lodash'
import { EStatus, OStatus } from './enum'
export default {
  props: {
    categoryList: {
      type: Array,
      required: true,
    },
    sourceList: {
      type: Array,
      required: true,
    },
    deptList: {
      type: Array,
      required: true,
    },
    userList: {
      type: Array,
      required: true,
    },
    modelSchema: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      OStatus,
      EStatus,
      rules: {
        model_name: [{ required: true, message: '请输入模型名称' }],
      },
      sample_rules: {
        category: [{ required: true, message: '请选择分类' }],
        source: [{ required: true, message: '请选择机构' }],
        dept: [{ required: true, message: '请选择科室' }],
        marker: [{ required: true, message: '请选择标注人' }],
      },
      sample_items: [
        {
          prop: 'category',
          label: '分类',
          content: {
            is: 'el-select',
            multiple: true,
          },
        },
        {
          prop: 'source',
          label: '机构',
          content: {
            is: 'el-select',
            multiple: true,
          },
        },
        {
          prop: 'dept',
          label: '科室',
          content: {
            is: 'el-select',
            multiple: true,
          },
        },
        {
          prop: 'marker',
          label: '标注人',
          content: {
            is: 'el-select',
            multiple: true,
          },
        },
      ],
      sample_num: 0,
      model_columns: [
        {
          prop: 'name',
        },
        {
          prop: 'value',
        },
        {
          prop: 'action',
          width: 30,
          align: 'center',
        },
      ],
      model_info: {
        model_name: '',
        sample_config: {
          category: [],
          source: [],
          marker: [],
          dept: [],
        },
        model_config: [],
        status: EStatus['正常'],
        desc: '',
      },
    }
  },
  watch: {
    'model_info.sample_config': {
      async handler(newSample) {
        const { category, dept, marker, source } = newSample
        if (category.length && dept.length && marker.length && source.length) {
          const { result } = await getModelSample(newSample)
          this.sample_num = result.sample_num || 0
        }
      },
      deep: true,
    },
    mould_id: {
      async handler(mould_id) {
        if (mould_id) {
          const { result } = await getModelArgument({ mould_id })
          this.model_info.model_config = map(result.model_config, (value, name) => ({
            name,
            value,
          }))
        }
      },
      immediate: true,
    },
  },
  methods: {
    async selectMould(mould_id) {
      if (mould_id) {
        const { result } = await getModelArgument({ mould_id })
        this.model_info.model_config = map(result.model_config, (value, name) => ({
          name,
          value,
        }))
      }
    },
    async doTrain() {
      const { model_id } = this.model_info
      if (!model_id) {
        return this.$message.error('请先保存')
      }
      const { status } = await trainModel({ model_id })
      if (status === 200) {
        this.$message.success('训练成功')
      }
    },
    async doCancel() {
      const { model_id } = this.model_info
      const { status } = await cancelTrain({ model_id })
      if (status === 200) {
        this.$message.success('取消成功')
      }
    },
    async doSave() {
      let valid = true
      await this.$refs.form.validate((v) => (valid = valid && v))
      await this.$refs['sample-form'].$refs['p-form'].validate((v) => (valid = valid && v))
      const params = {
        ...this.model_info,
        model_config: reduce(
          this.model_info.model_config,
          (r, { name, value }) => {
            r[name] = value
            return r
          },
          {}
        ),
      }
      if (valid) {
        if (this.model_info.model_id) {
          await updateModel(params)
        } else {
          await createModel(params)
        }
      }
      this.$message.success('保存成功')
    },
  },
}
</script>
<style lang="scss" scoped>
:deep(.el-card__header) {
  padding: 0px 20px;
  height: 40px;
  line-height: 40px;
}
:deep(.el-table) {
  border: none;
  &::before,
  &::after {
    display: none;
  }
}
:deep(.el-form-item__content) {
  height: 60px;
  .el-select__tags {
    max-height: 60px;
    overflow: auto;
  }
}
:deep(.el-table__row) {
  td,
  .cell {
    padding: 0 !important;
  }
  input {
    border: none;
  }
}
</style>
