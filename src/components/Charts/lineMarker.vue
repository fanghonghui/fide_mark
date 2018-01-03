<template>
  <el-row class="brccc">
    <el-col :span="24" class="brdccc">
      <div class="chart-title bgf2 pd10" >
        <h4 class="f16 cr6 " @click="onHandle">
          最近{{timeRange.register}}天运营概况
          <small class="f12">
            日均注册数：{{average.register}},
            日均申请数（全系统）：{{average.allApply}}
          </small>
        </h4>
      </div>
    </el-col>
    <el-col :span="24" >
      <div :class="className" :id="id" style="height: 500px;width: 100%;"></div>
    </el-col>
  </el-row>
</template>

<script>
import echarts from 'echarts'
import { http } from '@/utils/httpHelper'
export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    chartData:{
      type: Object,
      default:function () {
        return {}
      }
    }
  },
  watch: {
    chartData: function () {
      this.init();
      this.initChart();
    }
  },
  data() {
    return {
      chart: null,
      timeRange:{
        register:30,
      },
      average:{
        register:0,
        allApply:0,
        localApply:0
      }

    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose();
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id));
      let dataX,dataOne,dataTwo;
      dataX  =   this.chartData.register.list.map(function (e) {return e.time;});
      dataOne =  this.chartData.register.list.map(function (e) {return e.count;});
      dataTwo =  this.chartData.allApply.list.map(function (e) {return e.count;});
      this.chart.setOption({
        backgroundColor: '#fff',
        title: {
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#F1F1F3'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        legend: {
          icon: 'rect',
          itemWidth: 20,
          itemHeight: 10,
          itemGap: 13,
          data: ['注册数', '申请数（全系统）'],
          right: '10%',
          top: '5%',
          textStyle: {
            fontSize: 12,
            color: '#F1F1F3'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: [{
          type: 'category',
          axisLabel :{
            interval:0,
            rotate:40
          },
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },//data.register.list.map(function (e) {return e.time;})
          data: dataX
        }],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [{
          name: '注册数',
          type: 'line',
          itemStyle: {
            normal: {
              color: 'rgb(204, 153, 0)',
              borderColor: 'rgba(204, 153, 0,0.27)',
              borderWidth: 12

            }
          },//data.register.list.map(function (e) {return e.count;})
          data: dataOne
        },{
          name: '申请数（全系统）',
          type: 'line',
          itemStyle: {
            normal: {
              color: 'rgb(137,189,2)',
              borderColor: 'rgba(137,189,2,0.27)',
              borderWidth: 12

            }
          },//data.allApply.list.map(function (e) {return e.count;})
          data:dataTwo
        }
        ]
      })
    },
    onHandle(){
        this.$emit('on-ok');
    },
    init(){
        this.getData();
    },
    getData(){
      if(!this.chartData) return false;
      if(!!this.chartData.register){
        this.timeRange.register = this.chartData.register.timeRange;
        this.average.register = this.chartData.register.average;
      }
      if(!!this.chartData.allApply){
        this.average.allApply = this.chartData.allApply.average;
      }
    }
  },
  mounted() {

  }
}
</script>
