<template>
  <div>
    <p class="chartBtns"><el-button type="text" v-for="(item, i) in myChartData.columns" v-if="myChartData.columns.length > 2 && i!== 0" :key="i" @click="enter2child(item)">{{item}}</el-button></p>
    <chartLine v-if="queryTpl[dataKey]['default-type'] === 'line'" :data="myChartData"
               :chartTitle="queryTpl[dataKey].title" :dataEmpty="dataEmpty" :loading="loading" :dataKey="dataKey" :isNowChart="isNowChart"></chartLine>
    <chartPie v-if="queryTpl[dataKey]['default-type'] === 'pie'" :data="myChartData"
              :chartTitle="queryTpl[dataKey].title" :dataEmpty="dataEmpty" :loading="loading"
              :isChild="isChild" :dataKey="dataKey"></chartPie>
    <div>{{myChartData}}</div>
  </div>
</template>

<script>
import chartLine from './charts/myLine'
import chartPie from './charts/myPie'
const common = require('../../script/common.js');
const queryTpl = require('../../script/es-query-tpl');
export default {
  name: 'myChart',
  props: ['dataKey', 'isNowChart'],
  data () {
    return {
      myChartData: {
        columns: [],
        rows: []
      },
      dataEmpty: true,
      loading: true,
      chartType: '',
      queryTpl: queryTpl,
      isChild: false
    }
  },
  components: {chartLine, chartPie},
  mounted () {
    this.initData();
  },
  methods: {
    initData () {
      let _this = this;
      this.chartType = queryTpl[this.dataKey]['default-type'];
      let doFun = (data, searchParams) => {
        let mydata = [];
        if (!data.aggregations) {
          if (data.responses[0].aggregations[2]) {
            mydata = data.responses[0].aggregations[2].buckets;
          } else {
            _this.isChild = true;
            mydata = data.responses[0].aggregations[3].buckets[0][2].buckets;
          }
        } else {
          mydata = data.aggregations[2].buckets;
        }
        _this.myChartData.rows = common.getChartRows(mydata, searchParams);
        _this.myChartData.columns = common.getChartColumns(mydata);
        _this.loading = false;
        if (_this.myChartData.rows.length) {
          _this.dataEmpty = false;
        }
      }
      if (this.isNowChart) { // 是否是实时图表 最近两分钟  每5秒刷新一次
        common.doIntervalQuery(this.dataKey, (data, searchParams) => {
          doFun(data, searchParams);
          _this.$forceUpdate();
        });
      } else {
        common.doQuery(this.dataKey, (data, searchParams) => {
          doFun(data, searchParams);
          _this.$forceUpdate();
        });
      }
    },
    enter2child (name) {
      let rootDataKey = this.dataKey.slice(0, this.dataKey.length - 1);
      let currentNum = parseInt(this.dataKey.slice(this.dataKey.length - 1, this.dataKey.length));
      this.$router.push('/child/' + name + '/' + rootDataKey + (currentNum + 1));
    }
  }
}
</script>

<style scoped>

</style>
