import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout/index'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },
  {
    path: '/auth',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true,
  },
  {
    path: '/thirdview/quality/checkpoint',
    component: () => import('@/views/third/index'),
    hidden: true,
  },
  {
    path: '/thirdview/quality/sidebar',
    component: () => import('@/views/third/checkpoint'),
    hidden: true,
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'el-icon-odometer' },
      },
    ],
  },
]

export const asyncRoutes = [
  {
    path: '/settags',
    redirect: '/settags/category',
    component: Layout,
    name: 'SetTags',
    meta: { title: '标注病例', icon: 'el-icon-price-tag' },
    children: [
      {
        path: 'markboard',
        name: 'markBoard',
        component: () => import('@/views/markboard/index'),
        meta: { title: '病例标注' },
      },
      {
        path: 'marktags',
        name: 'MarkTags',
        hidden: true,
        component: () => import('@/views/marktags/index'),
        meta: { title: '病例标注' },
        children: [],
      },
      {
        path: 'category',
        name: 'category',
        component: () => import('@/views/category/index'),
        meta: { title: '分类管理' },
      },
      {
        path: 'speech',
        name: 'speech',
        component: () => import('@/views/speech/index'),
        meta: { title: '词性管理' },
      },
      {
        path: 'corpus',
        name: 'corpus',
        component: () => import('@/views/corpus/index'),
        meta: { title: '语料管理' },
      },
      {
        path: 'remark',
        name: 'remark',
        component: () => import('@/views/remark/index'),
        meta: { title: '标注历史' },
      },
      {
        path: 'remarkInfo',
        name: 'remarkInfo',
        hidden: true,
        component: () => import('@/views/remark/info'),
        meta: { title: '标注历史详情' },
      },
      {
        path: 'texttest',
        name: 'texttest',
        component: () => import('@/views/texttest/index'),
        meta: { title: '文本测试' },
      },
      // {
      //   path: 'analysis',
      //   name: 'analysis',
      //   component: () => import('@/views/analysis/index'),
      //   meta: { title: '分析标注' },
      // },
      {
        path: 'nermodel',
        name: 'nermodel',
        component: () => import('@/views/nermodel/index'),
        meta: { title: 'NER模型' },
      },
    ],
  },
  // {
  //   path: '/manage',
  //   redirect: '/manage/users',
  //   component: Layout,
  //   name: 'manage',
  //   meta: { title: '通用管理', icon: 'el-icon-umbrella' },
  //   children: [
  //     {
  //       path: 'users',
  //       name: 'users',
  //       component: () => import('@/views/users/index'),
  //       meta: { title: '用户管理' },
  //     },
  //   ],
  // },
  {
    path: '/knowledge',
    redirect: '/knowledge/classification',
    component: Layout,
    name: 'knowledge ',
    meta: { title: '知识图谱', icon: 'el-icon-notebook-1' },
    children: [
      {
        path: 'databoard',
        name: 'databoard',
        component: () => import('@/views/knowledge/databoard/index'),
        meta: { title: '图谱导航' },
      },
      {
        path: 'graph',
        name: 'graph',
        component: () => import('@/views/knowledge/graph/index'),
        meta: { title: '图谱看板' },
      },
      {
        path: 'classification',
        name: 'kind',
        component: () => import('@/views/knowledge/classification/index'),
        meta: { title: '分类维护' },
      },
      {
        path: 'node',
        name: 'basis',
        component: () => import('@/views/knowledge/node/index'),
        meta: { title: '基础节点' },
      },
      {
        path: 'disease',
        name: 'disease',
        component: () => import('@/views/knowledge/disease/index'),
        meta: { title: '疾病维护' },
      },
      {
        path: 'source',
        name: 'source',
        component: () => import('@/views/knowledge/origin/index'),
        meta: { title: '文献维护' },
      },
      {
        path: 'literature',
        name: 'literature',
        component: () => import('@/views/knowledge/literature/index'),
        meta: { title: '文献内容' },
      },
    ],
  },
  {
    path: '/thesaurus',
    redirect: '/thesaurus/minigNewWord',
    component: Layout,
    name: 'thesaurus ',
    meta: { title: '同义词库', icon: 'el-icon-collection', key: 'thesaurus' },
    children: [
      {
        path: 'classification',
        name: 'classification',
        component: () => import('@/views/thesaurus/minigNewWord/index'),
        meta: { title: '挖掘新词汇', key: 'thesaurus' },
      },
      {
        path: 'node',
        name: 'safeguard',
        component: () => import('@/views/thesaurus/thesaurusMaintenance/index'),
        meta: { title: '词库维护', key: 'thesaurus' },
      },
      {
        path: 'reflection',
        name: '术语库',
        component: () => import('@/views/thesaurus/reflection/index'),
        meta: { title: '术语库', key: 'thesaurus' },
      },
    ],
  },
  {
    path: '/quality',
    redirect: '/quality/rule',
    component: Layout,
    name: 'quality',
    alwaysShow: true,
    meta: { title: '内涵质控', icon: 'el-icon-collection', key: 'rule' },
    children: [
      {
        path: 'rule',
        name: 'rule',
        component: () => import('@/views/quality/rule/index'),
        meta: { title: '规则展示', key: 'rule' },
      },
      {
        path: 'department',
        name: 'department',
        component: () => import('@/views/quality/department/index'),
        meta: { title: '科室规范', key: 'department' },
      },
      {
        path: 'chapter',
        name: 'chapter',
        component: () => import('@/views/quality/chapter/index'),
        meta: { title: '病历章节', key: 'chapter' },
      },
      {
        path: 'exam',
        name: 'exam',
        component: () => import('@/views/quality/exam/index'),
        meta: { title: '质控测试', key: 'exam' },
      },
      // {
      //   path: 'make',
      //   name: 'make',
      //   component: () => import('@/views/quality/make/index'),
      //   meta: { title: '规则制定',key:'rule'}
      // },
    ],
  },
  {
    path: '/tagging',
    component: Layout,
    hidden: true,
    meta: { title: '标签', icon: 'form' },
    children: [
      {
        path: 'set',
        name: 'SetTagging',
        component: () => import('@/views/marktags/index'),
        meta: { title: '设置标签', icon: 'form' },
      },
    ],
  },
  { path: '*', redirect: '/404', hidden: true },
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
