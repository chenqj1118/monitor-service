<template>
  <div class="rightContent">
    <search></search>
    <div class="chartContent">
      <el-row :gutter="30">
        <el-col :span="12">
          <myChart dataKey="group-1-1" class="myChart" ref="myChart1"></myChart>
        </el-col>
        <el-col :span="12">
          <myChart dataKey="group-1-2" class="myChart" ref="myChart2"></myChart>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="12">
          <myChart dataKey="group-4-1" class="myChart" ref="myChart3"></myChart>
        </el-col>
        <el-col :span="12">
          <myChart dataKey="group-1-1" class="myChart" :isNowChart="true"></myChart>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import search from '../public/search'
import myChart from '../child/myChart'

export default {
  name: 'index',
  components: {myChart, search}
}
</script>

<style scoped>

</style>
