exports.install = (Vue, options) => {
    // 获取静态文件下拉框数据
    Vue.prototype.getCodeList = (codeTypeName) => {
        return xdgc_assets.statelist.getCodeListToArray(codeTypeName)
    }
    Vue.prototype.getState = function () {
      return xdgc_assets.statelist.getStateList();
    }
    // 过滤空格
    Vue.prototype.filterParams = (data) => {
        for (var i in data) {
            if (data[i] && typeof data[i] == 'string') {
                data[i] = data[i].trim()
            }
        }
        return data
    }

   Vue.prototype.splitAmount = (amount, bit) => {
     amount = amount || 0
     amount *= 100
     amount += ''
     if (amount.indexOf('.') != -1) {
       amount = amount.split('.')[0]
     }
     var result = []
     for (var i = 0; i < bit; i++) {
       if (i < amount.length) {
         result.push(amount[amount.length - 1 - i])
       } else if (i == amount.length) {
         result.push('￥')
       } else {
         result.push('/')
       }
     }
     return result.reverse()
   }
}
