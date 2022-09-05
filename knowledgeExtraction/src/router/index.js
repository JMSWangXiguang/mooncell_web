import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

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
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },
  {
    path: "/userLogon",
    // name: 'userLogon',
    hidden: true,
    component: () => import("@/views/userSystem/userLogon/index"),
  },
  {
    path: "/auth-redirect",
    component: () => import("@/views/login/auth-redirect"),
    hidden: true,
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "首页", icon: "el-icon-s-home" },
      },
    ],
  },
];

export const asyncRoutes = [
  {
    path: "/literatureEntry",
    component: Layout,
    meta: {
      title: "文献管理",
      icon: "el-icon-price-tag",
      roles: ["inference"],
    },
    children: [
      {
        path: "literatureManagement",
        name: "literatureManagement",
        component: () =>
          import("@/views/literatureEntry/literatureManagement/index"),
        meta: { title: "文献管理", roles: ["inference"] },
      },
      {
        path: "catalogEdit",
        name: "catalogEdit",
        component: () =>
          import("@/views/literatureEntry/literatureManagement/catalog-edit"),
        hidden: true,
        meta: { title: "目录编辑", roles: ["inference"] },
      },
      {
        path: "pageEdit",
        name: "pageEdit",
        component: () =>
          import("@/views/literatureEntry/literatureManagement/page-edit"),
        hidden: true,
        meta: { title: "页码编辑", roles: ["inference"] },
      },
      // {
      //   path: "task",
      //   name: "task",
      //   component: () => import("@/views/literatureEntry/task/index"),
      //   meta: { title: "待处理任务", roles: ["unable"] },
      // },
    ],
  },
  {
    path: "/userSystem",
    redirect: "/userSystem/management",
    component: Layout,
    name: "quality",
    meta: { title: "用户管理", icon: "el-icon-collection", roles: ["user"] },
    children: [
      {
        path: "management",
        name: "management",
        component: () => import("@/views/userSystem/management/index"),
        meta: { title: "用户列表", roles: ["user_list"] },
      },
      // {
      //   path: "application",
      //   name: "application",
      //   hidden: true,
      //   component: () => import("@/views/userSystem/application/index"),
      //   meta: { title: "申请待处理", roles: ["manage"] },
      // },
      {
        path: "userAuthority",
        name: "userAuthority",
        hidden: true,
        component: () => import("@/views/userSystem/userAuthority/index"),
        meta: { title: "用户权限", roles: ["user_role"] },
      },
      {
        path: "authority",
        name: "authority",
        component: () => import("@/views/userSystem/authority/index"),
        meta: { title: "用户权限", roles: ["user_role"] },
      },
      // {
      //   path: "organizational",
      //   name: "organizational",
      //   hidden: true,
      //   component: () => import("@/views/userSystem/organizational/index"),
      //   meta: { title: "机构管理", roles: ["thesaurus"] },
      // },
      {
        path: "group",
        name: "group",
        component: () => import("@/views/userSystem/group/index"),
        meta: { title: "用户组管理", roles: ["user_team"] },
      },
      // {
      //   path: 'userLog',
      //   name: 'userLog',
      //   component: () => import('@/views/userSystem/userLog/index'),
      //   meta: { title: '用户日志',roles: ['thesaurus']}
      // },
    ],
  },
  {
    path: "/literatureTask",
    redirect: "/literatureTask/automaticEntry",
    component: Layout,
    meta: {
      title: "任务管理",
      icon: "el-icon-notebook-2",
      roles: ["task"],
    },
    children: [
      {
        path: "approval",
        name: "approval",
        component: () => import("@/views/operate/approval/index"),
        meta: { title: "申请任务", roles: ["task_apply"] },
      },
      {
        path: "automaticEntry",
        name: "automaticEntry",
        component: () => import("@/views/literatureEntry/automaticEntry/index"),
        meta: { title: "文献任务", roles: ["task_literature"] },
      },
      {
        path: "reflect",
        name: "reflect",
        meta: { title: "术语映射", roles: ["task_term"] },
      },
      // {
      //   path: "process",
      //   name: "process",
      //   hidden: true,
      //   component: () => import("@/views/literatureEntry/content/process"),
      //   meta: { title: "流程", roles: ["document"] },
      // },
      {
        path: "content",
        name: "content",
        hidden: true,
        component: () => import("@/views/literatureEntry/content/content"),
        meta: { title: "任务分配", roles: ["task_literature"] },
      },
      // {
      //   path: "manualEntry",
      //   name: "manualEntry",
      //   hidden: true,
      //   component: () => import("@/views/literatureEntry/manualEntry/index"),
      //   meta: { title: "人工录入", roles: ["document"] },
      // },
    ],
  },
  {
    path: "/operate",
    redirect: "/operate/automaticEntry",
    component: Layout,
    name: "operate",
    meta: { title: "申请管理", icon: "el-icon-s-check", roles: ["self_apply"] },
    children: [
      {
        path: "apply",
        name: "apply",
        component: () => import("@/views/operate/apply/index"),
        meta: { title: "我的申请", roles: ["self_apply"] },
      },
    ],
  },
  {
    path: "/myTask",
    redirect: "/operate/automaticEntry",
    component: Layout,
    name: "myTask",
    meta: { title: "我的任务", icon: "el-icon-s-order", roles: ["self_task"] },
    children: [
      {
        path: "audit",
        name: "audit",
        component: () => import("@/views/myTask/approval/index"),
        meta: { title: "申请审核任务", roles: ["self_apply_audit"] },
      },
      {
        path: "litCheck",
        name: "litCheck",
        component: () => import("@/views/myTask/automaticEntry/index"),
        meta: { title: "文献审核任务", roles: ["self_literature_audit"] },
      },
      {
        path: "info",
        name: "info",
        hidden: true,
        component: () => import("@/views/literatureEntry/content/info"),
        meta: { title: "校验", roles: ["self_literature_audit"] },
      },
      {
        path: "checkInfo",
        name: "checkInfo",
        hidden: true,
        component: () => import("@/views/literatureEntry/content/check-info"),
        meta: { title: "审核", roles: ["self_literature_audit"] },
      },
    ],
  },
  {
    path: "/code",
    name: "code",
    redirect: "/code/code",
    component: Layout,
    meta: {
      title: "字典表维护",
      icon: "el-icon-notebook-2",
      roles: ["dictionary"],
    },
    children: [
      {
        path: "code",
        name: "code",
        component: () => import("@/views/operate/code/index"),
        meta: { title: "字典表维护", roles: ["dictionary"] },
      },
    ],
  },
  { path: "*", redirect: "/404", hidden: true },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
