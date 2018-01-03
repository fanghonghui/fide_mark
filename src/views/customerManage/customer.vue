<template>
  <div class="app-container">
    <el-card class="box-card search-box">
      <el-form :inline="true" :model="formData">
        <el-form-item>
          <div class="sub-title">客户姓名</div>
          <el-input size="small" v-model="formData.userName"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="sub-title">身份证号</div>
          <el-input size="small" v-model="formData.userIdNumber"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="sub-title">联系电话</div>
          <el-input size="small" v-model="formData.userMobile"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="sub-title">注册时间(起)</div>
          <el-date-picker @change="setStartDate" size="small" v-model="formData.startTime" type="date">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <div class="sub-title">注册时间(止)</div>
          <el-date-picker @change="setEndDate" size="small" v-model="formData.endTime" type="date"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <div class="sub-title">申请状态</div>
          <el-select size="small" v-model="formData.loanFlag" clearable placeholder="全部">
            <el-option v-for="item in loanFlagOptions" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="sub-title">销售</div>
          <el-select size="small" v-model="formData.managerUuid" clearable placeholder="全部">
            <el-option v-for="item in sellList" :key="item.managerUuid" :label="item.managerName" :value="item.managerUuid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" class="search-btn-style" icon="search" type="primary" @click="searchCustomer">检索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <el-table :data="customerData.list" border style="width: 100%">
        <el-table-column label="注册时间">
          <template scope="scope">
            {{ scope.row.createTime | format }}
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="客户姓名"></el-table-column>
        <el-table-column prop="userMobile" label="联系电话"></el-table-column>
        <el-table-column prop="userIdNumber" label="身份证号"></el-table-column>
        <el-table-column prop="managerName" label="销售"></el-table-column>
        <el-table-column label="申请状态">
          <template scope="scope">
            {{ scope.row.loanFlag | getCodeName('loanFlag') }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100, 200, 300, 400]"
        :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // 查询参数
        formData: {
          userName: '',
          userIdNumber: '',
          userMobile: '',
          startTime: '',
          endTime: '',
          loanFlag: '',
          managerUuid: ''
        },
        // 页面渲染参数
        loanFlagOptions: [],
        sellList: [],
        customerData: {},
        // 分页参数
        pageSize: 20,
        pageNum: 1,
        currentPage: 1,
        total: 3
      }
    },
    created() {
      this.loanFlagOptions = this.getCodeList('loanFlag')
      // 请求销售下拉框列表
      this.http.post('queryAllSeller', {}).then(res => {
        this.sellList = res.data
      })
      this.fetchData(this.pageNum, this.pageSize)
    },
    methods: {
      // 请求表格数据
      fetchData(pageNum, pageSize) {
        var data = this.formData
        var params = {}
        data.pageNum = pageNum
        data.pageSize = pageSize
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
        
        this.http.post('customerManage', this.filterParams(params)).then(res => {
          if (res) {
            this.customerData = res.data
            this.total = res.data.total
          }
        })
      },
      // 搜索
      searchCustomer() {
        this.fetchData(this.pageNum, this.pageSize)
      },
      setStartDate(val) {
        this.formData.startTime = val
      },
      setEndDate(val) {
        this.formData.endTime = val
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
  }
</style>
