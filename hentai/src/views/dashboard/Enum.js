/*
 * @Author: imali
 * @Date: 2022-05-03 12:50:51
 * @LastEditTime: 2022-05-13 15:22:04
 * @LastEditors: imali
 * @Description:
 */

export const EKnowledge = [
  {
    title: '图谱导航',
    desc: '知识图谱首页。数据量统计，导入、导出、版本维护。',
    name: 'databoard',
  },
  {
    title: '疾病维护',
    desc: '从医疗文献中人工提取的疾病相关关键知识。',
    name: 'disease',
  },
  {
    title: '图谱看板',
    desc: '用户查询相关知识，以图的形式展现。',
    name: 'graph',
  },
  {
    title: '基础知识',
    desc: '症状、体征、检验、检查、人群等基本知识图谱。',
    name: 'basis',
  },
  {
    title: '分类维护',
    desc: '管理知识图谱中，节点和关系的分类。',
    name: 'kind',
  },
  {
    title: '文献内容',
    desc: '医学教科书、诊疗指南中的文献内容。',
    name: 'literature',
    icon: 'safeguard',
  },
  {
    title: '文献维护',
    desc: '医学教科书、诊疗指南中的文献内容。',
    name: 'source',
    icon: 'safeguard',
  },
]

export const EStructure = [
  {
    title: '语料标注',
    desc: '对于语料库中未标注的病历文本进行标注，用于训练模型使用。',
    name: 'markBoard',
  },
  {
    title: '模型测试',
    desc: '训练完的结构化模型进行测试，人为查看模型效果。',
    name: 'texttest',
  },
  {
    title: '标注历史',
    desc: '用户标注完成的语料，用于查看、修改之前标注的内容。',
    name: 'remark',
  },
  {
    title: '语料管理',
    desc: '查看、手动录入各分类医疗语料。',
    name: 'corpus',
  },
  {
    title: '语料分类',
    desc: '根据语义特点管理不同章节的语料分类。',
    name: 'category',
  },
  {
    title: '词性管理',
    desc: '管理医疗各章节文本中语义的实体词类型。',
    name: 'speech',
  },
  {
    title: '模型管理',
    desc: '根据不同病历章节、科室建立不同的结构化模型。',
    name: 'nermodel',
  },
]

export const EQuality = [
  {
    title: '质控规则',
    desc: '查看、新建具体质控规则、提示语，根据不同科室控制规则开关。',
    name: 'rule',
  },
  {
    title: '科室规范管理',
    desc: '根据不同科室创建规则组。',
    name: 'department',
  },
  {
    title: '病历章节管理',
    desc: '查看、管理系统中病历章节树状关系。',
    name: 'chapter',
  },
  {
    title: '质控测试',
    desc: '测试配置好的规则，输入病历ID或病历内容，返回质控结果。',
    name: 'exam',
  },
]

export const EThesaurus = [
  {
    title: '挖掘同义词',
    desc: '从病历系统中提取未处理过(没在同义词库中)的实体词。',
    name: 'classification',
  },
  {
    title: '词库维护',
    desc: '管理系统中维护的同义词库、标准词语。',
    name: 'safeguard',
  },
]
