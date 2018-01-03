import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

/* layout */
import Layout from '../views/layout/Layout'

Vue.use(Router)

/**
 * icon : the icon show in the sidebar
 * hidden : if `hidden:true` will not show in the sidebar
 * redirect : if `redirect:noredirect` will not redirct in the levelbar
 * noDropdown : if `noDropdown:true` will not has submenu in the sidebar
 * meta : `{ role: ['admin'] }`  will control the page role
 **/
export const constantRouterMap = [
  {
    path: '/',
    component: _import('login/index'),
    name: 'login',
    hidden: true
  },
  {
    path: '/personalCenter',
    component: Layout,
    redirect: '/personalCenter/orgPersonalCenter',
    noDropdown: true,
    icon: 'yonghuming',
    children: [{ path: 'orgPersonalCenter', component: _import('personalCenter/orgPersonalCenter'), name: '个人中心' }]
  }
]

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/home',
    component: Layout,
    noDropdown: true,
    redirect: '/home/dataCenter',
    icon: 'tubiao',
    meta: { code: 'home' },
    children: [
      { path: 'dataCenter', component: _import('home/dataCenter'), name: '数据中心' }
    ]
  },
  {
    path: '/customerManage',
    component: Layout,
    noDropdown: true,
    icon: 'guanli',
    meta: { code: 'orgCustomerList' },  // 主管
    children: [
      { path: 'customer', component: _import('customerManage/customer'), name: '客户管理' }
    ]
  },
  {
    path: '/customerManage',
    component: Layout,
    noDropdown: true,
    icon: 'guanli',
    meta: { code: 'orgSaleCustomerList' }, // 销售
    children: [
      { path: 'marketCustomer', component: _import('customerManage/marketCustomer'), name: '客户管理' }
    ]
  },
  {
    path: '/productManage',
    component: Layout,
    noDropdown: true,
    icon: 'cpgl',
    meta: { code: 'loanProduct' },
    children: [
      { path: 'product', component: _import('productManage/product'), name: '产品管理' }
    ]
  },
  {
    path: '/approveManage',
    component: Layout,
    noDropdown: true,
    icon: 'spgl',
    meta: { code: 'approvalManage' }, // 主管
    children: [
      { path: 'directorApprove', component: _import('approveManage/directorApprove'), name: '审批管理' }
    ]
  },
  {
    path: '/approveManage',
    component: Layout,
    noDropdown: true,
    icon: 'spgl',
    meta: { code: 'orgApproval' }, // 销售经理
    children: [
      { path: 'salesManagerApprove', component: _import('approveManage/salesManagerApprove'), name: '审批管理' }
    ]
  },
  {
    path: '/postLoan',
    component: Layout,
    redirect: 'noredirect',
    name: '贷后管理',
    meta: { code: 'postLoanManage' },
    icon: 'dhgl',
    children: [
      {
        path: 'account',
        component: _import('layout/AppMain'),
        name: '贷后账务',
        meta: { code: 'postLoanAccount' },
        redirect: '/postLoan/account',
        children: [
          { path: '', component: _import('postLoan/account') },
          { path: 'accountDetail', component: _import('postLoan/accountDetail'), name: '贷款详情'}
        ]
      },
      { path: 'warning', component: _import('postLoan/warning'), name: '贷后预警', meta: { code: 'postLoanAlert' } }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: 'noredirect',
    noDropdown: true,
    meta: { code: 'permissionMenu' },
    icon: 'qxgl',
    children: [
      {
        path: 'roleManagement',
        component: _import('layout/AppMain'),
        redirect: '/permission/roleManagement',
        name: '权限管理',
        children: [
          { path: '', component: _import('permission/roleManagement') },
          { path: 'addPerson', component: _import('permission/addPerson'), name: '新增人员' }
        ]
      }
    ]
  }
]
