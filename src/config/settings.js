export const ORGCODE = '100000'

export const SERVER = 'fideMarkServer'

// 请求的地址
export const FIDE_API_URL = {
  // 登录
  'login': {
    'url': '/manager/login'
  },
  // 获取菜单
  'getMenus': {
    'url': '/manager/queryPermission'
  },
  // 销售下拉框数据
  'queryAllSeller': {
    'url': '/org/queryAllSeller'
  },
  // 机构产品
  'productOrg': {
    'url': '/org/rootOrgList'
  },
  // 客户管理
  'customerManage': {
    'url': '/org/queryCustomerPage'
  },
  // 个人中心
  'mycenter': { // 信息查询
    'url': '/manager/queryInfo'
  },
  'getSign': {// sign
    'url': '/user/getSign'
  },
  'imgSave': {// 保存图片
    'url': '/manager/updateManagerPic'
  },
  'myNewPhone': { // 新手机号
    'url': '/manager/updateInfo'
  },
  'modfiyPass': { // 修改密码
    'url': '/manager/changePassword'
  },
  // 数据中心
  'datacenter': { // 注册数据
    'url': '/statistics/registerData'
  },
  'datacenterOrg': { // 机构数据
    'url': '/statistics/orgData'
  },
  // 产品管理
  'product': { // 元宝铺子
    'url': '/markProduct/bankMarkProductList'
  },
  'productSoldOut': { // 下架
    'url': '/markProduct/unPublishMarkProduct'
  },
  'historyRecord': {// 历史记录
    'url': '/markProduct/queryOperLogList'
  },
  'sortProduct': { // 排序
    'url': '/markProduct/sortProduct'
  },
  'productOrgList': { // 机构产品列表
    'url': '/markProduct/orgProductList'
  },
  'productOrgPush': { // 推送
    'url': '/markProduct/pushToMarkProduct'
  },
  'productOrgPull': { // 撤回
    'url': '/markProduct/pullToOrgProduct'
  },
  'productOrgDetail': { // 产品详情
    'url': '/markProduct/productDetail'
  },
  'productOrgAccess': { // 准入
    'url': '/markProduct/productAccess'
  },
  // 审批管理
  'statisticData': { // 数据统计
    'url': '/statistics/applyList'
  },
  'approvalData': { // 主管列表查询
    'url': '/loan/queryApplys'
  },
  'saleApprovalData': { // 销售列表查询
    'url': '/loan/querySaleApplys'
  },
  'turnPushDetails': { // 列表转推详情查询
    'url': '/loan/queryMarkApplys'
  },
  'turnPush': { // 转推
    'url': '/loan/trunPushOrgList'
  },
  'confirmTurnPush': { // 确认转推
    'url': '/loan/trunPushLoan'
  },
  'confirmDistribute': { // 确认分配
    'url': '/loan/distributeSaleManager'
  },
  'recordData': { // 审批记录
    'url': '/loan/queryAuditLogList'
  },
  // 贷后管理
  'loanPrdList': { // 产品的下拉框获取
    'url': '/loan/queryAllProduct'
  },
  'loanWarnList': { // 列表查询
    'url': '/loan/queryLoanAlertPage'
  },
  'seeWarnDetail': { // 预警详情信息查询
    'url': '/loan/queryAccountAlerts'
  },
  'accountList': { // 贷后账务列表查询
    'url': '/loan/queryOrgApprovedList'
  },
  'contractList': { // 合同列表查询
    'url': '/elecContract/queryContractList'
  },
  'loanCustomerDetail': { // 贷后详情信息查询
    'url': '/loan/queryLoanDetail'
  },
  'downloadReceipt': { // 合同列表查询
    'url': '/loan/exportReceiptPdf'
  },
  // 权限管理
  'rolesOptions': {
    'url': '/manager/queryAllRole'
  },
  'permissionList': { // 列表查询
    'url': '/manager/queryManagerPage'
  },
  'resetManagerPassword': { // 恢复默认密码
    'url': '/manager/resetManagerPassword'
  },
  'updateManager': { // 编辑保存
    'url': '/manager/updateManager'
  },
  'deleteManager': { // 删除
    'url': '/manager/deleteManager'
  },
  'addPerson': { // 新增人员
    'url': '/manager/createManager'
  }
}
