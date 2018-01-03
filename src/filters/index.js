import moment from 'moment'
import Vue from 'vue'

Vue.filter('formatDate', (date) => {
  return moment(date).format('YYYY-MM-DD')
})

Vue.filter('format', (date) => {
  if (date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss')
  }
})

Vue.filter('formatDateCH', (date) => {
  return moment(date).format('YYYY年MM月DD日')
})

Vue.filter('getCodeName', (codeValue, codeTypeName) => {
  var _data = xdgc_assets.statelist.getCodeList(codeTypeName)
  return _data && _data[codeValue] ? _data[codeValue] : ''
})

Vue.filter('toChineseAmount', (money) => {
  var cnNums = new Array("零","壹","贰","叁","肆","伍","陆","柒","捌","玖"); //汉字的数字
  var cnIntRadice = new Array("","拾","佰","仟"); //基本单位
  var cnIntUnits = new Array("","万","亿","兆"); //对应整数部分扩展单位
  var cnDecUnits = new Array("角","分","毫","厘"); //对应小数部分单位
  var cnInteger = "整"; //整数金额时后面跟的字符
  var cnIntLast = "元"; //整型完以后的单位
  var maxNum = 999999999999999.9999; //最大处理的数字
  var IntegerNum; // 金额整数部分
  var DecimalNum; // 金额小数部分
  var ChineseStr = '' // 输出的中文金额字符串
  var parts // 分离金额后用的数组，预定义
  if (money == ''){
    return ''
  }
  money = parseFloat(money)
  if( money >= maxNum ){
    return ''
  }
  if( money == 0 ){
    ChineseStr = cnNums[0]+cnIntLast+cnInteger
    return ChineseStr
  }
  money = money.toString() //转换为字符串
  if( money.indexOf(".") == -1 ){
    IntegerNum = money
    DecimalNum = ''
  }else{
    parts = money.split(".")
    IntegerNum = parts[0]
    DecimalNum = parts[1].substr(0,4)
  }
  if (parseInt(IntegerNum, 10) > 0){ // 获取整型部分转换
    var zeroCount = 0;
    var IntLen = IntegerNum.length
    for (var i = 0 ; i < IntLen; i++) {
      var n = IntegerNum.substr(i, 1)
      var p = IntLen - i - 1
      var q = p / 4
      var m = p % 4
      if (n === '0') {
        zeroCount++
      } else {
        if (zeroCount > 0) {
          ChineseStr += cnNums[0]
        }
        zeroCount = 0 // 归零
        ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
      }
      if (m === 0 && zeroCount < 4) {
        ChineseStr += cnIntUnits[q]
      }
    }
    ChineseStr += cnIntLast;
    // 整型部分处理完毕
  }
  if (DecimalNum !== '') { // 小数部分
    var decLen = DecimalNum.length
    for (i = 0; i < decLen; i++) {
      n = DecimalNum.substr(i, 1)
      if (n !== '0') {
        ChineseStr += cnNums[Number(n)] + cnDecUnits[i]
      }
    }
    ChineseStr = ChineseStr + cnInteger
  }
  if (ChineseStr === '') {
    ChineseStr += cnNums[0] + cnIntLast + cnInteger
  } else if (DecimalNum === '') {
    ChineseStr += cnInteger
  }
  return ChineseStr
})

// 元转换成万
Vue.filter('toTenThousand', (money) => {
  var money = new Number(money) || 0
  return money / 10000
})

// 货币格式化
Vue.filter('formatMoney', (num) => {
    if (num) {
      num = num.toString().replace(/\$|\,/g, '')
      if (isNaN(num)) {
        num = '0'
      }
      var sign = (num == (num = Math.abs(num)))
      num = Math.floor(num * 100 + 0.50000000001)
      var cents = num % 100
      var centStr
      num = Math.floor(num / 100).toString()
      if (cents < 10) {
        centStr = '0' + cents
      } else {
        centStr = cents
      }
      for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
        num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3))
      }

      return (((sign) ? '' : '-') + num + '.' + centStr)
    } else {
      return '0.00'
    }
})

Vue.filter('getCityNameByCode',(code)=> {
  var prov = common_assets.cities.getProvinceNameByCode(code);
  if(prov){
    return prov;
  }else{
    var proCode = code.substring(0,2) + "0000";
    var city = common_assets.cities.getCityNameByCodeFull(proCode,code);
    if(city){
      return city;
    }
  }
})

