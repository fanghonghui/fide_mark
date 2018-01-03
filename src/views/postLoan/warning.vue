<template>
  <div class="app-container">
    <el-card class="box-card search-box">
      <el-form :inline="true" :model="postLoanWarn" class="demo-form-inline">
        <el-form-item>
          <div class="sub-title">客户姓名</div>
          <el-input size="small" v-model="postLoanWarn.userName"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="sub-title">联系电话</div>
          <el-input size="small" v-model="postLoanWarn.userMobile"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="sub-title">产品</div>
          <el-select size="small" v-model="postLoanWarn.productUuid" clearable placeholder="全部">
            <el-option v-for="item in loanPrdList" :key="item.productUuid" :label="item.productName" :value="item.productUuid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="sub-title">系统预警等级</div>
          <el-select size="small" v-model="postLoanWarn.alertLevel" clearable placeholder="全部">
            <el-option v-for="item in alertLevelOptions" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="sub-title">机构</div>
          <el-select size="small" v-model="postLoanWarn.orgUuid" clearable placeholder="全部" style="width: 240px;">
            <el-option v-for="item in loanOrgList" :key="item.orgUuid" :label="item.orgName" :value="item.orgUuid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" class="search-btn-style" icon="search" type="primary" @click="warnListQuery">检索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <el-table :data="loanWarnData.list" border style="width: 100%">
        <el-table-column prop="userName" label="客户姓名" width="120"></el-table-column>
        <el-table-column prop="userMobile" label="联系电话"></el-table-column>
        <el-table-column label="授信额度(元)">
          <template scope="scope">
            {{ scope.row.approvedAmount | formatMoney }}
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="贷款产品"></el-table-column>
        <el-table-column prop="orgUuid" label="机构"></el-table-column>
        <el-table-column label="系统预警">
          <template scope="scope">
            {{ scope.row.alertLevel | getCodeName('alertLevel') }}
          </template>
        </el-table-column>
        <el-table-column label="最新预警时间">
          <template scope="scope">
            {{ scope.row.alertTime | format }}
          </template>
        </el-table-column>
        <el-table-column v-if="false" prop="applyUuid" label="贷款申请Id"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-row>
              <el-col style="margin:5px 5px;">
                <el-button size="small" type="primary" @click="seeWarnDetail(scope.row)">查看详情</el-button>
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

    <el-dialog title="预警详情" :visible.sync="warnDetailDialog">
      <el-table :data="warnDetailTable" border>
        <el-table-column property="acct" label="账号" width="200"></el-table-column>
        <el-table-column label="类型">
          <template scope="scope">
            {{ scope.row.accountType | getCodeName('acctType') }}
          </template>
        </el-table-column>
        <el-table-column label="子类型">
          <template scope="scope">
            {{ scope.row.subType | getCodeName('subType') }}
          </template>
        </el-table-column>
        <el-table-column property="propertyName" label="资产名" width="180"></el-table-column>
        <el-table-column label="预警时间" width="200">
          <template scope="scope">
            {{ scope.row.alertTime | format }}
          </template>
        </el-table-column>
        <el-table-column label="预警级别">
          <template scope="scope">
            {{ scope.row.alertLevel | getCodeName('alertLevel') }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // 查询参数
        postLoanWarn: {
          userName: '',
          userMobile: '',
          productUuid: '',
          alertLevel: '',
          orgUuid: ''
        },
        // 数据渲染参数
        alertLevelOptions: [],
        loanWarnData: {},
        warnDetailDialog: false,
        loanPrdList: [],
        loanOrgList: [],
        warnDetailTable: {},
        // 分页参数
        pageSize: 20,
        pageNum: 1,
        currentPage: 1,
        total: 3
      }
    },
    created() {
      // 请求下拉框列表
      this.alertLevelOptions = this.getCodeList('alertLevel')
      this.http.smallGet('loanPrdList', {}).then(res => {
        if (res) {
          this.loanPrdList = res.data
        }
      })
      this.http.smallPost('productOrg', {}).then(res => {
        if (res) {
          this.loanOrgList = res.data
        }
      })
      this.fetchData(this.pageNum, this.pageSize)
    },
    methods: {
      // 请求表格数据
      fetchData(pageNum, pageSize) {
        var data = this.postLoanWarn
        var params = {}
        data.pageNum = pageNum
        data.pageSize = pageSize
        for (var i in data) {
          if (data[i] !== '') {
            params[i] = data[i]
          }
        }
        this.http.post('loanWarnList', this.filterParams(params)).then(res => {
          if (res) {
            this.loanWarnData = res.data
            this.total = res.data.total
          }
        })
      },
      // 搜索
      warnListQuery() {
        this.fetchData(this.pageNum, this.pageSize)
      },
      // 查看预警详情
      seeWarnDetail(row) {
        this.http.post('seeWarnDetail', { applyUuid: row.applyUuid }).then(res => {
          if (res) {
            this.warnDetailTable = res.data
            this.warnDetailDialog = true
          }
        })
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
    .el-breadcrumb {
      margin-bottom: 15px;
    }
    .box-card {
      margin-bottom: 20px;
    }
  }
</style>
