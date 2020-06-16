<template>
  <div class="rightContent">
    <search></search>
    <div class="chartContent">
      <myChart v-if="dataKey" :dataKey="dataKey" class="myChart" ref="myChart"></myChart>
      <el-button @click="back" style="margin-left: 30px;">返回</el-button>
    </div>
  </div>
</template>

<script>
import search from '../public/search'
import myChart from '../child/myChart'
export default {
  name: 'child',
  data () {
    return {
      dataKey: ''
    }
  },
  mounted () {
    this.dataKey = this.$route.params.dataKey;
  },
  methods: {
    back () {
      this.$router.back();
    }
  },
  components: {myChart, search}
}
</script>

<style scoped>
</style>
