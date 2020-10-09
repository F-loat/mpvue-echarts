<template>
  <div class="container">
    <div class="wrap">
      <mpvue-echarts :echarts="echarts" :onInit="onInit" />
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts/dist/echarts.min'
import mpvueEcharts from 'mpvue-echarts'

function initChart (canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  })
  canvas.setChart(chart)

  var option = {
    backgroundColor: '#ffffff',
    color: ['#37A2DA', '#32C5E9', '#67E0E3'],
    series: [{
      name: '业务指标1',
      type: 'gauge',
      detail: {
        formatter: '{value}%'
      },
      axisLine: {
        show: true,
        lineStyle: {
          width: 30,
          shadowBlur: 0,
          color: [
            [0.3, '#67e0e3'],
            [0.7, '#37a2da'],
            [1, '#fd666d']
          ]
        }
      },
      data: [{
        value: 40,
        name: '完成率'
      }]

    }]
  }

  chart.setOption(option, true)
  return chart
}

export default {
  data () {
    return {
      echarts,
      onInit: initChart
    }
  },

  components: {
    mpvueEcharts
  },

  onShareAppMessage () {}
}
</script>

<style scoped>
.wrap {
  width: 100%;
  height: 300px;
}
</style>
