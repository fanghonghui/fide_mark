import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App'
import router from './router'
import store from './store'
import '@/icons' // icon
import '@/permission' // 权限
import Cookies from 'js-cookie'
import './filters'
import global from './utils/global'
import { http } from './utils/httpHelper'
import AMap from 'vue-amap'
import moment from 'moment'

Vue.use(ElementUI)
Vue.use(global)
Vue.use(AMap)

AMap.initAMapApiLoader({
  key: 'a9da8a6cceb49f311773a1ca181b26ab',
  plugin: ['Geolocation']
})

Vue.prototype.Cookies = Cookies
Vue.prototype.http = http
Vue.prototype.$moment = moment

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
