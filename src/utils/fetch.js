import axios from 'axios'
import { alertMsg } from '@/utils/util'
import { Loading } from 'element-ui'

// 创建axios实例
const service = axios.create({
  timeout: 50000    // 请求超时时间
})

var loadingInstance

// request拦截器
service.interceptors.request.use(config => {

  loadingInstance = Loading.service({ fullscreen: true })

  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug

  loadingInstance.close()

  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data

    if (res.respCode !== '100200') {
      if (res.respCode === '101604') {
        setTimeout(() => {
          location.href = '/'
        }, 1000)
      }

      var message = '[' + res.respCode + ']：' + res.respMsg

      alertMsg('warning', message)

      loadingInstance.close()

    } else {

      loadingInstance.close()

      return res
    }
  },
  error => {
    loadingInstance.close()

    alertMsg('warning', '请求失败，请重新尝试')

    return Promise.reject(error)
  }
)

export default service
