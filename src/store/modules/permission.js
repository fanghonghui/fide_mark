import { asyncRouterMap, constantRouterMap } from '@/router/index'
import { http } from '@/utils/httpHelper'
import _ from 'underscore'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(menus, route) {
  if (route.meta && route.meta.code) {
    for (var i in menus) {
      if (menus[i] === route.meta.code) {
        return true
      }
    }
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, menus) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(menus, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, menus)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    menus: [],
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_MENUS: (state, menus) => {
      state.menus = menus
    },
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    // 获取菜单
    GetMenus({ commit }) {
      return new Promise((resolve, reject) => {
        http.post('getMenus', {}).then(res => {
          if (res) {
            var menus = res.data
            if (menus && menus.length != 0) {
              // 主管兼销售,显示主管菜单
              if (_.indexOf(menus, 'orgCustomerList') !== -1 && _.indexOf(menus, 'orgSaleCustomerList') !== -1) {
                menus = _.difference(menus, ['orgSaleCustomerList'])
              }
              if (_.indexOf(menus, 'approvalManage') !== -1 && _.indexOf(menus, 'orgApproval') !== -1) {
                menus = _.difference(menus, ['orgApproval'])
              }
            }
            commit('SET_MENUS', menus)
            resolve(menus)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        var menus = data.menus
        var accessedRouters = filterAsyncRouter(asyncRouterMap, menus)
        commit('SET_ROUTERS', accessedRouters)
        resolve(accessedRouters)
      }).catch(error => {
        reject(error)
      })
    },

    ClearMenus({ commit }) {
      commit('SET_MENUS', [])
    }
  }
}

export default permission
