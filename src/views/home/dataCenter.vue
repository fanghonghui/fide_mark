<template>
  <div class="components-container" style='height:100vh'>
    <div class="pdlr12">
      <el-button :type="!flag?'primary':''" size="large" @click.native="tab(1)">注册数据</el-button>
      <el-button :type="flag?'primary':''" size="large" @click.native="tab(2)">机构数据</el-button>
      <div class="box">
        <div v-show="!flag">
          <el-row :gutter="20" class="row1">
            <el-col :span="12">
              <div class="grid-content bg-yellow">
                <p>注册用户数</p>
                <p>今天：{{todayCount.register}}</p>
                <p>昨天：{{yesterdayCount.register}}</p>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-gray">
                <p>提交申请数（全系统）</p>
                <p>今天：{{todayCount.allApply}}</p>
                <p>昨天：{{yesterdayCount.allApply}}</p>
              </div>
            </el-col>
          </el-row>
          <div class='chart-container'>
            <line-marker height='100%' width='100%' :chart-data="regData" ></line-marker>
          </div>
        </div>
        <div v-show="flag">
          <el-row style="margin-top: 20px;">
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
              <el-form :inline="true" ref="form" :model="form">
                <el-form-item>
                  <div class="sub-title">统计时间(起)</div>
                  <el-date-picker size="small" v-model="form.startTime" type="date" placeholder="">
                  </el-date-picker>
                </el-form-item>
                <el-form-item>
                  <div class="sub-title">统计时间（止）</div>
                  <el-date-picker size="small" v-model="form.endTime" type="date" placeholder="">
                  </el-date-picker>
                </el-form-item>
                <el-form-item>
                  <div class="sub-title">&nbsp;</div>
                  <el-button type="primary" size="small" @click.native="search" icon="search">检索</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <el-row>
            <el-table v-loading.body="list.loading" :data="list.data" border style="width: 100%">
              <el-table-column prop="orgCode" label="机构编码">
              </el-table-column>
              <el-table-column prop="orgName" label="机构名称">
              </el-table-column>
              <el-table-column label="统计起止时间内" align="center">
                <el-table-column label="申请数">
                  <template scope="scope">
                    <span>
                    {{scope.row.countOfApply}}
                    <el-tooltip class="item" effect="dark"  placement="right-end">
                       <div slot="content">
                         <h4 ><span>状态</span><span class="ml30">笔数</span></h4>
                    <div class="l20" v-for="(item,index) in scope.row.statusCounts" key="">
                      <span>{{ item.status|getCodeName('loanStatus')}}</span><span class="ml30">{{item.count}}</span>
                    </div>
        </div>
        <i class="el-icon-information" style="color:#868686"></i>
        </el-tooltip>
        </span>
        </template>
        </el-table-column>
        <el-table-column label="审批中（笔）" prop="onApproval">
        </el-table-column>
        <el-table-column label="终审通过（笔）" prop="passApproval">
        </el-table-column>
        <el-table-column label="授信金额">
          <template scope="scope">
            <span>{{scope.row.amountOfPassApproval | formatMoney }}</span>
          </template>
        </el-table-column>
        </el-table-column>
        </el-table>
        </el-row>
      </div>
    </div>
    <!--box-->
  </div>
  </div>
</template>

<script>
  import lineMarker from '@/components/Charts/lineMarker'
  import moment from 'moment'
  export default {
    components: { lineMarker },
    data() {
      return {
        flag: false,
        regData: {//图表数据
          register: {
            list: []
          },
          allApply: {
            list: []
          }
        },
        todayCount: {
          register: 0,
          allApply: 0
        },
        yesterdayCount: {
          register: 0,
          allApply: 0
        },

        form: {
          startTime: moment(new Date).subtract(4, 'days').format('YYYY-MM-DD'),
          endTime: moment(new Date).format('YYYY-MM-DD'),
        },
        list: {
          data: [{
          }
          ],
          loading: false,
          pagination: {
            size: 15,
            total: 100,
            page: 1,
          }
        },

      }

    },

    methods: {
      tab(t) {
        if (t == '1') {
          this.flag = false;
        } else {
          this.flag = true;
        }
      },
      search() {
        var qs = {
          startTime: moment(this.form.startTime).format('YYYY-MM-DD'),
          endTime: moment(this.form.endTime).format('YYYY-MM-DD')
        },
        msStartTime = new Date(this.form.startTime).getTime(),
        msEndTime = new Date(this.form.endTime).getTime();

        if (!qs.startTime) {
          return this.$message('统计时间(起)不能为空');
        }
        if (!qs.endTime) {
          return this.$message('统计时间(止)不能为空');
        }
        if(qs.startTime!=qs.endTime&&msEndTime<msStartTime){
          return  this.$message('统计时间(止)不能小于统计时间（起）');
        }

        this.orgData(qs);
      },
      registerData() {//图表数据
        this.http.post('datacenter', {})
          .then(res => {
            if(!res) return false;
            this.regData = res.data;
            var len, len2;
            if (!this.regData) return false;
            !!this.regData.allApply && !!this.regData.allApply.list
              && !!this.regData.allApply.list.length > 0
              && (len = this.regData.allApply.list.length)
              && len >= 2 && (this.yesterdayCount.allApply = this.regData.allApply.list[len - 2].count);
            this.todayCount.allApply = this.regData.allApply.list[len - 1].count;

            !!this.regData.register && !!this.regData.register.list
              && !!this.regData.register.list.length > 0
              && (len2 = this.regData.register.list.length)
              && len2 >= 2 && (this.yesterdayCount.register = this.regData.register.list[len2 - 2].count)
            this.todayCount.register = this.regData.register.list[len2 - 1].count;
          }).catch(err => {
            this.$message.warning(err.respMsg);
          });
      },
      init() {
        this.registerData();
        var qs = {
          startTime: this.form.startTime,
          endTime: this.form.endTime
        };
        this.orgData(qs);
      },
      orgData(qs) {
        this.http.post('datacenterOrg', qs)
          .then(res => {
            if (res&&res.data && res.data.length > 0) {
              this.list.data = res.data;
              this.list.data.forEach(function (e) {
                var countOfApply = 0;
                var onApproval = 0;
                var passApproval = 0;
                var amountOfPassApproval = 0;
                var detailsHtml = '';
                e.statusCounts.forEach(function (e, i) {
                  countOfApply += e.count || 0;
                  if (["MERCHANT_APPLY", "MERCHANT_APPLY_PASS", "ORG_APPLY", "REPLENISH_DATUM", "FIRST_TRIAL_PASS", "FOLLOW_PASS"].indexOf(e.status) !== -1) {
                    onApproval += e.count || 0;
                  }
                  if (["FINAL_JUDGMENT_PASS", "AWAIT_SIGN_FINISH", "POST_DREWDOWN", "FINISH"].indexOf(e.status) !== -1) {
                    passApproval += e.count || 0;
                    amountOfPassApproval += e.approvedAmount || 0;
                  }
                });
                e.countOfApply = countOfApply;
                e.onApproval = onApproval;
                e.passApproval = passApproval;
                e.postApproval = countOfApply - onApproval;
                e.amountOfPassApproval = amountOfPassApproval;
                e.ratioOfPassApproval = e.postApproval ? (passApproval / e.postApproval) * 100 : '-';
              });
            }
          }).catch(err => {
            this.$message.warning(err.respMsg);
          });
      },
    },
    mounted() {
      this.init();
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .ml30 {
    margin-left: 30px;
  }

  .mt20 {
    margin-top: 20px;
  }

  .pdlr12 {
    padding: 0 12px;
  }

  .chart-container {
    position: relative;
    width: 100%;
    height: 80%;
    margin-top: 25px;
  }

  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  .bg-yellow {
    background: #cc9900;
  }

  .bg-gray {
    background: #2b333c;
  }

  .grid-content {
    min-height: 36px;
    padding: 15px 0 20px;
    border-radius: 4px;
    p {
      color: #fff;
      font-size: 18px;
      line-height: 25px;
      text-align: center;
    }
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .row1 {
    width: 650px;
    margin-top: 20px;
  }

  .el-breadcrumb {
    padding-left: 25px;
    margin-top: 15px;
  }
</style>
