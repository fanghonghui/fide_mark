<template>
  <div class="app-container">
    <el-card class="box-card search-box">
      <el-form :inline="true" :model="formData" class="demo-form-inline">
        <el-form-item>
          <div class="sub-title">客户姓名</div>
          <el-input size="small" v-model="formData.userName"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="sub-title">当前状态</div>
          <el-select size="small" clearable v-model="formData.applyStatus" placeholder="全部">
            <el-option v-for="item in applyStatusOptions" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="sub-title">产品</div>
          <el-select size="small" clearable v-model="formData.productUuid" placeholder="全部">
            <el-option v-for="item in productOptions" :key="item.productUuid" :label="item.productName" :value="item.productUuid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="sub-title">核身状态</div>
          <el-select size="small" clearable v-model="formData.identityVerified" placeholder="全部">
            <el-option v-for="item in identityOptions" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="sub-title">申请时间(起)</div>
          <el-date-picker size="small" v-model="formData.startTime" type="date">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <div class="sub-title">申请时间(止)</div>
          <el-date-picker size="small" v-model="formData.endTime" type="date">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <div class="sub-title">机构</div>
          <el-select size="small" clearable v-model="formData.orgUuid" filterable placeholder="全部" style="width: 240px;">
            <el-option v-for="item in orgOptions" :key="item.orgUuid" :label="item.orgName" :value="item.orgUuid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="search-btn-style" size="small" type="primary" icon="search" @click="searchData">检 索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div class="data-total">
        <span class="pdr25">审批结束：{{totalData.finishCount}}笔</span>
        <span class="pdr25">终审通过(含后续状态)：{{totalData.finshPass}}笔</span>
      </div>
      <el-table :data="tableData" @expand="expandDetails" :row-class-name="getRowClass" border style="width: 100%">
        <el-table-column label="申请时间" width="95">
          <template scope="scope">
            {{scope.row.createTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column type="expand" width="15">
          <template scope="scope">
            <el-table :data="scope.row.turnPushOrgs" class="hide-expand" :row-class-name="tableRowClassName" border style="width: 100%">
              <el-table-column width="95">
                <template scope="scope">
                  {{scope.row.createTime | formatDate}}
                </template>
              </el-table-column>
              <el-table-column type="expand" width="15"></el-table-column>
              <el-table-column width="120">
                <template scope="scope">
                  {{scope.row.userName}}<br>({{scope.row.userMobile}})
                </template>
              </el-table-column>
              <el-table-column width="91">
                <template scope="scope">
                  {{scope.row.identityVerified | getCodeName('identityVerified')}}
                </template>
              </el-table-column>
              <el-table-column prop="productName"></el-table-column>
              <el-table-column prop="orgName"></el-table-column>
              <el-table-column prop="applyAmount" width="105">
                <template scope="scope">
                  {{scope.row.applyAmount | formatMoney}}
                </template>
              </el-table-column>
              <el-table-column prop="evaluateAmount">
                <template scope="scope">
                  <span v-if="scope.row.evaluateAmount">{{scope.row.evaluateAmount | formatMoney}}</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column prop="approvedAmount" width="105">
                <template scope="scope">
                  {{scope.row.approvedAmount | formatMoney}}
                </template>
              </el-table-column>
              <el-table-column width="91">
                <template scope="scope">
                  {{scope.row.applyStatus | getCodeName('loanStatus')}}
                </template>
              </el-table-column>
              <el-table-column>
                <template scope="scope">
                  <el-row>
                    <el-col style="margin-top:5px;">
                      <el-button size="small" class="mb5" type="primary" @click="checkRecord(scope.row, scope.$index)">审批记录</el-button>
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="客户姓名" width="120">
          <template scope="scope">
            {{scope.row.userName}}<br>({{scope.row.userMobile}})
          </template>
        </el-table-column>
        <el-table-column label="核身" width="91">
          <template scope="scope">
            {{scope.row.identityVerified | getCodeName('identityVerified')}}
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="产品"></el-table-column>
        <el-table-column prop="orgName" label="机构"></el-table-column>
        <el-table-column prop="applyAmount" label="申请额度(元)" width="105">
          <template scope="scope">
            {{scope.row.applyAmount | formatMoney}}
          </template>
        </el-table-column>
        <el-table-column prop="evaluateAmount" label="预授信额度(元)">
          <template scope="scope">
            <span v-if="scope.row.evaluateAmount">{{scope.row.evaluateAmount | formatMoney}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="approvedAmount" label="审批额度(元)" width="105">
          <template scope="scope">
            {{scope.row.approvedAmount | formatMoney}}
          </template>
        </el-table-column>
        <el-table-column label="当前状态" width="91">
          <template scope="scope">
            {{scope.row.applyStatus | getCodeName('loanStatus')}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-row>
              <el-col style="margin-top:5px;">
                <el-button size="small" class="mb5" type="primary" @click="doTurnPush(scope.row)" :disabled="scope.row.isRetweeted != 0 || (scope.row.applyStatus !='FIRST_TRIAL_REJECT' && scope.row.applyStatus !='FINAL_JUDGMENT_REJECT' && scope.row.applyStatus !='MERCHANT_APPLY_REJECT')">转推</el-button>
                <el-button size="small" class="mb5" type="primary" @click="checkRecord(scope.row, scope.$index)">审批记录</el-button>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize"
        layout="total, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </el-card>

    <!--转推-->
    <el-dialog title="转推" :visible.sync="turnPush" class="turnPush">
      <table class="table">
        <thead>
          <tr>
            <th class="w50" style="padding: 0 19px;"></th>
            <th>可转推机构</th>
            <th>产品</th>
            <th>额度</th>
            <th>利率</th>
            <th>还款方式</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item of turnPushData">
            <td colspan="7">
              <table class="inner-table">
                <tbody>
                  <tr>
                    <td class="w50">
                      <el-radio class="radio" v-model="selectedPro" :key="item.id" :label="item.uuidStr" :disabled="item.accessResult != 1"></el-radio>
                    </td>
                    <td>{{item.orgName}}</td>
                    <td>{{item.productName}}</td>
                    <td>{{item.downApprovedAmount | toTenThousand | formatMoney }}--{{item.upperApprovedAmount | toTenThousand
                      | formatMoney}}万
                    </td>
                    <td>{{item.rate}}{{item.downRate}}{{item.rateUnit}}-{{item.upperRate}}{{item.rateUnit}}</td>
                    <td>{{item.paybackWay}}</td>
                    <td>{{item.accessResult | getCodeName('accessResult')}}</td>
                  </tr>
                  <tr :hidden="selectedPro.loanDataUuid != item.loanDataUuid">
                    <td colspan="7" class="org-list">
                      <div class="org-item mt10" v-for="org of item.pushOrg" :key="org.id">
                        <el-radio v-model="selectedOrg" class="radio" :value="org.pushOrgUuid" :label="org.pushOrgUuid">
                          {{org.pushOrgName}}
                          <span class="location-icon" v-if="org.pushOrglnglat" @click.prevent="lookMap(org)"><icon-svg icon-class="location"/></span>
                          <div class="address">{{org.pushOrgLoc}}</div>
                        </el-radio>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="turnPush = false">取 消</el-button>
        <el-button type="primary" @click.native="confirmTurnPush">确 定</el-button>
      </span>
    </el-dialog>

    <!--定位-->
    <el-dialog :visible.sync="mapLocation">
      <mapLocation :position="position" class="amap-wrapper"></mapLocation>
    </el-dialog>

    <!--审批记录-->
    <el-dialog title="审批记录" :visible.sync="approvalRecord">
      <el-table border :data="recordData" style="width: 100%">
        <el-table-column label="操作时间" width="150">
          <template scope="scope">
            {{scope.row.auditTime | format}}
          </template>
        </el-table-column>
        <el-table-column property="auditor" label="操作人员"></el-table-column>
        <el-table-column property="orgName" label="机构"></el-table-column>
        <el-table-column property="auditPhase" label="流程环节"></el-table-column>
        <el-table-column label="操作结果">
          <template scope="scope">
            <div v-for="item of scope.row.auditResultText">{{item}}</div>
          </template>
        </el-table-column>
        <el-table-column label="审批金额(元)">
          <template scope="scope">
            {{scope.row.auditAmount | formatMoney}}
          </template>
        </el-table-column>
        <el-table-column property="auditIdea" label="备注信息"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="approvalRecord = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import mapLocation from '@/components/Amap/mapLocation'

  export default {
    components: {
      mapLocation
    },
    data() {
      return {
        position: {},
        formData: {
          username: '',
          userMobile: '',
          applyStatus: '',
          productUuid: '',
          identityVerified: '',
          startTime: '',
          endTime: '',
          orgUuid: ''
        },
        pageSize: 20,
        total: 0,
        selectedManagerUuid: '',
        distributionApplyUuid: '',
        turnPush: false,
        selectedPro: '',
        selectedOrg: '',
        turnPushParams: {},
        approvalRecord: false,
        distributeModal: false,
        mapLocation: false,
        currentPage: 1,
        // 下拉框选项
        applyStatusOptions: [],
        identityOptions: [],
        productOptions: [],
        orgOptions: [],
        // 查询数据
        turnPushData: [],
        recordData: [],
        tableData: [],
        totalData: {
          finishCount: '',
          finshPass: ''
        }
      }
    },
    created() {
      this.getOptions()
      this.fetchData(this.currentPage)
    },
    watch: {
      selectedPro() {
        this.selectedOrg = ''
      }
    },
    methods: {
      // 获取下拉框数据
      getOptions() {
        this.getApiOptions()
        this.applyStatusOptions = this.getCodeList('loanStatus')
        this.identityOptions = this.getCodeList('identityVerified')
      },

      // 获取动态下拉框数据
      getApiOptions() {
        // 产品
        this.http.smallGet('loanPrdList', {}).then(res => {
          if (res && res.data) {
            this.productOptions = res.data
          }
        })

        // 机构
        this.http.smallPost('productOrg', {}).then(res => {
          if (res && res.data) {
            this.orgOptions = res.data
          }
        })
      },

      // 查询列表
      fetchData(pageNum) {

        var data = this.formData

        var params = {}
        params.pageSize = this.pageSize
        params.pageNum = pageNum

        for (var i in data) {
          if (data[i] !== '') {
            if (i === 'startTime') {
              data[i] = this.$moment(data[i]).startOf('day').format()
            }
            if (i === 'endTime') {
              data[i] = this.$moment(data[i]).endOf('day').format()
            }
            params[i] = data[i]
          }
        }

        this.http.post('saleApprovalData', this.filterParams(params)).then(res => {
          if (res && res.data) {
            var data = res.data

            this.tableData = data.list
            this.total = data.total
          }
        })

        this.getStatisticData()
      },

      // 查询数据统计
      getStatisticData() {
        var data = this.formData
        var params = {
          startTime: data.startTime,
          endTime: data.endTime
        }

        this.http.smallPost('mycenter', {}).then(res => {
          if (res && res.data) {
            var managerUuid = res.data.managerUuid
            params.managerUuid = managerUuid

            this.http.smallPost('statisticData', params).then(res => {
              if (res && res.data) {
                this.totalData = res.data
              }
            })
          }
        })
      },

      // 检索
      searchData() {
        this.fetchData(this.currentPage)
      },

      // 转推
      doTurnPush(row) {
        this.selectedPro = ''
        this.selectedOrg = ''
        this.turnPush = true
        this.turnPushParams = {
          applyUuid: row.applyUuid,
          markLedger: row.markLedger
        }
        this.turnPushData = []
        this.http.post('turnPush', { markLeader: row.markLedger }).then(res => {
          if (res) {
            var data = res.data
            for (var i in data) {
              data[i]['uuidStr'] = {
                loanDataUuid: data[i].loanDataUuid,
                productUuid: data[i].productUuid
              }

              this.turnPushData = data
            }
          }
        })
      },

      // 确定转推
      confirmTurnPush() {
        var params = this.turnPushParams
        var selectedPro = this.selectedPro
        var selectedOrg = this.selectedOrg

        if (!selectedOrg) {
          this.$message.warning('请选择转推机构')
          return
        }

        params['loanDataUuid'] = selectedPro.loanDataUuid
        params['productUuid'] = selectedPro.productUuid
        params['pushOrgUuid'] = selectedOrg

        this.http.post('confirmTurnPush', params).then(res => {
          if (res) {
            this.turnPush = false
            this.$message.success('转推成功！')
            this.fetchData(this.currentPage)
          }
        })
      },

      // 查看地图
      lookMap(position) {
        this.mapLocation = true
        this.position = position
      },

      // 审批记录
      checkRecord(row, index) {
        this.approvalRecord = true
        this.recordData = []
        this.http.post('recordData', { applyUuid: row.applyUuid }).then(res => {
          if (res) {
            var data = res.data
            for (var i in data) {
              if (data[i].auditResult == 14) {
                data[i].orgName = '集市'
              } else {
                data[i].orgName = row.orgName
              }
              var result = data[i].auditResultText
              if (result && result.indexOf(',') != -1) {
                data[i].auditResultText = result.split(',')
              } else {
                data[i].auditResultText = [result]
              }
            }

            this.recordData = data
          }
        })
      },

      // 是否有展开
      getRowClass(row, index) {
        if (row.show) {
          return ''
        } else {
          return 'hide-expand'
        }
      },

      // 展开项样式
      tableRowClassName(row, index) {
        return index % 2 == 0 ? 'info-row' : 'positive-row'
      },

      // 展开详情
      expandDetails(row, expanded) {
        if (expanded) {
          var params = {
            applyUuid: row.applyUuid,
            markLedger: row.markLedger
          }

          this.http.smallPost('turnPushDetails', params).then(res => {
            if (res && res.data) {
              var data = res.data
              row.turnPushOrgs = data
              var tableData = this.tableData
              for (var i in tableData) {
                if (tableData[i].applyUuid == row.applyUuid) {
                  this.$set(tableData, i, row)
                }
              }
            }
          })
        }
      },

      handleSizeChange(val) {
        this.pageSize = val
        this.fetchData(this.currentPage)
      },

      handleCurrentChange(val) {
        this.currentPage = val
        this.fetchData(this.currentPage)
      }
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss">
  @import "src/styles/mixin.scss";
  .app-container {
    .el-breadcrumb {
      margin-bottom: 15px;
    }
    .box-card {
      margin-bottom: 20px;
    }
    .el-table__expand-column {
      border-right: none;
    }
    .el-table__expanded-cell {
      padding: 0 0 10px 0;
      border-top: 1px solid #ccc;
      thead {
        display: none;
      }
      .el-table__body tr:hover > td {
        background-color: transparent;
      }
    }
    .hide-expand .el-table__expand-column .el-table__expand-icon {
      display: none
    }
    .el-table .info-row {
      background: #c9e5f5;
    }
    .el-table .positive-row {
      background: #e2f0e4;
    }
    /*转推*/
    .turnPush {
      .el-radio__label {
        display: inline-block;
        vertical-align: middle;
        margin-left: 5px;
        line-height: 25px;
        width: 100%;
        .address {
          color: #888;
          font-size: 12px;
          white-space: normal;
          width: 91%;
          line-height: 20px;
        }
        .location-icon {
          color: red;
          font-size: 16px;
        }
      }
      .table {
        width: 100%;
        max-width: 100%;
        border-collapse: collapse;
        border: 1px solid #ddd;
        .w50 {
          width: 5% !important;
          .el-radio__label {
            display: none;
          }
        }
        thead>tr>th {
          padding: 10px;
          border-top: 1px solid #ddd;
          text-align: left;
          width: 17%;
        }
        tbody {
          display: table-row-group;
          vertical-align: middle;
        }
        .inner-table {
          width: 100%;
          max-width: 100%;
          border-collapse: collapse;
          td {
            padding: 10px;
            border-top: 1px solid #ddd;
            width: 17%;
          }
          .org-list {
            padding-bottom: 15px;
            padding-left: 7%;
            .org-item {
              width: 50%;
              display: inline-block;
            }
          }
        }
      }
    }
    .amap-wrapper {
      height: 500px;
    }
  }
</style>