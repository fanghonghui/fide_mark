import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { getToken, removeToken } from '@/utils/util' // 验权

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/') {
      removeToken()
      next()
    } else {
      if (store.getters.menus && store.getters.menus.length === 0) {
        store.dispatch('GetMenus').then(menus => {
          store.dispatch('GenerateRoutes', { menus }).then((res) => {
            router.addRoutes(res)
            var to_name = to.path.split(/\//)[1]
            var isAccess = false

            if (to_name == 'personalCenter') {
              isAccess = true
            }

            res.map((value) => {
              var access_name = value.path.split('/')[1]
              if (access_name === to_name) {
                isAccess = true
              }
            })

            if (isAccess) {
              next({ ...to })
            } else {
              next('/')
            }
          })
        }).catch(() => {
          next('/')
        })
      }
      next()
    }
  } else {
    NProgress.done()
    if (to.path !== '/') {
      next('/')
    } else {
      next()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
