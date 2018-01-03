<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-row>
        <el-col :span="8">
          <ul class="detailUl">
            <li><strong>客户姓名:</strong><span class="leftMg">{{loanDetailInfo.userName}}</span></li>
            <li><strong>贷款申请日期:</strong><span class="leftMg">{{loanDetailInfo.applyTime | formatDate}}</span></li>
            <li><strong>余额:</strong><span class="leftMg">{{loanDetailInfo.remain.p | formatMoney}}元</span></li>
          </ul>
        </el-col>
        <el-col :span="8">
          <ul class="detailUl">
            <li><strong>身份证号码:</strong><span class="leftMg">{{loanDetailInfo.idNumber}}</span></li>
            <li><strong>终审通过日期:</strong><span class="leftMg">{{loanDetailInfo.approvedTime | formatDate}}</span></li>
            <li><strong>未还利息总额:</strong><span class="leftMg">{{loanDetailInfo.remain.i | formatMoney}}元</span></li>
          </ul>
        </el-col>
        <el-col :span="8">
          <ul class="detailUl">
            <li><strong>联系电话:</strong><span class="leftMg">{{loanDetailInfo.mobile}}</span></li>
            <li><strong>授信金额:</strong><span class="leftMg">{{loanDetailInfo.approvedAmount | formatMoney}}元</span></li>
            <li><strong>未还罚息总额:</strong><span class="leftMg">{{loanDetailInfo.remain.o | formatMoney}}元</span></li>
          </ul>
        </el-col>
      </el-row>
    </el-card>

    <el-tabs type="border-card" style="font-size: 14px;">
      <el-tab-pane label="借据借款">
        <!--随借随还-->
        <div v-if="loanDetailInfo.paybackWay === '1'">
          <el-table :data="loanDetailInfo.receipts" border style="width: 100%">
            <el-table-column prop="loanElecContractCode" label="借款合同号" width="200"></el-table-column>
            <el-table-column prop="loanReceiptCode" label="借据编号" width="300"></el-table-column>
            <el-table-column label="支用日期">
              <template scope="scope">
                {{ scope.row.loanStartDate | formatDate }}
              </template>
            </el-table-column>
            <el-table-column label="金额(元)">
              <template scope="scope">
                {{ scope.row.loanAmount | formatMoney }}
              </template>
            </el-table-column>
            <el-table-column label="单笔到期日期">
              <template scope="scope">
                {{ scope.row.loanEndDate | formatDate }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <el-row>
                  <el-col style="margin-top:5px;">
                    <el-button size="small" class="bt5" type="primary" @click="showReceiptLoan(scope.row)">查看借据</el-button>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--分期-->
        <div v-else style="color:#777777;" >
          <div class="tableTitle">
            <div style="margin-bottom: 10px;"><strong>借款借据（{{loanDetailInfo.productName}}）</strong></div>
            <div style="float: right">
              <span class="leftMg">{{loanDetailInfo.receipts[0].loanTime| formatDate}}</span>
              <span class="leftMg">借款合同号：{{loanDetailInfo.receipts[0].loanElecContractCode}}</span>
              <span class="leftMg">借款编号：{{loanDetailInfo.receipts[0].loanReceiptCode}}</span>
            </div>
          </div>
          <table  class="seeDetail"  border="0" cellspacing="0" cellpadding="0">
            <tr width="100%">
              <td width="15%" colspan="3"><strong>借款单位(人)</strong></td>
              <td width="35%" colspan="7">{{loanDetailInfo.receipts[0].lesseeUserName}}</td>
              <td width="15%" colspan="3"><strong>借款种类</strong></td>
              <td width="35%" colspan="7">{{loanDetailInfo.receipts[0].loanType | getCodeName('pay_way')}}</td>
            </tr>
            <tr>
              <td colspan="3"><strong>开户行名称</strong></td>
              <td colspan="7">{{loanDetailInfo.receipts[0].bankName}}</td>
              <td colspan="3"><strong>借款利率</strong></td>
              <td colspan="7">{{loanDetailInfo.interestRateType | getCodeName('pay_rateType')}}{{loanDetailInfo.interestRate}}&nbsp;%</td>
            </tr>
            <tr>
              <td colspan="3"><strong>收款人账号</strong></td>
              <td colspan="7">{{loanDetailInfo.receipts[0].lesseeUserCardNumber}}</td>
              <td colspan="3"><strong>借款用途</strong></td>
              <td colspan="7">{{loanDetailInfo.purpose}}</td>
            </tr>
            <tr>
              <td colspan="3" rowspan="2"><strong>借款金额（大写）</strong></td>
              <td colspan="7" rowspan="2">{{loanDetailInfo.receipts[0].loanAmount | toChineseAmount}}</td>
              <td><strong>千</strong></td>
              <td><strong>百</strong></td>
              <td><strong>十</strong></td>
              <td><strong>万</strong></td>
              <td><strong>千</strong></td>
              <td><strong>百</strong></td>
              <td><strong>十</strong></td>
              <td><strong>元</strong></td>
              <td><strong>角</strong></td>
              <td><strong>分</strong></td>
            </tr>

            <tr>
              <td v-for="item in (splitAmount(loanDetailInfo.receipts[0].loanAmount, 10))">{{item}}</td>
            </tr>

            <tr>
              <td colspan="3"><strong>借款日期</strong></td>
              <td colspan="17">自 {{loanDetailInfo.receipts[0].loanStartDate | formatDateCH}} 至 {{loanDetailInfo.receipts[0].loanEndDate | formatDateCH}}</td>
            </tr>
          </table>
          <el-button class="bt5 downLoadBtn" type="primary" @click="downloadReceipt(loanDetailInfo.receipts[0].loanReceiptUuid)">下载</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="还款记录">
        <div v-for="item in loanDetailInfo.receipts" style="margin-bottom:25px;">
          <div>
            <ul class="detailUl recordUl">
              <li><strong>借据编号:</strong><span class="leftMg">{{item.loanReceiptCode}}</span></li>
              <li><strong>支用日期:</strong><span class="leftMg">{{item.loanTime | formatDate}}</span></li>
              <li><strong>支用金额:</strong><span class="leftMg">{{item.loanAmount | formatMoney}}元</span></li>
              <li><strong>该借据余额:</strong><span class="leftMg">{{loanDetailInfo.remain.p | formatMoney}}元</span></li>
              <li><strong>该借据未还利息:</strong><span class="leftMg">{{loanDetailInfo.remain.i | formatMoney}}元</span></li>
              <li><strong>该借据未还罚息:</strong><span class="leftMg">{{loanDetailInfo.remain.o | formatMoney}}元</span></li>
            </ul>
            <div class="clearfix"></div>
          </div>

          <div class="subTitle"><strong>还款计划</strong></div>
          <el-table :data="item.paybacks" border style="width: 100%; margin-bottom: 20px;">
            <el-table-column label="计划还款日" width="200">
              <template scope="scope">
                {{ scope.row.planPaybackTime | formatDate }}
              </template>
            </el-table-column>
            <el-table-column label="计划还款总额(元)" width="200">
              <template scope="scope">
                {{ scope.row.paybackTotalAmount | formatMoney }}
              </template>
            </el-table-column>
            <el-table-column label="计划还款总额明细">
              <el-table-column label="本金(元)">
                <template scope="scope">
                  {{ scope.row.detailMap.PRINCIPAL | formatMoney }}
                </template>
              </el-table-column>
              <el-table-column label="利息(元)">
                <template scope="scope">
                  {{ scope.row.detailMap.INTEREST | formatMoney }}
                </template>
              </el-table-column>
              <el-table-column label="罚息(元)">
                <template scope="scope">
                  {{ scope.row.detailMap.OVERDUE_CHARGE | formatMoney }}
                </template>
              </el-table-column>
              <el-table-column label="手续费(元)">
                <template scope="scope">
                  {{ scope.row.factorage | formatMoney }}
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>

          <div class="subTitle"><strong>实际还款记录</strong></div>
          <el-table :data="item.waterLogs" border style="width: 100%;">
            <el-table-column label="还款日" width="200">
              <template scope="scope">
                {{ scope.row.paymentTime | formatDate }}
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="还款总额(元)" width="200">
              <template scope="scope">
                {{ scope.row.amount | formatMoney }}
              </template>
            </el-table-column>
            <el-table-column label="还款总额明细">
              <el-table-column label="本金(元)" width="200">
                <template scope="scope">
                  {{ scope.row.subject.PRINCIPAL | formatMoney }}
                </template>
              </el-table-column>
              <el-table-column label="利息(元)" width="200">
                <template scope="scope">
                  {{ scope.row.subject.INTEREST | formatMoney }}
                </template>
              </el-table-column>
              <el-table-column label="罚息(元)" width="200">
                <template scope="scope">
                  {{ scope.row.subject.OVERDUE_CHARGE | formatMoney }}
                </template>
              </el-table-column>
              <el-table-column label="手续费(元)" width="200">
                <template scope="scope">
                  {{ scope.row.subject.changeSum | formatMoney }}
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column prop="op" label="类型"></el-table-column>
            <el-table-column label="支/还方式">
              <template scope="scope">
                {{ scope.row.paymentType | getCodeName('pay_operType') }}
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template scope="scope">
                {{ scope.row.result | getCodeName('pay_result') }}
              </template>
            </el-table-column>
            <el-table-column prop="" label="备注"></el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!--查看详情-->
    <el-dialog title="" :visible.sync="showLoan">
      <div class="panel-overview">
        <div class="tableTitle">
          <h3 style="margin-bottom: 10px;">借款借据({{loanDetailInfo.productName}})</h3>
          <div style="float: right">
            <span class="leftMg">{{subReceiptLoan.loanTime| formatDate}}</span>
            <span class="leftMg">借款合同号：{{subReceiptLoan.loanElecContractCode}}</span>
            <span class="leftMg">借款编号：{{subReceiptLoan.loanReceiptCode}}</span>
          </div>
        </div>
        <table  class="seeDetail"  border="0" cellspacing="0" cellpadding="0">
          <tr width="100%">
            <td width="15%" colspan="3">借款单位(人)</td>
            <td width="35%" colspan="7">{{subReceiptLoan.lesseeUserName}}</td>
            <td width="15%" colspan="3">借款种类</td>
            <td width="35%" colspan="7">{{subReceiptLoan.loanType | getCodeName('pay_way')}}</td>
          </tr>
          <tr>
            <td colspan="3">开户行名称</td>
            <td colspan="7">{{subReceiptLoan.bankName}}</td>
            <td colspan="3">借款利率</td>
            <td colspan="7">{{loanDetailInfo.interestRateType | getCodeName('pay_rateType')}}{{loanDetailInfo.interestRate}}&nbsp;%</td>
          </tr>
          <tr>
            <td colspan="3">收款人账号</td>
            <td colspan="7">{{subReceiptLoan.lesseeUserCardNumber}}</td>
            <td colspan="3">借款用途</td>
            <td colspan="7">{{loanDetailInfo.purpose}}</td>
          </tr>
          <tr>
            <td colspan="3" rowspan="2">借款金额（大写）</td>
            <td colspan="7" rowspan="2">{{subReceiptLoan.loanAmount | toChineseAmount}}</td>
            <td>千</td>
            <td>百</td>
            <td>十</td>
            <td>万</td>
            <td>千</td>
            <td>百</td>
            <td>十</td>
            <td>元</td>
            <td>角</td>
            <td>分</td>
          </tr>

          <tr>
            <td v-for="item in (splitAmount(subReceiptLoan.loanAmount, 10))">{{item}}</td>
          </tr>

          <tr>
            <td colspan="3">借款日期</td>
            <td colspan="17">  自 {{subReceiptLoan.loanStartDate | formatDateCH}} 至 {{subReceiptLoan.loanEndDate | formatDateCH}}</td>
          </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showLoan = false">取 消</el-button>
        <el-button type="primary" @click="downloadReceipt(subReceiptLoan.loanReceiptUuid)">下 载</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import _ from 'underscore'
  export default {
    data() {
      return {
        loanDetailInfo: {
          remain: {
            p: 0,
            i: 0,
            o: 0
          },
          receipts: [{
          }]
        },
        recepitInfo: {},
        subReceiptLoan: {},
        loanReceiptUuid: '',
        showLoan: false,
        replacePay: false
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      // 获取页面渲染数据
      fetchData() {
        var params = {
          loanAppUuid: this.Cookies.get('loanAppUuid')
        }
        this.http.post('loanCustomerDetail', params).then(res => {
          if (res&&res.data) {
            var data = res.data
            if (data.receipts) {
              data.remain = {
                p: 0,
                i: 0,
                o: 0
              }
              data.receipts = _.sortBy(data.receipts, 'loanTime')
              data.receipts.forEach(function(r) {
                var _remain = {
                  p: 0,
                  i: 0,
                  o: 0
                }
                r.paybacks = _.sortBy(r.paybacks, 'planPaybackTime')
                r.paybacks.forEach(function(p) {
                  p.detailMap = {}
                  p.details.forEach(function(d) {
                    p.detailMap[d.paybackSubject] = d.paybackAmount
                    switch (d.paybackSubject) {
                      case 'PRINCIPAL':
                        _remain.p += d.paybackAmount
                        break
                      case 'INTEREST':
                        _remain.i += d.paybackAmount
                        break
                      case 'OVERDUE_CHARGE':
                        _remain.o += d.paybackAmount
                        break
                    }
                  })
                })

                r.waterLogs.forEach(function(w) {
                  w.subject = JSON.parse(w.subject)
                  var _changeSum = 0
                  var _keys = Object.keys(w.subject)
                  _keys.forEach(function(k) {
                    switch (k) {
                      case 'PAYBACK_CHARGE':
                      case 'INTEREST_CHARGE':
                      case 'DRAWDOWN_CHARGE':
                        _changeSum += w.subject[k]
                        break
                      case 'PRINCIPAL':
                        if (w.paymentType !== 'DRAWDOWN' && w.result === 'SUCCESS') {
                          _remain.p -= w.subject[k]
                        }
                        break
                      case 'INTEREST':
                        if (w.paymentType !== 'DRAWDOWN' && w.result === 'SUCCESS') {
                          _remain.i -= w.subject[k]
                        }
                        break
                      case 'OVERDUE_CHARGE':
                        if (w.paymentType !== 'DRAWDOWN' && w.result === 'SUCCESS') {
                          _remain.o -= w.subject[k]
                        }
                        break
                    }
                  })
                  w.op = []
                  if (_keys.indexOf('PRINCIPAL') !== -1) {
                    w.op.push('本金')
                  }
                  if (_keys.indexOf('INTEREST') !== -1) {
                    w.op.push('利息')
                  }
                  if (_keys.indexOf('OVERDUE_CHARGE') !== -1) {
                    w.op.push('罚息')
                  }
                  w.op = w.op.join('、')
                  w.subject.changeSum = _changeSum
                })
                r.remain = _remain
                data.remain.p += _remain.p
                data.remain.i += _remain.i
                data.remain.o += _remain.o
              })
              this.loanReceiptUuid = data.receipts[0].loanReceiptUuid
            }
            this.loanDetailInfo = data
          }
        })
      },
      // 查看借据
      showReceiptLoan(row) {
        this.subReceiptLoan = row
        this.showLoan = true
      },
      // 下载借据
      downloadReceipt(data) {
        this.http.get('downloadReceipt', { loanReceiptUuid: data }).then(res => {
          if (res) {
            window.location.href = res.data;
          }
        })
      }
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss">
  @import "src/styles/mixin.scss";
  .app-container {
  .box-card {
    margin-bottom: 20px;
  }
  .detailUl li{
    list-style: none;
    color:#777777;
    line-height:25px;
    font-size:14px;
  }
  .recordUl li {
    float: left;
    margin-right:30px;
  }
  .subTitle{
    color:#777777;
    line-height:25px;
    font-size:14px;
  }
  .contentStyle ul li{
    list-style: none;
    height:120px;
    line-height:120px;
    padding-left:10px;
  }
  .innerContentList ul li {
    list-style: none;
    height:30px;
    line-height:30px;
    padding-left:35px;
    margin-top:10px;
  }
  .tableTitle{
    text-align: center;
    margin-bottom:30px;
  }
  .seeDetail{
    text-align: center;
    width:100%;
    border-right:1px solid #ddd;
    border-bottom:1px solid #ddd;
  }
  .downLoadBtn{
    float:right;
    margin-top:20px;
  }
  .seeDetail td{
    height:35px;
    height:35px;
    line-height:35px;
    border-left:1px solid #ddd;
    border-top:1px solid #ddd;
  }
  .leftMg{
    margin-left:10px;
  }
  }
</style>
