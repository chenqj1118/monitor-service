<template>
  <ve-line :data="data" :settings="chartSetting" :data-zoom="dataZoom" :toolbox="toolbox" :colors="colors" :data-empty="dataEmpty" :loading="loading" :title="title"></ve-line>
</template>

<script>
export default {
  name: 'myLine',
  props: ['data', 'chartTitle', 'dataEmpty', 'loading', 'isNowChart'],
  data () {
    this.title = {text: this.chartTitle + (this.$route.params.serverName ? ('-' + this.$route.params.serverName) : '') + (this.isNowChart ? '-实时监控' : '')}
    this.colors = ['#c23531', '#2f4554', '#61a0a8',
      '#d48265', '#91c7ae', '#749f83',
      '#ca8622', '#bda29a', '#6e7074',
      '#546570', '#c4ccd3']
    this.chartSetting = {
      xAxisType: 'time',
      labelMap: {
        'doc_count': 'err_count'
      }
    }
    this.dataZoom = this.isNowChart ? [] : [
      {
        type: 'slider',
        start: 80,
        end: 100
      }
    ]
    this.toolbox = {
      feature: {
        magicType: {type: ['line', 'bar', 'funnel']},
        saveAsImage: {}
      }
    }
    return {}
  },
  mounted () {},
  methods: {}
}
</script>

<style scoped>

</style>
