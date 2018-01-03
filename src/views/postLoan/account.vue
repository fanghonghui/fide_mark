<template>
  <div class="app-container">
    <el-form :inline="true" :model="postLoanForm" class="demo-form-inline">
      <el-card class="box-card search-box">
        <el-form-item>
          <div class="sub-title">姓名</div>
          <el-input size="small" v-model="postLoanForm.userName"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="sub-title">联系电话</div>
          <el-input size="small" v-model="postLoanForm.userMobile"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="sub-title">还款方式</div>
          <el-select size="small" v-model="postLoanForm.paybackWay" clearable placeholder="全部">
            <el-option v-for="item in paybackWayOptions" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="sub-title">当前是否还款延期</div>
          <el-select size="small" v-model="postLoanForm.paybackPlanStatus" clearable placeholder="全部">
            <el-option v-for="item in paybackStatusOptions" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" class="search-btn-style" icon="search" type="primary" @click="accountListQuery">检索</el-button>
        </el-form-item>
      </el-card>

      <el-card class="box-card">
        <el-select size="small" v-model="postLoanForm.innerCode" clearable placeholder="请选择机构" @change="fetchData(pageNum, pageSize)" style="width: 250px;">
          <el-option v-for="item in loanOrgList" :key="item.orgUuid" :label="item.orgName" :value="item.innerCode">
          </el-option>
        </el-select>
        <el-table :data="accountData.list" border style="width: 100%;margin-top:10px;">
          <el-table-column prop="userName" label="姓名" width="180"></el-table-column>
          <el-table-column prop="userMobile" label="联系电话" width="180"></el-table-column>
          <el-table-column label="还款方式">
            <template scope="scope">
              {{ scope.row.paybackWay | getCodeName('pay_way') }}
            </template>
          </el-table-column>
          <el-table-column label="授信额度（元）">
            <template scope="scope">
              {{ scope.row.approvedAmount | formatMoney }}
            </template>
          </el-table-column>
          <el-table-column label="当前是否还款延期">
            <template scope="scope">
              {{ scope.row.paybackPlanStatus | getCodeName('pay_overdue') }}
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作">
            <template scope="scope">
              <el-row>
                <el-col style="margin-top:5px;">
                  <el-button size="small" class="mb5" type="primary" @click="contractList(scope.row)">合同列表</el-button>
                  <el-button size="small" class="mb5" type="primary" :disabled="!scope.row.receiptFlag"  @click="goLoanDetail(scope.row)">贷款详情</el-button>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>
    </el-form>
     <!--合同列表-->
    <el-dialog title="" :visible.sync="contractShow">
      <div class="contentStyle">
        <el-table :data="contractTable" border style="width: 100%; margin-bottom: 20px;">
          <el-table-column prop="contractNo" label="合同编号" width="280"></el-table-column>
          <el-table-column label="创建时间">
            <template scope="scope">
              {{ scope.row.createTime | format }}
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template scope="scope">
              {{ scope.row.status | getCodeName('sign_status') }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template scope="scope">
              <el-row>
                <el-col style="margin-top:5px;">
                  <a class="downloadBtn" :href="scope.row.contractFileUrl" >下载合同</a>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="contractShow = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // 查询参数
        postLoanForm: {
          userName: '',
          userMobile: '',
          paybackWay: '',
          paybackPlanStatus: '',
          innerCode: ''
        },
        // 渲染参数
        paybackWayOptions: [],
        paybackStatusOptions: [],
        contractShow: false,
        loanOrgList: [],
        accountData: {},
        contractTable: [],
        // 分页参数
        pageSize: 20,
        pageNum: 1,
        currentPage: 1,
        total: 3
      }
    },
    created() {
      // 下拉框列表的获取
      this.getOptions()
      this.http.smallPost('productOrg', {}).then(res => {
        if (res) {
          this.loanOrgList = res.data
        }
      })
      this.fetchData(this.pageNum, this.pageSize)
    },
    methods: {
      // 获取下拉框选项
      getOptions() {
        this.paybackWayOptions = this.getCodeList('pay_way')
        this.paybackStatusOptions = this.getCodeList('pay_overdue')
      },
      // 请求表格数据
      fetchData(pageNum, pageSize) {
        var data = this.postLoanForm
        var params = {}
        data.pageNum = pageNum
        data.pageSize = pageSize
        for (var i in data) {
          if (data[i] !== '') {
            params[i] = data[i]
          }
        }
        this.http.post('accountList', this.filterParams(params)).then(res => {
          if (res) {
            this.accountData = res.data
            this.total = res.data.total
          }
        })
      },
      // 查询
      accountListQuery() {
        this.fetchData(this.pageNum, this.pageSize)
      },
      // 查看贷款详情
      goLoanDetail(row) {
        var loanAppUuid = row.loanAppUuid
        this.Cookies.set('loanAppUuid', loanAppUuid)
        this.$router.push({ name: '贷款详情' })
      },
      // 查看合同列表
      contractList(row) {
        this.http.post('contractList', { loanAppUuid: row.loanAppUuid }).then(res => {
          if (res) {
            this.contractTable = res.data
          }
        })
        this.contractShow = true
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.fetchData(this.currentPage, this.pageSize)
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.fetchData(this.currentPage, this.pageSize)
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
    .downloadBtn{
      display:inline-block;
      width:65px;
      height:29px;
      padding: 2px 8px;
      font-size: 12px;
      border-radius: 4px;
      color: #fff;
      background-color: #20a0ff;
      border-color: #20a0ff;
    }
  }
</style>
