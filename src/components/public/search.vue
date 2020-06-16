<template>
  <div class="searchBox">
    <el-form>
      <el-date-picker
        v-model="dateTime"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="dataTimeChange"
        align="right">
      </el-date-picker>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'search',
  data () {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近2小时',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 2);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近8小时',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 8);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近24小时',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }],
        disabledDate (time) {
          return time.getTime() > Date.now() || time.getTime() < new Date(new Date().getTime() - 3600 * 1000 * 24 * 30); // 只能选择最近1个月的日期
        }
      },
      dateTime: []
    }
  },
  mounted () {
    this.initData();
  },
  methods: {
    renderChart (dateTime) {
      console.log(new Date() + '+1');
      localStorage.setItem('dateTime', JSON.stringify(dateTime));
      for (let key in this.$parent.$refs) {
        this.$parent.$refs[key].initData();
      }
    },
    initData () {
      this.dateTime = [new Date(new Date().getTime() - 3600 * 1000 * 8), new Date()]; // 默认展示最近8小时
      this.renderChart(this.dateTime);
    },
    dataTimeChange () {
      this.renderChart(this.dateTime);
    }
  }
}
</script>

<style scoped>

</style>
