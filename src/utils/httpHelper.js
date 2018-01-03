import fetch from '@/utils/fetch'
import { baseURI } from '@/config/env'
import { SERVER, FIDE_API_URL, ORGCODE } from '@/config/settings'
import CryptoJS from 'crypto-js'
import { getToken, alertMsg } from '@/utils/util'
import axios from 'axios'
var qs = require('qs')

const parseUrl = (apiType) => {
  return baseURI + CryptoJS.AES.encrypt(SERVER + FIDE_API_URL[apiType]['url'], 'fide')
}

const parseParams = (params) => {
  var AesData = CryptoJS.AES.encrypt(JSON.stringify(params), 'fide')
  var base64Data = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(AesData.toString()))

  return qs.stringify({
    cdata: base64Data
  })
}

var http = {}

// 登录
http.doLogin = (apiType, params) => {
  params.orgCode = ORGCODE

  var data = parseParams(params)

  return fetch({
    url: parseUrl(apiType),
    method: 'post',
    data
  })
}

// post请求
http.post = (apiType, params) => {
  params.orgCode = ORGCODE
  params.token = getToken()

  return fetch({
    url: parseUrl(apiType),
    method: 'post',
    data: parseParams(params)
  })
}

// get请求
http.get = (apiType, params) => {
  params.orgCode = ORGCODE
  params.token = getToken()

  return fetch({
    url: parseUrl(apiType),
    method: 'get',
    params
  })
}

// 无加载post请求(主要用于请求下拉框接口等)
http.smallPost = (apiType, params) => {
  params.orgCode = ORGCODE
  params.token = getToken()

  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: parseUrl(apiType),
      data: parseParams(params)
    }).then((response) => {
      var res = response.data
      if (res.respCode !== '100200') {
        if (res.respCode === '101604') {
          setTimeout(() => {
            location.href = '/'
          }, 1000)
        }
        var message = '[' + res.respCode + ']：' + res.respMsg
        alertMsg('warning', message)
      } else {
        resolve(res)
      }
    }).catch((error) => {
      alertMsg('warning', '请求失败，请重新尝试')
      reject(error)
    })
  })
}

// 无加载get请求(主要用于请求下拉框接口等)
http.smallGet = (apiType, params) => {
  params.orgCode = ORGCODE
  params.token = getToken()

  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: parseUrl(apiType),
      params
    }).then((response) => {
      var res = response.data
      if (res.respCode !== '100200') {
        if (res.respCode === '101604') {
          setTimeout(() => {
            location.href = '/'
          }, 1000)
        }
        var message = '[' + res.respCode + ']：' + res.respMsg
        alertMsg('warning', message)
      } else {
        resolve(res)
      }
    }).catch((error) => {
      alertMsg('warning', '请求失败，请重新尝试')
      reject(error)
    })
  })
}

export {
  http
}


