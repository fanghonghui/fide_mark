<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="元宝铺子" name="first">
          <el-button size="small" style="margin: 10px 0;" icon="d-caret" type="primary" @click="initQuickSort">快速排序
          </el-button>
          <el-table :data="tableData" border style="width: 100%" v-loading="tableDataLoading">
            <el-table-column label="序号" width="100">
              <template scope="scope">
                <span>
                  <!--<i class="el-icon-caret-top crc f12 upsort" @click="sortUpDown(scope.$index,1)"></i>-->
                  {{scope.$index+1}}
                  <!--<i class="el-icon-caret-bottom f12 crc downsort" @click="sortUpDown(scope.$index,2)"></i>-->
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="productName" label="名称" width="270"></el-table-column>
            <el-table-column prop="orgName" label="机构" width="270"></el-table-column>
            <el-table-column prop="publishTime" label="上架时间">
              <template scope="scope">
                {{ scope.row.publishTime | format }}
              </template>
            </el-table-column>
            <el-table-column prop="rate" label="利率类型" :formatter="rateType"></el-table-column>
            <el-table-column label="利率">
              <template scope="scope">
                <span v-if="scope.row.downRate!=scope.row.upperRate">
                    {{scope.row.downRate}}{{scope.row.rateUnit}} - {{ scope.row.upperRate}}{{scope.row.rateUnit}}
                </span>
                <span v-else>
                    {{scope.row.downRate}}{{scope.row.rateUnit}}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <el-row>
                  <el-col style="margin:5px 5px;">
                    <el-button size="small" class="mb5" type="primary" @click="histotyRecordFn(scope.row)">历史记录</el-button>
                    <el-button size="small" class="mb5" type="primary" @click="soldOut(scope.row)">下架</el-button>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="机构产品" name="second">
          <el-row class="org-pro">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
            </el-checkbox>
            <el-checkbox-group style="display: inline-block" v-model="checkList" @change="handleCheckedChange">
              <el-checkbox v-for="org in orgOptions" :label="org" :key="org.orgUuid">{{org.orgName}}</el-checkbox>
            </el-checkbox-group>
          </el-row>
          <el-row v-for="(item,index) in checkList" key="" style="margin-top:20px; margin-bottom: 40px;">
            <div class="table_title">{{item.orgName}}</div>
            <el-table :data="tableOrgData[item.orgUuid]||[]" border style="width: 100%">
              <el-table-column prop="productName" label="名称"></el-table-column>
              <el-table-column label="上架时间">
                <template scope="scope">
                  {{ scope.row.publishTime | format }}
                </template>
              </el-table-column>
              <el-table-column prop="rate" label="利率类型" :formatter="rateType"></el-table-column>
              <el-table-column label="利率">
                <template scope="scope">
                  <span v-if="scope.row.downRate!=scope.row.upperRate">
                    {{scope.row.downRate}}{{scope.row.rateUnit}} - {{ scope.row.upperRate}}{{scope.row.rateUnit}}
                  </span>
                  <span v-else>
                    {{scope.row.downRate}}{{scope.row.rateUnit}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="推送">
                <template scope="scope">
                  <el-switch size="small" on-text="" off-text="" v-model="scope.row.push" @change="changeCheck(scope.row,item.orgCode)"></el-switch>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template scope="scope">
                  <el-row>
                    <el-col style="margin:5px 5px;">
                      <el-button size="small" type="primary" @click="goDetails(scope.row)">产品详情</el-button>
                      <el-button size="small" type="primary" @click="goAccess(scope.row)">准入</el-button>
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!--历史记录-->
    <el-dialog title="历史记录" :visible.sync="histotyRecord">
      <el-table border :data="gridData" max-height="600">
        <el-table-column label="操作时间">
          <template scope="scope">
            {{ scope.row.createTime | format }}
          </template>
        </el-table-column>
        <el-table-column label="操作事件">
          <template scope="scope">
            {{ scope.row.operType | getCodeName('loanProductStatus')}}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!--下架-->
    <el-dialog :visible.sync="tipDialog" size="tiny">
      <span>确认下架&nbsp;[{{tipName}}]&nbsp;商品吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tipDialog = false">取 消</el-button>
        <el-button type="primary" @click="productSoldOut">确 定</el-button>
      </span>
    </el-dialog>

    <!--快速排序-->
    <el-dialog :visible.sync="quickDialog" :show-close="false" class="quickbox">
      <el-row>
        <el-col :span="24" align="right">
          <span class="spanbtn " @click="cancel">取 消</span>
          <span class="spanbtn ml15" @click="confirmList(true)">确 定</span>
        </el-col>
      </el-row>
      <el-row class="mt20">
        <div class="twoDndList">
          <div class="twoDndList-list ">
            <el-row align="center">
              <el-col :span="2">
                <div class="font-center  f20 crfff">新序号</div>
              </el-col>
              <el-col :span="2">
                <div class="font-center  f20 crfff">旧序号</div>
              </el-col>
              <el-col :span="10">
                <div class="font-center  f20 crfff">名称</div>
              </el-col>
              <el-col :span="10">
                <div class="font-center f20 crfff">上架时间</div>
              </el-col>
            </el-row>

            <draggable :list="listData" class="dragArea" :options="{group:'article'}">
              <div class="list-complete-item" v-for="(item,index) in listData" :key='item.id'>
                <div class='list-complete-item-handle2'>
                  <el-row align="center">
                    <el-col :span="2">
                      <div class="font-center  f20 crfff">{{index+1}}</div>
                    </el-col>
                    <el-col :span="2">
                      <div class="font-center  f20 crfff" :class="{ 'green': item.green, 'red': item.red}" >{{item.idx}}</div>
                    </el-col>
                    <el-col :span="10">
                      <div class="font-center  f20 crfff">{{item.productName}}</div>
                    </el-col>
                    <el-col :span="10">
                      <div class="font-center f20 crfff"> {{ item.publishTime | format }}</div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </draggable>
          </div>
        </div>
      </el-row>
    </el-dialog>

    <!--产品详情-->
    <el-dialog class="pro-detail" title="产品详情" :visible.sync="detailDialog">
      <el-card class="detail-box box-card">
        <el-form label-width="120px">
          <el-form-item label="名称：">
            {{detailData.name}}
          </el-form-item>
          <el-form-item label="目标客群：">

            <span v-for="to in detailData.targetCustomer" class="mr15">
              {{to | getCodeName('targetCustomer')}}
            </span>
          </el-form-item>
          <el-form-item label="利率：" v-if="!detailData.productType">
            <span v-if="detailData.downRate!=detailData.upperRate">
                  {{detailData.rate|getCodeName('rateType')}} {{detailData.downRate}}{{detailData.rateUnit}}-{{detailData.upperRate}}{{detailData.rateUnit}}
             </span>
            <span v-else>
                {{detailData.rate|getCodeName('rateType')}} {{detailData.downRate}}{{detailData.rateUnit}}
            </span>
          </el-form-item>
          <el-form-item label="贷款类型：" >
            {{detailData.type | getCodeName('loanProductType')}}
          </el-form-item>
          <el-form-item label="爆款推荐：" v-if="!!detailData.productType">
            {{detailData.recommendType}}
          </el-form-item>
          <el-form-item label="最快放款时间：" v-if="!detailData.productType">
            {{detailData.loanDay}}天
          </el-form-item>
          <el-form-item label="产品描述：">
            {{detailData.description}}&nbsp;
          </el-form-item>
          <el-form-item label="申请条件：">
            <span class="hh" style="line-height: 12px;">  {{detailData.applyDesc}}&nbsp;&nbsp;</span>
          </el-form-item>
          <el-form-item label="费用说明："  v-if="!!detailData.productType">
            <span class="hh" style="line-height: 12px;">  {{detailData.applyDesc}}&nbsp;&nbsp;</span>
          </el-form-item>

          <el-form-item label="还款说明："  v-if="!detailData.productType">
            <span class="hh"> {{detailData.paybackDesc}}&nbsp;</span>
          </el-form-item>
          <el-form-item label="上线区域：">
            <span v-for="city in availableArea" class="mr15">
               {{city |  getCityNameByCode}}
            </span>
          </el-form-item>
          <el-form-item label="上线机构：" v-if="!detailData.productType">
            {{detailData.availableOrg }}
          </el-form-item>
          <el-form-item label="授信额度：">
           {{detailData.downApprovedAmount | formatMoney}} ~{{detailData.upperApprovedAmount | formatMoney }}&nbsp;&nbsp;(元)
          </el-form-item>
          <el-form-item label="产品申请URL:"  v-if="!!detailData.productType">
            <span class="hh" style="line-height: 12px;">  {{detailData.productApplyUrl}}&nbsp;&nbsp;</span>
          </el-form-item>
          <el-form-item label="进度查询URL:"  v-if="!!detailData.productType">
            <span class="hh" style="line-height: 12px;">  {{detailData.progressQueryUrl}}&nbsp;&nbsp;</span>
          </el-form-item>
          <el-form-item label="还款方式:"  v-if="!detailData.productType">
            <span v-for="(av,index) in availablePeriods" class="mr15">
              <i v-if="av==0" class="font-n">分期</i>
              <i v-if="av==1" class="font-n"> 随借随还</i>
              <i v-if="av!=0&&av!=1" class="font-n">分{{ av }}期</i>
            </span>
          </el-form-item>
          <el-form-item label="所需材料："  v-if="!detailData.productType">
            <ul  class="suotxt">
               <li v-for="item in privateMat" class="mr15 "  style="float: left;width: 150px;">
                <i v-show="item.flag&&item.txt" class="crred ">*</i>
                  {{item.txt}}
                </li>
                <li style="float: left;width: 150px;" v-for="ce in basicMat" class="mr15">
                <i v-show="ce.flag&&ce.txt" class="crred">*</i>
                {{ce.txt}}
                </li>
            </ul>
          </el-form-item>
          <el-form-item label="数据源："  v-if="!detailData.productType">
            <span v-for="ce in dataSource" class="mr15">
            <i v-show="ce.flag&&ce.txt" class="crred">*</i>
            {{ce.txt}}
            </span>
          </el-form-item>
        </el-form>
      </el-card>
    </el-dialog>

    <!--准入-->
    <el-dialog title="准入" :visible.sync="accessDialog">
      <el-table :data="accessData" style="width: 100%" max-height="600">
        <el-table-column prop="name" label="指标名称" width="180">
        </el-table-column>
        <el-table-column prop="required" label="准入要求" width="180">
        </el-table-column>
        <el-table-column prop="result" label="结果">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="accessDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import { cloneObj } from '@/utils/util'
  const ziliao = {
    name: '用户姓名',
    idNumber: '身份证号码',
    applyAmount: '意向贷款额度',
    identityPic: '身份证照片正反面'
  };
  export default {
    components: { draggable },
    data() {
      return {
        proIndex: 0,
        //详情
        getstate1: this.getState(),
        detailData: {//产品详情
          targetCustomer: [],
          type: {},
          rateUnit: '',
          privateMat: "",
          dataSource: '',
          downRate: '',						// 利率下限
          upperRate: '',						// 利率上限
          rateUnit: '',
        },
        availableArea: [],//上线区域
        accessTitle: '',
        accessData: [//准入
        ],
        tableData: [ //元宝铺子

        ],
        tableDataLoading: false,
        tipName: '',
        markProductUuid: '',

        privateMat: [], //所需材料 - 个人资料
        basicMat: [], //所需材料 - 基础资料
        //还款方式
        availablePeriods: [],
        //数据源
        dataSource: [],
        //排序
        listData: [

        ],
        //机构产品
        tableOrgData: [

        ],
        listDataCopy: [],
        activeName: 'first',
        orgOptions: [],
        checkList: [],
        isIndeterminate: true,
        checkAll: true,
        switchValue: true,
        histotyRecord: false,
        tipDialog: false,
        quickDialog: false,
        detailDialog: false,
        accessDialog: false,
        gridData: []
      }
    },
    filters: {

    },
    watch:{
      listData(){
        let listDataCopy= this.listDataCopy;
         if(!!this.listData && this.listData.length>0){
           for(var i=0;i<this.listData.length;i++){
               var item =  this.listData[i];
               var itemCopy = listDataCopy[i];
              if(item.idx==itemCopy.idx){
                  item.green = false;
                  item.red = false;
              } else if(item.idx<itemCopy.idx){
                item.green = true;
                item.red = false;
              } else {
                item.green = false;
                item.red = true;
              }
           }
         }

          console.log('444')
        }
    },
    methods: {
      //元宝铺子列表
      product() {
        this.http.post('product', {}).then(res => {
          if(!res||!res.data) return false;
          this.tableData = res.data;
//          console.log('元宝铺子列表',res.data)
          this.listData = cloneObj(res.data);
          !!this.listData && this.listData.length > 0 && this.listData.forEach(function (item, index) {
            item.idx = index + 1;
            item.green = false;
            item.red = false;
          });
          this.listDataCopy = cloneObj(this.listData);
        }).catch(err => {
          this.$message.warning(err.respMsg);
        })
      },
      //类型
      rateType(row) {
        return this.getstate1.rateType[row.rate]
      },
      //机构产品
      productOrg() {//第一步  获取所有机构名
        this.orgOptions = [];
        this.http.smallPost('productOrg', {}).then(res => {
          if(!res||!res.data) return false;
          this.orgOptions = res.data;
          this.checkList = this.orgOptions.slice(0, 1);
          this.productOrgList();
        }).catch(err => {
          this.$message.warning(err.respMsg);
        })
      },
      productOrgList() {
        let params = {
          orgUuid: []
        };
        this.tableOrgData = [];
        if (this.checkList.length > 0) {
          this.checkList.forEach(function (item) {
            let id = item.orgUuid;
            params.orgUuid.push(id);
          });
          params.orgUuid = params.orgUuid.join('|');
          this.http.post('productOrgList', params).then(res => {
            if (res) {
              this.tableOrgData = res.data || [];
            }
          }).catch(err => {
            this.$message.warning(err.respMsg);
          })
        }
      },
      //全选
      handleCheckAllChange(event) {
        this.checkList = event.target.checked ? this.orgOptions : []
        this.isIndeterminate = false;
        this.productOrgList();
      },
      handleCheckedChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.orgOptions.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.orgOptions.length;
        this.productOrgList();
      },
      init() {
        this.product();
        this.productOrg();
      },
      initQuickSort() {
        this.quickDialog = true;
        this.listData = cloneObj(this.listDataCopy);
      },
      //取消排序
      cancel() {
        this.quickDialog = false;
      },
      //确认排序
      confirmList(flag) {
        let params = {
          markProductUuids: this.listData.map(function (e) {
            return e.markProductUuid;
          }).join('|')
        };
        this.http.post('sortProduct', params).then(res => {
          if(res){
            this.$message.success(res.respMsg);
            this.product();
          }
        }).catch(err => {
          this.$message.warning(err.respMsg);
        });
        if (flag) {
          this.quickDialog = false;
        }
      },
      //上下排序
      sortUpDown(index, type) {
        //         let idx = index,
        //             tableDataCopy = cloneObj(this.tableData),
        //             temp = Object.assign({},tableDataCopy[idx]);
        //         if(type==1&&idx>0){
        //             tableDataCopy[idx] = Object.assign({},tableDataCopy[idx-1]);
        //             tableDataCopy[idx-1] = temp;
        //         } else if(type==2&&idx<tableDataCopy.length-1){
        //            tableDataCopy[idx] = Object.assign({},tableDataCopy[idx+1]);
        //            tableDataCopy[idx+1] = temp;
        //         }
        //         this.tableData = cloneObj(tableDataCopy);
      },
      //点击下架按钮
      soldOut(row) {
        this.tipDialog = true;
        this.tipName = row.productName;
        this.markProductUuid = row.markProductUuid;
      },
      //确认下架
      productSoldOut() {
        let params = { markProductUuid: this.markProductUuid };
        this.http.post('productSoldOut', params).then(res => {
          if(res){
            this.tipDialog = false;
            this.product();
            this.productOrgList();
            this.$message.success(res.respMsg);
          }
        }).catch(err => {
          this.productOrgList();
          this.tipDialog = false;
          this.$message.warning(err.respMsg);
        })
      },
      //历史记录
      histotyRecordFn(row) {
        this.histotyRecord = true;
//        console.log('ddd',row);
        this.http.get('historyRecord', { markProductUuid: row.markProductUuid }).then(res => {
          if(!res||!res.data) return false;
          this.gridData = res.data;
        }).catch(err => {
        })
      },
      //推送
      changeCheck(row, orgCode) {
        let params = {
          orgCodePullorPush: orgCode,
          productUuid: row.productUuid
        };
//        console.log('推送',params);
        if (row.push) {
          this.http.post('productOrgPush', params).then(res => {
            if(res){
              this.$message.success(res.respMsg);
            }
          }).catch(err => {
            this.productOrgList();
            this.$message.warning(err.respMsg);
          })
        } else {
          this.http.post('productOrgPull', params).then(res => {
            if(res){
              this.$message.success(res.respMsg);
            }
          }).catch(err => {
            this.productOrgList();
            this.$message.warning(err.respMsg);
          })
        }

      },
      //详情
      goDetails(row) {
        let pararms = {
          productUuid: row.productUuid
        };
        let that = this;
        this.privateMat = [];
        this.basicMat = [];
        that.availablePeriods = [];
        that.dataSource = [];
        this.detailDialog = true;
        this.http.post('productOrgDetail', pararms).then(res => {
          if(!res||!res.data) return false;
//          console.log('ddd',res);
          this.detailData = res.data;
          this.detailData.targetCustomer = this.detailData.targetCustomer.split('|')||[];
          console.log('detail',res);
          let privateMat = this.detailData.privateMat,
            availablePeriods = this.detailData.availablePeriods,
            dataSource = this.detailData.dataSource,
            basicMat = this.detailData.basicMat;
          this.availableArea = this.detailData.availableArea.split('|');
          function chuli(typeName, str) {
            typeName = typeName.split('|');
            typeName.forEach(function (item) {
              var obj = {
              };
              if (item.indexOf('$') != -1) {
                obj.flag = true;
              } else {
                obj.flag = false;
              }
              obj.name = item.replace(/\$/g, '');
              that[str].push(obj);
            });
          }
          if (privateMat) {
            chuli(privateMat, 'privateMat');
            that.privateMat.forEach(function (item) {
              item.txt = ziliao[item.name];
            })
          }
          if (dataSource) {
            chuli(dataSource, 'dataSource');
            that.dataSource.forEach(function (item) {
              item.txt = that.getstate1.dataSource[item.name];
            })
          }
          if (basicMat) {//======
            chuli(basicMat, 'basicMat');
            that.basicMat.forEach(function (item) {
              item.txt = that.getstate1.basicData[item.name];
            })
          }
          that.availablePeriods = availablePeriods.split(',')||[];
//          if (availablePeriods) {
//
//            availablePeriods.forEach(function (item) {
//              var str = that.getstate1.repaymentType[item];
//              that.availablePeriods.push(str);
//            });
//          }
        }).catch(err => {
          this.$message.warning(err.respMsg);
        })
      },
      //准入
      goAccess(row) {
        this.accessDialog = true;
        this.accessTitle = row.productName;
        let params = { productUuid: row.productUuid };
        this.http.post('productOrgAccess', params).then(res => {
          if(!res) return;
          this.accessData = res.data||[];
        }).catch(err => {
          this.$message.warning(err.respMsg);
        })

      },
      //tab
      handleClick(tab, e) {
        if (e.target.innerText == '元宝铺子') {
          this.product();
        }else {
            if(this.orgOptions.length==0){
              this.productOrg();
            }
        }
      },
      //表格样式
      tableRowClassName(row, index) {
        if (index === 1) {
          return 'info-row';
        } else if (index === 3) {
          return 'positive-row';
        }
        return '';
      }
    },
    mounted() {
      this.init();
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
      .table_title {
        font-size: 16px;
        padding: 10px 0;
        font-weight: bold;
      }
    }
    .org-pro {
      margin-top: 12px;
      .el-checkbox {
        margin-right: 15px
      }
      .el-checkbox+.el-checkbox {
        margin-left: 0
      }
    }
  }

  .quickbox .el-dialog {
    background: transparent;
    box-shadow: none;
    min-width: 800px;
  }
  .spanbtn {
    display: inline-block;
    border-radius: 4px;
    line-height: 40px;
    text-align: center;
    border: 2px solid #fff;
    width: 80px;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
  }

  .list-complete-item {
    cursor: pointer;
    position: relative;
    font-size: 14px;
    padding: 12px 0px;
    margin-top: 4px;
    border: 1px solid #bfcbd9;
    transition: all 1s;
  }

  .list-complete-item-handle {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 50px;
  }

  .list-complete-item-handle2 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 20px;
  }

  .list-complete-item.sortable-chosen {
    background: #4AB7BD;
  }

  .list-complete-item.sortable-ghost {
    background: #30B08F;
  }

  .list-complete-enter,
  .list-complete-leave-active {
    opacity: 0;
  }

  .pro-detail {
    .el-dialog {
      min-width: 700px;
    }
  }

  .detail-box {
    .el-form-item__label {
      font-weight: bold;
    }
  }

  .el-table .info-row {
    background: #c9e5f5;
  }

  .el-table .positive-row {
    background: #e2f0e4;
  }

  .upsort,
  .downsort {
    cursor: pointer;
    display: inline-block;
    width: 14px;
    line-height: 39px;
    position: relative;
    &:hover {
      color: #2d8ac7;
    }
  }

  .upsort {
    top: -6px;
  }

  .downsort {
    top: 6px;
  }

  .hh {
    word-wrap: break-word
  }
  .font-n{
    font-style: normal;
  }
  .text-justift {
    text-align: justify;
  }
  .suotxt {
    text-decoration: none;
    list-style: none;
  }
  .crfff.green{
    color: green;
  }
  .crfff.red{
    color: red;
  }
</style>
