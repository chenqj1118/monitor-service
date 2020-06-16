<template>
  <ve-pie :data="data" :settings="chartSetting" :toolbox="toolbox" :colors="colors" :data-empty="dataEmpty" :loading="loading" :title="title" :events="chartEvents"></ve-pie>
</template>

<script>
export default {
  name: 'myPie',
  props: ['data', 'chartTitle', 'dataEmpty', 'loading', 'isChild', 'dataKey'],
  data () {
    this.title = {text: this.chartTitle + (this.$route.params.serverName ? ('-' + this.$route.params.serverName) : '')}
    this.colors = ['#c23531', '#2f4554', '#61a0a8',
      '#d48265', '#91c7ae', '#749f83',
      '#ca8622', '#bda29a', '#6e7074',
      '#546570', '#c4ccd3']
    this.chartSetting = {
      limitShowNum: 5
    }
    this.toolbox = {
      feature: {
        magicType: {type: ['funnel']},
        saveAsImage: {}
      }
    }
    let _this = this;
    this.chartEvents = {
      click: function (e) {
        _this.name = e.name
        console.log(e);
        if (!_this.isChild) {
          let rootDataKey = _this.dataKey.slice(0, _this.dataKey.length - 1);
          let currentNum = parseInt(_this.dataKey.slice(_this.dataKey.length - 1, _this.dataKey.length));
          _this.$router.push('/child/' + e.name + '/' + rootDataKey + (currentNum + 1));
        }
      }
    }
    return {
      name: ''
    }
  },
  mounted () {},
  methods: {}
}
</script>

<style scoped>

</style>
