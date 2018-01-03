/**
 * Created by asto on 2017/8/23.
 */
/**
 * 配置编译环境和线上环境之间的切换
 */

var baseURI = ''
console.log('process.env.NODE_ENV  ' + process.env.NODE_ENV)

switch (process.env.NODE_ENV) {
  case 'development':
    baseURI = 'https://fidebszltest.yuanbaopu.com/api/'
    break
  case 'testing':
    baseURI = 'https://fidebszltest.yuanbaopu.com/api/'
    break
  default:
    baseURI = 'https://fidebsz.yuanbaopu.com/api/'
}
export {
  baseURI
}
